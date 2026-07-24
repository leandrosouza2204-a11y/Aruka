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
  screenshotFailures = [],
  runnerFailures = [],
  limitations = [],
} = {}) {
  const hasInfrastructureFailure =
    infrastructureFailures.length > 0 ||
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
