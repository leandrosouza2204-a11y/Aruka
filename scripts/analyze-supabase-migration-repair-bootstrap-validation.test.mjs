import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateMigrationRepairBootstrapValidation } from "./analyze-supabase-migration-repair-bootstrap-validation.mjs";

function valid() {
  return {
    decision: "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_AUTHORIZATION_REVIEW",
    cli_version: "2.111.0",
    cli_source: "NPM_CACHE",
    repair_supported: true,
    repair_help_exit_code: 0,
    repair_accepts_db_url: true,
    repair_requires_link: "NOT_IF_DB_URL",
    repair_connection_mode: "DB_URL_NO_LINK",
    lab_database_ready: true,
    registry_present_before: false,
    schema_migrations_present_before: false,
    repair_applied_exit_code: 0,
    registry_present_after: true,
    schema_migrations_present_after: true,
    test_version_present: true,
    metadata_only_confirmed: true,
    public_schema_mutation: false,
    repair_bootstrap_behavior: "CLI_CREATES_REGISTRY_WHEN_ABSENT",
    reverted_supported: true,
    reverted_exit_code: 0,
    test_version_present_after_revert: false,
    lab_container_removed: true,
    production_accessed: false,
    migration_repair_authorized: false,
    migration_repair_executed: false,
    history_alignment_executed: false,
    db_push_allowed: false,
    next_action: "USER_EXPLICIT_HISTORY_ALIGNMENT_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "repair-bootstrap-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "migration-repair-bootstrap-validation-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "migration-repair-bootstrap-validation-summary.md"), "Bootstrap PASS\n");
  writeFileSync(join(docsDir, "42-migration-repair-bootstrap-validation.md"), "Bootstrap PASS\n");
  return root;
}

test("production accessed -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.production_accessed = true; })), /PRODUCTION_ACCESSED/));
test("repair against production -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.migration_repair_executed = true; })), /MIGRATION_REPAIR_EXECUTED/));
test("public schema mutation -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.public_schema_mutation = true; })), /PUBLIC_SCHEMA_MUTATION/));
test("lab not removed -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.lab_container_removed = false; })), /LAB_CONTAINER_NOT_REMOVED/));
test("repair unsupported -> valid limitation", () => assert.equal(validateMigrationRepairBootstrapValidation(fixture((r) => { r.decision = "BLOCKED_MIGRATION_REPAIR_TOOLING"; r.repair_supported = false; })).decision, "BLOCKED_MIGRATION_REPAIR_TOOLING"));
test("db-url supported + bootstrap success -> PASS", () => assert.equal(validateMigrationRepairBootstrapValidation(fixture()).repair_connection_mode, "DB_URL_NO_LINK"));
test("registry not created despite repair success -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.registry_present_after = false; })), /REGISTRY_NOT_CREATED/));
test("migration repair authorized=true -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.migration_repair_authorized = true; })), /MIGRATION_REPAIR_AUTHORIZED/));
test("history alignment executed=true -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.history_alignment_executed = true; })), /HISTORY_ALIGNMENT_EXECUTED/));
test("db push allowed=true -> FAIL", () => assert.throws(() => validateMigrationRepairBootstrapValidation(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
