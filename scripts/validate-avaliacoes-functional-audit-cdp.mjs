import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";

const reportDir = "reports/product-audit/avaliacoes-v1";
const screenshotsDir = join(reportDir, "screenshots");
const expectedSelector = '[data-testid="avaliacoes-page"], .avaliacoes-page';
const cdpPort = process.env.CDP_PORT || "9222";
const runId = `avaliacoes-audit-${Date.now()}`;
const startedAt = new Date();
const events = { console: [], exceptions: [], requests: [], responses: [], failures: [], redirects: [] };
const scenarios = [];
const snapshots = [];
const attempts = { application: [], chrome: [], navigation: [] };
const screenshots = [];

const audit = {
  runId,
  startedAt: startedAt.toISOString(),
  finishedAt: null,
  durationMs: 0,
  baseUrl: null,
  resolvedBaseUrl: null,
  viteReady: false,
  chromeReady: false,
  cdpReady: false,
  authenticated: false,
  pageOpened: false,
  currentUrl: "",
  pathname: "",
  title: "",
  screenDetected: "UNKNOWN",
  expectedSelector,
  selectorFound: false,
  failureStage: "",
  failureReason: "",
  attempts,
  networkEnabled: false,
  consoleEnabled: false,
  screenshots,
  events,
  scenarios,
  snapshots,
};

mkdirSync(screenshotsDir, { recursive: true });

let client;
let startedChrome;

try {
  log("Iniciando");
  validateQaCredentials();

  log("Resolvendo URL");
  const resolved = await resolveApplicationBaseUrl();
  audit.baseUrl = resolved.requestedBaseUrl;
  audit.resolvedBaseUrl = resolved.baseUrl;
  audit.viteReady = true;
  log(`URL encontrada: ${resolved.baseUrl}`);

  log("Validando Chrome CDP");
  const chromeInfo = await ensureChromeReady();
  audit.chromeReady = true;
  audit.chrome = chromeInfo;
  log(`Chrome conectado: ${chromeInfo.browser || "browser desconhecido"} / protocolo ${chromeInfo.protocolVersion || "-"}`);

  log("Criando nova aba about:blank");
  client = createCdpClient(await createBlankTab());
  await client.ready;
  audit.cdpReady = true;
  await attachBlankTarget();

  await enableInstrumentation();
  await setViewport("desktop-1366", 1366, 768, false);

  log("Abrindo URL inicial da aplicacao");
  await navigate(joinUrl(audit.resolvedBaseUrl, "/"));
  await snapshotPage("app-root");

  log("Autenticando");
  await authenticateIfNeeded();

  log("Abrindo Avaliacoes");
  await openAvaliacoes("/avaliacoes");
  const initial = await inspectAvaliacoes("desktop-lista");
  await capture("desktop-lista.png");
  record("Entrada no modulo", initial.hasPage && initial.loaded);
  record("Acao principal visivel", initial.hasNewAvaliacaoButton);
  record("Aba de anamneses visivel", initial.hasAnamneseTab);
  record("Lista, tabela ou estado vazio renderizado", initial.rowCount > 0 || initial.hasEmpty);

  const alunoComAvaliacao = await pickStudent({ withAssessment: true });
  const alunoSemAvaliacao = await pickStudent({ withAssessment: false });

  await openAvaliacoes(`/avaliacoes?alunoId=${encodeURIComponent(alunoComAvaliacao?.id || "")}&returnTo=${encodeURIComponent("/alunos?busca=Ana&status=Ativo")}`);
  const contextual = await inspectAvaliacoes("contexto-aluno");
  await capture("contexto-aluno.png");
  record("Contexto por aluno valido renderiza", contextual.hasPage && contextual.hasContext);
  record("Contexto preserva alunoId no refresh", await reloadKeepsAlunoId());

  await openAvaliacoes("/avaliacoes?alunoId=00000000-0000-4000-8000-000000000999");
  const invalid = await inspectAvaliacoes("contexto-invalido");
  await capture("contexto-invalido.png");
  record("alunoId inexistente nao quebra pagina", invalid.hasPage && invalid.loaded);
  record("alunoId inexistente nao exibe contexto falso", !invalid.hasContext);

  if (alunoSemAvaliacao?.id) {
    await openAvaliacoes(`/avaliacoes?alunoId=${encodeURIComponent(alunoSemAvaliacao.id)}`);
    const emptyStudent = await inspectAvaliacoes("aluno-sem-avaliacao");
    await capture("aluno-sem-avaliacao.png");
    record("Estado vazio por aluno aparece", emptyStudent.hasEmpty && emptyStudent.rowCount === 0);
  } else {
    record("Estado vazio por aluno aparece", false, "NOT_RUN", "Fixture sem aluno sem avaliacao identificavel.");
  }

  await openAvaliacoes("/avaliacoes");
  const openedDetails = await clickFirstVisibleButton("Perfil");
  if (openedDetails) {
    await sleep(800);
    const details = await inspectDetails();
    await capture("desktop-detalhe.png");
    record("Detalhe do perfil abre", details.hasDetails);
    record("Historico e graficos aparecem quando ha dados", details.hasHistory && details.hasCharts);
    record("Relatorio da avaliacao disponivel", details.hasReportButton);
  } else {
    record("Detalhe do perfil abre", false, "NOT_RUN", "Nenhuma avaliacao com acao Perfil visivel.");
  }

  await openAvaliacoes("/avaliacoes");
  await clickFirstVisibleButton("Nova avaliacao");
  await sleep(900);
  const createModal = await inspectForm();
  await capture("desktop-nova-avaliacao.png");
  record("Formulario de nova avaliacao abre", createModal.hasModal);
  record("Formulario contem campos essenciais", createModal.hasStudentSelect && createModal.hasDate && createModal.hasWeight && createModal.hasHeight);
  record("Formulario contem fotos opcionais", createModal.fileInputs >= 3);
  await clickFirstVisibleButton("Salvar Avaliacao");
  await sleep(700);
  const validationText = await bodyText();
  record("Salvar vazio mostra feedback", /aluno e a data|avaliacao incompleta/i.test(normalize(validationText)));
  await clickFirstVisibleButton("Fechar");

  await runResponsiveChecks();
  audit.failureStage = "";
  audit.failureReason = "";
  await snapshotPage("final");
  writeEvidence();

  const hasBlockingFailure = scenarios.some((item) => item.status === "FAIL_TEST_INFRASTRUCTURE" || item.status === "FAIL_ENVIRONMENT_OR_AUTHENTICATION") || events.exceptions.length > 0;
  process.exitCode = hasBlockingFailure ? 1 : 0;
  log(`Finalizado com exit code ${process.exitCode}`);
} catch (error) {
  const status = classifyTopLevelError(error);
  audit.failureStage = error.stage || audit.failureStage || "runner";
  audit.failureReason = sanitize(error.message);
  await safeSnapshotAndScreenshot("failure-page.png");
  scenarios.push({ name: "Execucao da suite CDP", status, note: buildFailureNote(error) });
  writeEvidence();
  process.exitCode = 1;
  log(`Falha: ${status} ${audit.failureStage} - ${audit.failureReason}`);
} finally {
  client?.close();
  if (startedChrome) startedChrome.kill();
}

async function resolveApplicationBaseUrl() {
  const envCandidates = [
    "QA_BASE_URL",
    "QA_APP_URL",
    "APP_BASE_URL",
    "APP_URL",
    "BASE_URL",
    "VITE_URL",
  ].map((name) => ({ source: name, value: process.env[name] })).filter((item) => item.value);
  const fallbackCandidates = [
    { source: "fallback-localhost", value: "http://localhost:5173" },
    { source: "fallback-127", value: "http://127.0.0.1:5173" },
  ];
  const candidates = uniqueUrls([
    ...envCandidates.flatMap((item) => expandHostVariants(item)),
    ...fallbackCandidates,
  ]);
  const requestedBaseUrl = normalizeBaseUrl(candidates[0]?.value || "http://localhost:5173");

  for (const candidate of candidates) {
    const baseUrl = normalizeBaseUrl(candidate.value);
    const result = await waitForApplication(baseUrl, { timeoutMs: 30000, source: candidate.source });
    if (result.ok) return { baseUrl, requestedBaseUrl, source: candidate.source };
  }

  const error = new Error(`Aplicacao indisponivel. URLs testadas: ${attempts.application.map((item) => `${item.url}=${item.result}`).join(", ")}`);
  error.stage = "resolveApplicationBaseUrl";
  throw error;
}

async function waitForApplication(baseUrl, { timeoutMs, source }) {
  const started = Date.now();
  let count = 0;
  while (Date.now() - started < timeoutMs) {
    count += 1;
    const attempt = { source, url: baseUrl, attempt: count, at: new Date().toISOString(), result: "pending", status: null, error: "" };
    try {
      const response = await fetch(baseUrl, { redirect: "manual" });
      attempt.status = response.status;
      attempt.result = response.status < 500 ? "ok" : "http-error";
      attempts.application.push(attempt);
      if (response.status < 500) {
        log(`Aplicacao disponivel: ${baseUrl} status ${response.status} tentativas ${count}`);
        return { ok: true, attempts: count, durationMs: Date.now() - started };
      }
    } catch (error) {
      attempt.result = "fetch-error";
      attempt.error = sanitize(error.message);
      attempts.application.push(attempt);
    }
    await sleep(Math.min(250 + count * 100, 1200));
  }
  log(`Aplicacao indisponivel: ${baseUrl} tentativas ${count} tempo ${timeoutMs}ms`);
  return { ok: false, attempts: count, durationMs: Date.now() - started };
}

async function ensureChromeReady() {
  const existing = await pollChromeVersion(8000);
  if (existing) return existing;

  log("Chrome CDP nao respondeu; tentando iniciar Chrome");
  startedChrome = startChrome();
  attachChromeProcessDiagnostics(startedChrome);
  const started = await pollChromeVersion(15000);
  if (started) return started;
  const error = new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  error.stage = "ensureChromeReady";
  throw error;
}

function startChrome() {
  const chromePath = process.platform === "win32" ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" : "google-chrome";
  const userDataDir = join(process.env.TEMP || process.env.TMP || ".", `aruka-avaliacoes-audit-chrome-${process.pid}`);
  return spawn(chromePath, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-extensions",
    "--no-first-run",
    "--remote-allow-origins=*",
    `--user-data-dir=${userDataDir}`,
    `--remote-debugging-port=${cdpPort}`,
    "about:blank",
  ], { stdio: ["ignore", "pipe", "pipe"], shell: false });
}

function attachChromeProcessDiagnostics(child) {
  audit.chromeProcess = { exitCode: null, signal: null, stderr: [], stdout: [] };
  child.stdout?.on("data", (chunk) => audit.chromeProcess.stdout.push(sanitize(chunk.toString()).slice(0, 1000)));
  child.stderr?.on("data", (chunk) => audit.chromeProcess.stderr.push(sanitize(chunk.toString()).slice(0, 1000)));
  child.on("exit", (code, signal) => {
    audit.chromeProcess.exitCode = code;
    audit.chromeProcess.signal = signal;
  });
  child.on("error", (error) => {
    audit.chromeProcess.error = sanitize(error.message);
  });
}

async function pollChromeVersion(timeoutMs) {
  const started = Date.now();
  let count = 0;
  while (Date.now() - started < timeoutMs) {
    count += 1;
    const url = `http://127.0.0.1:${cdpPort}/json/version`;
    const attempt = { url, attempt: count, at: new Date().toISOString(), result: "pending", error: "" };
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        attempts.chrome.push({ ...attempt, result: "ok", browser: data.Browser, protocolVersion: data["Protocol-Version"], webSocketDebuggerUrl: sanitizeUrl(data.webSocketDebuggerUrl || "") });
        return {
          port: cdpPort,
          browser: data.Browser,
          protocolVersion: data["Protocol-Version"],
          webSocketDebuggerUrl: data.webSocketDebuggerUrl,
        };
      }
      attempts.chrome.push({ ...attempt, result: `http-${response.status}` });
    } catch (error) {
      attempts.chrome.push({ ...attempt, result: "fetch-error", error: sanitize(error.message) });
    }
    await sleep(300);
  }
  return null;
}

async function createBlankTab() {
  return audit.chrome.webSocketDebuggerUrl;
}

async function attachBlankTarget() {
  log("Criando nova aba via Target.createTarget: about:blank");
  const target = await client.send("Target.createTarget", { url: "about:blank" }, null);
  const attached = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true }, null);
  client.setDefaultSession(attached.sessionId);
  audit.cdpTarget = { targetId: target.targetId, sessionId: attached.sessionId };
  log(`Nova aba anexada: target=${target.targetId} session=${attached.sessionId}`);
}

async function enableInstrumentation() {
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    audit.networkEnabled = true;
    audit.consoleEnabled = true;
    registerEventCollectors();
  } catch (error) {
    audit.networkEnabled = false;
    audit.consoleEnabled = false;
    scenarios.push({ name: "Listeners CDP de console/rede", status: "NOT_RUN", note: sanitize(error.message) });
  }
}

async function authenticateIfNeeded() {
  let screen = await detectCurrentScreen();
  if (screen !== "LOGIN") {
    audit.authenticated = true;
    return;
  }

  await setInput('input[type="email"], input[name="email"], #email', process.env.QA_USER_EMAIL);
  await setInput('input[type="password"], input[name="password"], #password', process.env.QA_USER_PASSWORD);
  await click('button[type="submit"], button');
  await sleep(5500);
  await snapshotPage("post-login");
  screen = await detectCurrentScreen();
  if (screen === "LOGIN") {
    const error = new Error(`Autenticacao nao saiu da tela de login. URL final: ${audit.currentUrl}`);
    error.stage = "authentication";
    throw error;
  }
  audit.authenticated = true;
  log(`Autenticacao registrada. Tela atual: ${screen}`);
}

async function openAvaliacoes(path) {
  await navigate(joinUrl(audit.resolvedBaseUrl, path));
  await ensureNotLoginBeforeModule();
  await waitForAvaliacoesPage();
}

async function ensureNotLoginBeforeModule() {
  const screen = await detectCurrentScreen();
  if (screen !== "LOGIN") return;
  await authenticateIfNeeded();
  if ((await detectCurrentScreen()) === "LOGIN") {
    const error = new Error("Permaneceu em /login antes de esperar o modulo Avaliacoes.");
    error.stage = "authentication";
    throw error;
  }
  await navigate(joinUrl(audit.resolvedBaseUrl, "/avaliacoes"));
}

async function waitForAvaliacoesPage(timeout = 30000) {
  log("Esperando modulo Avaliacoes");
  const started = Date.now();
  let lastScreen = {};
  while (Date.now() - started < timeout) {
    lastScreen = await snapshotPage("wait-avaliacoes", { store: false });
    if (lastScreen.selectorFound) {
      audit.pageOpened = true;
      audit.selectorFound = true;
      await waitForContent();
      return;
    }
    await sleep(300);
  }
  audit.failureStage = "waitForAvaliacoesPage";
  audit.failureReason = `Timeout aguardando seletor ${expectedSelector}`;
  const error = new Error(`Timeout aguardando modulo Avaliacoes. URL final: ${lastScreen.currentUrl}. Tela: ${lastScreen.screenDetected}. Pathname: ${lastScreen.pathname}. Title: ${lastScreen.title}. Seletor: ${expectedSelector}. Tempo: ${timeout}ms.`);
  error.stage = "waitForAvaliacoesPage";
  throw error;
}

async function waitForContent() {
  await waitFor(`(() => {
    const text = document.body.textContent || '';
    const hasContent = document.querySelector('.avaliacoes-table, .avaliacoes-mobile-cards, .app-empty-state, .app-error');
    return Boolean(hasContent) && !/Carregando avaliacoes|Carregando avaliações|Carregando avalia/i.test(text);
  })()`, 30000, "waitForContent");
  await sleep(600);
}

async function navigate(url) {
  const normalized = normalizeNavigationUrl(url);
  attempts.navigation.push({ at: new Date().toISOString(), url: normalized, stage: "Page.navigate" });
  log(`Navegando para ${normalized}`);
  await client.send("Page.navigate", { url: normalized });
  await waitFor("document.readyState === 'complete'", 30000, "navigate-readyState");
  await sleep(700);
  await snapshotPage("navigate");
}

async function runResponsiveChecks() {
  const viewports = [
    ["mobile-320-lista.png", 320, 568, true],
    ["mobile-375-lista.png", 375, 667, true],
    ["mobile-390-lista.png", 390, 844, true],
    ["tablet-768-lista.png", 768, 1024, true],
    ["desktop-1366-lista.png", 1366, 768, false],
  ];
  for (const [filename, width, height, mobile] of viewports) {
    await setViewport(filename.replace(".png", ""), width, height, mobile);
    await openAvaliacoes("/avaliacoes");
    const state = await inspectAvaliacoes(filename.replace(".png", ""));
    await capture(filename);
    record(`${width}px sem overflow horizontal`, Math.abs(state.overflowDelta) <= 1);
  }
}

async function pickStudent({ withAssessment }) {
  await openAvaliacoes("/avaliacoes");
  return evaluate(`(() => {
    const options = [...document.querySelectorAll('.avaliacoes-filtros select option')]
      .map((option) => ({ id: option.value, nome: option.textContent.trim() }))
      .filter((option) => option.id && option.id !== 'todos');
    const rows = [...document.querySelectorAll('.avaliacoes-table tbody tr')]
      .map((row) => row.textContent || '');
    if (${Boolean(withAssessment)}) {
      return options.find((option) => rows.some((text) => text.includes(option.nome))) || options[0] || null;
    }
    return options.find((option) => !rows.some((text) => text.includes(option.nome))) || options.at(-1) || null;
  })()`);
}

async function inspectAvaliacoes(name) {
  const data = await evaluate(`(() => {
    const root = document.documentElement;
    const text = document.body.textContent || '';
    return {
      name: ${JSON.stringify(name)},
      hasPage: Boolean(document.querySelector(${JSON.stringify(expectedSelector)})),
      loaded: !/Carregando avaliacoes|Carregando avaliações|Carregando avalia/i.test(text),
      hasContext: Boolean(document.querySelector('[data-testid="avaliacoes-context-aluno"]')),
      hasNewAvaliacaoButton: [...document.querySelectorAll('button')].some((button) => /Nova avaliacao|Nova avaliação|Nova avalia/i.test(button.textContent || '')),
      hasAnamneseTab: /Anamneses/i.test(text),
      hasEmpty: Boolean(document.querySelector('.app-empty-state')) || /Nenhuma avaliacao|Nenhuma avaliação|Nenhuma avalia/i.test(text),
      rowCount: [...document.querySelectorAll('.avaliacoes-table tbody tr')].filter((row) => !/Carregando|Nenhuma/i.test(row.textContent || '')).length,
      overflowDelta: root.scrollWidth - root.clientWidth,
      text: text.slice(0, 1400)
    };
  })()`);
  snapshots.push(data);
  return data;
}

async function inspectDetails() {
  return evaluate(`(() => {
    const text = document.body.textContent || '';
    return {
      hasDetails: Boolean(document.querySelector('.avaliacoes-details-card')),
      hasHistory: /Historico de evolucao|Histórico de evolução|Hist/i.test(text),
      hasCharts: /Graficos de evolucao|Gráficos de evolução|Gr/i.test(text),
      hasReportButton: [...document.querySelectorAll('button')].some((button) => /Gerar relatorio da avaliacao|Gerar relatório da avaliação|Gerar relat/i.test(button.textContent || '')),
    };
  })()`);
}

async function inspectForm() {
  return evaluate(`(() => {
    const text = document.body.textContent || '';
    return {
      hasModal: /Avaliacao Fisica|Avaliação Física|Avalia/i.test(text),
      hasStudentSelect: [...document.querySelectorAll('select')].some((select) => [...select.options].some((option) => /Selecione/i.test(option.textContent || ''))),
      hasDate: Boolean(document.querySelector('input[type="date"]')),
      hasWeight: /Peso atual/i.test(text),
      hasHeight: /Altura/i.test(text),
      fileInputs: document.querySelectorAll('input[type="file"]').length,
      inputCount: document.querySelectorAll('input, select, textarea').length,
      overflowDelta: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  })()`);
}

async function reloadKeepsAlunoId() {
  await client.send("Page.reload");
  await waitForAvaliacoesPage();
  return evaluate("window.location.search.includes('alunoId=')");
}

async function detectCurrentScreen() {
  const state = await snapshotPage("detect", { store: false });
  return state.screenDetected;
}

async function snapshotPage(name, options = {}) {
  const data = await evaluate(`(() => {
    const text = (document.body?.innerText || document.body?.textContent || '').replace(/\\s+/g, ' ').trim();
    const pathname = location.pathname;
    const selectorFound = Boolean(document.querySelector(${JSON.stringify(expectedSelector)}));
    const hasLogin = pathname.includes('/login') || Boolean(document.querySelector('input[type="email"], input[name="email"], #email'));
    const hasSubscription = /assinatura|pagamento pendente|subscription/i.test(text);
    const hasDashboard = pathname.includes('/dashboard') || Boolean(document.querySelector('.dashboard-page, [data-page="dashboard"]'));
    const hasError = Boolean(document.querySelector('.app-error')) || /erro|failed|connection refused/i.test(text);
    let screenDetected = 'UNKNOWN';
    if (selectorFound) screenDetected = 'AVALIACOES';
    else if (hasLogin) screenDetected = 'LOGIN';
    else if (hasSubscription) screenDetected = 'SUBSCRIPTION';
    else if (hasDashboard) screenDetected = 'DASHBOARD';
    else if (hasError) screenDetected = 'ERROR';
    return {
      name: ${JSON.stringify(name)},
      at: new Date().toISOString(),
      currentUrl: location.href,
      pathname,
      title: document.title,
      readyState: document.readyState,
      visibleText: text.slice(0, 1000),
      hasLogin,
      hasError,
      hasSubscription,
      selectorFound,
      screenDetected
    };
  })()`);
  audit.currentUrl = data.currentUrl;
  audit.pathname = data.pathname;
  audit.title = data.title;
  audit.screenDetected = data.screenDetected;
  audit.selectorFound = data.selectorFound;
  if (options.store !== false) snapshots.push(data);
  return data;
}

async function safeSnapshotAndScreenshot(filename) {
  if (!client) return;
  try {
    await snapshotPage("failure");
    await capture(filename);
    const path = join(screenshotsDir, filename);
    const size = existsSync(path) ? statSync(path).size : 0;
    screenshots.push({ filename, path, size, diagnostic: true, exists: size > 0 });
  } catch (error) {
    screenshots.push({ filename, diagnostic: true, error: sanitize(error.message), exists: false, size: 0 });
  }
}

function writeEvidence() {
  audit.finishedAt = new Date().toISOString();
  audit.durationMs = Date.now() - startedAt.getTime();
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(audit, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), markdownResults("Scenario Results", scenarios));
  writeFileSync(join(reportDir, "console-results.md"), [
    "# Console Results",
    "",
    `- Listener status: ${audit.consoleEnabled ? "PASS" : "NOT_RUN"}`,
    `- Console events: ${events.console.length}`,
    `- Exceptions: ${events.exceptions.length}`,
    "",
    ...events.console.slice(0, 80).map((item) => `- ${item.type}: ${item.message}`),
    ...events.exceptions.map((item) => `- Exception: ${item.text} ${item.url}`),
    "",
  ].join("\n"));
  writeFileSync(join(reportDir, "network-results.md"), [
    "# Network Results",
    "",
    `- Listener status: ${audit.networkEnabled ? "PASS" : "NOT_RUN"}`,
    `- Requests captured: ${events.requests.length}`,
    `- Responses captured: ${events.responses.length}`,
    `- Failures captured: ${events.failures.length}`,
    `- Redirects captured: ${events.redirects.length}`,
    `- Error responses: ${events.responses.filter((item) => item.status >= 400).length}`,
    "",
    ...events.failures.map((item) => `- FAILURE: ${item.errorText} ${item.url || item.requestId}`),
    ...events.responses.filter((item) => item.status >= 400).map((item) => `- HTTP ${item.status}: ${item.url}`),
    "",
  ].join("\n"));
  writeFileSync(join(reportDir, "validation-results.md"), [
    "# Validation Results",
    "",
    "- Runner infrastructure updated for automatic URL resolution, HTTP readiness, Chrome/CDP polling, screen detection and diagnostic screenshots.",
    `- Last runId: ${runId}`,
    `- Resolved base URL: ${audit.resolvedBaseUrl || "NOT_RESOLVED"}`,
    `- Vite ready: ${audit.viteReady}`,
    `- Chrome ready: ${audit.chromeReady}`,
    `- CDP ready: ${audit.cdpReady}`,
    `- Authenticated: ${audit.authenticated}`,
    `- Page opened: ${audit.pageOpened}`,
    `- Screen detected: ${audit.screenDetected}`,
    `- Failure stage: ${audit.failureStage || "none"}`,
    `- Failure reason: ${audit.failureReason || "none"}`,
    "",
  ].join("\n"));
}

function markdownResults(title, items) {
  return [`# ${title}`, "", ...items.map((item) => `- ${item.status}: ${item.name}${item.note ? ` - ${item.note}` : ""}`), ""].join("\n");
}

function record(name, condition, statusIfFalse = "FAIL_PRODUCT", note = "") {
  scenarios.push({ name, status: condition ? "PASS" : statusIfFalse, note });
}

function classifyTopLevelError(error) {
  const stage = String(error?.stage || "");
  const message = String(error?.message || "");
  if (/resolveApplicationBaseUrl|ensureChromeReady|authentication/i.test(stage) || /Credenciais QA|Aplicacao indisponivel|Chrome CDP|ECONNREFUSED|login|Autenticacao/i.test(message)) {
    return "FAIL_ENVIRONMENT_OR_AUTHENTICATION";
  }
  if (/waitForAvaliacoesPage|Timeout|createBlankTab|CDP|cdp-send|runner/i.test(stage) || /Timeout aguardando|indisponivel|nao foi possivel criar aba|CDP socket|WebSocket CDP/i.test(message)) {
    return "FAIL_TEST_INFRASTRUCTURE";
  }
  return "FAIL_PRODUCT";
}

function buildFailureNote(error) {
  return [
    sanitize(error.message),
    `URL=${audit.currentUrl || audit.resolvedBaseUrl || "unknown"}`,
    `screen=${audit.screenDetected}`,
    `pathname=${audit.pathname}`,
    `selector=${expectedSelector}`,
    `screenshot=${screenshots.find((item) => item.diagnostic)?.filename || "not-created"}`,
  ].join(" | ");
}

async function setViewport(name, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  snapshots.push({ name, viewport: `${width}x${height}`, mobile });
}

async function capture(filename) {
  log(`Capturando screenshot ${filename}`);
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  const path = join(screenshotsDir, filename);
  writeFileSync(path, Buffer.from(screenshot.data, "base64"));
  const size = existsSync(path) ? statSync(path).size : 0;
  screenshots.push({ filename, path, size, exists: size > 0 });
}

function click(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`);
}

function clickFirstVisibleButton(text) {
  return evaluate(`(() => {
    const normalize = (value) => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
    const wanted = normalize(${JSON.stringify(text)});
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const button = [...document.querySelectorAll('button')]
      .find((item) => visible(item) && normalize(item.textContent).includes(wanted));
    button?.scrollIntoView({ block: 'center', inline: 'nearest' });
    button?.click();
    return Boolean(button);
  })()`);
}

function setInput(selector, value) {
  return evaluate(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

function bodyText() {
  return evaluate("document.body.textContent || ''");
}

async function waitFor(expression, timeout = 20000, stage = "waitFor") {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await sleep(250);
  }
  const state = await snapshotPage(stage, { store: false }).catch(() => null);
  const error = new Error(`Timeout aguardando: ${expression}. URL=${state?.currentUrl || audit.currentUrl}. Tela=${state?.screenDetected || audit.screenDetected}. Pathname=${state?.pathname || audit.pathname}. Title=${state?.title || audit.title}. Tempo=${timeout}ms.`);
  error.stage = stage;
  throw error;
}

async function evaluate(expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    const error = new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Erro ao avaliar expressao.");
    error.stage = "Runtime.evaluate";
    throw error;
  }
  return result.result.value;
}

function registerEventCollectors() {
  client.on("Runtime.consoleAPICalled", (event) => {
    events.console.push({
      type: event.type,
      message: (event.args || []).map((arg) => sanitize(arg.value || arg.description || "")).join(" ").slice(0, 1000),
      stack: sanitize(event.stackTrace?.callFrames?.map((frame) => `${frame.url}:${frame.lineNumber}`).join(" | ") || ""),
    });
  });
  client.on("Runtime.exceptionThrown", (event) => {
    events.exceptions.push({
      text: sanitize(event.exceptionDetails?.text || ""),
      url: sanitize(event.exceptionDetails?.url || ""),
      stack: sanitize(event.exceptionDetails?.stackTrace?.callFrames?.map((frame) => `${frame.url}:${frame.lineNumber}`).join(" | ") || ""),
    });
  });
  client.on("Network.requestWillBeSent", (event) => {
    if (event.redirectResponse) {
      events.redirects.push({ from: sanitizeUrl(event.redirectResponse.url), status: event.redirectResponse.status, to: sanitizeUrl(event.request.url) });
    }
    if (isRelevantRequest(event.request.url)) {
      events.requests.push({ method: event.request.method, url: sanitizeUrl(event.request.url), type: event.type });
    }
  });
  client.on("Network.responseReceived", (event) => {
    if (isRelevantRequest(event.response.url)) {
      events.responses.push({ status: event.response.status, url: sanitizeUrl(event.response.url), mimeType: event.response.mimeType });
    }
  });
  client.on("Network.loadingFailed", (event) => {
    events.failures.push({ requestId: event.requestId, errorText: sanitize(event.errorText || ""), canceled: Boolean(event.canceled), type: event.type });
  });
}

function createCdpClient(url) {
  const socket = new WebSocket(url);
  let nextId = 1;
  let defaultSessionId = null;
  const pending = new Map();
  const handlers = new Map();
  const rejectAll = (error) => {
    for (const { reject, timer } of pending.values()) {
      clearTimeout(timer);
      reject(error);
    }
    pending.clear();
  };
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method) handlers.get(message.method)?.forEach((handler) => handler(message.params || {}));
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject, method, timer } = pending.get(message.id);
    clearTimeout(timer);
    pending.delete(message.id);
    message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result);
  });
  socket.addEventListener("close", () => rejectAll(new Error("WebSocket CDP fechado antes da resposta.")));
  socket.addEventListener("error", () => rejectAll(new Error("Erro no WebSocket CDP.")));
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    on(method, handler) {
      handlers.set(method, [...(handlers.get(method) || []), handler]);
    },
    setDefaultSession(sessionId) {
      defaultSessionId = sessionId;
    },
    send(method, params = {}, sessionId = defaultSessionId) {
      const id = nextId++;
      if (socket.readyState !== WebSocket.OPEN) {
        return Promise.reject(new Error(`CDP socket nao esta aberto para ${method}. Estado=${socket.readyState}`));
      }
      socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          const error = new Error(`Timeout CDP aguardando resposta de ${method}.`);
          error.stage = "cdp-send";
          reject(error);
        }, 10000);
        pending.set(id, { resolve, reject, method, timer });
      });
    },
    close() {
      socket.close();
    },
  };
}

function isRelevantRequest(url) {
  return /\/rest\/v1\/(alunos|avaliacoes|anamneses)|\/storage\/v1\/object\/avaliacoes-fotos|\/avaliacoes|\/login/.test(url);
}

function expandHostVariants(item) {
  const normalized = normalizeBaseUrl(item.value);
  const variants = [{ source: item.source, value: normalized }];
  if (normalized.includes("127.0.0.1")) variants.push({ source: `${item.source}-localhost-variant`, value: normalized.replace("127.0.0.1", "localhost") });
  if (normalized.includes("localhost")) variants.push({ source: `${item.source}-127-variant`, value: normalized.replace("localhost", "127.0.0.1") });
  return variants;
}

function uniqueUrls(items) {
  const seen = new Set();
  return items.filter((item) => {
    const value = normalizeBaseUrl(item.value);
    if (seen.has(value)) return false;
    seen.add(value);
    item.value = value;
    return true;
  });
}

function normalizeBaseUrl(value) {
  const url = new URL(String(value || "").trim());
  url.pathname = "/";
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function joinUrl(base, path) {
  const cleanBase = normalizeBaseUrl(base);
  const cleanPath = `/${String(path || "").replace(/^\/+/, "")}`;
  return `${cleanBase}${cleanPath === "/" ? "" : cleanPath}`;
}

function normalizeNavigationUrl(url) {
  const parsed = new URL(url);
  parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");
  parsed.search = parsed.search.replace(/\/{2,}/g, "/");
  return parsed.toString();
}

function sanitize(value) {
  return String(value || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/apikey[=:]\s*[A-Za-z0-9._-]+/gi, "apikey=[redacted]")
    .slice(0, 2000);
}

function sanitizeUrl(value) {
  try {
    const url = new URL(String(value));
    url.searchParams.delete("apikey");
    return url.toString();
  } catch {
    return sanitize(value);
  }
}

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function validateQaCredentials() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    const error = new Error("Credenciais QA ausentes. Configure QA_USER_EMAIL e QA_USER_PASSWORD em .env.qa.local.");
    error.stage = "validateQaCredentials";
    throw error;
  }
}

function log(message) {
  console.log(`[avaliacoes-audit] ${new Date().toISOString()} ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
