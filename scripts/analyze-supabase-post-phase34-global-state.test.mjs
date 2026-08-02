import test from "node:test";
import assert from "node:assert/strict";
import {
  buildGlobalState,
  validateGlobalState
} from "./analyze-supabase-post-phase34-global-state.mjs";

test("Phase 1 item is resolved locally without production-ready status", () => {
  const state = buildGlobalState();
  assert.ok(state.resolved_items.some((item) => item.active_or_resolved === "RESOLVED_BY_PHASE1"));
  assert.equal(state.remote_reconciliation_state, "NOT_APPLIED");
});

test("Phase 2 required nullability is resolved and preserved nullable fields are not blockers", () => {
  const state = buildGlobalState();
  assert.ok(state.resolved_items.some((item) => item.object === "alunos.created_at" && item.active_or_resolved === "RESOLVED_BY_PHASE2"));
  assert.ok(state.totals.false_positive_or_preserved >= 7);
});

test("semantic false positives are not active blockers", () => {
  const state = buildGlobalState();
  assert.ok(state.deferred_items.every((item) => item.active_or_resolved !== "SEMANTIC_FALSE_POSITIVE"));
});

test("Group E grant is resolved but AOE body remains deferred", () => {
  const state = buildGlobalState();
  assert.ok(state.resolved_items.some((item) => item.active_or_resolved === "RESOLVED_BY_PHASE32_GROUP_E"));
  assert.ok(state.deferred_items.some((item) => item.active_or_resolved === "DEFERRED_TO_AOE_BODY_RECONCILIATION"));
});

test("Group A utility hardening is resolved", () => {
  const state = buildGlobalState();
  assert.ok(state.resolved_items.some((item) => item.active_or_resolved === "RESOLVED_BY_PHASE34_GROUP_A"));
});

test("student identity is local-only future deployment", () => {
  const state = buildGlobalState();
  assert.ok(state.deferred_items.some((item) => item.active_or_resolved === "LOCAL_ONLY_FUTURE_DEPLOYMENT"));
});

test("admin and financial decisions stay manual", () => {
  const state = buildGlobalState();
  assert.ok(state.manual_decision_items.some((item) => item.active_or_resolved === "MANUAL_ADMIN_DECISION_REQUIRED"));
  assert.ok(state.manual_decision_items.some((item) => item.active_or_resolved === "MANUAL_FINANCIAL_DECISION_REQUIRED"));
});

test("history remains pending and repair remains forbidden", () => {
  const state = buildGlobalState();
  assert.equal(state.history_state, "HISTORY_ALIGNMENT_PENDING");
  assert.equal(state.migration_repair_allowed, "NO");
});

test("next safe group is security hardening while remote security drift remains", () => {
  const state = buildGlobalState();
  assert.equal(state.next_safe_group, "SECURITY_HARDENING");
  assert.ok(state.active_items.length > 0);
});

test("global state rejects production-ready flags", () => {
  const state = buildGlobalState();
  assert.doesNotThrow(() => validateGlobalState(state));
  assert.throws(() => validateGlobalState({ ...state, decision: "READY_TO_APPLY" }), /POST_PHASE34_DECISION_MISMATCH/);
});
