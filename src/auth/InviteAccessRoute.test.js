import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const routeSource = readFileSync(new URL("./InviteAccessRoute.jsx", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../App.jsx", import.meta.url), "utf8");
const clientSource = readFileSync(new URL("../services/supabase.js", import.meta.url), "utf8");
const passwordFormSource = readFileSync(new URL("../components/DefinirSenhaForm.jsx", import.meta.url), "utf8");

test("invite redirect lands on create-password route without generic login guard", () => {
  assert.match(appSource, /path="\/criar-senha"/);
  assert.match(appSource, /<InviteAccessRoute>\s*<CriarSenha \/>\s*<\/InviteAccessRoute>/);
  assert.doesNotMatch(appSource, /path="\/criar-senha"[\s\S]{0,160}<ProtectedRoute>/);
});

test("create-password route waits for invite session bootstrap before deciding", () => {
  assert.match(routeSource, /const \[status, setStatus\] = useState\("loading"\)/);
  assert.match(routeSource, /supabase\.auth\.getSession\(\)/);
  assert.match(routeSource, /supabase\.auth\.onAuthStateChange/);
  assert.match(routeSource, /exchangeCodeForSession\(code\)/);
  assert.match(routeSource, /Carregando convite/);
  assert.doesNotMatch(routeSource, /Navigate|navigate\("\/login"|replaceState/);
});

test("direct unauthenticated create-password access shows safe expired invite state", () => {
  assert.match(routeSource, /status === "invalid"/);
  assert.match(routeSource, /Convite invalido ou expirado/);
  assert.match(routeSource, /Solicite um novo convite ao seu treinador/);
  const invalidStateCopy = [
    routeSource.match(/<strong>([^<]+)<\/strong>/)?.[1],
    routeSource.match(/<p style=\{messageText\}>\s*([^<]+)\s*<\/p>/)?.[1],
  ].join("\n");
  assert.doesNotMatch(invalidStateCopy, /Supabase|token|JWT|uuid|SQL/i);
});

test("browser Supabase client keeps invite session URL detection enabled", () => {
  assert.match(clientSource, /persistSession:\s*true/);
  assert.match(clientSource, /detectSessionInUrl:\s*true/);
  assert.match(clientSource, /autoRefreshToken:\s*true/);
  assert.doesNotMatch(clientSource, /SERVICE_ROLE|service_role/i);
});

test("password update still precedes claim and redirects to student area", () => {
  const updateUserIndex = passwordFormSource.indexOf("supabase.auth.updateUser");
  const claimIndex = passwordFormSource.indexOf("claimPendingStudentInvite()");
  const redirectIndex = passwordFormSource.indexOf('navigate("/minha-area"');

  assert.ok(updateUserIndex > -1, "password update missing");
  assert.ok(claimIndex > updateUserIndex, "claim must happen after password update");
  assert.ok(redirectIndex > claimIndex, "student redirect must happen after claim");
});
