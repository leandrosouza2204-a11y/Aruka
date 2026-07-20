import test from "node:test";
import assert from "node:assert/strict";
import { validateMergeBlocked, requiredPrChecksArgs, requiredValidationCheck } from "../lib/cycle-9-1-github-client.mjs";

test("identifies required validation check", () => {
  const check = requiredValidationCheck([{ name: "Supabase Local Quality Gates / validation", state: "failure", required: true }]);
  assert.equal(check.state, "failure");
});

test("builds required pr checks command with required flag outside json fields", () => {
  const args = requiredPrChecksArgs(4);
  assert.deepEqual(args, ["pr", "checks", "4", "--required", "--json", "name,state,bucket,workflow,link"]);
  assert.equal(args.includes("--required"), true);
  assert.equal(args.at(-1).split(",").includes("required"), false);
});

test("identifies validation check returned by gh pr checks --required", () => {
  const check = requiredValidationCheck(
    [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "FAILURE", bucket: "fail" }],
    { requiredBySelection: true },
  );
  assert.equal(check.name, "validation");
});

test("validates merge block caused by failed required check", () => {
  const result = validateMergeBlocked({
    pr: { state: "OPEN", headRefName: "test/cycle-9-1", mergeable: "UNKNOWN", mergeStateStatus: "BLOCKED" },
    checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "FAILURE", bucket: "fail" }],
    logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
    expectedHeadBranch: "test/cycle-9-1",
    checksRequiredBySelection: true,
  });
  assert.equal(result.blocked_by_required_check, true);
});

test("accepts failure indicated by bucket when state is not explicit", () => {
  const result = validateMergeBlocked({
    pr: { state: "OPEN", mergeStateStatus: "BLOCKED" },
    checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "completed", bucket: "fail" }],
    logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
    checksRequiredBySelection: true,
  });
  assert.equal(result.required_check_failed, true);
});

test("rejects pass check as negative evidence", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { state: "OPEN", mergeStateStatus: "BLOCKED" },
      checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "SUCCESS", bucket: "pass" }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
      checksRequiredBySelection: true,
    }),
    /Required validation check is not failed/,
  );
});

test("rejects pending check as negative evidence", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { state: "OPEN", mergeStateStatus: "BLOCKED" },
      checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "PENDING", bucket: "pending" }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
      checksRequiredBySelection: true,
    }),
    /Required validation check is not failed/,
  );
});

test("rejects missing validation check", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { state: "OPEN", mergeStateStatus: "BLOCKED" },
      checks: [{ name: "lint", workflow: "Supabase Local Quality Gates", state: "FAILURE", bucket: "fail" }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
      checksRequiredBySelection: true,
    }),
    /Required validation check is not failed/,
  );
});

test("preserves validation of open PR and controlled head branch", () => {
  assert.throws(
    () => validateMergeBlocked({
      pr: { state: "CLOSED", headRefName: "test/cycle-9-1", mergeStateStatus: "BLOCKED" },
      checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "FAILURE", bucket: "fail" }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
      expectedHeadBranch: "test/cycle-9-1",
      checksRequiredBySelection: true,
    }),
    /PR is not open/,
  );
  assert.throws(
    () => validateMergeBlocked({
      pr: { state: "OPEN", headRefName: "other", mergeStateStatus: "BLOCKED" },
      checks: [{ name: "validation", workflow: "Supabase Local Quality Gates", state: "FAILURE", bucket: "fail" }],
      logText: "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED",
      expectedHeadBranch: "test/cycle-9-1",
      checksRequiredBySelection: true,
    }),
    /head branch/,
  );
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
