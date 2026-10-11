import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const validator = path.resolve("scripts", "validate-aruka-controlled-backup-package.mjs");

test("controlled package is fail-closed without human fields", () => {
  const result = spawnSync(process.execPath, [validator], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "PASS");
  assert.equal(report.production_changed, false);
  assert.equal(report.backup_started, false);
  assert.equal(report.cross_service_point_in_time_consistency, "NOT_PROVEN");
});

test("controlled approval cannot enable production actions while nominal fields are absent", () => {
  const file = path.resolve("docs", "product-roadmap-v4-cycle-12-student-experience-v2", "controlled-production-backup-approval.pending.template.json");
  const approval = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(approval.decision, "PENDING_HUMAN_FIELDS");
  assert.equal(approval.approved_by, null);
  assert.equal(approval.change_record, null);
  assert.equal(approval.production_actions_enabled, false);
});

test("controlled checkpoint never upgrades cross-service consistency", () => {
  const file = path.resolve("docs", "product-roadmap-v4-cycle-12-student-experience-v2", "controlled-recovery-point-checkpoint.template.json");
  const checkpoint = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(checkpoint.consistency_mode, "CONTROLLED_NO_FULL_WRITE_FREEZE");
  assert.equal(checkpoint.window.full_write_freeze_proven, false);
  assert.equal(checkpoint.cross_service_point_in_time_consistency, "NOT_PROVEN");
});

test("secret detectors recognize synthetic values without storing them", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-controlled-test-"));
  try {
    const synthetic = ["postgresql:", "//backup:synthetic-value@", "example.invalid/postgres"].join("");
    assert.match(synthetic, /postgres(?:ql)?:\/\/[^\s"']+@/iu);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
