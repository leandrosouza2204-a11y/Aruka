import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const runnerPath = path.join(root, "scripts/invoke-aruka-g2-isolated-restore.ps1");
const validationPath = path.join(root, "scripts/sql/validate-aruka-g2-isolated-restore.sql");
const runner = fs.readFileSync(runnerPath, "utf8");
const validation = fs.readFileSync(validationPath, "utf8");

test("G2 restore runner pins an isolated non-published Docker target", () => {
  assert.match(runner, /--network", "none"/u);
  assert.doesNotMatch(runner, /(?:-p|--publish)\b/u);
  assert.match(runner, /\.HostConfig\.PortBindings/u);
  assert.match(runner, /RestartPolicy\.Name/u);
});

test("G2 restore runner validates both host and container dump bytes", () => {
  assert.match(runner, /Get-FileHash[^\n]+SHA256/u);
  assert.match(runner, /sha256sum/u);
  assert.match(runner, /containerSize -ne \$backupInfo\.Length/u);
  assert.match(runner, /--exit-on-error/u);
});

test("G2 restore runner preconfigures all required preload libraries", () => {
  assert.match(runner, /shared_preload_libraries='pg_stat_statements,pg_cron,pg_net'/u);
  assert.match(runner, /cron\.database_name=postgres/u);
  assert.match(runner, /pg_net\.database_name=postgres/u);
  assert.match(runner, /wal_level=logical/u);
});

test("G2 restore runner has no production connectivity or migration execution", () => {
  assert.doesNotMatch(runner, /supabase\s+(?:link|db push|migration up)/iu);
  assert.doesNotMatch(runner, /postgres(?:ql)?:\/\//iu);
  assert.doesNotMatch(runner, /PGPASSWORD|service_role_key|access_token/iu);
  assert.match(runner, /production_accessed = \$false/u);
});

test("G2 validation covers catalog objects, data, RLS and referential integrity", () => {
  assert.match(validation, /functions_without_extension_members/u);
  assert.match(validation, /critical_rows/u);
  assert.match(validation, /foreign_key_orphans/u);
  assert.match(validation, /invalid_indexes/u);
  assert.match(validation, /not_valid_constraints/u);
  assert.match(validation, /realtime_messages_payload_exclusive_violations/u);
  assert.match(validation, /rls_tables/u);
});
