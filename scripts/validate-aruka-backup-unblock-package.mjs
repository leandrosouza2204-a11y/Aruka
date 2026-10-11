import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docs = path.join(root, "docs", "product-roadmap-v4-cycle-12-student-experience-v2");
const packagePath = path.join(docs, "32-production-backup-unblock-package.md");
const finalSecurityPath = path.join(docs, "33-final-production-backup-security-unblock.md");
const approvalPath = path.join(docs, "production-recovery-approval.pending.template.json");
const storagePath = path.join(docs, "storage-export-approval.pending.template.json");
const freezePath = path.join(docs, "write-freeze-evidence.pending.template.json");

function must(value, code) {
  if (!value) throw new Error(code);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

for (const file of [packagePath, finalSecurityPath, approvalPath, storagePath, freezePath]) {
  must(fs.existsSync(file), `MISSING_${path.basename(file)}`);
}

const markdown = fs.readFileSync(packagePath, "utf8");
const finalSecurity = fs.readFileSync(finalSecurityPath, "utf8");
for (const marker of [
  "BACKUP_STARTED=NO",
  "DATABASE_BACKUP_RLS_BYPASS_READ_ONLY_OPERATIONS",
  "FULL_S3_ACCESS_KEY_BYPASSES_RLS",
  "não existe comando de pausa",
  "Ausência momentânea de tráfego não é evidência de freeze",
  "Nenhuma dessas decisões é presumida",
]) must(markdown.includes(marker), `PACKAGE_MARKER_MISSING_${marker}`);
for (const marker of [
  "EXECUTION_READINESS=BLOCKED",
  "EDGE_FREEZE=BLOCKED",
  "STORAGE_FREEZE=BLOCKED",
  "active version 14",
  "prior active state: `true`",
  "no proven complete Edge freeze",
  "Do not begin collection",
]) must(finalSecurity.includes(marker), `FINAL_SECURITY_MARKER_MISSING_${marker}`);

const approval = readJson(approvalPath);
must(approval.decision === "PENDING_HUMAN_COMPLETION", "APPROVAL_MUST_FAIL_CLOSED");
must(approval.project_ref === "vrizeuhuhvtvbrmtvdik", "APPROVAL_PROJECT_MISMATCH");
must(approval.destination === "B:\\Aruka\\Recovery\\20261008-213100Z", "APPROVAL_DESTINATION_MISMATCH");
must(approval.approved_by === null && approval.expires_at_utc === null, "APPROVAL_HUMAN_FIELDS_MUST_BE_NULL");
must(approval.authorization_scope_recorded === true, "AUTHORIZATION_SCOPE_MUST_BE_RECORDED");
must(approval.database_backup_rls_bypass_read_only_operations_approved === true, "DB_BYPASS_SCOPE_MUST_BE_RECORDED");
must(approval.storage_rls_session_preferred === true, "RLS_SESSION_PREFERENCE_MUST_BE_RECORDED");
must(approval.conditional_full_s3_exception_authorized === true, "CONDITIONAL_S3_EXCEPTION_MUST_BE_RECORDED");
must(approval.full_s3_access_key_bypasses_rls_approved === false, "S3_BYPASS_MUST_NOT_BE_PREAPPROVED");
must(approval.deploy_prohibited === true && approval.rls_modification_prohibited === true, "PROHIBITIONS_MUST_BE_RECORDED");
must(approval.database_snapshot_and_read_only_dumps_approved === false, "BACKUP_EXECUTION_MUST_REMAIN_PENDING");
must(approval.storage_object_download_approved === false, "STORAGE_EXPORT_MUST_REMAIN_PENDING");
must(approval.backup_started === false, "BACKUP_MUST_NOT_BE_STARTED");

const storage = readJson(storagePath);
must(storage.decision === "PENDING_HUMAN_COMPLETION", "STORAGE_APPROVAL_MUST_FAIL_CLOSED");
must(storage.credential_mode === "RLS_SESSION_TOKEN_PREFERRED", "STORAGE_MODE_PREFERENCE_MISMATCH");
must(storage.expected_objects === 8, "STORAGE_EXPECTED_OBJECT_COUNT_MISMATCH");
must(storage.rls_inventory_coverage_proven === false, "RLS_COVERAGE_MUST_NOT_BE_ASSUMED");
must(storage.conditional_full_s3_exception_authorized === true, "STORAGE_CONDITIONAL_EXCEPTION_MISSING");
must(storage.allow_full_s3_access_key === false, "FULL_S3_KEY_MUST_NOT_BE_PREAPPROVED");

const freeze = readJson(freezePath);
must(freeze.status === "PENDING", "FREEZE_MUST_BE_PENDING");
must(freeze.freeze_scope_authorized === true, "FREEZE_SCOPE_MUST_BE_RECORDED");
must(freeze.controls_executed === false, "FREEZE_CONTROLS_MUST_NOT_BE_CLAIMED");
for (const flag of [
  "application_writes_frozen",
  "storage_writes_frozen",
  "background_jobs_paused",
  "edge_function_invocations_blocked",
  "storage_write_verbs_blocked",
  "storage_read_verbs_available",
  "two_stable_observations_completed",
  "backup_started",
]) must(freeze[flag] === false, `FREEZE_FLAG_MUST_BE_FALSE_${flag}`);

const combined = [markdown, finalSecurity, JSON.stringify(approval), JSON.stringify(storage), JSON.stringify(freeze)].join("\n");
must(!/postgres(?:ql)?:\/\/[^\s"']+@/iu.test(combined), "CONNECTION_STRING_EXPOSED");
must(!/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/u.test(combined), "JWT_EXPOSED");
must(!/sb_secret_[A-Za-z0-9_-]+/u.test(combined), "SECRET_KEY_EXPOSED");

const result = {
  status: "PASS",
  checks: 41,
  production_access: false,
  backup_started: false,
  approvals_granted: false,
  secrets_present: false,
  restore_drill: "PARTIAL",
  production_readiness: "NO_GO",
};
console.log(JSON.stringify(result));
