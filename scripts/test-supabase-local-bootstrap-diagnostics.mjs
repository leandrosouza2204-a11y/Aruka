import { spawnSync } from "node:child_process";
import { chmodSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-bootstrap-diagnostics-${Date.now()}`);
const scriptPath = "scripts/supabase-local-bootstrap.ps1";

function writeFakeCommands() {
  const bin = join(tempRoot, "fake-bin");
  mkdirSync(bin, { recursive: true });

  const npxCmd = `@echo off
echo stdout before postgresql://postgres:secret@127.0.0.1:54322/postgres
echo stderr port is already allocated token=abc123 1>&2
exit /b %ARUKA_FAKE_SUPABASE_EXIT%
`;
  const npxSh = `#!/bin/sh
echo "stdout before postgresql://postgres:secret@127.0.0.1:54322/postgres"
echo "stderr port is already allocated token=abc123" >&2
exit "$ARUKA_FAKE_SUPABASE_EXIT"
`;

  writeFileSync(join(bin, "npx.cmd"), npxCmd, "utf8");
  writeFileSync(join(bin, "npx"), npxSh, "utf8");
  chmodSync(join(bin, "npx"), 0o755);
}

function copyFixture() {
  rmSync(tempRoot, { recursive: true, force: true });
  mkdirSync(join(tempRoot, "scripts"), { recursive: true });
  mkdirSync(join(tempRoot, "supabase/migrations"), { recursive: true });
  mkdirSync(join(tempRoot, "supabase/reference-baselines"), { recursive: true });
  cpSync(join(root, scriptPath), join(tempRoot, scriptPath));
  cpSync(
    join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"),
    join(tempRoot, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"),
  );
  for (const file of [
    "20260728030000_workout_delivery_integration_v1.sql",
    "20260730090000_student_identity_contract.sql",
    "20260731190000_reconcile_security_policies_and_grants.sql",
    "20260801143335_reconcile_alunos_required_fields.sql",
    "20260801173000_revoke_aoe_idempotency_anon_execute.sql",
    "20260801180000_harden_workout_templates_updated_at.sql",
  ]) {
    cpSync(join(root, "supabase/migrations", file), join(tempRoot, "supabase/migrations", file));
  }
  writeFileSync(join(tempRoot, "scripts/supabase-local-preflight.ps1"), "Write-Output 'PREFLIGHT_OK'\nexit 0\n", "utf8");
  writeFileSync(join(tempRoot, "scripts/supabase-local-validate.ps1"), "Write-Output 'LOCAL_RUNTIME_VALIDATED'\nexit 0\n", "utf8");
  writeFakeCommands();
}

function runBootstrap(exitCode) {
  const powershell = process.platform === "win32" ? "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe" : "pwsh";
  const separator = process.platform === "win32" ? ";" : ":";
  const bin = join(tempRoot, "fake-bin");
  return spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", scriptPath], {
    cwd: tempRoot,
    encoding: "utf8",
    shell: false,
    env: {
      ...process.env,
      PATH: `${bin}${separator}${process.env.PATH}`,
      ARUKA_FAKE_SUPABASE_EXIT: String(exitCode),
    },
  });
}

function combinedOutput(result) {
  return `${result.stdout ?? ""}\n${result.stderr ?? ""}\n${result.error?.message ?? ""}`;
}

function expectBootstrapReject(name, mutate, expectedMessage) {
  copyFixture();
  mutate();
  const result = runBootstrap(0);
  const output = combinedOutput(result);
  if (result.status === 0) throw new Error(`${name} was accepted`);
  if (!output.includes(expectedMessage)) throw new Error(`${name} rejected with unexpected output: ${output}`);
}

try {
  copyFixture();

  const success = runBootstrap(0);
  if (success.status !== 0) throw new Error(`bootstrap success fixture failed: ${combinedOutput(success)}`);
  if (!success.stdout.includes("LOCAL_BOOTSTRAP_OK")) throw new Error("bootstrap success fixture did not continue after supabase start");
  if (!success.stdout.includes("EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=7")) throw new Error("bootstrap success fixture did not materialize baseline ephemerally");
  if (!success.stdout.includes("BOOTSTRAP_TEMP_BASELINE_PRESENT_AFTER_RUN=NO")) throw new Error("bootstrap success fixture did not clean temporary baseline");
  if (readFileSync(join(tempRoot, "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql"), "utf8").length === 0) {
    throw new Error("fixture migration unexpectedly empty");
  }

  const failure = runBootstrap(1);
  const output = combinedOutput(failure);
  if (failure.status === 0) throw new Error("bootstrap failure fixture was accepted");
  for (const marker of [
    "SUPABASE_START_COMMAND=npx -y supabase@2.109.1 start",
    "SUPABASE_START_EXIT_CODE=1",
    "SUPABASE_START_STDOUT_BEGIN",
    "SUPABASE_START_STDOUT_END",
    "SUPABASE_START_STDERR_BEGIN",
    "SUPABASE_START_STDERR_END",
    "SUPABASE_START_FAILED",
  ]) {
    if (!output.includes(marker)) throw new Error(`missing diagnostic marker: ${marker}`);
  }
  if (!output.includes("port is already allocated")) throw new Error("operational stderr was not preserved");
  if (output.includes("postgres:secret")) throw new Error("database URL password was not sanitized");
  if (output.includes("token=abc123")) throw new Error("token value was not sanitized");

  const log = readFileSync(join(tempRoot, "reports/supabase-local-bootstrap/bootstrap-output.log"), "utf8");
  if (!log.includes("SUPABASE_START_EXIT_CODE=1")) throw new Error("diagnostic log did not preserve exit code");
  if (!output.includes("BOOTSTRAP_TEMP_BASELINE_PRESENT_AFTER_RUN=NO")) throw new Error("bootstrap failure fixture did not clean temporary baseline");

  expectBootstrapReject(
    "missing_reference_baseline",
    () => rmSync(join(tempRoot, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), { force: true }),
    "BLOCKED_REFERENCE_BASELINE_INTEGRITY",
  );
  expectBootstrapReject(
    "changed_reference_baseline",
    () => writeFileSync(join(tempRoot, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), "-- changed\n", "utf8"),
    "BLOCKED_REFERENCE_BASELINE_INTEGRITY",
  );
  expectBootstrapReject(
    "missing_incremental_migration",
    () => rmSync(join(tempRoot, "supabase/migrations/20260730090000_student_identity_contract.sql"), { force: true }),
    "BLOCKED_EPHEMERAL_BOOTSTRAP_ORDER",
  );
  expectBootstrapReject(
    "extra_incremental_migration",
    () => writeFileSync(join(tempRoot, "supabase/migrations/20260717000000_extra.sql"), "select 1;\n", "utf8"),
    "BLOCKED_EPHEMERAL_BOOTSTRAP_ORDER",
  );

  console.log("SUPABASE_LOCAL_BOOTSTRAP_DIAGNOSTICS_VALIDATED");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
