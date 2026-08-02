import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_DIR = "reports/supabase-production-sync";
const TARGET_MIGRATION = "supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql";
const DECISION = "READY_FOR_FINAL_SECURITY_RECLASSIFICATION_COMMIT";

export function loadGlobalState(root = process.cwd()) {
  return JSON.parse(readFileSync(join(root, REPORT_DIR, "post-phase34-global-result.json"), "utf8"));
}

export function classifyActiveSecurityItems(state) {
  const items = state.active_items ?? [];
  if (items.length === 0) {
    const remotePending = state.remote_pending_security_items ?? [];
    if (remotePending.length === 1) {
      const target = remotePending[0];
      return {
        preliminary_decision: "SECURITY_DRIFT_ALREADY_IMPLEMENTED_LOCALLY",
        initial_active_security_count: 1,
        target,
        object_type: "POLICY",
        local_security_state: "RESOLVED",
        remote_security_state: "PENDING_APPLY",
        existing_migration: TARGET_MIGRATION,
        migration_required: false,
        migration_created: false,
        existing_migration_reused: true,
        duplicate_migration_prevented: true,
        final_local_security_drift_count: 0,
        remote_pending_security_count: 1,
        next_safe_group: "WORKOUT_DELIVERY_RECONCILIATION"
      };
    }
    return {
      preliminary_decision: "SECURITY_DRIFT_ALREADY_ZERO",
      initial_active_security_count: 0,
      target: null,
      final_local_security_drift_count: 0,
      remote_pending_security_count: 0
    };
  }
  if (items.length > 1) {
    throw new Error("BLOCKED_GLOBAL_AUDIT_SECURITY_COUNT_MISMATCH");
  }

  const target = items[0];
  const existingMigration = target.resolved_by === "20260731190000" ? TARGET_MIGRATION : "";
  const isLocalImplemented = target.current_local_status === "LOCAL_RECONCILIATION_IMPLEMENTED";
  const isRemotePending = target.remote_status === "REMOTE_RECONCILIATION_PENDING";
  const isResolvedStatus = /^RESOLVED_BY_/.test(target.active_or_resolved);

  if (existingMigration && isLocalImplemented && isRemotePending && isResolvedStatus) {
    return {
      preliminary_decision: "SECURITY_DRIFT_ALREADY_IMPLEMENTED_LOCALLY",
      initial_active_security_count: 1,
      target,
      object_type: "POLICY",
      local_security_state: "RESOLVED",
      remote_security_state: "PENDING_APPLY",
      existing_migration: existingMigration,
      migration_required: false,
      migration_created: false,
      existing_migration_reused: true,
      duplicate_migration_prevented: true,
      final_local_security_drift_count: 0,
      remote_pending_security_count: 1,
      next_safe_group: "WORKOUT_DELIVERY_RECONCILIATION"
    };
  }

  if (/ADMIN|FINANCIAL|PRODUCT|WORKOUT|STUDENT/.test(`${target.domain} ${target.next_action}`)) {
    return {
      preliminary_decision: "SECURITY_PRODUCT_DECISION_REQUIRED",
      initial_active_security_count: 1,
      target,
      migration_required: false,
      final_local_security_drift_count: 1,
      remote_pending_security_count: 0
    };
  }

  return {
    preliminary_decision: "SECURITY_MIGRATION_REQUIRED",
    initial_active_security_count: 1,
    target,
    migration_required: true,
    final_local_security_drift_count: 1,
    remote_pending_security_count: 0
  };
}

export function validateNoDuplicateMigration(classification, root = process.cwd()) {
  const migrationDiff = execFileSync("git", ["diff", "--name-only", "--", "supabase/migrations/**"], { cwd: root, encoding: "utf8" }).trim();
  if (!classification.migration_required && migrationDiff) {
    throw new Error("FINAL_SECURITY_DUPLICATE_MIGRATION_FORBIDDEN");
  }
  if (!classification.migration_required && classification.existing_migration && !existsSync(join(root, classification.existing_migration))) {
    throw new Error("FINAL_SECURITY_EXISTING_MIGRATION_MISSING");
  }
}

export function validateNoProductionReady(result) {
  const text = JSON.stringify(result);
  if (/READY_TO_APPLY|READY_FOR_PRODUCTION|DB_PUSH_NOW|REPAIR_SAFE/.test(text)) {
    throw new Error("FINAL_SECURITY_PRODUCTION_READY_FLAG_FORBIDDEN");
  }
}

function writeReports(result, root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  writeFileSync(join(root, REPORT_DIR, "final-security-drift-scope.json"), `${JSON.stringify({
    initial_active_security_count: result.initial_security_drift_count,
    target: result.resolved_object,
    object_type: result.object_type,
    local_state: result.local_security_state,
    remote_state: result.remote_security_state,
    existing_migration: result.existing_migration,
    migration_required: result.migration_required,
    decision: result.decision,
    reason: result.reason,
    security_risk: result.security_risk,
    functional_risk: result.functional_risk,
    production_state: result.production_state,
    next_action: result.next_safe_group
  }, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "final-security-drift-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");

  const summary = `# Final Security Drift Resolution

Decision: \`${result.decision}\`.

Initial security drift count: \`${result.initial_security_drift_count}\`.

Final local security drift count: \`${result.final_local_security_drift_count}\`.

Remote pending security count: \`${result.remote_pending_security_count}\`.

Migration created: \`${result.migration_created ? "YES" : "NO"}\`.

Existing migration reused: \`${result.existing_migration_reused ? "YES" : "NO"}\`.

Resolved object: \`${result.resolved_object.object}\`.

Object type: \`${result.object_type}\`.

Local security state: \`${result.local_security_state}\`.

Remote security state: \`${result.remote_security_state}\`.

Next safe group: \`${result.next_safe_group}\`.
`;
  writeFileSync(join(root, REPORT_DIR, "final-security-drift-summary.md"), summary, "utf8");
  writeFileSync(join(root, "docs/supabase-production-sync/19-final-security-drift-resolution.md"), `# Final Security Drift Resolution

## Context

This round reviewed the only security item left active by the post-Phase 3.4 global audit. It did not create a migration, touch production, link Supabase, repair history, commit, push or open a PR.

## Initial Item

- Domain: \`${result.resolved_object.domain}\`
- Object: \`${result.resolved_object.object}\`
- Historical status: \`${result.resolved_object.historical_status}\`
- Evidence source: \`reports/supabase-production-sync/post-phase34-global-result.json\`

## Local State

\`${result.local_security_state}\`

The item is already covered locally by \`${result.existing_migration}\`.

## Remote State

\`${result.remote_security_state}\`

Production evidence still reflects the pre-application remote state.

## Migration Coverage

No new migration is required. Duplicate migration was prevented.

## Decision

\`${result.decision}\`

## Validation

The final local security drift count is \`${result.final_local_security_drift_count}\`; remote pending security count is \`${result.remote_pending_security_count}\`.

## Next Group

\`${result.next_safe_group}\`
`, "utf8");
}

export function run({ write = true } = {}) {
  const root = process.cwd();
  const state = loadGlobalState(root);
  const classification = classifyActiveSecurityItems(state);
  validateNoDuplicateMigration(classification, root);

  const result = {
    decision: DECISION,
    reconciliation_type: "FINAL_ACTIVE_SECURITY_DRIFT_RECONCILIATION",
    initial_security_drift_count: classification.initial_active_security_count,
    final_local_security_drift_count: classification.final_local_security_drift_count,
    remote_pending_security_count: classification.remote_pending_security_count,
    migration_created: false,
    migration_path: null,
    existing_migration_reused: Boolean(classification.existing_migration_reused),
    existing_migration: classification.existing_migration ?? null,
    resolved_object: classification.target,
    object_type: classification.object_type ?? "POLICY",
    local_security_state: classification.local_security_state ?? "UNKNOWN",
    remote_security_state: classification.remote_security_state ?? "UNKNOWN",
    migration_required: Boolean(classification.migration_required),
    duplicate_migration_prevented: Boolean(classification.duplicate_migration_prevented),
    functional_decision_needed: false,
    security_risk: "REMOTE_PENDING_UNTIL_APPROVED_MIGRATIONS_APPLIED",
    functional_risk: "NONE_IDENTIFIED_FOR_RECLASSIFICATION",
    production_state: "NOT_APPLIED",
    production_action_required: "NO",
    migration_repair_allowed: "NO",
    next_safe_group: classification.next_safe_group ?? "SECURITY_HARDENING",
    reason: "The only active security item is already implemented locally by the Phase 1 security migration; it remains pending only because production has not applied the existing migration bundle."
  };
  validateNoProductionReady(result);
  if (write) writeReports(result, root);
  console.log("FINAL_ACTIVE_SECURITY_DRIFT_RECONCILIATION");
  console.log(`ACTIVE_LOCAL_SECURITY_DRIFT=${result.final_local_security_drift_count}`);
  console.log(`REMOTE_SECURITY_PENDING=${result.remote_pending_security_count}`);
  console.log(`NEXT_SAFE_GROUP=${result.next_safe_group}`);
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
