import { existsSync, readFileSync } from "node:fs";

const DEFAULT_ENV_FILE = ".env.qa.local";

export class QaEnvironmentError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "QaEnvironmentError";
    this.code = code;
    this.details = details;
  }
}

export function loadQaEnvFile(path = DEFAULT_ENV_FILE, target = process.env) {
  if (!existsSync(path)) {
    return { loaded: false, path, variables: [] };
  }

  const variables = [];
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || line.trimStart().startsWith("#")) continue;

    const [, name, rawValue] = match;
    if (target[name] === undefined) {
      target[name] = unquoteEnvValue(rawValue);
    }
    variables.push(name);
  }

  return { loaded: true, path, variables };
}

export function validateQaEnvironment(env = process.env, options = {}) {
  const declaredEnvironment = String(env.QA_ENVIRONMENT || "").trim();
  const baseUrl = String(env.QA_BASE_URL || "").trim();
  const expectedSupabaseHost = normalizeHost(env.QA_EXPECTED_SUPABASE_HOST || "127.0.0.1");
  const expectedSupabasePort = String(env.QA_EXPECTED_SUPABASE_PORT || "").trim();
  const expectedProjectRef = String(env.QA_EXPECTED_SUPABASE_PROJECT_REF || "").trim();
  const forbiddenHost = String(env.QA_FORBIDDEN_PRODUCTION_HOST || "").trim();
  const forbiddenProjectRef = String(env.QA_FORBIDDEN_PRODUCTION_PROJECT_REF || "").trim();

  if (!declaredEnvironment) {
    throw new QaEnvironmentError(
      "QA_ENVIRONMENT_MISSING",
      "QA bloqueado: QA_ENVIRONMENT ausente.",
      { variable: "QA_ENVIRONMENT", declaredEnvironment: declaredEnvironment || "missing" }
    );
  }

  if (declaredEnvironment === "local_qa") {
    return validateLocalQa({
      declaredEnvironment,
      baseUrl,
      expectedSupabaseHost,
      expectedSupabasePort,
      forbiddenHost,
      forbiddenProjectRef,
      options,
    });
  }

  if (declaredEnvironment !== "staging") {
    throw new QaEnvironmentError(
      "QA_ENVIRONMENT_UNKNOWN",
      "QA bloqueado: QA_ENVIRONMENT desconhecido.",
      { variable: "QA_ENVIRONMENT", declaredEnvironment }
    );
  }

  if (!baseUrl) {
    throw new QaEnvironmentError(
      "QA_BASE_URL_MISSING",
      "QA bloqueado: QA_BASE_URL ausente ou vazio.",
      { variable: "QA_BASE_URL", declaredEnvironment }
    );
  }

  const parsedBaseUrl = parseUrlOrFail(baseUrl, "QA_BASE_URL");
  const baseHost = parsedBaseUrl.hostname.toLowerCase();
  const normalizedForbiddenHost = normalizeHost(forbiddenHost);

  if (normalizedForbiddenHost && baseHost === normalizedForbiddenHost) {
    throw new QaEnvironmentError(
      "PRODUCTION_HOST_BLOCKED",
      "QA bloqueado: QA_BASE_URL corresponde ao host de producao proibido.",
      { variable: "QA_BASE_URL", host: baseHost, declaredEnvironment }
    );
  }

  if (!expectedProjectRef) {
    throw new QaEnvironmentError(
      "EXPECTED_STAGING_PROJECT_REF_MISSING",
      "QA bloqueado: QA_EXPECTED_SUPABASE_PROJECT_REF deve identificar staging.",
      { variable: "QA_EXPECTED_SUPABASE_PROJECT_REF", declaredEnvironment, host: baseHost }
    );
  }

  if (forbiddenProjectRef && expectedProjectRef === forbiddenProjectRef) {
    throw new QaEnvironmentError(
      "STAGING_REF_MATCHES_PRODUCTION_REF",
      "QA bloqueado: project ref esperado de staging coincide com o project ref proibido de producao.",
      { variable: "QA_EXPECTED_SUPABASE_PROJECT_REF", declaredEnvironment, host: baseHost }
    );
  }

  if (options.finalUrl) {
    const finalUrl = parseUrlOrFail(options.finalUrl, "finalUrl");
    const finalHost = finalUrl.hostname.toLowerCase();
    if (normalizedForbiddenHost && finalHost === normalizedForbiddenHost) {
      throw new QaEnvironmentError(
        "PRODUCTION_REDIRECT_BLOCKED",
        "QA bloqueado: redirecionamento final aponta para host de producao proibido.",
        { variable: "QA_BASE_URL", host: finalHost, declaredEnvironment }
      );
    }
  }

  if (options.detectedSupabaseUrl) {
    const detectedProjectRef = extractSupabaseProjectRef(options.detectedSupabaseUrl);
    if (!detectedProjectRef) {
      throw new QaEnvironmentError(
        "SUPABASE_PROJECT_REF_UNKNOWN",
        "QA bloqueado: nao foi possivel confirmar o project ref do Supabase detectado.",
        { variable: "detectedSupabaseUrl", declaredEnvironment, host: baseHost }
      );
    }

    if (forbiddenProjectRef && detectedProjectRef === forbiddenProjectRef) {
      throw new QaEnvironmentError(
        "PRODUCTION_PROJECT_REF_BLOCKED",
        "QA bloqueado: Supabase detectado corresponde ao project ref proibido de producao.",
        { variable: "detectedSupabaseUrl", declaredEnvironment, host: baseHost }
      );
    }

    if (detectedProjectRef !== expectedProjectRef) {
      throw new QaEnvironmentError(
        "SUPABASE_PROJECT_REF_MISMATCH",
        "QA bloqueado: Supabase detectado nao corresponde ao project ref esperado de staging.",
        { variable: "detectedSupabaseUrl", declaredEnvironment, host: baseHost }
      );
    }
  }

  return {
    declaredEnvironment,
    baseUrl: parsedBaseUrl.toString().replace(/\/$/, ""),
    host: baseHost,
    expectedProjectRef,
    forbiddenProductionHost: normalizedForbiddenHost || "",
    forbiddenProductionProjectRef: forbiddenProjectRef || "",
  };
}

function validateLocalQa({
  declaredEnvironment,
  baseUrl,
  expectedSupabaseHost,
  expectedSupabasePort,
  forbiddenHost,
  forbiddenProjectRef,
  options,
}) {
  if (!baseUrl) {
    throw new QaEnvironmentError("QA_BASE_URL_MISSING", "QA bloqueado: QA_BASE_URL ausente ou vazio.", {
      variable: "QA_BASE_URL",
      declaredEnvironment,
    });
  }

  const parsedBaseUrl = parseUrlOrFail(baseUrl, "QA_BASE_URL");
  const baseHost = normalizeHost(parsedBaseUrl.hostname);
  const normalizedForbiddenHost = normalizeHost(forbiddenHost);

  assertLocalHost(baseHost, "QA_BASE_URL", declaredEnvironment);
  if (normalizedForbiddenHost && baseHost === normalizedForbiddenHost) {
    throw new QaEnvironmentError("PRODUCTION_HOST_BLOCKED", "QA bloqueado: QA_BASE_URL corresponde ao host de producao proibido.", {
      variable: "QA_BASE_URL",
      host: baseHost,
      declaredEnvironment,
    });
  }

  if (options.finalUrl) {
    const finalUrl = parseUrlOrFail(options.finalUrl, "finalUrl");
    const finalHost = normalizeHost(finalUrl.hostname);
    assertLocalHost(finalHost, "finalUrl", declaredEnvironment, "PUBLIC_REDIRECT_BLOCKED");
    if (normalizedForbiddenHost && finalHost === normalizedForbiddenHost) {
      throw new QaEnvironmentError("PRODUCTION_REDIRECT_BLOCKED", "QA bloqueado: redirecionamento final aponta para host de producao proibido.", {
        variable: "QA_BASE_URL",
        host: finalHost,
        declaredEnvironment,
      });
    }
  }

  const detectedSupabaseUrl = options.detectedSupabaseUrl || process.env.VITE_SUPABASE_URL || "";
  if (detectedSupabaseUrl) {
    const supabaseUrl = parseUrlOrFail(detectedSupabaseUrl, "detectedSupabaseUrl");
    const supabaseHost = normalizeHost(supabaseUrl.hostname);
    if (supabaseHost.endsWith(".supabase.co") || supabaseHost === "supabase.co") {
      throw new QaEnvironmentError("SUPABASE_CLOUD_BLOCKED", "QA bloqueado: LOCAL_QA nao pode usar Supabase Cloud.", {
        variable: "detectedSupabaseUrl",
        host: supabaseHost,
        declaredEnvironment,
      });
    }
    assertLocalHost(supabaseHost, "detectedSupabaseUrl", declaredEnvironment, "REMOTE_SUPABASE_BLOCKED");
    if (expectedSupabaseHost && supabaseHost !== expectedSupabaseHost && !(expectedSupabaseHost === "127.0.0.1" && supabaseHost === "localhost")) {
      throw new QaEnvironmentError("SUPABASE_LOCAL_HOST_MISMATCH", "QA bloqueado: host do Supabase local difere do esperado.", {
        variable: "detectedSupabaseUrl",
        host: supabaseHost,
        declaredEnvironment,
      });
    }
    if (expectedSupabasePort && supabaseUrl.port !== expectedSupabasePort) {
      throw new QaEnvironmentError("SUPABASE_LOCAL_PORT_MISMATCH", "QA bloqueado: porta do Supabase local difere da esperada.", {
        variable: "detectedSupabaseUrl",
        host: supabaseHost,
        declaredEnvironment,
      });
    }
  }

  if (forbiddenProjectRef && detectedSupabaseUrl.includes(forbiddenProjectRef)) {
    throw new QaEnvironmentError("PRODUCTION_PROJECT_REF_BLOCKED", "QA bloqueado: Supabase detectado corresponde ao project ref proibido de producao.", {
      variable: "detectedSupabaseUrl",
      declaredEnvironment,
      host: baseHost,
    });
  }

  return {
    declaredEnvironment,
    baseUrl: parsedBaseUrl.toString().replace(/\/$/, ""),
    host: baseHost,
    expectedSupabaseHost,
    expectedSupabasePort,
    forbiddenProductionHost: normalizedForbiddenHost || "",
    forbiddenProductionProjectRef: forbiddenProjectRef || "",
  };
}

function assertLocalHost(host, variable, declaredEnvironment, code = "PUBLIC_HOST_BLOCKED") {
  if (["localhost", "127.0.0.1", "::1", "[::1]"].includes(host)) return;
  throw new QaEnvironmentError(code, "QA bloqueado: LOCAL_QA aceita somente localhost ou 127.0.0.1.", {
    variable,
    host,
    declaredEnvironment,
  });
}

export function buildQaUrl(pathname, env = process.env) {
  const validation = validateQaEnvironment(env);
  const url = new URL(validation.baseUrl);
  url.pathname = joinUrlPath(url.pathname, pathname);
  return url.toString();
}

export function extractSupabaseProjectRef(value) {
  try {
    const url = new URL(String(value));
    const host = url.hostname.toLowerCase();
    const suffix = ".supabase.co";
    if (!host.endsWith(suffix)) return "";
    return host.slice(0, -suffix.length);
  } catch {
    return "";
  }
}

export function maskIdentifier(value) {
  const text = String(value || "");
  if (text.length <= 8) return text ? "***" : "";
  return `${text.slice(0, 4)}...${text.slice(-4)}`;
}

function parseUrlOrFail(value, variable) {
  try {
    return new URL(value);
  } catch {
    throw new QaEnvironmentError(
      "INVALID_URL",
      `QA bloqueado: ${variable} nao e uma URL valida.`,
      { variable }
    );
  }
}

function normalizeHost(value) {
  if (!value) return "";
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return String(value).trim().toLowerCase();
  }
}

function joinUrlPath(basePath, pathname) {
  const cleanBase = String(basePath || "").replace(/\/+$/, "");
  const cleanPath = String(pathname || "").replace(/^\/+/, "");
  return `/${[cleanBase.replace(/^\/+/, ""), cleanPath].filter(Boolean).join("/")}`;
}

function unquoteEnvValue(value) {
  const trimmed = String(value || "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
