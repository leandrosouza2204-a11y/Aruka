import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const migrationDir = path.join(root, "supabase", "migrations");
const reportPath = path.join(root, "reports", "cycle-12-15-7-production-readiness.json");
const docPath = path.join(root, "docs", "product-roadmap-v4-cycle-12-student-experience-v2", "28-production-readiness-final-gate.md");
const summaryPath = path.join(root, "reports", "cycle-12-15-7-production-readiness.md");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));

const migrations = fs.readdirSync(migrationDir).filter((name) => /^\d{14}_.+\.sql$/.test(name)).sort();
assert.equal(migrations.length, 40);
assert.equal(migrations.at(-1), "20261004133801_cycle12_forward_schema_security_reconciliation.sql");

function sha(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function manifestHash(files) {
  const lines = files.map((name) => `${name}:${sha(fs.readFileSync(path.join(migrationDir, name)))}`);
  return sha(`${lines.join("\n")}\n`);
}

const remote = migrations.slice(0, 25);
const pending = migrations.slice(25, 37);
const reconciliation = migrations.find((name) => name.startsWith("20261004133801_"));
assert.equal(manifestHash([...remote, ...pending]), report.manifests.a.sha256);
assert.equal(manifestHash([...remote, ...pending, reconciliation]), report.manifests.b.sha256);
assert.equal(manifestHash(migrations), report.manifests.c.sha256);
assert.equal(sha(fs.readFileSync(path.join(migrationDir, reconciliation))), report.manifests.reconciliation_sha256);

assert.equal(report.production_readiness, "NO_GO");
assert.equal(report.production_execution_authorized, false);
assert.equal(report.remote.migration_count, 25);
assert.equal(report.remote.pending_count, 15);
assert.deepEqual(report.remote.unexpected_remote, []);
assert.deepEqual(report.remote.missing_local, []);
assert.equal(report.schema_security.public_tables, report.schema_security.public_tables_with_rls);
assert.equal(report.schema_security.anon_executable_security_definer, 17);
assert.equal(report.legacy_overloads.items.length, 5);
assert.equal(report.backup_recovery.gate, "NO_GO");
assert.equal(report.rehearsal.gate, "PASS");
assert.equal(report.manifests.gate, "PASS");
assert.equal(report.failure_matrix.gate, "PASS");
for (const [key, value] of Object.entries(report.safety)) {
  if (key !== "remote_reads") assert.equal(value, 0, `${key} must remain zero`);
}

const requiredHeadings = [
  "Objetivo", "Escopo", "Baseline", "Remote read-only snapshot", "Migration inventory",
  "Schema/security snapshot", "Cinco legacy overloads", "Backup, PITR e recovery readiness",
  "Maintenance e write freeze", "Production-equivalent rehearsal", "Manifest A/B/C",
  "Failure matrix", "Pre-execution checklist", "QA", "Limitações", "Pendências humanas",
  "Decisão final", "Segurança", "Próximo passo"
];
const doc = fs.readFileSync(docPath, "utf8");
for (const heading of requiredHeadings) assert.match(doc, new RegExp(`^## \\d+\\. ${heading.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`, "m"));
assert.match(doc, /FUTURE_EXECUTION_ONLY — DO NOT RUN IN THIS MISSION/);
assert.match(doc, /PRODUCTION_READINESS=NO_GO/);
assert.match(doc, /PRODUCTION_EXECUTION_AUTHORIZED=NO/);

const scanFiles = [docPath, summaryPath, reportPath, fileURLToPath(import.meta.url)];
const forbidden = [
  /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
  /sb_secret_[A-Za-z0-9_-]+/,
  /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
  /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!\.\.\.)\S+/
];
for (const file of scanFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of forbidden) assert.doesNotMatch(text, pattern, `secret-like value in ${path.relative(root, file)}`);
}

console.log("CYCLE_12_15_7_VALIDATION=PASS");
console.log("PRODUCTION_READINESS=NO_GO");
console.log("REMOTE_WRITES=0");
console.log("REMOTE_MIGRATIONS_APPLIED=0");
