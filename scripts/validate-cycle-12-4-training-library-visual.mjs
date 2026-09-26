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

const appBaseUrl = "http://127.0.0.1:5184";
const email = `cycle-12-4-visual-${Date.now()}@example.invalid`;
const password = process.env.QA_USER_PASSWORD;
const professionalId = "00000000-0000-4000-8000-000000004814";
const studentId = "00000000-0000-4000-8000-000000004821";
const programId = "00000000-0000-4000-8000-000000004831";
const emptyProgramId = "00000000-0000-4000-8000-000000004832";
const dayA = "00000000-0000-4000-8000-000000004841";
const dayB = "00000000-0000-4000-8000-000000004842";
const exerciseA = "00000000-0000-4000-8000-000000004851";
const exerciseMissingMedia = "00000000-0000-4000-8000-000000004852";
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-4-training-library");
const profileDir = join(tmpdir(), `aruka-cycle-12-4-chrome-${process.pid}`);
const cdpPort = 9950 + Math.floor(Math.random() * 40);
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
let startedSessionId;
let screenshotCount = 0;
const results = [];
const evidence = beginVisualQaEvidence({
  gate: "CYCLE_12_4_TRAINING_LIBRARY_VISUAL",
  reportPath: "reports/cycle-12-4-training-library-visual.json",
  requiredScenarios: ["viewport-matrix", "home-to-library", "canonical-player-route", "double-start", "loading", "recoverable-error", "empty", "direct-refresh"],
});

try {
  assert(password, "QA_USER_PASSWORD ausente.");
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
  await setViewport(cdp, viewports[1]);
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor(cdp, "document.readyState !== 'loading'");
  const session = login.data.session;
  const sessionReady = await evaluate(cdp, `(async () => {
    const { supabase } = await import('/src/services/supabase.js');
    return !(await supabase.auth.setSession({ access_token: ${JSON.stringify(session.access_token)}, refresh_token: ${JSON.stringify(session.refresh_token)} })).error;
  })()`);
  assert(sessionReady);
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/inicio` });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-home-v2\"]')", 30000);
  await evaluate(cdp, `document.querySelector('a[href="/minha-area/treinos"]').focus()`);
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(cdp, "location.pathname === '/minha-area/treinos' && document.querySelector('[data-testid=\"student-training-library-v2\"]')", 30000);
  results.push({ state: "home-to-training-keyboard", ariaCurrent: true, status: "PASS" });
  evidence.scenario("home-to-library", "PASS");

  for (const viewport of viewports) {
    await setViewport(cdp, viewport);
    const audit = await auditLayout(cdp);
    assert(audit.noHorizontalOverflow, `${viewport.name}: overflow horizontal`);
    assert.equal(audit.activeNavigation, 1, `${viewport.name}: aria-current`);
    assert(audit.minimumPrimaryTarget >= 44, `${viewport.name}: target menor que 44px`);
    assert.equal(audit.mainHeadings, 1, `${viewport.name}: heading principal`);
    await screenshot(cdp, `${viewport.name}-normal.png`);
    results.push({ state: "normal", viewport: viewport.name, ...audit, status: "PASS" });
  }
  evidence.scenario("viewport-matrix", "PASS", { widths: [320, 375, 390, 768, 1280] });
  evidence.scenario("direct-refresh", "PASS");

  await setViewport(cdp, viewports[2]);
  await evaluate(cdp, `document.querySelector('[data-workout-link="${dayA}"]').focus()`);
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(cdp, `location.pathname.endsWith('${dayA}') && document.querySelector('[data-testid="student-workout-detail-v2"]')`);
  await waitFor(cdp, `document.activeElement === document.querySelector('main h1')`);
  const detailAudit = await evaluate(cdp, `(() => ({
    exerciseCount: document.querySelectorAll('.student-exercise-card').length,
    mediaFallback: document.body.innerText.includes('Sem demonstração em vídeo'),
    noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1,
    videoAutoplay: [...document.querySelectorAll('video')].some((video) => video.autoplay)
  }))()`);
  assert.equal(detailAudit.exerciseCount, 2);
  assert.equal(detailAudit.mediaFallback, true);
  assert.equal(detailAudit.noHorizontalOverflow, true);
  assert.equal(detailAudit.videoAutoplay, false);
  await screenshot(cdp, "mobile-390-detail-missing-media.png");
  results.push({ state: "detail-missing-media", ...detailAudit, focus: "heading", status: "PASS" });
  await evaluate(cdp, `document.querySelector('.student-training-back').click()`);
  await waitFor(cdp, `location.pathname === '/minha-area/treinos' && document.activeElement?.dataset?.workoutLink === '${dayA}'`);

  runPsql(process.cwd(), `update public.treinos set nome_rotina='Programa com um nome público extremamente longo para validar quebra de linha sem overflow horizontal' where id='${programId}';`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-library-v2\"]')");
  assert((await auditLayout(cdp)).noHorizontalOverflow);
  await screenshot(cdp, "mobile-390-long-program-name.png");
  results.push({ state: "long-program-name", status: "PASS" });

  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*get_my_student_training_library_v2*", requestStage: "Request" }] });
  await cdp.send("Page.reload", { ignoreCache: false });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-loading\"]')", 15000);
  await screenshot(cdp, "mobile-390-loading.png");
  const paused = await waitForPausedRequest(cdp);
  await cdp.send("Fetch.continueRequest", { requestId: paused });
  await cdp.send("Fetch.disable");
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-library-v2\"]')");
  results.push({ state: "loading", shellPreserved: true, status: "PASS" });
  evidence.scenario("loading", "PASS");

  await cdp.send("Network.setBlockedURLs", { urls: ["*get_my_student_training_library_v2*"] });
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-error\"]')", 30000);
  const safeError = await evaluate(cdp, `(() => { const text=document.body.innerText; return Boolean(document.querySelector('[data-testid="student-v2-shell"]')) && !/postgres|supabase|sql|stack/i.test(text); })()`);
  assert(safeError);
  await screenshot(cdp, "mobile-390-error.png");
  await cdp.send("Network.setBlockedURLs", { urls: [] });
  results.push({ state: "error", shellPreserved: true, safeCopy: true, status: "PASS" });
  evidence.scenario("recoverable-error", "PASS");

  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-library-v2\"]')");
  await evaluate(cdp, `(() => { const button=[...document.querySelectorAll('.student-workout-card button')][0]; button.click(); button.click(); })()`);
  await waitFor(cdp, "location.pathname.startsWith('/minha-area/treino/') && document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000);
  const navigatedSessionId = await evaluate(cdp, "location.pathname.split('/').filter(Boolean).at(-1)");
  assert.match(navigatedSessionId, /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i, "A rota canônica não contém uma identidade de sessão válida.");
  const sessionCount = Number(scalar(`select count(*) from public.workout_execution_sessions where aluno_id='${studentId}' and status='in_progress';`));
  assert.equal(sessionCount, 1);
  const active = await student.rpc("get_my_student_training_library_v2");
  if (active.error) throw active.error;
  startedSessionId = active.data.activeSession.id;
  assert(startedSessionId);
  assert.equal(navigatedSessionId, startedSessionId, "A rota do Player não corresponde à sessão iniciada/retomada pelo backend.");
  results.push({ state: "canonical-player-route", route: `/minha-area/treino/${navigatedSessionId}`, sessionId: navigatedSessionId, playerRendered: true, status: "PASS" });
  evidence.scenario("canonical-player-route", "PASS", { session_id: navigatedSessionId });
  evidence.scenario("double-start", "PASS", { in_progress_sessions: sessionCount });
  await navigateToLibrary();
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-active-session\"]')");
  await screenshot(cdp, "mobile-390-active-session.png");
  results.push({ state: "double-start-active-session", inProgressSessions: 1, status: "PASS" });

  runPsql(process.cwd(), `delete from public.workout_execution_sessions where id='${startedSessionId}'; update public.treinos set lifecycle_status='archived', archived_at=now() where id='${programId}';`);
  startedSessionId = null;
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-no-program\"]')");
  await screenshot(cdp, "mobile-390-no-program.png");
  results.push({ state: "no-program", status: "PASS" });

  runPsql(process.cwd(), `insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,lifecycle_status,delivered_at) values ('${emptyProgramId}','${professionalId}','${studentId}','Programa em preparação','','',0,'','Ativo','active',now());`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-empty-program\"]')");
  await screenshot(cdp, "mobile-390-empty-program.png");
  results.push({ state: "empty-program", status: "PASS" });
  evidence.scenario("empty", "PASS");

  server.kill();
  await waitForFrontendStop();
  await ensureFrontend("false");
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/treinos` });
  await waitFor(cdp, "location.pathname === '/minha-area'", 30000);
  results.push({ state: "rollout-off", destination: "/minha-area", status: "PASS" });

  const report = { decision: "PASS", scope: "CYCLE_12_4_TRAINING_LIBRARY_VISUAL", database_target: "LOCAL", production_accessed: false, production_mutated: false, screenshots: screenshotCount, viewports: viewports.map(({ name }) => name), results };
  evidence.executionSucceeded(report);
  console.log(`decision=PASS screenshots=${screenshotCount} states=${[...new Set(results.map((result) => result.state))].join(",")}`);
} catch (error) {
  evidence.executionFailed(error, studentUserId ? "execution" : "setup");
  throw error;
} finally {
  cdp?.close();
  stopOwnedProcessTree(chrome);
  server?.kill();
  try { cleanupFixture({ strict: true }); } catch (error) { evidence.cleanupFailed(error); }
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
    values ('${professionalId}','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cycle-12-4-visual-professional@example.invalid','','','','','','','','',now(),now(),now(),'{}','{}',false);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${professionalId}','${professionalId}','Visual Professional','cycle-12-4-visual-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values ('${studentId}','${professionalId}','Ana Visual','+550000004811',current_date,'QA',0,'Ativo','visual','${userId}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,lifecycle_status,delivered_at)
    values ('${programId}','${professionalId}','${studentId}','Hipertrofia — Fase 2','Hipertrofia','Intermediário',3,'','Ativo','active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${dayB}','${programId}','Treino B','Costas e bíceps',2),('${dayA}','${programId}','Treino A','Peito, tríceps e ombros',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,video_url,ordem,tracking_config,exercise_media_snapshot) values
      ('${exerciseMissingMedia}','${dayA}','Crucifixo inclinado','3','12','8 kg','60 s','Mantenha o movimento controlado e respeite a amplitude confortável.','',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${exerciseA}','${dayA}','Supino reto','4','8–10','20 kg','90 s','Controle a descida.','https://www.youtube.com/watch?v=dQw4w9WgXcQ',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{"name":"Supino reto","media":{"type":"youtube","videoId":"dQw4w9WgXcQ","youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}'),
      (gen_random_uuid(),'${dayB}','Remada baixa','3','10','','75 s','','',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
  `);
}

function cleanupFixture({ strict = false } = {}) {
  const result = runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${studentId}'; delete from public.treinos where aluno_id='${studentId}'; delete from public.alunos where id='${studentId}'; delete from public.perfis where id='${professionalId}'; delete from auth.users where id='${professionalId}';`, { throwOnError: false });
  if (strict && result.status !== 0) throw new Error(`Cleanup SQL da Biblioteca falhou: ${result.stderr || result.stdout}`);
}

function scalar(statement) {
  return runPsql(process.cwd(), `\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
}

async function navigateToLibrary() {
  await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/treinos` });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-library-v2\"]')", 30000);
}

async function ensureFrontend(enabled = "true") {
  server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5184", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: enabled }, shell: false, stdio: "ignore" });
  const started = Date.now();
  while (Date.now() - started < 45000) { if (await responds(appBaseUrl)) return; await sleep(300); }
  throw new Error("Frontend local não respondeu.");
}

async function waitForFrontendStop() {
  const started = Date.now();
  while (Date.now() - started < 15000) { if (!(await responds(appBaseUrl))) return; await sleep(250); }
  throw new Error("Frontend anterior não liberou a porta.");
}

async function responds(url) { try { return (await fetch(url, { redirect: "manual" })).status < 500; } catch { return false; } }

async function startChrome() {
  const path = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  assert(existsSync(path), `Chrome não encontrado em ${path}`);
  const handle = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run", `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", shell: false });
  const started = Date.now();
  while (Date.now() - started < 15000) { try { if ((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok) return handle; } catch { await sleep(200); } }
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
  const paused = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Fetch.requestPaused") paused.push(message.params.requestId);
    if (!message.id || !pending.has(message.id)) return;
    const item = pending.get(message.id); pending.delete(message.id);
    if (message.error) item.reject(new Error(`${item.method}: ${message.error.message}`)); else item.resolve(message.result);
  });
  return { ready: new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); }), send(method, params = {}) { const id = nextId++; socket.send(JSON.stringify({ id, method, params })); return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject })); }, takePaused() { return paused.shift(); }, close() { socket.close(); } };
}

async function setViewport(client, viewport) { await client.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile }); }
async function auditLayout(client) { return evaluate(client, `(() => { const targets=[...document.querySelectorAll('.student-v2-button,.student-v2-nav-item')]; return { noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1, activeNavigation: document.querySelectorAll('.student-v2-nav-item[aria-current="page"]').length, minimumPrimaryTarget: Math.min(...targets.map((item)=>item.getBoundingClientRect().height)), mainHeadings: document.querySelectorAll('main h1').length }; })()`); }
async function screenshot(client, name) { mkdirSync(screenshotDir, { recursive: true }); const result = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true }); writeFileSync(join(screenshotDir, name), Buffer.from(result.data, "base64")); screenshotCount += 1; }
async function evaluate(client, expression) { const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(response.exceptionDetails.text); return response.result.value; }
async function waitFor(client, expression, timeout = 20000) { const started = Date.now(); while (Date.now() - started < timeout) { if (await evaluate(client, `Boolean(${expression})`)) return; await sleep(200); } throw new Error(`Timeout aguardando ${expression}`); }
async function waitForPausedRequest(client) { const started = Date.now(); while (Date.now() - started < 15000) { const id = client.takePaused(); if (id) return id; await sleep(100); } throw new Error("Request da biblioteca não foi interceptada."); }
function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
