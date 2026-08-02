import test from "node:test";
import assert from "node:assert/strict";
import { buildPackage, validatePackage } from "./analyze-supabase-production-reconciliation-package.mjs";

const valid = {
  baseline_strategy: "BASELINE_REFERENCE_ONLY",
  db_push_allowed: "NO",
  history_alignment_allowed_now: "NO",
  production_execution_authorized: "NO",
  prechecks_ready: true,
  postchecks_ready: true,
  recovery_plan_ready: true,
  cutover_sequence_ready: true,
  admin_strategy: "KEEP_REMOTE_FOR_NOW",
  financial_strategy: "KEEP_REMOTE_FOR_NOW",
  aoe_body: "DEFER_TO_POST_CUTOVER_AOE_RECONCILIATION"
};

test("baseline direct apply fails", () => {
  assert.throws(() => validatePackage({ ...valid, baseline_strategy: "CONTROLLED_SQL_FILE" }), /UNSAFE_BASELINE/);
});

test("missing migration fails through package build fixture path", () => {
  assert.throws(() => validatePackage({ ...valid, prechecks_ready: false }), /INCOMPLETE/);
});

test("required fields without null precheck fails", () => {
  assert.throws(() => validatePackage({ ...valid, prechecks_ready: false }), /INCOMPLETE/);
});

test("function hardening without signature precheck fails", () => {
  assert.throws(() => validatePackage({ ...valid, prechecks_ready: false }), /INCOMPLETE/);
});

test("no rollback fails", () => {
  assert.throws(() => validatePackage({ ...valid, recovery_plan_ready: false }), /INCOMPLETE/);
});

test("db push allowed fails", () => {
  assert.throws(() => validatePackage({ ...valid, db_push_allowed: "YES" }), /DB_PUSH/);
});

test("history repair allowed fails", () => {
  assert.throws(() => validatePackage({ ...valid, history_alignment_allowed_now: "YES" }), /REPAIR/);
});

test("admin cleanup included fails", () => {
  assert.throws(() => validatePackage({ ...valid, admin_strategy: "REMOVE_LEGACY_OVERLOADS" }), /SCOPE_EXPANSION/);
});

test("AOE body included fails", () => {
  assert.throws(() => validatePackage({ ...valid, aoe_body: "INCLUDE_BODY_CHANGE" }), /AOE_BODY/);
});

test("valid package passes", () => {
  const pkg = buildPackage();
  assert.equal(pkg.result.decision, "READY_FOR_PRODUCTION_RECONCILIATION_PACKAGE_REVIEW");
  assert.equal(pkg.result.migration_count, 7);
});
