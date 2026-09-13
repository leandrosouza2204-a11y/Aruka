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
  assert.match(routeSource, /catch \{\s*return null;/);
  assert.match(routeSource, /Link invalido ou expirado/);
  assert.match(routeSource, /<Link to="\/login"/);
  assert.match(routeSource, /Solicitar novo link/);
  assert.match(routeSource, /clearAuthErrorHash\(\)/);
});

test("recovery callback never reopens the one-time Supabase verify URL", () => {
  assert.equal(Array.from(routeSource.matchAll(/exchangeCodeForSession/g)).length, 1);
  assert.doesNotMatch(routeSource, /auth\/v1\/verify|verifyOtp/);
  assert.doesNotMatch(routeSource, /location\.(href|assign|replace)|history\.(back|go)|navigate\(/);
});
