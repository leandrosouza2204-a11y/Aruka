export const DEFAULT_CDP_URL = "http://127.0.0.1:9222";

export const RUNTIME_MARKERS = {
  baseUrlUnavailable: "BASE_URL_UNAVAILABLE",
  cdpUnavailable: "CDP_UNAVAILABLE",
  cdpTargetNotFound: "CDP_TARGET_NOT_FOUND",
  authSessionRequired: "AUTH_SESSION_REQUIRED",
  authRouteFailure: "AUTH_ROUTE_FAILURE",
  functionalRuntimeFailure: "FUNCTIONAL_RUNTIME_FAILURE",
  runtimeEnvironmentBlocked: "RUNTIME_ENVIRONMENT_BLOCKED",
};

export function resolveRuntimeConfig(env = process.env) {
  const baseUrl = String(
    env.ARUKA_QA_BASE_URL ||
      env.CORE_MOBILE_LAYOUT_BASE_URL ||
      env.QA_BASE_URL ||
      ""
  ).trim().replace(/\/$/, "");
  const cdpUrl = String(env.ARUKA_QA_CDP_URL || env.CDP_URL || DEFAULT_CDP_URL).trim().replace(/\/$/, "");
  const route = String(env.ARUKA_QA_AUTH_ROUTE || "/dashboard").trim() || "/dashboard";

  return { baseUrl, cdpUrl, route };
}

export async function safeFetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return { ok: false, status: response.status, marker: RUNTIME_MARKERS.runtimeEnvironmentBlocked };
    }
    return { ok: true, data: await response.json() };
  } catch (error) {
    return { ok: false, marker: classifyFetchError(error), error: sanitizeError(error) };
  }
}

export async function isBaseUrlReachable(baseUrl) {
  if (!baseUrl) return { ok: false, marker: RUNTIME_MARKERS.baseUrlUnavailable };

  try {
    const response = await fetch(baseUrl, { redirect: "manual" });
    return { ok: response.status > 0 && response.status < 500, status: response.status };
  } catch (error) {
    return { ok: false, marker: RUNTIME_MARKERS.baseUrlUnavailable, error: sanitizeError(error) };
  }
}

export async function getCdpVersion(cdpUrl) {
  const result = await safeFetchJson(`${cdpUrl}/json/version`);
  if (!result.ok) return { ok: false, marker: RUNTIME_MARKERS.cdpUnavailable, error: result.error };
  if (!result.data?.webSocketDebuggerUrl) {
    return { ok: false, marker: RUNTIME_MARKERS.cdpTargetNotFound };
  }
  return { ok: true, data: result.data };
}

export async function getBrowserTargets(cdpUrl) {
  const result = await safeFetchJson(`${cdpUrl}/json/list`);
  if (!result.ok) return { ok: false, marker: RUNTIME_MARKERS.cdpUnavailable, error: result.error };
  const targets = Array.isArray(result.data) ? result.data : [];
  return { ok: targets.length > 0, targets, marker: targets.length ? undefined : RUNTIME_MARKERS.cdpTargetNotFound };
}

export function classifyFetchError(error) {
  const message = String(error?.message || error || "").toLowerCase();
  if (message.includes("fetch failed") || message.includes("econnrefused") || message.includes("failed to fetch")) {
    return RUNTIME_MARKERS.runtimeEnvironmentBlocked;
  }
  return RUNTIME_MARKERS.runtimeEnvironmentBlocked;
}

export function classifyRuntimeError(error) {
  const message = String(error?.message || error || "");
  if (/base_url|base url/i.test(message)) return RUNTIME_MARKERS.baseUrlUnavailable;
  if (/ECONNREFUSED|fetch failed/i.test(message)) return RUNTIME_MARKERS.runtimeEnvironmentBlocked;
  if (/CDP|remote-debugging|webSocketDebuggerUrl|9222|target/i.test(message)) return RUNTIME_MARKERS.cdpUnavailable;
  if (/login|sess[aã]o|auth|credenciais|autentic/i.test(message)) return RUNTIME_MARKERS.authSessionRequired;
  if (/route|rota|navigate|navigation/i.test(message)) return RUNTIME_MARKERS.authRouteFailure;
  return RUNTIME_MARKERS.functionalRuntimeFailure;
}

export function sanitizeError(error) {
  return String(error?.message || error || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/access_token[=:][^&\s]+/gi, "access_token=[redacted]")
    .replace(/refresh_token[=:][^&\s]+/gi, "refresh_token=[redacted]")
    .slice(0, 240);
}

export function buildPrecheckDecision(state) {
  if (!state.base_url_reachable) return { decision: "BLOCKED", marker: RUNTIME_MARKERS.baseUrlUnavailable };
  if (!state.cdp_reachable) return { decision: "BLOCKED", marker: RUNTIME_MARKERS.cdpUnavailable };
  if (!state.browser_target_found) return { decision: "BLOCKED", marker: RUNTIME_MARKERS.cdpTargetNotFound };
  if (!state.auth_session_present) return { decision: "BLOCKED", marker: RUNTIME_MARKERS.authSessionRequired };
  if (!state.authenticated_route_reachable) return { decision: "BLOCKED", marker: RUNTIME_MARKERS.authRouteFailure };
  return { decision: "PASS", marker: "RUNTIME_PRECHECK_PASS" };
}
