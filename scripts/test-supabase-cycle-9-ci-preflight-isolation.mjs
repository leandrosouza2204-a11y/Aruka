import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-ci-preflight-${Date.now()}`);
const protectedRef = "xrmqdkpx" + "nfvusmenadnf";
const expectedSha = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";
const referenceBaselinePath = "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql";
const executableBaselinePath = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
const preflightScript = "scripts/supabase-local-preflight.ps1";

function copyFixture() {
  rmSync(tempRoot, { recursive: true, force: true });
  mkdirSync(join(tempRoot, "scripts"), { recursive: true });
  mkdirSync(join(tempRoot, "supabase/migrations"), { recursive: true });
  mkdirSync(join(tempRoot, "supabase/reference-baselines"), { recursive: true });
  cpSync(join(root, preflightScript), join(tempRoot, preflightScript));
  cpSync(join(root, "package.json"), join(tempRoot, "package.json"));
  cpSync(join(root, "supabase/config.toml"), join(tempRoot, "supabase/config.toml"));
  cpSync(join(root, referenceBaselinePath), join(tempRoot, referenceBaselinePath));
  for (const file of [
    "20260728030000_workout_delivery_integration_v1.sql",
    "20260730090000_student_identity_contract.sql",
    "20260731190000_reconcile_security_policies_and_grants.sql",
    "20260801143335_reconcile_alunos_required_fields.sql",
    "20260801173000_revoke_aoe_idempotency_anon_execute.sql",
    "20260801180000_harden_workout_templates_updated_at.sql",
    "20260811090000_student_tenure_contract_model.sql",
    "20260815120000_allow_zero_value_contract_renewal.sql",
    "20260816120000_preserve_acompanhamento_motivo_on_renewal.sql",
    "20260819090000_student_access_lifecycle.sql",
  ]) {
    cpSync(join(root, "supabase/migrations", file), join(tempRoot, "supabase/migrations", file));
  }
  cpSync(join(root, "supabase/migrations/cutover-manifest.json"), join(tempRoot, "supabase/migrations/cutover-manifest.json"));
  writeConfigProjectId("aruka_ci_test_1");
  writeFakeCommands();
}

function writeConfigProjectId(projectId) {
  const path = join(tempRoot, "supabase/config.toml");
  const text = readFileSync(path, "utf8").replace(/^project_id\s*=\s*"[^"]+"/m, `project_id = "${projectId}"`);
  writeFileSync(path, text, "utf8");
}

function writeTempProjectRef(value) {
  mkdirSync(join(tempRoot, "supabase/.temp"), { recursive: true });
  writeFileSync(join(tempRoot, "supabase/.temp/project-ref"), `${value}\n`, "utf8");
}

function writeFakeCommands() {
  const bin = join(tempRoot, "fake-bin");
  mkdirSync(bin, { recursive: true });
  const dockerCmd = `@echo off
if "%1"=="--version" echo Docker version 25.0.0& exit /b 0
if "%1"=="version" if "%ARUKA_FAKE_DOCKER_SERVER_DOWN%"=="true" exit /b 1
if "%1"=="version" (
  echo 25.0.0 25.0.0
  exit /b 0
)
if "%1"=="context" (
  if "%2"=="show" echo %ARUKA_FAKE_DOCKER_CONTEXT%
  exit /b 0
)
exit /b 0
`;
  const npxCmd = `@echo off
echo supabase 2.109.1
exit /b 0
`;
  const dockerSh = `#!/bin/sh
if [ "$1" = "--version" ]; then echo "Docker version 25.0.0"; exit 0; fi
if [ "$1" = "version" ]; then
  if [ "$ARUKA_FAKE_DOCKER_SERVER_DOWN" = "true" ]; then exit 1; fi
  echo "25.0.0 25.0.0"; exit 0
fi
if [ "$1" = "context" ] && [ "$2" = "show" ]; then echo "$ARUKA_FAKE_DOCKER_CONTEXT"; exit 0; fi
exit 0
`;
  const npxSh = `#!/bin/sh
echo "supabase 2.109.1"
exit 0
`;
  writeFileSync(join(bin, "docker.cmd"), dockerCmd, "utf8");
  writeFileSync(join(bin, "npx.cmd"), npxCmd, "utf8");
  writeFileSync(join(bin, "docker"), dockerSh, "utf8");
  writeFileSync(join(bin, "npx"), npxSh, "utf8");
  chmodSync(join(bin, "docker"), 0o755);
  chmodSync(join(bin, "npx"), 0o755);
}

function runPreflight(env = {}) {
  const powershell = process.platform === "win32" ? "powershell.exe" : "pwsh";
  const separator = process.platform === "win32" ? ";" : ":";
  const bin = join(tempRoot, "fake-bin");
  return spawnSync(powershell, ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", preflightScript], {
    cwd: tempRoot,
    encoding: "utf8",
    shell: false,
    env: {
      ...process.env,
      PATH: `${bin}${separator}${process.env.PATH}`,
      CI: "true",
      SUPABASE_CI_LOCAL_ONLY: "true",
      SUPABASE_PROJECT_ID: "aruka_ci_test_1",
      ARUKA_FAKE_DOCKER_CONTEXT: "default",
      ...env,
    },
  });
}

function readReport() {
  return JSON.parse(readFileSync(join(tempRoot, "reports/supabase-local-bootstrap/preflight-summary.json"), "utf8").replace(/^\uFEFF/, ""));
}

function expectReject(name, mutate, expectedError, env = {}) {
  copyFixture();
  mutate();
  const result = runPreflight(env);
  const report = readReport();
  const output = `${result.stdout}\n${result.stderr}`;
  if (result.status === 0) throw new Error(`${name} was accepted`);
  if (!report.errors.some((error) => error.includes(expectedError))) {
    throw new Error(`${name} rejected with unexpected errors: ${report.errors.join("; ")}`);
  }
  if (!output.includes("::error::")) throw new Error(`${name} did not emit GitHub Actions error annotations`);
}

try {
  copyFixture();
  const positive = runPreflight();
  const positiveReport = readReport();
  if (positive.status !== 0) throw new Error(`isolated CI preflight failed: ${positive.stdout}\n${positive.stderr}`);
  if (!positive.stdout.includes("PREFLIGHT_OK")) throw new Error("positive preflight did not print PREFLIGHT_OK");
  if (positiveReport.mode !== "isolated_ci") throw new Error("positive report mode is not isolated_ci");
  if (positiveReport.project_id !== "aruka_ci_test_1") throw new Error("positive report project_id mismatch");
  if (positiveReport.temp_project_ref_present !== false) throw new Error("positive preflight required a temp project-ref");
  if (positiveReport.baseline_sha256 !== expectedSha || positiveReport.baseline_sha_preserved !== true) throw new Error("positive baseline SHA was not preserved");
  if (positiveReport.executable_migration_count !== 10) throw new Error("positive executable migration count mismatch");
  if (positiveReport.reference_only_baseline_count !== 1) throw new Error("positive reference baseline count mismatch");
  if (positiveReport.total_database_change_artifact_count !== 11) throw new Error("positive total artifact count mismatch");
  if (positiveReport.remote_access_performed !== false || positiveReport.edge_functions_deployed !== false) throw new Error("positive report must record no remote access and no Edge Function deploy");

  expectReject("ci_without_local_only", () => {}, "CI preflight requires SUPABASE_CI_LOCAL_ONLY=true", { SUPABASE_CI_LOCAL_ONLY: "false" });
  expectReject("missing_ci_project_id", () => writeConfigProjectId(""), "CI SUPABASE_PROJECT_ID is missing", { SUPABASE_PROJECT_ID: "" });
  expectReject("protected_project_id", () => writeConfigProjectId(protectedRef), "Protected HML project ref is forbidden in isolated CI", { SUPABASE_PROJECT_ID: protectedRef });
  expectReject("bad_project_id_pattern", () => writeConfigProjectId("bad_project"), "CI SUPABASE_PROJECT_ID must match", { SUPABASE_PROJECT_ID: "bad_project" });
  expectReject("config_mismatch", () => writeConfigProjectId("aruka_ci_other"), "Config project_id does not match SUPABASE_PROJECT_ID");
  expectReject("protected_temp_project_ref", () => writeTempProjectRef(protectedRef), "Protected HML project ref is forbidden in isolated CI");
  expectReject("docker_server_down", () => {}, "Docker Server unavailable", { ARUKA_FAKE_DOCKER_SERVER_DOWN: "true" });
  expectReject("bad_docker_context", () => {}, "Docker context is not allowed for isolated CI", { ARUKA_FAKE_DOCKER_CONTEXT: "desktop-linux" });
  expectReject("baseline_missing", () => rmSync(join(tempRoot, referenceBaselinePath), { force: true }), "Missing official reference baseline");
  expectReject("baseline_changed", () => writeFileSync(join(tempRoot, referenceBaselinePath), "-- changed\n", "utf8"), "Official reference baseline SHA mismatch");
  expectReject("baseline_executable", () => writeFileSync(join(tempRoot, executableBaselinePath), "-- baseline\n", "utf8"), "Reference-only baseline must not be present in executable migrations");
  expectReject("missing_active_migration", () => rmSync(join(tempRoot, "supabase/migrations/20260730090000_student_identity_contract.sql"), { force: true }), "Expected active migration missing");
  expectReject("extra_active_migration", () => writeFileSync(join(tempRoot, "supabase/migrations/20260717000000_extra.sql"), "select 1;\n", "utf8"), "Unexpected active migration found");

  console.log("SUPABASE_CI_PREFLIGHT_ISOLATION_VALIDATED");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
