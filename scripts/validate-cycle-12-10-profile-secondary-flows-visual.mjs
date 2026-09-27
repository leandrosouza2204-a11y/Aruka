import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { stopOwnedProcessTree } from "./lib/qa-process-cleanup.mjs";
import { resolveCycle1214Viewports } from "./lib/cycle-12-14-viewport-matrix.mjs";
import { getCdpWebSocketUrl, navigateWithReactReadiness, removeQaProfileDir, startChromeQa, startViteQaServer, waitForViteStop } from "./lib/browser-qa-runtime.mjs";

loadQaEnvFile(".env.local"); loadQaEnvFile(".env.qa.local");
process.env.QA_BASE_URL = process.env.ARUKA_QA_BASE_URL || process.env.QA_BASE_URL;
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });
const appBaseUrl = "http://127.0.0.1:5190";
let cdpPort = 9990 + Math.floor(Math.random() * 30);
const profileDir = join(tmpdir(), `aruka-cycle-12-10-chrome-${process.pid}`);
const screenshotDir = join("tmp-responsive-screenshots", "cycle-12-10-profile-secondary-flows");
const studentId = "00000000-0000-4000-8000-000000121099";
const viewports = resolveCycle1214Viewports([{ name: "desktop-1280", width: 1280, height: 900, mobile: false }, { name: "tablet-768", width: 768, height: 1024, mobile: true }, { name: "mobile-320", width: 320, height: 800, mobile: true }, { name: "mobile-375", width: 375, height: 812, mobile: true }, { name: "mobile-390", width: 390, height: 844, mobile: true }]);
let server; let chrome; let client; let admin; let professionalUser; let studentUser;
const results = [];
const startupAttempts = [];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_10_PROFILE_SECONDARY_FLOWS_VISUAL", reportPath: "reports/cycle-12-10-profile-secondary-flows-visual.json", requiredScenarios: ["viewport-matrix", "keyboard-focus", "recoverable-error", "validation-error", "rollout-off"] });

try {
  assert(process.env.QA_USER_PASSWORD, "QA_USER_PASSWORD ausente.");
  admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  professionalUser = await createLocalUser("cycle-12-10-professional@aruka.test");
  studentUser = await createLocalUser("cycle-12-10-student@aruka.test");
  cleanupRows();
  runPsql(process.cwd(), `
    insert into public.perfis(user_id,nome,email,role,tipo_acesso,status) values ('${professionalUser.id}','Marina Costa','private-login@aruka.test','user','beta','ativo');
    insert into public.aceites_legais(user_id,politica_versao,termos_versao,politica_aceita,termos_aceitos,aceito_em) values ('${professionalUser.id}','1.0','1.0',true,true,now());
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status) values ('${studentId}','${professionalUser.id}','Ana Beatriz','+550000121099',current_date,'QA',0,'Ativo','synthetic','${studentUser.id}','active');
    insert into public.professional_contact_settings(professional_user_id,whatsapp_enabled,whatsapp_number,email_enabled,contact_email) values ('${professionalUser.id}',true,'5511999991234',true,'atendimento@aruka.test');
  `);
  const studentSession = await signIn("cycle-12-10-student@aruka.test");
  const professionalSession = await signIn("cycle-12-10-professional@aruka.test");
  const viteStartup = await startViteQaServer({ port: 5190, env: { VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true" } }); server = viteStartup.child; startupAttempts.push({ component: "vite-on", attempts: viteStartup.attempts });
  const studentChromeStartup = await startChromeQa({ cdpPort, profileDir }); chrome = studentChromeStartup.child; startupAttempts.push({ component: "student-chrome", attempts: studentChromeStartup.attempts }); client = createCdpClient(await getCdpWebSocketUrl(cdpPort)); await client.ready;
  await client.send("Page.enable"); await client.send("Runtime.enable"); await client.send("Network.enable");

  await setBrowserSession(studentSession); await navigate("/minha-area/perfil", "document.querySelector('[data-testid=\"student-profile-v2\"]')");
  for (const viewport of viewports) {
    await setViewport(viewport);
    const audit = await evaluate(`(()=>({innerWidth:window.innerWidth,overflow:document.documentElement.scrollWidth>window.innerWidth+1,h1:document.querySelectorAll('main h1').length,h2:document.querySelectorAll('main h2').length,channels:document.querySelectorAll('.student-profile-actions a').length,current:document.querySelectorAll('.student-v2-nav-item[aria-current="page"]').length,minTarget:Math.min(...[...document.querySelectorAll('.student-v2-button,.student-v2-nav-item')].map(x=>x.getBoundingClientRect().height))}))()`);
    assert.equal(audit.innerWidth, viewport.width); assert.equal(audit.overflow, false); assert.equal(audit.h1, 1); assert.equal(audit.h2, 3); assert.equal(audit.channels, 2); assert.equal(audit.current, 1); assert(audit.minTarget >= 44);
    await evaluate("document.querySelector('.student-profile-actions a').focus()");
    await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
    const focusAudit = await evaluate("(()=>{const el=document.activeElement;const rect=el.getBoundingClientRect();return{focusVisible:el.matches(':focus-visible'),inProfile:Boolean(el.closest('.student-profile-v2')),visible:rect.top>=0&&rect.bottom<=innerHeight+1,order:el===document.querySelectorAll('.student-profile-actions a')[1]}})()");
    assert.equal(focusAudit.focusVisible, true); assert.equal(focusAudit.inProfile, true); assert.equal(focusAudit.visible, true); assert.equal(focusAudit.order, true);
    await screenshot(`student-profile-${viewport.name}.png`, viewport); results.push({ screen: "student-profile", viewport: viewport.name, ...audit, focusAudit, status: "PASS" });
  }
  evidence.scenario("viewport-matrix", "PASS", { widths: [320, 375, 390, 768, 1280] });
  evidence.scenario("keyboard-focus", "PASS", { classification: "AUTOMATED_KEYBOARD_PASS", human_acceptance: false });

  await client.send("Network.setBlockedURLs", { urls: ["*get_my_student_profile_v2*"] });
  await client.send("Page.reload", { ignoreCache: true });
  await waitFor("document.querySelector('.student-v2-error[role=\"alert\"] button')", 30000);
  assert.equal(await evaluate("!/(postgres|supabase|sql|stack|uuid)/i.test(document.body.innerText)"), true);
  await client.send("Network.setBlockedURLs", { urls: [] });
  await evaluate("document.querySelector('.student-v2-error[role=\"alert\"] button').click()");
  await waitFor("document.querySelector('[data-testid=\"student-profile-v2\"]')", 30000);
  evidence.scenario("recoverable-error", "PASS", { safe_copy: true, retry_recovered: true, stale_private_data: false });

  client.close(); stopOwnedProcessTree(chrome); await sleep(700); cdpPort += 31; await removeQaProfileDir(profileDir);
  const professionalChromeStartup = await startChromeQa({ cdpPort, profileDir }); chrome = professionalChromeStartup.child; startupAttempts.push({ component: "professional-chrome", attempts: professionalChromeStartup.attempts }); client = createCdpClient(await getCdpWebSocketUrl(cdpPort)); await client.ready; await client.send("Page.enable"); await client.send("Runtime.enable");
  await setBrowserSession(professionalSession); await navigate("/contato-alunos", "document.querySelector('.contact-settings-form') && document.querySelector('.app-sidebar-link[href=\"/contato-alunos\"]')");
  for (const viewport of viewports) {
    await setViewport(viewport);
    const audit = await evaluate(`(()=>({innerWidth:window.innerWidth,sidebarWidth:document.querySelector('.app-sidebar').getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>window.innerWidth+1,h1:document.querySelectorAll('main h1').length,inputs:document.querySelectorAll('.contact-settings-form input').length,saveHeight:document.querySelector('.contact-settings-save').getBoundingClientRect().height,menuVisible:Boolean(document.querySelector('${viewport.mobile ? ".mobile-bottom-nav" : ".app-sidebar"}'))}))()`);
    assert.equal(audit.innerWidth, viewport.width); assert.equal(audit.overflow, false); assert.equal(audit.h1, 1); assert.equal(audit.inputs, 4); assert(audit.saveHeight >= 44); assert.equal(audit.menuVisible, true); if (!viewport.mobile) assert.equal(audit.sidebarWidth, 260);
    await screenshot(`professional-contact-${viewport.name}.png`, viewport); results.push({ screen: "professional-contact", viewport: viewport.name, ...audit, status: "PASS" });
  }
  await evaluate("(()=>{const input=document.querySelector('#contact-whatsapp');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'invalid');input.dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('.contact-settings-form').requestSubmit()})()");
  await waitFor("document.querySelector('#contact-whatsapp-error')");
  assert.equal(await evaluate("document.querySelector('#contact-whatsapp').getAttribute('aria-invalid')"), "true");
  await screenshot("professional-contact-validation-error.png");
  evidence.scenario("validation-error", "PASS");

  server.kill(); await waitForViteStop(appBaseUrl); const viteOffStartup = await startViteQaServer({ port: 5190, env: { VITE_STUDENT_EXPERIENCE_V2_ENABLED: "false" } }); server = viteOffStartup.child; startupAttempts.push({ component: "vite-off", attempts: viteOffStartup.attempts });
  await setBrowserSession(studentSession); await navigate("/minha-area/perfil", "location.pathname === '/minha-area'");
  results.push({ state: "rollout-off-legacy", status: "PASS" });
  evidence.scenario("rollout-off", "PASS");
  evidence.executionSucceeded({ decision: "PASS", scope: "CYCLE_12_10_PROFILE_SECONDARY_FLOWS_VISUAL", database_target: "LOCAL", production_accessed: false, screenshots: viewports.length * 2 + 1, startup_attempts: startupAttempts, results });
  console.log("decision=PASS screenshots=11 viewports=320,375,390,768,1280");
} catch (error) {
  evidence.executionFailed(error, admin ? "execution" : "setup");
  throw error;
} finally {
  try { cleanupRows(); } catch (error) { evidence.cleanupFailed(error); }
  if (admin && studentUser) try { const deleted = await admin.auth.admin.deleteUser(studentUser.id); if (deleted.error) throw deleted.error; } catch (error) { evidence.cleanupFailed(error); }
  if (admin && professionalUser) try { const deleted = await admin.auth.admin.deleteUser(professionalUser.id); if (deleted.error) throw deleted.error; } catch (error) { evidence.cleanupFailed(error); }
  client?.close(); stopOwnedProcessTree(chrome); server?.kill(); await sleep(400);
  try { await removeQaProfileDir(profileDir); } catch (error) { evidence.cleanupFailed(error); }
  evidence.finalize();
}

async function createLocalUser(email) { const listed=await admin.auth.admin.listUsers({page:1,perPage:1000}); const old=listed.data?.users?.find((user)=>user.email===email); if(old) await admin.auth.admin.deleteUser(old.id); const created=await admin.auth.admin.createUser({email,password:process.env.QA_USER_PASSWORD,email_confirm:true}); if(created.error)throw created.error; return created.data.user; }
async function signIn(email) { const auth=createClient(runtime.apiUrl,runtime.anonKey,{auth:{persistSession:false,autoRefreshToken:false}}); const {data,error}=await auth.auth.signInWithPassword({email,password:process.env.QA_USER_PASSWORD}); if(error)throw error; return data.session; }
function cleanupRows() { if (!professionalUser) return; runPsql(process.cwd(), `delete from public.professional_contact_settings where professional_user_id='${professionalUser.id}'; delete from public.alunos where id='${studentId}'; delete from public.aceites_legais where user_id='${professionalUser.id}'; delete from public.perfis where user_id='${professionalUser.id}';`, { throwOnError: false }); }
async function startFrontend(enabled) { server=spawn(process.execPath,[join("node_modules","vite","bin","vite.js"),"--host","127.0.0.1","--port","5190","--strictPort"],{env:{...process.env,VITE_STUDENT_EXPERIENCE_V2_ENABLED:enabled},shell:false,stdio:"ignore"}); for(let i=0;i<100;i+=1){try{if((await fetch(appBaseUrl)).ok)return}catch{/* wait */}await sleep(300)}throw new Error("Frontend local não respondeu."); }
async function waitForFrontendStop(){for(let i=0;i<60;i+=1){try{await fetch(appBaseUrl)}catch{return}await sleep(250)}throw new Error("Porta visual não foi liberada.");}
async function startChrome(){const path=process.platform==="win32"?"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe":"google-chrome";assert(existsSync(path),"Chrome ausente.");const handle=spawn(path,["--headless=new","--no-sandbox","--disable-gpu","--disable-dev-shm-usage","--no-first-run",`--user-data-dir=${profileDir}`,`--remote-debugging-port=${cdpPort}`,"about:blank"],{stdio:"ignore",shell:false});for(let i=0;i<60;i+=1){try{if((await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).ok)return handle}catch{/* wait */}await sleep(250)}throw new Error("Chrome CDP não iniciou.");}
async function getWebSocketUrl(){const response=await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`,{method:"PUT"});return(await response.json()).webSocketDebuggerUrl;}
function createCdpClient(url){const socket=new WebSocket(url);let nextId=1;const pending=new Map();socket.addEventListener("message",event=>{const message=JSON.parse(event.data);if(!message.id||!pending.has(message.id))return;const item=pending.get(message.id);pending.delete(message.id);message.error?item.reject(new Error(message.error.message)):item.resolve(message.result)});return{ready:new Promise((resolve,reject)=>{socket.addEventListener("open",resolve,{once:true});socket.addEventListener("error",reject,{once:true})}),send(method,params={}){const id=nextId++;socket.send(JSON.stringify({id,method,params}));return new Promise((resolve,reject)=>pending.set(id,{resolve,reject}))},close(){socket.close()}};}
async function evaluate(expression){const result=await client.send("Runtime.evaluate",{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;}
async function waitFor(expression,timeout=30000){const started=Date.now();while(Date.now()-started<timeout){if(await evaluate(`Boolean(${expression})`))return;await sleep(200)}throw new Error(`Timeout aguardando ${expression}`);}
async function setBrowserSession(session){const routeStartup=await navigateWithReactReadiness(client,`${appBaseUrl}/login`,"document.querySelector('#root')?.childElementCount > 0");startupAttempts.push({component:"login-route",attempts:routeStartup.attempts});assert(await evaluate(`(async()=>{const {supabase}=await import('/src/services/supabase.js');const {error}=await supabase.auth.setSession(${JSON.stringify({access_token:session.access_token,refresh_token:session.refresh_token})});return !error})()`));}
async function navigate(path,ready){const routeStartup=await navigateWithReactReadiness(client,`${appBaseUrl}${path}`,ready);startupAttempts.push({component:`route:${path}`,attempts:routeStartup.attempts});}
async function setViewport(viewport){await client.send("Emulation.setTouchEmulationEnabled",viewport.mobile?{enabled:true,maxTouchPoints:1}:{enabled:false});await client.send("Emulation.setEmulatedMedia",{features:[{name:"pointer",value:viewport.mobile?"coarse":"fine"},{name:"hover",value:viewport.mobile?"none":"hover"}]});await client.send("Emulation.setDeviceMetricsOverride",{width:viewport.width,height:viewport.height,deviceScaleFactor:1,mobile:viewport.mobile});await sleep(400);}
async function screenshot(name,viewport){mkdirSync(screenshotDir,{recursive:true});const options={format:"png",fromSurface:true,captureBeyondViewport:true};if(viewport)options.clip={x:0,y:0,width:viewport.width,height:viewport.height,scale:1};const result=await client.send("Page.captureScreenshot",options);writeFileSync(join(screenshotDir,name),Buffer.from(result.data,"base64"));}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
