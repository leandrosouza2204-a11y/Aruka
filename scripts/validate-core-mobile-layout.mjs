import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  buildPrecheckDecision,
  assertSameOrigin,
  getBrowserTargets,
  getCdpVersion,
  isBaseUrlReachable,
  isCoreMobileLayoutScript,
  RUNTIME_MARKERS,
  resolveRuntimeConfig,
} from "./lib/authenticated-runtime.js";

const ROOT = process.cwd();
const CSS_PATH = path.join(ROOT, "src", "index.css");
const PACKAGE_PATH = path.join(ROOT, "package.json");
const REPORT_DIR = path.join(ROOT, "reports", "product-audit-v2");
const MATRIX_PATH = path.join(REPORT_DIR, "cycle-02-mobile-matrix.csv");
const RESULT_PATH = path.join(REPORT_DIR, "cycle-02-result.json");
const STATIC_PASS = "PASS_STATIC_WITH_RUNTIME_LIMITATION";
const RUNTIME_PASS = "PASS_RUNTIME_READY";

const mobileViewports = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 414, height: 896 },
];

const desktopViewports = [
  { width: 1280, height: 900 },
  { width: 1440, height: 900 },
];

const routes = [
  { route: "/", label: "Dashboard" },
  { route: "/alunos", label: "Alunos" },
  { route: "/treinos", label: "Treinos" },
  { route: "/avaliacoes", label: "Avaliacoes" },
  { route: "/planos", label: "Planos" },
  { route: "/financeiro", label: "Financeiro" },
  { route: "/admin/logs", label: "Admin logs" },
  { route: "/admin/usuarios", label: "Admin usuarios" },
];

const requiredCssSnippets = [
  ".app-main.page-container",
  ".treinos-library-section",
  ".app-table-scroll",
  ".accessible-modal",
  "max-width: 100% !important",
  "overflow-x: auto !important",
];

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function main() {
  const css = await readFile(CSS_PATH, "utf8");
  const packageJson = JSON.parse(await readFile(PACKAGE_PATH, "utf8"));
  const runtimeConfig = resolveRuntimeConfig(process.env, {
    legacyBaseUrlAliases: ["CORE_MOBILE_LAYOUT_BASE_URL", "QA_BASE_URL"],
  });
  const baseUrl = runtimeConfig.baseUrl;
  const runtimeAvailable = Boolean(baseUrl);
  const runtimePrecheck = runtimeAvailable ? await runRuntimePrecheck(runtimeConfig) : null;
  const runtimeReady = runtimePrecheck?.runtime_precheck === "PASS";
  const missingSnippets = requiredCssSnippets.filter((snippet) => !css.includes(snippet));
  const hasPackageScript = isCoreMobileLayoutScript(packageJson.scripts?.["qa:core-mobile-layout"]);

  const rows = [];
  for (const viewport of [...mobileViewports, ...desktopViewports]) {
    for (const page of routes) {
      rows.push({
        cycle: "02",
        finding: "F-003",
        route: page.route,
        page: page.label,
        viewport: `${viewport.width}x${viewport.height}`,
        runtime_available: runtimeAvailable,
        document_overflow: runtimeAvailable ? "not_measured_static_guard_only" : "not_measured",
        allowed_internal_scroll: "tables_and_nav_only",
        status: missingSnippets.length || !hasPackageScript ? "fail" : runtimeReady ? "pass_runtime_ready" : "pass_static",
        notes: runtimeAvailable
          ? runtimePrecheck?.runtime_precheck === "PASS"
            ? `Runtime precheck passed for ${baseUrl}; DOM measurement is ready for browser execution.`
            : `Runtime requested for ${baseUrl}, but precheck blocked: ${(runtimePrecheck?.environment_blockers || []).join("|")}.`
          : "AUTHENTICATED_RUNTIME_QA_ENVIRONMENT_BLOCKED: set ARUKA_QA_BASE_URL with an authenticated local/staging session to measure DOM overflow.",
      });
    }
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");

  const result = {
    cycle: "ARUKA_FUNCTIONAL_IMPROVEMENT_CYCLE_02",
    targetFinding: "F-003",
    scope: "MOBILE_CORE_LAYOUT_VALIDATION_AND_FIXES",
    status: missingSnippets.length || !hasPackageScript ? "FAIL" : runtimeReady ? RUNTIME_PASS : STATIC_PASS,
    runtime: runtimeAvailable
      ? {
          available: runtimePrecheck?.runtime_precheck === "PASS",
          baseUrl,
          precheck: runtimePrecheck,
          note: "Authenticated runtime precheck passed; DOM overflow measurement can use the current browser session.",
        }
      : {
          available: false,
          limitation: "AUTHENTICATED_RUNTIME_QA_ENVIRONMENT_BLOCKED",
          note: "No ARUKA_QA_BASE_URL or legacy core mobile base URL was provided for authenticated route measurement.",
        },
    viewports: {
      mobile: mobileViewports.map(({ width, height }) => `${width}x${height}`),
      desktop: desktopViewports.map(({ width, height }) => `${width}x${height}`),
    },
    routes: routes.map((route) => route.route),
    checks: {
      cssGuardsPresent: missingSnippets.length === 0,
      packageScriptPresent: hasPackageScript,
      missingSnippets,
    },
    generatedArtifacts: {
      matrix: path.relative(ROOT, MATRIX_PATH).replaceAll("\\", "/"),
      result: path.relative(ROOT, RESULT_PATH).replaceAll("\\", "/"),
    },
  };

  if (!(await fileExists(REPORT_DIR))) {
    throw new Error(`Report directory does not exist: ${REPORT_DIR}`);
  }

  await writeFile(MATRIX_PATH, `${csv}\n`);
  await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`);

  if (missingSnippets.length || !hasPackageScript) {
    console.error("[core-mobile-layout] failed", result.checks);
    process.exitCode = 1;
    return;
  }

  console.log(`[core-mobile-layout] ${runtimeReady ? RUNTIME_PASS : STATIC_PASS}`);
  console.log(`Matrix: ${result.generatedArtifacts.matrix}`);
  if (!runtimeAvailable) {
    console.log(result.runtime.limitation);
  } else if (runtimePrecheck?.runtime_precheck !== "PASS") {
    console.log(`RUNTIME_PRECHECK=BLOCKED`);
    console.log(`RUNTIME_BLOCKERS=${runtimePrecheck.environment_blockers.join("|")}`);
  }
}

async function runRuntimePrecheck(config) {
  const state = {
    base_url_reachable: false,
    cdp_reachable: false,
    browser_target_found: false,
    authenticated_browser_origin_match: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
    environment_blockers: [],
  };

  const base = await isBaseUrlReachable(config.baseUrl);
  state.base_url_reachable = base.ok;
  if (!base.ok) state.environment_blockers.push(base.marker);

  const cdp = await getCdpVersion(config.cdpUrl);
  state.cdp_reachable = cdp.ok;
  if (!cdp.ok) state.environment_blockers.push(cdp.marker);

  const targets = cdp.ok ? await getBrowserTargets(config.cdpUrl) : { ok: false, targets: [] };
  state.browser_target_found = targets.ok;
  if (cdp.ok && !targets.ok) state.environment_blockers.push(targets.marker);

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
  if (authenticatedTarget && !originMatch.ok) {
    state.environment_blockers.push(RUNTIME_MARKERS.authenticatedBrowserOriginMismatch);
  }
  state.auth_session_present = Boolean(matchingTarget);
  state.authenticated_route_reachable = Boolean(matchingTarget);

  const decision = buildPrecheckDecision(state);
  if (decision.decision === "BLOCKED" && !state.environment_blockers.includes(decision.marker)) {
    state.environment_blockers.push(decision.marker);
  }

  return {
    ...state,
    runtime_precheck: decision.decision,
    environment_blockers: [...new Set(state.environment_blockers.filter(Boolean))],
  };
}

main().catch((error) => {
  console.error("[core-mobile-layout] unexpected failure");
  console.error(error);
  process.exit(1);
});
