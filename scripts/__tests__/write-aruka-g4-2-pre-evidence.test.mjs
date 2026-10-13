import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

const validFacts = {
  observed_at_utc: "2026-10-13T00:00:00Z", project_ref: "vrizeuhuhvtvbrmtvdik", project_status: "ACTIVE_HEALTHY",
  branch: "main", head: "a02f61f", origin_main: "a02f61f", bucket_count: 2, object_count: 8,
  total_bytes: 2113714, inventory_fingerprint: "af1df416b2c28a57686da805c8e47eec",
  storage_credential_status: "EXPIRED_RLS_SESSION", storage_credential_expired_at_utc: "2026-10-09T20:51:11Z",
  database_history_count: 25, database_latest_migration: "20260909110000", database_backup_path: "B:\\safe.dump",
  database_backup_size_bytes: 632622, database_backup_sha256: "7C95D044F7F4A6483B3B9EE0E7CA70E8B1FB35A361D31EB7FD9D3246D9D94E91",
  database_counts_match_restore: true, migration_package_path: "B:\\package", tests_passed: 8, tests_failed: 0,
  vercel_auto_deploy_risk: true
};

test("writes resumable blocked evidence outside Git without secrets", () => {
  const base = mkdtempSync(join(tmpdir(), "aruka-g4-2-evidence-"));
  const output = join(base, "run");
  const facts = join(base, "facts.json");
  try {
    mkdirSync(output);
    writeFileSync(facts, JSON.stringify(validFacts));
    execFileSync("node", ["scripts/write-aruka-g4-2-pre-evidence.mjs", "--output", output, "--facts", facts], { cwd: process.cwd() });
    const report = JSON.parse(readFileSync(join(output, "evidence", "mission-report.json"), "utf8"));
    assert.equal(report.decision, "BLOCKED");
    assert.equal(report.migrations_executed, 0);
    assert.equal(report.gates.P3_BACKUP, "BLOCKED_EXPIRED_AUTHORIZED_STORAGE_SESSION");
  } finally { rmSync(base, { recursive: true, force: true }); }
});

test("rejects a secret-like field and repository output", () => {
  const base = mkdtempSync(join(tmpdir(), "aruka-g4-2-evidence-negative-"));
  try {
    const facts = join(base, "facts.json");
    writeFileSync(facts, JSON.stringify({ ...validFacts, access_token: "forbidden" }));
    assert.throws(() => execFileSync("node", ["scripts/write-aruka-g4-2-pre-evidence.mjs", "--output", base, "--facts", facts], { cwd: process.cwd(), stdio: "pipe" }));
    writeFileSync(facts, JSON.stringify(validFacts));
    assert.throws(() => execFileSync("node", ["scripts/write-aruka-g4-2-pre-evidence.mjs", "--output", "reports/g4-2", "--facts", facts], { cwd: process.cwd(), stdio: "pipe" }));
  } finally { rmSync(base, { recursive: true, force: true }); }
});
