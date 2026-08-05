import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";

function json(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(value, code) {
  if (!value) throw new Error(code);
}

export function validateStep01FinalAuthorization(root = ROOT) {
  const result = json(root, `${BASE}/step01-final-authorization-result.json`);
  must(result.step01_precheck_exit_code === 0, "PRECHECK_EXIT_NOT_ZERO");
  must(result.project_verified === true, "PROJECT_NOT_VERIFIED");
  must(result.rollback_confirmed === true, "ROLLBACK_NOT_CONFIRMED");
  must(result.remote_mutation_executed === false, "REMOTE_MUTATION_EXECUTED");
  must(result.untraceable_statement_count === 0, "UNTRACEABLE_STATEMENTS");
  must(result.apply_sql_unchanged === true, "APPLY_SQL_CHANGED");
  must(result.apply_compatible_with_remote_state === true, "APPLY_INCOMPATIBLE");
  must(result.recovery_available === true && result.recovery_reviewed === true, "RECOVERY_MISSING");
  must(result.postcheck_available === true, "POSTCHECK_MISSING");
  must(result.smoke_plan_available === true, "SMOKE_PLAN_MISSING");
  must(result.step01_apply_authorized === false, "APPLY_AUTHORIZED");
  must(result.step01_apply_executed === false, "APPLY_EXECUTED");
  must(result.step01_postcheck_executed === false, "POSTCHECK_EXECUTED");
  must(result.step01_smoke_executed === false, "SMOKE_EXECUTED");
  if (result.decision === "READY_FOR_STEP01_APPLY_AUTHORIZATION") {
    must(result.blocking_remote_drift_count === 0, "READY_BLOCKING_DRIFT");
    must(result.next_action === "USER_EXPLICIT_STEP01_APPLY_AUTHORIZATION", "READY_NEXT_ACTION");
  } else if (result.decision === "NO_GO_STEP01_FINAL_AUTHORIZATION") {
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKER_MISSING");
    must(result.next_action === "INVESTIGATE_STEP01_FINAL_AUTHORIZATION_BLOCKER", "NO_GO_NEXT_ACTION");
  } else {
    throw new Error("DECISION_INVALID");
  }
  return result;
}

function main() {
  const result = validateStep01FinalAuthorization();
  console.log(JSON.stringify({ decision: result.decision, next_action: result.next_action }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
