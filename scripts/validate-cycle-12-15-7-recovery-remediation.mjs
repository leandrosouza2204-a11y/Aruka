import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const reportPath = path.join(root, "reports", "cycle-12-15-7-recovery-remediation.json");
const summaryPath = path.join(root, "reports", "cycle-12-15-7-recovery-remediation.md");
const runbookPath = path.join(root, "docs", "product-roadmap-v4-cycle-12-student-experience-v2", "29-production-recovery-readiness-remediation.md");
const migrationDir = path.join(root, "supabase", "migrations");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const migrations = fs.readdirSync(migrationDir).filter((name) => /^\d{14}_.+\.sql$/.test(name)).sort();
assert.equal(migrations.length, 40);
assert.equal(migrations.at(-1), "20261004133801_cycle12_forward_schema_security_reconciliation.sql");

const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const manifestHash = (files) => sha(`${files.map((name) => `${name}:${sha(fs.readFileSync(path.join(migrationDir, name)))}`).join("\n")}\n`);
const remote = migrations.slice(0, 25);
const pending = migrations.slice(25, 37);
const reconciliation = migrations.find((name) => name.startsWith("20261004133801_"));

assert.equal(manifestHash([...remote, ...pending]), report.manifests.a);
assert.equal(manifestHash([...remote, ...pending, reconciliation]), report.manifests.b);
assert.equal(manifestHash(migrations), report.manifests.c);
assert.equal(sha(fs.readFileSync(path.join(migrationDir, reconciliation))), report.manifests.reconciliation);

assert.equal(report.status, "BLOCKED_EXTERNAL_REQUIREMENT");
assert.equal(report.classification, "C");
assert.equal(report.recovery_technical_proof, "BLOCKED");
assert.equal(report.production_readiness, "NO_GO");
assert.equal(report.production_execution_authorized, false);
assert.equal(report.rollout, "OFF");
assert.equal(report.baseline.executable_migrations, 40);
assert.equal(report.backup.creation, "BLOCKED_EXTERNAL_REQUIREMENT");
assert.equal(report.backup.created, false);
assert.equal(report.backup.verified, false);
assert.equal(report.restore.drill, "NOT_RUN_BLOCKED_BY_GATE_2");
assert.equal(report.restore.integrity, "NOT_MEASURED");
assert.match(report.rpo_rto.measured_rpo, /^NOT_MEASURABLE/);
assert.match(report.rpo_rto.measured_rto, /^NOT_MEASURABLE/);
assert.equal(report.remote.migration_count, 25);
assert.equal(report.remote.pending_count, 15);
assert.equal(report.remote.unexpected_remote, 0);
assert.equal(report.remote.missing_local, 0);
assert.equal(report.remote.drift_changed, false);
assert.equal(report.remote.public_tables, 30);
assert.equal(report.remote.public_tables_with_rls, 30);
assert.equal(report.remote.public_function_signatures, 49);
assert.equal(report.remote.public_policies, 75);
assert.equal(report.remote.direct_auth_uid_policies, 70);
assert.equal(report.remote.anon_executable_security_definer, 17);
assert.equal(report.remote.private_schema_present, false);
assert.equal(report.remote.rollout_objects_present, false);
assert.equal(report.remote.legacy_overloads, 5);
assert.match(report.upgrade_rehearsal, /^PASS_/);
assert.equal(report.global_qa.status, "PASS");
assert.ok(Object.values(report.global_qa.suites).every((value) => value.startsWith("PASS")));
for (const [key, value] of Object.entries(report.safety)) {
  if (key !== "remote_reads") assert.equal(value, 0, `${key} must remain zero`);
}

const runbook = fs.readFileSync(runbookPath, "utf8");
for (const heading of ["Backup creation", "Backup verification", "Isolated restore", "Restore validation", "RPO and RTO", "Cleanup and artifact handling", "Escalation and future production recovery"]) {
  assert.match(runbook, new RegExp(`^## \\d+\\. ${heading}$`, "m"));
}
assert.match(runbook, /Never restore onto `vrizeuhuhvtvbrmtvdik`/);
assert.match(runbook, /PRODUCTION_EXECUTION_AUTHORIZED=NO/);

const scanFiles = [reportPath, summaryPath, runbookPath, fileURLToPath(import.meta.url)];
const forbidden = [
  /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
  /sb_secret_[A-Za-z0-9_-]+/,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!\.\.\.)\S+/,
];
for (const file of scanFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `secret-like value in ${path.relative(root, file)}`);
}

console.log("CYCLE_12_15_7_RECOVERY_REMEDIATION_VALIDATION=PASS");
console.log("RECOVERY_TECHNICAL_PROOF=BLOCKED");
console.log("PRODUCTION_READINESS=NO_GO");
console.log("REMOTE_WRITES=0");
console.log("RESTORE_OPERATIONS_ON_PRODUCTION=0");
