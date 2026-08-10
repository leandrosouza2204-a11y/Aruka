import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyAoeAnonExecute,
  classifyBodyDiff,
  classifyOverload,
  isMigrationCandidate,
  validateReadonlySql,
} from "./analyze-supabase-function-scope-review.mjs";

test("overload with caller is kept for compatibility", () => {
  assert.equal(
    classifyOverload({
      callerCount: 1,
      localFunctionCalls: 0,
      triggerCalls: 0,
      hasAuthenticatedGrant: true,
      modernReplacementEquivalent: true,
    }),
    "KEEP_REMOTE_COMPATIBILITY_OVERLOAD",
  );
});

test("overload without caller becomes deprecate-later candidate", () => {
  assert.equal(
    classifyOverload({
      callerCount: 0,
      localFunctionCalls: 0,
      triggerCalls: 0,
      hasAuthenticatedGrant: false,
      modernReplacementEquivalent: true,
    }),
    "DEPRECATE_REMOTE_OVERLOAD_LATER",
  );
});

test("body diff without full remote definition requires evidence", () => {
  assert.equal(
    classifyBodyDiff({
      category: "ADMIN",
      remoteDefinitionComplete: false,
      sameBodyExceptSearchPath: false,
    }),
    "EVIDENCE_REQUIRED",
  );
});

test("utility same body with safer search path is security hardening", () => {
  assert.equal(
    classifyBodyDiff({
      category: "UTILITY",
      remoteDefinitionComplete: true,
      sameBodyExceptSearchPath: true,
    }),
    "SECURITY_HARDENING_REQUIRED",
  );
});

test("anon execute without anonymous caller is excess", () => {
  assert.equal(
    classifyAoeAnonExecute({ anonGrant: true, anonymousCallerCount: 0 }),
    "AOE_ANON_EXECUTE_EXCESS_CONFIRMED",
  );
});

test("student identity remains deferred", () => {
  assert.equal(
    classifyBodyDiff({
      category: "STUDENT_IDENTITY",
      remoteDefinitionComplete: false,
      sameBodyExceptSearchPath: false,
    }),
    "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT",
  );
});

test("financial non-utility decision is not a migration candidate", () => {
  assert.equal(
    isMigrationCandidate({
      decision: "DEPRECATE_REMOTE_OVERLOAD_LATER",
      evidence_complete: true,
      caller_analysis_complete: true,
      security_analysis_complete: true,
      rollback_defined: true,
      tests_possible: true,
    }),
    false,
  );
});

test("incomplete definition is not a candidate", () => {
  assert.equal(
    isMigrationCandidate({
      decision: "SECURITY_HARDENING_REQUIRED",
      evidence_complete: false,
      caller_analysis_complete: true,
      security_analysis_complete: true,
      rollback_defined: true,
      tests_possible: true,
    }),
    false,
  );
});

test("readonly SQL validator rejects writes and accepts SELECT", () => {
  assert.equal(validateReadonlySql("select * from pg_proc"), true);
  assert.equal(validateReadonlySql("revoke execute on function public.x() from anon"), false);
});
