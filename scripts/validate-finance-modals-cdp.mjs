import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  assertSameOrigin,
  buildAppUrl,
  classifyRuntimeError,
  resolveRuntimeConfig,
  RUNTIME_MARKERS,
} from "./lib/authenticated-runtime.js";
import {
  captureQaBrowserState,
  cleanupAuthenticatedQaPage,
  prepareAuthenticatedQaPage,
  summarizeQaBrowserState,
} from "./lib/authenticated-browser-state.js";

const widths = [320, 360, 375, 390, 412, 430];
const tolerance = 1;
const cdpPort = process.env.CDP_PORT || "9222";
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const runtimeConfig = resolveRuntimeConfig(process.env, {
  legacyBaseUrlAliases: ["FINANCE_QA_BASE_URL", "FINANCE_BASE_URL", "QA_BASE_URL"],
});
const appUrl = buildAppUrl(runtimeConfig.baseUrl, "/financeiro");
const screenshotDir = join("tmp-responsive-screenshots", "finance-modals");

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
  if (!versionResponse.ok) {
    throw new Error(
      `Chrome CDP indisponivel na porta ${cdpPort}. Inicie o Chrome com --remote-debugging-port=${cdpPort}.`
    );
  }

  const version = await versionResponse.json();
  if (!version.webSocketDebuggerUrl) {
    throw new Error("Chrome CDP sem webSocketDebuggerUrl.");
  }

  return version.webSocketDebuggerUrl;
}

async function verifyAuthenticatedBrowserOrigin(client) {
  if (!runtimeConfig.baseUrl) {
    throw new Error(RUNTIME_MARKERS.baseUrlUnavailable);
  }

  const browserUrl = await evaluate(client, "window.location.href");
  const match = assertSameOrigin(runtimeConfig.baseUrl, browserUrl);
  console.log(`RUNTIME_BASE_ORIGIN=${match.baseOrigin || runtimeConfig.baseUrl}`);
  console.log(`CDP_ORIGIN=http://127.0.0.1:${cdpPort}`);
  console.log(`AUTHENTICATED_BROWSER_ORIGIN_MATCH=${match.ok ? "YES" : "NO"}`);

  if (!match.ok) {
    const error = new Error(RUNTIME_MARKERS.authenticatedBrowserOriginMismatch);
    error.runtimeMarker = RUNTIME_MARKERS.runtimeEnvironmentBlocked;
    error.runtimeDetail = RUNTIME_MARKERS.authenticatedBrowserOriginMismatch;
    throw error;
  }
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

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const result = await evaluate(client, `Boolean(${expression})`);
    if (result) return result;
    await sleep(250);
  }

  throw new Error(`Timeout aguardando: ${expression}`);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
  }

  return result.result.value;
}

async function clickText(client, text, selector = "button") {
  return evaluate(
    client,
    `(() => {
      const elements = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const element = elements.find((item) => item.textContent.trim().includes(${JSON.stringify(text)}));
      if (!element) return false;
      element.click();
      return true;
    })()`
  );
}

async function loginIfNeeded(client) {
  const authState = await getAuthState(client);
  if (!authState.path.includes("/login") && !authState.hasLoginForm) {
    return { loggedIn: false, alreadyAuthenticated: true };
  }

  const filled = await evaluate(
    client,
    `(() => {
      const email = document.querySelector('input[type="email"], input[name="email"], #email, [aria-label="Email"], [aria-label="E-mail"]');
      const password = document.querySelector('input[type="password"], input[name="password"], #password, [aria-label="Senha"]');
      if (!email || !password) {
        return { ok: false, reason: "campos-nao-encontrados" };
      }

      const setValue = (input, value) => {
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      email.focus();
      setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
      email.dispatchEvent(new Event('input', { bubbles: true }));
      email.dispatchEvent(new Event('change', { bubbles: true }));

      password.focus();
      setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});

      return { ok: true };
    })()`
  );

  if (!filled.ok) {
    throw new Error(`Falha no login QA: ${filled.reason}. Rota atual: ${authState.path}`);
  }

  const submitted = await clickText(client, "Entrar", 'button[type="submit"], button');
  if (!submitted) {
    throw new Error(`Falha no login QA: botao Entrar nao encontrado. Rota atual: ${authState.path}`);
  }

  await sleep(5500);
  const afterLogin = await getAuthState(client);
  if (afterLogin.path.includes("/login") || afterLogin.hasLoginForm) {
    throw new Error(
      `Falha no login QA. Rota atual: ${afterLogin.path}. Mensagem publica: ${afterLogin.publicMessage || "-"}`
    );
  }

  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(1500);

  const afterNavigate = await getAuthState(client);
  if (afterNavigate.path.includes("/login") || afterNavigate.hasLoginForm) {
    throw new Error(`Falha ao acessar rota protegida apos login QA. Rota atual: ${afterNavigate.path}`);
  }

  return { loggedIn: true, alreadyAuthenticated: false };
}

async function getAuthState(client) {
  return evaluate(
    client,
    `(() => {
      const alertText = [...document.querySelectorAll('p, [role="alert"], .app-alert')]
        .map((item) => item.textContent.trim())
        .filter(Boolean)
        .find((text) => /erro|invalid|senha|credenciais|login|auth|não|nao|falha|failed/i.test(text)) || "";
      return {
        path: window.location.pathname,
        hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
        publicMessage: alertText.slice(0, 240)
      };
    })()`
  );
}

async function openReportsModal(client) {
  await waitForFinanceiroReady(client);
  const openedReports = await clickText(client, "Relatórios");
  if (!openedReports) throw new Error("Botao Relatorios nao encontrado.");
  await waitFor(client, "document.querySelector('.financeiro-modal')");
}

async function openHistoryModal(client) {
  await waitForFinanceiroReady(client);
  await ensureHistoryActionableView(client);

  let openedHistory = await clickText(client, "Ver histórico", "button, [role='menuitem']");
  if (openedHistory) {
    await waitFor(client, "document.querySelector('.financeiro-modal')");
    return;
  }

  const openedMenu = await evaluate(
    client,
    `(() => {
      const triggers = [...document.querySelectorAll('.financeiro-card-actions .table-actions-trigger, .financeiro-actions-inline .table-actions-trigger, .table-actions-trigger')];
      const trigger = triggers.find((item) => item.offsetParent !== null);
      if (!trigger) return false;
      trigger.click();
      return true;
    })()`
  );

  if (!openedMenu) throw new Error("Menu de acoes para Historico nao encontrado.");
  await waitFor(client, "document.querySelector('[role=\"menu\"]')");

  openedHistory = await clickText(client, "Ver histórico", "button, [role='menuitem']");
  if (!openedHistory) throw new Error("Acao Ver historico nao encontrada.");
  await waitFor(client, "document.querySelector('.financeiro-modal')");
}

async function waitForFinanceiroReady(client) {
  await waitFor(
    client,
    `document.querySelector('.financeiro-page') && !/Verificando acesso|Carregando financeiro/i.test(document.body.innerText || "") && [...document.querySelectorAll('button')].some((button) => /Em acompanhamento|Encerrados/i.test(button.textContent || ""))`,
    30000
  );
  await sleep(500);
}

async function ensureHistoryActionableView(client) {
  const state = await getFinanceHistoryState(client);
  if (state.visibleActionTriggers > 0) return;

  if (state.closedCount > 0) {
    const switched = await clickText(client, "Encerrados", "button");
    if (!switched) {
      throw new Error(`Visao Encerrados com historico nao encontrada. Estado: ${JSON.stringify(state)}`);
    }
    await sleep(900);
  }

  const after = await getFinanceHistoryState(client);
  if (after.visibleActionTriggers === 0) {
    throw new Error(`Menu de acoes para Historico nao encontrado. Estado: ${JSON.stringify(after)}`);
  }
}

async function getFinanceHistoryState(client) {
  return evaluate(
    client,
    `(() => {
      const text = document.body.innerText || "";
      const closedMatch = text.match(/Encerrados\\s*\\((\\d+)\\)/i);
      const activeMatch = text.match(/Em acompanhamento\\s*\\((\\d+)\\)/i);
      return {
        path: location.pathname,
        activeCount: activeMatch ? Number(activeMatch[1]) : null,
        closedCount: closedMatch ? Number(closedMatch[1]) : null,
        cards: document.querySelectorAll('.financeiro-list-card').length,
        tableRows: [...document.querySelectorAll('.financeiro-desktop-table tbody tr')]
          .filter((row) => row.offsetParent !== null).length,
        visibleActionTriggers: [...document.querySelectorAll('.financeiro-card-actions .table-actions-trigger, .financeiro-actions-inline .table-actions-trigger, .table-actions-trigger')]
          .filter((item) => item.offsetParent !== null).length,
        hasHistoryAction: [...document.querySelectorAll('button, [role="menuitem"]')]
          .some((item) => item.offsetParent !== null && /Ver hist[óo]rico/i.test(item.textContent || ""))
      };
    })()`
  );
}

async function measure(client, width, scenario) {
  await scrollModalToEnd(client);

  return evaluate(
    client,
    `(() => {
      const modal = document.querySelector('.financeiro-modal');
      const scrollContainer = document.querySelector('.financeiro-modal-scroll');
      const closeButton = [...document.querySelectorAll('button')]
        .find((button) => button.textContent.trim() === 'Fechar');
      const cards = [...document.querySelectorAll('.financeiro-report-card, .financeiro-ranking-card, .financeiro-ranking-row')];
      const viewport = document.documentElement.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            text: element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 80),
            width: Math.round(rect.width * 100) / 100,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            position: style.position,
            display: style.display,
            overflowX: style.overflowX,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            transform: style.transform,
            whiteSpace: style.whiteSpace
          };
        })
        .filter((item) => item.width > viewport || item.right > viewport + 1 || item.left < -1)
        .slice(0, 12);

      return {
        width: ${width},
        scenario: ${JSON.stringify(scenario)},
        documentClientWidth: document.documentElement.clientWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyClientWidth: document.body.clientWidth,
        bodyScrollWidth: document.body.scrollWidth,
        modalClientWidth: modal?.clientWidth ?? null,
        modalScrollWidth: modal?.scrollWidth ?? null,
        scrollContainerClientWidth: scrollContainer?.clientWidth ?? null,
        scrollContainerScrollWidth: scrollContainer?.scrollWidth ?? null,
        closeButtonVisible: closeButton
          ? (() => {
              const rect = closeButton.getBoundingClientRect();
              return rect.left >= 0 && rect.right <= viewport && rect.width > 0 && rect.height > 0;
            })()
          : false,
        maxCardRight: cards.length
          ? Math.round(Math.max(...cards.map((card) => card.getBoundingClientRect().right)) * 100) / 100
          : null,
        horizontalDelta: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bodyDelta: document.body.scrollWidth - document.body.clientWidth,
        modalDelta: modal ? modal.scrollWidth - modal.clientWidth : null,
        scrollContainerDelta: scrollContainer ? scrollContainer.scrollWidth - scrollContainer.clientWidth : null,
        overflowing: overflowing.map((item) => ({
          tag: item.tag,
          className: item.className,
          text: item.text,
          width: item.width,
          left: item.left,
          right: item.right,
          position: item.position,
          display: item.display,
          overflowX: item.overflowX,
          minWidth: item.minWidth,
          maxWidth: item.maxWidth,
          transform: item.transform,
          whiteSpace: item.whiteSpace
        }))
      };
    })()`
  );
}

async function scrollModalToEnd(client) {
  await evaluate(
    client,
    `(() => {
      const scrollContainer = document.querySelector('.financeiro-modal-scroll');
      if (!scrollContainer) return false;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      return true;
    })()`
  );
  await sleep(250);
}

async function captureModalScreenshot(client, scenario, width) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });
  writeFileSync(join(screenshotDir, `${scenario}-${width}.png`), Buffer.from(screenshot.data, "base64"));
}

async function closeModal(client) {
  await clickText(client, "Fechar");
  await sleep(500);
}

function assertMeasurement(measurement) {
  const failures = [];
  const deltas = [
    ["document", measurement.horizontalDelta],
    ["body", measurement.bodyDelta],
    ["modal", measurement.modalDelta],
    ["scrollContainer", measurement.scrollContainerDelta],
  ];

  for (const [name, delta] of deltas) {
    if (delta !== null && Math.abs(delta) > tolerance) {
      failures.push(`${name} delta ${delta}px`);
    }
  }

  if (!measurement.closeButtonVisible) {
    failures.push("botao Fechar nao esta totalmente visivel");
  }

  if (measurement.overflowing.length > 0) {
    failures.push(`${measurement.overflowing.length} elemento(s) excedendo viewport`);
  }

  return failures;
}

function summarizeResults(results) {
  return results.map((item) => ({
    width: item.width,
    scenario: item.scenario,
    document: `${item.documentClientWidth}/${item.documentScrollWidth}`,
    body: `${item.bodyClientWidth}/${item.bodyScrollWidth}`,
    modal: `${item.modalClientWidth}/${item.modalScrollWidth}`,
    scrollContainer: `${item.scrollContainerClientWidth}/${item.scrollContainerScrollWidth}`,
    closeButtonVisible: item.closeButtonVisible,
    status: item.failures.length === 0 ? "ok" : "falhou",
    failures: item.failures,
  }));
}

async function run() {
  if (!runtimeConfig.baseUrl) {
    const error = new Error(RUNTIME_MARKERS.baseUrlUnavailable);
    error.runtimeMarker = RUNTIME_MARKERS.baseUrlUnavailable;
    throw error;
  }

  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");

    const results = [];
    let authResult = null;

    for (const width of widths) {
      const startState = await prepareAuthenticatedQaPage(client, {
        url: appUrl,
        viewport: { width, height: 900, deviceScaleFactor: 1, mobile: true },
        readyExpression: "document.querySelector('.financeiro-page') || document.querySelector('input[type=\"email\"], input[type=\"password\"]')",
        readyTimeout: 30000,
      });
      console.log(`QA_START_STATE finance-modals width=${width} ${summarizeQaBrowserState(startState)}`);
      await verifyAuthenticatedBrowserOrigin(client);

      if (!authResult) {
        authResult = await loginIfNeeded(client);
        console.log(authResult.loggedIn ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");
      } else {
        const state = await getAuthState(client);
        if (state.path.includes("/login") || state.hasLoginForm) {
          throw new Error(`Sessao QA indisponivel durante validacao. Rota atual: ${state.path}`);
        }
      }

      await waitFor(client, "document.querySelector('.financeiro-page')");
      await cleanupAuthenticatedQaPage(client);

      await openReportsModal(client);
      const reportMeasurement = await measure(client, width, "relatorios-financeiros");
      reportMeasurement.failures = assertMeasurement(reportMeasurement);
      results.push(reportMeasurement);
      await captureModalScreenshot(client, "relatorios-financeiros", width);
      await closeModal(client);

      await openHistoryModal(client);
      const historyMeasurement = await measure(client, width, "historico-financeiro");
      historyMeasurement.failures = assertMeasurement(historyMeasurement);
      results.push(historyMeasurement);
      await captureModalScreenshot(client, "historico-financeiro", width);

      const openedDetails = await clickText(client, "Ver detalhes");
      if (openedDetails) {
        await sleep(350);
        const detailsMeasurement = await measure(client, width, "historico-financeiro-detalhes");
        detailsMeasurement.failures = assertMeasurement(detailsMeasurement);
        results.push(detailsMeasurement);
        await captureModalScreenshot(client, "historico-financeiro-detalhes", width);
      }

      await closeModal(client);
      const endState = await cleanupAuthenticatedQaPage(client, {
        neutralUrl: buildAppUrl(runtimeConfig.baseUrl, "/"),
      });
      console.log(`QA_END_STATE finance-modals width=${width} ${summarizeQaBrowserState(endState)}`);
    }

    const summary = summarizeResults(results);
    console.log(JSON.stringify({ authenticated: true, summary }, null, 2));

    const failed = results.filter((item) => item.failures.length > 0);
    if (failed.length > 0) {
      console.error(JSON.stringify({ failed: summarizeResults(failed) }, null, 2));
      process.exitCode = 1;
    }
  } finally {
    try {
      const finalState = await captureQaBrowserState(client, "final");
      console.log(`QA_FINAL_STATE finance-modals ${summarizeQaBrowserState(finalState)}`);
      await client.send("Page.close");
    } catch {
      // The page may already be closed by Chrome after Page.close.
    }
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
  const marker = error.runtimeMarker || classifyRuntimeError(error);
  const detail = error.runtimeDetail || String(error?.message || error).replace(/fetch failed/gi, marker).slice(0, 240);
  console.error(`RUNTIME_QA_RESULT=${marker}`);
  console.error(`RUNTIME_QA_DETAIL=${detail}`);
  process.exitCode = 1;
});
