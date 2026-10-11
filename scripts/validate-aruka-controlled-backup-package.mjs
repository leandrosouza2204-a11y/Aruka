import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docs = path.join(root, "docs", "product-roadmap-v4-cycle-12-student-experience-v2");
const files = {
  runbook: path.join(docs, "34-controlled-production-backup-without-full-freeze.md"),
  approval: path.join(docs, "controlled-production-backup-approval.pending.template.json"),
  stability: path.join(docs, "controlled-stability-evidence.pending.template.json"),
  checkpoint: path.join(docs, "controlled-recovery-point-checkpoint.template.json"),
  exporter: path.join(root, "scripts", "export-supabase-storage-backup.ps1"),
  coverage: path.join(root, "scripts", "test-supabase-storage-rls-coverage.ps1"),
  verifier: path.join(root, "scripts", "verify-controlled-recovery-point.mjs"),
  initializer: path.join(root, "scripts", "initialize-aruka-recovery-credentials.ps1"),
  credentialPolicy: path.join(root, "scripts", "lib", "aruka-recovery-credential-policy.psm1"),
  manifest: path.join(root, "scripts", "build-storage-recovery-manifest.mjs"),
};

function must(value, code) {
  if (!value) throw new Error(code);
}
for (const [name, file] of Object.entries(files)) must(fs.existsSync(file), `MISSING_${name.toUpperCase()}`);

const runbook = fs.readFileSync(files.runbook, "utf8");
for (const marker of [
  "COLLECTION_MODE=CONTROLLED_NO_FULL_WRITE_FREEZE",
  "BACKUP_STARTED=NO",
  "DATABASE_SNAPSHOT_CONSISTENCY=PASS",
  "STORAGE_BYTE_INTEGRITY=PASS",
  "CROSS_SERVICE_POINT_IN_TIME_CONSISTENCY=NOT_PROVEN",
  "nenhum cron foi pausado",
]) must(runbook.includes(marker), `RUNBOOK_MARKER_MISSING_${marker}`);

const approval = JSON.parse(fs.readFileSync(files.approval, "utf8"));
must(approval.decision === "PENDING_HUMAN_FIELDS", "APPROVAL_MUST_FAIL_CLOSED");
must(approval.project_ref === "vrizeuhuhvtvbrmtvdik", "PROJECT_MISMATCH");
must(approval.collection_without_full_write_freeze_authorized === true, "CONTROLLED_COLLECTION_SCOPE_MISSING");
must(approval.approved_by === null && approval.change_record === null && approval.expires_at_utc === null, "HUMAN_FIELDS_MUST_REMAIN_NULL");
must(approval.production_actions_enabled === false && approval.backup_started === false, "PRODUCTION_MUST_REMAIN_DISABLED");
must(approval.deploy_prohibited && approval.migrations_prohibited && approval.git_operations_prohibited, "PROHIBITIONS_MISSING");

const stability = JSON.parse(fs.readFileSync(files.stability, "utf8"));
must(stability.status === "PENDING", "STABILITY_MUST_BE_PENDING");
must(stability.mode === "CONTROLLED_NO_FULL_WRITE_FREEZE", "STABILITY_MODE_MISMATCH");
must(stability.full_write_freeze_proven === false, "FULL_FREEZE_MUST_NOT_BE_CLAIMED");
must(stability.cron_paused === false && stability.backup_started === false, "PRODUCTION_ACTION_MUST_NOT_BE_CLAIMED");
must(stability.cross_service_point_in_time_consistency_expected === "NOT_PROVEN", "CROSS_SERVICE_LIMIT_MISSING");

const checkpoint = JSON.parse(fs.readFileSync(files.checkpoint, "utf8"));
must(checkpoint.cross_service_point_in_time_consistency === "NOT_PROVEN", "CHECKPOINT_LIMIT_MISSING");
must(checkpoint.window.full_write_freeze_proven === false, "CHECKPOINT_FREEZE_CLAIM_INVALID");

for (const name of ["exporter", "coverage", "verifier", "initializer", "credentialPolicy", "manifest"]) {
  const source = fs.readFileSync(files[name], "utf8");
  must(!/\b(?:execFileSync|spawnSync|&)\s*\(?["']?git\b/u.test(source), `GIT_OPERATION_IN_${name.toUpperCase()}`);
}
const combined = Object.values(files).map((file) => fs.readFileSync(file, "utf8")).join("\n");
must(!/postgres(?:ql)?:\/\/[^\s"']+@/iu.test(combined), "CONNECTION_STRING_EXPOSED");
must(!/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/u.test(combined), "JWT_EXPOSED");
must(!/sb_secret_[A-Za-z0-9_-]+/u.test(combined), "SECRET_KEY_EXPOSED");

console.log(JSON.stringify({
  status: "PASS",
  checks: 28,
  production_access: false,
  production_changed: false,
  backup_started: false,
  credentials_created: false,
  cross_service_point_in_time_consistency: "NOT_PROVEN",
  restore_drill: "PARTIAL",
  production_readiness: "NO_GO",
}));
