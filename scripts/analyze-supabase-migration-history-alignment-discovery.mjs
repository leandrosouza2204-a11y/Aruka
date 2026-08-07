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

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
  });
}

function secretScan(root) {
  const files = [
    `${BASE}/migration-history-alignment-discovery-result.json`,
    `${BASE}/migration-history-alignment-discovery-summary.md`,
    `${BASE}/migration-history-alignment-matrix.csv`,
    "docs/supabase-production-sync/40-production-migration-history-alignment-discovery.md"
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

export function validateMigrationHistoryAlignmentDiscovery(root = ROOT) {
  const result = readJson(root, `${BASE}/migration-history-alignment-discovery-result.json`);
  const matrix = parseCsv(readText(root, `${BASE}/migration-history-alignment-matrix.csv`));

  must(result.decision === "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_REVIEW", "DECISION_INVALID");
  must(result.local_migration_count === 7, "LOCAL_MIGRATION_COUNT_INVALID");
  must(result.canonical_remote_registry_state === "ABSENT", "CANONICAL_REGISTRY_NOT_ABSENT");
  must(result.remote_history_count === 0, "REMOTE_HISTORY_COUNT_INVALID");
  must(result.potential_registry_count === 7, "POTENTIAL_REGISTRY_COUNT_INVALID");
  must(result.history_match_count === 0, "HISTORY_MATCH_COUNT_INVALID");
  must(result.local_effect_applied_history_missing_count === 6, "APPLIED_HISTORY_MISSING_COUNT_INVALID");
  must(result.reference_only_count === 1, "REFERENCE_ONLY_COUNT_INVALID");
  must(result.partially_reconciled_count === 0, "PARTIAL_COUNT_INVALID");
  must(result.not_yet_applied_count === 0, "NOT_YET_APPLIED_COUNT_INVALID");
  must(result.blocking_conflict_count === 0, "BLOCKING_CONFLICT_COUNT_INVALID");
  must(result.repair_candidate_count === 6, "REPAIR_CANDIDATE_COUNT_INVALID");
  must(result.not_safe_for_repair_count === 1, "NOT_SAFE_FOR_REPAIR_COUNT_INVALID");
  must(result.migration_repair_authorized === false, "MIGRATION_REPAIR_AUTHORIZED");
  must(result.migration_repair_executed === false, "MIGRATION_REPAIR_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_executed === false, "HISTORY_ALIGNMENT_EXECUTED");
  must(result.next_action === "REVIEW_EXACT_MIGRATION_REPAIR_PLAN", "NEXT_ACTION_INVALID");

  must(matrix.length === result.local_migration_count, "MATRIX_ROW_COUNT_INVALID");
  const baseline = matrix.find((row) => row.local_classification === "REFERENCE_ONLY_BASELINE");
  must(Boolean(baseline), "BASELINE_MISSING");
  must(baseline.repair_candidate === "false", "BASELINE_REPAIR_CANDIDATE");
  must(baseline.recommended_future_action === "DO_NOT_REPAIR_AUTOMATICALLY", "BASELINE_ACTION_INVALID");
  must(matrix.filter((row) => row.repair_candidate === "true").length === result.repair_candidate_count, "MATRIX_REPAIR_CANDIDATE_COUNT_INVALID");
  must(matrix.every((row) => row.canonical_remote_registry_present === "false"), "CANONICAL_REGISTRY_PRESENT_IN_MATRIX");
  must(matrix.every((row) => row.remote_history_present === "false"), "REMOTE_HISTORY_PRESENT_IN_MATRIX");
  must(matrix.every((row) => row.local_classification !== "BLOCKING_HISTORY_CONFLICT"), "MATRIX_CONFLICT_PRESENT");

  secretScan(root);
  return { result, matrix };
}

function main() {
  const { result } = validateMigrationHistoryAlignmentDiscovery();
  console.log(JSON.stringify({
    decision: result.decision,
    canonical_remote_registry_state: result.canonical_remote_registry_state,
    local_migration_count: result.local_migration_count,
    repair_candidate_count: result.repair_candidate_count,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
