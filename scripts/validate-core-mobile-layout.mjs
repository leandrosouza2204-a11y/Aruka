import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const CSS_PATH = path.join(ROOT, "src", "index.css");
const PACKAGE_PATH = path.join(ROOT, "package.json");
const REPORT_DIR = path.join(ROOT, "reports", "product-audit-v2");
const MATRIX_PATH = path.join(REPORT_DIR, "cycle-02-mobile-matrix.csv");
const RESULT_PATH = path.join(REPORT_DIR, "cycle-02-result.json");

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
  const baseUrl = process.env.CORE_MOBILE_LAYOUT_BASE_URL?.replace(/\/$/, "") || "";
  const runtimeAvailable = Boolean(baseUrl);
  const missingSnippets = requiredCssSnippets.filter((snippet) => !css.includes(snippet));
  const hasPackageScript =
    packageJson.scripts?.["qa:core-mobile-layout"] ===
    "node scripts/validate-core-mobile-layout.mjs";

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
        status: missingSnippets.length || !hasPackageScript ? "fail" : "pass_static",
        notes: runtimeAvailable
          ? `Runtime URL configured (${baseUrl}); run browser/CDP QA for measured DOM overflow.`
          : "AUTHENTICATED_RUNTIME_QA_ENVIRONMENT_BLOCKED: set CORE_MOBILE_LAYOUT_BASE_URL with an authenticated local/staging session to measure DOM overflow.",
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
    status: missingSnippets.length || !hasPackageScript ? "FAIL" : "PASS_STATIC_WITH_RUNTIME_LIMITATION",
    runtime: runtimeAvailable
      ? { available: true, baseUrl, note: "DOM overflow measurement requires the authenticated browser/CDP QA harness." }
      : {
          available: false,
          limitation: "AUTHENTICATED_RUNTIME_QA_ENVIRONMENT_BLOCKED",
          note: "No CORE_MOBILE_LAYOUT_BASE_URL was provided for authenticated route measurement.",
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

  console.log("[core-mobile-layout] PASS_STATIC_WITH_RUNTIME_LIMITATION");
  console.log(`Matrix: ${result.generatedArtifacts.matrix}`);
  if (!runtimeAvailable) {
    console.log(result.runtime.limitation);
  }
}

main().catch((error) => {
  console.error("[core-mobile-layout] unexpected failure");
  console.error(error);
  process.exit(1);
});
