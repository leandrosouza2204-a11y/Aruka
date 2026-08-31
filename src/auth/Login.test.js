import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./Login.jsx", import.meta.url), "utf8");

test("login uses Supabase password auth before post-login routing", () => {
  const signInIndex = source.indexOf("supabase.auth.signInWithPassword");
  const claimIndex = source.indexOf("claimPendingStudentInvite({ optional: true })");
  const routeIndex = source.indexOf("resolverDestinoPosLogin()");

  assert.ok(signInIndex > -1, "password auth missing");
  assert.ok(claimIndex > signInIndex, "optional claim must only run after auth succeeds");
  assert.ok(routeIndex > claimIndex, "routing must happen after auth and optional claim");
});

test("login password visibility is accessible and preserves the input value", () => {
  assert.match(source, /const \[mostrarSenha, setMostrarSenha\] = useState\(false\)/);
  assert.match(source, /type=\{mostrarSenha \? "text" : "password"\}/);
  assert.match(source, /value=\{senha\}/);
  assert.match(source, /onClick=\{\(\) => setMostrarSenha\(!mostrarSenha\)\}/);
  assert.match(source, /aria-label=\{mostrarSenha \? "Ocultar senha" : "Mostrar senha"\}/);
  assert.match(source, /<EyeOff size=\{18\} aria-hidden="true" \/>/);
  assert.match(source, /<Eye size=\{18\} aria-hidden="true" \/>/);
});

test("forgot password requests official Supabase recovery without enumeration", () => {
  assert.match(source, /async function recuperarSenha\(e\)/);
  assert.match(source, /supabase\.auth\.resetPasswordForEmail\(email\.trim\(\), \{/);
  assert.match(source, /redirectTo: `\$\{window\.location\.origin\}\/redefinir-senha`/);
  assert.match(source, /Se existir uma conta com este e-mail, você receberá as instruções para redefinir sua senha\./);
  assert.doesNotMatch(source, /usu[aá]rio n[aã]o encontrado/i);
});

test("forgot password mode does not submit login or invite operations", () => {
  const recoveryIndex = source.indexOf("async function recuperarSenha(e)");
  const signupIndex = source.indexOf("async function cadastrar(e)");
  const recoveryBody = source.slice(recoveryIndex, signupIndex);

  assert.doesNotMatch(recoveryBody, /signInWithPassword|signUp|claimPendingStudentInvite|student-access-invite|inviteUserByEmail/);
  assert.match(source, /Esqueci minha senha/);
  assert.match(source, /Voltar para o login/);
});
