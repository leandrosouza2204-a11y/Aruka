import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const viewports = [
  { name: "alunos-320", width: 320, height: 800, mobile: true },
  { name: "alunos-360", width: 360, height: 800, mobile: true },
  { name: "alunos-375", width: 375, height: 812, mobile: true },
  { name: "alunos-390", width: 390, height: 844, mobile: true },
  { name: "alunos-412", width: 412, height: 915, mobile: true },
  { name: "alunos-430", width: 430, height: 932, mobile: true },
  { name: "alunos-desktop-1024", width: 1024, height: 768, mobile: false },
  { name: "alunos-desktop-1366", width: 1366, height: 768, mobile: false },
  { name: "alunos-desktop-1440", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const appUrl = "http://127.0.0.1:5173/alunos";
const screenshotDir = join("tmp-responsive-screenshots", "alunos-mobile");
const tolerance = 1;

validateQaCredentials();

async function getWebSocketUrl() {
  const targetResponse = await fetch(`${chromeNewTargetUrl}?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });

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
    if (message.error) {
      reject(new Error(`${method}: ${message.error.message}`));
      return;
    }
    resolve(message.result);
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { method, resolve, reject });
      });
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
    const description =
      result.exceptionDetails.exception?.description ||
      result.exceptionDetails.exception?.value ||
      result.exceptionDetails.text ||
      "Erro ao avaliar expressao.";
    throw new Error(description);
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
  if (!(await clickText(client, "Entrar", 'button[type="submit"], button'))) {
    throw new Error("Falha no login QA: botao Entrar nao encontrado.");
  }
  await sleep(5500);
  const after = await getAuthState(client);
  if (after.path.includes("/login") || after.hasLoginForm) {
    throw new Error(`Falha no login QA. Rota atual: ${after.path}. Mensagem publica: ${after.publicMessage || "-"}`);
  }
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(1500);
  return "logged-in";
}

async function getAuthState(client) {
  return evaluate(
    client,
    `(() => {
      const publicMessage = [...document.querySelectorAll('p, [role="alert"], .app-alert')]
        .map((item) => item.textContent.trim())
        .filter(Boolean)
        .find((text) => /erro|invalid|senha|credenciais|login|auth|nao|falha|failed/i.test(text)) || "";
      return {
        path: window.location.pathname,
        hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
        publicMessage: publicMessage.slice(0, 240)
      };
    })()`
  );
}

async function measure(client, viewport, phase) {
  return evaluate(
    client,
    `(() => {
      const root = document.documentElement;
      const body = document.body;
      const main = document.querySelector('[data-page="alunos"], .alunos-page, main');
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')];
      const visibleCards = cards.filter((card) => {
        const rect = card.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });
      const bottomNav = document.querySelector('.mobile-bottom-nav, .bottom-navigation, nav[aria-label="Navegacao mobile"]');
      const bottomNavTop = bottomNav?.getBoundingClientRect().top ?? window.innerHeight;
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
            position: style.position,
            transform: style.transform
          };
        })
        .filter(({ left, right, width }) => left < -1 || right > viewportWidth + 1 || width > viewportWidth + 1)
        .slice(0, 12);
      const cardMetrics = visibleCards.slice(0, 3).map((card, index) => ({
        index,
        clientWidth: card.clientWidth,
        scrollWidth: card.scrollWidth,
        deltaWidth: card.scrollWidth - card.clientWidth,
        text: card.textContent.trim().replace(/\\s+/g, ' ').slice(0, 140)
      }));
      const lastCard = visibleCards.at(-1);
      const lastRect = lastCard?.getBoundingClientRect();
      const menu = document.querySelector('.table-actions-dropdown[role="menu"]');
      const menuRect = menu?.getBoundingClientRect();
      const detail = document.querySelector('.mobile-inline-details > section, .desktop-detail-panel');

      return {
        name: ${JSON.stringify(viewport.name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          deltaWidth: root.scrollWidth - root.clientWidth
        },
        body: {
          clientWidth: body.clientWidth,
          scrollWidth: body.scrollWidth,
          deltaWidth: body.scrollWidth - body.clientWidth
        },
        main: main ? {
          clientWidth: main.clientWidth,
          scrollWidth: main.scrollWidth,
          deltaWidth: main.scrollWidth - main.clientWidth
        } : null,
        cards: {
          count: visibleCards.length,
          sample: cardMetrics
        },
        detailOpen: Boolean(detail),
        menu: menuRect ? {
          left: Math.round(menuRect.left * 100) / 100,
          right: Math.round(menuRect.right * 100) / 100,
          width: Math.round(menuRect.width * 100) / 100,
          insideViewport: menuRect.left >= -1 && menuRect.right <= viewportWidth + 1
        } : null,
        lastCardVisibleAboveBottomNav: lastRect ? lastRect.bottom <= bottomNavTop - 1 && lastRect.top < window.innerHeight : null,
        bottomNavTop,
        visibleLabels: [...document.querySelectorAll('.alunos-page h1, .alunos-page button, .alunos-page input, .alunos-page select, .aluno-mobile-card')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
          })
          .map((element) => (element.textContent || element.placeholder || element.value || element.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 90))
          .filter(Boolean)
          .slice(0, 12),
        desktopTableVisible: Boolean(document.querySelector('.desktop-table')?.offsetParent),
        mobileListVisible: visibleCards.length > 0,
        overflowing
      };
    })()`
  );
}

async function openFirstDetails(client) {
  return evaluate(
    client,
    `(() => {
      const firstCard = document.querySelector('[data-testid="aluno-mobile-card"], .aluno-mobile-card');
      const button = firstCard ? [...firstCard.querySelectorAll('button')].find((item) => /Detalhes|Ocultar/i.test(item.textContent)) : null;
      if (!button) return false;
      button.click();
      return true;
    })()`
  );
}

async function openCardMenu(client, position) {
  const scrolled = await evaluate(
    client,
    `(() => {
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')]
        .filter((card) => card.getBoundingClientRect().width > 0);
      const card = ${JSON.stringify(position)} === 'last' ? cards.at(-1) : cards[0];
      const trigger = card?.querySelector('.table-actions-trigger');
      if (!trigger) return false;
      trigger.scrollIntoView({ block: ${JSON.stringify(position === "last" ? "end" : "center")}, inline: 'nearest' });
      return true;
    })()`
  );
  if (!scrolled) return false;
  await sleep(250);
  return evaluate(
    client,
    `(() => {
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')]
        .filter((card) => card.getBoundingClientRect().width > 0);
      const card = ${JSON.stringify(position)} === 'last' ? cards.at(-1) : cards[0];
      const trigger = card?.querySelector('.table-actions-trigger');
      if (!trigger) return false;
      trigger.click();
      return true;
    })()`
  );
}

async function exerciseSearchAndFilters(client) {
  return evaluate(
    client,
    `(() => {
      const events = [];
      const search = document.querySelector('[data-testid="alunos-search"]');
      const setInputValue = (input, value) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const setSelectValue = (select, value) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
        setter.call(select, value);
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      };
      if (search) {
        setInputValue(search, '__qa_sem_resultado_responsivo__');
        events.push('busca-sem-resultado');
      }
      const status = document.querySelector('[data-testid="alunos-status-filter"]');
      if (status && status.options.length > 1) {
        setSelectValue(status, status.options[1].value);
        events.push('filtro-status');
      }
      document.querySelector('.alunos-filtros button')?.click();
      events.push('limpar-filtros');
      return events;
    })()`
  );
}

function validateMeasurement(item) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document.deltaWidth],
    ["body", item.body.deltaWidth],
    ["main", item.main?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) {
      failures.push(`${label} delta horizontal ${delta}px`);
    }
  }
  for (const card of item.cards.sample) {
    if (Math.abs(card.deltaWidth) > tolerance) failures.push(`card ${card.index} delta horizontal ${card.deltaWidth}px`);
  }
  if (!item.main) failures.push("pagina alunos nao encontrada");
  if (item.name.includes("desktop") && !item.desktopTableVisible) failures.push("tabela desktop nao visivel");
  if (!item.name.includes("desktop") && item.cards.count === 0) failures.push("cards mobile nao encontrados");
  if (item.phase.includes("menu") && item.menu?.insideViewport !== true) failures.push("menu fora da viewport");
  if (item.phase === "final" && !item.name.includes("desktop") && item.lastCardVisibleAboveBottomNav !== true) {
    failures.push("ultimo card nao ficou visivel acima da bottom navigation");
  }
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  return failures;
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

function summarize(results) {
  return results.map((item) => ({
    name: item.name,
    phase: item.phase,
    viewport: `${item.viewport.width}x${item.viewport.height}`,
    document: `${item.document.clientWidth}/${item.document.scrollWidth}`,
    body: `${item.body.clientWidth}/${item.body.scrollWidth}`,
    main: item.main ? `${item.main.clientWidth}/${item.main.scrollWidth}` : null,
    cards: `${item.cards.count}`,
    menu: item.menu ? `${item.menu.left}-${item.menu.right}` : null,
    detailOpen: item.detailOpen,
    status: item.failures.length === 0 ? "ok" : "falhou",
    failures: item.failures,
    overflowing: item.overflowing,
  }));
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    let authDone = false;
    const results = [];
    let filtersExercised = false;
    for (const viewport of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      await client.send("Page.navigate", { url: appUrl });
      await waitFor(client, "document.readyState === 'complete'");
      await sleep(2200);
      if (!authDone) {
        const auth = await loginIfNeeded(client);
        console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");
        authDone = true;
      }
      await waitFor(client, "document.querySelector('[data-page=\"alunos\"], .alunos-page')");
      await waitFor(client, "!document.body.textContent.includes('Carregando alunos')");
      await sleep(1200);
      await windowScrollTop(client, 0);

      if (!filtersExercised) {
        const interactions = await exerciseSearchAndFilters(client);
        await sleep(600);
        console.log(JSON.stringify({ interactions }, null, 2));
        filtersExercised = true;
      }

      const initial = await measure(client, viewport, "inicio");
      initial.failures = validateMeasurement(initial).filter((failure) => !failure.includes("ultimo card"));
      results.push(initial);
      if (viewport.mobile) await captureScreenshot(client, `${viewport.name}-inicio.png`);
      if (viewport.name === "alunos-desktop-1366") await captureScreenshot(client, "alunos-desktop-1366.png");

      if (viewport.mobile) {
        await openFirstDetails(client);
        await sleep(500);
        const detail = await measure(client, viewport, "detalhes");
        detail.failures = validateMeasurement(detail).filter((failure) => !failure.includes("ultimo card"));
        if (!detail.detailOpen) detail.failures.push("detalhes do aluno nao abriram");
        results.push(detail);
        await captureScreenshot(client, `${viewport.name}-detalhes.png`);

        const firstMenuOpened = await openCardMenu(client, "first");
        await sleep(350);
        const firstMenu = await measure(client, viewport, "menu-primeiro");
        firstMenu.failures = validateMeasurement(firstMenu).filter((failure) => !failure.includes("ultimo card"));
        if (!firstMenuOpened || !firstMenu.menu) firstMenu.failures.push("menu do primeiro card nao abriu");
        results.push(firstMenu);
        await captureScreenshot(client, `${viewport.name}-menu-primeiro.png`);

        await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
        await windowScrollTop(client, 999999);
        await sleep(550);
        const lastMenuOpened = await openCardMenu(client, "last");
        await sleep(350);
        const lastMenu = await measure(client, viewport, "menu-ultimo");
        lastMenu.failures = validateMeasurement(lastMenu);
        if (!lastMenuOpened || !lastMenu.menu) lastMenu.failures.push("menu do ultimo card nao abriu");
        results.push(lastMenu);
        await captureScreenshot(client, `${viewport.name}-menu-ultimo.png`);

        await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape" });
        await windowScrollTop(client, 999999);
        await sleep(350);
        const final = await measure(client, viewport, "final");
        final.failures = validateMeasurement(final);
        results.push(final);
        await captureScreenshot(client, `${viewport.name}-final.png`);
      }
    }
    const summary = summarize(results);
    console.log(JSON.stringify({ authenticated: true, summary }, null, 2));
    const failed = results.filter((item) => item.failures.length > 0);
    if (failed.length > 0) {
      console.error(JSON.stringify({ failed: summarize(failed) }, null, 2));
      process.exitCode = 1;
    }
  } finally {
    client.close();
  }
}

async function windowScrollTop(client, top) {
  await evaluate(client, `window.scrollTo({ top: ${top}, behavior: 'instant' }); true`);
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
