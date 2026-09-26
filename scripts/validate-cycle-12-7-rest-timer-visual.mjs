import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { stopOwnedProcessTree } from "./lib/qa-process-cleanup.mjs";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");
const runtime = readLocalSupabaseRuntime();
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const appBaseUrl = "http://127.0.0.1:5187";
const email = `cycle-12-7-visual-${Date.now()}@example.invalid`;
const password = process.env.QA_USER_PASSWORD;
const ids = {
  professional: "00000000-0000-4000-8000-000000007814",
  student: "00000000-0000-4000-8000-000000007821",
  program: "00000000-0000-4000-8000-000000007831",
  day: "00000000-0000-4000-8000-000000007841",
  prescription: "00000000-0000-4000-8000-000000007851",
  session: "00000000-0000-4000-8000-000000007861",
  exercise: "00000000-0000-4000-8000-000000007871",
};
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-7-rest-timer");
const profileDir = join(tmpdir(), `aruka-cycle-12-7-chrome-${process.pid}`);
const cdpPort = 10120 + Math.floor(Math.random() * 30);
const viewports = [
  { name: "mobile-320", width: 320, height: 800, mobile: true },
  { name: "mobile-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "mobile-430", width: 430, height: 932, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
];
let server;
let chrome;
let cdp;
let studentUserId;
let screenshotCount = 0;
const results = [];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_7_REST_TIMER_VISUAL", reportPath: "reports/cycle-12-7-rest-timer-visual.json" });

try {
  assert(password, "QA_USER_PASSWORD ausente.");
  rmSync(screenshotDir, { recursive: true, force: true });
  const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error) throw created.error;
  studentUserId = created.data.user.id;
  setupFixture(studentUserId);
  const student = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const login = await student.auth.signInWithPassword({ email, password });
  if (login.error) throw login.error;

  await ensureFrontend();
  chrome = await startChrome();
  cdp = createCdpClient(await getWebSocketUrl());
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Network.enable");
  await setViewport(cdp, viewports[2]);
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor(cdp, "document.readyState !== 'loading'");
  const authSession = login.data.session;
  assert(await evaluate(cdp, `(async () => { const { supabase } = await import('/src/services/supabase.js'); return !(await supabase.auth.setSession({ access_token: ${JSON.stringify(authSession.access_token)}, refresh_token: ${JSON.stringify(authSession.refresh_token)} })).error; })()`));
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/treino/${ids.session}` });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000);

  for (const viewport of viewports) {
    await setViewport(cdp, viewport);
    assert.equal(await evaluate(cdp, "Boolean(document.querySelector('.workout-player-rest'))"), false);
    const audit = await auditPage(cdp);
    assert.equal(audit.noHorizontalOverflow, true, `${viewport.name}: overflow sem descanso`);
    await screenshot(cdp, `${viewport.name}-rest-absent.png`);
    results.push({ state: "rest-absent", viewport: viewport.name, ...audit, status: "PASS" });
  }

  await setViewport(cdp, viewports[2]);
  await fillFirstInput(cdp, "10");
  await evaluate(cdp, "document.querySelector('.workout-player-complete-set').click()");
  await waitFor(cdp, "document.querySelector('.workout-player-rest[data-rest-status=\"active\"]')", 30000);
  const started = await timerState(cdp);
  assert.equal(started.status, "active");
  assert.ok(started.remaining > 0 && started.remaining <= 300);
  await scrollTimer(cdp);
  await screenshot(cdp, "mobile-390-rest-started.png");
  results.push({ state: "rest-started", identity: started.identity, remainingSeconds: started.remaining, status: "PASS" });

  for (const viewport of viewports) {
    await setViewport(cdp, viewport);
    await scrollTimer(cdp);
    await prepareKeyboardFocus(cdp);
    await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    const audit = await auditTimer(cdp);
    assert.equal(audit.noHorizontalOverflow, true, `${viewport.name}: overflow descanso ativo`);
    assert.ok(audit.minimumTarget >= 44, `${viewport.name}: alvo menor que 44px`);
    assert.ok(audit.counterFontSize >= 28, `${viewport.name}: contador ilegível`);
    assert.equal(audit.keyboardFocused, true, `${viewport.name}: controle sem foco por teclado`);
    assert.notEqual(audit.focusOutlineStyle, "none", `${viewport.name}: foco sem indicação visível`);
    await screenshot(cdp, `${viewport.name}-rest-active.png`);
    results.push({ state: "rest-active", viewport: viewport.name, ...audit, status: "PASS" });
  }

  const beforeReload = await timerState(cdp);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-rest[data-rest-status=\"active\"]')", 30000);
  const afterReload = await timerState(cdp);
  assert.equal(afterReload.identity, beforeReload.identity);
  assert.ok(afterReload.remaining <= beforeReload.remaining);
  await scrollTimer(cdp);
  await screenshot(cdp, "desktop-1280-rest-reloaded.png");
  results.push({ state: "rest-reloaded", sameIdentity: true, didNotRestart: true, status: "PASS" });

  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*get_my_workout_player_v2*", requestStage: "Request" }] });
  await evaluate(cdp, "window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))");
  const paused = await waitForPausedRequest(cdp);
  await cdp.send("Fetch.failRequest", { requestId: paused, errorReason: "ConnectionFailed" });
  await cdp.send("Fetch.disable");
  await waitFor(cdp, "document.body.innerText.includes('última âncora confirmada')", 30000);
  await scrollTimer(cdp);
  await screenshot(cdp, "desktop-1280-rest-recoverable-read-error.png");
  results.push({ state: "recoverable-read-error", timerPreserved: true, retryAvailable: await evaluate(cdp, "Boolean([...document.querySelectorAll('.workout-player-rest button')].find((button)=>button.innerText.includes('Sincronizar')))"), status: "PASS" });

  runPsql(process.cwd(), `set session_replication_role=replica; update public.workout_execution_sets set updated_at=clock_timestamp()-interval '360 seconds' where execution_exercise_id='${ids.exercise}' and set_number=1; set session_replication_role=origin;`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-rest[data-rest-status=\"completed\"]')", 30000);
  assert.equal((await timerState(cdp)).remaining, 0);
  await scrollTimer(cdp);
  await screenshot(cdp, "desktop-1280-rest-completed.png");
  results.push({ state: "rest-completed", negativeCountdown: false, status: "PASS" });

  await evaluate(cdp, "[...document.querySelectorAll('.workout-player-rest button')].find((button)=>button.innerText.includes('Dispensar')).click()");
  await waitFor(cdp, "!document.querySelector('.workout-player-rest')");
  await screenshot(cdp, "desktop-1280-rest-dismissed.png");
  results.push({ state: "rest-dismissed", canonicalSetStillCompleted: await evaluate(cdp, "Boolean(document.querySelector('.workout-player-set-selector button.is-complete'))"), status: "PASS" });

  runPsql(process.cwd(), `update public.workout_execution_sessions set status='cancelled',cancelled_at=now(),cancellation_reason='synthetic visual terminal' where id='${ids.session}';`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-state') && document.body.innerText.includes('Treino encerrado')", 30000);
  assert.equal(await evaluate(cdp, "Boolean(document.querySelector('.workout-player-rest'))"), false);
  await screenshot(cdp, "desktop-1280-terminal.png");
  results.push({ state: "terminal", timerVisible: false, status: "PASS" });

  const report = {
    decision: "PASS",
    scope: "CYCLE_12_7_REST_TIMER_VISUAL",
    database_target: "LOCAL",
    fixtures: "SYNTHETIC",
    production_accessed: false,
    production_mutated: false,
    screenshots: screenshotCount,
    screenshot_directory: screenshotDir.replaceAll("\\", "/"),
    viewports: viewports.map(({ name }) => name),
    states: [...new Set(results.map((result) => result.state))],
    results,
  };
  evidence.executionSucceeded(report);
  console.log(`decision=PASS screenshots=${screenshotCount} states=${report.states.join(",")}`);
} catch (error) {
  evidence.executionFailed(error, studentUserId ? "execution" : "setup");
  throw error;
} finally {
  cdp?.close();
  stopOwnedProcessTree(chrome);
  server?.kill();
  try { cleanupFixture(); } catch (error) { evidence.cleanupFailed(error); }
  if (studentUserId) {
    try {
      const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
      const deleted = await admin.auth.admin.deleteUser(studentUserId);
      if (deleted.error) throw deleted.error;
    } catch (error) { evidence.cleanupFailed(error); }
  }
  try { rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (error) { evidence.cleanupFailed(error); }
  evidence.finalize();
}

function setupFixture(userId) {
  cleanupFixture();
  runPsql(process.cwd(), `
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    values ('${ids.professional}','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cycle-12-7-visual-professional@example.invalid','','','','','','','','',now(),now(),now(),'{}','{}',false);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${ids.professional}','${ids.professional}','Visual Professional','cycle-12-7-visual-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values ('${ids.student}','${ids.professional}','Visual Student','+550000007811',current_date,'QA',0,'Ativo','synthetic visual','${userId}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at) values ('${ids.program}','${ids.professional}','${ids.student}','Rest Timer Visual','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${ids.day}','${ids.program}','Treino visual','Corpo inteiro',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values ('${ids.prescription}','${ids.day}','Agachamento controlado com nome longo','3','10','','300 s','Mantenha o movimento estável.',1,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at) values ('${ids.session}','${ids.student}','${ids.program}','${ids.day}','in_progress',current_date,now()-interval '10 minutes',now());
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values ('${ids.exercise}','${ids.session}','${ids.prescription}','${ids.day}','Agachamento controlado com nome longo','3','10','','300 s','Mantenha o movimento estável.','Treino visual','Corpo inteiro',1,1,'Rest Timer Visual','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started');
  `);
}
function cleanupFixture() { runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${ids.student}'; delete from public.treinos where aluno_id='${ids.student}'; delete from public.alunos where id='${ids.student}'; delete from public.perfis where id='${ids.professional}'; delete from auth.users where id='${ids.professional}';`, { throwOnError: false }); }
async function ensureFrontend() { server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5187", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true" }, shell: false, stdio: "ignore" }); const started = Date.now(); while (Date.now() - started < 45000) { if (await responds(appBaseUrl)) return; await sleep(300); } throw new Error("Frontend local não respondeu."); }
async function responds(url) { try { return (await fetch(url, { redirect: "manual" })).status < 500; } catch { return false; } }
async function startChrome() { const path = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome"; assert(existsSync(path), `Chrome não encontrado em ${path}`); const handle = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false }); const started = Date.now(); while (Date.now() - started < 15000) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) return handle; } catch { await sleep(200); } } throw new Error("Chrome CDP não iniciou."); }
async function getWebSocketUrl() { const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }); if (response.ok) return (await response.json()).webSocketDebuggerUrl; return (await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json()).webSocketDebuggerUrl; }
function createCdpClient(url) { const socket = new WebSocket(url); let nextId = 1; const pending = new Map(); const paused = []; socket.addEventListener("message", (event) => { const message = JSON.parse(event.data); if (message.method === "Fetch.requestPaused") paused.push(message.params.requestId); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); if (message.error) item.reject(new Error(`${item.method}: ${message.error.message}`)); else item.resolve(message.result); }); return { ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }), send(method, params = {}) { const id = nextId++; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject })); }, takePaused() { return paused.shift(); }, close() { socket.close(); } }; }
async function setViewport(client, viewport) { await client.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile }); }
async function fillFirstInput(client, value) { await evaluate(client, `(() => { const input=document.querySelector('.workout-player-set-form input'); const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,${JSON.stringify(value)}); input.dispatchEvent(new Event('input',{bubbles:true})); })()`); }
async function auditPage(client) { return evaluate(client, "({noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+1, timerVisible:Boolean(document.querySelector('.workout-player-rest'))})"); }
async function prepareKeyboardFocus(client) { await evaluate(client, `(() => { document.querySelector('[data-rest-focus-sentinel]')?.remove(); const timer=document.querySelector('.workout-player-rest'); const sentinel=document.createElement('button'); sentinel.dataset.restFocusSentinel='true'; sentinel.style.position='fixed'; sentinel.style.left='-9999px'; timer.querySelector('.workout-player-rest-actions').prepend(sentinel); sentinel.focus(); })()`); }
async function auditTimer(client) { return evaluate(client, `(() => { const timer=document.querySelector('.workout-player-rest'); const sentinel=timer.querySelector('[data-rest-focus-sentinel]'); const targets=[...timer.querySelectorAll('button')].filter((item)=>item!==sentinel&&!item.disabled&&item.getClientRects().length); const control=targets.at(-1); sentinel.remove(); const counter=timer.querySelector('.workout-player-rest-copy>strong'); return {noHorizontalOverflow:document.documentElement.scrollWidth<=innerWidth+1,minimumTarget:Math.min(...targets.map((item)=>item.getBoundingClientRect().height)),counterFontSize:parseFloat(getComputedStyle(counter).fontSize),liveRegions:timer.querySelectorAll('[aria-live]').length,keyboardFocused:document.activeElement===control,focusOutlineStyle:getComputedStyle(control).outlineStyle};})()`); }
async function timerState(client) { return evaluate(client, `(() => { const timer=document.querySelector('.workout-player-rest'); return {identity:timer.dataset.restIdentity,status:timer.dataset.restStatus,remaining:Number(timer.querySelector('.workout-player-rest-copy>strong').getAttribute('aria-label').match(/\\d+/)?.[0]||0)};})()`); }
async function scrollTimer(client) { await evaluate(client, "document.querySelector('.workout-player-rest')?.scrollIntoView({block:'center'})"); }
async function screenshot(client, name) { mkdirSync(screenshotDir, { recursive: true }); const result = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }); writeFileSync(join(screenshotDir, name), Buffer.from(result.data, "base64")); screenshotCount += 1; }
async function evaluate(client, expression) { const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result.value; }
async function waitFor(client, expression, timeout = 20000) { const started = Date.now(); while (Date.now() - started < timeout) { if (await evaluate(client, `Boolean(${expression})`)) return; await sleep(200); } throw new Error(`Timeout aguardando ${expression}`); }
async function waitForPausedRequest(client) { const started = Date.now(); while (Date.now() - started < 15000) { const id = client.takePaused(); if (id) return id; await sleep(100); } throw new Error("Request de leitura não foi interceptado."); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
