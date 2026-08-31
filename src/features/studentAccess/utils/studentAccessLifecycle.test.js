import test from "node:test";
import assert from "node:assert/strict";
import {
  getStudentAccessActions,
  getStudentBlockedState,
  normalizeStudentAccessState,
} from "./studentAccessLifecycle.js";

test("normalizes unknown status as not invited", () => {
  const access = normalizeStudentAccessState({ status: "weird" });
  assert.equal(access.status, "not_invited");
  assert.equal(access.label, "Nao liberado");
});

test("returns professional actions by lifecycle status", () => {
  assert.deepEqual(getStudentAccessActions({ status: "not_invited" }), ["invite"]);
  assert.deepEqual(getStudentAccessActions({ status: "invited" }), ["resend_invite"]);
  assert.deepEqual(getStudentAccessActions({ status: "active" }), ["suspend"]);
  assert.deepEqual(getStudentAccessActions({ status: "suspended" }), ["reactivate", "revoke"]);
  assert.deepEqual(getStudentAccessActions({ status: "revoked" }), ["invite"]);
  assert.deepEqual(getStudentAccessActions({ status: "revoked", hasStudentUser: true }), ["reactivate"]);
});

test("keeps pending invite separate from active linked access", () => {
  const pending = normalizeStudentAccessState({
    status: "invited",
    email: "aluno@example.com",
    hasStudentUser: false,
  });
  const active = normalizeStudentAccessState({
    status: "active",
    email: "aluno@example.com",
    hasStudentUser: true,
  });

  assert.equal(pending.label, "Convite enviado");
  assert.deepEqual(getStudentAccessActions(pending), ["resend_invite"]);
  assert.deepEqual(getStudentAccessActions(active), ["suspend"]);
});

test("requires linked account before activation from not invited state", () => {
  assert.deepEqual(
    getStudentAccessActions({ status: "not_invited", hasStudentUser: false }),
    ["invite"]
  );
  assert.deepEqual(
    getStudentAccessActions({ status: "not_invited", hasStudentUser: true }),
    ["activate"]
  );
});

test("maps suspended and revoked to student blocked states", () => {
  assert.equal(getStudentBlockedState({ studentAccess: { status: "active" } }).blocked, false);
  assert.equal(getStudentBlockedState({ studentAccess: { status: "suspended" } }).blocked, true);
  assert.equal(getStudentBlockedState({ studentAccess: { status: "revoked" } }).blocked, true);
});
