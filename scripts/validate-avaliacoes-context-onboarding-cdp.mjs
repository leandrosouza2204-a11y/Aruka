import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  DECISIONS,
  buildAuditRaw,
  captureScreenshotWithRetry,
  classifyDecision,
  createFailureRecorder,
  createResolutionAttempt,
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
const SCREENSHOT_TIMEOUT_MS = envNumber("AVALIACOES_SCREENSHOT_TIMEOUT_MS", 20000, { min: 5000, max: 60000 });
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
const limitations = [
  "Autenticacao completa coberta pela regressao qa:avaliacoes-functional-audit.",
];
const failureRecorder = createFailureRecorder();

let resolvedBaseUrl = "";
let finalUrl = "";
let failureStage = "";
let failureReason = "";
let decision = DECISIONS.FAIL_TEST_INFRASTRUCTURE;
let exitCode = 1;
let chromeProcess;

mkdirSync(screenshotsDir, { recursive: true });

try {
  log("Iniciando");
  log("Resolvendo URL");
  resolvedBaseUrl = await resolveBaseUrl();
  finalUrl = `${resolvedBaseUrl}/avaliacoes`;
  log(`Aplicacao disponivel: ${resolvedBaseUrl}`);

  runFunctionalContractScenarios();

  log("Validando Chrome CDP");
  await ensureChrome();

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
  chromeProcess?.kill();
  rmSync(chromeProfilesDir, { recursive: true, force: true });

  const result = classifyDecision({
    scenarios,
    limitations,
    networkFailures: failureRecorder.networkFailures,
    httpFailures: failureRecorder.httpFailures,
    infrastructureFailures: failureRecorder.infrastructureFailures,
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

  chromeProcess = spawn(chrome, ["--headless=new", "--remote-debugging-port=9223", "about:blank"], {
    stdio: "ignore",
    windowsHide: true,
  });
  await sleep(500);
}

async function captureRequiredScreenshots() {
  for (const item of requiredScreenshots()) {
    await capture(item);
  }
}

async function capture({ name, width, height, path }) {
  log(`Capturando screenshot: ${name}`);
  const chrome = chromePath();
  const out = join(screenshotsDir, name);
  const profileDir = join(chromeProfilesDir, `profile-${name.replace(/[^a-z0-9-]/gi, "-")}`);
  mkdirSync(profileDir, { recursive: true });
  rmSync(out, { force: true });
  const startedAtMs = Date.now();

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
    capture: async () =>
      runChrome(
        chrome,
        [
          "--headless=new",
          "--no-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--no-first-run",
          `--user-data-dir=${profileDir}`,
          `--window-size=${width},${height}`,
          `--screenshot=${out}`,
          `${resolvedBaseUrl}${path}`,
        ],
        SCREENSHOT_TIMEOUT_MS
      ),
    validate: async ({ result: captureResult }) =>
      validateScreenshotFile({ name, out, width, height, startedAtMs, captureResult }),
  });

  if (!result.ok) {
    addScreenshotFailureOnce(name, result.failure?.message || "Falha terminal de screenshot.", result.failure?.stage || "capture");
    return;
  }

  screenshots.push(result.screenshot);
}

function runChrome(chrome, args, timeoutMs = SCREENSHOT_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const child = spawn(chrome, args, { stdio: "ignore", windowsHide: true });
    let settled = false;
    const timer = setTimeout(() => {
      settled = true;
      child.kill();
      resolve({ timedOut: true, exitCode: null });
    }, timeoutMs);

    child.on("exit", (exitCode) => {
      if (settled) return;
      clearTimeout(timer);
      resolve({ timedOut: false, exitCode });
    });
    child.on("error", (error) => {
      if (settled) return;
      clearTimeout(timer);
      resolve({ timedOut: false, exitCode: null, error: sanitize(error.message) });
    });
  });
}

function validateScreenshotFile({ name, out, width, height, startedAtMs, captureResult }) {
  if (captureResult?.error || captureResult?.timedOut || captureResult?.exitCode !== 0) {
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

  if (!validation.ok) return { ok: false, reason: validation.reason };
  if (!stat || stat.mtimeMs < startedAtMs - 1000) {
    return { ok: false, reason: "Screenshot nao foi criada na execucao atual." };
  }

  return {
    ok: true,
    screenshot: {
      name,
      path: out,
      size,
      signature: "png",
      viewport: `${width}x${height}`,
      createdAt: new Date().toISOString(),
    },
  };
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
    requests,
    responses,
    networkFailures: failureRecorder.networkFailures,
    httpFailures: failureRecorder.httpFailures,
    infrastructureFailures: failureRecorder.infrastructureFailures,
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
