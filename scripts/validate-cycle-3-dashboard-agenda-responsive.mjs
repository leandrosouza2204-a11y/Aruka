import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";

const evidenceDir = join("tmp-responsive-screenshots", "cycle-3-dashboard-agenda");
const cdpPort = String(9850 + Math.floor(Math.random() * 100));
const viewports = [
  { id: "mobile-320x568", width: 320, height: 568, mobile: true },
  { id: "mobile-360x640", width: 360, height: 640, mobile: true },
  { id: "mobile-375x667", width: 375, height: 667, mobile: true },
  { id: "mobile-390x664", width: 390, height: 664, mobile: true },
  { id: "mobile-412x732", width: 412, height: 732, mobile: true },
  { id: "mobile-430x740", width: 430, height: 740, mobile: true },
  { id: "desktop-1024x768", width: 1024, height: 768, mobile: false },
  { id: "desktop-1366x768", width: 1366, height: 768, mobile: false },
  { id: "desktop-1440x900", width: 1440, height: 900, mobile: false },
];

loadQaEnvFile();
const runtime = {
  apiUrl: process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321",
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
};
if (!runtime.anonKey) throw new Error("CYCLE_3_LOCAL_ANON_KEY_MISSING");
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
mkdirSync(evidenceDir, { recursive: true });

let devServer;
let chrome;
const results = [];

try {
  await ensureFrontend();
  chrome = await startChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  try {
    await authenticate(client);
    for (const viewport of viewports) {
      await setViewport(client, viewport);
      await navigateDashboard(client);
      const metrics = await inspect(client, viewport);
      results.push(metrics);
      console.log(JSON.stringify(metrics));
      assert(metrics.horizontalOverflow <= 1, `${viewport.id}:HORIZONTAL_OVERFLOW_${metrics.horizontalOverflow}`);
      assert(metrics.orderIsCorrect, `${viewport.id}:AGENDA_ORDER_INVALID`);
      assert(metrics.panelInsideViewport, `${viewport.id}:PANEL_OUTSIDE_VIEWPORT`);
      assert(metrics.itemCount <= 3, `${viewport.id}:MORE_THAN_THREE_ITEMS`);
      assert(metrics.ctaTargetsValid, `${viewport.id}:CTA_TARGET_INVALID`);
      assert(metrics.fatalText === false, `${viewport.id}:FATAL_TEXT`);
      if (viewport.mobile) assert(metrics.mobileActionsStacked, `${viewport.id}:MOBILE_ACTIONS_NOT_STACKED`);
      else assert(metrics.desktopClearOfSidebar, `${viewport.id}:CONTENT_BEHIND_SIDEBAR`);
      await screenshot(client, join(evidenceDir, `${viewport.id}.png`));
    }

    await setViewport(client, viewports[2]);
    await navigateDashboard(client);
    await evaluate(client, "localStorage.setItem('ARUKA_QA_DASHBOARD_AGENDA_FAIL', 'true'); location.reload(); true");
    await waitFor(client, "document.querySelector('.dashboard-agenda-error') && document.querySelector('.dashboard-operational-section')", 20000);
    const isolated = await evaluate(client, `(() => ({
      retry: /Tentar novamente/.test(document.querySelector('.dashboard-agenda-error')?.innerText || ''),
      dashboardPresent: Boolean(document.querySelector('.dashboard-operational-section')),
      agendaErrorOnly: Boolean(document.querySelector('.dashboard-agenda-error'))
    }))()`);
    assert(isolated.retry && isolated.dashboardPresent && isolated.agendaErrorOnly, "AGENDA_FAILURE_NOT_ISOLATED");
    await screenshot(client, join(evidenceDir, "isolated-error-mobile-375.png"));
    await evaluate(client, "localStorage.removeItem('ARUKA_QA_DASHBOARD_AGENDA_FAIL'); true");

    await navigateDashboard(client);
    const newHref = await evaluate(client, "document.querySelector('.dashboard-today-agenda-actions a[href*=\"novo=\"]')?.getAttribute('href') || ''");
    assert(/^\/agenda\?novo=\d{4}-\d{2}-\d{2}$/.test(newHref), "NEW_COMMITMENT_LINK_INVALID");
    await client.send("Page.navigate", { url: new URL(newHref, qa.baseUrl).toString() });
    await waitFor(client, "document.querySelector('.agenda-form-modal')", 20000);
    const modalOverflow = await evaluate(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
    assert(modalOverflow <= 1, "NEW_COMMITMENT_MODAL_OVERFLOW");

    const report = { status: "PASS", environment: "LOCAL_QA", viewports: results, isolatedFailure: isolated, newCommitmentDeepLink: "PASS" };
    writeFileSync(join(evidenceDir, "results.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
  } finally {
    client.close();
  }
} finally {
  chrome?.kill();
  devServer?.kill();
}

async function ensureFrontend() {
  if (await responds(qa.baseUrl)) return;
  devServer = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1"], {
    stdio: "pipe",
    shell: false,
    env: { ...process.env, VITE_SUPABASE_URL: runtime.apiUrl, VITE_SUPABASE_ANON_KEY: runtime.anonKey },
  });
  for (let elapsed = 0; elapsed < 45000; elapsed += 500) {
    if (await responds(qa.baseUrl)) return;
    await sleep(500);
  }
  throw new Error("CYCLE_3_FRONTEND_LOCAL_UNAVAILABLE");
}

async function startChrome() {
  const chromePath = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  const userDataDir = join(process.env.TEMP || process.env.TMP || ".", `aruka-cycle3-qa-${process.pid}`);
  const child = spawn(chromePath, ["--headless=new", "--disable-gpu", "--no-first-run", `--user-data-dir=${userDataDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false });
  for (let elapsed = 0; elapsed < 15000; elapsed += 250) {
    if (await responds(`http://127.0.0.1:${cdpPort}/json/version`)) return child;
    await sleep(250);
  }
  throw new Error("CYCLE_3_CHROME_CDP_UNAVAILABLE");
}

async function authenticate(client) {
  await setViewport(client, { width: 1280, height: 800, mobile: false });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')", 20000);
  await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"]');
    const password = document.querySelector('input[type="password"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(email, ${JSON.stringify(process.env.QA_USER_EMAIL || "")}); email.dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(password, ${JSON.stringify(process.env.QA_USER_PASSWORD || "")}); password.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('button[type="submit"]')?.click(); return true;
  })()`);
  await waitFor(client, "!location.pathname.includes('/login')", 20000);
  await evaluate(client, "localStorage.setItem('aruka_pwa_install_hide_banner', 'true'); true");
}

async function navigateDashboard(client) {
  await evaluate(client, "document.documentElement.dataset.qaOldDocument = 'true'; true");
  await client.send("Page.navigate", { url: `${qa.baseUrl}/dashboard` });
  await sleep(350);
  await waitFor(client, "document.documentElement.dataset.qaOldDocument !== 'true'", 20000);
  await waitFor(client, "document.querySelector('.dashboard-today-agenda') && document.querySelector('.dashboard-operational-section')", 20000);
  await waitFor(client, "!document.querySelector('.dashboard-agenda-skeleton')", 20000);
  await sleep(350);
  await waitFor(client, "document.querySelector('.dashboard-today-agenda') && document.querySelector('.dashboard-operational-section')", 20000);
  await waitFor(client, "!document.querySelector('.dashboard-agenda-skeleton')", 20000);
}

async function inspect(client, viewport) {
  return evaluate(client, `(() => {
    const root = document.documentElement;
    const hero = document.querySelector('.page-hero');
    const agenda = document.querySelector('.dashboard-today-agenda');
    const operational = document.querySelector('.dashboard-operational-section');
    const actions = document.querySelector('.dashboard-today-agenda-actions');
    const links = [...(actions?.querySelectorAll('a') || [])];
    const page = document.querySelector('.dashboard-page');
    const sidebar = document.querySelector('.app-sidebar');
    const rect = agenda?.getBoundingClientRect();
    const sidebarRect = sidebar?.getBoundingClientRect();
    return {
      id: ${JSON.stringify(viewport.id)},
      horizontalOverflow: root.scrollWidth - root.clientWidth,
      orderIsCorrect: Boolean(hero && agenda && operational && hero.getBoundingClientRect().top < agenda.getBoundingClientRect().top && agenda.getBoundingClientRect().top < operational.getBoundingClientRect().top),
      elementOrder: [hero, agenda, operational].map((element) => element?.getBoundingClientRect().top ?? null),
      panelInsideViewport: Boolean(rect && rect.left >= -1 && rect.right <= root.clientWidth + 1),
      itemCount: document.querySelectorAll('.dashboard-agenda-item').length,
      ctaTargetsValid: links.some((link) => link.getAttribute('href') === '/agenda') && links.some((link) => (link.getAttribute('href') || '').startsWith('/agenda?novo=')),
      mobileActionsStacked: ${viewport.mobile ? "Boolean(actions && getComputedStyle(actions).display === 'grid' && links.every((link) => link.getBoundingClientRect().width > 0))" : "true"},
      desktopClearOfSidebar: !sidebar || !page || getComputedStyle(sidebar).display === 'none' || sidebarRect.width === 0 || sidebarRect.right <= 0 || page.getBoundingClientRect().top >= sidebarRect.bottom - 1 || page.getBoundingClientRect().left >= sidebarRect.right - 1,
      fatalText: /erro fatal|failed to fetch|\\bundefined\\b|\\bNaN\\b|Invalid Date/i.test(document.body.innerText),
    };
  })()`);
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
}

async function screenshot(client, path) {
  const result = await client.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(path, Buffer.from(result.data, "base64"));
}

async function getWebSocketUrl() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (!response.ok) throw new Error("CYCLE_3_CDP_TARGET_UNAVAILABLE");
  return (await response.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }),
    send(method, params = {}) { const id = ++nextId; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); },
    close() { socket.close(); },
  };
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) {
    const detail = response.exceptionDetails.exception?.description || response.exceptionDetails.text || "CYCLE_3_CDP_EVALUATION_FAILED";
    throw new Error(detail);
  }
  return response.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(200);
  }
  throw new Error(`CYCLE_3_TIMEOUT: ${expression}`);
}

async function responds(url) { try { return (await fetch(url)).ok; } catch { return false; } }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function assert(condition, code) { if (!condition) throw new Error(code); }
