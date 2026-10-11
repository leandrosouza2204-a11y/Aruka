import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = path.resolve();
const modulePath = path.join(root, "scripts", "lib", "aruka-postgres-preflight-diagnostics.psm1");
const probePath = path.join(root, "scripts", "lib", "aruka-postgres-snapshot-probe.sh");
const authProbePath = path.join(root, "scripts", "lib", "aruka-postgres-auth-probe.sh");
const proxyPath = path.join(root, "scripts", "lib", "aruka-restricted-tcp-proxy.sh");
const syntheticServerPath = path.join(root, "scripts", "lib", "aruka-synthetic-postgres-server.sh");
const probe = fs.readFileSync(probePath, "utf8");
const authProbe = fs.readFileSync(authProbePath, "utf8");
const proxy = fs.readFileSync(proxyPath, "utf8");
const syntheticServer = fs.readFileSync(syntheticServerPath, "utf8");

function powershell(script) {
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", script], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

test("snapshot identifiers accept PostgreSQL hexadecimal format", () => {
  const escaped = modulePath.replaceAll("'", "''");
  const output = powershell(`Import-Module '${escaped}' -Force; @(
    Test-ArukaPostgresSnapshotId '00000003-0000001B-1';
    Test-ArukaPostgresSnapshotId '00000003-0000001b-42';
    Test-ArukaPostgresSnapshotId 'invalid-snapshot'
  ) | ConvertTo-Json`);
  assert.deepEqual(JSON.parse(output), [true, true, false]);
});

test("stderr is reduced to sanitized failure categories", () => {
  const escaped = modulePath.replaceAll("'", "''");
  const output = powershell(`Import-Module '${escaped}' -Force; @(
    Get-ArukaPostgresFailureCategory -Phase CONNECT -ExitCode 2 -StandardError 'could not translate host name';
    Get-ArukaPostgresFailureCategory -Phase CONNECT -ExitCode 2 -StandardError 'password authentication failed for user synthetic';
    Get-ArukaPostgresFailureCategory -Phase CONNECT -ExitCode 2 -StandardError 'SSL error synthetic';
    Get-ArukaPostgresFailureCategory -Phase CONNECT -ExitCode 2 -StandardError 'Tenant or user not found';
    Get-ArukaPostgresFailureCategory -Phase CONNECT -ExitCode 2 -StandardError 'FATAL synthetic rejection';
    Get-ArukaPostgresFailureCategory -Phase SNAPSHOT_EXPORT -ExitCode 3 -StandardError 'synthetic unknown';
    Get-ArukaPostgresFailureCategory -Phase SNAPSHOT_IMPORT -ExitCode 3 -StandardError 'synthetic unknown';
    Get-ArukaPostgresFailureCategory -Phase KEEPER -ExitCode 3 -KeeperRunning $false
  ) | ConvertTo-Json`);
  assert.deepEqual(JSON.parse(output), [
    "DNS_FAILURE",
    "AUTHENTICATION_FAILED",
    "TLS_NEGOTIATION_FAILED",
    "POOLER_IDENTITY_INVALID",
    "SERVER_REJECTED_CONNECTION",
    "SNAPSHOT_EXPORT_FAILED",
    "SNAPSHOT_IMPORT_FAILED",
    "KEEPER_EXITED_PREMATURELY",
  ]);
  assert.doesNotMatch(output, /synthetic|password|user/u);
});

test("probe separates connect, export and import while enforcing read-only TLS", () => {
  assert.match(probe, /PGSSLMODE=require/u);
  assert.match(probe, /begin transaction read only;/iu);
  assert.match(probe, /begin transaction isolation level repeatable read read only;/iu);
  assert.match(probe, /select pg_export_snapshot\(\);/u);
  assert.match(probe, /set transaction snapshot/u);
  assert.match(probe, /SNAPSHOT_EXPORT=PASS/u);
  assert.match(probe, /SNAPSHOT_IMPORT=PASS/u);
  assert.match(probe, /\^\[0-9A-Fa-f\]\+-\[0-9A-Fa-f\]\+-\[0-9\]\+\$/u);
  assert.doesNotMatch(probe, /pg_sleep/u);
  assert.doesNotMatch(probe, /cat\s+\/tmp\/.*\.err/u);
});

test("credential probe performs one read-only authentication without snapshot operations", () => {
  assert.match(authProbe, /PGSSLMODE=require/u);
  assert.match(authProbe, /begin transaction read only;/iu);
  assert.match(authProbe, /DATABASE_AUTHENTICATION=PASS/u);
  assert.match(authProbe, /SECRET_VALUES_PRINTED=false/u);
  assert.equal((authProbe.match(/\bpsql\b/gu) || []).length, 1);
  assert.doesNotMatch(authProbe, /pg_export_snapshot|set transaction snapshot|pg_dump/iu);
  assert.doesNotMatch(authProbe, /cat\s+\/tmp\/.*\.err/u);
});

test("proxy wrapper forwards only to validated numeric target coordinates", () => {
  assert.match(proxy, /TARGET_IP/u);
  assert.match(proxy, /TARGET_PORT/u);
  assert.match(proxy, /exec nc "\$TARGET_IP" "\$TARGET_PORT"/u);
  assert.doesNotMatch(proxy, /curl|wget|powershell|http/iu);
});

test("synthetic PostgreSQL target enables TLS without external dependencies", () => {
  assert.match(syntheticServer, /initdb/u);
  assert.match(syntheticServer, /ssl=on/u);
  assert.match(syntheticServer, /15432/u);
  assert.doesNotMatch(syntheticServer, /curl|wget|https?:\/\//iu);
});
