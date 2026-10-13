import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const facts = {
  observed_at_utc: "2026-10-13T01:00:00Z", project_ref: "vrizeuhuhvtvbrmtvdik", project_status: "ACTIVE_HEALTHY",
  branch: "docs/g4-2-pre-storage-backup-readiness", reference_commit: "63ef268", inventory_fingerprint: "sanitized",
  assessment_bucket_objects: 8, assessment_bucket_bytes: 2113714, exercise_media_objects: 0, referenced_objects: 6,
  unreferenced_objects: 2, photo_reference_occurrences: 6, evaluation_rows: 2, student_records: 2, owner_records: 2,
  migration_history_count: 25, latest_migration: "20260909110000", pending_migrations: 16, student_v2_enabled: false,
  database_backup_sha256: "A".repeat(64), database_restore_evidence_sha256: "B".repeat(64), migration_manifest_sha256: "C".repeat(64),
  storage_recovery_decision: "ACCEPT_DATABASE_ONLY", test_data_disposition: "DELETION_AUTHORIZED_BUT_DEFERRED",
  storage_backup_required: false, database_fresh_snapshot_required: true
};

test("writes a scoped READY closeout without claiming backup or deletion", () => {
  const base = mkdtempSync(join(tmpdir(), "aruka-risk-closeout-"));
  const output = join(base, "run"); const input = join(base, "facts.json"); mkdirSync(output); writeFileSync(input, JSON.stringify(facts));
  try {
    execFileSync("node", ["scripts/write-aruka-g4-2-storage-risk-closeout.mjs", "--output", output, "--facts", input], { cwd: process.cwd() });
    const report = JSON.parse(readFileSync(join(output, "evidence", "storage-risk-acceptance-closeout.json"), "utf8"));
    assert.equal(report.decision, "READY_FOR_G4_2_AUTHORIZATION");
    assert.equal(report.storage.objects_deleted, 0);
    assert.equal(report.storage.backup_performed, false);
    assert.equal(report.database.migrations_authorized, false);
    assert.equal(report.rollout.activation_authorized, false);
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test("fails closed on inventory drift, an invalid waiver or repository output", () => {
  const base = mkdtempSync(join(tmpdir(), "aruka-risk-closeout-negative-"));
  try {
    for (const changed of [{ assessment_bucket_objects: 9 }, { storage_backup_required: true }]) {
      const input = join(base, `facts-${Object.keys(changed)[0]}.json`); writeFileSync(input, JSON.stringify({ ...facts, ...changed }));
      assert.throws(() => execFileSync("node", ["scripts/write-aruka-g4-2-storage-risk-closeout.mjs", "--output", base, "--facts", input], { cwd: process.cwd(), stdio: "pipe" }));
    }
    const input = join(base, "facts-valid.json"); writeFileSync(input, JSON.stringify(facts));
    assert.throws(() => execFileSync("node", ["scripts/write-aruka-g4-2-storage-risk-closeout.mjs", "--output", "reports/g4-2", "--facts", input], { cwd: process.cwd(), stdio: "pipe" }));
  } finally { rmSync(base, { recursive: true, force: true }); }
});
