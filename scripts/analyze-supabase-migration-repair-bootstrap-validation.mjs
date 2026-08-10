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
    `${BASE}/migration-repair-bootstrap-validation-result.json`,
    `${BASE}/migration-repair-bootstrap-validation-summary.md`,
    "docs/supabase-production-sync/42-migration-repair-bootstrap-validation.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
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

export function validateMigrationRepairBootstrapValidation(root = ROOT) {
  const result = readJson(root, `${BASE}/migration-repair-bootstrap-validation-result.json`);

  must(result.production_accessed === false, "PRODUCTION_ACCESSED");
  must(result.migration_repair_authorized === false, "MIGRATION_REPAIR_AUTHORIZED");
  must(result.migration_repair_executed === false, "MIGRATION_REPAIR_EXECUTED");
  must(result.history_alignment_executed === false, "HISTORY_ALIGNMENT_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.public_schema_mutation === false, "PUBLIC_SCHEMA_MUTATION");
  must(result.lab_container_removed === true, "LAB_CONTAINER_NOT_REMOVED");

  if (result.repair_supported === false) {
    must(result.decision === "BLOCKED_MIGRATION_REPAIR_TOOLING", "UNSUPPORTED_REPAIR_DECISION_INVALID");
    secretScan(root);
    return result;
  }

  must(result.decision === "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_AUTHORIZATION_REVIEW", "DECISION_INVALID");
  must(result.cli_version === "2.111.0", "CLI_VERSION_INVALID");
  must(result.repair_supported === true, "REPAIR_UNSUPPORTED");
  must(result.repair_help_exit_code === 0, "REPAIR_HELP_FAILED");
  must(result.repair_accepts_db_url === true, "DB_URL_UNSUPPORTED");
  must(result.repair_requires_link === "NOT_IF_DB_URL", "REPAIR_REQUIRES_LINK");
  must(result.repair_connection_mode === "DB_URL_NO_LINK", "CONNECTION_MODE_INVALID");
  must(result.lab_database_ready === true, "LAB_DATABASE_NOT_READY");
  must(result.registry_present_before === false, "REGISTRY_PRESENT_BEFORE");
  must(result.schema_migrations_present_before === false, "SCHEMA_MIGRATIONS_PRESENT_BEFORE");
  must(result.repair_applied_exit_code === 0, "REPAIR_APPLIED_FAILED");
  must(result.registry_present_after === true, "REGISTRY_NOT_CREATED");
  must(result.schema_migrations_present_after === true, "SCHEMA_MIGRATIONS_NOT_CREATED");
  must(result.test_version_present === true, "TEST_VERSION_NOT_PRESENT");
  must(result.metadata_only_confirmed === true, "METADATA_ONLY_NOT_CONFIRMED");
  must(result.repair_bootstrap_behavior === "CLI_CREATES_REGISTRY_WHEN_ABSENT", "BOOTSTRAP_BEHAVIOR_INVALID");
  must(result.reverted_supported === true, "REVERTED_UNSUPPORTED");
  must(result.reverted_exit_code === 0, "REVERTED_FAILED");
  must(result.test_version_present_after_revert === false, "TEST_VERSION_PRESENT_AFTER_REVERT");

  secretScan(root);
  return result;
}

function main() {
  const result = validateMigrationRepairBootstrapValidation();
  console.log(JSON.stringify({
    decision: result.decision,
    cli_version: result.cli_version,
    repair_connection_mode: result.repair_connection_mode,
    repair_bootstrap_behavior: result.repair_bootstrap_behavior,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
