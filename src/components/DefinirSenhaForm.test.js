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
