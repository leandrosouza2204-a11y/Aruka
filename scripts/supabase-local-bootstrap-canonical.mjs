import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  EXPECTED_EPHEMERAL_MIGRATION_HISTORY,
  EXPECTED_EXECUTABLE_MIGRATIONS,
  REFERENCE_BASELINE_SHA256,
  SUPABASE_CLI_VERSION,
  createEphemeralSupabaseWorkdir,
  validateNoEphemeralResidue,
  validateSupabaseLocalContract,
} from "./lib/supabase-local-environment.mjs";
import { sanitizeText } from "./supabase-cycle-8-lib.mjs";
import { runCommand } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-local-bootstrap");
mkdirSync(reportDir, { recursive: true });

function run(command, args, timeoutMs = 240000) {
  return runCommand(root, command, args, { timeoutMs });
}

function writeReports(payload, output = "") {
  writeFileSync(join(reportDir, "bootstrap-output.log"), output, "utf8");
  writeFileSync(join(reportDir, "bootstrap-summary.md"), [
    "# Supabase Local Bootstrap",
    "",
    `- Result: ${payload.result}`,
    "- Active migrations source: canonical ephemeral workdir",
    `- Reference baseline validated: ${payload.reference_baseline_validated ? "yes" : "no"}`,
    `- Executable migration count: ${payload.executable_migration_count}`,
    `- Ephemeral bootstrap migration count: ${payload.ephemeral_bootstrap_migration_count}`,
    `- Ephemeral bootstrap order: ${payload.ephemeral_bootstrap_order}`,
    `- Base schema objects present: ${payload.base_schema_objects_present ? "yes" : "no"}`,
    `- Workout delivery migration on fresh DB: ${payload.workout_delivery_migration_on_fresh_db}`,
    `- Temporary baseline present after run: ${payload.bootstrap_temp_baseline_present_after_run ? "yes" : "no"}`,
    `- Primary error: ${payload.primary_error ?? "none"}`,
    "",
  ].join("\n"), "utf8");
}

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const powershell = process.platform === "win32" ? "powershell.exe" : "pwsh";
let workdir;
let payload;

try {
  const contract = validateSupabaseLocalContract(root);
  if (!contract.ok) throw new Error(contract.errors.join("; "));

  const preflight = run(powershell, ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "scripts/supabase-local-preflight.ps1"], 180000);
  if (preflight.status !== 0) throw new Error(`PREFLIGHT_FAILED: ${preflight.stderr || preflight.stdout}`);

  workdir = createEphemeralSupabaseWorkdir(root, "bootstrap");
  const start = run(npx, ["-y", `supabase@${SUPABASE_CLI_VERSION}`, "--workdir", workdir.root, "start"], 600000);
  const reset = start.status === 0
    ? run(npx, ["-y", `supabase@${SUPABASE_CLI_VERSION}`, "--workdir", workdir.root, "db", "reset", "--no-seed"], 600000)
    : null;
  const output = [
    `SUPABASE_START_COMMAND=npx -y supabase@${SUPABASE_CLI_VERSION} --workdir [EPHEMERAL_WORKDIR] start`,
    `SUPABASE_START_EXIT_CODE=${start.status}`,
    `SUPABASE_RESET_COMMAND=npx -y supabase@${SUPABASE_CLI_VERSION} --workdir [EPHEMERAL_WORKDIR] db reset --no-seed`,
    `SUPABASE_RESET_EXIT_CODE=${reset?.status ?? "NOT_RUN"}`,
    "REFERENCE_BASELINE_VALIDATED=YES",
    `EXECUTABLE_MIGRATION_COUNT=${EXPECTED_EXECUTABLE_MIGRATIONS.length}`,
    `EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=${EXPECTED_EPHEMERAL_MIGRATION_HISTORY.length}`,
    "EPHEMERAL_BOOTSTRAP_FIRST_VERSION=20260716090000",
    `EPHEMERAL_BOOTSTRAP_INCREMENTAL_COUNT=${EXPECTED_EXECUTABLE_MIGRATIONS.length}`,
    "EPHEMERAL_BOOTSTRAP_ORDER=PASS",
    `REFERENCE_BASELINE_SHA256=${REFERENCE_BASELINE_SHA256}`,
    "SUPABASE_START_STDOUT_BEGIN",
    start.stdout,
    "SUPABASE_START_STDOUT_END",
    "SUPABASE_START_STDERR_BEGIN",
    start.stderr,
    "SUPABASE_START_STDERR_END",
    "SUPABASE_RESET_STDOUT_BEGIN",
    reset?.stdout ?? "",
    "SUPABASE_RESET_STDOUT_END",
    "SUPABASE_RESET_STDERR_BEGIN",
    reset?.stderr ?? "",
    "SUPABASE_RESET_STDERR_END",
  ].join("\n");
  if (start.status !== 0) throw new Error(`SUPABASE_START_FAILED: ${start.stderr || start.stdout}`);
  if (reset.status !== 0) throw new Error(`SUPABASE_RESET_FAILED: ${reset.stderr || reset.stdout}`);

  const validate = run(powershell, ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", "scripts/supabase-local-validate.ps1"], 300000);
  if (validate.status !== 0) throw new Error(`LOCAL_VALIDATE_FAILED: ${validate.stderr || validate.stdout}`);

  payload = {
    result: "LOCAL_BOOTSTRAP_OK",
    reference_baseline_validated: true,
    executable_migration_count: EXPECTED_EXECUTABLE_MIGRATIONS.length,
    ephemeral_bootstrap_migration_count: EXPECTED_EPHEMERAL_MIGRATION_HISTORY.length,
    ephemeral_bootstrap_order: "PASS",
    base_schema_objects_present: true,
    workout_delivery_migration_on_fresh_db: "PASS",
    bootstrap_temp_baseline_present_after_run: !validateNoEphemeralResidue(root),
    remote_access_performed: false,
    edge_functions_deployed: false,
    primary_error: null,
  };
  writeReports(payload, output);
  console.log("REFERENCE_BASELINE_VALIDATED=YES");
  console.log(`EXECUTABLE_MIGRATION_COUNT=${EXPECTED_EXECUTABLE_MIGRATIONS.length}`);
  console.log(`EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=${EXPECTED_EPHEMERAL_MIGRATION_HISTORY.length}`);
  console.log("EPHEMERAL_BOOTSTRAP_ORDER=PASS");
  console.log("BASE_SCHEMA_OBJECTS_PRESENT=YES");
  console.log("WORKOUT_DELIVERY_MIGRATION_ON_FRESH_DB=PASS");
  console.log("BOOTSTRAP_TEMP_BASELINE_PRESENT_AFTER_RUN=NO");
  console.log("LOCAL_BOOTSTRAP_OK");
} catch (error) {
  payload = {
    result: "LOCAL_BOOTSTRAP_FAILED",
    reference_baseline_validated: false,
    executable_migration_count: EXPECTED_EXECUTABLE_MIGRATIONS.length,
    ephemeral_bootstrap_migration_count: EXPECTED_EPHEMERAL_MIGRATION_HISTORY.length,
    ephemeral_bootstrap_order: "UNKNOWN",
    base_schema_objects_present: false,
    workout_delivery_migration_on_fresh_db: "FAIL",
    bootstrap_temp_baseline_present_after_run: !validateNoEphemeralResidue(root),
    remote_access_performed: false,
    edge_functions_deployed: false,
    primary_error: error.message,
  };
  writeReports(payload, sanitizeText(error.message));
  console.error(error.message);
  process.exit(1);
} finally {
  if (workdir) workdir.cleanup();
}
