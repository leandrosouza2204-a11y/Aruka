import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const routeSource = readFileSync(new URL("./PasswordRecoveryRoute.jsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.jsx", import.meta.url), "utf8");

test("password recovery route is separate from student invite route", () => {
  assert.match(appSource, /path="\/redefinir-senha"/);
  assert.match(appSource, /<PasswordRecoveryRoute>\s*<RedefinirSenha \/>\s*<\/PasswordRecoveryRoute>/);
  assert.doesNotMatch(routeSource, /claimPendingStudentInvite|CriarSenha|student-access-invite|inviteUserByEmail/);
});

test("password recovery route accepts existing or code-exchanged sessions", () => {
  assert.match(routeSource, /supabase\.auth\.getSession\(\)/);
  assert.match(routeSource, /exchangeCodeForSession\(code\)/);
  assert.match(routeSource, /Link invalido ou expirado/);
});
