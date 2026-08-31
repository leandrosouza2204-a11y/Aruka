import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./DefinirSenhaForm.jsx", import.meta.url), "utf8");

test("create password links pending student invite before redirecting to student area", () => {
  const updateUserIndex = source.indexOf("supabase.auth.updateUser");
  const claimIndex = source.indexOf("claimPendingStudentInvite()");
  const redirectIndex = source.indexOf('navigate("/minha-area"');

  assert.ok(updateUserIndex > -1, "password update missing");
  assert.ok(claimIndex > updateUserIndex, "claim must happen after password update");
  assert.ok(redirectIndex > claimIndex, "student redirect must happen after linking");
  assert.doesNotMatch(source, /navigate\("\/dashboard"/);
});

test("post-password claim failure exposes claim-only retry", () => {
  const updateUserCalls = Array.from(source.matchAll(/supabase\.auth\.updateUser/g));
  const claimCalls = Array.from(source.matchAll(/claimPendingStudentInvite\(\)/g));
  const retryIndex = source.indexOf("async function concluirAcesso()");
  const retryBody = source.slice(retryIndex, source.indexOf("if (senhaCriada && falhaVinculo)"));

  assert.equal(updateUserCalls.length, 1, "password update must only exist in the create-password submit path");
  assert.ok(claimCalls.length >= 2, "claim must be callable during password creation and retry");
  assert.ok(retryIndex > -1, "claim retry handler missing");
  assert.match(source, /setSenhaCriada\(true\)/);
  assert.match(source, /setFalhaVinculo\(true\)/);
  assert.match(source, /Concluir acesso/);
  assert.match(source, /type="button"/);
  assert.doesNotMatch(retryBody, /updateUser|resetPasswordForEmail|inviteUserByEmail|student-access-invite/);
  assert.match(retryBody, /supabase\.auth\.getUser\(\)/);
  assert.match(retryBody, /claimPendingStudentInvite\(\)/);
  assert.match(retryBody, /Sua sessão expirou\. Entre novamente para concluir seu acesso\./);
  assert.match(retryBody, /navigate\("\/minha-area", \{ replace: true \}\)/);
});

test("password update failure keeps normal password flow and skips claim", () => {
  const updateErrorIndex = source.indexOf("if (error) throw error;");
  const passwordCreatedIndex = source.indexOf("setSenhaCriada(true)");
  const claimIndex = source.indexOf("await claimPendingStudentInvite();");

  assert.ok(updateErrorIndex > -1, "password update error guard missing");
  assert.ok(updateErrorIndex < passwordCreatedIndex, "password-created state must only be set after update success");
  assert.ok(updateErrorIndex < claimIndex, "claim must not run after password update failure");
});
