import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./RedefinirSenhaForm.jsx", import.meta.url), "utf8");

test("recovery password form uses the same password policy and confirmation gates", () => {
  assert.match(source, /\(\?=\.\*\[a-z\]\)/);
  assert.match(source, /\(\?=\.\*\[A-Z\]\)/);
  assert.match(source, /\(\?=\.\*\\d\)/);
  assert.match(source, /\(\?=\.\*\[\\W_\]\)\.\{12,\}/);
  assert.match(source, /if \(!senhaValida\)/);
  assert.match(source, /if \(!confirmacaoValida\)/);
});

test("recovery password form requires a session and updates only the password", () => {
  const updateUserCalls = Array.from(source.matchAll(/supabase\.auth\.updateUser/g));

  assert.match(source, /supabase\.auth\.getUser\(\)/);
  assert.equal(updateUserCalls.length, 1);
  assert.match(source, /password: novaSenha/);
  assert.doesNotMatch(source, /claimPendingStudentInvite|resetPasswordForEmail|inviteUserByEmail|student-access-invite/);
});

test("recovery password form redirects to login after success", () => {
  assert.match(source, /Senha redefinida com sucesso\. Redirecionando para o login\.\.\./);
  assert.match(source, /navigate\("\/login", \{ replace: true \}\)/);
});

test("recovery password visibility is accessible and preserves values", () => {
  assert.match(source, /type=\{mostrar \? "text" : "password"\}/);
  assert.match(source, /value=\{value\}/);
  assert.match(source, /aria-label=\{`\$\{mostrar \? "Ocultar" : "Mostrar"\} \$\{label\.toLowerCase\(\)\}`\}/);
  assert.match(source, /<EyeOff size=\{18\} aria-hidden="true" \/>/);
  assert.match(source, /<Eye size=\{18\} aria-hidden="true" \/>/);
});
