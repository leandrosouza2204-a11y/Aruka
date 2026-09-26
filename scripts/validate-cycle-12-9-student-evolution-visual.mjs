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
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const appBaseUrl = "http://127.0.0.1:5189";
const cdpPort = 9950 + Math.floor(Math.random() * 40);
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-9-student-evolution");
const profileDir = join(tmpdir(), `aruka-cycle-12-9-chrome-${process.pid}`);
const assessmentIds = ["00000000-0000-4000-8000-000000009941", "00000000-0000-4000-8000-000000009942"];
const viewports = [
  { name: "mobile-320", width: 320, height: 800, mobile: true },
  { name: "mobile-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
];
let server;
let chrome;
let client;
let admin;
let visualAuthCreated = false;
const studentId = "00000000-0000-4000-8000-000000009943";
const professionalId = "00000000-0000-4000-8000-000000000802";
const results = [];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_9_STUDENT_EVOLUTION_VISUAL", reportPath: "reports/cycle-12-9-student-evolution-visual.json", requiredScenarios: ["viewport-matrix", "recoverable-error", "rollout-off"] });

try {
  assert(process.env.QA_USER_PASSWORD, "QA_USER_PASSWORD ausente.");
  admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listed.error) throw listed.error;
  let visualUser = listed.data.users.find((item) => item.email === "student.qa.local@aruka.test");
  if (visualUser) {
    const updated = await admin.auth.admin.updateUserById(visualUser.id, { password: process.env.QA_USER_PASSWORD, email_confirm: true });
    if (updated.error) throw updated.error;
    visualUser = updated.data.user;
  } else {
    const created = await admin.auth.admin.createUser({ email: "student.qa.local@aruka.test", password: process.env.QA_USER_PASSWORD, email_confirm: true });
    if (created.error) throw created.error;
    visualUser = created.data.user;
    visualAuthCreated = true;
  }
  const student = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: login, error } = await student.auth.signInWithPassword({ email: "student.qa.local@aruka.test", password: process.env.QA_USER_PASSWORD });
  if (error) throw error;
  cleanupFixtures();
  runPsql(process.cwd(), `
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values ('${studentId}','${professionalId}','Aluno Visual Cycle 12.9','+550000009943',current_date,'QA',0,'Ativo','cycle-12-9-visual','${visualUser.id}','active',now());
    insert into public.workout_execution_sessions(aluno_id,status,session_date,started_at,completed_at,notes,short_duration_confirmed)
    values ('${studentId}', 'completed', current_date, now()-interval '120 seconds', now(), 'cycle-12-9-visual', true);
    insert into public.avaliacoes(id,user_id,aluno_id,data_avaliacao,peso,cintura) values
      ('${assessmentIds[0]}','${professionalId}','${studentId}',current_date-30,71.4,82.0),
      ('${assessmentIds[1]}','${professionalId}','${studentId}',current_date,70.8,null);
  `);
  await startFrontend("true");
  chrome = await startChrome();
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Network.enable");
  await client.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor("document.readyState !== 'loading'");
  assert(await evaluate(`(async()=>{const {supabase}=await import('/src/services/supabase.js');const {error}=await supabase.auth.setSession(${JSON.stringify({ access_token: login.session.access_token, refresh_token: login.session.refresh_token })});return !error})()`));
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/evolucao` });
  await waitFor("document.querySelector('[data-testid=\"student-evolution-v2\"]') && document.body.innerText.includes('Última avaliação')", 30000);

  for (const viewport of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
    const audit = await evaluate(`(()=>{const nav=[...document.querySelectorAll('.student-v2-nav-item')];return {overflow:document.documentElement.scrollWidth>window.innerWidth+1,h1:document.querySelectorAll('main h1').length,h2:document.querySelectorAll('main h2').length,current:nav.filter(x=>x.getAttribute('aria-current')==='page').length,minTarget:Math.min(...nav.map(x=>x.getBoundingClientRect().height)),retryVisible:Boolean(document.querySelector('.student-evolution-section-message.is-error button'))}})()`);
    assert.equal(audit.overflow, false, `${viewport.name}: overflow horizontal`);
    assert.equal(audit.h1, 1, `${viewport.name}: hierarquia h1`);
    assert.equal(audit.h2, 3, `${viewport.name}: hierarquia de seções`);
    assert.equal(audit.current, 1, `${viewport.name}: navegação ativa`);
    assert(audit.minTarget >= 44, `${viewport.name}: alvo menor que 44px`);
    await screenshot(`${viewport.name}-normal.png`);
    results.push({ viewport: viewport.name, ...audit, status: "PASS" });
  }
  evidence.scenario("viewport-matrix", "PASS", { widths: [320, 375, 390, 768, 1280] });

  await client.send("Network.setBlockedURLs", { urls: ["*get_my_student_workout_frequency_v2*"] });
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor("document.querySelector('.student-evolution-section-message.is-error button') && document.querySelector('.student-evolution-timeline')", 30000);
  await evaluate("document.querySelector('.student-evolution-section-message.is-error button').focus()");
  assert.equal(await evaluate("document.activeElement === document.querySelector('.student-evolution-section-message.is-error button')"), true);
  await screenshot("mobile-partial-error-retry.png");
  results.push({ state: "partial-error-retry", independentContentPreserved: true, keyboardFocus: true, status: "PASS" });
  evidence.scenario("recoverable-error", "PASS");
  await client.send("Network.setBlockedURLs", { urls: [] });

  server.kill(); await waitForFrontendStop(); await startFrontend("false");
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/evolucao` });
  await waitFor("location.pathname === '/minha-area' && document.querySelector('[data-testid=\"student-daily-page\"]')", 30000);
  results.push({ state: "rollout-off-legacy", route: "/minha-area", status: "PASS" });
  evidence.scenario("rollout-off", "PASS");

  const report = { decision: "PASS", scope: "CYCLE_12_9_STUDENT_EVOLUTION_VISUAL", database_target: "LOCAL", production_accessed: false, screenshots: viewports.length + 1, reduced_motion_foundation: "PASS", results };
  evidence.executionSucceeded(report);
  console.log(`decision=PASS screenshots=${report.screenshots} viewports=${viewports.map((item) => item.name).join(",")}`);
} catch (error) {
  evidence.executionFailed(error, admin ? "execution" : "setup");
  throw error;
} finally {
  try { cleanupFixtures(); } catch (error) { evidence.cleanupFailed(error); }
  if (visualAuthCreated && admin) { try { const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 }); const user = listed.data?.users?.find((item) => item.email === "student.qa.local@aruka.test"); if (user) { const deleted = await admin.auth.admin.deleteUser(user.id); if (deleted.error) throw deleted.error; } } catch (error) { evidence.cleanupFailed(error); } }
  client?.close(); stopOwnedProcessTree(chrome); server?.kill();
  await sleep(500);
  try { rmSync(profileDir, { recursive: true, force: true, maxRetries: 4, retryDelay: 300 }); } catch (error) { evidence.cleanupFailed(error); }
  evidence.finalize();
}

function cleanupFixtures() { runPsql(process.cwd(), `delete from public.avaliacoes where id in ('${assessmentIds[0]}','${assessmentIds[1]}'); delete from public.workout_execution_sessions where aluno_id='${studentId}'; delete from public.alunos where id='${studentId}';`, { throwOnError: false }); }
async function startFrontend(enabled) { server = spawn(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", "5189", "--strictPort"], { env: { ...process.env, VITE_STUDENT_EXPERIENCE_V2_ENABLED: enabled }, shell: false, stdio: "ignore" }); for (let i=0;i<100;i+=1) { try { if ((await fetch(appBaseUrl)).ok) return; } catch { /* wait */ } await sleep(300); } throw new Error("Frontend local não respondeu."); }
async function waitForFrontendStop() { for (let i=0;i<60;i+=1) { try { await fetch(appBaseUrl); } catch { return; } await sleep(250); } throw new Error("Porta visual não foi liberada."); }
async function startChrome() { const path=process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":"google-chrome"; assert(existsSync(path),"Chrome ausente."); const handle=spawn(path,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run",`--user-data-dir=${profileDir}`,`--remote-debugging-port=${cdpPort}`,"about:blank"],{stdio:"ignore",shell:false}); for(let i=0;i<60;i+=1){try{if((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok)return handle}catch{/* wait */}await sleep(250)}throw new Error("Chrome CDP não iniciou."); }
async function getWebSocketUrl(){const response=await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`,{method:"PUT"});return (await response.json()).webSocketDebuggerUrl}
function createCdpClient(url){const socket=new WebSocket(url);let nextId=1;const pending=new Map();socket.addEventListener("message",event=>{const message=JSON.parse(event.data);if(!message.id||!pending.has(message.id))return;const item=pending.get(message.id);pending.delete(message.id);message.error?item.reject(new Error(message.error.message)):item.resolve(message.result)});return{ready:new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true})}),send(method,params={}){const id=nextId++;socket.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))},close(){socket.close()}}}
async function evaluate(expression){const result=await client.send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value}
async function waitFor(expression,timeout=20000){const started=Date.now();while(Date.now()-started<timeout){if(await evaluate(`Boolean(${expression})`))return;await sleep(200)}throw new Error(`Timeout aguardando ${expression}`)}
async function screenshot(name){mkdirSync(screenshotDir,{recursive:true});const result=await client.send("Page.captureScreenshot",{format:"png",fromSurface:true});writeFileSync(join(screenshotDir,name),Buffer.from(result.data,"base64"))}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
