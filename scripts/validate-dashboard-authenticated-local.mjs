import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

loadQaEnvFile();
const runtime = readLocalSupabaseRuntime();
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const evidenceDir = join("reports", "product-audit", "dashboard-v1", "evidence", "local-qa");
const cdpPort = String(9300 + Math.floor(Math.random() * 500));
mkdirSync(evidenceDir, { recursive: true });

let devServer;
let chrome;
try {
  await ensureFrontend(qa.baseUrl);
  chrome = await startChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
    await waitFor(client, "document.readyState !== 'loading'");
    await sleep(1500);
    await fillAndSubmitLogin(client);
    await waitFor(client, "!location.pathname.includes('/login')", 15000);
    await captureScreenshot(client, join(evidenceDir, "login-authenticated.png"));
    await client.send("Page.navigate", { url: `${qa.baseUrl}/dashboard` });
    await waitFor(client, "document.readyState !== 'loading'");
    try {
      await waitFor(client, "document.querySelector('.dashboard-page, [data-page=\"dashboard\"]')", 20000);
    } catch (error) {
      const state = await evaluate(client, `({ path: location.pathname, text: document.body.innerText.slice(0, 600) })`);
      throw new Error(`Dashboard real nao encontrado. Rota atual: ${state.path}. Texto publico: ${state.text}`);
    }
    const fatal = await evaluate(client, "Boolean([...document.querySelectorAll('body *')].some((el) => /erro fatal|failed to fetch|supabase\\.co/i.test(el.textContent || '')))");
    if (fatal) throw new Error("Dashboard carregou com erro fatal visivel.");
    await captureScreenshot(client, join(evidenceDir, "dashboard-loaded.png"));
    writeFileSync(join(evidenceDir, "local-qa-runtime.md"), [
      "# LOCAL_QA Runtime",
      "",
      `- Frontend URL: ${qa.baseUrl}`,
      `- Supabase API URL: ${runtime.apiUrl}`,
      "- Viewport: 1366x768",
      "- Login: ok",
      "- Dashboard: loaded",
      "- Production: not used",
      "",
    ].join("\n"));
    console.log("LOCAL_QA_DASHBOARD_READY");
  } finally {
    client.close();
  }
} finally {
  if (chrome) chrome.kill();
  if (devServer) devServer.kill();
}

async function ensureFrontend(url) {
  if (await responds(url)) return;
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  devServer = spawn(npm, ["run", "dev", "--", "--host", "127.0.0.1"], {
    stdio: "pipe",
    shell: process.platform === "win32",
    env: { ...process.env },
  });
  const started = Date.now();
  while (Date.now() - started < 45000) {
    if (await responds(url)) return;
    await sleep(500);
  }
  throw new Error("Frontend local nao respondeu em tempo habil.");
}

async function responds(url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    return response.status < 500;
  } catch {
    return false;
  }
}

async function startChrome() {
  const chromePath = process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : "google-chrome";
  const userDataDir = join(process.env.TEMP || process.env.TMP || ".", `aruka-local-qa-chrome-${process.pid}`);
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
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

async function getWebSocketUrl() {
  const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" });
  if (targetResponse.ok) return (await targetResponse.json()).webSocketDebuggerUrl;
  const versionResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  return (await versionResponse.json()).webSocketDebuggerUrl;
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

async function fillAndSubmitLogin(client) {
  const ok = await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"], input[name="email"], #email');
    const password = document.querySelector('input[type="password"], input[name="password"], #password');
    if (!email || !password) return false;
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
    setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});
    const button = document.querySelector('button[type="submit"], button');
    if (!button) return false;
    button.click();
    return true;
  })()`);
  if (!ok) throw new Error("Campos de login LOCAL_QA nao encontrados.");
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

async function captureScreenshot(client, path) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
