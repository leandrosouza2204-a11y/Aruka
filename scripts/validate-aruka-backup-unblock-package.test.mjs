import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const script = path.resolve("scripts", "validate-aruka-backup-unblock-package.mjs");

test("unblock package remains fail-closed and contains no credentials", () => {
  const result = spawnSync(process.execPath, [script], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.status, "PASS");
  assert.equal(report.production_access, false);
  assert.equal(report.backup_started, false);
  assert.equal(report.approvals_granted, false);
  assert.equal(report.secrets_present, false);
});

test("pending templates are rejected by the existing remote gates", () => {
  const docs = path.resolve("docs", "product-roadmap-v4-cycle-12-student-experience-v2");
  const approval = JSON.parse(fs.readFileSync(path.join(docs, "storage-export-approval.pending.template.json"), "utf8"));
  const freeze = JSON.parse(fs.readFileSync(path.join(docs, "write-freeze-evidence.pending.template.json"), "utf8"));
  assert.notEqual(approval.decision, "APPROVED");
  assert.equal(approval.conditional_full_s3_exception_authorized, true);
  assert.equal(approval.allow_full_s3_access_key, false);
  assert.notEqual(freeze.status, "ACTIVE");
  assert.equal(freeze.storage_writes_frozen, false);
});

test("synthetic secret patterns are detected by the package validator rules", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-unblock-test-"));
  try {
    const synthetic = ["postgresql:", "//backup:synthetic-value@", "example.invalid/postgres"].join("");
    assert.match(synthetic, /postgres(?:ql)?:\/\/[^\s"']+@/iu);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
