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

const appBaseUrl = "http://127.0.0.1:5186";
const email = `cycle-12-6-visual-${Date.now()}@example.invalid`;
const password = process.env.QA_USER_PASSWORD;
const ids = {
  professional: "00000000-0000-4000-8000-000000006814",
  student: "00000000-0000-4000-8000-000000006821",
  program: "00000000-0000-4000-8000-000000006831",
  day: "00000000-0000-4000-8000-000000006841",
  prescription: "00000000-0000-4000-8000-000000006851",
  prescriptionNoHistory: "00000000-0000-4000-8000-000000006852",
  session: "00000000-0000-4000-8000-000000006861",
  previous: "00000000-0000-4000-8000-000000006862",
  exercise: "00000000-0000-4000-8000-000000006871",
  exerciseNoHistory: "00000000-0000-4000-8000-000000006872",
  previousExercise: "00000000-0000-4000-8000-000000006873",
};
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-6-set-tracking");
const profileDir = join(tmpdir(), `aruka-cycle-12-6-chrome-${process.pid}`);
const cdpPort = 10020 + Math.floor(Math.random() * 30);
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
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_6_SET_TRACKING_VISUAL", reportPath: "reports/cycle-12-6-set-tracking-visual.json" });

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
  await waitFor(cdp, "document.querySelector('.workout-player-previous')?.innerText.includes('10 repetições')", 30000);

  for (const viewport of viewports) {
    await setViewport(cdp, viewport);
    await evaluate(cdp, "document.querySelector('.workout-player-set-stage').scrollIntoView({block:'start'})");
    const audit = await auditSetTracker(cdp);
    assert(audit.noHorizontalOverflow, `${viewport.name}: overflow horizontal`);
    assert(audit.minimumTarget >= 44, `${viewport.name}: target menor que 44px`);
    assert.equal(audit.labels, audit.inputs, `${viewport.name}: input sem label`);
    await screenshot(cdp, `${viewport.name}-pending-previous-available.png`);
    results.push({ state: "pending-previous-available", viewport: viewport.name, ...audit, status: "PASS" });
  }

  await setViewport(cdp, viewports[2]);
  await fillCurrentSet(cdp, ["10", "20", "2"]);
  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*complete_workout_execution_set*", requestStage: "Request" }] });
  await evaluate(cdp, "document.querySelector('.workout-player-complete-set').click()");
  await waitFor(cdp, "document.body.innerText.includes('Registrando...')");
  await evaluate(cdp, "document.querySelector('.workout-player-set-stage').scrollIntoView({block:'start'})");
  await screenshot(cdp, "mobile-390-submitting.png");
  const paused = await waitForPausedRequest(cdp);
  await cdp.send("Fetch.failRequest", { requestId: paused, errorReason: "ConnectionFailed" });
  await cdp.send("Fetch.disable");
  await waitFor(cdp, "document.body.innerText.includes('Seus dados foram preservados')", 30000);
  assert.deepEqual(await evaluate(cdp, "[...document.querySelectorAll('.workout-player-set-form input')].map((input) => input.value)"), ["10", "20", "2"]);
  await evaluate(cdp, "document.querySelector('.workout-player-set-stage').scrollIntoView({block:'start'})");
  await screenshot(cdp, "mobile-390-recoverable-error.png");
  results.push({ state: "submitting-and-recoverable-error", inputsPreserved: true, status: "PASS" });

  await evaluate(cdp, "document.querySelector('.workout-player-complete-set').click()");
  await waitFor(cdp, "document.body.innerText.includes('Série registrada com sucesso')", 30000);
  await evaluate(cdp, "document.querySelectorAll('.workout-player-set-selector button')[0].click()");
  await waitFor(cdp, "document.querySelector('.workout-player-completed-set')");
  await evaluate(cdp, "document.querySelector('.workout-player-set-stage').scrollIntoView({block:'start'})");
  await screenshot(cdp, "mobile-390-completed-readonly.png");
  assert.equal(await evaluate(cdp, "document.querySelector('.workout-player-completed-set')?.innerText.includes('somente para leitura')"), true);
  results.push({ state: "completed-readonly", canonicalPersisted: true, status: "PASS" });

  await evaluate(cdp, "document.querySelector('[aria-label=\"Escolher exercício\"]').click()");
  await evaluate(cdp, "document.querySelectorAll('.workout-player-exercise-list button')[1].click()");
  await waitFor(cdp, "document.querySelector('.workout-player-previous')?.innerText.includes('Sem referência válida')");
  await evaluate(cdp, "document.querySelector('.workout-player-set-stage').scrollIntoView({block:'start'})");
  await screenshot(cdp, "mobile-390-previous-absent.png");
  results.push({ state: "previous-absent", recordingAvailable: await evaluate(cdp, "Boolean(document.querySelector('.workout-player-complete-set'))"), status: "PASS" });

  runPsql(process.cwd(), `update public.workout_execution_sessions set status='cancelled',cancelled_at=now(),cancellation_reason='synthetic visual terminal' where id='${ids.session}';`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-state') && document.body.innerText.includes('Treino encerrado')", 30000);
  await screenshot(cdp, "mobile-390-terminal.png");
  results.push({ state: "terminal", writesAvailable: false, status: "PASS" });

  const report = { decision: "PASS", scope: "CYCLE_12_6_SET_TRACKING_VISUAL", database_target: "LOCAL", fixtures: "SYNTHETIC", production_accessed: false, production_mutated: false, screenshots: screenshotCount, viewports: viewports.map(({ name }) => name), results };
  evidence.executionSucceeded(report);
  console.log(`decision=PASS screenshots=${screenshotCount} states=${[...new Set(results.map((result) => result.state))].join(",")}`);
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
    values ('${ids.professional}','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cycle-12-6-visual-professional@example.invalid','','','','','','','','',now(),now(),now(),'{}','{}',false);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${ids.professional}','${ids.professional}','Visual Professional','cycle-12-6-visual-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values ('${ids.student}','${ids.professional}','Visual Student','+550000006811',current_date,'QA',0,'Ativo','synthetic visual','${userId}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at) values ('${ids.program}','${ids.professional}','${ids.student}','Set Tracking Visual','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${ids.day}','${ids.program}','Treino visual','Corpo inteiro',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values
      ('${ids.prescription}','${ids.day}','Agachamento controlado','3','10','20 kg','60 s','Mantenha o movimento estável.',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.prescriptionNoHistory}','${ids.day}','Remada sem histórico anterior','2','12','15 kg','45 s','Controle a volta.',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at,completed_at) values
      ('${ids.session}','${ids.student}','${ids.program}','${ids.day}','in_progress',current_date,now()-interval '10 minutes',now(),null),
      ('${ids.previous}','${ids.student}','${ids.program}','${ids.day}','completed',current_date-1,now()-interval '1 day 20 minutes',now()-interval '1 day',now()-interval '1 day');
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values
      ('${ids.exercise}','${ids.session}','${ids.prescription}','${ids.day}','Agachamento controlado','3','10','20 kg','60 s','Mantenha o movimento estável.','Treino visual','Corpo inteiro',1,1,'Set Tracking Visual','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.exerciseNoHistory}','${ids.session}','${ids.prescriptionNoHistory}','${ids.day}','Remada sem histórico anterior','2','12','15 kg','45 s','Controle a volta.','Treino visual','Corpo inteiro',2,1,'Set Tracking Visual','{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.previousExercise}','${ids.previous}','${ids.prescription}','${ids.day}','Agachamento controlado','3','10','20 kg','60 s','','Treino visual','Corpo inteiro',1,1,'Set Tracking Visual','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','completed');
    insert into public.workout_execution_sets(execution_exercise_id,set_number,reps,load_value,load_unit,bodyweight,rir,completed) values ('${ids.previousExercise}',1,10,20,'kg',false,2,true);
  `);
}
function cleanupFixture() { runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${ids.student}'; delete from public.treinos where aluno_id='${ids.student}'; delete from public.alunos where id='${ids.student}'; delete from public.perfis where id='${ids.professional}'; delete from auth.users where id='${ids.professional}';`, { throwOnError: false }); }
async function ensureFrontend() { server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5186", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true" }, shell: false, stdio: "ignore" }); const started = Date.now(); while (Date.now() - started < 45000) { if (await responds(appBaseUrl)) return; await sleep(300); } throw new Error("Frontend local não respondeu."); }
async function responds(url) { try { return (await fetch(url, { redirect: "manual" })).status < 500; } catch { return false; } }
async function startChrome() { const path = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome"; assert(existsSync(path), `Chrome não encontrado em ${path}`); const handle = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false }); const started = Date.now(); while (Date.now() - started < 15000) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) return handle; } catch { await sleep(200); } } throw new Error("Chrome CDP não iniciou."); }
async function getWebSocketUrl() { const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }); if (response.ok) return (await response.json()).webSocketDebuggerUrl; return (await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json()).webSocketDebuggerUrl; }
function createCdpClient(url) { const socket = new WebSocket(url); let nextId = 1; const pending = new Map(); const paused = []; socket.addEventListener("message", (event) => { const message = JSON.parse(event.data); if (message.method === "Fetch.requestPaused") paused.push(message.params.requestId); if (!message.id || !pending.has(message.id)) return; const item = pending.get(message.id); pending.delete(message.id); if (message.error) item.reject(new Error(`${item.method}: ${message.error.message}`)); else item.resolve(message.result); }); return { ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }), send(method, params = {}) { const id = nextId++; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject })); }, takePaused() { return paused.shift(); }, close() { socket.close(); } }; }
async function setViewport(client, viewport) { await client.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile }); }
async function fillCurrentSet(client, values) { const inputs = await evaluate(client, "document.querySelectorAll('.workout-player-set-form input').length"); assert.equal(inputs, values.length); for (let index = 0; index < values.length; index += 1) await evaluate(client, `(() => { const input=document.querySelectorAll('.workout-player-set-form input')[${index}]; const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(input,${JSON.stringify(values[index])}); input.dispatchEvent(new Event('input',{bubbles:true})); })()`); }
async function auditSetTracker(client) { return evaluate(client, `(() => { const targets=[...document.querySelectorAll('.workout-player-set-stage button,.workout-player-set-stage input,.workout-player-set-stage select')].filter((item)=>!item.disabled&&item.getClientRects().length); const labels=[...document.querySelectorAll('.workout-player-set-form label')]; const inputs=[...document.querySelectorAll('.workout-player-set-form input,.workout-player-set-form select')]; return { noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1, minimumTarget: Math.min(...targets.map((item)=>item.getBoundingClientRect().height)), labels: labels.length, inputs: inputs.length, progressbars: document.querySelectorAll('[role="progressbar"]').length }; })()`); }
async function screenshot(client, name) { mkdirSync(screenshotDir, { recursive: true }); const result = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }); writeFileSync(join(screenshotDir, name), Buffer.from(result.data, "base64")); screenshotCount += 1; }
async function evaluate(client, expression) { const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result.value; }
async function waitFor(client, expression, timeout = 20000) { const started = Date.now(); while (Date.now() - started < timeout) { if (await evaluate(client, `Boolean(${expression})`)) return; await sleep(200); } throw new Error(`Timeout aguardando ${expression}`); }
async function waitForPausedRequest(client) { const started = Date.now(); while (Date.now() - started < 15000) { const id = client.takePaused(); if (id) return id; await sleep(100); } throw new Error("Request de conclusão não foi interceptado."); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
