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
  cpSync(join(root, scriptPath), join(tempRoot, scriptPath));
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

try {
  copyFixture();

  const success = runBootstrap(0);
  if (success.status !== 0) throw new Error(`bootstrap success fixture failed: ${combinedOutput(success)}`);
  if (!success.stdout.includes("LOCAL_BOOTSTRAP_OK")) throw new Error("bootstrap success fixture did not continue after supabase start");

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

  console.log("SUPABASE_LOCAL_BOOTSTRAP_DIAGNOSTICS_VALIDATED");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
