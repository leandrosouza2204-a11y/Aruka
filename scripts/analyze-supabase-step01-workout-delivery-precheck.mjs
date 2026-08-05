import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step01-workout-delivery-precheck-evidence.json`,
    `${BASE}/step01-workout-delivery-precheck-result.json`,
    `${BASE}/step01-workout-delivery-precheck-summary.md`,
    "docs/supabase-production-sync/27-step01-workout-delivery-precheck.md"
  ];
  const patterns = [
    new RegExp("postgres(?:ql)?://" + "[^,\\s\"']+", "i"),
    /\bpassword\s*[:=]/i,
    new RegExp("sb_" + "secret_", "i"),
    /service[_ -]?role\s+(key|secret)/i,
    /eyJ[A-Za-z0-9_-]{20,}\./,
    new RegExp("access[_ -]?" + "token", "i")
  ];
  for (const file of files) {
    if (!existsSync(join(root, file))) continue;
    const text = readFileSync(join(root, file), "utf8");
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

export function validateStep01Precheck(root = ROOT) {
  const result = readJson(root, `${BASE}/step01-workout-delivery-precheck-result.json`);
  const evidence = readJson(root, `${BASE}/step01-workout-delivery-precheck-evidence.json`);

  must(result.backup_verified === true, "BACKUP_NOT_VERIFIED");
  must(result.restore_method_reviewed === true, "RESTORE_METHOD_NOT_REVIEWED");
  must(result.supervised_cutover_start_authorized === true, "SUPERVISED_CUTOVER_NOT_AUTHORIZED");
  must(result.step01_precheck_authorized === true, "STEP01_PRECHECK_NOT_AUTHORIZED");
  must(result.step01_apply_authorized === false, "STEP01_APPLY_AUTHORIZED");
  must(result.step01_precheck_read_only === true, "STEP01_PRECHECK_NOT_READ_ONLY");
  must(result.step01_apply_executed === false, "STEP01_APPLY_EXECUTED");
  must(result.step01_postcheck_executed === false, "STEP01_POSTCHECK_EXECUTED");
  must(result.step01_smoke_executed === false, "STEP01_SMOKE_EXECUTED");
  must(result.apply_sql_traceable === true, "APPLY_SQL_NOT_TRACEABLE");
  must(result.recovery_available === true, "RECOVERY_NOT_AVAILABLE");
  must(evidence.authorization?.step01_apply_authorized === false, "EVIDENCE_APPLY_AUTHORIZED");
  must(evidence.step?.apply_executed === false, "EVIDENCE_APPLY_EXECUTED");

  if (result.decision === "GO_FOR_STEP01_APPLY_REVIEW") {
    must(result.project_verified === true, "GO_PROJECT_NOT_VERIFIED");
    must(result.step01_precheck_executed === true, "GO_PRECHECK_NOT_EXECUTED");
    must(result.step01_precheck_exit_code === 0, "GO_PRECHECK_EXIT_CODE_INVALID");
    must(result.blocking_remote_drift_count === 0, "GO_BLOCKING_DRIFT");
    must(result.apply_sql_unchanged === true, "GO_APPLY_SQL_CHANGED");
    must(result.next_action === "USER_REVIEW_AND_STEP01_APPLY_AUTHORIZATION", "GO_NEXT_ACTION_INVALID");
  } else if (result.decision === "NO_GO_STEP01") {
    must(result.next_action === "INVESTIGATE_STEP01_BLOCKER", "NO_GO_NEXT_ACTION_INVALID");
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKER_MISSING");
  } else if (result.decision === "AWAITING_SECURE_STEP01_PRECHECK_EXECUTION") {
    must(result.next_action === "RUN_EXTERNAL_SECURE_STEP01_PRECHECK_RUNNER", "AWAITING_NEXT_ACTION_INVALID");
    must(result.remote_precheck_client === "DOCKER_PSQL", "AWAITING_REMOTE_CLIENT_INVALID");
    must(result.windows_psql_required === false, "AWAITING_WINDOWS_PSQL_REQUIRED");
    must(result.supabase_cli_global_required === false, "AWAITING_SUPABASE_CLI_REQUIRED");
    must(result.persistent_link_required === false, "AWAITING_PERSISTENT_LINK_REQUIRED");
    must(result.step01_precheck_executed === false, "AWAITING_PRECHECK_ALREADY_EXECUTED");
    must(result.step01_precheck_exit_code === null, "AWAITING_EXIT_CODE_SHOULD_BE_NULL");
  } else {
    throw new Error("DECISION_INVALID");
  }

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep01Precheck();
  console.log(JSON.stringify({
    decision: result.decision,
    project_verified: result.project_verified,
    precheck_executed: result.step01_precheck_executed,
    apply_executed: result.step01_apply_executed,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
