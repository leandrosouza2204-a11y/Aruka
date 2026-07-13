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
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const appUrl = "http://127.0.0.1:5173/alunos";
const screenshotDir = join("tmp-responsive-screenshots", "aluno-details-mobile");
const tolerance = 1;

validateQaCredentials();

async function getWebSocketUrl() {
  const targetResponse = await fetch(`${chromeNewTargetUrl}?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const versionResponse = await fetch(chromeVersionUrl);
  if (!versionResponse.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  const version = await versionResponse.json();
  if (!version.webSocketDebuggerUrl) throw new Error("Chrome CDP sem webSocketDebuggerUrl.");
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

async function loginIfNeeded(client) {
  const state = await getAuthState(client);
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
  if (!filled) throw new Error(`Falha no login QA: campos nao encontrados. Rota atual: ${state.path}`);
  if (!(await clickText(client, "Entrar", 'button[type="submit"], button'))) throw new Error("Falha no login QA: botao Entrar nao encontrado.");
  await sleep(5500);
  const after = await getAuthState(client);
  if (after.path.includes("/login") || after.hasLoginForm) throw new Error(`Falha no login QA. Rota atual: ${after.path}.`);
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(1500);
  return "logged-in";
}

async function getAuthState(client) {
  return evaluate(client, `(() => ({ path: window.location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function openDetails(client, position = "first") {
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-mobile-card\"], .aluno-mobile-card, .desktop-table tbody tr')", 20000);
  const result = await evaluate(
    client,
    `(() => {
      const isVisible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].filter(isVisible);
      const rows = [...document.querySelectorAll('.desktop-table tbody tr')].filter(isVisible);
      const sources = cards.length > 0 ? cards : rows;
      const source = ${JSON.stringify(position)} === 'last' ? sources.at(-1) : sources[0];
      const button = source ? [...source.querySelectorAll('button')].find((item) => /Detalhes|Ocultar/i.test(item.textContent)) : null;
      button?.scrollIntoView({ block: 'center', inline: 'nearest' });
      button?.click();
      return {
        opened: Boolean(button),
        visibleCards: cards.length,
        visibleRows: rows.length,
        emptyText: document.body.textContent.includes('Nenhum aluno encontrado'),
        loadingText: document.body.textContent.includes('Carregando alunos')
      };
    })()`
  );
  if (!result.opened) {
    throw new Error(
      `Nao foi possivel abrir detalhes (${position}). Cards visiveis: ${result.visibleCards}; linhas visiveis: ${result.visibleRows}; vazio: ${result.emptyText}; carregando: ${result.loadingText}.`
    );
  }
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-details\"]')");
  await sleep(450);
}

async function ensureStudentsAvailable(client) {
  const state = await evaluate(
    client,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      return {
        totalCards: document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card').length,
        totalRows: document.querySelectorAll('.desktop-table tbody tr').length,
        cards: [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].filter(visible).length,
        rows: [...document.querySelectorAll('.desktop-table tbody tr')].filter(visible).length,
        empty: document.body.textContent.includes('Nenhum aluno encontrado'),
        loading: document.body.textContent.includes('Carregando alunos'),
        error: document.querySelector('.app-error')?.textContent.trim() || ''
      };
    })()`
  );
  if (state.loading) throw new Error("Lista de alunos ainda em carregamento.");
  if (state.error) throw new Error(`Pagina de alunos com erro: ${state.error}`);
  if (state.cards + state.rows === 0) {
    throw new Error(
      `Usuario QA sem alunos visiveis para testar detalhes. Cards DOM/visiveis: ${state.totalCards}/${state.cards}; linhas DOM/visiveis: ${state.totalRows}/${state.rows}; vazio: ${state.empty}.`
    );
  }
}

async function measureDetails(client, viewport, phase) {
  return evaluate(
    client,
    `(() => {
      const root = document.documentElement;
      const body = document.body;
      const isVisible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const page = document.querySelector('[data-testid="alunos-page"], .alunos-page, main');
      const card = [...document.querySelectorAll('[data-testid="aluno-mobile-card"].mobile-list-card-expanded, .aluno-mobile-card.mobile-list-card-expanded')].find(isVisible) || null;
      const details = [...document.querySelectorAll('[data-testid="aluno-details"], .aluno-details')].find(isVisible) || null;
      const actions = details?.querySelector('[data-testid="aluno-details-actions"]');
      const bottomNav = document.querySelector('.mobile-bottom-nav');
      const bottomNavTop = bottomNav?.getBoundingClientRect().top ?? window.innerHeight;
      const relevant = details ? [...details.querySelectorAll('button, a, section, [data-testid], p, dl')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        }) : [];
      const last = relevant.at(-1);
      const lastRect = last?.getBoundingClientRect();
      const viewportWidth = root.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            id: element.id || '',
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflowX: style.overflowX,
            whiteSpace: style.whiteSpace,
            position: style.position
          };
        })
        .filter(({ left, right, width }) => left < -1 || right > viewportWidth + 1 || width > viewportWidth + 1)
        .slice(0, 12);
      return {
        name: ${JSON.stringify(viewport.name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, deltaWidth: root.scrollWidth - root.clientWidth },
        body: { clientWidth: body.clientWidth, scrollWidth: body.scrollWidth, deltaWidth: body.scrollWidth - body.clientWidth },
        page: page ? { clientWidth: page.clientWidth, scrollWidth: page.scrollWidth, deltaWidth: page.scrollWidth - page.clientWidth } : null,
        card: card ? { clientWidth: card.clientWidth, scrollWidth: card.scrollWidth, deltaWidth: card.scrollWidth - card.clientWidth } : null,
        details: details ? {
          clientWidth: details.clientWidth,
          scrollWidth: details.scrollWidth,
          clientHeight: details.clientHeight,
          scrollHeight: details.scrollHeight,
          deltaWidth: details.scrollWidth - details.clientWidth,
          left: Math.round(details.getBoundingClientRect().left),
          right: Math.round(details.getBoundingClientRect().right)
        } : null,
        actions: actions ? { clientWidth: actions.clientWidth, scrollWidth: actions.scrollWidth, deltaWidth: actions.scrollWidth - actions.clientWidth } : null,
        title: details?.querySelector('h2')?.textContent.trim() || '',
        sections: details ? [...details.querySelectorAll('.aluno-details-section h3')].map((item) => item.textContent.trim()) : [],
        lastVisible: lastRect ? lastRect.bottom <= bottomNavTop + 1 && lastRect.top < window.innerHeight : null,
        overflowing
      };
    })()`
  );
}

function validateMeasurement(item) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document.deltaWidth],
    ["body", item.body.deltaWidth],
    ["page", item.page?.deltaWidth],
    ["card", item.card?.deltaWidth],
    ["details", item.details?.deltaWidth],
    ["actions", item.actions?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (!item.details) failures.push("detalhes nao encontrados");
  if (!item.title) failures.push("titulo do aluno ausente");
  if (item.sections.length < 4) failures.push("grupos de detalhes insuficientes");
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  return failures;
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

async function scrollToDetailsEnd(client) {
  await evaluate(
    client,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const details = [...document.querySelectorAll('[data-testid="aluno-details"], .aluno-details')].find(visible);
      details?.scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'instant' });
      const bottomNav = document.querySelector('.mobile-bottom-nav');
      const navHeight = visible(bottomNav) ? bottomNav.getBoundingClientRect().height : 0;
      if (navHeight > 0) window.scrollBy({ top: navHeight + 16, left: 0, behavior: 'instant' });
      return true;
    })()`
  );
  await sleep(350);
}

async function runScenario(client, viewport) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"], .alunos-page')");
  await waitFor(
    client,
    `(() => {
      const hasItems = document.querySelector('[data-testid="aluno-mobile-card"], .aluno-mobile-card, .desktop-table tbody tr');
      const hasEmptyState = document.body.textContent.includes('Nenhum aluno encontrado');
      const hasError = Boolean(document.querySelector('.app-error'));
      return (hasItems || hasEmptyState || hasError) && !document.body.textContent.includes('Carregando alunos');
    })()`,
    25000
  );
  await sleep(1200);
  await ensureStudentsAvailable(client);
  await openDetails(client, "first");
  const initial = await measureDetails(client, viewport, "inicio");
  initial.failures = validateMeasurement(initial).filter((failure) => !failure.includes("ultimo conteudo"));
  await captureScreenshot(client, screenshotName(viewport, "inicio"));
  if (viewport.name === "390") {
    await captureScreenshot(client, "detalhes-390-observacoes.png");
  }
  await scrollToDetailsEnd(client);
  const final = await measureDetails(client, viewport, "final");
  final.failures = validateMeasurement(final);
  await captureScreenshot(client, screenshotName(viewport, "final"));
  if (viewport.name === "320") await captureScreenshot(client, "detalhes-320-acoes.png");
  if (viewport.name === "390") {
    const menuOpened = await evaluate(client, `(() => { const trigger = document.querySelector('.aluno-mobile-card .table-actions-trigger'); trigger?.click(); return Boolean(trigger); })()`);
    if (menuOpened) {
      await sleep(250);
      await captureScreenshot(client, "detalhes-390-menu.png");
    }
  }
  const editOpened = await clickText(client, "Editar aluno", '[data-testid="aluno-details-edit"], button');
  if (!editOpened) final.failures.push("botao editar dos detalhes nao abriu");
  else {
    await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
    await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");
  }
  await clickText(client, "Recolher detalhes", '[data-testid="aluno-details-actions"] button, button');
  await waitFor(client, "!document.querySelector('[data-testid=\"aluno-details\"]')");
  return [initial, final];
}

function screenshotName(viewport, phase) {
  if (viewport.name.startsWith("paisagem")) return `detalhes-${viewport.name}.png`;
  if (viewport.name.startsWith("desktop")) return `detalhes-${viewport.name}.png`;
  return `detalhes-${viewport.name}-${phase}.png`;
}

function summarize(results) {
  return results.map((item) => ({
    name: item.name,
    phase: item.phase,
    viewport: `${item.viewport.width}x${item.viewport.height}`,
    document: `${item.document.clientWidth}/${item.document.scrollWidth}`,
    body: `${item.body.clientWidth}/${item.body.scrollWidth}`,
    page: item.page ? `${item.page.clientWidth}/${item.page.scrollWidth}` : null,
    card: item.card ? `${item.card.clientWidth}/${item.card.scrollWidth}` : null,
    details: item.details ? `${item.details.clientWidth}/${item.details.scrollWidth}` : null,
    actions: item.actions ? `${item.actions.clientWidth}/${item.actions.scrollWidth}` : null,
    lastVisible: item.lastVisible,
    sections: item.sections,
    status: item.failures.length === 0 ? "ok" : "falhou",
    failures: item.failures,
  }));
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await client.send("Page.navigate", { url: appUrl });
    await waitFor(client, "document.readyState === 'complete'");
    await sleep(2000);
    const auth = await loginIfNeeded(client);
    console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");

    const results = [];
    for (const viewport of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      results.push(...(await runScenario(client, viewport)));
    }
    console.log(JSON.stringify({ authenticated: true, summary: summarize(results) }, null, 2));
    const failed = results.filter((item) => item.failures.length > 0);
    if (failed.length > 0) {
      console.error(JSON.stringify({ failed: summarize(failed) }, null, 2));
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
