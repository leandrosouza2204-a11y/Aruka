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
  { name: "tablet-768x1024", width: 768, height: 1024, mobile: true },
  { name: "tablet-820x1180", width: 820, height: 1180, mobile: true },
  { name: "desktop-1024", width: 1024, height: 768, mobile: false },
  { name: "desktop-1366", width: 1366, height: 768, mobile: false },
  { name: "desktop-1440", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/treinos";
const screenshotDir = join("tmp-responsive-screenshots", "treinos-mobile");
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

async function openTreinos(client) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) await loginIfNeeded(client);
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"], .treinos-page')", 25000);
  await waitFor(
    client,
    `(() => {
      const hasItems = document.querySelector('[data-testid="treino-mobile-card"], .treino-library-card');
      const hasEmpty = document.querySelector('[data-testid="treinos-empty-state"], .app-empty-state');
      const hasError = Boolean(document.querySelector('.app-error'));
      return (hasItems || hasEmpty || hasError) && !document.body.textContent.includes('Carregando treinos');
    })()`,
    30000
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
      const cards = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')].filter(visible);
      const source = ${JSON.stringify(position)} === 'last' ? cards.at(-1) : cards[0];
      const trigger = source?.querySelector('[data-testid="treino-actions-trigger"], .table-actions-trigger');
      trigger?.scrollIntoView({ block: ${JSON.stringify(position === "last" ? "end" : "center")}, inline: 'nearest' });
      if (trigger) trigger.setAttribute('data-qa-menu-target', ${JSON.stringify(position)});
      return { found: Boolean(trigger), cards: cards.length };
    })()`
  );
  if (!target.found) throw new Error(`Menu ${position} indisponivel. Cards: ${target.cards}.`);
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
  await waitFor(client, "document.querySelector('[data-testid=\"treino-actions-menu\"], [role=\"menu\"]')");
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
      const compact = (element) => {
        if (!element) return null;
        return {
          clientWidth: element.clientWidth,
          scrollWidth: element.scrollWidth,
          deltaWidth: element.scrollWidth - element.clientWidth
        };
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
      const menu = document.querySelector('[data-testid="treino-actions-menu"], [role="menu"]');
      const page = document.querySelector('[data-testid="treinos-page"], .treinos-page, main');
      const card = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')].find(visible);
      const details = [...document.querySelectorAll('.treino-detalhes-card, .treino-close-button')].find((element) => {
        const host = element.closest('section, article, div') || element;
        return visible(host);
      });
      const dialog = [...document.querySelectorAll('[data-testid="treino-confirmation-dialog"], .accessible-modal')].find(visible);
      const viewportWidth = root.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            id: element.id || '',
            width: Math.round(rect.width * 100) / 100,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflowX: style.overflowX,
            position: style.position,
            whiteSpace: style.whiteSpace
          };
        })
        .filter(({ left, right, width }) => left < -1 || right > viewportWidth + 1 || width > viewportWidth + 1)
        .slice(0, 12);
      return {
        name: ${JSON.stringify(name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: compact(root),
        body: compact(body),
        page: compact(page),
        card: compact(card),
        details: compact(details),
        dialog: compact(dialog),
        menu: rectData(menu),
        openMenus: document.querySelectorAll('[data-testid="treino-actions-menu"], [role="menu"]').length,
        cardCount: document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card').length,
        hasEmptyState: Boolean(document.querySelector('[data-testid="treinos-empty-state"], .app-empty-state')),
        hasSearch: Boolean(document.querySelector('[data-testid="treinos-search"]')),
        bodyOverflow: getComputedStyle(body).overflow,
        overflowing
      };
    })()`
  );
}

function validate(item, options = {}) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document?.deltaWidth],
    ["body", item.body?.deltaWidth],
    ["page", item.page?.deltaWidth],
    ["card", item.card?.deltaWidth],
    ["details", item.details?.deltaWidth],
    ["dialog", item.dialog?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (options.requireMenu) {
    if (!item.menu) failures.push("menu ausente");
    if (item.menu && !item.menu.insideHorizontal) failures.push("menu excede horizontalmente");
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
  await openTreinos(client);
  const results = [];

  results.push(validate(await measure(client, viewport.name, "inicio")));
  await maybeCapture(client, screenshotName(viewport, "inicio"));

  if (["320", "390"].includes(viewport.name)) {
    await openMenu(client, "first");
    results.push(validate(await measure(client, viewport.name, "menu-primeiro"), { requireMenu: true }));
    await captureScreenshot(client, screenshotName(viewport, "menu-primeiro"));
    await closeMenus(client);

    await openMenu(client, "last");
    results.push(validate(await measure(client, viewport.name, "menu-ultimo"), { requireMenu: true }));
    await captureScreenshot(client, screenshotName(viewport, "menu-ultimo"));
    await closeMenus(client);
  }

  if (viewport.name === "390") {
    await testSearchFilterDetailsAndConfirmation(client, results);
  }

  await evaluate(client, "window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })");
  await sleep(500);
  results.push(validate(await measure(client, viewport.name, "final")));
  await maybeCapture(client, screenshotName(viewport, "final"));

  return results;
}

async function testSearchFilterDetailsAndConfirmation(client, results) {
  const searchResult = await evaluate(
    client,
    `(() => {
      const input = document.querySelector('[data-testid="treinos-search"]');
      if (!input) return { available: false };
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'zzzz-sem-resultado-ciclo-61');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return { available: true };
    })()`
  );
  if (searchResult.available) {
    await sleep(700);
    results.push(validate(await measure(client, "390", "busca-sem-resultado")));
    await captureScreenshot(client, "treinos-busca-sem-resultado-390.png");
    await clickText(client, "Limpar", '[data-testid="treinos-clear-filters"], button');
    await sleep(700);
  }

  const filterResult = await evaluate(
    client,
    `(() => {
      const select = document.querySelector('[data-testid="treinos-filter-status"]');
      if (!select || select.options.length < 2) return { available: false };
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return { available: true, value: select.value };
    })()`
  );
  if (filterResult.available) {
    await sleep(700);
    results.push(validate(await measure(client, "390", "filtro-status")));
    await clickText(client, "Limpar", '[data-testid="treinos-clear-filters"], button');
    await sleep(700);
  }

  const opened = await evaluate(
    client,
    `(() => {
      const button = [...document.querySelectorAll('[data-testid="treino-open"], button')]
        .find((element) => element.textContent.trim().includes('Visualizar'));
      button?.scrollIntoView({ block: 'center', inline: 'nearest' });
      button?.click();
      return Boolean(button);
    })()`
  );
  if (opened) {
    await waitFor(client, "document.querySelector('.treino-close-button')");
    await sleep(600);
    results.push(validate(await measure(client, "390", "detalhes")));
    await clickText(client, "Fechar", ".treino-close-button, button");
    await sleep(500);
  }

  await openMenu(client, "first");
  const deleteClicked = await clickText(client, "Excluir", '[data-testid="treino-action-delete"], [role="menuitem"], button');
  if (deleteClicked) {
    await waitFor(client, "document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
    await sleep(350);
    results.push(validate(await measure(client, "390", "confirmacao-excluir")));
    await captureScreenshot(client, "treinos-confirmacao-excluir-390.png");
    await clickText(client, "Cancelar", '[data-testid="treino-confirmation-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
  }
}

function screenshotName(viewport, phase) {
  const names = {
    "320:inicio": "treinos-320-inicio.png",
    "320:final": "treinos-320-final.png",
    "320:menu-primeiro": "treinos-320-menu-primeiro.png",
    "320:menu-ultimo": "treinos-320-menu-ultimo.png",
    "360:inicio": "treinos-360-inicio.png",
    "360:final": "treinos-360-final.png",
    "375:inicio": "treinos-375-inicio.png",
    "375:final": "treinos-375-final.png",
    "390:inicio": "treinos-390-inicio.png",
    "390:final": "treinos-390-final.png",
    "390:menu-primeiro": "treinos-390-menu-primeiro.png",
    "390:menu-ultimo": "treinos-390-menu-ultimo.png",
    "412:inicio": "treinos-412-inicio.png",
    "412:final": "treinos-412-final.png",
    "430:inicio": "treinos-430-inicio.png",
    "430:final": "treinos-430-final.png",
    "paisagem-844x390:inicio": "treinos-paisagem-844x390.png",
    "tablet-768x1024:inicio": "treinos-tablet-768x1024.png",
    "tablet-820x1180:inicio": "treinos-tablet-820x1180.png",
    "desktop-1024:inicio": "treinos-desktop-1024.png",
    "desktop-1366:inicio": "treinos-desktop-1366.png",
    "desktop-1440:inicio": "treinos-desktop-1440.png",
  };
  return names[`${viewport.name}:${phase}`] || null;
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
      results.push(...(await runViewport(client, viewport)));
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
      cardCount: item.cardCount,
      hasEmptyState: item.hasEmptyState,
      status: item.failures.length === 0 ? "ok" : "falhou",
      failures: item.failures,
      overflowing: item.overflowing,
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
