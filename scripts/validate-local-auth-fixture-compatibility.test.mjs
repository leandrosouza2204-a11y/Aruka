import test from "node:test";
import assert from "node:assert/strict";
import { QA_USERS, validateLocalQaAuthState } from "./lib/local-qa-auth-fixtures.mjs";

const baseRows = QA_USERS.map((user) => ({
  id: user.id,
  email: user.email,
  email_confirmed: true,
  has_password: false,
  role: user.role,
  tipo_acesso: user.tipoAcesso,
  status: user.status,
  domain_link_valid: true,
  gotrue_null_string_fields: 0,
  duplicate_auth_users: 1,
}));

test("accepts compatible local QA auth users without password values", () => {
  assert.equal(validateLocalQaAuthState(baseRows).ok, true);
});

test("fails when confirmation_token is null-compatible count", () => {
  const rows = withPatch("personal.cycle8@example.invalid", { gotrue_null_string_fields: 1 });
  assert.match(validateLocalQaAuthState(rows).errors.join("\n"), /GoTrue string NULL fields/);
});

test("fails when recovery_token is null-compatible count", () => {
  const rows = withPatch("admin.cycle8@example.invalid", { gotrue_null_string_fields: 1 });
  assert.match(validateLocalQaAuthState(rows).errors.join("\n"), /GoTrue string NULL fields/);
});

test("fails when email_change_token_new is null-compatible count", () => {
  const rows = withPatch("personal.cycle8@example.invalid", { gotrue_null_string_fields: 1 });
  assert.equal(validateLocalQaAuthState(rows).ok, false);
});

test("fails when email_change is null-compatible count", () => {
  const rows = withPatch("admin.cycle8@example.invalid", { gotrue_null_string_fields: 1 });
  assert.equal(validateLocalQaAuthState(rows).ok, false);
});

test("fails when QA user is missing", () => {
  const rows = baseRows.filter((row) => row.email !== "personal.cycle8@example.invalid");
  assert.match(validateLocalQaAuthState(rows).errors.join("\n"), /missing QA user/);
});

test("fails when duplicate QA user exists", () => {
  const rows = withPatch("personal.cycle8@example.invalid", { duplicate_auth_users: 2 });
  assert.match(validateLocalQaAuthState(rows).errors.join("\n"), /duplicate QA user/);
});

test("fails when role or domain link is wrong", () => {
  const rows = withPatch("admin.cycle8@example.invalid", {
    role: "user",
    domain_link_valid: false,
  });
  const errors = validateLocalQaAuthState(rows).errors.join("\n");

  assert.match(errors, /wrong role/);
  assert.match(errors, /invalid domain link/);
});

function withPatch(email, patch) {
  return baseRows.map((row) => row.email === email ? { ...row, ...patch } : row);
}
