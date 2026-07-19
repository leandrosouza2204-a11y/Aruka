import { readFileSync } from "node:fs";
import {
  BASELINE_PATH,
  DECISION,
  EXPECTED_BASELINE_SHA,
  collectFixtureCounts,
  collectInventory,
  nowIso,
  sha256CanonicalText,
  validateLocalGuard,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const startedAt = nowIso();
const errors = [];
const guard = validateLocalGuard(root);
if (!guard.ok) errors.push(...guard.errors);
if (sha256CanonicalText(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) errors.push("Baseline SHA mismatch");

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file} is missing or invalid: ${error.message}`);
    return null;
  }
}

const reset = readJson("reports/supabase-local-seeds/safe-reset-result.json");
const fixtures = readJson("reports/supabase-local-seeds/fixtures-result.json");
const negative = readJson("reports/supabase-local-seeds/negative-seeds-result.json");

if (reset?.result !== "SAFE_RESET_VALIDATED") errors.push("Safe reset is not validated");
if (fixtures?.result !== "DETERMINISTIC_FIXTURES_VALIDATED") errors.push("Fixtures are not validated");
if (negative?.result !== "SEED_MUTATIONS_REJECTED" || negative?.all_rejected !== true) errors.push("Negative seed tests did not reject all mutations");

const inventory = collectInventory(root);
const fixtureCounts = collectFixtureCounts(root);
const ok = errors.length === 0;
const payload = {
  cycle: "8",
  result: ok ? DECISION : "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED",
  decision: ok ? DECISION : "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED",
  started_at: startedAt,
  finished_at: nowIso(),
  baseline_sha: sha256CanonicalText(root, BASELINE_PATH),
  baseline_sha_preserved: sha256CanonicalText(root, BASELINE_PATH) === EXPECTED_BASELINE_SHA,
  migration_history: inventory.migration_history,
  structural_inventory: inventory.structure,
  fixture_counts: fixtureCounts,
  reset_result: reset?.result ?? null,
  fixtures_result: fixtures?.result ?? null,
  negative_result: negative?.result ?? null,
  idempotency_validated: fixtures?.idempotency_validated === true,
  real_personal_data_found: fixtures?.real_personal_data_found === false ? false : true,
  remote_access_performed: false,
  edge_functions_deployed: false,
  cleanup: reset?.cleanup ?? null,
  errors,
  primary_error: errors[0] ?? null,
};

writeJsonReport(root, "cycle-8-result.json", payload);
writeMarkdownReport(root, "cycle-8-summary.md", [
  "# Cycle 8 Final Evidence",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Baseline SHA preserved: ${payload.baseline_sha_preserved ? "yes" : "no"}`,
  `- Migration history: ${payload.migration_history.join(", ")}`,
  `- Safe reset: ${payload.reset_result}`,
  `- Fixtures: ${payload.fixtures_result}`,
  `- Negative tests: ${payload.negative_result}`,
  `- Remote access performed: ${payload.remote_access_performed ? "yes" : "no"}`,
  `- Edge Functions deployed: ${payload.edge_functions_deployed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (!ok) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(DECISION);
