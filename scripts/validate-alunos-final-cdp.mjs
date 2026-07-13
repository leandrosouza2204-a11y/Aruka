import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const scenarios = [
  { name: "final-320", width: 320, height: 800, mobile: true, screenshots: true },
  { name: "final-390", width: 390, height: 844, mobile: true, screenshots: true },
  { name: "final-430", width: 430, height: 932, mobile: true, screenshots: true },
  { name: "final-paisagem-844x390", width: 844, height: 390, mobile: true, screenshots: true },
  { name: "final-tablet-768x1024", width: 768, height: 1024, mobile: true, screenshots: true },
  { name: "final-tablet-820x1180", width: 820, height: 1180, mobile: true, screenshots: true },
  { name: "final-desktop-1024", width: 1024, height: 768, mobile: false, screenshots: true },
  { name: "final-desktop-1366", width: 1366, height: 768, mobile: false, screenshots: true },
  { name: "final-desktop-1440", width: 1440, height: 900, mobile: false, screenshots: true },
  { name: "final-zoom-125", width: 390, height: 844, mobile: true, scale: 1.25 },
  { name: "final-zoom-150", width: 390, height: 844, mobile: true, scale: 1.5, screenshots: true },
  { name: "final-zoom-200", width: 390, height: 844, mobile: true, scale: 2, screenshots: true },
];

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/alunos";
const screenshotDir = join("tmp-responsive-screenshots", "alunos-final");
const tolerance = 1;

validateQaCredentials();

async function getWebSocketUrl() {
  const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (created.ok) {
    const target = await created.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const version = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!version.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  return (await version.json()).webSocketDebuggerUrl;
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
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
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
  if (state.path.includes("/login") || state.hasLoginForm) await loginIfNeeded(client);
  await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"], .alunos-page')");
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

async function openMenu(client) {
  const found = await evaluate(
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
      const source = cards[0] || rows[0];
      const trigger = source?.querySelector('[data-testid="aluno-actions-trigger"], .table-actions-trigger');
      trigger?.scrollIntoView({ block: 'center', inline: 'nearest' });
      if (trigger) trigger.setAttribute('data-final-menu-target', 'true');
      return Boolean(trigger);
    })()`
  );
  if (!found) throw new Error("Trigger de menu nao encontrado.");
  await sleep(300);
  await evaluate(client, `(() => { const trigger = document.querySelector('[data-final-menu-target="true"]'); trigger?.click(); trigger?.removeAttribute('data-final-menu-target'); return true; })()`);
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-actions-menu\"], [role=\"menu\"]')");
}

async function runScenario(client, scenario) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: scenario.width,
    height: scenario.height,
    deviceScaleFactor: scenario.scale || 1,
    mobile: scenario.mobile,
  });
  await openAlunos(client);
  const results = [];

  results.push(validate(await measure(client, scenario.name, "listagem")));
  await maybeCapture(client, `${scenario.name}-listagem.png`, scenario.screenshots && ["final-320", "final-390"].includes(scenario.name));
  await maybeCapture(client, `${scenario.name}.png`, scenario.screenshots && !["final-320", "final-390", "final-430"].includes(scenario.name));

  if (["final-320", "final-390"].includes(scenario.name)) {
    await clickText(client, "Detalhes", '[data-testid="aluno-action-details"], button');
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-details\"]')");
    results.push(validate(await measure(client, scenario.name, "detalhes")));
    await maybeCapture(client, `${scenario.name}-detalhes.png`, true);
    await clickText(client, "Fechar", '[data-testid="aluno-details-close"], button');
    await sleep(300);

    await evaluate(client, `document.querySelector('[data-testid="aluno-new-button"]')?.click(); true`);
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
    results.push(validate(await measure(client, scenario.name, "cadastro")));
    await maybeCapture(client, `${scenario.name}-cadastro.png`, true);
    await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");

    await openMenu(client);
    results.push(validate(await measure(client, scenario.name, "menu"), true));
    await maybeCapture(client, `${scenario.name}-menu.png`, true);
    await clickText(client, "Editar", '[data-testid="aluno-action-edit"], [role="menuitem"], button');
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
    results.push(validate(await measure(client, scenario.name, "edicao")));
    if (scenario.name === "final-320") await maybeCapture(client, "final-320-edicao.png", true);
    await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");

    await openMenu(client);
    await clickText(client, "Excluir", '[data-testid="aluno-action-delete"], [role="menuitem"], button');
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
    results.push(validate(await measure(client, scenario.name, "confirmacao")));
    if (scenario.name === "final-320") await maybeCapture(client, "final-320-confirmacao.png", true);
    await clickText(client, "Cancelar", '[data-testid="aluno-confirmation-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"aluno-confirmation-dialog\"]')");
  }

  if (scenario.name === "final-430") {
    await evaluate(client, `window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); true`);
    await sleep(400);
    results.push(validate(await measure(client, scenario.name, "final-pagina")));
    await maybeCapture(client, "final-430-final-pagina.png", true);
  }

  if (scenario.name.startsWith("final-zoom")) {
    await clickText(client, "Detalhes", '[data-testid="aluno-action-details"], button');
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-details\"]')");
    await openMenu(client).catch(() => undefined);
    results.push(validate(await measure(client, scenario.name, "zoom-integrado")));
    if (scenario.name === "final-zoom-150") await maybeCapture(client, "final-zoom-150.png", true);
    if (scenario.name === "final-zoom-200") await maybeCapture(client, "final-zoom-200.png", true);
  }

  return results;
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
      const nodeMeasure = (element) => element ? ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        deltaWidth: element.scrollWidth - element.clientWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
        canScrollY: element.scrollHeight > element.clientHeight + 1
      }) : null;
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
      const page = document.querySelector('[data-testid="alunos-page"], .alunos-page, main');
      const card = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].find(visible);
      const details = [...document.querySelectorAll('[data-testid="aluno-details"], .aluno-details')].find(visible);
      const form = [...document.querySelectorAll('[data-testid="aluno-form-modal"], .aluno-form-modal')].find(visible);
      const confirmation = [...document.querySelectorAll('[data-testid="aluno-confirmation-dialog"], .accessible-modal')].find(visible);
      const menu = document.querySelector('[data-testid="aluno-actions-menu"], [role="menu"]');
      const active = document.activeElement;
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
        .slice(0, 12);
      return {
        name: ${JSON.stringify(name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
        document: nodeMeasure(root),
        body: nodeMeasure(body),
        page: nodeMeasure(page),
        card: nodeMeasure(card),
        details: nodeMeasure(details),
        form: nodeMeasure(form),
        confirmation: nodeMeasure(confirmation),
        menu: rectData(menu),
        bottomNav: rectData(document.querySelector('.mobile-bottom-nav')),
        activeElement: active ? { tag: active.tagName, testid: active.getAttribute('data-testid') || '', text: active.textContent.trim().slice(0, 40) } : null,
        overlays: document.querySelectorAll('.accessible-modal-overlay, .aluno-form-overlay').length,
        bodyOverflow: getComputedStyle(body).overflow,
        overflowing
      };
    })()`
  );
}

function validate(item, requireMenu = false) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document?.deltaWidth],
    ["body", item.body?.deltaWidth],
    ["page", item.page?.deltaWidth],
    ["card", item.card?.deltaWidth],
    ["details", item.details?.deltaWidth],
    ["form", item.form?.deltaWidth],
    ["confirmation", item.confirmation?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (requireMenu) {
    if (!item.menu) failures.push("menu ausente");
    if (item.menu && !item.menu.insideHorizontal) failures.push("menu fora horizontalmente");
    if (item.menu && !item.menu.insideVertical) failures.push("menu fora verticalmente");
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

async function maybeCapture(client, filename, enabled) {
  if (enabled) await captureScreenshot(client, filename);
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
    await sleep(1200);
    const auth = await loginIfNeeded(client);
    console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");

    const results = [];
    for (const scenario of scenarios) {
      results.push(...(await runScenario(client, scenario)));
    }

    const summary = results.map((item) => ({
      name: item.name,
      phase: item.phase,
      viewport: `${item.viewport.width}x${item.viewport.height}@${item.viewport.devicePixelRatio}`,
      document: `${item.document.clientWidth}/${item.document.scrollWidth}`,
      body: `${item.body.clientWidth}/${item.body.scrollWidth}`,
      page: item.page ? `${item.page.clientWidth}/${item.page.scrollWidth}` : null,
      card: item.card ? `${item.card.clientWidth}/${item.card.scrollWidth}` : null,
      details: item.details ? `${item.details.clientWidth}/${item.details.scrollWidth}` : null,
      form: item.form ? `${item.form.clientWidth}/${item.form.scrollWidth}` : null,
      confirmation: item.confirmation ? `${item.confirmation.clientWidth}/${item.confirmation.scrollWidth}` : null,
      menu: item.menu,
      overlays: item.overlays,
      bodyOverflow: item.bodyOverflow,
      activeElement: item.activeElement,
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
