import { spawn } from "node:child_process";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");

const PROFESSIONAL_EMAIL = process.env.QA_USER_EMAIL || "qa.local@aruka.test";
const PROFESSIONAL_PASSWORD = process.env.QA_USER_PASSWORD;
const cdpPort = process.env.CDP_PORT || "9222";
const qa = validateQaEnvironment(process.env);

if (!PROFESSIONAL_PASSWORD) throw new Error("QA_USER_PASSWORD_REQUIRED");

let chrome;
const consoleErrors = [];
const networkErrors = [];
const exceptions = [];

try {
  chrome = await ensureChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    client.on("Runtime.exceptionThrown", (params) => exceptions.push(params.exceptionDetails?.text || "Runtime exception"));
    client.on("Runtime.consoleAPICalled", (params) => {
      if (params.type === "error") consoleErrors.push((params.args || []).map((arg) => arg.value || arg.description || "").join(" "));
    });
    client.on("Network.loadingFailed", (params) => networkErrors.push(params.errorText || "network failed"));

    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await login(client);
    await client.send("Page.navigate", { url: `${qa.baseUrl}/alunos` });
    try {
      await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"]')");
    } catch (error) {
      const failed = await inspect(client);
      console.log(`DETAIL_ROUTE=${failed.path}`);
      console.log(`STUDENT_DETAIL_BLANK_SCREEN=${failed.blank ? "YES" : "NO"}`);
      console.log(`DETAIL_CONSOLE_ERROR=${consoleErrors.length ? "YES" : "NO"}`);
      console.log(`DETAIL_NETWORK_ERROR=${networkErrors.length ? "YES" : "NO"}`);
      console.log(`DETAIL_WINDOW_ERROR=${failed.windowErrors.length ? failed.windowErrors.join(" | ").slice(0, 1200) : "NO"}`);
      console.log(`DETAIL_TEXT_HAS_STUDENT=${failed.hasStudent ? "YES" : "NO"}`);
      throw error;
    }
    await waitFor(client, "!document.body.innerText.includes('Carregando alunos')");
    await evaluate(client, `(() => {
      window.__ARUKA_DETAIL_ERRORS__ = [];
      const originalConsoleError = console.error;
      console.error = (...args) => {
        window.__ARUKA_DETAIL_ERRORS__.push(args.map((arg) => arg?.stack || arg?.message || String(arg)).join(" "));
        originalConsoleError.apply(console, args);
      };
      window.addEventListener('error', (event) => {
        window.__ARUKA_DETAIL_ERRORS__.push(event.error?.stack || event.message || 'error');
      });
      window.addEventListener('unhandledrejection', (event) => {
        window.__ARUKA_DETAIL_ERRORS__.push(event.reason?.message || String(event.reason || 'unhandled rejection'));
      });
      return true;
    })()`);

    const before = await inspect(client);
    console.log(`DETAIL_BEFORE_HAS_STUDENT=${before.hasStudent ? "YES" : "NO"}`);
    console.log(`PLAN_REQUIRED_BANNER_BEFORE=${before.planBannerVisible ? "YES" : "NO"}`);
    const clickedTarget = await clickStudentDetails(client);
    console.log(`DETAIL_CLICK_TARGET=${clickedTarget}`);
    try {
      await waitFor(client, "document.querySelector('[data-testid=\"aluno-details\"]')", 20000);
    } catch (error) {
      const failed = await inspect(client);
      console.log(`DETAIL_ROUTE=${failed.path}`);
      console.log(`STUDENT_DETAIL_BLANK_SCREEN=${failed.blank ? "YES" : "NO"}`);
      console.log(`DETAIL_CONSOLE_ERROR=${consoleErrors.length ? "YES" : "NO"}`);
      console.log(`DETAIL_NETWORK_ERROR=${networkErrors.length ? "YES" : "NO"}`);
      console.log(`DETAIL_WINDOW_ERROR=${failed.windowErrors.length ? failed.windowErrors.join(" | ").slice(0, 1200) : "NO"}`);
      console.log(`DETAIL_TEXT_HAS_STUDENT=${failed.hasStudent ? "YES" : "NO"}`);
      console.log(`DETAIL_BUTTONS=${failed.detailButtonCount}`);
      throw error;
    }
    await waitFor(client, "document.querySelector('[data-testid=\"student-execution-history\"]')", 20000);
    const after = await inspect(client);

    if (after.blank) throw new Error("STUDENT_DETAIL_BLANK_SCREEN");
    if (!after.detailMounted) throw new Error("STUDENT_DETAIL_NOT_MOUNTED");
    if (!after.detailHasStudent) throw new Error("STUDENT_DETAIL_NOT_VISIBLE");
    if (!after.executionHistoryMounted) throw new Error("PROFESSIONAL_EXECUTION_HISTORY_NOT_VISIBLE");
    if (after.planBannerVisible) throw new Error("PLAN_REQUIRED_BANNER_VISIBLE_WHEN_PLAN_EXISTS");
    if (exceptions.length) throw new Error(`DETAIL_RUNTIME_EXCEPTION:${exceptions.join(" | ").slice(0, 300)}`);

    console.log("STUDENT_DETAIL_RUNTIME=PASS");
    console.log(`DETAIL_ROUTE=${after.path}`);
    console.log(`PLAN_REQUIRED_BANNER_VISIBLE_WHEN_PLAN_EXISTS=${after.planBannerVisible ? "YES" : "NO"}`);
    console.log(`STUDENT_DETAIL_BLANK_SCREEN=${after.blank ? "YES" : "NO"}`);
    console.log(`PROFESSIONAL_HISTORY_VISIBLE=${after.executionHistoryMounted ? "YES" : "NO"}`);
    console.log(`PROFESSIONAL_HISTORY_EMPTY_STATE=${after.historyEmptyVisible ? "YES" : "NO"}`);
    console.log(`DETAIL_CONSOLE_ERROR=${consoleErrors.length ? "YES" : "NO"}`);
    console.log(`DETAIL_NETWORK_ERROR=${networkErrors.length ? "YES" : "NO"}`);
    console.log(`DETAIL_BEFORE_HAS_STUDENT=${before.hasStudent ? "YES" : "NO"}`);
    console.log("PRODUCTION_ACCESSED=NO");
  } finally {
    client.close();
  }
} finally {
  if (chrome) chrome.kill();
}

async function login(client) {
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "document.querySelector('input[type=\"email\"], input[name=\"email\"], #email')");
  await evaluate(client, `(() => {
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(document.querySelector('input[type="email"], input[name="email"], #email'), ${JSON.stringify(PROFESSIONAL_EMAIL)});
    setValue(document.querySelector('input[type="password"], input[name="password"], #password'), ${JSON.stringify(PROFESSIONAL_PASSWORD)});
    document.querySelector('button[type="submit"]')?.click();
    return true;
  })()`);
  await waitFor(client, "!location.pathname.includes('/login')", 20000);
}

async function clickStudentDetails(client) {
  const clicked = await evaluate(client, `(() => {
    const visible = (node) => {
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const roots = [...document.querySelectorAll('tr, [data-testid="aluno-mobile-card"]')];
    const root = roots.find((node) => visible(node) && /Student QA Daily Experience/i.test(node.innerText || ''));
    const button = [...(root?.querySelectorAll('[data-testid="aluno-action-details"], button') || [])]
      .find((node) => visible(node) && /Detalhes|Ocultar/i.test(node.innerText || ''));
    button?.scrollIntoView({ block: 'center', inline: 'nearest' });
    button?.click();
    return button ? root.tagName.toLowerCase() + ":" + (button.textContent.trim() || button.getAttribute('data-testid') || 'button') : "";
  })()`);
  if (!clicked) throw new Error("STUDENT_DETAIL_BUTTON_NOT_FOUND");
  return clicked;
}

function inspect(client) {
  return evaluate(client, `(() => {
    const visible = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const text = document.body.innerText || "";
    return {
      path: location.pathname,
      blank: text.trim().length < 20,
      hasStudent: /Student QA Daily Experience/i.test(text),
      planBannerVisible: /Crie um plano antes de cadastrar alunos/i.test(text),
      detailMounted: Boolean(document.querySelector('[data-testid="aluno-details"]')),
      detailVisible: visible('[data-testid="aluno-details"]'),
      detailHasStudent: [...document.querySelectorAll('[data-testid="aluno-details"]')]
        .some((node) => /Student QA Daily Experience/i.test(node.innerText || "")),
      executionHistoryMounted: Boolean(document.querySelector('[data-testid="student-execution-history"]')),
      executionHistoryVisible: visible('[data-testid="student-execution-history"]'),
      historyEmptyVisible: visible('[data-testid="student-execution-history-empty"]'),
      detailButtonCount: document.querySelectorAll('[data-testid="aluno-action-details"]').length,
      windowErrors: window.__ARUKA_DETAIL_ERRORS__ || [],
    };
  })()`);
}

async function startChrome() {
  const chromePath = process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "google-chrome";
  const userDataDir = `${process.env.TEMP || "."}\\aruka-student-detail-${process.pid}`;
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--remote-allow-origins=*",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: "ignore", shell: false });
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try {
      const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
      if (response.ok) return child;
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome CDP nao iniciou.");
}

async function ensureChrome() {
  try {
    const response = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
    if (response.ok) return null;
  } catch {
    return startChrome();
  }
  return startChrome();
}

async function getWebSocketUrl() {
  const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const listResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
  const targets = await listResponse.json();
  const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
  if (!page) throw new Error("Chrome CDP page target nao encontrado.");
  return page.webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();
  socket.addEventListener("message", async (event) => {
    const payload = typeof event.data === "string"
      ? event.data
      : event.data instanceof ArrayBuffer
        ? Buffer.from(event.data).toString("utf8")
        : await event.data.text();
    const message = JSON.parse(payload);
    if (message.method) listeners.get(message.method)?.forEach((listener) => listener(message.params || {}));
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
    on(method, listener) {
      listeners.set(method, [...(listeners.get(method) || []), listener]);
    },
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`${method}: CDP_TIMEOUT`));
        }, 10000);
        pending.set(id, {
          method,
          resolve: (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          },
        });
      });
    },
    close() {
      socket.close();
    },
  };
}

async function waitFor(client, expression, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(300);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
  return result.result.value;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
