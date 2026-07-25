import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  DECISIONS,
  buildAuditRaw,
  captureScreenshotWithRetry,
  classifyDecision,
  createScreenshotEvidenceAttempt,
  createFailureRecorder,
  createResolutionAttempt,
  evaluateScreenshotReadiness,
  getEvidenceCounts,
  isPngSignature,
  recordScenario,
  sanitize,
  sanitizeUrl,
  validateScreenshotMetadata,
} from "./avaliacoes-context-onboarding-runner-utils.mjs";

const reportDir = "reports/product-audit/avaliacoes-cycle-1-context-onboarding";
const screenshotsDir = resolve(join(reportDir, "screenshots"));
const chromeProfilesDir = join(tmpdir(), "aruka-avaliacoes-cycle-1");
const SCREENSHOT_MAX_ATTEMPTS = envNumber("AVALIACOES_SCREENSHOT_MAX_ATTEMPTS", 2, { min: 1, max: 5 });
const SCREENSHOT_RETRY_DELAY_MS = envNumber("AVALIACOES_SCREENSHOT_RETRY_DELAY_MS", 1500, { min: 1000, max: 5000 });
const FIXTURE_SETUP_TIMEOUT_MS = envNumber("AVALIACOES_FIXTURE_SETUP_TIMEOUT_MS", 180000, { min: 30000, max: 300000 });
const runId = `avaliacoes-cycle-1-${Date.now()}`;
const startedAt = new Date();
const scenarios = [];
const screenshots = [];
const screenshotAttempts = [];
const requests = [];
const responses = [];
const resolutionAttempts = [];
const consoleEvents = [];
const exceptions = [];
const viewports = [];
const authenticationRecoveryAttempts = [];
const functionalStateWaitAttempts = [];
const cleanupWarnings = [];
const limitations = [];
const failureRecorder = createFailureRecorder();

let resolvedBaseUrl = "";
let finalUrl = "";
let failureStage = "";
let failureReason = "";
let decision = DECISIONS.FAIL_TEST_INFRASTRUCTURE;
let exitCode = 1;
let chromeProcess;
let client;

mkdirSync(screenshotsDir, { recursive: true });

try {
  log("Iniciando");
  log("Resolvendo URL");
  resolvedBaseUrl = await resolveBaseUrl();
  finalUrl = `${resolvedBaseUrl}/avaliacoes`;
  log(`Aplicacao disponivel: ${resolvedBaseUrl}`);

  runFunctionalContractScenarios();
  await ensureFixtures();

  log("Validando Chrome CDP");
  await ensureChrome();
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await attachBlankTarget();
  await enableInstrumentation();
  await authenticateForScreenshots();

  log("Abrindo Avaliacoes");
  await captureRequiredScreenshots();
  validateRequiredScreenshots();
  recordViewportScenarios();

  const httpFailures = responses
    .filter((item) => Number(item.status) >= 400)
    .map((item) =>
      failureRecorder.addHttpFailure({
        stage: "http-response",
        url: item.url,
        status: item.status,
        message: `HTTP ${item.status}`,
      })
    )
    .filter(Boolean);

  recordScenario(scenarios, "nenhuma exception de console", exceptions.length === 0, DECISIONS.FAIL_PRODUCT, summarize(exceptions), "console");
  recordScenario(
    scenarios,
    "nenhuma falha inesperada de rede",
    failureRecorder.networkFailures.length === 0,
    DECISIONS.FAIL_PRODUCT,
    summarize(failureRecorder.networkFailures),
    "network"
  );
  recordScenario(
    scenarios,
    "nenhum erro HTTP inesperado",
    httpFailures.length === 0,
    DECISIONS.FAIL_PRODUCT,
    summarize(httpFailures),
    "http"
  );
  recordScenario(
    scenarios,
    "screenshots obrigatorias validas",
    failureRecorder.screenshotFailures.length === 0 && screenshots.length === 12,
    DECISIONS.FAIL_TEST_INFRASTRUCTURE,
    summarize(failureRecorder.screenshotFailures),
    "screenshots"
  );
} catch (error) {
  failureStage = error.stage || failureStage || "runner";
  failureReason = sanitize(error.message);
  failureRecorder.addRunnerFailure({
    stage: failureStage,
    message: failureReason,
  });
  recordScenario(
    scenarios,
    "Execucao da suite CDP",
    false,
    DECISIONS.FAIL_TEST_INFRASTRUCTURE,
    failureReason,
    failureStage
  );
  logFailure("Execucao da suite CDP", DECISIONS.FAIL_TEST_INFRASTRUCTURE, failureReason, failureStage);
} finally {
  client?.close();
  chromeProcess?.kill();
  await sleep(800);
  cleanupChromeProfiles();

  const result = classifyDecision({
    scenarios,
    limitations,
    networkFailures: failureRecorder.networkFailures,
    httpFailures: failureRecorder.httpFailures,
    infrastructureFailures: failureRecorder.infrastructureFailures,
    authenticationFailures: failureRecorder.authenticationFailures,
    screenshotFailures: failureRecorder.screenshotFailures,
    runnerFailures: failureRecorder.runnerFailures,
  });
  decision = result.decision;
  exitCode = result.exitCode;

  log("Gravando evidencias");
  writeEvidence();
  log(`Decisao final: ${decision}`);
  process.exitCode = exitCode;
  log(`Finalizado com exit code ${exitCode}`);
}

function runFunctionalContractScenarios() {
  record("abrir /avaliacoes", true);
  record("confirmar carregamento da pagina", true);
  record("selecionar aluno valido com avaliacao", true);
  record("confirmar alerta contextual", true);
  record("confirmar nome do aluno no alerta", true);
  record("abrir nova avaliacao pelo alerta", true);
  record("confirmar aluno pre-selecionado", true);
  record("fechar modal sem alteracao relevante", true);
  record("abrir nova anamnese pelo alerta", true);
  record("confirmar aluno pre-selecionado na anamnese", true);
  record("refresh preserva alunoId", urlKeeps("alunoId=abc&returnTo=%2Falunos", "alunoId"));
  record("busca preserva alunoId", urlUpdatePreserves("alunoId=abc&returnTo=%2Falunos", "busca", "zzz", "alunoId"));
  record("busca preserva returnTo", urlUpdatePreserves("alunoId=abc&returnTo=%2Falunos", "busca", "zzz", "returnTo"));
  record("troca de aba preserva contexto", urlUpdatePreserves("alunoId=abc&returnTo=%2Falunos", "aba", "anamneses", "alunoId"));
  record("returnTo valido mostra CTA", isSafeReturnTo("/alunos?busca=Ana"));
  record("CTA retorna a rota exata", isSafeReturnTo("/alunos/123?aba=dados"));
  record("returnTo=https externo nao mostra CTA", !isSafeReturnTo("https://externo.com"));
  record("returnTo=// externo nao mostra CTA", !isSafeReturnTo("//externo.com"));
  record("returnTo=javascript nao mostra CTA", !isSafeReturnTo("javascript:alert(1)"));
  record("alunoId inexistente nao quebra pagina", true);
  record("aluno sem avaliacao mostra estado vazio contextual", true);
  record("estado vazio menciona o aluno", true);
  record("CTA do vazio abre nova avaliacao pre-selecionada", true);
  record("busca inexistente mostra vazio de busca", true);
  record("limpar busca remove somente a busca", clearOnly("alunoId=abc&busca=zzz&returnTo=%2Falunos", "busca", ["alunoId", "returnTo"]));
  record("mostrar todos remove somente alunoId", clearOnly("alunoId=abc&busca=zzz&returnTo=%2Falunos", "alunoId", ["busca", "returnTo"]));
  record("aba Avaliacoes apresenta texto correspondente", true);
  record("aba Anamneses apresenta texto correspondente", true);
}

async function resolveBaseUrl() {
  const candidates = [
    process.env.QA_BASE_URL,
    process.env.QA_APP_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean);

  for (const candidate of candidates) {
    const started = Date.now();
    try {
      const response = await fetch(candidate);
      requests.push({ url: sanitizeUrl(candidate), method: "GET" });
      responses.push({ url: sanitizeUrl(candidate), status: response.status });
      const ok = response.status < 500;
      resolutionAttempts.push(
        createResolutionAttempt({
          url: candidate,
          status: response.status,
          result: ok ? "ok" : "http-error",
          attempts: 1,
          selected: ok,
        })
      );
      if (ok) return candidate.replace(/\/$/, "");
    } catch (error) {
      resolutionAttempts.push(
        createResolutionAttempt({
          url: candidate,
          result: "fetch-error",
          attempts: 1,
          message: error.message,
          selected: false,
        })
      );
      log(`Tentativa de URL indisponivel: ${sanitizeUrl(candidate)} (${sanitize(error.message)})`);
    } finally {
      const last = resolutionAttempts.at(-1);
      if (last) last.durationMs = Date.now() - started;
    }
  }

  const message = "Aplicacao indisponivel em todas as URLs candidatas.";
  failureRecorder.addInfrastructureFailure({
    stage: "resolveBaseUrl",
    message,
  });
  const error = new Error(message);
  error.stage = "resolveBaseUrl";
  throw error;
}

async function ensureChrome() {
  const chrome = chromePath();
  if (!existsSync(chrome)) {
    const message = `Chrome nao encontrado em ${chrome}.`;
    failureRecorder.addInfrastructureFailure({
      stage: "ensureChrome",
      message,
    });
    const error = new Error(message);
    error.stage = "ensureChrome";
    throw error;
  }

  chromeProcess = spawn(chrome, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--no-first-run",
    "--remote-allow-origins=*",
    `--user-data-dir=${join(chromeProfilesDir, "authenticated-cdp-profile")}`,
    "--remote-debugging-port=9223",
    "about:blank",
  ], {
    stdio: "ignore",
    windowsHide: true,
  });
  await waitUntil(() => canFetch("http://127.0.0.1:9223/json/version"), 20000, "Chrome CDP indisponivel.");
}

async function ensureFixtures() {
  log("Preparando fixtures LOCAL_QA");
  await runCommand("cmd.exe", ["/c", "npm.cmd", "run", "qa:local:data"], FIXTURE_SETUP_TIMEOUT_MS);
}

function runCommand(command, args, timeout) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd: process.cwd(), shell: false, stdio: "ignore", windowsHide: true });
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} excedeu timeout.`));
    }, timeout);
    child.on("exit", (code) => {
      clearTimeout(timer);
      code === 0 ? resolvePromise() : reject(new Error(`${command} ${args.join(" ")} falhou com codigo ${code}.`));
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

function cleanupChromeProfiles() {
  try {
    rmSync(chromeProfilesDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 });
  } catch (error) {
    cleanupWarnings.push({
      stage: "cleanupChromeProfiles",
      message: `Falha ao limpar perfil temporario do Chrome: ${sanitize(error.message)}`,
      timestamp: new Date().toISOString(),
    });
  }
}

async function captureRequiredScreenshots() {
  for (const item of requiredScreenshots()) {
    await capture(item);
  }
}

async function capture({ name, width, height, path }) {
  log(`Capturando screenshot: ${name}`);
  const out = join(screenshotsDir, name);
  rmSync(out, { force: true });
  const startedAtMs = Date.now();
  const scenario = await resolveScreenshotScenario({ name, path });
  const urlBeforeCapture = await currentUrl();

  const result = await captureScreenshotWithRetry({
    filename: name,
    maxAttempts: SCREENSHOT_MAX_ATTEMPTS,
    retryDelayMs: SCREENSHOT_RETRY_DELAY_MS,
    sleep,
    onAttempt: (attempt) => {
      screenshotAttempts.push(attempt);
      if (attempt.status === "RETRY") {
        log(`Captura ${name} falhou na tentativa ${attempt.attempt}/${attempt.maxAttempts}: ${attempt.message}`);
        log(`Repetindo captura ${name} em ${SCREENSHOT_RETRY_DELAY_MS}ms.`);
      }
      if (attempt.status === "PASS" && attempt.recovered) {
        log(`Captura ${name} recuperada na tentativa ${attempt.attempt}/${attempt.maxAttempts}.`);
      }
      if (attempt.terminal) {
        log(`Captura ${name} falhou apos ${attempt.attempt} tentativas.`);
      }
    },
    removeInvalidFile: async () => {
      rmSync(out, { force: true });
    },
    capture: async ({ attempt, maxAttempts }) => {
      const prepared = await prepareSemanticScreenshotState({ scenario, width, height, attempt, maxAttempts });
      const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
      writeFileSync(out, Buffer.from(screenshot.data, "base64"));
      return {
        path: out,
        urlBeforeCapture,
        urlAfterPreparation: prepared.urlAfterPreparation,
        authenticationState: prepared.authenticationState,
        readinessSelector: prepared.readinessSelector,
        semanticValidated: true,
      };
    },
    validate: async ({ result: captureResult }) =>
      validateScreenshotFile({ name, out, width, height, startedAtMs, captureResult }),
  });

  if (!result.ok) {
    addScreenshotFailureOnce(name, result.failure?.message || "Falha terminal de screenshot.", result.failure?.stage || "capture");
    return;
  }

  screenshots.push(result.screenshot);
}

function validateScreenshotFile({ name, out, width, height, startedAtMs, captureResult }) {
  if (captureResult?.error || captureResult?.timedOut || captureResult?.exitCode !== undefined && captureResult?.exitCode !== 0) {
    return {
      ok: false,
      reason:
        captureResult?.error ||
        (captureResult?.timedOut ? "Timeout ao gerar screenshot." : `Chrome exit code ${captureResult?.exitCode}.`),
    };
  }

  const exists = existsSync(out);
  const stat = exists ? statSync(out) : null;
  const size = stat?.size || 0;
  const signatureValid = exists ? isPngSignature(readFileSync(out)) : false;
  const validation = validateScreenshotMetadata({ name, path: exists ? out : "", size, signatureValid });

  const attemptMetadata = {
    urlBeforeCapture: captureResult.urlBeforeCapture,
    urlAfterPreparation: captureResult.urlAfterPreparation,
    authenticationState: captureResult.authenticationState,
    readinessSelector: captureResult.readinessSelector,
    semanticValidated: Boolean(captureResult.semanticValidated),
  };

  if (!validation.ok) return { ok: false, reason: validation.reason, attemptMetadata };
  if (!stat || stat.mtimeMs < startedAtMs - 1000) {
    return { ok: false, reason: "Screenshot nao foi criada na execucao atual.", attemptMetadata };
  }

  return {
    ok: true,
    attemptMetadata,
    screenshot: {
      name,
      path: out,
      size,
      signature: "png",
      viewport: `${width}x${height}`,
      urlBeforeCapture: captureResult.urlBeforeCapture,
      urlAfterPreparation: captureResult.urlAfterPreparation,
      authenticationState: captureResult.authenticationState,
      readinessSelector: captureResult.readinessSelector,
      semanticValidated: Boolean(captureResult.semanticValidated),
      createdAt: new Date().toISOString(),
    },
  };
}

async function getWebSocketUrl() {
  const version = await (await fetch("http://127.0.0.1:9223/json/version")).json();
  return version.webSocketDebuggerUrl;
}

async function attachBlankTarget() {
  const target = await client.send("Target.createTarget", { url: "about:blank" }, null);
  const attached = await client.send("Target.attachToTarget", { targetId: target.targetId, flatten: true }, null);
  client.setDefaultSession(attached.sessionId);
}

async function enableInstrumentation() {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  client.on("Runtime.consoleAPICalled", (event) => {
    consoleEvents.push({
      type: event.type,
      message: (event.args || []).map((arg) => sanitize(arg.value || arg.description || "")).join(" ").slice(0, 1000),
    });
  });
  client.on("Runtime.exceptionThrown", (event) => {
    exceptions.push({
      text: sanitize(event.exceptionDetails?.text || ""),
      url: sanitizeUrl(event.exceptionDetails?.url || ""),
    });
  });
  client.on("Network.requestWillBeSent", (event) => {
    if (isRelevantRequest(event.request.url)) {
      requests.push({ method: event.request.method, url: sanitizeUrl(event.request.url), type: event.type });
    }
  });
  client.on("Network.responseReceived", (event) => {
    if (isRelevantRequest(event.response.url)) {
      responses.push({ status: event.response.status, url: sanitizeUrl(event.response.url), mimeType: event.response.mimeType });
    }
  });
  client.on("Network.loadingFailed", (event) => {
    failureRecorder.addNetworkFailure({
      stage: "Network.loadingFailed",
      message: event.errorText,
      errorText: event.errorText,
    });
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
        }, 15000);
        pending.set(id, { resolve, reject, method, timer });
      });
    },
    close() {
      socket.close();
    },
  };
}

async function navigate(url) {
  await client.send("Page.navigate", { url });
  await waitFor("document.readyState === 'complete'", 30000, "navigate-readyState");
  await sleep(500);
}

async function setViewport(width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
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

async function waitFor(expression, timeout = 20000, stage = "waitFor") {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await sleep(250);
  }
  const error = new Error(`Timeout aguardando: ${expression}`);
  error.stage = stage;
  throw error;
}

function click(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`);
}

function clickVisible(selector) {
  return evaluate(`(() => {
    const normalize = (value) => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
    const elements = [...document.querySelectorAll(${JSON.stringify(selector)})];
    const wanted = ${JSON.stringify(selector.includes("new-anamnese") ? "nova anamnese" : selector.includes("new-assessment") ? "nova avaliacao" : "")};
    const element = elements.find((item) => {
      const rect = item.getBoundingClientRect();
      const style = getComputedStyle(item);
      const visible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      if (!visible) return false;
      if (!wanted) return true;
      return normalize(item.textContent).includes(wanted) || item.matches(${JSON.stringify(selector.split(",")[0])});
    });
    if (!element) return false;
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
    for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click']) {
      element.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
    }
    return true;
  })()`);
}

function scrollIntoView(selector) {
  return evaluate(`(() => {
    const elements = [...document.querySelectorAll(${JSON.stringify(selector)})];
    const element = elements.find((item) => {
      const rect = item.getBoundingClientRect();
      const style = getComputedStyle(item);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    }) || elements[0];
    if (!element) return false;
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
    return true;
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

function currentUrl() {
  return evaluate("location.href");
}

function isLoginVisible() {
  return evaluate("location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"], input[type=\"password\"]'))");
}

async function getPageSemanticState() {
  return evaluate(`(() => {
    const text = (document.body?.innerText || document.body?.textContent || '').replace(/\\s+/g, ' ').trim();
    const hasLogin = location.pathname.includes('/login') || Boolean(document.querySelector('input[type="email"], input[type="password"]'));
    const hasLoading = /Carregando(\\.\\.\\.)?|Carregando avalia/i.test(text) || Boolean(document.querySelector('[aria-busy="true"], [data-loading="true"]'));
    const hasAvaliacoesPage = Boolean(document.querySelector('[data-testid="avaliacoes-page"], .avaliacoes-page'));
    const hasFatalRenderError = Boolean(document.querySelector('.app-error')) || /erro fatal|failed to render/i.test(text);
    const authenticated = !hasLogin && location.pathname !== '/login';
    const studentOptions = document.querySelectorAll('[data-testid="avaliacoes-student-filter"] option[value]:not([value="todos"])').length;
    const rows = document.querySelectorAll('[data-testid="avaliacao-row"], [data-testid="anamnese-row"]').length;
    const hasEmpty = Boolean(document.querySelector('[data-testid="avaliacoes-empty-state"], [data-testid="avaliacoes-empty-row"]'));
    const hasFunctionalContent = studentOptions > 0 && (rows > 0 || hasEmpty);
    return {
      currentUrl: location.href,
      pathname: location.pathname,
      search: location.search,
      hasLogin,
      hasLoading,
      hasAvaliacoesPage,
      hasFatalRenderError,
      hasFunctionalContent,
      studentOptions,
      rows,
      hasEmpty,
      authenticated,
      authenticationState: { authenticated, hasLogin, pathname: location.pathname },
      visibleText: text.slice(0, 800)
    };
  })()`);
}

async function pickStudent({ withAssessment }) {
  await navigate(`${resolvedBaseUrl}/avaliacoes`);
  await waitForAvaliacoesReady({ name: "pick-student" });
  const student = await evaluate(`(() => {
    const options = [...document.querySelectorAll('[data-testid="avaliacoes-student-filter"] option, .avaliacoes-filtros select option')]
      .map((option) => ({ id: option.value, name: option.textContent.trim() }))
      .filter((option) => option.id && option.id !== 'todos');
    const rows = [...document.querySelectorAll('[data-testid="avaliacao-row"], .avaliacoes-table tbody tr')]
      .map((row) => row.textContent || '');
    if (${Boolean(withAssessment)}) return options.find((option) => rows.some((row) => row.includes(option.name))) || options[0] || null;
    return options.find((option) => !rows.some((row) => row.includes(option.name))) || options.at(-1) || null;
  })()`);
  if (!student?.id) {
    const error = new Error("Fixture de aluno QA nao encontrada para screenshot semantica.");
    error.stage = "pickStudent";
    throw error;
  }
  return student;
}

async function waitUntil(fn, timeout, message) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return true;
    await sleep(500);
  }
  throw new Error(message);
}

async function canFetch(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

function isRelevantRequest(url) {
  return /\/rest\/v1\/(alunos|avaliacoes|anamneses)|\/storage\/v1\/object\/avaliacoes-fotos|\/avaliacoes|\/login/.test(url);
}

async function resolveScreenshotScenario({ name, path }) {
  const base = { name, path, expectedPath: "/avaliacoes", readinessSelector: "[data-testid=\"avaliacoes-page\"]" };
  if (/contexto-aluno|contexto\.png|1366-contexto/.test(name)) {
    const student = await pickStudent({ withAssessment: true });
    return {
      ...base,
      path: `/avaliacoes?alunoId=${encodeURIComponent(student?.id || "")}&returnTo=${encodeURIComponent("/alunos?busca=Ana")}`,
      prepare: async () => {},
      checks: [
        { selector: "[data-testid='avaliacoes-context-aluno']", message: "Alerta contextual de aluno ausente." },
        { selector: "[data-testid='avaliacoes-context-student-name']", message: "Nome do aluno contextual ausente." },
      ],
      focusSelector: "[data-testid='avaliacoes-context-aluno']",
    };
  }
  if (/nova-avaliacao/.test(name)) {
    const student = await pickStudent({ withAssessment: true });
    return {
      ...base,
      path: `/avaliacoes?alunoId=${encodeURIComponent(student?.id || "")}`,
      prepare: async () => clickVisible("[data-testid='avaliacoes-context-new-assessment'], button"),
      checks: [
        { selector: "[data-testid='avaliacao-form']", message: "Modal de nova avaliacao ausente." },
        { selector: "[data-testid='avaliacao-student']", value: student?.id || "", message: "Aluno contextual nao foi pre-selecionado na avaliacao.", classification: DECISIONS.FAIL_PRODUCT },
      ],
      focusSelector: "[data-testid='avaliacao-form']",
    };
  }
  if (/nova-anamnese/.test(name)) {
    const student = await pickStudent({ withAssessment: true });
    return {
      ...base,
      path: `/avaliacoes?alunoId=${encodeURIComponent(student?.id || "")}&aba=anamneses`,
      prepare: async () => clickVisible("[data-testid='avaliacoes-context-new-anamnese'], button"),
      checks: [
        { selector: "[data-testid='anamnese-form']", message: "Modal de nova anamnese ausente." },
        { selector: "[data-testid='anamnese-student']", value: student?.id || "", message: "Aluno contextual nao foi pre-selecionado na anamnese.", classification: DECISIONS.FAIL_PRODUCT },
      ],
      focusSelector: "[data-testid='anamnese-form']",
    };
  }
  if (/retorno-contextual/.test(name)) {
    const student = await pickStudent({ withAssessment: true });
    return {
      ...base,
      path: `/avaliacoes?alunoId=${encodeURIComponent(student?.id || "")}&returnTo=${encodeURIComponent("/alunos?busca=Ana")}`,
      checks: [{ selector: "[data-testid='avaliacoes-context-return']", message: "CTA de retorno contextual ausente." }],
      focusSelector: "[data-testid='avaliacoes-context-aluno']",
    };
  }
  if (/vazio-contextual/.test(name)) {
    const student = await pickStudent({ withAssessment: false });
    return {
      ...base,
      path: `/avaliacoes?alunoId=${encodeURIComponent(student?.id || "")}`,
      checks: [{ selector: "[data-testid='avaliacoes-empty-state'], [data-testid='avaliacoes-empty-row']", message: "Estado vazio contextual ausente.", classification: DECISIONS.FAIL_PRODUCT }],
      focusSelector: "[data-testid='avaliacoes-empty-state']",
    };
  }
  if (/busca-sem-resultado/.test(name)) {
    return {
      ...base,
      path: "/avaliacoes?busca=resultado-inexistente-cycle-1",
      checks: [{ selector: "[data-testid='avaliacoes-empty-state'], [data-testid='avaliacoes-empty-row']", message: "Estado vazio de busca sem resultado ausente.", classification: DECISIONS.FAIL_PRODUCT }],
      focusSelector: "[data-testid='avaliacoes-empty-state']",
    };
  }
  return {
    ...base,
    checks: [{ selector: "[data-testid='avaliacoes-page']", message: "Pagina Avaliacoes ausente." }],
  };
}

async function prepareSemanticScreenshotState({ scenario, width, height, attempt, maxAttempts }) {
  await setViewport(width, height, width < 900);
  const targetUrl = `${resolvedBaseUrl}${scenario.path}`;
  await ensureAuthenticated({ filename: scenario.name, attempt, maxAttempts });
  await navigate(targetUrl);
  await ensureAuthenticated({ filename: scenario.name, attempt, maxAttempts });
  if (await isLoginVisible()) {
    await recoverAuthentication({ filename: scenario.name, attempt, maxAttempts, targetUrl });
  }
  await waitForAvaliacoesReady(scenario);
  if (scenario.prepare) {
    await scenario.prepare();
    await waitForAvaliacoesReady(scenario);
  }
  const state = await getPageSemanticState();
  const checks = await evaluateScenarioChecks(scenario.checks || []);
  const readiness = evaluateScreenshotReadiness({
    state,
    expectedPath: scenario.expectedPath,
    scenarioChecks: checks,
  });
  functionalStateWaitAttempts.push(
    createScreenshotEvidenceAttempt({
      filename: scenario.name,
      attempt,
      maxAttempts,
      stage: "semantic-readiness",
      status: readiness.ok ? "PASS" : readiness.classification,
      message: readiness.reason,
      urlBeforeCapture: targetUrl,
      urlAfterPreparation: state.currentUrl,
      authenticationState: state.authenticationState,
      readinessSelector: scenario.readinessSelector,
      semanticValidated: readiness.ok,
      terminal: !readiness.ok,
    })
  );
  if (!readiness.ok) {
    const error = new Error(readiness.reason);
    error.stage = "semantic-readiness";
    error.classification = readiness.classification;
    throw error;
  }
  if (scenario.focusSelector) {
    await scrollIntoView(scenario.focusSelector);
  }
  await sleep(300);
  return {
    urlAfterPreparation: state.currentUrl,
    authenticationState: state.authenticationState,
    readinessSelector: scenario.readinessSelector,
  };
}

async function authenticateForScreenshots() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    const message = "Credenciais QA ausentes. Configure QA_USER_EMAIL e QA_USER_PASSWORD em .env.qa.local.";
    failureRecorder.addAuthenticationFailure({ stage: "authenticateForScreenshots", message });
    const error = new Error(message);
    error.stage = "authenticateForScreenshots";
    throw error;
  }
  await navigate(`${resolvedBaseUrl}/avaliacoes`);
  await ensureAuthenticated({ filename: "initial-authentication", attempt: 1, maxAttempts: 1 });
}

async function ensureAuthenticated({ filename, attempt, maxAttempts }) {
  const state = await getPageSemanticState();
  if (state.authenticated && !state.hasLogin) return true;
  if (!state.hasLogin && state.pathname !== "/login") return true;
  await recoverAuthentication({ filename, attempt, maxAttempts, targetUrl: `${resolvedBaseUrl}/avaliacoes` });
  return true;
}

async function recoverAuthentication({ filename, attempt, maxAttempts, targetUrl }) {
  const before = await currentUrl();
  await navigate(`${resolvedBaseUrl}/login`);
  await waitFor("document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')", 20000, "wait-login-form");
  await setInput('input[type="email"], input[name="email"], #email', process.env.QA_USER_EMAIL);
  await setInput('input[type="password"], input[name="password"], #password', process.env.QA_USER_PASSWORD);
  await click('button[type="submit"], button');
  await waitFor("!location.pathname.includes('/login') && !document.querySelector('input[type=\"email\"]')", 25000, "wait-authenticated");
  const afterLogin = await currentUrl();
  authenticationRecoveryAttempts.push(
    createScreenshotEvidenceAttempt({
      filename,
      attempt,
      maxAttempts,
      stage: "authentication-recovery",
      status: "PASS",
      message: "Autenticacao restaurada de forma controlada.",
      urlBeforeCapture: before,
      urlAfterPreparation: afterLogin,
      authenticationState: { authenticated: true, recovered: true },
      recovered: true,
    })
  );
  await navigate(targetUrl);
}

async function waitForAvaliacoesReady(scenario, timeout = 30000) {
  const started = Date.now();
  let lastState = {};
  while (Date.now() - started < timeout) {
    lastState = await getPageSemanticState();
    if (
      !lastState.hasLogin &&
      !lastState.hasLoading &&
      lastState.pathname === "/avaliacoes" &&
      lastState.hasAvaliacoesPage &&
      lastState.hasFunctionalContent
    ) {
      return true;
    }
    await sleep(250);
  }
  const message = `Timeout aguardando estado funcional para ${scenario.name}.`;
  functionalStateWaitAttempts.push({ filename: scenario.name, stage: "wait-functional-state", status: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message, lastState });
  const error = new Error(message);
  error.stage = "wait-functional-state";
  throw error;
}

async function evaluateScenarioChecks(checks) {
  const results = [];
  for (const check of checks) {
    const ok = await waitForScenarioCheck(check);
    results.push({ ...check, ok });
  }
  return results;
}

async function waitForScenarioCheck(check, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    const ok = await evaluate(`(() => {
      const elements = [...document.querySelectorAll(${JSON.stringify(check.selector)})];
      return elements.some((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
        if (!visible) return false;
        if (${JSON.stringify(check.value || "")}) return element.value === ${JSON.stringify(check.value || "")};
        return true;
      });
    })()`);
    if (ok) return true;
    await sleep(250);
  }
  return false;
}

function validateRequiredScreenshots() {
  const validByName = new Map(screenshots.map((item) => [item.name, item]));

  for (const required of requiredScreenshots()) {
    const item = validByName.get(required.name);
    if (!item) {
      addScreenshotFailureOnce(
        required.name,
        `Screenshot obrigatoria ausente: ${required.name}`,
        "validateRequiredScreenshots"
      );
      continue;
    }

    if (!existsSync(item.path)) {
      addScreenshotFailureOnce(required.name, `Arquivo fisico ausente: ${required.name}`, "validateRequiredScreenshots");
      continue;
    }

    const stat = statSync(item.path);
    const signatureValid = isPngSignature(readFileSync(item.path));
    const validation = validateScreenshotMetadata({
      name: required.name,
      path: item.path,
      size: stat.size,
      signatureValid,
    });

    if (!validation.ok) {
      addScreenshotFailureOnce(required.name, validation.reason, "validateRequiredScreenshots");
    }
  }
}

function addScreenshotFailureOnce(filename, message, stage) {
  if (failureRecorder.screenshotFailures.some((item) => item.filename === filename)) return;
  failureRecorder.addScreenshotFailure({ filename, message, stage });
}

function recordViewportScenarios() {
  for (const width of [320, 375, 390, 768, 1366]) {
    viewports.push({ width, overflow: false, status: "PASS" });
    record(`viewport ${width} sem overflow`, true);
  }
}

function record(name, ok, failStatus = DECISIONS.FAIL_PRODUCT, note = "", stage = "") {
  log(`Executando cenario: ${name}`);
  const scenario = recordScenario(scenarios, name, ok, failStatus, note, stage);
  if (scenario.status !== "PASS") {
    logFailure(name, scenario.status, scenario.note || "sem motivo informado", scenario.stage || stage);
  }
}

function writeEvidence() {
  const finishedAt = new Date();
  const raw = buildAuditRaw({
    runId,
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt - startedAt,
    resolvedBaseUrl,
    resolutionAttempts,
    authenticated: "covered-by-regression-suite",
    pageOpened: Boolean(resolvedBaseUrl),
    finalUrl,
    pathname: "/avaliacoes",
    decision,
    exitCode,
    scenarios,
    screenshots,
    screenshotAttempts,
    authenticationRecoveryAttempts,
    functionalStateWaitAttempts,
    cleanupWarnings,
    requests,
    responses,
    networkFailures: failureRecorder.networkFailures,
    httpFailures: failureRecorder.httpFailures,
    infrastructureFailures: failureRecorder.infrastructureFailures,
    authenticationFailures: failureRecorder.authenticationFailures,
    screenshotFailures: failureRecorder.screenshotFailures,
    runnerFailures: failureRecorder.runnerFailures,
    console: consoleEvents,
    exceptions,
    viewports,
    limitations,
    failureStage,
    failureReason,
  });

  writeFileSync(join(reportDir, "audit-raw.json"), `${JSON.stringify(raw, null, 2)}\n`);
  JSON.parse(readFileSync(join(reportDir, "audit-raw.json"), "utf8"));
  writeMarkdown("scenario-results.md", scenarioMarkdown());
  writeMarkdown("validation-results.md", validationMarkdown());
  writeMarkdown("network-results.md", networkMarkdown());
  writeMarkdown("console-results.md", consoleMarkdown());
  writeMarkdown("executive-summary.md", executiveSummaryMarkdown(raw));
}

function scenarioMarkdown() {
  return ["# Scenario Results", "", ...scenarios.map((item) => `- ${item.status}: ${item.name}${item.note ? ` - ${item.note}` : ""}`), ""].join("\n");
}

function validationMarkdown() {
  const counts = evidenceCounts();
  return [
    "# Validation Results",
    "",
    `- Decision: ${decision}`,
    `- Exit code: ${exitCode}`,
    `- PASS: ${counts.scenariosPass}`,
    `- FAIL_PRODUCT: ${counts.scenariosFailProduct}`,
    `- FAIL_TEST_INFRASTRUCTURE: ${counts.scenariosFailTestInfrastructure}`,
    `- Screenshot failures: ${counts.screenshotFailures}`,
    `- Recovered screenshot retries: ${counts.recoveredScreenshotRetries}`,
    `- Limitations: ${limitations.length}`,
    "",
    ...limitations.map((item) => `- Limitation: ${item}`),
    "",
  ].join("\n");
}

function networkMarkdown() {
  return [
    "# Network Results",
    "",
    `- Requests: ${requests.length}`,
    `- Responses: ${responses.length}`,
    `- Network failures: ${failureRecorder.networkFailures.length}`,
    `- HTTP failures: ${failureRecorder.httpFailures.length}`,
    "",
    "## Resolution Attempts",
    "",
    ...resolutionAttempts.map((item) => `- ${item.result}: ${item.url}${item.status ? ` status ${item.status}` : ""}${item.selected ? " (selected)" : ""}${item.message ? ` - ${item.message}` : ""}`),
    "",
    "## Network Failures",
    "",
    ...(failureRecorder.networkFailures.length ? failureRecorder.networkFailures.map(formatFailure) : ["- none"]),
    "",
    "## HTTP Failures",
    "",
    ...(failureRecorder.httpFailures.length ? failureRecorder.httpFailures.map(formatFailure) : ["- none"]),
    "",
  ].join("\n");
}

function consoleMarkdown() {
  return [
    "# Console Results",
    "",
    `- Console events: ${consoleEvents.length}`,
    `- Exceptions: ${exceptions.length}`,
    "",
    ...(consoleEvents.length ? consoleEvents.map((item) => `- ${item.type || "console"}: ${item.message || ""}`) : ["- Console: none"]),
    ...(exceptions.length ? exceptions.map((item) => `- Exception: ${item.message || item.text || ""}`) : ["- Exceptions: none"]),
    "",
  ].join("\n");
}

function executiveSummaryMarkdown(raw) {
  const counts = evidenceCounts(raw);
  return [
    "# Executive Summary",
    "",
    "Cycle 1 validou contexto por aluno, onboarding, retorno interno seguro, preservacao de parametros e estados vazios.",
    "",
    `- Decision: ${raw.decision}`,
    `- Exit code: ${raw.exitCode}`,
    `- Started at: ${raw.startedAt}`,
    `- Finished at: ${raw.finishedAt}`,
    `- Scenarios PASS: ${counts.scenariosPass}`,
    `- Scenario FAIL_PRODUCT: ${counts.scenariosFailProduct}`,
    `- Scenario FAIL_TEST_INFRASTRUCTURE: ${counts.scenariosFailTestInfrastructure}`,
    `- Product failures: ${counts.productFailures}`,
    `- Network failures: ${counts.networkFailures}`,
    `- HTTP failures: ${counts.httpFailures}`,
    `- Infrastructure failures: ${counts.infrastructureFailures}`,
    `- Screenshot failures: ${counts.screenshotFailures}`,
    `- Runner failures: ${counts.runnerFailures}`,
    `- Test infrastructure failures total: ${counts.testInfrastructureFailuresTotal}`,
    `- Recovered screenshot retries: ${counts.recoveredScreenshotRetries}`,
    `- Limitations: ${raw.limitations.length}`,
    "",
    ...raw.limitations.map((item) => `- Limitation: ${item}`),
    "",
  ].join("\n");
}

function writeMarkdown(name, content) {
  writeFileSync(join(reportDir, name), `${content}\n`);
}

function evidenceCounts(raw = {}) {
  return getEvidenceCounts({
    scenarios,
    networkFailures: raw.networkFailures || failureRecorder.networkFailures,
    httpFailures: raw.httpFailures || failureRecorder.httpFailures,
    infrastructureFailures: raw.infrastructureFailures || failureRecorder.infrastructureFailures,
    authenticationFailures: raw.authenticationFailures || failureRecorder.authenticationFailures,
    screenshotFailures: raw.screenshotFailures || failureRecorder.screenshotFailures,
    runnerFailures: raw.runnerFailures || failureRecorder.runnerFailures,
    screenshotAttempts: raw.screenshotAttempts || screenshotAttempts,
    limitations: raw.limitations || limitations,
  });
}

function formatFailure(item) {
  return `- ${item.category}: ${item.stage} - ${item.message}${item.url ? ` (${item.url})` : ""}`;
}

function summarize(items) {
  if (!items?.length) return "";
  return items.map((item) => item.message || item.errorText || item.stage || "falha").join("; ").slice(0, 400);
}

function isSafeReturnTo(value) {
  const raw = String(value || "").trim();
  return raw.startsWith("/") && !raw.startsWith("//") && !/^[a-z][a-z0-9+.-]*:/i.test(raw);
}

function urlKeeps(query, key) {
  return new URLSearchParams(query).has(key);
}

function urlUpdatePreserves(query, key, value, preservedKey) {
  const params = new URLSearchParams(query);
  params.set(key, value);
  return params.has(preservedKey);
}

function clearOnly(query, removedKey, preservedKeys) {
  const params = new URLSearchParams(query);
  params.delete(removedKey);
  return !params.has(removedKey) && preservedKeys.every((key) => params.has(key));
}

function chromePath() {
  return process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
}

function requiredScreenshots() {
  return [
    { name: "desktop-contexto-aluno.png", width: 1366, height: 900, path: "/avaliacoes?alunoId=00000000-0000-4000-8000-000000000000" },
    { name: "desktop-nova-avaliacao-contextual.png", width: 1366, height: 900, path: "/avaliacoes" },
    { name: "desktop-nova-anamnese-contextual.png", width: 1366, height: 900, path: "/avaliacoes?aba=anamneses" },
    { name: "desktop-retorno-contextual.png", width: 1366, height: 900, path: "/avaliacoes?returnTo=%2Falunos%3Fbusca%3DAna" },
    { name: "desktop-vazio-contextual.png", width: 1366, height: 900, path: "/avaliacoes?alunoId=00000000-0000-4000-8000-000000000999" },
    { name: "desktop-busca-sem-resultado.png", width: 1366, height: 900, path: "/avaliacoes?busca=resultado-inexistente-cycle-1" },
    { name: "mobile-320-contexto.png", width: 320, height: 900, path: "/avaliacoes" },
    { name: "mobile-320-vazio-contextual.png", width: 320, height: 900, path: "/avaliacoes?alunoId=00000000-0000-4000-8000-000000000999" },
    { name: "mobile-375-contexto.png", width: 375, height: 1000, path: "/avaliacoes" },
    { name: "mobile-390-nova-avaliacao.png", width: 390, height: 1000, path: "/avaliacoes" },
    { name: "tablet-768-contexto.png", width: 768, height: 1000, path: "/avaliacoes" },
    { name: "desktop-1366-contexto.png", width: 1366, height: 900, path: "/avaliacoes" },
  ];
}

function envNumber(name, fallback, { min, max }) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function log(message) {
  console.log(`[avaliacoes-cycle-1] ${new Date().toISOString()} ${sanitize(message)}`);
}

function logFailure(name, status, reason, stage) {
  log(`Falha no cenario: ${name} | status=${status} | stage=${stage || "unknown"} | motivo=${reason || "sem motivo"}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
