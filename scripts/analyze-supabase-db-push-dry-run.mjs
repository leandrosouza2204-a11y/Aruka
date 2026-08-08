import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const BASELINE_HASH = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function readText(root, path) {
  return readFileSync(join(root, path), "utf8");
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/db-push-dry-run-result.json`,
    `${BASE}/db-push-dry-run-summary.md`,
    "docs/supabase-production-sync/45-reference-only-baseline-separation.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("pass" + "word", "i"),
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    /vriz[a-z0-9]+vdik/i,
    new RegExp("\\b" + "P" + "II" + "\\b")
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readText(root, file);
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

function validateBaselineSeparation(root) {
  must(!existsSync(join(root, "supabase/migrations/20260716090000_baseline_aruka_v1.sql")), "BASELINE_STILL_EXECUTABLE");
  must(existsSync(join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql")), "REFERENCE_BASELINE_MISSING");
  const executable = readDirSqlCount(root, "supabase/migrations");
  const reference = readDirSqlCount(root, "supabase/reference-baselines");
  must(executable === 6, "EXECUTABLE_MIGRATION_COUNT_INVALID");
  must(reference === 1, "REFERENCE_ONLY_BASELINE_COUNT_INVALID");
}

function readDirSqlCount(root, path) {
  return readdirSync(join(root, path)).filter((name) => name.endsWith(".sql")).length;
}

export function validateDbPushDryRun(root = ROOT) {
  const result = readJson(root, `${BASE}/db-push-dry-run-result.json`);
  must(result.decision === "DB_PUSH_DRY_RUN_CLEAN", "DECISION_NOT_FINAL_CLEAN");
  must(result.dry_run_executed === true, "DRY_RUN_NOT_EXECUTED");
  must(result.dry_run_exit_code === 0, "DRY_RUN_EXIT_CODE_INVALID");
  must(result.pending_migration_count === 0, "PENDING_MIGRATIONS");
  must(Array.isArray(result.pending_versions) && result.pending_versions.length === 0, "PENDING_VERSIONS_NOT_EMPTY");
  must(result.baseline_pending === false, "BASELINE_PENDING");
  must(result.db_push_needed === false, "DB_PUSH_NEEDED");
  must(result.db_push_executed === false, "DB_PUSH_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.production_mutation_executed === false, "PRODUCTION_MUTATION_EXECUTED");
  must(result.authorized_history_migrations_pending === false, "AUTHORIZED_HISTORY_MIGRATIONS_PENDING");
  must(result.unexpected_pending_count === 0, "UNEXPECTED_PENDING_MIGRATIONS");

  must(result.baseline_sha256_before === BASELINE_HASH, "BASELINE_SHA_BEFORE_INVALID");
  must(result.baseline_sha256_after === BASELINE_HASH, "BASELINE_SHA_AFTER_INVALID");
  must(result.baseline_content_preserved === true, "BASELINE_CONTENT_NOT_PRESERVED");
  validateBaselineSeparation(root);
  secretScan(root);
  return result;
}

function main() {
  const result = validateDbPushDryRun();
  console.log(JSON.stringify({
    decision: result.decision,
    pending_migration_count: result.pending_migration_count,
    baseline_pending: result.baseline_pending,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
