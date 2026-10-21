import { mkdirSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";

const evidenceDir = join("tmp-responsive-screenshots", "cycle-2-agenda");
const cdpPort = String(9600 + Math.floor(Math.random() * 250));
const viewports = [
  { id: "mobile-320", width: 320, height: 700, mobile: true, expectedView: "Dia" },
  { id: "mobile-360", width: 360, height: 800, mobile: true, expectedView: "Dia" },
  { id: "mobile-375", width: 375, height: 812, mobile: true, expectedView: "Dia" },
  { id: "mobile-390", width: 390, height: 844, mobile: true, expectedView: "Dia" },
  { id: "mobile-412", width: 412, height: 915, mobile: true, expectedView: "Dia" },
  { id: "mobile-430", width: 430, height: 932, mobile: true, expectedView: "Dia" },
  { id: "desktop-1280", width: 1280, height: 800, mobile: false, expectedView: "Semana" },
  { id: "desktop-1440", width: 1440, height: 900, mobile: false, expectedView: "Semana" },
];

loadQaEnvFile();
const runtime = {
  apiUrl: process.env.VITE_SUPABASE_URL || "http://127.0.0.1:54321",
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "",
};
if (!runtime.anonKey) throw new Error("AGENDA_LOCAL_ANON_KEY_MISSING");
const qa = validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
mkdirSync(evidenceDir, { recursive: true });

let devServer;
let chrome;
const failures = [];
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
      await navigateAgenda(client);
      const metrics = await inspectPage(client, viewport);
      results.push(metrics);
      assert(metrics.horizontalOverflow <= 1, `${viewport.id}:HORIZONTAL_OVERFLOW_${metrics.horizontalOverflow}`);
      assert(metrics.heroBeforeToolbar, `${viewport.id}:HERO_ORDER_INVALID`);
      assert(metrics.activeView === viewport.expectedView, `${viewport.id}:DEFAULT_VIEW_${metrics.activeView}`);
      assert(metrics.fatalText === false, `${viewport.id}:FATAL_TEXT`);
      if (viewport.mobile) {
        assert(metrics.bottomNavItems === 5, `${viewport.id}:BOTTOM_NAV_ITEM_COUNT_${metrics.bottomNavItems}`);
        assert(metrics.directAgendaTabs === 0, `${viewport.id}:AGENDA_BECAME_FIXED_TAB`);
        assert(metrics.hasFab, `${viewport.id}:FAB_MISSING`);
      } else {
        assert(metrics.desktopClearOfSidebar, `${viewport.id}:CONTENT_BEHIND_SIDEBAR`);
      }
      await captureScreenshot(client, join(evidenceDir, `${viewport.id}.png`));
    }

    await validateMobileNavigation(client);
    await validateViewSwitches(client);
    await validateModal(client, { width: 320, height: 700, mobile: true }, "modal-mobile-320.png");
    await setViewport(client, { width: 320, height: 500, mobile: true });
    const keyboardMetrics = await inspectOpenModal(client);
    assert(keyboardMetrics.insideViewport, "KEYBOARD_MODAL_OUTSIDE_VIEWPORT");
    assert(keyboardMetrics.footerVisible, "KEYBOARD_MODAL_FOOTER_NOT_VISIBLE");
    assert(keyboardMetrics.bodyScrollable, "KEYBOARD_MODAL_BODY_NOT_SCROLLABLE");
    await captureScreenshot(client, join(evidenceDir, "modal-mobile-keyboard-320x500.png"));
    await closeModal(client);
    await validateModal(client, { width: 1280, height: 800, mobile: false }, "modal-desktop-1280.png");

    const report = { status: failures.length ? "FAIL" : "PASS", environment: "LOCAL_QA", viewports: results, failures };
    writeFileSync(join(evidenceDir, "results.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report, null, 2));
    if (failures.length) process.exitCode = 1;
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
    env: {
      ...process.env,
      VITE_SUPABASE_URL: runtime.apiUrl,
      VITE_SUPABASE_ANON_KEY: runtime.anonKey,
    },
  });
  for (let elapsed = 0; elapsed < 45000; elapsed += 500) {
    if (await responds(qa.baseUrl)) return;
    await sleep(500);
  }
  throw new Error("AGENDA_FRONTEND_LOCAL_UNAVAILABLE");
}

async function startChrome() {
  const chromePath = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  const userDataDir = join(process.env.TEMP || process.env.TMP || ".", `aruka-agenda-qa-${process.pid}`);
  const child = spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: "ignore", shell: false });
  for (let elapsed = 0; elapsed < 15000; elapsed += 250) {
    if (await responds(`http://127.0.0.1:${cdpPort}/json/version`)) return child;
    await sleep(250);
  }
  throw new Error("AGENDA_CHROME_CDP_UNAVAILABLE");
}

async function authenticate(client) {
  await setViewport(client, { width: 1280, height: 800, mobile: false });
  await client.send("Page.navigate", { url: `${qa.baseUrl}/login` });
  await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')", 20000);
  const filled = await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"]');
    const password = document.querySelector('input[type="password"]');
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(email, ${JSON.stringify(process.env.QA_USER_EMAIL || "")});
    email.dispatchEvent(new Event('input', { bubbles: true }));
    setter.call(password, ${JSON.stringify(process.env.QA_USER_PASSWORD || "")});
    password.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('button[type="submit"]')?.click();
    return Boolean(email && password);
  })()`);
  assert(filled, "AGENDA_LOGIN_FORM_UNAVAILABLE");
  await waitFor(client, "!location.pathname.includes('/login')", 20000);
}

async function navigateAgenda(client) {
  await client.send("Page.navigate", { url: `${qa.baseUrl}/agenda` });
  await sleep(1000);
  await waitFor(client, "location.pathname === '/agenda' && document.querySelector('.agenda-page') && document.querySelector('.agenda-toolbar') && !/Verificando acesso|Verificando documentos/.test(document.body.innerText)", 20000);
  await waitFor(client, "!document.body.innerText.includes('Carregando agenda')", 20000);
  await sleep(750);
  await waitFor(client, "document.querySelector('.agenda-toolbar') && !/Verificando acesso|Verificando documentos/.test(document.body.innerText)", 20000);
}

async function inspectPage(client, viewport) {
  return evaluate(client, `(() => {
    const root = document.documentElement;
    const active = [...document.querySelectorAll('.agenda-view-switch button')].find((button) => button.getAttribute('aria-pressed') === 'true');
    const hero = document.querySelector('.page-hero');
    const toolbar = document.querySelector('.agenda-toolbar');
    const bottomItems = [...document.querySelectorAll('.mobile-bottom-nav-item')];
    const sidebar = document.querySelector('.app-sidebar');
    const page = document.querySelector('.agenda-page');
    return {
      id: ${JSON.stringify(viewport.id)},
      width: root.clientWidth,
      height: window.innerHeight,
      horizontalOverflow: root.scrollWidth - root.clientWidth,
      heroBeforeToolbar: Boolean(hero && toolbar && hero.getBoundingClientRect().top < toolbar.getBoundingClientRect().top),
      activeView: active?.textContent.trim() || '',
      bottomNavItems: bottomItems.filter((item) => item.getBoundingClientRect().width > 0).length,
      directAgendaTabs: bottomItems.filter((item) => /Agenda/i.test(item.textContent || '') && item.getBoundingClientRect().width > 0).length,
      hasFab: Boolean(document.querySelector('.agenda-mobile-fab')?.getBoundingClientRect().width),
      desktopClearOfSidebar: !sidebar || !page || page.getBoundingClientRect().left >= sidebar.getBoundingClientRect().right - 1,
      fatalText: /erro fatal|failed to fetch|\\bundefined\\b|\\bNaN\\b|Invalid Date/i.test(document.body.innerText),
    };
  })()`);
}

async function validateMobileNavigation(client) {
  await setViewport(client, { width: 390, height: 844, mobile: true });
  await navigateAgenda(client);
  const opened = await evaluate(client, `(() => {
    const button = [...document.querySelectorAll('.mobile-bottom-nav-item')].find((item) => /Mais/i.test(item.textContent || ''));
    button?.click();
    return Boolean(button);
  })()`);
  assert(opened, "MOBILE_MORE_BUTTON_MISSING");
  await waitFor(client, "[...document.querySelectorAll('.mobile-more-item')].some((item) => /Agenda/i.test(item.textContent || ''))");
  const agendaLink = await evaluate(client, `[...document.querySelectorAll('.mobile-more-item')].find((item) => /Agenda/i.test(item.textContent || ''))?.getAttribute('href')`);
  assert(agendaLink === "/agenda", "MOBILE_MORE_AGENDA_LINK_INVALID");
}

async function validateViewSwitches(client) {
  await setViewport(client, { width: 320, height: 700, mobile: true });
  await navigateAgenda(client);
  for (const label of ["Semana", "Mês", "Dia"]) {
    await evaluate(client, `(() => {
      const button = [...document.querySelectorAll('.agenda-view-switch button')].find((item) => item.textContent.trim() === ${JSON.stringify(label)});
      button?.click();
      return Boolean(button);
    })()`);
    await waitFor(client, `[...document.querySelectorAll('.agenda-view-switch button')].some((item) => item.textContent.trim() === ${JSON.stringify(label)} && item.getAttribute('aria-pressed') === 'true')`);
    const overflow = await evaluate(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
    assert(overflow <= 1, `MOBILE_${label.toUpperCase()}_OVERFLOW_${overflow}`);
  }
}

async function validateModal(client, viewport, filename) {
  await setViewport(client, viewport);
  await navigateAgenda(client);
  const selector = viewport.mobile ? ".agenda-mobile-fab" : ".agenda-new-button";
  await evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.click(); true`);
  await waitFor(client, "document.querySelector('.agenda-form-modal')");
  const metrics = await inspectOpenModal(client);
  assert(metrics.insideViewport, `${viewport.width}:MODAL_OUTSIDE_VIEWPORT`);
  assert(metrics.footerVisible, `${viewport.width}:MODAL_FOOTER_NOT_VISIBLE`);
  assert(metrics.fieldsInsideViewport, `${viewport.width}:MODAL_FIELD_OVERFLOW`);
  assert(metrics.closeNamed, `${viewport.width}:MODAL_CLOSE_UNNAMED`);
  await captureScreenshot(client, join(evidenceDir, filename));
  if (viewport.mobile) return;
  await closeModal(client);
}

async function inspectOpenModal(client) {
  return evaluate(client, `(() => {
    const modal = document.querySelector('.agenda-form-modal');
    const footer = modal?.querySelector('.accessible-modal-footer');
    const body = modal?.querySelector('.accessible-modal-body');
    const rect = modal?.getBoundingClientRect();
    const fieldRects = [...(modal?.querySelectorAll('input,select,textarea,button') || [])].map((item) => item.getBoundingClientRect()).filter((item) => item.width > 0);
    return {
      insideViewport: Boolean(rect && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.top >= -1 && rect.bottom <= innerHeight + 1),
      footerVisible: Boolean(footer && footer.getBoundingClientRect().top >= 0 && footer.getBoundingClientRect().bottom <= innerHeight + 1),
      fieldsInsideViewport: fieldRects.every((item) => item.left >= -1 && item.right <= innerWidth + 1),
      bodyScrollable: Boolean(body && body.scrollHeight > body.clientHeight),
      closeNamed: Boolean(modal?.querySelector('button[aria-label="Fechar modal"]')),
    };
  })()`);
}

async function closeModal(client) {
  await evaluate(client, "document.querySelector('button[aria-label=\"Fechar modal\"]')?.click(); true");
  await waitFor(client, "!document.querySelector('.agenda-form-modal')");
}

function assert(condition, code) {
  if (!condition) failures.push(code);
}

async function setViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
}

async function captureScreenshot(client, path) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
}

async function getWebSocketUrl() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" });
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
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = ++nextId;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    close: () => socket.close(),
  };
}

async function evaluate(client, expression) {
  const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "AGENDA_CDP_EVALUATION_FAILED");
  return response.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return;
    await sleep(200);
  }
  throw new Error(`AGENDA_CDP_TIMEOUT: ${expression}`);
}

async function responds(url) {
  try {
    return (await fetch(url, { redirect: "manual" })).status < 500;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
