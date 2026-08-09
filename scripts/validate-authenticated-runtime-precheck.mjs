import { writeFile } from "node:fs/promises";
import {
  buildPrecheckDecision,
  assertSameOrigin,
  getBrowserTargets,
  getCdpVersion,
  isBaseUrlReachable,
  RUNTIME_MARKERS,
  resolveRuntimeConfig,
} from "./lib/authenticated-runtime.js";

const RESULT_PATH = "reports/product-roadmap-v3/cycle-01-runtime-qa-result.json";

async function main() {
  const config = resolveRuntimeConfig();
  const blockers = [];
  const state = {
    base_url: config.baseUrl || "",
    cdp_url: config.cdpUrl,
    auth_route: config.route,
    base_url_reachable: false,
    cdp_reachable: false,
    browser_target_found: false,
    authenticated_browser_origin_match: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
    environment_blockers: blockers,
  };

  const base = await isBaseUrlReachable(config.baseUrl);
  state.base_url_reachable = base.ok;
  if (!base.ok) blockers.push(base.marker);

  const cdp = await getCdpVersion(config.cdpUrl);
  state.cdp_reachable = cdp.ok;
  if (!cdp.ok) blockers.push(cdp.marker);

  const targets = cdp.ok ? await getBrowserTargets(config.cdpUrl) : { ok: false, targets: [] };
  state.browser_target_found = targets.ok;
  if (cdp.ok && !targets.ok) blockers.push(targets.marker);

  const authenticatedTarget = targets.targets?.find((target) => {
    const url = String(target.url || "");
    return /^https?:\/\//i.test(url) && !url.includes("/login") && !url.startsWith("devtools://");
  });
  const matchingTarget = targets.targets?.find((target) => {
    const url = String(target.url || "");
    return config.baseUrl && url.startsWith(config.baseUrl) && !url.includes("/login");
  });
  const originMatch = authenticatedTarget ? assertSameOrigin(config.baseUrl, authenticatedTarget.url) : null;
  state.authenticated_browser_origin_match = Boolean(originMatch?.ok);
  if (authenticatedTarget && !originMatch.ok) blockers.push(RUNTIME_MARKERS.authenticatedBrowserOriginMismatch);
  state.auth_session_present = Boolean(matchingTarget);
  state.authenticated_route_reachable = Boolean(matchingTarget);

  const precheck = buildPrecheckDecision(state);
  if (precheck.decision === "BLOCKED" && !blockers.includes(precheck.marker)) blockers.push(precheck.marker);

  const result = {
    decision:
      precheck.decision === "PASS"
        ? "READY_FOR_AUTHENTICATED_RUNTIME_QA"
        : "AWAITING_AUTHENTICATED_RUNTIME_EXECUTION",
    ...state,
    runtime_precheck: precheck.decision,
    environment_blockers: [...new Set(blockers.filter(Boolean))],
    next_action:
      precheck.decision === "PASS"
        ? "RUN_AUTHENTICATED_RUNTIME_QA_SUITE"
        : "START_APP_OPEN_LOCALHOST_CDP_CHROME_AND_AUTHENTICATE_MANUALLY",
  };

  printMarker("RUNTIME_BASE_URL_REACHABLE", state.base_url_reachable);
  printMarker("CDP_REACHABLE", state.cdp_reachable);
  printMarker("BROWSER_TARGET_FOUND", state.browser_target_found);
  if (config.baseUrl) console.log(`RUNTIME_BASE_ORIGIN=${new URL(config.baseUrl).origin}`);
  console.log(`CDP_ORIGIN=${new URL(config.cdpUrl).origin}`);
  printMarker("AUTHENTICATED_BROWSER_ORIGIN_MATCH", state.authenticated_browser_origin_match);
  printMarker("AUTH_SESSION_PRESENT", state.auth_session_present);
  printMarker("AUTHENTICATED_ROUTE_REACHABLE", state.authenticated_route_reachable);
  console.log(`RUNTIME_PRECHECK=${precheck.decision}`);
  if (result.environment_blockers.length) console.log(`RUNTIME_BLOCKERS=${result.environment_blockers.join("|")}`);

  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`);
  if (precheck.decision !== "PASS") process.exitCode = 2;
}

function printMarker(name, value) {
  console.log(`${name}=${value ? "YES" : "NO"}`);
}

main().catch((error) => {
  console.error(`RUNTIME_PRECHECK=BLOCKED`);
  console.error(String(error?.message || error));
  process.exit(2);
});
