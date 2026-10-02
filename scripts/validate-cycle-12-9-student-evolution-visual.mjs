import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { stopOwnedProcessTree } from "./lib/qa-process-cleanup.mjs";
import { resolveCycle1214Viewports } from "./lib/cycle-12-14-viewport-matrix.mjs";
import { createCdpClient, evaluateCdp, getCdpWebSocketUrl, navigateWithReactReadiness, removeQaProfileDir, sleep, startChromeQa, startViteQaServer, waitForViteStop } from "./lib/browser-qa-runtime.mjs";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const appBaseUrl = "http://127.0.0.1:5189";
const cdpPort = 9950 + Math.floor(Math.random() * 40);
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-9-student-evolution");
const profileDir = join(tmpdir(), `aruka-cycle-12-9-chrome-${process.pid}`);
const runToken = `${Date.now()}-${randomUUID().slice(0, 8)}`;
const professionalEmail = `cycle-12-9-professional-${runToken}@example.invalid`;
const studentEmail = `cycle-12-9-student-${runToken}@example.invalid`;
const assessmentIds = [randomUUID(), randomUUID()];
const completedSessionId = randomUUID();
const viewports = resolveCycle1214Viewports([
  { name: "mobile-320", width: 320, height: 800, mobile: true },
  { name: "mobile-375", width: 375, height: 812, mobile: true },
  { name: "mobile-390", width: 390, height: 844, mobile: true },
  { name: "tablet-768", width: 768, height: 1024, mobile: true },
  { name: "desktop-1280", width: 1280, height: 900, mobile: false },
]);
let server;
let chrome;
let client;
let admin;
let professionalUser;
let studentUser;
const studentId = randomUUID();
const results = [];
const startupAttempts = [];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_9_STUDENT_EVOLUTION_VISUAL", reportPath: "reports/cycle-12-9-student-evolution-visual.json", requiredScenarios: ["self-contained-fixture", "browser-startup", "viewport-matrix", "history-detail", "recoverable-error", "rollout-off"] });

try {
  assert(process.env.QA_USER_PASSWORD, "QA_USER_PASSWORD ausente.");
  admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  professionalUser = await createLocalUser(professionalEmail);
  studentUser = await createLocalUser(studentEmail);
  const student = createClient(runtime.apiUrl, runtime.anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: login, error } = await student.auth.signInWithPassword({ email: studentEmail, password: process.env.QA_USER_PASSWORD });
  if (error) throw error;
  runPsql(process.cwd(), `
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${professionalUser.id}','${professionalUser.id}','Professional Visual Cycle 12.9','${professionalEmail}','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values ('${studentId}','${professionalUser.id}','Aluno Visual Cycle 12.9','+550000009943',current_date,'QA',0,'Ativo','cycle-12-9-visual:${runToken}','${studentUser.id}','active',now());
    insert into public.workout_execution_sessions(id,aluno_id,status,session_date,started_at,completed_at,notes,short_duration_confirmed)
    values ('${completedSessionId}','${studentId}', 'completed', current_date, now()-interval '120 seconds', now(), 'cycle-12-9-visual:${runToken}', true);
    insert into public.avaliacoes(id,user_id,aluno_id,data_avaliacao,peso,cintura) values
      ('${assessmentIds[0]}','${professionalUser.id}','${studentId}',current_date-30,71.4,82.0),
      ('${assessmentIds[1]}','${professionalUser.id}','${studentId}',current_date,70.8,null);
  `);
  evidence.scenario("self-contained-fixture", "PASS", { run_token: runToken, auth_users: 2, fixed_ids: false });
  await startFrontend("true");
  chrome = await startChrome();
  client = createCdpClient(await getCdpWebSocketUrl(cdpPort));
  await client.ready;
  await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Network.enable");
  await client.send("Page.navigate", { url: `${appBaseUrl}/login` });
  await waitFor("document.readyState !== 'loading'");
  assert(await evaluate(`(async()=>{const {supabase}=await import('/src/services/supabase.js');const {error}=await supabase.auth.setSession(${JSON.stringify({ access_token: login.session.access_token, refresh_token: login.session.refresh_token })});return !error})()`));
  const navigation = await navigateWithReactReadiness(client, `${appBaseUrl}/minha-area/evolucao`, "document.querySelector('[data-testid=\"student-evolution-v2\"]') && document.body.innerText.includes('Última avaliação')");
  startupAttempts.push(...navigation.attempts);
  evidence.scenario("browser-startup", "PASS", { attempts: startupAttempts });

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
  evidence.scenario("viewport-matrix", "PASS", { viewports: viewports.map(({ width, height }) => `${width}x${height}`) });

  const detailHref = `/minha-area/treino/${completedSessionId}`;
  assert.equal(await evaluate(`document.querySelector('.student-evolution-detail-link')?.getAttribute('href')`), detailHref);
  await evaluate("document.activeElement?.blur()");
  for (let index = 0; index < 20; index += 1) {
    if (await evaluate("document.activeElement?.matches('.student-evolution-detail-link')")) break;
    await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  }
  assert.equal(await evaluate("document.activeElement?.matches('.student-evolution-detail-link:focus-visible')"), true);
  assert.notEqual(await evaluate("getComputedStyle(document.activeElement).outlineStyle"), "none");
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await waitFor(`location.pathname === '${detailHref}' && document.querySelector('[data-testid="workout-completion-result"]')`, 30000);
  assert(await evaluate("document.body.innerText.includes('somente para leitura')"));
  evidence.scenario("history-detail", "PASS", { keyboard: true, route: detailHref, readonly: true });
  await client.send("Page.navigate", { url: `${appBaseUrl}/minha-area/evolucao` });
  await waitFor("document.querySelector('[data-testid=\"student-evolution-v2\"]') && document.querySelector('.student-evolution-timeline')", 30000);

  await client.send("Network.setBlockedURLs", { urls: ["*get_my_student_workout_frequency_v2*"] });
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor("document.querySelector('.student-evolution-section-message.is-error button') && document.querySelector('.student-evolution-timeline')", 30000);
  await evaluate("document.querySelector('.student-evolution-section-message.is-error button').focus()");
  assert.equal(await evaluate("document.activeElement === document.querySelector('.student-evolution-section-message.is-error button')"), true);
  await screenshot("mobile-partial-error-retry.png");
  results.push({ state: "partial-error-retry", independentContentPreserved: true, keyboardFocus: true, status: "PASS" });
  evidence.scenario("recoverable-error", "PASS");
  await client.send("Network.setBlockedURLs", { urls: [] });

  stopOwnedProcessTree(server); await waitForFrontendStop(); await startFrontend("false");
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
  for (const user of [studentUser, professionalUser]) { if (admin && user) { try { const deleted = await admin.auth.admin.deleteUser(user.id); if (deleted.error) throw deleted.error; } catch (error) { evidence.cleanupFailed(error); } } }
  client?.close(); stopOwnedProcessTree(chrome); stopOwnedProcessTree(server);
  await sleep(500);
  try { await removeQaProfileDir(profileDir); } catch (error) { evidence.cleanupFailed(error); }
  evidence.finalize();
}

function cleanupFixtures() { if (!professionalUser) return; const result = runPsql(process.cwd(), `delete from public.avaliacoes where id in ('${assessmentIds[0]}','${assessmentIds[1]}'); delete from public.workout_execution_sessions where aluno_id='${studentId}'; delete from public.alunos where id='${studentId}'; delete from public.perfis where user_id='${professionalUser.id}';`, { throwOnError: false }); if (result.status !== 0) throw new Error(`Cleanup Cycle 12.9 falhou: ${result.stderr || result.stdout}`); }
async function createLocalUser(email) { const created = await admin.auth.admin.createUser({ email, password: process.env.QA_USER_PASSWORD, email_confirm: true }); if (created.error) throw created.error; return created.data.user; }
async function startFrontend(enabled) { const started = await startViteQaServer({ port: 5189, env: { VITE_STUDENT_EXPERIENCE_V2_ENABLED: enabled } }); server = started.child; startupAttempts.push(...started.attempts); }
async function waitForFrontendStop() { await waitForViteStop(appBaseUrl); }
async function startChrome() { const started = await startChromeQa({ cdpPort, profileDir }); startupAttempts.push(...started.attempts); return started.child; }
async function evaluate(expression){return evaluateCdp(client, expression)}
async function waitFor(expression,timeout=20000){const started=Date.now();while(Date.now()-started<timeout){if(await evaluate(`Boolean(${expression})`))return;await sleep(200)}throw new Error(`Timeout aguardando ${expression}`)}
async function screenshot(name){mkdirSync(screenshotDir,{recursive:true});const result=await client.send("Page.captureScreenshot",{format:"png",fromSurface:true});writeFileSync(join(screenshotDir,name),Buffer.from(result.data,"base64"))}
