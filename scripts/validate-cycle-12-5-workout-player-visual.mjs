import assert from "node:assert/strict";
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
const runtime = readLocalSupabaseRuntime();
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const appBaseUrl = "http://127.0.0.1:5185";
const email = `cycle-12-5-visual-${Date.now()}@example.invalid`;
const password = process.env.QA_USER_PASSWORD;
const professionalId = "00000000-0000-4000-8000-000000005814";
const studentId = "00000000-0000-4000-8000-000000005821";
const programId = "00000000-0000-4000-8000-000000005831";
const dayId = "00000000-0000-4000-8000-000000005841";
const exerciseMedia = "00000000-0000-4000-8000-000000005851";
const exerciseMissing = "00000000-0000-4000-8000-000000005852";
const exerciseLast = "00000000-0000-4000-8000-000000005853";
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-5-workout-player");
const profileDir = join(tmpdir(), `aruka-cycle-12-5-chrome-${process.pid}`);
const cdpPort = 9990 + Math.floor(Math.random() * 30);
const viewports = [
  { name: "mobile-320", width: 320, height: 800, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
];
let server;
let chrome;
let cdp;
let studentUserId;
let sessionId;
let screenshotCount = 0;
const results = [];

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
  const authSession = login.data.session;
  assert(await evaluate(cdp, `(async () => { const { supabase } = await import('/src/services/supabase.js'); return !(await supabase.auth.setSession({ access_token: ${JSON.stringify(authSession.access_token)}, refresh_token: ${JSON.stringify(authSession.refresh_token)} })).error; })()`));

  await cdp.send("Page.navigate", { url: `${appBaseUrl}/minha-area/treinos` });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-training-library-v2\"]')", 30000);
  await evaluate(cdp, `document.querySelector('.student-workout-card button').click()`);
  await waitFor(cdp, "location.pathname.startsWith('/minha-area/treino/') && document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000);
  sessionId = (await evaluate(cdp, "location.pathname.split('/').at(-1)"));
  assert.equal(Number(scalar(`select count(*) from public.workout_execution_sessions where id='${sessionId}' and status='in_progress';`)), 1);
  results.push({ state: "library-start", sessionIdPresent: true, status: "PASS" });

  for (const viewport of viewports) {
    await setViewport(cdp, viewport);
    const audit = await auditPlayer(cdp);
    assert(audit.noHorizontalOverflow, `${viewport.name}: overflow horizontal`);
    assert(audit.minimumTarget >= 44, `${viewport.name}: target menor que 44px (${JSON.stringify(audit.targetSizes)})`);
    assert.equal(audit.mainHeadings, 1, `${viewport.name}: heading principal`);
    assert.equal(audit.progressbars, 1, `${viewport.name}: progressbar`);
    await screenshot(cdp, `${viewport.name}-current-media-prescription.png`);
    results.push({ state: "current-media-prescription", viewport: viewport.name, ...audit, status: "PASS" });
  }

  await setViewport(cdp, viewports[1]);
  await evaluate(cdp, `document.querySelector('[aria-label="Escolher exercício"]').click()`);
  await waitFor(cdp, "document.querySelector('.workout-player-dialog[open]')");
  await screenshot(cdp, "mobile-390-switch-exercise.png");
  await cdp.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await cdp.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await waitFor(cdp, "!document.querySelector('.workout-player-dialog[open]')");
  assert(await evaluate(cdp, `document.activeElement?.getAttribute('aria-label') === 'Escolher exercício'`));
  results.push({ state: "switch-dialog-keyboard", escape: "PASS", focusReturn: "PASS", status: "PASS" });

  await evaluate(cdp, `document.querySelector('[aria-label="Escolher exercício"]').click()`);
  await evaluate(cdp, `document.querySelectorAll('.workout-player-exercise-list button')[1].click()`);
  await waitFor(cdp, "document.querySelector('.workout-player-stage h1')?.textContent.includes('Crucifixo')");
  await screenshot(cdp, "mobile-390-missing-media.png");
  assert((await evaluate(cdp, "document.body.innerText.includes('Sem demonstração disponível')")));
  const selectedName = await evaluate(cdp, "document.querySelector('.workout-player-stage h1').textContent");
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000);
  assert.equal(await evaluate(cdp, "document.querySelector('.workout-player-stage h1').textContent"), selectedName);
  assert.equal(Number(scalar(`select count(*) from public.workout_execution_sessions where aluno_id='${studentId}' and status='in_progress';`)), 1);
  results.push({ state: "reload-selected-exercise", sameSession: true, duplicateSessions: 0, status: "PASS" });

  await evaluate(cdp, `document.querySelector('[aria-label="Escolher exercício"]').click()`);
  await evaluate(cdp, `document.querySelectorAll('.workout-player-exercise-list button')[2].click()`);
  await waitFor(cdp, "document.querySelector('.workout-player-stage h1')?.textContent.includes('Prancha')");
  assert(await evaluate(cdp, "document.querySelector('[aria-label=\"Próximo exercício\"]').disabled"));
  await screenshot(cdp, "mobile-390-last-exercise.png");
  results.push({ state: "last-exercise", status: "PASS" });

  await evaluate(cdp, `document.querySelector('[aria-label="Sair do player e continuar depois"]').click()`);
  await waitFor(cdp, "location.pathname === '/minha-area/treinos'", 30000);
  assert.equal(scalar(`select status from public.workout_execution_sessions where id='${sessionId}';`), "in_progress");
  await evaluate(cdp, `document.querySelector('[data-testid="student-training-active-session"] button').click()`);
  await waitFor(cdp, `location.pathname.endsWith('${sessionId}')`);
  results.push({ state: "leave-resume", sameSession: true, remainedInProgress: true, status: "PASS" });

  await cdp.send("Fetch.enable", { patterns: [{ urlPattern: "*get_my_workout_player_v2*", requestStage: "Request" }] });
  await cdp.send("Page.reload", { ignoreCache: false });
  await waitFor(cdp, "document.querySelector('.workout-player-loading')", 15000);
  await screenshot(cdp, "mobile-390-loading.png");
  const paused = await waitForPausedRequest(cdp);
  await cdp.send("Fetch.continueRequest", { requestId: paused });
  await cdp.send("Fetch.disable");
  await waitFor(cdp, "document.querySelector('[data-testid=\"student-workout-player-v2\"]')", 30000);
  results.push({ state: "loading", status: "PASS" });

  await cdp.send("Network.setBlockedURLs", { urls: ["*get_my_workout_player_v2*"] });
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-state')", 30000);
  assert(await evaluate(cdp, `!/(postgres|supabase|sql|stack|uuid)/i.test(document.body.innerText)`));
  await screenshot(cdp, "mobile-390-safe-error.png");
  await cdp.send("Network.setBlockedURLs", { urls: [] });
  results.push({ state: "safe-error", status: "PASS" });

  runPsql(process.cwd(), `update public.workout_execution_sessions set status='cancelled',cancelled_at=now(),cancellation_reason='visual local fixture' where id='${sessionId}';`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitFor(cdp, "document.querySelector('.workout-player-state') && document.body.innerText.includes('Treino encerrado')", 30000);
  await screenshot(cdp, "mobile-390-terminal.png");
  assert.equal((await evaluate(cdp, "document.querySelectorAll('.workout-player-actions').length")), 0);
  results.push({ state: "terminal", writesAvailable: false, status: "PASS" });

  const report = { decision: "PASS", scope: "CYCLE_12_5_WORKOUT_PLAYER_VISUAL", database_target: "LOCAL", production_accessed: false, production_mutated: false, screenshots: screenshotCount, viewports: viewports.map(({ name }) => name), results };
  mkdirSync("reports", { recursive: true });
  writeFileSync("reports/cycle-12-5-workout-player-visual.json", `${JSON.stringify(report, null, 2)}\n`);
  console.log(`decision=PASS screenshots=${screenshotCount} states=${[...new Set(results.map((result) => result.state))].join(",")}`);
} finally {
  cdp?.close(); chrome?.kill(); server?.kill(); cleanupFixture();
  if (studentUserId) { try { const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } }); await admin.auth.admin.deleteUser(studentUserId); } catch { /* local cleanup below */ } }
  try { rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 }); } catch { /* temporary */ }
}

function setupFixture(userId) {
  cleanupFixture();
  runPsql(process.cwd(), `
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    values ('${professionalId}','00000000-0000-0000-0000-000000000000','authenticated','authenticated','cycle-12-5-visual-professional@example.invalid','','','','','','','','',now(),now(),now(),'{}','{}',false);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${professionalId}','${professionalId}','Visual Professional','cycle-12-5-visual-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values ('${studentId}','${professionalId}','Aluno Visual','+550000005811',current_date,'QA',0,'Ativo','visual local','${userId}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,lifecycle_status,delivered_at) values ('${programId}','${professionalId}','${studentId}','Força e mobilidade','Condicionamento','Intermediário',3,'','Ativo','active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${dayId}','${programId}','Treino de corpo inteiro','Corpo inteiro',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,video_url,ordem,tracking_config,exercise_media_snapshot) values
      ('${exerciseMedia}','${dayId}','Agachamento com amplitude controlada','4','8–10','Carga confortável','90 s','Mantenha os joelhos alinhados.','https://www.youtube.com/watch?v=dQw4w9WgXcQ',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{"name":"Agachamento","media":{"type":"youtube","videoId":"dQw4w9WgXcQ","youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}'),
      ('${exerciseMissing}','${dayId}','Crucifixo inclinado unilateral com nome longo','3','12','8 kg','60 s','Controle o retorno sem perder a postura.','',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${exerciseLast}','${dayId}','Prancha frontal','3','30 s','','45 s','Respire normalmente.','',3,'{"load":false,"reps":false,"rir":false,"rpe":false,"duration":true,"distance":false}','{}');
  `);
}
function cleanupFixture() { runPsql(process.cwd(), `delete from public.workout_execution_sessions where aluno_id='${studentId}'; delete from public.treinos where aluno_id='${studentId}'; delete from public.alunos where id='${studentId}'; delete from public.perfis where id='${professionalId}'; delete from auth.users where id='${professionalId}';`, { throwOnError: false }); }
function scalar(statement) { return runPsql(process.cwd(), `\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || ""; }
async function ensureFrontend() { server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5185", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true" }, shell: false, stdio: "ignore" }); const started = Date.now(); while (Date.now()-started<45000) { if (await responds(appBaseUrl)) return; await sleep(300); } throw new Error("Frontend local não respondeu."); }
async function responds(url) { try { return (await fetch(url,{redirect:"manual"})).status<500; } catch { return false; } }
async function startChrome() { const path=process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":"google-chrome"; assert(existsSync(path),`Chrome não encontrado em ${path}`); const handle=spawn(path,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run",`--user-data-dir=${profileDir}`,`--remote-debugging-port=${cdpPort}`,"about:blank"],{stdio:"ignore",shell:false}); const started=Date.now(); while(Date.now()-started<15000){try{if((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok)return handle;}catch{await sleep(200);}} throw new Error("Chrome CDP não iniciou."); }
async function getWebSocketUrl(){const response=await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`,{method:"PUT"});if(response.ok)return(await response.json()).webSocketDebuggerUrl;return(await(await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json()).webSocketDebuggerUrl;}
function createCdpClient(url){const socket=new WebSocket(url);let nextId=1;const pending=new Map();const paused=[];socket.addEventListener("message",(event)=>{const message=JSON.parse(event.data);if(message.method==="Fetch.requestPaused")paused.push(message.params.requestId);if(!message.id||!pending.has(message.id))return;const item=pending.get(message.id);pending.delete(message.id);if(message.error)item.reject(new Error(`${item.method}: ${message.error.message}`));else item.resolve(message.result);});return{ready:new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true});}),send(method,params={}){const id=nextId++;socket.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{method,resolve,reject}));},takePaused(){return paused.shift();},close(){socket.close();}};}
async function setViewport(client,viewport){await client.send("Emulation.setDeviceMetricsOverride",{width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.mobile});}
async function auditPlayer(client){return evaluate(client,`(() => { const targets=[...document.querySelectorAll('.workout-player-button,.workout-player-icon-button,.workout-player-skip')].filter((item)=>!item.disabled&&item.getClientRects().length); const targetSizes=targets.map((item)=>({label:item.getAttribute('aria-label')||item.textContent.trim(),height:item.getBoundingClientRect().height})); return { noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth + 1, minimumTarget: Math.min(...targetSizes.map((item)=>item.height)), targetSizes, mainHeadings: document.querySelectorAll('main h1').length, progressbars: document.querySelectorAll('[role="progressbar"]').length, studentShell: Boolean(document.querySelector('[data-testid="student-v2-shell"]')), videoAutoplay: [...document.querySelectorAll('video')].some((video)=>video.autoplay) }; })()`);}
async function screenshot(client,name){mkdirSync(screenshotDir,{recursive:true});const result=await client.send("Page.captureScreenshot",{format:"png",fromSurface:true,captureBeyondViewport:false});writeFileSync(join(screenshotDir,name),Buffer.from(result.data,"base64"));screenshotCount+=1;}
async function evaluate(client,expression){const response=await client.send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw new Error(response.exceptionDetails.text);return response.result.value;}
async function waitFor(client,expression,timeout=20000){const started=Date.now();while(Date.now()-started<timeout){if(await evaluate(client,`Boolean(${expression})`))return;await sleep(200);}throw new Error(`Timeout aguardando ${expression}`);}
async function waitForPausedRequest(client){const started=Date.now();while(Date.now()-started<15000){const id=client.takePaused();if(id)return id;await sleep(100);}throw new Error("Request do Player não foi interceptado.");}
function sleep(ms){return new Promise((resolve)=>setTimeout(resolve,ms));}
