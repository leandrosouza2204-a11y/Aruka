import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyActiveSecurityItems,
  validateNoProductionReady
} from "./analyze-supabase-final-security-drift.mjs";

const activeItem = {
  domain: "SECURITY_POLICIES_GRANTS",
  object: "public policies and table/function grants hardened by 20260731190000",
  historical_status: "REMOTE_MORE_PERMISSIVE/REMOTE_ONLY grants",
  resolved_by: "20260731190000",
  current_local_status: "LOCAL_RECONCILIATION_IMPLEMENTED",
  remote_status: "REMOTE_RECONCILIATION_PENDING",
  active_or_resolved: "RESOLVED_BY_PHASE1",
  risk: "SECURITY",
  next_action: "Release/apply approved Phase 1 migration package before declaring production reconciled."
};

test("1 active security item is accepted", () => {
  const result = classifyActiveSecurityItems({ active_items: [activeItem] });
  assert.equal(result.initial_active_security_count, 1);
});

test("0 active security items returns already zero", () => {
  const result = classifyActiveSecurityItems({ active_items: [] });
  assert.equal(result.preliminary_decision, "SECURITY_DRIFT_ALREADY_ZERO");
});

test("0 active plus one remote pending preserves initial reclassification", () => {
  const result = classifyActiveSecurityItems({ active_items: [], remote_pending_security_items: [activeItem] });
  assert.equal(result.initial_active_security_count, 1);
  assert.equal(result.final_local_security_drift_count, 0);
  assert.equal(result.remote_pending_security_count, 1);
});

test(">1 active security items fails", () => {
  assert.throws(() => classifyActiveSecurityItems({ active_items: [activeItem, activeItem] }), /BLOCKED_GLOBAL_AUDIT_SECURITY_COUNT_MISMATCH/);
});

test("item covered by existing migration creates no new migration", () => {
  const result = classifyActiveSecurityItems({ active_items: [activeItem] });
  assert.equal(result.preliminary_decision, "SECURITY_DRIFT_ALREADY_IMPLEMENTED_LOCALLY");
  assert.equal(result.migration_required, false);
});

test("remote pending is not local drift", () => {
  const result = classifyActiveSecurityItems({ active_items: [activeItem] });
  assert.equal(result.local_security_state, "RESOLVED");
  assert.equal(result.remote_security_state, "PENDING_APPLY");
});

test("clear uncovered security grant can become migration candidate", () => {
  const result = classifyActiveSecurityItems({ active_items: [{ ...activeItem, resolved_by: "NONE", current_local_status: "LOCAL_DRIFT", active_or_resolved: "ACTIVE_SECURITY_DRIFT" }] });
  assert.equal(result.preliminary_decision, "SECURITY_MIGRATION_REQUIRED");
});

test("functional decision is blocked", () => {
  const result = classifyActiveSecurityItems({ active_items: [{ ...activeItem, domain: "FINANCIAL_FUNCTIONS", next_action: "MANUAL_FINANCIAL_DECISION_REQUIRED", resolved_by: "NONE" }] });
  assert.equal(result.preliminary_decision, "SECURITY_PRODUCT_DECISION_REQUIRED");
});

test("student identity is deferred as product/feature scope", () => {
  const result = classifyActiveSecurityItems({ active_items: [{ ...activeItem, domain: "STUDENT_IDENTITY", next_action: "DEFERRED_TO_STUDENT_IDENTITY", resolved_by: "NONE" }] });
  assert.equal(result.preliminary_decision, "SECURITY_PRODUCT_DECISION_REQUIRED");
});

test("workout delivery business change is deferred", () => {
  const result = classifyActiveSecurityItems({ active_items: [{ ...activeItem, domain: "WORKOUT_DELIVERY", next_action: "DEFERRED_TO_WORKOUT_DELIVERY", resolved_by: "NONE" }] });
  assert.equal(result.preliminary_decision, "SECURITY_PRODUCT_DECISION_REQUIRED");
});

test("production ready flags are rejected", () => {
  assert.throws(() => validateNoProductionReady({ decision: "READY_TO_APPLY" }), /FINAL_SECURITY_PRODUCTION_READY_FLAG_FORBIDDEN/);
});
