import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const CUTOVER = `${BASE}/production-cutover-sql`;
const STEP_COUNT = 6;

function read(root, path) {
  return readFileSync(join(root, path), "utf8");
}

function mustExist(root, path) {
  if (!existsSync(join(root, path))) throw new Error(`MISSING_AUTHORIZATION_FILE:${path}`);
}

function assertReadOnly(sql) {
  const stripped = sql.replace(/--.*$/gm, "");
  if (/\b(insert|update|delete|alter|create|drop|grant|revoke|truncate|merge|do|call)\b/i.test(stripped)) {
    throw new Error("AUTHORIZATION_READONLY_SQL_FAILED");
  }
}

function forbiddenApplyContent(sql, step) {
  if (/db\s+push|migration\s+repair|supabase\s+link/i.test(sql)) throw new Error(`FORBIDDEN_HISTORY_OR_PUSH:${step}`);
  if (/postgres:\/\/|postgresql:\/\/|sb_secret_|service[_ -]?key|eyJ[A-Za-z0-9_-]+\./i.test(sql)) throw new Error(`FORBIDDEN_SECRET_OR_CONNECTION:${step}`);
  if (step === "01" && /student_user_id|vincular_aluno_usuario|desvincular_aluno_usuario|get_my_student_workouts|admin_|pagamentos|assinaturas|planos/i.test(sql)) {
    throw new Error("WORKOUT_FORBIDDEN_SCOPE");
  }
  if (step === "05" && /create\s+(or\s+replace\s+)?function|drop\s+function/i.test(sql)) throw new Error("AOE_BODY_CHANGE_FORBIDDEN");
  if (step === "06" && /create\s+or\s+replace\s+function/i.test(sql)) throw new Error("GROUP_A_BODY_REPLACE_FORBIDDEN");
}

export function validateAuthorization(root = ROOT) {
  const required = [
    "docs/supabase-production-sync/24-production-cutover-authorization-review.md",
    `${BASE}/production-cutover-authorization-result.json`,
    `${BASE}/production-cutover-authorization-summary.md`,
    `${BASE}/production-cutover-source-traceability.json`,
    `${BASE}/production-cutover-smoke-test-plan.md`,
    `${BASE}/production-cutover-execution-checklist.md`,
    `${CUTOVER}/manifest.json`
  ];
  required.forEach((path) => mustExist(root, path));

  const manifest = JSON.parse(read(root, `${CUTOVER}/manifest.json`));
  const verificationEvidenceExists = existsSync(join(root, `${BASE}/cutover-backup-verification-evidence.json`));
  if (manifest.production_execution_authorized !== false) throw new Error("AUTHORIZATION_EXECUTION_FORBIDDEN");
  if (manifest.db_push_allowed !== false) throw new Error("AUTHORIZATION_DB_PUSH_FORBIDDEN");
  if (manifest.history_alignment_allowed_now !== false) throw new Error("AUTHORIZATION_HISTORY_ALIGNMENT_FORBIDDEN");
  if (manifest.cutover_backup_required !== true) throw new Error("AUTHORIZATION_BACKUP_REQUIRED_MISSING");
  if (manifest.cutover_backup_verified !== false && !(verificationEvidenceExists && manifest.cutover_backup_verified === true)) throw new Error("AUTHORIZATION_BACKUP_VERIFIED_WITHOUT_EVIDENCE");
  if (manifest.authorization_reviewed !== true) throw new Error("AUTHORIZATION_REVIEW_FLAG_MISSING");
  if (manifest.execution_method !== "MANUAL_SUPERVISED_SQL_EDITOR") throw new Error("AUTHORIZATION_EXECUTION_METHOD_INVALID");
  if (manifest.steps?.length !== STEP_COUNT) throw new Error("AUTHORIZATION_STEP_COUNT_INVALID");
  if (!manifest.maintenance_window?.required || manifest.maintenance_window?.estimate !== "30-60 min") throw new Error("AUTHORIZATION_MAINTENANCE_WINDOW_INVALID");

  for (const step of manifest.steps) {
    for (const key of ["precheck_file", "apply_file", "postcheck_file", "recovery_file"]) {
      mustExist(root, `${CUTOVER}/${step[key]}`);
    }
    if (step.execution_authorized !== false) throw new Error(`STEP_EXECUTION_AUTHORIZED:${step.step}`);
    if (!step.transaction_strategy || !step.lock_risk || !step.downtime_expectation || !step.go_no_go_status) throw new Error(`STEP_OPERATIONAL_FIELDS_MISSING:${step.step}`);
    assertReadOnly(read(root, `${CUTOVER}/${step.precheck_file}`));
    assertReadOnly(read(root, `${CUTOVER}/${step.postcheck_file}`));
    forbiddenApplyContent(read(root, `${CUTOVER}/${step.apply_file}`), step.step);
    if (!read(root, `${CUTOVER}/${step.recovery_file}`).includes("Automatic rollback is not authorized")) throw new Error(`RECOVERY_POLICY_MISSING:${step.step}`);
  }

  const trace = JSON.parse(read(root, `${BASE}/production-cutover-source-traceability.json`));
  if (trace.status !== "TRACEABILITY_COMPLETE" || trace.entries?.length !== STEP_COUNT) throw new Error("AUTHORIZATION_TRACEABILITY_INCOMPLETE");

  const result = JSON.parse(read(root, `${BASE}/production-cutover-authorization-result.json`));
  if (result.decision !== "READY_FOR_SUPERVISED_PRODUCTION_CUTOVER") throw new Error("AUTHORIZATION_DECISION_INVALID");
  if (result.untraced_statements !== 0) throw new Error("AUTHORIZATION_UNTRACED_SQL");
  const backupVerifiedValid = result.backup_verified === "NO" || (verificationEvidenceExists && result.backup_verified === true);
  const productionAuthValid = result.production_execution_authorized === "NO" || result.production_execution_authorized === false;
  if (!backupVerifiedValid || !productionAuthValid || result.cutover_allowed === true) throw new Error("AUTHORIZATION_RESULT_FLAGS_INVALID");
  if (result.db_push_allowed !== "NO" || result.history_alignment_allowed !== "NO") throw new Error("AUTHORIZATION_RESULT_FORBIDDEN_FLAGS");

  return result;
}

function main() {
  const result = validateAuthorization();
  console.log(JSON.stringify({
    decision: result.decision,
    steps_reviewed: result.steps_reviewed,
    backup_verified: result.backup_verified,
    production_execution_authorized: result.production_execution_authorized,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
