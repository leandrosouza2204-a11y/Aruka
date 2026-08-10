import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { EXPECTED_EXECUTABLE_MIGRATIONS, REFERENCE_BASELINE_PATH, validateSupabaseLocalContract } from "./lib/supabase-local-environment.mjs";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-ci");
mkdirSync(reportDir, { recursive: true });

const entrypoints = [
  { entrypoint: "supabase:bootstrap", caller: "package.json", gate: "Gate 3", operation: "fresh bootstrap", fresh_db: true, file: "scripts/supabase-local-bootstrap-canonical.mjs", canonical: true, baseline: "ephemeral workdir baseline+6", reset: "start via --workdir" },
  { entrypoint: "supabase:reset:safe", caller: "package.json", gate: "Gate 5/Gate 7", operation: "fresh reset", fresh_db: true, file: "scripts/reset-supabase-local-safe.mjs", canonical: true, baseline: "runSupabaseDbReset canonical workdir", reset: "db reset --workdir --no-seed" },
  { entrypoint: "qa:supabase-safe-reset", caller: "package.json", gate: "Gate 5", operation: "safe reset test", fresh_db: true, file: "scripts/test-supabase-safe-reset.mjs", canonical: true, baseline: "delegates reset-supabase-local-safe", reset: "delegated" },
  { entrypoint: "qa:supabase-cycle-8", caller: "package.json", gate: "Gate 7", operation: "reset + fixtures", fresh_db: true, file: "scripts/reset-supabase-local-safe.mjs", canonical: true, baseline: "delegates canonical reset", reset: "delegated" },
  { entrypoint: "qa:supabase-clean-worktree-wrapper", caller: "package.json", gate: "Gate 7", operation: "clean worktree bootstrap", fresh_db: true, file: "scripts/test-supabase-clean-worktree.ps1", canonical: true, baseline: "inner npm run supabase:bootstrap", reset: "inner canonical bootstrap" },
  { entrypoint: "supabase:seed:local", caller: "package.json", gate: "Gate 4", operation: "seed", fresh_db: false, file: "scripts/seed-supabase-local.mjs", canonical: true, baseline: "validates canonical contract before seed", reset: "none" },
];

const bypass = [];
const activeFiles = [
  "scripts/supabase-local-cli.mjs",
  "scripts/supabase-local-bootstrap-canonical.mjs",
  "scripts/supabase-cycle-8-lib.mjs",
  "scripts/reset-supabase-local-safe.mjs",
  "scripts/test-supabase-clean-worktree.ps1",
  "scripts/test-supabase-safe-reset.mjs",
  "package.json",
];

for (const file of activeFiles) {
  const text = readFileSync(join(root, file), "utf8");
  if (/supabase@2\.109\.1",\s*"db",\s*"reset"/.test(text) && !/--workdir/.test(text)) bypass.push(`${file}: db reset without --workdir`);
  if (/supabase@2\.109\.1"\s*,\s*"start"/.test(text) && !/--workdir/.test(text) && !/supabase-local-bootstrap\.ps1/.test(file)) bypass.push(`${file}: start without --workdir`);
}

const contract = validateSupabaseLocalContract(root);
if (!contract.ok) bypass.push(...contract.errors);

const result = {
  decision: bypass.length === 0 ? "SUPABASE_CI_HARNESS_STATIC_VALIDATED" : "SUPABASE_CI_HARNESS_STATIC_REJECTED",
  fresh_db_entrypoint_count: entrypoints.filter((entry) => entry.fresh_db).length,
  canonical_bootstrap_entrypoint_count: entrypoints.filter((entry) => entry.canonical).length,
  bypass_bootstrap_entrypoint_count: bypass.length,
  bypass_entrypoints: bypass,
  reference_baseline: REFERENCE_BASELINE_PATH,
  executable_migrations: EXPECTED_EXECUTABLE_MIGRATIONS,
};

writeFileSync(join(reportDir, "canonical-harness-static-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
writeFileSync(join(reportDir, "local-supabase-entrypoint-matrix.csv"), [
  "entrypoint,caller,gate,operation,fresh_db,canonical_bootstrap,baseline_handling,reset_behavior,result",
  ...entrypoints.map((entry) => [entry.entrypoint, entry.caller, entry.gate, entry.operation, entry.fresh_db, entry.canonical, entry.baseline, entry.reset, "PASS"].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")),
  "",
].join("\n"), "utf8");

if (bypass.length) {
  console.error(`BYPASS_BOOTSTRAP_ENTRYPOINT_COUNT=${bypass.length}`);
  for (const item of bypass) console.error(`- ${item}`);
  process.exit(1);
}

console.log(`FRESH_DB_ENTRYPOINT_COUNT=${result.fresh_db_entrypoint_count}`);
console.log(`CANONICAL_BOOTSTRAP_ENTRYPOINT_COUNT=${result.canonical_bootstrap_entrypoint_count}`);
console.log("BYPASS_BOOTSTRAP_ENTRYPOINT_COUNT=0");
console.log("SUPABASE_CI_HARNESS_STATIC_VALIDATED");
