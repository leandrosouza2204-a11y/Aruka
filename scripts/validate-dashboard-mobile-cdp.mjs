import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  buildQaUrl,
  loadQaEnvFile,
  maskIdentifier,
  QaEnvironmentError,
  validateQaEnvironment,
} from "./lib/qa-environment-guard.mjs";

const envFile = loadQaEnvFile();
let qaEnvironment;

try {
  qaEnvironment = validateQaEnvironment();
} catch (error) {
  if (error instanceof QaEnvironmentError) {
    const details = error.details || {};
    console.error(
      [
        error.message,
        `Codigo: ${error.code}`,
        `Variavel: ${details.variable || "-"}`,
        `Ambiente declarado: ${details.declaredEnvironment || process.env.QA_ENVIRONMENT || "missing"}`,
        `Host detectado: ${details.host || "-"}`,
        "Acao necessaria: configure .env.qa.local com staging inequivoco e sem secrets versionados.",
        `Arquivo .env.qa.local carregado: ${envFile.loaded ? "sim" : "nao"}`,
      ].join("\n")
    );
    process.exit(2);
  }

  throw error;
}

const viewports = [
  { name: "dashboard-320", width: 320, height: 800, mobile: true },
  { name: "dashboard-360", width: 360, height: 800, mobile: true },
  { name: "dashboard-375", width: 375, height: 812, mobile: true },
  { name: "dashboard-390", width: 390, height: 844, mobile: true },
  { name: "dashboard-412", width: 412, height: 915, mobile: true },
  { name: "dashboard-430", width: 430, height: 932, mobile: true },
  { name: "dashboard-desktop-1024", width: 1024, height: 768, mobile: false },
  { name: "dashboard-desktop-1366", width: 1366, height: 768, mobile: false },
  { name: "dashboard-desktop-1440", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const appUrl = buildQaUrl("/dashboard");
const screenshotDir = join("reports", "product-audit", "dashboard-v1", "evidence", "authenticated");
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
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
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
        .find((text) => /erro|invalid|senha|credenciais|login|auth|não|nao|falha|failed/i.test(text)) || "";
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
      const main =
        document.querySelector('[data-page="dashboard"]') ||
        document.querySelector('.dashboard-page') ||
        document.querySelector('main');
      const bottomNav = document.querySelector('.mobile-bottom-nav, .bottom-navigation, nav[aria-label="Navegação mobile"]');
      const bottomNavTop = bottomNav?.getBoundingClientRect().top ?? window.innerHeight;
      const visibleElements = [...document.querySelectorAll('.dashboard-page h1, .dashboard-page h2, .dashboard-metric-card, .dashboard-panel, .app-section, .app-button, .dashboard-alert-item')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            text: element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 100),
            top: Math.round(rect.top),
            bottom: Math.round(rect.bottom),
            visibleInFirstFold: rect.top < window.innerHeight && rect.bottom > 0
          };
        });
      const lastElement = [...document.querySelectorAll('.dashboard-page *')]
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0;
        })
        .at(-1);
      const lastRect = lastElement?.getBoundingClientRect();
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

      return {
        name: ${JSON.stringify(viewport.name)},
        phase: ${JSON.stringify(phase)},
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          clientHeight: root.clientHeight,
          scrollHeight: root.scrollHeight,
          scrollTop: Math.round(root.scrollTop || body.scrollTop || window.scrollY),
          deltaWidth: root.scrollWidth - root.clientWidth
        },
        body: {
          clientWidth: body.clientWidth,
          scrollWidth: body.scrollWidth,
          clientHeight: body.clientHeight,
          scrollHeight: body.scrollHeight,
          deltaWidth: body.scrollWidth - body.clientWidth
        },
        main: main ? {
          clientWidth: main.clientWidth,
          scrollWidth: main.scrollWidth,
          clientHeight: main.clientHeight,
          scrollHeight: main.scrollHeight,
          deltaWidth: main.scrollWidth - main.clientWidth
        } : null,
        blocks: visibleElements,
        firstFold: visibleElements.filter((item) => item.visibleInFirstFold).map((item) => item.text),
        quickActionsVisible: [...document.querySelectorAll('.dashboard-page button, .dashboard-page a')]
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width >= 36 && rect.height >= 36 && rect.top < window.innerHeight && rect.bottom > 0;
          })
          .map((element) => element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 80)),
        lastElementVisible: lastRect ? lastRect.bottom <= bottomNavTop - 1 && lastRect.top < window.innerHeight : null,
        bottomNavTop,
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
    ["main", item.main?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) {
      failures.push(`${label} delta horizontal ${delta}px`);
    }
  }
  if (!item.main) failures.push("main/dashboard nao encontrado");
  if (item.phase === "final" && item.name.includes("dashboard-") && !item.name.includes("desktop") && item.lastElementVisible !== true) {
    failures.push("ultimo conteudo nao visivel acima da bottom navigation");
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
    firstFold: item.firstFold.slice(0, 5),
    quickActionsVisible: item.quickActionsVisible,
    lastElementVisible: item.lastElementVisible,
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
    console.log(
      `Ambiente QA validado: ${qaEnvironment.declaredEnvironment}; host=${qaEnvironment.host}; supabase=${maskIdentifier(qaEnvironment.expectedProjectRef)}`
    );
    let authDone = false;
    const results = [];
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
      await waitFor(client, "document.querySelector('.dashboard-page')");
      await sleep(1200);
      await windowScrollTop(client, 0);
      await sleep(250);
      const initial = await measure(client, viewport, "inicio");
      initial.failures = validateMeasurement(initial).filter((failure) => !failure.includes("ultimo conteudo"));
      results.push(initial);
      if (viewport.mobile) await captureScreenshot(client, `${viewport.name.replace("dashboard-", "dashboard-")}-inicio.png`);
      if (viewport.name === "dashboard-desktop-1366") await captureScreenshot(client, "dashboard-desktop-1366.png");
      await windowScrollTop(client, 999999);
      await sleep(450);
      const final = await measure(client, viewport, "final");
      final.failures = validateMeasurement(final);
      results.push(final);
      if (viewport.mobile) await captureScreenshot(client, `${viewport.name.replace("dashboard-", "dashboard-")}-final.png`);
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
