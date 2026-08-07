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
    `${BASE}/migration-history-alignment-plan-result.json`,
    `${BASE}/migration-history-alignment-plan-summary.md`,
    `${BASE}/migration-history-alignment-repair-plan.csv`,
    "docs/supabase-production-sync/41-production-migration-history-alignment-plan.md"
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

export function validateMigrationHistoryAlignmentPlan(root = ROOT) {
  const result = readJson(root, `${BASE}/migration-history-alignment-plan-result.json`);
  const rows = parseCsv(readText(root, `${BASE}/migration-history-alignment-repair-plan.csv`));
  const allowedDecisions = new Set([
    "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_AUTHORIZATION_REVIEW",
    "READY_WITH_REPAIR_BOOTSTRAP_LIMITATION"
  ]);

  must(allowedDecisions.has(result.decision), "DECISION_INVALID");
  must(result.decision !== "READY_FOR_REPAIR_EXECUTION", "READY_FOR_REPAIR_EXECUTION_FORBIDDEN");
  must(result.local_migration_count === 7, "LOCAL_MIGRATION_COUNT_INVALID");
  must(result.baseline_count === 1, "BASELINE_COUNT_INVALID");
  must(result.candidate_count === 6, "CANDIDATE_COUNT_INVALID");
  must(result.rejected_candidate_count === 1, "REJECTED_CANDIDATE_COUNT_INVALID");
  must(result.canonical_registry_state === "ABSENT", "CANONICAL_REGISTRY_STATE_INVALID");
  must(result.potential_service_registry_count === 7, "SERVICE_REGISTRY_COUNT_INVALID");
  must(result.migration_repair_authorized === false, "MIGRATION_REPAIR_AUTHORIZED");
  must(result.migration_repair_executed === false, "MIGRATION_REPAIR_EXECUTED");
  must(result.history_alignment_executed === false, "HISTORY_ALIGNMENT_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.baseline_repair_candidate === false, "BASELINE_INCLUDED_AS_CANDIDATE");
  must(result.future_command_status === "FUTURE_COMMAND_NOT_EXECUTED", "FUTURE_COMMAND_STATUS_INVALID");
  must(result.repair_bootstrap_behavior !== "UNKNOWN", "REPAIR_BOOTSTRAP_UNKNOWN");
  if (result.repair_bootstrap_behavior === "REPAIR_BOOTSTRAP_BEHAVIOR_REQUIRES_VALIDATION") {
    must(result.decision === "READY_WITH_REPAIR_BOOTSTRAP_LIMITATION", "BOOTSTRAP_LIMITATION_DECISION_REQUIRED");
  }

  must(rows.length === 6, "REPAIR_PLAN_ROW_COUNT_INVALID");
  const versions = rows.map((row) => row.version);
  must(new Set(versions).size === versions.length, "DUPLICATE_VERSION");
  must([...versions].sort().join("|") === versions.join("|"), "UNORDERED_VERSIONS");
  must(!versions.includes(result.baseline_version), "BASELINE_INCLUDED_AS_CANDIDATE");
  for (const row of rows) {
    must(row.production_effect_status === "FULLY_APPLIED", "CANDIDATE_WITHOUT_FULL_EVIDENCE");
    must(row.fully_reconciled === "true", "PARTIAL_MIGRATION_CANDIDATE");
    must(row.contains_deferred_scope === "false", "DEFERRED_MIGRATION_CANDIDATE");
    must(row.repair_candidate === "true", "REPAIR_CANDIDATE_FALSE");
    must(row.future_repair_action === "FUTURE_COMMAND_NOT_EXECUTED", "FUTURE_COMMAND_EXECUTED");
  }

  secretScan(root);
  return { result, rows };
}

function main() {
  const { result } = validateMigrationHistoryAlignmentPlan();
  console.log(JSON.stringify({
    decision: result.decision,
    candidate_count: result.candidate_count,
    repair_bootstrap_behavior: result.repair_bootstrap_behavior,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
