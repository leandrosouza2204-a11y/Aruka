import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const viewports = [
  { name: "320", width: 320, height: 800, mobile: true },
  { name: "360", width: 360, height: 800, mobile: true },
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "412", width: 412, height: 915, mobile: true },
  { name: "430", width: 430, height: 932, mobile: true },
  { name: "paisagem-800x360", width: 800, height: 360, mobile: true },
  { name: "paisagem-844x390", width: 844, height: 390, mobile: true },
  { name: "paisagem-915x412", width: 915, height: 412, mobile: true },
  { name: "desktop-1024", width: 1024, height: 768, mobile: false },
  { name: "desktop-1366", width: 1366, height: 768, mobile: false },
  { name: "desktop-1440", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/alunos";
const screenshotDir = join("tmp-responsive-screenshots", "aluno-actions-mobile");
const tolerance = 1;

validateQaCredentials();

async function getWebSocketUrl() {
  const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const versionResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!versionResponse.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  const version = await versionResponse.json();
  return version.webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Erro ao avaliar expressao.");
  }
  return result.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return true;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function loginIfNeeded(client) {
  const state = await authState(client);
  if (!state.path.includes("/login") && !state.hasLoginForm) return "reused";
  const filled = await evaluate(
    client,
    `(() => {
      const email = document.querySelector('input[type="email"], input[name="email"], #email, [aria-label="Email"], [aria-label="E-mail"]');
      const password = document.querySelector('input[type="password"], input[name="password"], #password, [aria-label="Senha"]');
      if (!email || !password) return false;
      const setValue = (input, value) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
      setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});
      return true;
    })()`
  );
  if (!filled) throw new Error("Falha no login QA: campos nao encontrados.");
  await clickText(client, "Entrar", 'button[type="submit"], button');
  await sleep(5500);
  const after = await authState(client);
  if (after.path.includes("/login") || after.hasLoginForm) throw new Error(`Falha no login QA. Rota atual: ${after.path}.`);
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(1200);
  return "logged-in";
}

function authState(client) {
  return evaluate(client, `(() => ({ path: window.location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function openAlunos(client) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) {
    await loginIfNeeded(client);
  }
  try {
    await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"], .alunos-page')");
  } catch (error) {
    const debug = await evaluate(
      client,
      `(() => ({
        path: window.location.pathname,
        title: document.title,
        hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
        bodyText: document.body.textContent.trim().slice(0, 180)
      }))()`
    );
    throw new Error(`Pagina Alunos nao renderizou. Estado: ${JSON.stringify(debug)}`);
  }
  await waitFor(
    client,
    `(() => {
      const hasItems = document.querySelector('[data-testid="aluno-mobile-card"], .aluno-mobile-card, .desktop-table tbody tr');
      const hasEmpty = document.body.textContent.includes('Nenhum aluno encontrado');
      const hasError = Boolean(document.querySelector('.app-error'));
      return (hasItems || hasEmpty || hasError) && !document.body.textContent.includes('Carregando alunos');
    })()`,
    25000
  );
  await sleep(900);
}

async function clickText(client, text, selector = "button") {
  return evaluate(
    client,
    `(() => {
      const item = [...document.querySelectorAll(${JSON.stringify(selector)})]
        .find((element) => element.textContent.trim().includes(${JSON.stringify(text)}));
      if (!item) return false;
      item.click();
      return true;
    })()`
  );
}

async function openMenu(client, position) {
  const target = await evaluate(
    client,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].filter(visible);
      const rows = [...document.querySelectorAll('.desktop-table tbody tr')].filter(visible);
      const sources = cards.length > 0 ? cards : rows;
      const source = ${JSON.stringify(position)} === 'last' ? sources.at(-1) : sources[0];
      const trigger = source?.querySelector('[data-testid="aluno-actions-trigger"], .table-actions-trigger');
      trigger?.scrollIntoView({ block: ${JSON.stringify(position === "last" ? "end" : "center")}, inline: 'nearest' });
      if (trigger) trigger.setAttribute('data-qa-menu-target', ${JSON.stringify(position)});
      return { found: Boolean(trigger), cards: cards.length, rows: rows.length };
    })()`
  );
  if (!target.found) throw new Error(`Menu ${position} indisponivel. Cards: ${target.cards}; linhas: ${target.rows}.`);
  await sleep(350);
  const clicked = await evaluate(
    client,
    `(() => {
      const trigger = document.querySelector('[data-qa-menu-target="${position}"]');
      trigger?.click();
      trigger?.removeAttribute('data-qa-menu-target');
      return Boolean(trigger);
    })()`
  );
  if (!clicked) throw new Error(`Menu ${position} nao recebeu clique apos rolagem.`);
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-actions-menu\"], [role=\"menu\"]')");
  await sleep(250);
}

function measure(client, name, phase) {
  return evaluate(
    client,
    `(() => {
      const root = document.documentElement;
      const body = document.body;
      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const rectData = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          left: Math.round(rect.left * 100) / 100,
          right: Math.round(rect.right * 100) / 100,
          top: Math.round(rect.top * 100) / 100,
          bottom: Math.round(rect.bottom * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
          insideHorizontal: rect.left >= -${tolerance} && rect.right <= window.innerWidth + ${tolerance},
          insideVertical: rect.top >= -${tolerance} && rect.bottom <= window.innerHeight + ${tolerance}
        };
      };
      const menu = document.querySelector('[data-testid="aluno-actions-menu"], [role="menu"]');
      const card = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].find(visible);
      const details = [...document.querySelectorAll('[data-testid="aluno-details"], .aluno-details')].find(visible);
      const dialog = [...document.querySelectorAll('[data-testid="aluno-form-modal"], [data-testid="aluno-confirmation-dialog"], .accessible-modal, .aluno-form-modal')].find(visible);
      const page = document.querySelector('[data-testid="alunos-page"], .alunos-page, main');
      const viewportWidth = root.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            id: element.id || '',
            width: Math.round(rect.width * 100) / 100,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100
          };
        })
        .filter(({ left, right, width }) => left < -1 || right > viewportWidth + 1 || width > viewportWidth + 1)
        .slice(0, 10);
      return {
        name: ${JSON.stringify(name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, deltaWidth: root.scrollWidth - root.clientWidth },
        body: { clientWidth: body.clientWidth, scrollWidth: body.scrollWidth, deltaWidth: body.scrollWidth - body.clientWidth },
        page: page ? { clientWidth: page.clientWidth, scrollWidth: page.scrollWidth, deltaWidth: page.scrollWidth - page.clientWidth } : null,
        card: card ? { clientWidth: card.clientWidth, scrollWidth: card.scrollWidth, deltaWidth: card.scrollWidth - card.clientWidth } : null,
        details: details ? { clientWidth: details.clientWidth, scrollWidth: details.scrollWidth, deltaWidth: details.scrollWidth - details.clientWidth } : null,
        dialog: dialog ? { clientWidth: dialog.clientWidth, scrollWidth: dialog.scrollWidth, deltaWidth: dialog.scrollWidth - dialog.clientWidth } : null,
        menu: rectData(menu),
        openMenus: document.querySelectorAll('[data-testid="aluno-actions-menu"], [role="menu"]').length,
        bodyOverflow: getComputedStyle(body).overflow,
        trigger: rectData(document.querySelector('[aria-expanded="true"]')),
        overflowing
      };
    })()`
  );
}

function validate(item, requireMenu = false) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document.deltaWidth],
    ["body", item.body.deltaWidth],
    ["page", item.page?.deltaWidth],
    ["card", item.card?.deltaWidth],
    ["details", item.details?.deltaWidth],
    ["dialog", item.dialog?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (requireMenu) {
    if (!item.menu) failures.push("menu ausente");
    if (item.menu && !item.menu.insideHorizontal) failures.push("menu excede horizontalmente");
    if (item.menu && !item.menu.insideVertical) failures.push("menu excede verticalmente");
    if (item.openMenus !== 1) failures.push(`menus abertos: ${item.openMenus}`);
  }
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  item.failures = failures;
  return item;
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

async function closeMenus(client) {
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await sleep(250);
}

async function runViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await openAlunos(client);
  const results = [];

  await openMenu(client, "first");
  results.push(validate(await measure(client, viewport.name, "menu-primeiro"), true));
  await maybeCapture(client, screenshotName(viewport, "menu-primeiro"));
  await closeMenus(client);

  await openMenu(client, "last");
  results.push(validate(await measure(client, viewport.name, "menu-ultimo"), true));
  await maybeCapture(client, screenshotName(viewport, "menu-ultimo"));
  await closeMenus(client);

  if (["320", "390"].includes(viewport.name)) {
    await testDetailsEditAndDelete(client, viewport, results);
  }

  if (viewport.name === "390") {
    results.push(await inspectUnavailableActions(client, viewport.name));
  }

  if (viewport.name === "desktop-1366") {
    await testDesktopEditAndDelete(client, viewport, results);
  }

  return results;
}

async function testDetailsEditAndDelete(client, viewport, results) {
  await clickText(client, "Detalhes", '[data-testid="aluno-action-details"], button');
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-details\"]')");
  results.push(validate(await measure(client, viewport.name, "detalhes")));
  await captureScreenshot(client, screenshotName(viewport, "detalhes"));

  await clickText(client, "Editar aluno", '[data-testid="aluno-details-edit"], button');
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
  results.push(validate(await measure(client, viewport.name, "edicao")));
  await captureScreenshot(client, screenshotName(viewport, "edicao"));
  await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");

  await openMenu(client, "first");
  await clickText(client, "Excluir", '[data-testid="aluno-action-delete"], [role="menuitem"], button');
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
  results.push(validate(await measure(client, viewport.name, "confirmacao-excluir")));
  await captureScreenshot(client, screenshotName(viewport, "confirmacao-excluir"));
  await clickText(client, "Cancelar", '[data-testid="aluno-confirmation-cancel"], button');
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
}

async function testDesktopEditAndDelete(client, viewport, results) {
  await openAlunos(client);
  await openMenu(client, "first");
  await clickText(client, "Editar", '[data-testid="aluno-action-edit"], [role="menuitem"], button');
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
  results.push(validate(await measure(client, viewport.name, "desktop-edicao")));
  await captureScreenshot(client, "actions-desktop-1366.png");
  await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");

  await openMenu(client, "first");
  await clickText(client, "Excluir", '[data-testid="aluno-action-delete"], [role="menuitem"], button');
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
  results.push(validate(await measure(client, viewport.name, "desktop-confirmacao-excluir")));
  await clickText(client, "Cancelar", '[data-testid="aluno-confirmation-cancel"], button');
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
}

async function inspectUnavailableActions(client, name) {
  const info = await evaluate(
    client,
    `(() => ({
      treinos: Boolean(document.querySelector('[data-testid="aluno-action-treinos"]')),
      avaliacoes: Boolean(document.querySelector('[data-testid="aluno-action-avaliacoes"]')),
      financeiro: Boolean(document.querySelector('[data-testid="aluno-action-financeiro"], [data-testid="aluno-action-historico"], [data-testid="aluno-action-renovar"]')),
      inativar: Boolean(document.querySelector('[data-testid="aluno-action-inativar"]')),
      reativar: Boolean(document.querySelector('[data-testid="aluno-action-reativar"]')),
      whatsappButtons: [...document.querySelectorAll('[data-testid="aluno-action-whatsapp"]')].map((button) => ({
        disabled: button.disabled,
        title: button.title || '',
        text: button.textContent.trim()
      })).slice(0, 3)
    }))()`
  );
  return {
    name,
    phase: "acoes-indisponiveis",
    viewport: { width: 390, height: 844 },
    unavailable: info,
    failures: [],
  };
}

function screenshotName(viewport, phase) {
  if (viewport.name === "paisagem-844x390") return "actions-paisagem-844x390.png";
  if (viewport.name.startsWith("paisagem") || viewport.name.startsWith("desktop")) return null;
  return `actions-${viewport.name}-${phase}.png`;
}

async function maybeCapture(client, filename) {
  if (filename) await captureScreenshot(client, filename);
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await client.send("Page.navigate", { url: "http://127.0.0.1:5173/login" });
    await waitFor(client, "document.readyState === 'complete'");
    await sleep(1500);
    const auth = await loginIfNeeded(client);
    console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");

    const results = [];
    for (const viewport of viewports) {
      const viewportResults = await runViewport(client, viewport);
      results.push(...viewportResults);
      if (viewport.name === "paisagem-844x390") {
        await maybeCapture(client, screenshotName(viewport, "menu-ultimo"));
      }
    }

    const summary = results.map((item) => ({
      name: item.name,
      phase: item.phase,
      viewport: item.viewport ? `${item.viewport.width}x${item.viewport.height}` : null,
      document: item.document ? `${item.document.clientWidth}/${item.document.scrollWidth}` : null,
      body: item.body ? `${item.body.clientWidth}/${item.body.scrollWidth}` : null,
      page: item.page ? `${item.page.clientWidth}/${item.page.scrollWidth}` : null,
      card: item.card ? `${item.card.clientWidth}/${item.card.scrollWidth}` : null,
      details: item.details ? `${item.details.clientWidth}/${item.details.scrollWidth}` : null,
      dialog: item.dialog ? `${item.dialog.clientWidth}/${item.dialog.scrollWidth}` : null,
      menu: item.menu,
      unavailable: item.unavailable,
      status: item.failures.length === 0 ? "ok" : "falhou",
      failures: item.failures,
    }));
    console.log(JSON.stringify({ authenticated: true, summary }, null, 2));
    const failed = results.filter((item) => item.failures.length > 0);
    if (failed.length > 0) {
      console.error(JSON.stringify({ failed: summary.filter((item) => item.status === "falhou") }, null, 2));
      process.exitCode = 1;
    }
  } finally {
    client.close();
  }
}

function validateQaCredentials() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    console.error("Credenciais QA ausentes. Configure QA_USER_EMAIL e QA_USER_PASSWORD em .env.qa.local.");
    process.exit(2);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
