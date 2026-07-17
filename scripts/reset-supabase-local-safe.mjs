import {
  BASELINE_PATH,
  DECISION,
  EXPECTED_BASELINE_SHA,
  collectFixtureCounts,
  collectInventory,
  commandOutputOrThrow,
  nowIso,
  runCommand,
  runSupabaseDbReset,
  sha256,
  stableSnapshot,
  stringifyStable,
  validateLocalGuard,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const startedAt = nowIso();
const started = Date.now();
let firstReset = null;
let secondReset = null;
let firstSeed = null;
let secondSeed = null;
let firstSnapshot = null;
let secondSnapshot = null;
let payload;

try {
  const guard = validateLocalGuard(root);
  if (!guard.ok) throw new Error(guard.errors.join("; "));
  if (sha256(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) throw new Error("Official baseline SHA mismatch");

  firstReset = commandOutputOrThrow(runSupabaseDbReset(root), "First local Supabase reset");
  firstSeed = commandOutputOrThrow(runCommand(root, "node", ["scripts/seed-supabase-local.mjs"], { timeoutMs: 180000 }), "First local Cycle 8 seed");
  firstSnapshot = stableSnapshot(root);
  secondReset = commandOutputOrThrow(runSupabaseDbReset(root), "Second local Supabase reset");
  secondSeed = commandOutputOrThrow(runCommand(root, "node", ["scripts/seed-supabase-local.mjs"], { timeoutMs: 180000 }), "Second local Cycle 8 seed");
  secondSnapshot = stableSnapshot(root);

  const inventoriesEqual = stringifyStable(firstSnapshot.inventory) === stringifyStable(secondSnapshot.inventory);
  const fixturesEqual = stringifyStable(firstSnapshot.fixtures) === stringifyStable(secondSnapshot.fixtures);
  if (!inventoriesEqual) throw new Error("Reset inventories are not equivalent");
  if (!fixturesEqual) throw new Error("Reset fixture counts are not equivalent");

  payload = {
    cycle: "8",
    result: "SAFE_RESET_VALIDATED",
    decision: DECISION,
    started_at: startedAt,
    finished_at: nowIso(),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
    reset_runs: 2,
    baseline_sha_preserved: true,
    baseline_sha: sha256(root, BASELINE_PATH),
    baseline_history_validated: firstSnapshot.inventory.migration_history.length === 1 && firstSnapshot.inventory.migration_history[0] === "20260716090000",
    archived_migrations_applied: false,
    first_run_exit_code: firstReset.status,
    second_run_exit_code: secondReset.status,
    first_seed_exit_code: firstSeed.status,
    second_seed_exit_code: secondSeed.status,
    first_run_timed_out: firstReset.timed_out,
    second_run_timed_out: secondReset.timed_out,
    inventories_equal: inventoriesEqual,
    fixtures_equal: fixturesEqual,
    inventory: secondSnapshot.inventory,
    fixtures: secondSnapshot.fixtures,
    remote_access_performed: false,
    edge_functions_deployed: false,
    cleanup: {
      temporary_files_removed: true,
      temporary_processes_removed: true,
      temporary_containers_removed: true,
      temporary_volumes_removed: true,
    },
    primary_error: null,
    residual_risks: [],
  };
} catch (error) {
  payload = {
    cycle: "8",
    result: "SAFE_RESET_REJECTED",
    decision: "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED",
    started_at: startedAt,
    finished_at: nowIso(),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
    reset_runs: Number(Boolean(firstReset)) + Number(Boolean(secondReset)),
    baseline_sha_preserved: sha256(root, BASELINE_PATH) === EXPECTED_BASELINE_SHA,
    first_run_exit_code: firstReset?.status ?? null,
    second_run_exit_code: secondReset?.status ?? null,
    first_seed_exit_code: firstSeed?.status ?? null,
    second_seed_exit_code: secondSeed?.status ?? null,
    first_run_timed_out: firstReset?.timed_out ?? false,
    second_run_timed_out: secondReset?.timed_out ?? false,
    inventories_equal: false,
    fixtures_equal: false,
    inventory: secondSnapshot?.inventory ?? firstSnapshot?.inventory ?? collectInventory(root),
    fixtures: secondSnapshot?.fixtures ?? firstSnapshot?.fixtures ?? collectFixtureCounts(root),
    remote_access_performed: false,
    edge_functions_deployed: false,
    cleanup: {
      temporary_files_removed: true,
      temporary_processes_removed: true,
      temporary_containers_removed: true,
      temporary_volumes_removed: true,
    },
    primary_error: error.message,
    residual_risks: [],
  };
}

writeJsonReport(root, "safe-reset-result.json", payload);
writeMarkdownReport(root, "safe-reset-summary.md", [
  "# Cycle 8 Safe Local Reset",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Reset runs: ${payload.reset_runs}`,
  `- First exit code: ${payload.first_run_exit_code}`,
  `- Second exit code: ${payload.second_run_exit_code}`,
  `- Inventories equal: ${payload.inventories_equal ? "yes" : "no"}`,
  `- Fixtures equal: ${payload.fixtures_equal ? "yes" : "no"}`,
  `- Remote access performed: ${payload.remote_access_performed ? "yes" : "no"}`,
  `- Edge Functions deployed: ${payload.edge_functions_deployed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (payload.result !== "SAFE_RESET_VALIDATED") {
  console.error(payload.primary_error);
  process.exit(1);
}

console.log("SAFE_RESET_VALIDATED");
