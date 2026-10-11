import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const initializer = path.resolve("scripts", "initialize-aruka-recovery-credentials.ps1");
const policyModule = path.resolve("scripts", "lib", "aruka-recovery-credential-policy.psm1");
const projectRef = "vrizeuhuhvtvbrmtvdik";

function jwt(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.synthetic-signature`;
}

function validate({ anonRole = "anon", anonRef = projectRef, userRole = "authenticated", issuerRef = projectRef, expOffset = 3600 } = {}) {
  const anon = jwt({ role: anonRole, ref: anonRef });
  const access = jwt({ role: userRole, sub: "synthetic-user", exp: Math.floor(Date.now() / 1000) + expOffset, iss: `https://${issuerRef}.supabase.co/auth/v1` });
  const command = "Import-Module -Name $env:POLICY_MODULE -Force; Assert-ArukaRlsSessionCredentials -ProjectRef $env:PROJECT_REF -LegacyAnonKey $env:SYNTHETIC_ANON -UserAccessToken $env:SYNTHETIC_ACCESS | ConvertTo-Json -Compress";
  return spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
    encoding: "utf8",
    env: { ...process.env, POLICY_MODULE: policyModule, PROJECT_REF: projectRef, SYNTHETIC_ANON: anon, SYNTHETIC_ACCESS: access },
  });
}

test("RLS mode derives access key id from project ref and uses explicit prompts", () => {
  const source = fs.readFileSync(initializer, "utf8");
  assert.doesNotMatch(source, /Read-Host 'Storage access key id'/u);
  assert.match(source, /\$accessKeyText = if \(\$StorageMode -eq "RLS_SESSION_TOKEN"\) \{ \$ExpectedProjectRef \}/u);
  assert.match(source, /Supabase legacy anon key for S3 session authentication/u);
  assert.match(source, /Current authenticated user access token JWT \(not the refresh token\)/u);
});

test("synthetic valid anon key and authenticated access token are accepted", () => {
  const result = validate();
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(result.stdout);
  assert.equal(report.Status, "PASS");
  assert.equal(report.AccessKeyIdSource, "PROJECT_REF");
  assert.equal(report.SecretValuesPrinted, false);
});

test("synthetic service role key is rejected", () => {
  const result = validate({ anonRole: "service_role" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /LEGACY_ANON_KEY_ROLE_INVALID/u);
});

test("synthetic expired user access token is rejected", () => {
  const result = validate({ expOffset: -60 });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /USER_ACCESS_TOKEN_EXPIRED/u);
});

test("synthetic access token from another project is rejected", () => {
  const result = validate({ issuerRef: "abcdefghijklmnopqrst" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /USER_ACCESS_TOKEN_PROJECT_MISMATCH/u);
});

test("publishable key is explicitly rejected for S3 session authentication", () => {
  const access = jwt({ role: "authenticated", sub: "synthetic-user", exp: Math.floor(Date.now() / 1000) + 3600, iss: `https://${projectRef}.supabase.co/auth/v1` });
  const command = "Import-Module -Name $env:POLICY_MODULE -Force; Assert-ArukaRlsSessionCredentials -ProjectRef $env:PROJECT_REF -LegacyAnonKey $env:SYNTHETIC_ANON -UserAccessToken $env:SYNTHETIC_ACCESS | Out-Null";
  const result = spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
    encoding: "utf8",
    env: { ...process.env, POLICY_MODULE: policyModule, PROJECT_REF: projectRef, SYNTHETIC_ANON: "sb_publishable_synthetic", SYNTHETIC_ACCESS: access },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /PUBLISHABLE_KEY_NOT_SUPPORTED_FOR_S3_SESSION_AUTH/u);
});

test("opaque refresh-token-shaped value is rejected as the session token", () => {
  const anon = jwt({ role: "anon", ref: projectRef });
  const command = "Import-Module -Name $env:POLICY_MODULE -Force; Assert-ArukaRlsSessionCredentials -ProjectRef $env:PROJECT_REF -LegacyAnonKey $env:SYNTHETIC_ANON -UserAccessToken $env:SYNTHETIC_ACCESS | Out-Null";
  const result = spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", command], {
    encoding: "utf8",
    env: { ...process.env, POLICY_MODULE: policyModule, PROJECT_REF: projectRef, SYNTHETIC_ANON: anon, SYNTHETIC_ACCESS: "synthetic-refresh-token" },
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /JWT_FORMAT_INVALID/u);
});
