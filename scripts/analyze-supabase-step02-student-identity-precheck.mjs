import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "93C0AD41BD51551BF0F0A6516AC1FD5B3915C724DD1109E2E1CEBBD1AB04D170";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step02-student-identity-precheck-result.json`,
    `${BASE}/step02-student-identity-precheck-summary.md`,
    "docs/supabase-production-sync/30-step02-student-identity-precheck.md"
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

export function validateStep02StudentIdentityPrecheck(root = ROOT) {
  const result = readJson(root, `${BASE}/step02-student-identity-precheck-result.json`);

  must(["GO_FOR_STEP02_APPLY_AUTHORIZATION", "NO_GO_STEP02", "AWAITING_SECURE_STEP02_PRECHECK_EXECUTION"].includes(result.decision), "DECISION_INVALID");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.precheck_read_only === true, "PRECHECK_NOT_READ_ONLY");
  must(result.apply_sql_traceable === true, "APPLY_NOT_TRACEABLE");
  must(result.untraceable_statement_count === 0, "UNTRACEABLE_SQL");
  must(result.apply_sql_unchanged === true, "APPLY_SQL_CHANGED");
  must(result.recovery_available === true, "RECOVERY_NOT_AVAILABLE");
  must(result.postcheck_available === true, "POSTCHECK_NOT_AVAILABLE");
  must(result.step02_apply_authorized === false, "APPLY_AUTHORIZED");
  must(result.step02_apply_executed === false, "APPLY_EXECUTED");
  must(result.production_executed === false, "PRODUCTION_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");

  if (result.decision === "GO_FOR_STEP02_APPLY_AUTHORIZATION") {
    must(result.project_verified === true, "GO_PROJECT_NOT_VERIFIED");
    must(result.precheck_exit_code === 0, "GO_PRECHECK_EXIT_INVALID");
    must(result.student_user_id_state !== "BLOCKING_REMOTE_DRIFT", "GO_STUDENT_USER_ID_BLOCKING");
    must(result.fk_state !== "BLOCKING_REMOTE_DRIFT", "GO_FK_BLOCKING");
    must(result.indexes_state !== "BLOCKING_REMOTE_DRIFT", "GO_INDEXES_BLOCKING");
    must(result.role_state !== "BLOCKING_REMOTE_DRIFT", "GO_ROLE_BLOCKING");
    must(result.rpcs_state !== "BLOCKING_REMOTE_DRIFT", "GO_RPCS_BLOCKING");
    must(result.rpc_grants_state !== "BLOCKING_REMOTE_DRIFT", "GO_RPC_GRANTS_BLOCKING");
    must(result.duplicate_student_identity_count === 0, "GO_DUPLICATE_IDENTITIES");
    must(result.orphan_student_identity_count === 0, "GO_ORPHAN_IDENTITIES");
    must(result.blocking_remote_drift_count === 0, "GO_BLOCKING_DRIFT");
    must(result.next_action === "USER_EXPLICIT_STEP02_APPLY_AUTHORIZATION", "GO_NEXT_ACTION_INVALID");
  } else if (result.decision === "NO_GO_STEP02") {
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKERS_MISSING");
    must(result.next_action === "FIX_ONLY_STEP02_BLOCKER", "NO_GO_NEXT_ACTION_INVALID");
  } else {
    must(result.project_verified === null, "AWAITING_PROJECT_SHOULD_BE_NULL");
    must(result.precheck_exit_code === null, "AWAITING_EXIT_CODE_SHOULD_BE_NULL");
    must(result.next_action === "USER_EXECUTE_STEP02_PRECHECK_RUNNER", "AWAITING_NEXT_ACTION_INVALID");
  }

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep02StudentIdentityPrecheck();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_sql_hash: result.apply_sql_hash,
    runtime_qa_classification: result.runtime_qa_classification,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
