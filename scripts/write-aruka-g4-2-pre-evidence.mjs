import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const output = resolve(required("--output"));
const factsPath = resolve(required("--facts"));
const outputRelative = relative(root, output);

if (!outputRelative.startsWith("..") && !isAbsolute(outputRelative)) {
  throw new Error("OUTPUT_MUST_BE_OUTSIDE_REPOSITORY");
}
if (!existsSync(output)) throw new Error("OUTPUT_DIRECTORY_MISSING");

const facts = JSON.parse(readFileSync(factsPath, "utf8"));
const allowedKeys = new Set([
  "observed_at_utc", "project_ref", "project_status", "branch", "head", "origin_main",
  "bucket_count", "object_count", "total_bytes", "inventory_fingerprint",
  "storage_credential_status", "storage_credential_expired_at_utc", "database_history_count",
  "database_latest_migration", "database_backup_path", "database_backup_size_bytes",
  "database_backup_sha256", "database_counts_match_restore", "migration_package_path",
  "tests_passed", "tests_failed", "vercel_auto_deploy_risk"
]);
for (const key of Object.keys(facts)) {
  if (!allowedKeys.has(key)) throw new Error(`UNEXPECTED_FACT_FIELD:${key}`);
}
for (const key of allowedKeys) {
  if (!(key in facts)) throw new Error(`MISSING_FACT_FIELD:${key}`);
}
if (facts.project_ref !== "vrizeuhuhvtvbrmtvdik") throw new Error("PROJECT_REF_MISMATCH");
if (facts.head !== facts.origin_main) throw new Error("GIT_BASELINE_MISMATCH");
if (facts.storage_credential_status !== "EXPIRED_RLS_SESSION") throw new Error("UNEXPECTED_STORAGE_CREDENTIAL_STATUS");
if (facts.database_history_count !== 25 || facts.object_count !== 8 || facts.bucket_count !== 2) {
  throw new Error("OBSERVED_BASELINE_REQUIRES_MANUAL_REVIEW");
}

const serializedFacts = JSON.stringify(facts);
if (/(service[_-]?role|refresh[_-]?token|access[_-]?token|secret[_-]?access|authorization\s*:|bearer\s+|eyJ[a-zA-Z0-9_-]{10,}\.)/i.test(serializedFacts)) {
  throw new Error("SENSITIVE_VALUE_PATTERN_DETECTED");
}

const gates = {
  P1_ENVIRONMENT: "PASS_WITH_ACL_CONTAINMENT",
  P2_INVENTORY: "PARTIAL_SANITIZED_AGGREGATE_ONLY",
  P3_BACKUP: "BLOCKED_EXPIRED_AUTHORIZED_STORAGE_SESSION",
  P4_INTEGRITY: "BLOCKED_NO_STORAGE_BYTES",
  P5_RECOVERY_DRILL: "BLOCKED_NO_STORAGE_BACKUP",
  P6_DATABASE: "PASS_WITH_FRESH_SNAPSHOT_PREREQUISITE",
  P7_OPERATIONS: "PASS_PREPARED_NOT_AUTHORIZED",
  P8_QA_EVIDENCE: "PARTIAL",
  P9_GIT: "LOCAL_BRANCH_ONLY_NO_PUSH_NO_MERGE"
};

const report = {
  decision: "BLOCKED",
  mission: "ARUKA_G4_2_PRE_STORAGE_BACKUP_AND_PRODUCTION_READINESS",
  generated_at_utc: new Date().toISOString(),
  facts,
  gates,
  blocker: {
    code: "AUTHORIZED_STORAGE_CREDENTIAL_EXPIRED",
    description: "The only available authorized Storage credential is an expired RLS session. Access controls were not bypassed and no credential was created.",
    resume_from: "P2_INVENTORY_PRIVATE_METADATA_THEN_P3_BACKUP",
    required_authorization: "Authorize creation or secure handoff of a fresh temporary RLS user access token for this single read-only Storage backup."
  },
  production_changes: [],
  migrations_executed: 0,
  student_experience_v2_activated: false,
  limitations: [
    "No Storage object bytes were downloaded, so hashes and a Storage recovery drill do not exist.",
    "The aggregate inventory does not replace the private per-object manifest required at resume.",
    "A fresh PostgreSQL snapshot remains mandatory immediately before any future G4.2 migration window."
  ]
};

const checkpointDir = join(output, "checkpoints");
const evidenceDir = join(output, "evidence");
const operationsDir = join(output, "operations");
for (const directory of [checkpointDir, evidenceDir, operationsDir]) mkdirSync(directory, { recursive: true });
for (const [gate, status] of Object.entries(gates)) {
  writeExclusive(join(checkpointDir, `${gate}.json`), `${JSON.stringify({ gate, status, observed_at_utc: facts.observed_at_utc }, null, 2)}\n`);
}
writeExclusive(join(evidenceDir, "mission-report.json"), `${JSON.stringify(report, null, 2)}\n`);
writeExclusive(join(evidenceDir, "mission-report.md"), markdownReport(report));
writeExclusive(join(operationsDir, "g4-2-readiness-runbook.md"), runbook(facts));

console.log(JSON.stringify({ decision: report.decision, gates, credentials_logged: false, output }, null, 2));

function writeExclusive(path, content) {
  writeFileSync(path, content, { encoding: "utf8", flag: "wx" });
}

function required(flag) {
  const index = args.indexOf(flag);
  if (index < 0 || !args[index + 1]) throw new Error(`REQUIRED_ARGUMENT_MISSING:${flag}`);
  return args[index + 1];
}

function markdownReport(value) {
  return `# Aruka G4.2-PRE evidence\n\nDECISION: **${value.decision}**\n\nGenerated: ${value.generated_at_utc}\n\n## Storage\n\n- Buckets: ${facts.bucket_count} private buckets.\n- Objects: ${facts.object_count}.\n- Aggregate size: ${facts.total_bytes} bytes.\n- Backup: not started; authorized RLS session expired at ${facts.storage_credential_expired_at_utc}.\n- Integrity and recovery drill: blocked because no object bytes were read.\n\n## Database\n\n- Existing dump: ${facts.database_backup_path}\n- Size/SHA-256: ${facts.database_backup_size_bytes} bytes / ${facts.database_backup_sha256}\n- Current history: ${facts.database_history_count}, latest ${facts.database_latest_migration}.\n- Critical row counts still match the isolated restore: ${facts.database_counts_match_restore}.\n- Fresh snapshot immediately before G4.2: required and not complete.\n\n## Safety\n\nNo production writes, migrations, deployment, Vercel configuration changes, Auth changes, bucket changes, or Student V2 activation occurred.\n\n## Resume\n\nResume at P2 private per-object inventory and P3 download only after a separately authorized fresh temporary RLS session is handed off securely.\n`;
}

function runbook(value) {
  return `# G4.2 controlled-window runbook\n\nStatus: PREPARED, NOT AUTHORIZED, NOT EXECUTED.\n\n## Required people and approvals\n\n- Operator: [UNASSIGNED]\n- Reviewer: [UNASSIGNED]\n- Recovery custodian: [UNASSIGNED]\n- Formal migration authorization: REQUIRED\n- Freeze confirmation: NOT ACTIVE\n\n## Preconditions\n\n1. Complete the private Storage manifest, byte backup, reopened-file SHA-256 verification, final re-inventory, and isolated local recovery drill.\n2. Confirm no unresolved concurrent Storage changes and record that cross-service atomicity is not guaranteed.\n3. Create and validate a fresh PostgreSQL snapshot immediately before the window.\n4. Reconfirm production migration history is ${value.database_history_count} and Student V2 remains OFF.\n5. Confirm Vercel linkage and automatic deployment risk; do not push or merge without specific authorization.\n6. Confirm monitoring owners, maintenance/freeze state, stop criteria, and contingency decision authority.\n\n## Migration package\n\nPrepared offline at: ${value.migration_package_path}\n\nExecute only in the exact numbered order after separate authorization. Before every step, compare its canonical SHA-256 with manifest.json. Stop on any hash mismatch, unexpected history, SQL error, security regression, health regression, or inability to preserve the verified recovery point. Never auto-run rollback or restore.\n\n## Success criteria\n\n- 16 authorized steps complete in order and history moves from 25 to 41 exactly.\n- Security postchecks pass.\n- Student V2 remains OFF until separately authorized.\n- V1 fallback and production health pass.\n- No unapproved Vercel, Auth, Storage, policy, or configuration change.\n`;
}
