import assert from "node:assert/strict";
import test from "node:test";
import {
  RUNTIME_MARKERS,
  assertSameOrigin,
  buildPrecheckDecision,
  classifyRuntimeError,
  isCoreMobileLayoutScript,
  resolveQaBaseUrl,
  resolveRuntimeConfig,
} from "../lib/authenticated-runtime.js";
import {
  buildStateResetSequence,
  buildViewportConfig,
  normalizeQaStartRoute,
} from "../lib/authenticated-browser-state.js";

test("precheck blocks offline base URL first", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: false,
    cdp_reachable: false,
    browser_target_found: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
  });

  assert.equal(result.decision, "BLOCKED");
  assert.equal(result.marker, RUNTIME_MARKERS.baseUrlUnavailable);
});

test("precheck blocks unavailable CDP after base URL", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: true,
    cdp_reachable: false,
    browser_target_found: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
  });

  assert.equal(result.marker, RUNTIME_MARKERS.cdpUnavailable);
});

test("precheck blocks missing browser target", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: true,
    cdp_reachable: true,
    browser_target_found: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
  });

  assert.equal(result.marker, RUNTIME_MARKERS.cdpTargetNotFound);
});

test("precheck blocks missing authenticated session", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: true,
    cdp_reachable: true,
    browser_target_found: true,
    auth_session_present: false,
    authenticated_route_reachable: false,
  });

  assert.equal(result.marker, RUNTIME_MARKERS.authSessionRequired);
});

test("precheck blocks authenticated browser origin mismatch", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: true,
    cdp_reachable: true,
    browser_target_found: true,
    authenticated_browser_origin_match: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
    environment_blockers: [RUNTIME_MARKERS.authenticatedBrowserOriginMismatch],
  });

  assert.equal(result.marker, RUNTIME_MARKERS.authenticatedBrowserOriginMismatch);
});

test("precheck passes valid runtime", () => {
  const result = buildPrecheckDecision({
    base_url_reachable: true,
    cdp_reachable: true,
    browser_target_found: true,
    auth_session_present: true,
    authenticated_route_reachable: true,
  });

  assert.equal(result.decision, "PASS");
});

test("config supports ARUKA aliases and legacy base URL", () => {
  assert.deepEqual(
    resolveRuntimeConfig({
      ARUKA_QA_BASE_URL: "http://127.0.0.1:5173/",
      ARUKA_QA_CDP_URL: "http://127.0.0.1:9223/",
      ARUKA_QA_AUTH_ROUTE: "/financeiro",
    }),
    {
      baseUrl: "http://127.0.0.1:5173",
      baseUrlSource: "ARUKA_QA_BASE_URL",
      cdpUrl: "http://127.0.0.1:9223",
      route: "/financeiro",
    }
  );

  assert.equal(resolveRuntimeConfig({ CORE_MOBILE_LAYOUT_BASE_URL: "http://localhost:5173" }).baseUrl, "http://localhost:5173");
});

test("ARUKA_QA_BASE_URL wins over legacy aliases", () => {
  const result = resolveQaBaseUrl({
    ARUKA_QA_BASE_URL: "http://localhost:5173",
    FINANCE_BASE_URL: "http://127.0.0.1:5173",
  }, ["FINANCE_BASE_URL"]);

  assert.equal(result.baseUrl, "http://localhost:5173");
  assert.equal(result.source, "ARUKA_QA_BASE_URL");
});

test("legacy base URL fallback works when canonical is absent", () => {
  const result = resolveQaBaseUrl({ FINANCE_BASE_URL: "http://localhost:5173/" }, ["FINANCE_BASE_URL"]);

  assert.equal(result.baseUrl, "http://localhost:5173");
  assert.equal(result.source, "FINANCE_BASE_URL");
});

test("missing base URL is explicit", () => {
  assert.deepEqual(resolveQaBaseUrl({}, ["FINANCE_BASE_URL"]), { baseUrl: "", source: "" });
});

test("browser and base origins must match exactly", () => {
  assert.equal(assertSameOrigin("http://localhost:5173", "http://localhost:5173/financeiro").ok, true);
  assert.equal(assertSameOrigin("http://localhost:5173", "http://127.0.0.1:5173/financeiro").ok, false);
  assert.equal(assertSameOrigin("http://localhost:5173", "http://localhost:5174/financeiro").ok, false);
});

test("runtime errors are classified without exposing fetch failed as final diagnosis", () => {
  assert.equal(classifyRuntimeError(new Error("fetch failed")), RUNTIME_MARKERS.runtimeEnvironmentBlocked);
  assert.equal(classifyRuntimeError(new Error("Chrome CDP indisponivel")), RUNTIME_MARKERS.cdpUnavailable);
  assert.equal(classifyRuntimeError(new Error("Sessao QA indisponivel")), RUNTIME_MARKERS.authSessionRequired);
});

test("core mobile package script accepts legacy command shape", () => {
  assert.equal(isCoreMobileLayoutScript("node scripts/validate-core-mobile-layout.mjs"), true);
});

test("core mobile package script accepts env-file command shape", () => {
  assert.equal(isCoreMobileLayoutScript("node --env-file=.env.qa.local scripts/validate-core-mobile-layout.mjs"), true);
});

test("core mobile package script rejects missing or wrong targets", () => {
  assert.equal(isCoreMobileLayoutScript(undefined), false);
  assert.equal(isCoreMobileLayoutScript("node scripts/validate-other.mjs"), false);
});

test("authenticated browser state helper normalizes start routes", () => {
  assert.equal(normalizeQaStartRoute("financeiro"), "/financeiro");
  assert.equal(normalizeQaStartRoute("/financeiro"), "/financeiro");
  assert.equal(normalizeQaStartRoute(""), "/");
});

test("authenticated browser state helper builds deterministic viewport config", () => {
  assert.deepEqual(buildViewportConfig({ width: 390, height: 844, mobile: true }), {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
});

test("authenticated browser state helper exposes reset sequence", () => {
  const sequence = buildStateResetSequence({
    url: "http://localhost:5173/financeiro",
    viewport: { width: 320, height: 900, mobile: true },
    readyExpression: "document.querySelector('.financeiro-page')",
  });

  assert.deepEqual(sequence.map((step) => step.action), [
    "setViewport",
    "navigate",
    "waitForDocumentReady",
    "waitForAppReady",
    "closeVisibleDialogs",
    "closeOpenMenus",
    "resetScroll",
  ]);
  assert.equal(sequence[0].viewport.width, 320);
  assert.equal(sequence[1].url, "http://localhost:5173/financeiro");
  assert.equal(sequence[3].expression, "document.querySelector('.financeiro-page')");
});
