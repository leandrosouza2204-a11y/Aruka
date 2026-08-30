import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./index.ts", import.meta.url), "utf8");

test("student invite edge function keeps service role server-side", () => {
  assert.match(source, /Deno\.env\.get\("SUPABASE_SERVICE_ROLE_KEY"\)/);
  assert.doesNotMatch(source, /VITE_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(source, /localStorage|sessionStorage/);
});

test("student invite validates JWT, ownership and linked account before provider call", () => {
  assert.match(source, /extractBearerToken\(authorization\)/);
  assert.match(source, /verifyAuthenticatedUser\(userClient, accessToken, env\.supabaseUrl\)/);
  assert.match(source, /userClient\.auth\.getUser\(accessToken\)/);
  assert.match(source, /\.eq\("id", alunoId\)/);
  assert.match(source, /\.eq\("user_id", user\.id\)/);
  assert.match(source, /if \(aluno\.student_user_id\)/);
  assert.match(source, /ALREADY_REGISTERED_UNLINKED/);
});

test("student invite can run behind handler-level JWT verification", () => {
  const config = readFileSync(new URL("../../config.toml", import.meta.url), "utf8");

  assert.match(config, /\[functions\.student-access-invite\]\s+verify_jwt = false/);
  assert.match(source, /if \(!accessToken\)/);
  assert.match(source, /return jsonResponse\(\{ error: "Sessao nao informada\." \}, 401, corsHeaders\)/);
  assert.match(source, /if \(!authResult\.ok\)/);
  assert.match(source, /return jsonResponse\(\{ error: "Sessao invalida\." \}, 401, corsHeaders\)/);
});

test("student invite validates JWT issuer and audience after auth verification", () => {
  assert.match(source, /decodeJwtPayload\(accessToken\)/);
  assert.match(source, /const expectedIssuer = `\$\{supabaseUrl\.replace\(\/\\\/\$\/, ""\)\}\/auth\/v1`/);
  assert.match(source, /claims\?\.iss !== expectedIssuer/);
  assert.match(source, /claims\?\.aud !== "authenticated"/);
});

test("student invite calls auth provider before persisting invite state", () => {
  const providerCall = source.indexOf("adminClient.auth.admin.inviteUserByEmail");
  const sendPersist = source.indexOf("persistNewInvite");
  const resendPersist = source.indexOf("persistResend");

  assert.ok(providerCall > -1, "provider call missing");
  assert.ok(providerCall < sendPersist, "send persists before provider accepts invite");
  assert.ok(providerCall < resendPersist, "resend persists before provider accepts invite");
});

test("student invite supports idempotent resend without duplicating aluno records", () => {
  assert.match(source, /action === "resend"/);
  assert.match(source, /\.eq\("student_access_status", "invited"\)/);
  assert.match(source, /\.is\("student_user_id", null\)/);
  assert.doesNotMatch(source, /\.insert\(/);
});

test("student invite redirect is not controlled by client body or arbitrary origin", () => {
  assert.doesNotMatch(source, /body\.redirect|redirectTo\s*:\s*body/);
  assert.match(source, /function allowedRequestOrigin\(req: Request\)/);
  assert.match(source, /function allowedInviteOrigins\(\)/);
  assert.match(source, /if \(!redirectTo\)/);
});
