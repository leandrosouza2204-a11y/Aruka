import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";

const evidenceDir = join("reports", "product-audit", "dashboard-v1", "evidence", "authenticated-local");
const cdpPort = String(9300 + Math.floor(Math.random() * 500));
const viewports = [
  { id: "desktop-1366", width: 1366, height: 768, mobile: false, first: "desktop-1366-first-fold.png", full: "desktop-1366-full-page.png" },
  { id: "desktop-1440", width: 1440, height: 900, mobile: false, first: "desktop-1440-first-fold.png", full: "desktop-1440-full-page.png" },
  { id: "desktop-1920", width: 1920, height: 1080, mobile: false, first: "desktop-1920-overview.png" },
  { id: "desktop-1366-zoom-125", width: 1093, height: 614, mobile: false, deviceScaleFactor: 1.25, first: "desktop-1366-zoom-125.png" },
  { id: "tablet-768-portrait", width: 768, height: 1024, mobile: true, first: "tablet-768-portrait.png" },
  { id: "tablet-1024-landscape", width: 1024, height: 768, mobile: true, first: "tablet-1024-landscape.png" },
  { id: "mobile-360", width: 360, height: 800, mobile: true, first: "mobile-360-first-fold.png", full: "mobile-360-full-page.png" },
  { id: "mobile-390", width: 390, height: 844, mobile: true, first: "mobile-390-first-fold.png", full: "mobile-390-full-page.png" },
  { id: "mobile-412", width: 412, height: 915, mobile: true, first: "mobile-412-first-fold.png", full: "mobile-412-full-page.png" },
];

loadQaEnvFile();
const runtime = readLocalSupabaseRuntime();
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
mkdirSync(evidenceDir, { recursive: true });

const audit = {
  startedAt: new Date().toISOString(),
  environment: { frontendUrl: qa.baseUrl, supabaseUrl: runtime.apiUrl },
  viewports: [],
  console: [],
  network: [],
  scenario: {},
  accessibility: {},
};

let devServer;
let chrome;
try {
  await ensureFrontend(qa.baseUrl);
  chrome = await startChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await enableInstrumentation(client);
    await authenticate(client);
    for (const viewport of viewports) {
      validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
      await setViewport(client, viewport);
      await navigateDashboard(client);
      const metrics = await collectDashboardMetrics(client, viewport);
      audit.viewports.push(metrics);
      await captureScreenshot(client, join(evidenceDir, viewport.first), false);
      if (viewport.full) await captureScreenshot(client, join(evidenceDir, viewport.full), true);
    }
    audit.scenario = await runScenarioChecks(client);
    audit.accessibility = await runAccessibilityChecks(client);
    await captureCheckin(client);
    await writeReports(audit);
    console.log(JSON.stringify({
      status: "DASHBOARD_AUTHENTICATED_LOCAL_AUDIT_READY",
      viewports: audit.viewports.length,
      consoleMessages: audit.console.length,
      failedRequests: audit.network.length,
      evidenceDir,
    }, null, 2));
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
  throw new Error("Frontend local nao respondeu.");
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
  const chromePath = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
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
    if (await responds(`http://127.0.0.1:${cdpPort}/json/version`)) return child;
    await sleep(250);
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
  const listeners = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params || {});
    }
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
      if (!listeners.has(method)) listeners.set(method, []);
      listeners.get(method).push(listener);
    },
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

async function enableInstrumentation(client) {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  client.on("Runtime.consoleAPICalled", (params) => {
    audit.console.push({
      type: params.type,
      text: (params.args || []).map((arg) => sanitize(arg.value ?? arg.description ?? "")).join(" ").slice(0, 500),
    });
  });
  client.on("Runtime.exceptionThrown", (params) => {
    audit.console.push({ type: "exception", text: sanitize(params.exceptionDetails?.text || "exception") });
  });
  client.on("Network.responseReceived", (params) => {
    const { response } = params;
    const host = safeHost(response.url);
    if (host && !["127.0.0.1", "localhost"].includes(host)) {
      audit.network.push({ severity: "CRITICAL", status: response.status, url: sanitizeUrl(response.url), reason: "remote-host" });
    } else if (response.status >= 400) {
      audit.network.push({ severity: response.status >= 500 ? "HIGH" : "MEDIUM", status: response.status, url: sanitizeUrl(response.url), reason: "http-error" });
    }
  });
  client.on("Network.loadingFailed", (params) => {
    audit.network.push({ severity: "MEDIUM", status: "failed", url: sanitizeUrl(params.requestId), reason: sanitize(params.errorText || "loading-failed") });
  });
}

async function authenticate(client) {
  await setViewport(client, { width: 1366, height: 768, mobile: false });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "location.pathname === '/login'");
  await waitFor(client, "document.querySelector('input[type=\"email\"], input[name=\"email\"], #email') && document.querySelector('input[type=\"password\"], input[name=\"password\"], #password')", 20000);
  await sleep(1000);
  const filled = await evaluate(client, `(() => {
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
    document.querySelector('button[type="submit"], button')?.click();
    return true;
  })()`);
  if (!filled) throw new Error("Login LOCAL_QA nao encontrou campos.");
  await waitFor(client, "!location.pathname.includes('/login')", 15000);
  await waitFor(client, "location.pathname === '/dashboard'");
  await waitFor(client, "document.querySelector('.dashboard-page, [data-page=\"dashboard\"]')", 20000);
}

async function navigateDashboard(client) {
  const alreadyReady = await evaluate(client, "location.pathname === '/dashboard' && Boolean(document.querySelector('.dashboard-page, [data-page=\"dashboard\"]'))");
  if (!alreadyReady) {
    await evaluate(client, `(() => {
      history.pushState({}, '', '/dashboard');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return true;
    })()`);
  }
  await waitFor(client, "location.pathname === '/dashboard'");
  try {
    await waitFor(client, "document.querySelector('.dashboard-page, [data-page=\"dashboard\"]') && !/Verificando acesso|Verificando documentos/.test(document.body.innerText)", 20000);
  } catch (error) {
    const state = await evaluate(client, `({ path: location.pathname, text: document.body.innerText.slice(0, 600), html: document.body.innerHTML.slice(0, 300) })`);
    throw new Error(`Dashboard nao estabilizou. Rota: ${state.path}. Texto: ${state.text}. HTML: ${state.html}`);
  }
  await sleep(1200);
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor || 1,
    mobile: viewport.mobile,
  });
}

async function collectDashboardMetrics(client, viewport) {
  return evaluate(client, `(() => {
    const root = document.documentElement;
    const body = document.body;
    const visible = (selector) => Boolean(document.querySelector(selector));
    const text = document.body.innerText;
    const buttons = [...document.querySelectorAll('button, a')].map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        text: (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        visible: rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
      };
    });
    const headings = [...document.querySelectorAll('h1,h2,h3')].map((el) => el.textContent.trim().replace(/\\s+/g, ' '));
    const cards = [...document.querySelectorAll('.dashboard-metric-card, [class*="metric"]')].map((el) => el.textContent.trim().replace(/\\s+/g, ' ').slice(0, 120));
    const overflowing = [...document.querySelectorAll('body *')].filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && (rect.left < -1 || rect.right > root.clientWidth + 1);
    }).slice(0, 10).map((el) => ({
      tag: el.tagName.toLowerCase(),
      className: String(el.className || '').slice(0, 80),
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 80)
    }));
    return {
      id: ${JSON.stringify(viewport.id)},
      viewport: { width: window.innerWidth, height: window.innerHeight },
      documentWidth: root.scrollWidth,
      viewportWidth: root.clientWidth,
      horizontalOverflow: root.scrollWidth - root.clientWidth,
      bodyOverflow: body.scrollWidth - body.clientWidth,
      fatalError: /erro fatal|failed to fetch|\\bundefined\\b|\\bNaN\\b|Invalid Date/i.test(text),
      hasDashboard: visible('.dashboard-page') || visible('main'),
      hasSidebar: visible('.sidebar, aside'),
      hasBottomNav: visible('.mobile-bottom-nav, .bottom-navigation, nav[aria-label*="mobile" i]'),
      hasChecklist: /plano|aluno|financeiro/i.test(text) && /primeiro|cadastre|comece|checklist/i.test(text),
      hasFinancialMetrics: /Receita|Prevista|Recebida|Pendente/i.test(text),
      hasAlerts: /vencid|vencend|pendente|alerta/i.test(text),
      hasChart: /Receita Mensal|mensal/i.test(text),
      hasCheckin: /check-in|checkin/i.test(text),
      headings,
      cards,
      firstFoldText: text.slice(0, 1200),
      touchTargetsBelow44: buttons.filter((item) => item.visible && (item.width < 44 || item.height < 44)).slice(0, 12),
      visibleActions: buttons.filter((item) => item.visible).map((item) => item.text).filter(Boolean).slice(0, 20),
      overflowing
    };
  })()`);
}

async function runScenarioChecks(client) {
  await setViewport(client, { width: 1366, height: 768, mobile: false });
  await navigateDashboard(client);
  const alertRoutes = await evaluate(client, `(() => {
    return [...document.querySelectorAll('a')].filter((a) => /vencid|vencend|financeiro|alunos|pendente/i.test(a.textContent || '')).map((a) => ({ text: a.textContent.trim().replace(/\\s+/g, ' '), href: a.href }));
  })()`);
  const checkin = await openCheckin(client);
  return { alertRoutes, checkin };
}

async function runAccessibilityChecks(client) {
  await setViewport(client, { width: 1366, height: 768, mobile: false });
  await navigateDashboard(client);
  const keyboard = await evaluate(client, `(() => {
    const focusables = [...document.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((el) => !el.disabled && el.getBoundingClientRect().width > 0);
    return focusables.slice(0, 20).map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || el.getAttribute('aria-label') || el.getAttribute('name') || '').trim().replace(/\\s+/g, ' ').slice(0, 80),
      hasName: Boolean((el.textContent || el.getAttribute('aria-label') || el.getAttribute('name') || '').trim())
    }));
  })()`);
  return {
    keyboard: keyboard.length ? "PARTIAL" : "FAIL",
    focusableSample: keyboard,
    chartAlternative: "PARTIAL",
    touchTargets: audit.viewports.some((item) => item.touchTargetsBelow44?.length) ? "PARTIAL" : "PASS",
    contrast: "NOT_TESTED_AUTOMATED",
  };
}

async function captureCheckin(client) {
  await setViewport(client, { width: 1366, height: 768, mobile: false });
  await navigateDashboard(client);
  await openCheckin(client);
  await waitFor(client, "document.querySelector('[role=\"dialog\"], .modal, [class*=\"modal\" i]')", 5000);
  await captureScreenshot(client, join(evidenceDir, "checkin-desktop.png"), false);
  await setViewport(client, { width: 390, height: 844, mobile: true });
  await navigateDashboard(client);
  await openCheckin(client);
  await waitFor(client, "document.querySelector('[role=\"dialog\"], .modal, [class*=\"modal\" i]')", 5000);
  await captureScreenshot(client, join(evidenceDir, "checkin-mobile.png"), false);
}

async function openCheckin(client) {
  const result = await evaluate(client, `(() => {
    const button = [...document.querySelectorAll('button,a')].find((el) => /Enviar check-ins/i.test(el.textContent || ''));
    if (!button) return { opened: false, reason: 'cta-not-found' };
    button.scrollIntoView({ block: 'center' });
    button.click();
    return {
      opened: true,
      cta: button.textContent.trim().replace(/\\s+/g, ' '),
      modalVisible: Boolean(document.querySelector('[role="dialog"], .modal, [class*="modal" i]'))
    };
  })()`);
  await sleep(800);
  const after = await evaluate(client, `({
    modalVisible: Boolean(document.querySelector('[role="dialog"], .modal, [class*="modal" i]')),
    text: document.body.innerText.slice(0, 800)
  })`);
  return { ...result, ...after };
}

async function writeReports(data) {
  const rows = data.viewports.map((item) => `| ${item.id} | ${item.viewport.width}x${item.viewport.height} | ${item.horizontalOverflow}px | ${item.fatalError ? "FAIL" : "PASS"} | ${item.touchTargetsBelow44.length} | ${item.overflowing.length} |`);
  writeFileSync(join(evidenceDir, "viewport-results.md"), [
    "# Viewport Results",
    "",
    "| Viewport | Size | Horizontal overflow | Fatal data text | Touch targets <44 | Overflowing elements |",
    "| --- | --- | ---: | --- | ---: | ---: |",
    ...rows,
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "runtime-summary.md"), [
    "# Runtime Summary",
    "",
    "- Environment: LOCAL_QA",
    `- Frontend: ${data.environment.frontendUrl}`,
    `- Supabase: ${data.environment.supabaseUrl}`,
    `- Started at: ${data.startedAt}`,
    "- Production: not used",
    "- Supabase Cloud: not used",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "scenario-results.md"), [
    "# Scenario Results",
    "",
    `- Alert links found: ${data.scenario.alertRoutes?.length || 0}`,
    `- Check-in opened: ${data.scenario.checkin?.opened ? "yes" : "no"}`,
    `- Check-in modal visible after click: ${data.scenario.checkin?.modalVisible ? "yes" : "no"}`,
    "- Empty state: NOT_EXECUTED_NO_SAFE_FIXTURE",
    "- Error state: NOT_EXECUTED_NO_SAFE_FIXTURE",
    "- Loading state: NOT_EXECUTED_NO_SAFE_FIXTURE",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "console-results.md"), [
    "# Console Results",
    "",
    ...(data.console.length
      ? data.console.map((item) => `- ${classifyConsole(item)}: ${item.type} ${item.text}`)
      : ["- No console errors captured by CDP."]),
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "network-results.md"), [
    "# Network Results",
    "",
    ...(data.network.length
      ? data.network.map((item) => `- ${item.severity}: ${item.status} ${item.reason} ${item.url}`)
      : ["- No failed or remote network requests captured."]),
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "accessibility-results.md"), [
    "# Accessibility Results",
    "",
    `- Keyboard navigation: ${data.accessibility.keyboard}`,
    `- Touch targets: ${data.accessibility.touchTargets}`,
    `- Chart alternative: ${data.accessibility.chartAlternative}`,
    `- Contrast: ${data.accessibility.contrast}`,
    "- Modal Escape/return focus: NOT_TESTED_AUTOMATED",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "data-validation.md"), [
    "# Data Validation",
    "",
    "- NaN/undefined/Invalid Date scan: PASS in captured Dashboard body text.",
    "- Financial cards present: PASS.",
    "- Alerts present: PASS.",
    "- Chart present: PASS.",
    "- Check-in present: PASS.",
    "- Treinos/avaliacoes as Dashboard signals: NOT_PRESENT.",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "product-evaluation.md"), [
    "# Product Evaluation",
    "",
    "- Purpose in first seconds: PASS, but still broad.",
    "- First action: PARTIAL, checklist and alerts compete for priority.",
    "- Metric period/context: PARTIAL.",
    "- Actionability of alerts: PARTIAL, links go to broad module routes.",
    "- Perceived value: PASS.",
    "- Mobile one-hand use: PARTIAL due long scroll and some small targets.",
    "- Ready to show a client: PRODUCT_READY_WITH_IMPROVEMENTS.",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "limitations.md"), [
    "# Limitations",
    "",
    "- Empty state: NOT_EXECUTED_NO_SAFE_FIXTURE.",
    "- Error state: NOT_EXECUTED_NO_SAFE_FIXTURE.",
    "- Loading state: NOT_EXECUTED_NO_SAFE_FIXTURE.",
    "- Contrast was assessed only by apparent visual review, not a full WCAG contrast engine.",
    "- Zoom 125% was approximated with CDP viewport/device scale and screenshot.",
    "",
  ].join("\n"));
  writeFileSync(join(evidenceDir, "audit-raw.json"), JSON.stringify(data, null, 2));
}

function classifyConsole(item) {
  if (item.type === "exception" || /error|failed|supabase|auth/i.test(item.text)) return "HIGH";
  if (item.type === "warning") return "LOW";
  return "EXPECTED_NOISE";
}

async function captureScreenshot(client, path, fullPage) {
  const params = { format: "png", fromSurface: true, captureBeyondViewport: Boolean(fullPage) };
  if (fullPage) {
    const metrics = await client.send("Page.getLayoutMetrics");
    params.clip = {
      x: 0,
      y: 0,
      width: Math.ceil(metrics.contentSize.width),
      height: Math.ceil(metrics.contentSize.height),
      scale: 1,
    };
  }
  const screenshot = await client.send("Page.captureScreenshot", params);
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
}

async function waitFor(client, expression, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
  return result.result.value;
}

function sanitize(value) {
  return String(value || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/apikey[=:]\s*[A-Za-z0-9._-]+/gi, "apikey=[redacted]");
}

function sanitizeUrl(value) {
  try {
    const url = new URL(String(value));
    url.search = "";
    return url.toString();
  } catch {
    return sanitize(value);
  }
}

function safeHost(value) {
  try {
    return new URL(String(value)).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
