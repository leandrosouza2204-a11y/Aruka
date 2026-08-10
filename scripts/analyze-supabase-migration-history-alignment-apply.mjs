import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";

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
    `${BASE}/migration-history-alignment-apply-result.json`,
    `${BASE}/migration-history-alignment-apply-summary.md`,
    `${BASE}/migration-history-alignment-final-matrix.csv`,
    "docs/supabase-production-sync/43-production-migration-history-alignment-apply.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    new RegExp("sen" + "ha real", "i"),
    new RegExp("URI" + " resolvida", "i"),
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

export function validateMigrationHistoryAlignmentApply(root = ROOT) {
  const result = readJson(root, `${BASE}/migration-history-alignment-apply-result.json`);

  must(result.decision === "PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.migration_repair_executed === true, "MIGRATION_REPAIR_NOT_EXECUTED");
  must(result.history_alignment_executed === true, "HISTORY_ALIGNMENT_NOT_EXECUTED");
  must(result.history_alignment_validated === true, "HISTORY_ALIGNMENT_NOT_VALIDATED");
  must(result.history_count_after === 6, "HISTORY_COUNT_INVALID");
  must(result.authorized_present_count === 6, "AUTHORIZED_PRESENT_COUNT_INVALID");
  must(result.unexpected_history_entries === 0, "UNEXPECTED_HISTORY_ENTRIES");
  must(result.baseline_history_present === false, "BASELINE_HISTORY_PRESENT");
  must(result.persistent_link_created === false, "PERSISTENT_LINK_CREATED");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.local_migration_hashes_preserved === true, "LOCAL_MIGRATION_HASHES_CHANGED");
  must(result.public_schema_mutation_detected === false, "PUBLIC_SCHEMA_MUTATION");
  must(Array.isArray(result.repair_results), "REPAIR_RESULTS_MISSING");
  must(result.repair_results.length === 6, "REPAIR_RESULTS_COUNT_INVALID");
  must(result.repair_results.every((repair) => repair.repair_executed === true), "REPAIR_MISSING");
  must(result.repair_results.every((repair) => repair.history_present_after === true), "REPAIR_HISTORY_MISSING");

  secretScan(root);
  return result;
}

function main() {
  const result = validateMigrationHistoryAlignmentApply();
  console.log(JSON.stringify({
    decision: result.decision,
    history_count_after: result.history_count_after,
    authorized_present_count: result.authorized_present_count,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
