import {
  DECISION,
  collectFixtureCounts,
  collectInventory,
  commandOutputOrThrow,
  nowIso,
  runPsql,
  validateLocalGuard,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-8-lib.mjs";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const startedAt = nowIso();
const started = Date.now();
let payload;
const seedFiles = [
  "00-cleanup.sql",
  "10-structural-fixtures.sql",
  "20-admin-fixtures.sql",
  "30-student-fixtures.sql",
  "40-workout-fixtures.sql",
  "50-assessment-fixtures.sql",
  "60-financial-fixtures.sql",
  "70-aoe-fixtures.sql",
  "90-validation-fixtures.sql",
];

function loadSeedSql() {
  return seedFiles
    .map((file) => `\n-- Source: supabase/seeds/${file}\n${readFileSync(join(root, "supabase", "seeds", file), "utf8")}`)
    .join("\n");
}

try {
  const guard = validateLocalGuard(root);
  if (!guard.ok) throw new Error(guard.errors.join("; "));

  const before = collectFixtureCounts(root);
  const seed = runPsql(root, loadSeedSql(), { timeoutMs: 120000 });
  commandOutputOrThrow(seed, "Cycle 8 seed");
  const after = collectFixtureCounts(root);
  const inventory = collectInventory(root);

  payload = {
    cycle: "8",
    result: "LOCAL_SEED_LOADED",
    decision: DECISION,
    started_at: startedAt,
    finished_at: nowIso(),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
    baseline_sha_preserved: guard.baseline_sha,
    project_id: guard.project_id,
    seed_exit_code: seed.status,
    seed_timed_out: seed.timed_out,
    fixtures_loaded: true,
    before_counts: before,
    after_counts: after,
    inventory,
    remote_access_performed: false,
    edge_functions_deployed: false,
    primary_error: null,
  };
} catch (error) {
  payload = {
    cycle: "8",
    result: "LOCAL_SEED_REJECTED",
    decision: "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED",
    started_at: startedAt,
    finished_at: nowIso(),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
    fixtures_loaded: false,
    remote_access_performed: false,
    edge_functions_deployed: false,
    primary_error: error.message,
  };
}

writeJsonReport(root, "seed-run-result.json", payload);
writeMarkdownReport(root, "seed-run-summary.md", [
  "# Cycle 8 Local Seed Run",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Fixtures loaded: ${payload.fixtures_loaded ? "yes" : "no"}`,
  `- Remote access performed: ${payload.remote_access_performed ? "yes" : "no"}`,
  `- Edge Functions deployed: ${payload.edge_functions_deployed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (payload.result !== "LOCAL_SEED_LOADED") {
  console.error(payload.primary_error);
  process.exit(1);
}

console.log("LOCAL_SEED_LOADED");
