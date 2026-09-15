import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const appBaseUrl = "http://127.0.0.1:5183";
const studentEmail = "student.qa.local@aruka.test";
const password = process.env.QA_USER_PASSWORD;
const cdpPort = 9800 + Math.floor(Math.random() * 150);
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-3-student-home");
const profileDir = join(tmpdir(), `aruka-cycle-12-3-chrome-${process.pid}`);
const viewports = [
  { name: "mobile-narrow-320", width: 320, height: 800, mobile: true },
  { name: "mobile-standard-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-wide-430", width: 430, height: 932, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
];

let server;
let chrome;
let client;
let workoutId;
let studentId;
let originalStudentName;
let originalReviewDate;
const results = [];
let screenshotCount = 0;

try {
  assert(password, "QA_USER_PASSWORD ausente.");
  const student = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: login, error: loginError } = await student.auth.signInWithPassword({ email: studentEmail, password });
  if (loginError) throw loginError;
  const { data: initialHome, error: homeError } = await student.rpc("get_my_student_home_v2");
  if (homeError) throw homeError;
  studentId = initialHome.student?.id;
  workoutId = initialHome.currentProgram?.id;
  originalStudentName = initialHome.student?.name || "Student QA Daily Experience";
  originalReviewDate = initialHome.review?.date || null;
  assert(studentId && workoutId && initialHome.todayWorkout?.treinoDiaId, "Fixture visual do aluno incompleta.");
  runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${studentId}'::uuid and status='in_progress';`);

  await ensureFrontend();
  chrome = await startChrome();
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");

  const session = login.session;
  await setViewport(client, viewports[1]);
  await client.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor(client, "document.readyState !== 'loading'");
  const sessionReady = await evaluate(client, `(async () => {
    const { supabase } = await import('/src/services/supabase.js');
    const { error } = await supabase.auth.setSession({
      access_token: ${JSON.stringify(session.access_token)},
      refresh_token: ${JSON.stringify(session.refresh_token)}
    });
    return !error;
  })()`);
  assert(sessionReady, "Sessão do browser não foi estabelecida.");
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/inicio` });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-v2\"]')", 30000);

  for (const viewport of viewports) {
    await setViewport(client, viewport);
    await waitFor(client, "document.querySelector('[data-testid=\"student-home-v2\"]')");
    const audit = await auditLayout(client);
    assert(audit.noHorizontalOverflow, `${viewport.name}: overflow horizontal`);
    assert(audit.activeNavigation === 1, `${viewport.name}: aria-current inválido`);
    assert(audit.minimumNavigationTarget >= 44, `${viewport.name}: target de navegação menor que 44px`);
    assert(audit.mainLandmarks === 1 && audit.navigationLandmarks === 1, `${viewport.name}: invalid landmarks`);
    assert(audit.pageHeadings === 1, `${viewport.name}: invalid primary heading hierarchy`);
    assert(audit.logoutAccessibleName, `${viewport.name}: logout has no accessible name`);
    await screenshot(client, `${viewport.name}-normal.png`);
    results.push({ ...viewport, state: "normal", ...audit, status: "PASS" });
  }

  await evaluate(client, `document.querySelector('a[href="/minha-area/treinos"]').focus()`);
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(client, "location.pathname === '/minha-area/treinos' && document.querySelector('[data-testid=\"student-training-library-v2\"]')");
  const keyboardNavigation = await evaluate(client, `document.querySelector('a[href="/minha-area/treinos"]').getAttribute('aria-current') === 'page'`);
  assert(keyboardNavigation, "Keyboard navigation did not activate Treinos.");
  results.push({ state: "keyboard-navigation", route: "/minha-area/treinos", ariaCurrent: true, status: "PASS" });
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/inicio` });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-v2\"]')");

  runPsql(process.cwd(), `update public.alunos set nome='AlexandredeOliveiraComNomeExtremamenteLongo' where id='${studentId}'::uuid; update public.treinos set data_revisao=(current_date - 1) where id='${workoutId}'::uuid;`);
  await setViewport(client, viewports[0]);
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(client, "document.body.innerText.includes('AlexandredeOliveiraComNomeExtremamenteLongo') && document.body.innerText.includes('Revisão pendente')", 30000);
  const longContentAudit = await auditLayout(client);
  assert(longContentAudit.noHorizontalOverflow, "Long name or overdue review caused horizontal overflow.");
  await screenshot(client, "mobile-narrow-320-long-name-review-overdue.png");
  results.push({ state: "long-name", viewport: "320x800", noHorizontalOverflow: true, status: "PASS" });
  await evaluate(client, `document.querySelector('[data-testid="student-home-review"]').scrollIntoView({ block: 'center' })`);
  await screenshot(client, "mobile-narrow-320-review-overdue.png");
  results.push({ state: "review-overdue", viewport: "320x800", noHorizontalOverflow: true, status: "PASS" });
  restoreProfileFixture();
  await setViewport(client, viewports[2]);
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-v2\"]')");

  const { data: latestHome } = await student.rpc("get_my_student_home_v2");
  const { data: started, error: startError } = await student.rpc("start_workout_execution_session", {
    p_treino_id: workoutId,
    p_treino_dia_id: latestHome.todayWorkout.treinoDiaId,
    p_idempotency_key: `cycle-12-3-visual-${Date.now()}`,
    p_session_date: latestHome.calendar.today,
  });
  if (startError) throw startError;
  assert(started?.id, "Sessão ativa visual não criada.");
  await setViewport(client, viewports[2]);
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-active-session\"]')", 30000);
  await screenshot(client, "mobile-390-active-session.png");
  results.push({ state: "active-session", viewport: "390x844", status: "PASS" });

  runPsql(process.cwd(), `delete from public.workout_execution_sessions where id='${started.id}'::uuid; update public.treinos set lifecycle_status='archived', archived_at=now() where id='${workoutId}'::uuid;`);
  const { data: emptyHome, error: emptyHomeError } = await student.rpc("get_my_student_home_v2");
  if (emptyHomeError) throw emptyHomeError;
  assert(!emptyHome.activeSession && !emptyHome.todayWorkout, "Fixture empty ainda contém treino ou sessão ativa.");
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-no-workout\"]')", 30000);
  await screenshot(client, "mobile-390-empty.png");
  results.push({ state: "empty", viewport: "390x844", status: "PASS" });
  runPsql(process.cwd(), `update public.treinos set lifecycle_status='active', archived_at=null where id='${workoutId}'::uuid;`);

  await client.send("Fetch.enable", { patterns: [{ urlPattern: "*get_my_student_home_v2*", requestStage: "Request" }] });
  await client.send("Page.reload", { ignoreCache: false });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-loading\"]')", 10000);
  await screenshot(client, "mobile-390-loading.png");
  results.push({ state: "loading", viewport: "390x844", status: "PASS" });
  const pausedRequestId = await waitForPausedRequest(client, 10000);
  await client.send("Fetch.continueRequest", { requestId: pausedRequestId });
  await client.send("Fetch.disable");
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-v2\"]')", 30000);

  await client.send("Network.setBlockedURLs", { urls: ["*get_my_student_home_v2*"] });
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor(client, "document.querySelector('[data-testid=\"student-home-error\"]')", 30000);
  await screenshot(client, "mobile-390-error.png");
  const safeError = await evaluate(client, `(() => {
    const text = document.body.innerText || '';
    return !/postgres|supabase|sql|exception|stack/i.test(text) && Boolean(document.querySelector('[data-testid="student-v2-shell"]'));
  })()`);
  assert(safeError, "Estado de erro expôs detalhe técnico ou removeu o shell.");
  results.push({ state: "error", viewport: "390x844", shellPreserved: true, safeCopy: true, status: "PASS" });
  await client.send("Network.setBlockedURLs", { urls: [] });

  server.kill();
  await waitForFrontendStop();
  await ensureFrontend("false");
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/inicio` });
  await waitFor(client, "location.pathname === '/minha-area' && document.querySelector('[data-testid=\"student-daily-page\"]')", 30000);
  results.push({ state: "rollout-off-legacy", route: "/minha-area", status: "PASS" });

  const report = {
    decision: "PASS",
    scope: "CYCLE_12_3_STUDENT_HOME_VISUAL",
    database_target: "LOCAL",
    production_accessed: false,
    production_mutated: false,
    screenshots: screenshotCount,
    states: ["normal", "keyboard-navigation", "long-name", "review-overdue", "active-session", "empty", "loading", "error", "rollout-off-legacy"],
    results,
  };
  mkdirSync("reports", { recursive: true });
  writeFileSync("reports/cycle-12-3-student-home-visual.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(`decision=PASS screenshots=${report.screenshots} states=${report.states.join(",")}`);
} finally {
  if (studentId) {
    try {
      runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${studentId}'::uuid and status='in_progress';`);
      if (workoutId) runPsql(process.cwd(), `update public.treinos set lifecycle_status='active', archived_at=null where id='${workoutId}'::uuid;`);
      restoreProfileFixture();
    } catch {
      // A falha original deve permanecer visível quando o stack local encerra antes do cleanup.
    }
  }
  client?.close();
  chrome?.kill();
  server?.kill();
  await sleep(1000);
  try {
    rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
  } catch {
    // Chrome pode manter handles por alguns instantes no Windows; o cleanup final da missão remove o perfil.
  }
}

async function ensureFrontend(enabled = "true") {
  server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5183", "--strictPort"], {
    env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: enabled },
    shell: false,
    stdio: "ignore",
  });
  const started = Date.now();
  while (Date.now() - started < 45000) {
    if (await responds(appBaseUrl)) return;
    await sleep(400);
  }
  throw new Error("Frontend local não respondeu.");
}

async function responds(url) { try { return (await fetch(url, { redirect: "manual" })).status < 500; } catch { return false; } }

async function waitForFrontendStop() {
  const started = Date.now();
  while (Date.now() - started < 15000) {
    if (!(await responds(appBaseUrl))) return;
    await sleep(250);
  }
  throw new Error("Previous frontend process did not release the QA port.");
}

async function startChrome() {
  const path = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  assert(existsSync(path), `Chrome não encontrado em ${path}`);
  const processHandle = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false });
  const started = Date.now();
  while (Date.now() - started < 15000) {
    try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) return processHandle; } catch { await sleep(250); }
  }
  throw new Error("Chrome CDP não iniciou.");
}

async function getWebSocketUrl() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (response.ok) return (await response.json()).webSocketDebuggerUrl;
  return (await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json()).webSocketDebuggerUrl;
}

function createCdpClient(url) {
  const socket = new WebSocket(url);
  let nextId = 1;
  const pending = new Map();
  const events = [];
  const pausedRequests = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Fetch.requestPaused") pausedRequests.push(message.params.requestId);
    if (message.method === "Runtime.exceptionThrown") {
      events.push(message.params?.exceptionDetails?.exception?.description || message.params?.exceptionDetails?.text || "Runtime exception");
    }
    if (message.method === "Runtime.consoleAPICalled" && message.params?.type === "error") {
      events.push((message.params.args || []).map((arg) => arg.description || arg.value || "").join(" "));
    }
    if (!message.id || !pending.has(message.id)) return;
    const item = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) item.reject(new Error(`${item.method}: ${message.error.message}`));
    else item.resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }),
    send(method, params = {}) { const id = nextId++; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject })); },
    recentEvents() { return events.slice(-5); },
    takePausedRequest() { return pausedRequests.shift(); },
    close() { socket.close(); },
  };
}

async function setViewport(cdp, viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
}

async function auditLayout(cdp) {
  return evaluate(cdp, `(() => {
    const items = [...document.querySelectorAll('.student-v2-nav-item')];
    return {
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
      activeNavigation: items.filter((item) => item.getAttribute('aria-current') === 'page').length,
      minimumNavigationTarget: Math.min(...items.map((item) => item.getBoundingClientRect().height)),
      mainLandmarks: document.querySelectorAll('main').length,
      navigationLandmarks: document.querySelectorAll('nav[aria-label]').length,
      pageHeadings: document.querySelectorAll('main h1').length,
      logoutAccessibleName: Boolean(document.querySelector('button[aria-label="Sair da área do aluno"]')),
    };
  })()`);
}

async function screenshot(cdp, name) {
  mkdirSync(screenshotDir, { recursive: true });
  const result = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, name), Buffer.from(result.data, "base64"));
  screenshotCount += 1;
}

async function waitFor(cdp, expression, timeout = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(cdp, `Boolean(${expression})`)) return;
    await sleep(250);
  }
  const diagnostic = await evaluate(cdp, `({ pathname: location.pathname, title: document.title, text: (document.body?.innerText || '').slice(0, 300) })`);
  throw new Error(`Timeout aguardando ${expression}: ${JSON.stringify({ ...diagnostic, events: cdp.recentEvents() })}`);
}

async function waitForPausedRequest(cdp, timeout = 10000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const requestId = cdp.takePausedRequest();
    if (requestId) return requestId;
    await sleep(100);
  }
  throw new Error("Request da Home não foi interceptada no estado loading.");
}

async function evaluate(cdp, expression) {
  const response = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "Falha no browser.");
  return response.result.value;
}

function assert(condition, message) { if (!condition) throw new Error(message); }
function restoreProfileFixture() {
  if (!studentId || !workoutId || !originalStudentName) return;
  const name = originalStudentName.replaceAll("'", "''");
  const review = originalReviewDate ? `'${originalReviewDate.replaceAll("'", "''")}'::date` : "null";
  runPsql(process.cwd(), `update public.alunos set nome='${name}' where id='${studentId}'::uuid; update public.treinos set data_revisao=${review} where id='${workoutId}'::uuid;`);
}
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
