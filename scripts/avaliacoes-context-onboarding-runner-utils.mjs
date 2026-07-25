export const DECISIONS = {
  READY: "READY",
  READY_WITH_LIMITATIONS: "READY_WITH_LIMITATIONS",
  FAIL_PRODUCT: "FAIL_PRODUCT",
  FAIL_TEST_INFRASTRUCTURE: "FAIL_TEST_INFRASTRUCTURE",
};

export function createFailureRecorder() {
  const buckets = {
    networkFailures: [],
    httpFailures: [],
    infrastructureFailures: [],
    authenticationFailures: [],
    screenshotFailures: [],
    runnerFailures: [],
  };

  function add(bucketName, failure) {
    const normalized = normalizeFailure(bucketName, failure);
    if (!normalized) return null;
    buckets[bucketName].push(normalized);
    return normalized;
  }

  return {
    ...buckets,
    addNetworkFailure: (failure) => add("networkFailures", failure),
    addHttpFailure: (failure) => add("httpFailures", failure),
    addInfrastructureFailure: (failure) => add("infrastructureFailures", failure),
    addAuthenticationFailure: (failure) => add("authenticationFailures", failure),
    addScreenshotFailure: (failure) => add("screenshotFailures", failure),
    addRunnerFailure: (failure) => add("runnerFailures", failure),
  };
}

export function normalizeFailure(bucketName, failure = {}) {
  if (!failure || typeof failure !== "object" || Object.keys(failure).length === 0) {
    return null;
  }

  const categoryByBucket = {
    networkFailures: "network",
    httpFailures: "http",
    infrastructureFailures: "infrastructure",
    authenticationFailures: "authentication",
    screenshotFailures: "screenshot",
    runnerFailures: "runner",
  };
  const category = failure.category || categoryByBucket[bucketName] || "unknown";
  const stage = stringOr(failure.stage, category);
  const message = stringOr(
    failure.message,
    failure.errorText,
    failure.error,
    failure.reason,
    `${category} failure`
  );

  return removeEmptyFields({
    category,
    stage,
    message: sanitize(message),
    url: failure.url ? sanitizeUrl(failure.url) : "",
    method: failure.method || "",
    status: failure.status ?? "",
    errorText: failure.errorText ? sanitize(failure.errorText) : "",
    filename: failure.filename || failure.screenshot || "",
    timestamp: failure.timestamp || new Date().toISOString(),
  });
}

export function classifyDecision({
  scenarios = [],
  networkFailures = [],
  httpFailures = [],
  infrastructureFailures = [],
  authenticationFailures = [],
  screenshotFailures = [],
  runnerFailures = [],
  limitations = [],
} = {}) {
  const hasInfrastructureFailure =
    infrastructureFailures.length > 0 ||
    authenticationFailures.length > 0 ||
    screenshotFailures.length > 0 ||
    runnerFailures.length > 0 ||
    scenarios.some((scenario) => scenario.status === DECISIONS.FAIL_TEST_INFRASTRUCTURE);

  if (hasInfrastructureFailure) {
    return { decision: DECISIONS.FAIL_TEST_INFRASTRUCTURE, exitCode: 1 };
  }

  const hasProductFailure =
    networkFailures.length > 0 ||
    httpFailures.length > 0 ||
    scenarios.some((scenario) => scenario.status === DECISIONS.FAIL_PRODUCT);

  if (hasProductFailure) {
    return { decision: DECISIONS.FAIL_PRODUCT, exitCode: 1 };
  }

  if (limitations.length > 0) {
    return { decision: DECISIONS.READY_WITH_LIMITATIONS, exitCode: 0 };
  }

  return { decision: DECISIONS.READY, exitCode: 0 };
}

export function recordScenario(scenarios, name, ok, failStatus = DECISIONS.FAIL_PRODUCT, note = "", stage = "") {
  const scenario = {
    name,
    status: ok ? "PASS" : failStatus,
    note: sanitize(note),
    stage: sanitize(stage),
  };
  scenarios.push(removeEmptyFields(scenario));
  return scenario;
}

export function createResolutionAttempt({ url, status = null, result, attempts = 1, message = "", selected = false }) {
  return removeEmptyFields({
    url: sanitizeUrl(url),
    status,
    result,
    attempts,
    message: sanitize(message),
    selected,
    timestamp: new Date().toISOString(),
  });
}

export function isPngSignature(buffer) {
  if (!buffer || buffer.length < 8) return false;
  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

export function validateScreenshotMetadata({ name, path, size, signatureValid, minBytes = 512 }) {
  if (!path) {
    return { ok: false, reason: "Arquivo de screenshot nao foi criado.", filename: name };
  }
  if (!size || size <= 0) {
    return { ok: false, reason: "Arquivo de screenshot vazio.", filename: name };
  }
  if (size < minBytes) {
    return { ok: false, reason: `Arquivo menor que o minimo esperado (${size} bytes).`, filename: name };
  }
  if (!signatureValid) {
    return { ok: false, reason: "Assinatura PNG invalida.", filename: name };
  }
  return { ok: true };
}

export async function captureScreenshotWithRetry({
  filename,
  capture,
  validate,
  removeInvalidFile = async () => {},
  maxAttempts = 2,
  retryDelayMs = 1500,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  now = () => new Date(),
  onAttempt = () => {},
  isRecoverable = () => true,
} = {}) {
  const attempts = [];
  const totalAttempts = Math.max(1, Number(maxAttempts) || 1);

  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
    const startedAt = now();
    let result = {};
    let validation = { ok: false, reason: "Captura nao retornou resultado." };

    try {
      result = await capture({ attempt, maxAttempts: totalAttempts, filename });
      validation = await validate({ attempt, maxAttempts: totalAttempts, filename, result });
    } catch (error) {
      validation = {
        ok: false,
        reason: sanitize(error.message || "Erro inesperado ao capturar screenshot."),
        terminal: false,
      };
    }

    const durationMs = Math.max(0, now() - startedAt);

    if (validation.ok) {
      const entry = {
        filename,
        attempt,
        maxAttempts: totalAttempts,
        status: "PASS",
        message: attempt > 1 ? "Screenshot capturada apos retry." : "Screenshot capturada.",
        timestamp: now().toISOString(),
        durationMs,
        recovered: attempt > 1,
        terminal: false,
        ...(validation.attemptMetadata || {}),
      };
      attempts.push(entry);
      onAttempt(entry);
      return {
        ok: true,
        attempts,
        recovered: attempt > 1,
        screenshot: validation.screenshot || result.screenshot || result,
      };
    }

    const terminal = attempt >= totalAttempts || validation.terminal === true || !isRecoverable(validation);
    const entry = {
      filename,
      attempt,
      maxAttempts: totalAttempts,
      status: terminal ? DECISIONS.FAIL_TEST_INFRASTRUCTURE : "RETRY",
      message: sanitize(validation.reason || validation.message || "Falha ao capturar screenshot."),
      timestamp: now().toISOString(),
      durationMs,
      recovered: false,
      terminal,
      ...(validation.attemptMetadata || {}),
    };
    attempts.push(entry);
    onAttempt(entry);
    await removeInvalidFile({ filename, attempt, terminal, validation });

    if (terminal) {
      return {
        ok: false,
        attempts,
        failure: {
          stage: "captureScreenshotWithRetry",
          filename,
          message: entry.message,
        },
      };
    }

    await sleep(retryDelayMs);
  }

  return {
    ok: false,
    attempts,
    failure: {
      stage: "captureScreenshotWithRetry",
      filename,
      message: "Falha ao capturar screenshot.",
    },
  };
}

export function countRecoveredScreenshotRetries(screenshotAttempts = []) {
  return screenshotAttempts.filter((attempt) => attempt.status === "PASS" && attempt.recovered).length;
}

export function getScenarioCounts(scenarios = []) {
  return scenarios.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { PASS: 0, FAIL_PRODUCT: 0, FAIL_TEST_INFRASTRUCTURE: 0 }
  );
}

export function getEvidenceCounts({
  scenarios = [],
  networkFailures = [],
  httpFailures = [],
  infrastructureFailures = [],
  screenshotFailures = [],
  runnerFailures = [],
  authenticationFailures = [],
  screenshotAttempts = [],
  limitations = [],
} = {}) {
  const scenarioCounts = getScenarioCounts(scenarios);

  return {
    scenariosPass: scenarioCounts.PASS,
    scenariosFailProduct: scenarioCounts.FAIL_PRODUCT,
    scenariosFailTestInfrastructure: scenarioCounts.FAIL_TEST_INFRASTRUCTURE,
    productFailures: scenarioCounts.FAIL_PRODUCT,
    networkFailures: networkFailures.length,
    httpFailures: httpFailures.length,
    infrastructureFailures: infrastructureFailures.length,
    screenshotFailures: screenshotFailures.length,
    runnerFailures: runnerFailures.length,
    authenticationFailures: authenticationFailures.length,
    testInfrastructureFailuresTotal:
      infrastructureFailures.length + authenticationFailures.length + screenshotFailures.length + runnerFailures.length,
    recoveredScreenshotRetries: countRecoveredScreenshotRetries(screenshotAttempts),
    limitations: limitations.length,
  };
}

export function evaluateScreenshotReadiness({
  state = {},
  expectedPath = "/avaliacoes",
  scenarioChecks = [],
  productFailureSelectors = [],
} = {}) {
  const failures = [];
  const pathname = String(state.pathname || "");
  const expected = String(expectedPath || "/avaliacoes");

  if (state.hasFatalRenderError) {
    failures.push({ code: "fatal-render-error", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: "Erro fatal de renderizacao detectado." });
  }
  if (state.hasLogin || pathname.includes("/login")) {
    failures.push({ code: "unexpected-login", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: "Pagina permaneceu em /login ou formulario de login visivel." });
  }
  if (state.hasLoading) {
    failures.push({ code: "persistent-loading", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: "Estado de loading persistente antes da captura." });
  }
  if (expected && pathname !== expected) {
    failures.push({ code: "wrong-route", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: `Rota esperada ${expected}, rota atual ${pathname || "desconhecida"}.` });
  }
  if (!state.hasAvaliacoesPage) {
    failures.push({ code: "missing-page-marker", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: "Marcador estavel da pagina Avaliacoes ausente." });
  }
  if (state.authenticated !== true) {
    failures.push({ code: "unauthenticated", classification: DECISIONS.FAIL_TEST_INFRASTRUCTURE, message: "Sessao autenticada nao confirmada." });
  }

  for (const check of scenarioChecks) {
    if (!check?.ok) {
      failures.push({
        code: check.code || "scenario-state-missing",
        classification: check.classification || DECISIONS.FAIL_TEST_INFRASTRUCTURE,
        message: check.message || "Estado funcional especifico do cenario ausente.",
        selector: check.selector || "",
      });
    }
  }

  for (const check of productFailureSelectors) {
    if (check?.ok === false) {
      failures.push({
        code: check.code || "product-state-missing",
        classification: DECISIONS.FAIL_PRODUCT,
        message: check.message || "Estado esperado nao apareceu por comportamento do produto.",
        selector: check.selector || "",
      });
    }
  }

  const firstFailure = failures[0] || null;
  return {
    ok: failures.length === 0,
    classification: firstFailure?.classification || "PASS",
    reason: firstFailure?.message || "Pagina pronta e semanticamente validada.",
    failures,
  };
}

export function createScreenshotEvidenceAttempt({
  filename,
  attempt,
  maxAttempts,
  stage,
  status,
  message,
  urlBeforeCapture = "",
  urlAfterPreparation = "",
  authenticationState = {},
  readinessSelector = "",
  semanticValidated = false,
  recovered = false,
  terminal = false,
  durationMs = 0,
} = {}) {
  return removeEmptyFields({
    filename,
    attempt,
    maxAttempts,
    stage,
    status,
    message: sanitize(message),
    urlBeforeCapture: urlBeforeCapture ? sanitizeUrl(urlBeforeCapture) : "",
    urlAfterPreparation: urlAfterPreparation ? sanitizeUrl(urlAfterPreparation) : "",
    authenticationState,
    readinessSelector,
    semanticValidated,
    recovered,
    terminal,
    durationMs,
    timestamp: new Date().toISOString(),
  });
}

export function buildAuditRaw(data) {
  const raw = {
    ...data,
    generatedAt: new Date().toISOString(),
  };
  JSON.parse(JSON.stringify(raw));
  return raw;
}

export function sanitize(value) {
  return String(value || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/(authorization|apikey|cookie|token)=([^&\s]+)/gi, "$1=[redacted]")
    .slice(0, 1000);
}

export function sanitizeUrl(value) {
  try {
    const url = new URL(String(value));
    url.searchParams.delete("apikey");
    url.searchParams.delete("token");
    return url.toString().replace(/\/$/, "");
  } catch {
    return sanitize(value);
  }
}

function stringOr(...values) {
  return values.find((value) => String(value || "").trim()) || "";
}

function removeEmptyFields(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== "" && value !== null && value !== undefined)
  );
}
