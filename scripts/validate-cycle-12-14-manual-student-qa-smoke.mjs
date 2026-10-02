import assert from "node:assert/strict";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  createCdpClient,
  evaluateCdp,
  getCdpWebSocketUrl,
  navigateWithReactReadiness,
  removeQaProfileDir,
  startChromeQa,
  startViteQaServer,
  waitForViteStop,
} from "./lib/browser-qa-runtime.mjs";
import { stopOwnedProcessTree } from "./lib/qa-process-cleanup.mjs";
import {
  FIXTURE_IDS,
  STUDENT_EMAIL,
  assertLocalServices,
  createStudentClient,
  loadAndValidateManualQaEnvironment,
} from "./lib/cycle-12-14-manual-student-qa.mjs";

const { runtime, password } = loadAndValidateManualQaEnvironment();
await assertLocalServices(runtime);
const authClient = createStudentClient(runtime);
const { data: login, error: loginError } = await authClient.auth.signInWithPassword({ email: STUDENT_EMAIL, password });
if (loginError) throw loginError;
assert.ok(login.session?.access_token && login.session?.refresh_token, "MANUAL_QA_SMOKE: login sem sessao.");

const port = 5194;
const cdpPort = 9914;
const profileDir = join(tmpdir(), `aruka-cycle-12-14-manual-smoke-${process.pid}`);
let vite;
let chrome;
let browser;

try {
  vite = await startViteQaServer({
    port,
    env: {
      VITE_STUDENT_EXPERIENCE_V2_ENABLED: "true",
      VITE_SUPABASE_URL: runtime.apiUrl,
    },
  });
  chrome = await startChromeQa({ cdpPort, profileDir });
  browser = createCdpClient(await getCdpWebSocketUrl(cdpPort));
  await browser.ready;
  await browser.send("Page.enable");
  await browser.send("Runtime.enable");

  await navigateWithReactReadiness(browser, `${vite.baseUrl}/login`, "document.querySelector('form')");
  assert.equal(await evaluateCdp(browser, "location.pathname"), "/login");

  const sessionReady = await evaluateCdp(browser, `(async () => {
    const { supabase } = await import('/src/services/supabase.js');
    const { error } = await supabase.auth.setSession({
      access_token: ${JSON.stringify(login.session.access_token)},
      refresh_token: ${JSON.stringify(login.session.refresh_token)}
    });
    return !error;
  })()`);
  assert.equal(sessionReady, true);

  await navigateWithReactReadiness(
    browser,
    `${vite.baseUrl}/minha-area`,
    "location.pathname === '/minha-area/inicio' && document.querySelector('[data-testid=\"student-home-v2\"]')"
  );
  assert.equal(
    await evaluateCdp(browser, "location.pathname"),
    "/minha-area/inicio",
    "O entrypoint canonico nao direcionou o aluno elegivel para a Home V2."
  );

  const routes = [
    ["/minha-area/inicio", "document.querySelector('[data-testid=\"student-home-v2\"]')"],
    ["/minha-area/treinos", "document.querySelector('[data-testid=\"student-training-library-v2\"]')"],
    [`/minha-area/treinos/${FIXTURE_IDS.day}`, "document.querySelector('[data-testid=\"student-workout-detail-v2\"]')"],
    ["/minha-area/evolucao", "document.querySelector('[data-testid=\"student-evolution-v2\"]')"],
    ["/minha-area/perfil", "document.querySelector('[data-testid=\"student-profile-v2\"]')"],
    [`/minha-area/treino/${FIXTURE_IDS.historicalSession}`, "document.querySelector('[data-testid=\"workout-completion-result\"]') || document.querySelector('[data-testid=\"student-workout-player-v2\"]')"],
  ];
  for (const [path, ready] of routes) {
    await navigateWithReactReadiness(browser, `${vite.baseUrl}${path}`, ready);
    assert.equal(await evaluateCdp(browser, "location.pathname"), path, `${path} redirecionou inesperadamente.`);
  }

  console.log("MANUAL_QA_V2_SMOKE=PASS");
  console.log("LOGIN_ROUTE=PASS");
  console.log("CANONICAL_ENTRY_ROUTE=PASS");
  console.log("HOME_ROUTE=PASS");
  console.log("TRAINING_LIBRARY_ROUTE=PASS");
  console.log("WORKOUT_DETAIL_ROUTE=PASS");
  console.log("EVOLUTION_ROUTE=PASS");
  console.log("PROFILE_ROUTE=PASS");
  console.log("WORKOUT_PLAYER_ROUTE=PASS");
  console.log("LEGACY_REDIRECT=NO");
} finally {
  browser?.close();
  if (chrome?.child) stopOwnedProcessTree(chrome.child);
  if (vite?.child) {
    stopOwnedProcessTree(vite.child);
    await waitForViteStop(vite.baseUrl).catch(() => {});
  }
  await authClient.auth.signOut().catch(() => {});
  await removeQaProfileDir(profileDir).catch(() => {});
}
