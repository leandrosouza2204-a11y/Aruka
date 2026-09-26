import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { stopOwnedProcessTree } from "./lib/qa-process-cleanup.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");
const runtime = readLocalSupabaseRuntime();
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const appBaseUrl = "http://127.0.0.1:5188";
const password = process.env.QA_USER_PASSWORD;
const email = `cycle-12-8-visual-${Date.now()}@example.invalid`;
const ids = {
  professional: "00000000-0000-4000-8000-000000008814",
  student: "00000000-0000-4000-8000-000000008821",
  workout: "00000000-0000-4000-8000-000000008831",
  day: "00000000-0000-4000-8000-000000008841",
  prescription: "00000000-0000-4000-8000-000000008851",
};
const viewports = [
  { name: "mobile-320", width: 320, height: 800, mobile: true },
  { name: "mobile-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
];
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-8-workout-completion-feedback");
const profileDir = join(tmpdir(), `aruka-cycle-12-8-chrome-${process.pid}`);
const cdpPort = 9920 + Math.floor(Math.random() * 25);
const evidence = beginVisualQaEvidence({
  gate: "CYCLE_12_8_WORKOUT_COMPLETION_FEEDBACK_VISUAL",
  reportPath: "reports/cycle-12-8-workout-completion-feedback-visual.json",
  requiredScenarios: ["completed-sets", "short-confirmation", "optional-feedback", "without-feedback", "submitting", "recoverable-error", "duplicate-prevention", "return-to-library", "viewport-matrix", "terminal-state"],
});

let admin;
let studentUserId;
let server;
let chrome;
let cdp;
let screenshotCount = 0;
const results = [];

try {
  assert(password, "QA_USER_PASSWORD ausente.");
  admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (created.error) throw created.error;
  studentUserId = created.data.user.id;
  setupFixture(studentUserId);
  const shortSessionId = createSession("01", 120);

  const auth = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const login = await auth.auth.signInWithPassword({ email, password });
  if (login.error) throw login.error;
  await startFrontend();
  chrome = await startChrome();
  cdp = createCdpClient(await getWebSocketUrl());
  await cdp.ready;
  await cdp.send("Page.enable"); await cdp.send("Runtime.enable"); await cdp.send("Network.enable");
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor("document.readyState !== 'loading'");
  const session = login.data.session;
  assert(await evaluate(`(async()=>{const {supabase}=await import('/src/services/supabase.js');return !(await supabase.auth.setSession(${JSON.stringify({ access_token: session.access_token, refresh_token: session.refresh_token })})).error})()`));
  await navigateToSession(shortSessionId);
  await evaluate("document.querySelector('.workout-player-complete-workout').click()");
  await waitFor("document.querySelector('.workout-player-dialog[open] #workout-player-feedback')");
  await setFeedback("Treino concluído com boa execução.");

  for (const viewport of viewports) {
    await setViewport(viewport);
    const audit = await auditDialog();
    assert.equal(audit.overflow, false, `${viewport.name}: overflow horizontal`);
    assert(audit.minimumTarget >= 44, `${viewport.name}: alvo de toque menor que 44px`);
    assert.equal(audit.focusableDialog, true, `${viewport.name}: diálogo não está nomeado`);
    await screenshot(`${viewport.name}-completion-dialog.png`);
    results.push({ state: "completion-dialog", viewport: viewport.name, ...audit, status: "PASS" });
  }
  evidence.scenario("viewport-matrix", "PASS", { widths: viewports.map(({ width }) => width) });

  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*complete_workout_execution_session_v2*", requestStage: "Request" }] });
  await clickDialogPrimary();
  await waitFor("document.querySelector('.workout-player-dialog[open] button.is-primary').disabled && document.body.innerText.includes('Verificando')");
  await screenshot("mobile-submitting.png");
  evidence.scenario("submitting", "PASS");
  const paused = await waitForPausedRequest();
  await cdp.send("Fetch.continueRequest", { requestId: paused });
  await cdp.send("Fetch.disable");
  await waitFor("document.querySelector('.workout-player-dialog[open]') && document.body.innerText.includes('Confirme para concluir')", 30000);
  evidence.scenario("short-confirmation", "PASS");

  await cdp.send("Network.setBlockedURLs", { urls: ["*complete_workout_execution_session_v2*"] });
  await clickDialogPrimary();
  await waitFor("document.querySelector('.workout-player-completion-error')", 30000);
  assert(await evaluate("document.querySelector('#workout-player-feedback').value.includes('boa execução')"), "Feedback não foi preservado após erro recuperável.");
  await screenshot("mobile-recoverable-error.png");
  evidence.scenario("recoverable-error", "PASS");
  await cdp.send("Network.setBlockedURLs", { urls: [] });

  await clickDialogPrimary();
  await waitFor("document.querySelector('.workout-player-dialog[open]') && document.body.innerText.includes('Confirme para concluir')", 30000);
  await clickDialogPrimary();
  await waitFor("document.querySelector('[data-testid=\"workout-completion-result\"]')", 30000);
  assert.equal(scalar(`select status from public.workout_execution_sessions where id='${shortSessionId}';`), "completed");
  assert.equal(scalar(`select count(*) from public.workout_execution_sets s join public.workout_execution_exercises e on e.id=s.execution_exercise_id where e.session_id='${shortSessionId}' and s.completed;`), "1");
  assert.equal(scalar(`select count(*) from public.workout_execution_session_feedback where session_id='${shortSessionId}';`), "1");
  await screenshot("mobile-completed-with-feedback.png");
  evidence.scenario("completed-sets", "PASS");
  evidence.scenario("optional-feedback", "PASS");
  evidence.scenario("duplicate-prevention", "PASS", { feedback_rows: 1 });
  evidence.scenario("terminal-state", "PASS");

  const noFeedbackSessionId = createSession("02", 400);
  await navigateToSession(noFeedbackSessionId);
  await evaluate("document.querySelector('.workout-player-complete-workout').click()");
  await waitFor("document.querySelector('.workout-player-dialog[open]')");
  await clickDialogPrimary();
  await waitFor("document.querySelector('[data-testid=\"workout-completion-result\"]')", 30000);
  assert.equal(scalar(`select count(*) from public.workout_execution_session_feedback where session_id='${noFeedbackSessionId}';`), "0");
  evidence.scenario("without-feedback", "PASS");
  await evaluate("document.querySelector('[data-testid=\"workout-completion-result\"] button').click()");
  await waitFor("location.pathname === '/minha-area/treinos' && document.querySelector('[data-testid=\"student-training-library-v2\"]')", 30000);
  evidence.scenario("return-to-library", "PASS");
  results.push({ state: "completion-with-feedback", sessionId: shortSessionId, status: "PASS" }, { state: "completion-without-feedback", sessionId: noFeedbackSessionId, status: "PASS" });

  evidence.executionSucceeded({ decision: "PASS", scope: "CYCLE_12_8_WORKOUT_COMPLETION_FEEDBACK_VISUAL", database_target: "LOCAL", fixtures: "SYNTHETIC_SELF_CONTAINED", production_accessed: false, production_mutated: false, screenshots: screenshotCount, viewports: viewports.map(({ width }) => width), results });
  console.log(`decision=PASS screenshots=${screenshotCount} sessions=2`);
} catch (error) {
  evidence.executionFailed(error, studentUserId ? "execution" : "setup");
  throw error;
} finally {
  cdp?.close(); stopOwnedProcessTree(chrome); server?.kill();
  try { cleanupFixture(true); } catch (error) { evidence.cleanupFailed(error); }
  if (admin && studentUserId) { try { const deleted = await admin.auth.admin.deleteUser(studentUserId); if (deleted.error) throw deleted.error; } catch (error) { evidence.cleanupFailed(error); } }
  await sleep(800);
  try { rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch (error) { evidence.cleanupFailed(error); }
  evidence.finalize();
}

function sql(statement, options = {}) { return runPsql(process.cwd(), statement, { ...options, throwOnError: options.throwOnError ?? true }); }
function scalar(statement) { return sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || ""; }
function setupFixture(userId) {
  cleanupFixture(false);
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    values ('${ids.professional}','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cycle-12-8-visual-professional@example.invalid','','','','','','','','',now(),now(),now(),'{}','{}',false);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${ids.professional}','${ids.professional}','Cycle 12.8 Visual','cycle-12-8-visual-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values ('${ids.student}','${ids.professional}','Completion Visual Student','+550000008811',current_date,'QA',0,'Ativo','synthetic','${userId}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at) values ('${ids.workout}','${ids.professional}','${ids.student}','Completion Visual QA','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${ids.day}','${ids.workout}','A','Full body',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values ('${ids.prescription}','${ids.day}','Completion Exercise','1','10','','60 s','synthetic',1,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
  `);
}
function createSession(suffix, elapsedSeconds) {
  const sessionId = `00000000-0000-4000-8000-0000000089${suffix}`;
  const exerciseId = `00000000-0000-4000-8000-0000000088${suffix}`;
  sql(`insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at) values ('${sessionId}','${ids.student}','${ids.workout}','${ids.day}','in_progress',current_date,clock_timestamp()-interval '${elapsedSeconds} seconds',now()); insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values ('${exerciseId}','${sessionId}','${ids.prescription}','${ids.day}','Completion Exercise','1','10','','60 s','synthetic','A','Full body',1,1,'Completion Visual QA','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started'); set request.jwt.claim.sub='${studentUserId}'; set role authenticated; select public.complete_workout_execution_set('${sessionId}','${exerciseId}',1,'{"reps":10}'::jsonb); reset role;`);
  return sessionId;
}
function cleanupFixture(strict) { const result = sql(`delete from public.workout_execution_sessions where treino_id='${ids.workout}'; delete from public.treinos where id='${ids.workout}'; delete from public.alunos where id='${ids.student}'; delete from public.perfis where id='${ids.professional}'; delete from auth.users where id='${ids.professional}';`, { throwOnError: false }); if (strict && result.status !== 0) throw new Error(`Cleanup Cycle 12.8 falhou: ${result.stderr || result.stdout}`); }
async function startFrontend() { server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5188", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true" }, shell: false, stdio: "ignore" }); for (let i = 0; i < 120; i += 1) { try { if ((await fetch(appBaseUrl)).ok) return; } catch { /* wait */ } await sleep(250); } throw new Error("Frontend local não respondeu."); }
async function startChrome() { const path = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome"; assert(existsSync(path), "Chrome ausente."); const handle = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false }); for (let i = 0; i < 60; i += 1) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) return handle; } catch { /* wait */ } await sleep(250); } throw new Error("Chrome CDP não iniciou."); }
async function getWebSocketUrl() { const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" }); return (await response.json()).webSocketDebuggerUrl; }
function createCdpClient(url) { const socket = new WebSocket(url); let nextId = 1; const pending = new Map(); const paused = []; socket.addEventListener("message", (event) => { const message = JSON.parse(event.data); if (message.method === "Fetch.requestPaused") paused.push(message.params.requestId); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); message.error ? item.reject(new Error(message.error.message)) : item.resolve(message.result); }); return { ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }), send(method, params = {}) { const id = nextId++; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { resolve, reject })); }, takePaused() { return paused.shift(); }, close() { socket.close(); } }; }
async function navigateToSession(sessionId) { await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/treino/${sessionId}` }); await waitFor("document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000); }
async function setFeedback(value) { await evaluate(`(()=>{const input=document.querySelector('#workout-player-feedback');const setter=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set;setter.call(input,${JSON.stringify(value)});input.dispatchEvent(new Event('input',{bubbles:true}))})()`); }
async function clickDialogPrimary() { await evaluate("document.querySelector('.workout-player-dialog[open] button.is-primary').click()"); }
async function setViewport(viewport) { await cdp.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile }); await sleep(200); }
async function auditDialog() { return evaluate(`(()=>{const dialog=document.querySelector('.workout-player-dialog[open]');const targets=[...dialog.querySelectorAll('button')];return {overflow:document.documentElement.scrollWidth>innerWidth+1,minimumTarget:Math.min(...targets.map(x=>x.getBoundingClientRect().height)),focusableDialog:Boolean(dialog.getAttribute('aria-labelledby')),feedbackOptional:document.body.innerText.includes('(opcional)')}})()`); }
async function screenshot(name) { mkdirSync(screenshotDir, { recursive: true }); const shot = await cdp.send("Page.captureScreenshot", { format: "png", fromSurface: true }); writeFileSync(join(screenshotDir, name), Buffer.from(shot.data, "base64")); screenshotCount += 1; }
async function evaluate(expression) { const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw new Error(result.exceptionDetails.text); return result.result.value; }
async function waitFor(expression, timeout = 20000) { const started = Date.now(); while (Date.now() - started < timeout) { if (await evaluate(`Boolean(${expression})`)) return; await sleep(200); } throw new Error(`Timeout aguardando ${expression}`); }
async function waitForPausedRequest() { for (let i = 0; i < 150; i += 1) { const id = cdp.takePaused(); if (id) return id; await sleep(100); } throw new Error("Request de conclusão não foi interceptada."); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
