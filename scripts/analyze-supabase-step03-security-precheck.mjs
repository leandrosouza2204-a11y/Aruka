import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "BD2753069A1F2F6565AFD1E846872D1E48EA5A4FE24F413415C8E66BC3392D54";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step03-security-precheck-result.json`,
    `${BASE}/step03-security-precheck-summary.md`,
    "docs/supabase-production-sync/32-step03-security-precheck.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    /\bpassword\b/i,
    /vriz[a-z0-9]+vdik/i
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readFileSync(fullPath, "utf8");
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

export function validateStep03SecurityPrecheck(root = ROOT) {
  const result = readJson(root, `${BASE}/step03-security-precheck-result.json`);

  must(["GO_FOR_STEP03_APPLY_AUTHORIZATION", "NO_GO_STEP03", "AWAITING_SECURE_STEP03_PRECHECK_EXECUTION"].includes(result.decision), "DECISION_INVALID");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_sql_traceable === true, "APPLY_NOT_TRACEABLE");
  must(result.untraceable_statement_count === 0, "UNTRACEABLE_SQL");
  must(result.apply_sql_unchanged === true, "APPLY_SQL_CHANGED");
  must(result.recovery_available === true, "RECOVERY_NOT_AVAILABLE");
  must(result.postcheck_available === true, "POSTCHECK_NOT_AVAILABLE");
  must(result.runtime_requirement === "SECURITY_POSTCHECK_SUFFICIENT" || result.runtime_requirement === "MINIMAL_SECURITY_RUNTIME_REQUIRED", "RUNTIME_REQUIREMENT_INVALID");
  must(result.step03_apply_authorized === false, "APPLY_AUTHORIZED");
  must(result.step03_apply_executed === false, "APPLY_EXECUTED");

  if (result.decision === "GO_FOR_STEP03_APPLY_AUTHORIZATION") {
    must(result.project_verified === true, "GO_PROJECT_NOT_VERIFIED");
    must(result.precheck_exit_code === 0, "GO_PRECHECK_EXIT_INVALID");
    must(result.blocking_security_drift_count === 0, "GO_BLOCKING_SECURITY_DRIFT");
    must(result.next_action === "USER_EXPLICIT_STEP03_APPLY_AUTHORIZATION", "GO_NEXT_ACTION_INVALID");
  } else if (result.decision === "NO_GO_STEP03") {
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKERS_MISSING");
    must(result.next_action === "FIX_ONLY_STEP03_BLOCKER", "NO_GO_NEXT_ACTION_INVALID");
  } else {
    must(result.precheck_exit_code === null, "AWAITING_EXIT_CODE_SHOULD_BE_NULL");
    must(result.production_executed === false, "AWAITING_PRODUCTION_EXECUTED");
    must(result.next_action === "USER_EXECUTE_STEP03_PRECHECK_RUNNER", "AWAITING_NEXT_ACTION_INVALID");
  }

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep03SecurityPrecheck();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_sql_hash: result.apply_sql_hash,
    runtime_requirement: result.runtime_requirement,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
