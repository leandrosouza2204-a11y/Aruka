import test from "node:test";
import assert from "node:assert/strict";
import { validateMergeBlocked, requiredValidationCheck } from "../lib/cycle-9-1-github-client.mjs";

test("identifies required validation check", () => {
  const check = requiredValidationCheck([{ name: "Supabase Local Quality Gates / validation", state: "failure", required: true }]);
  assert.equal(check.state, "failure");
});

test("validates merge block caused by failed required check", () => {
  const result = validateMergeBlocked({
    pr: { mergeable: "UNKNOWN", mergeStateStatus: "BLOCKED" },
    checks: [{ name: "Supabase Local Quality Gates / validation", state: "failure", required: true }],
    logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
  });
  assert.equal(result.blocked_by_required_check, true);
});

test("rejects conflict as different blocking cause", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { mergeable: "CONFLICTING", mergeStateStatus: "DIRTY" },
      checks: [{ name: "Supabase Local Quality Gates / validation", state: "failure", required: true }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
    }),
    /conflict/,
  );
});

test("rejects failure without controlled marker", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { mergeStateStatus: "BLOCKED" },
      checks: [{ name: "Supabase Local Quality Gates / validation", state: "failure", required: true }],
      logText: "ordinary failure",
    }),
    /Controlled failure marker/,
  );
});
