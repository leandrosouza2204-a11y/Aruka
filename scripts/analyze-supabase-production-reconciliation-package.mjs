import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_DIR = "reports/supabase-production-sync";
const DOC_PATH = "docs/supabase-production-sync/22-production-reconciliation-package-design.md";
const DECISION = "READY_FOR_PRODUCTION_RECONCILIATION_PACKAGE_REVIEW";
const NEXT_SAFE_GROUP = "PRODUCTION_RECONCILIATION_CUTOVER_REVIEW";

export const expectedMigrations = [
  ["20260716090000", "baseline_aruka_v1.sql", "Baseline", "BASELINE", "BASELINE_REFERENCE_ONLY", "SKIP_REFERENCE_ONLY", "HIGH"],
  ["20260728030000", "workout_delivery_integration_v1.sql", "Workout Delivery", "WORKOUT_DELIVERY", "REQUIRES_OBJECT_LEVEL_RECONCILIATION", "OBJECT_LEVEL_RECONCILIATION", "MEDIUM"],
  ["20260730090000", "student_identity_contract.sql", "Student Identity", "STUDENT_IDENTITY", "REMOTE_ABSENT_SAFE_CANDIDATE", "CONTROLLED_SQL_FILE", "MEDIUM"],
  ["20260731190000", "reconcile_security_policies_and_grants.sql", "Security reconciliation", "SECURITY", "REMOTE_PENDING_RECONCILIATION", "CONTROLLED_SQL_FILE", "HIGH"],
  ["20260801143335", "reconcile_alunos_required_fields.sql", "Required fields", "NULLABILITY", "REMOTE_PENDING_RECONCILIATION", "CONTROLLED_SQL_FILE", "MEDIUM"],
  ["20260801173000", "revoke_aoe_idempotency_anon_execute.sql", "AOE security", "AOE_SECURITY", "REMOTE_PENDING_RECONCILIATION", "CONTROLLED_SQL_FILE", "LOW"],
  ["20260801180000", "harden_workout_templates_updated_at.sql", "Group A utility hardening", "GROUP_A_SECURITY", "REMOTE_PENDING_RECONCILIATION", "CONTROLLED_SQL_FILE", "LOW"]
];

function sqlOf(root, filename) {
  return readFileSync(join(root, "supabase/migrations", filename), "utf8");
}

function count(pattern, text) {
  return (text.match(pattern) ?? []).length;
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(path, rows, headers) {
  writeFileSync(path, `${[headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))].join("\n")}\n`, "utf8");
}

export function buildMigrationInventory(root = process.cwd()) {
  const files = readdirSync(join(root, "supabase/migrations")).filter((file) => /^\d{14}_.+\.sql$/.test(file)).sort();
  const expectedFiles = expectedMigrations.map(([timestamp, file]) => `${timestamp}_${file}`);
  for (const file of expectedFiles) {
    if (!files.includes(file)) throw new Error(`PRODUCTION_PACKAGE_MISSING_MIGRATION:${file}`);
  }
  if (files.length !== expectedFiles.length) throw new Error("PRODUCTION_PACKAGE_UNEXPECTED_MIGRATION_COUNT");
  return expectedMigrations.map(([timestamp, filename, phase, domain, classification, strategy, risk]) => {
    const sql = sqlOf(root, `${timestamp}_${filename}`);
    const dataWrites = count(/\b(insert|update|delete)\b/gi, sql);
    return {
      timestamp,
      filename: `${timestamp}_${filename}`,
      phase,
      domain,
      object_count: count(/\b(create|alter|drop|grant|revoke|comment)\b/gi, sql),
      tables_affected: [...new Set([...sql.matchAll(/public\.([a-z_]+)/gi)].map((m) => m[1]).filter((name) => !["auth"].includes(name)))].sort(),
      functions_affected: [...new Set([...sql.matchAll(/function public\.([a-z_]+)/gi)].map((m) => m[1]))].sort(),
      policies_affected: count(/\bpolicy\b/gi, sql),
      grants_affected: count(/\b(grant|revoke)\b/gi, sql),
      constraints_affected: count(/\bconstraint\b/gi, sql),
      data_writes: dataWrites,
      destructive_operations: count(/\bdrop\s+(table|column|function|index)\b/gi, sql),
      local_validation_status: "PASS_LOCAL_REPLAY_AND_DIFF",
      remote_applicability_status: classification,
      apply_strategy: strategy,
      risk_level: dataWrites > 0 && domain !== "WORKOUT_DELIVERY" ? "HIGH" : risk
    };
  });
}

export function buildDependencyGraph() {
  return {
    nodes: expectedMigrations.map(([timestamp, filename, phase, domain]) => ({ id: timestamp, filename: `${timestamp}_${filename}`, phase, domain })),
    edges: [
      ["20260716090000", "20260728030000", "baseline reference objects exist before Workout Delivery reconciliation"],
      ["20260728030000", "20260730090000", "Student Identity reader depends on Workout Delivery lifecycle columns"],
      ["20260728030000", "20260731190000", "Security reconciliation references workout tables/functions"],
      ["20260730090000", "20260731190000", "Security reconciliation must preserve student RPC grants"],
      ["20260731190000", "20260801143335", "Required fields follows security posture validation"],
      ["20260731190000", "20260801173000", "AOE grant hardening follows security baseline"],
      ["20260731190000", "20260801180000", "Group A utility hardening follows security baseline"]
    ].map(([from, to, reason]) => ({ from, to, reason }))
  };
}

export function buildSequence() {
  const step = (id, migration_source, operation, precheck, postcheck, rollback, stop_condition, risk, apply_method) => ({
    id,
    migration_source,
    operation,
    preconditions: ["Supabase remains unlinked in repository", "Manual operator confirms backup completed", "Precheck query for this step returns expected state"],
    precheck,
    apply_method,
    postcheck,
    rollback_strategy: rollback,
    stop_condition,
    risk
  });
  return [
    step("00", "20260716090000_baseline_aruka_v1.sql", "reference only; never replay baseline directly", "baseline object inventory and migration history inspected", "no baseline SQL applied", "restore from backup if any accidental baseline replay occurs", "any plan proposes full baseline replay", "HIGH", "SKIP_REFERENCE_ONLY"),
    step("01", "20260728030000_workout_delivery_integration_v1.sql", "object-level Workout Delivery convergence", "columns/constraints/indexes/RPCs/grants compared object by object", "Workout Delivery contract and smoke tests pass", "rollback changed RPCs/grants/constraints from captured definitions", "remote object exists with incompatible definition", "MEDIUM", "OBJECT_LEVEL_RECONCILIATION"),
    step("02", "20260730090000_student_identity_contract.sql", "controlled Student Identity contract apply", "alunos/perfis/auth.users present; Student Identity objects absent or compatible", "student identity link/unlink/reader smoke tests pass", "drop newly added student identity objects only if no production link data was created", "identity model conflict or incompatible existing student_user_id", "MEDIUM", "CONTROLLED_SQL_FILE"),
    step("03", "20260731190000_reconcile_security_policies_and_grants.sql", "security policy/grant reconciliation", "referenced tables/functions exist", "professional isolation and anon denial pass", "restore captured policies/grants", "unexpected permissive policy or missing function", "HIGH", "CONTROLLED_SQL_FILE"),
    step("04", "20260801143335_reconcile_alunos_required_fields.sql", "set required aluno fields not null", "created_at/user_id/whatsapp null counts are zero", "NOT NULL confirmed and aluno create/update smoke passes", "drop NOT NULL only if rollback approved", "any null count greater than zero", "MEDIUM", "CONTROLLED_SQL_FILE"),
    step("05", "20260801173000_revoke_aoe_idempotency_anon_execute.sql", "revoke anon execute from AOE idempotency RPC", "function signature exists", "anon denied; authenticated/service_role expected grants remain", "restore anon grant only if emergency compatibility rollback approved", "function signature missing", "LOW", "CONTROLLED_SQL_FILE"),
    step("06", "20260801180000_harden_workout_templates_updated_at.sql", "set search_path and revoke direct public/anon/authenticated execute", "function, trigger and body hash still match evidence", "trigger works; direct grants revoked", "restore function metadata/grants from captured definitions", "body hash changed since evidence", "LOW", "CONTROLLED_SQL_FILE")
  ];
}

export function validatePackage(pkg) {
  if (pkg.db_push_allowed !== "NO") throw new Error("PRODUCTION_PACKAGE_DB_PUSH_FORBIDDEN");
  if (pkg.history_alignment_allowed_now !== "NO") throw new Error("PRODUCTION_PACKAGE_REPAIR_FORBIDDEN");
  if (pkg.production_execution_authorized !== "NO") throw new Error("PRODUCTION_EXECUTION_FORBIDDEN");
  if (pkg.baseline_strategy !== "BASELINE_REFERENCE_ONLY") throw new Error("BLOCKED_UNSAFE_BASELINE_APPLICATION");
  if (!pkg.prechecks_ready || !pkg.postchecks_ready || !pkg.recovery_plan_ready || !pkg.cutover_sequence_ready) throw new Error("PRODUCTION_PACKAGE_INCOMPLETE");
  if (pkg.admin_strategy !== "KEEP_REMOTE_FOR_NOW" || pkg.financial_strategy !== "KEEP_REMOTE_FOR_NOW") throw new Error("BLOCKED_PRODUCTION_PACKAGE_SCOPE_EXPANSION");
  if (pkg.aoe_body !== "DEFER_TO_POST_CUTOVER_AOE_RECONCILIATION") throw new Error("PRODUCTION_PACKAGE_AOE_BODY_FORBIDDEN");
}

function readOnlySqlValidation(sql) {
  const stripped = sql.replace(/--.*$/gm, "").trim();
  if (/\b(insert|update|delete|alter|create|drop|grant|revoke|truncate|comment|call|do)\b/i.test(stripped)) {
    throw new Error("PRODUCTION_PACKAGE_READONLY_SQL_VALIDATION_FAILED");
  }
}

function writeSqlFiles(root) {
  const pre = `-- Production cutover prechecks. Read-only only.
select 'migration_history' as check_name, version, name from supabase_migrations.schema_migrations order by version;
select 'required_fields_nulls' as check_name,
  count(*) filter (where created_at is null) as created_at_nulls,
  count(*) filter (where user_id is null) as user_id_nulls,
  count(*) filter (where whatsapp is null) as whatsapp_nulls
from public.alunos;
select 'student_identity_column' as check_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('user_id', 'student_user_id');
select 'student_identity_constraints' as check_name, conname from pg_constraint where conname in ('alunos_student_user_id_fkey', 'perfis_role_check');
select 'student_identity_indexes' as check_name, indexname from pg_indexes where schemaname = 'public' and indexname in ('alunos_student_user_id_uidx', 'alunos_student_user_id_idx');
select 'workout_delivery_columns' as check_name, column_name from information_schema.columns where table_schema = 'public' and table_name = 'treinos' and column_name in ('lifecycle_status', 'template_origin_snapshot', 'application_idempotency_key');
select 'workout_delivery_events' as check_name, table_name from information_schema.tables where table_schema = 'public' and table_name = 'treino_eventos';
select 'function_signatures' as check_name, routine_name from information_schema.routines where routine_schema = 'public' and routine_name in ('salvar_treino_composto', 'entregar_treino', 'alterar_estado_treino', 'vincular_aluno_usuario', 'desvincular_aluno_usuario', 'get_my_student_workouts', 'aoe_idempotency_get_or_create', 'set_workout_templates_updated_at');
select 'policies' as check_name, schemaname, tablename, policyname from pg_policies where schemaname = 'public';
select 'function_grants' as check_name, routine_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public';
`;
  const post = `-- Production cutover postchecks. Read-only only.
select 'student_user_id_column' as check_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name = 'student_user_id';
select 'student_identity_constraints' as check_name, conname from pg_constraint where conname in ('alunos_student_user_id_fkey', 'perfis_role_check');
select 'student_identity_indexes' as check_name, indexname from pg_indexes where schemaname = 'public' and indexname in ('alunos_student_user_id_uidx', 'alunos_student_user_id_idx');
select 'required_fields_not_null' as check_name, column_name, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('created_at', 'user_id', 'whatsapp');
select 'workout_delivery_columns' as check_name, column_name from information_schema.columns where table_schema = 'public' and table_name = 'treinos' and column_name in ('lifecycle_status', 'delivered_at', 'completed_at', 'archived_at', 'application_idempotency_key');
select 'workout_delivery_events' as check_name, table_name from information_schema.tables where table_schema = 'public' and table_name = 'treino_eventos';
select 'aoe_anon_execute' as check_name, routine_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'aoe_idempotency_get_or_create' and grantee = 'anon';
select 'group_a_grants' as check_name, routine_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'set_workout_templates_updated_at';
select 'rpc_definitions' as check_name, p.proname, p.prosecdef, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('vincular_aluno_usuario', 'desvincular_aluno_usuario', 'get_my_student_workouts', 'entregar_treino', 'alterar_estado_treino');
`;
  readOnlySqlValidation(pre);
  readOnlySqlValidation(post);
  writeFileSync(join(root, REPORT_DIR, "production-cutover-prechecks.sql"), pre, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-cutover-postchecks.sql"), post, "utf8");
}

function writeReports(root, result, inventory, graph, sequence, matrix) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  writeFileSync(join(root, REPORT_DIR, "production-package-migration-inventory.json"), `${JSON.stringify({ migration_count: inventory.length, migrations: inventory }, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-package-migration-inventory.md"), `# Production Package Migration Inventory

Migration count: \`${inventory.length}\`

| Migration | Domain | Classification | Strategy | Risk |
| --- | --- | --- | --- | --- |
${inventory.map((m) => `| \`${m.filename}\` | ${m.domain} | \`${m.remote_applicability_status}\` | \`${m.apply_strategy}\` | ${m.risk_level} |`).join("\n")}
`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-package-dependency-graph.json"), `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-cutover-sequence.json"), `${JSON.stringify(sequence, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-cutover-sequence.md"), `# Production Cutover Sequence

${sequence.map((s) => `## ${s.id} ${s.operation}

- Source: \`${s.migration_source}\`
- Apply method: \`${s.apply_method}\`
- Precheck: ${s.precheck}
- Postcheck: ${s.postcheck}
- Rollback: ${s.rollback_strategy}
- Stop: ${s.stop_condition}
- Risk: \`${s.risk}\`
`).join("\n")}
`, "utf8");
  writeCsv(join(root, REPORT_DIR, "production-reconciliation-package-matrix.csv"), matrix, ["step", "migration", "domain", "object", "remote_current_state", "target_state", "apply_strategy", "precheck", "risk", "rollback", "postcheck", "cutover_blocker", "history_dependency"]);
  writeFileSync(join(root, REPORT_DIR, "production-cutover-recovery-plan.md"), `# Production Cutover Recovery Plan

- Take a verified backup/snapshot immediately before cutover.
- Capture current function definitions, policies, grants, constraints and indexes before each step.
- Stop on any failed precheck, changed body hash, unexpected null count, incompatible existing object or failed runtime smoke test.
- Baseline is reference-only; accidental baseline replay requires immediate stop and restore decision.
- Required fields rollback may require dropping NOT NULL only after explicit approval.
- Student Identity rollback must preserve any production link data or restore from backup if links were created.
- Security/policy rollback restores captured policy and grant definitions.
- AOE and Group A hardening rollback restores only grants/function metadata if emergency compatibility requires it.
- No migration repair or history alignment occurs until schema convergence is proven after cutover.
`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-reconciliation-package-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "production-reconciliation-package-summary.md"), `# Production Reconciliation Package

Decision: \`${result.decision}\`

LOCAL_SCHEMA_READY: \`YES\`

CUTOVER_SEQUENCE_READY: \`YES\`

PRECHECKS_READY: \`YES\`

POSTCHECKS_READY: \`YES\`

RECOVERY_PLAN_READY: \`YES\`

PRODUCTION_EXECUTION_AUTHORIZED: \`NO\`

DB_PUSH_ALLOWED_NOW: \`NO\`

HISTORY_ALIGNMENT_REQUIRED: \`YES\`

HISTORY_ALIGNMENT_ALLOWED_NOW: \`NO\`

Next safe group: \`${NEXT_SAFE_GROUP}\`
`, "utf8");
  writeFileSync(join(root, DOC_PATH), `# Production Reconciliation Package Design

## Objective

Prepare a finite supervised cutover plan from the approved local schema to production without executing remote SQL.

## Current State

Local schema is ready with seven validated migrations. Production remains unreconciled and remote schema equivalence remains blocked until the package is applied.

## Migrations

Seven SQL migrations are in scope. \`README.md\` and \`cutover-manifest.json\` are not migrations.

## Baseline Strategy

\`20260716090000_baseline_aruka_v1.sql\` is \`BASELINE_REFERENCE_ONLY\`. It must not be replayed against existing production.

## Cutover Target

The target is canonical product/security behavior while preserving remote legacy compatibility objects that do not block the package.

## Sequence

Use the sequence in \`reports/supabase-production-sync/production-cutover-sequence.md\`.

## Workout Delivery

Object-level reconciliation is required; do not blindly replay the full migration.

## Student Identity

Controlled SQL file candidate after Workout Delivery dependencies are present.

## Security

Controlled SQL file candidate after referenced objects exist; high authorization risk.

## Required Fields

Controlled SQL file candidate with immediate null-count precheck.

## AOE

Grant hardening only. AOE body remains deferred.

## Group A

Controlled hardening candidate if function/trigger/body hash still match evidence.

## Admin/Financial Exclusions

Admin and financial divergences remain \`KEEP_REMOTE_FOR_NOW\`.

## Prechecks

\`reports/supabase-production-sync/production-cutover-prechecks.sql\` contains read-only checks.

## Apply Strategy

Manual supervised SQL or controlled SQL files per step. \`DB_PUSH_ALLOWED_NOW=NO\`.

## Postchecks

\`reports/supabase-production-sync/production-cutover-postchecks.sql\` contains read-only checks.

## Rollback

Use \`reports/supabase-production-sync/production-cutover-recovery-plan.md\`.

## Stop Conditions

Stop on unexpected precheck, incompatible existing object, null rows before NOT NULL, changed function body, missing signature, or failed smoke test.

## Production Execution

\`PRODUCTION_EXECUTION_AUTHORIZED=NO\`.

## History Alignment

\`HISTORY_ALIGNMENT_REQUIRED=YES\`; \`HISTORY_ALIGNMENT_ALLOWED_NOW=NO\`.

## CI/CD Next Stage

\`NEXT_AFTER_HISTORY_ALIGNMENT=CI_CD_PIPELINE\`.
`, "utf8");
}

export function buildPackage(root = process.cwd()) {
  const inventory = buildMigrationInventory(root);
  const graph = buildDependencyGraph();
  const sequence = buildSequence();
  const matrix = sequence.map((s) => ({
    step: s.id,
    migration: s.migration_source,
    domain: inventory.find((m) => m.filename === s.migration_source)?.domain ?? "BASELINE",
    object: s.operation,
    remote_current_state: s.id === "00" ? "existing production schema" : "known evidence pending/incomplete",
    target_state: s.id === "00" ? "no baseline replay" : "canonical local approved state for this step",
    apply_strategy: s.apply_method,
    precheck: s.precheck,
    risk: s.risk,
    rollback: s.rollback_strategy,
    postcheck: s.postcheck,
    cutover_blocker: s.stop_condition,
    history_dependency: "history alignment after schema convergence only"
  }));
  const result = {
    decision: DECISION,
    migration_count: inventory.length,
    baseline_strategy: "BASELINE_REFERENCE_ONLY",
    direct_apply_candidates: ["student_identity_contract", "reconcile_security_policies_and_grants", "reconcile_alunos_required_fields", "revoke_aoe_idempotency_anon_execute", "harden_workout_templates_updated_at"],
    object_level_reconciliation: ["workout_delivery_integration_v1"],
    blocked_steps: [],
    prechecks_ready: true,
    postchecks_ready: true,
    recovery_plan_ready: true,
    cutover_sequence_ready: true,
    db_push_allowed: "NO",
    history_alignment_required: "YES",
    history_alignment_allowed_now: "NO",
    production_execution_authorized: "NO",
    local_schema_ready: "YES",
    admin_strategy: "KEEP_REMOTE_FOR_NOW",
    financial_strategy: "KEEP_REMOTE_FOR_NOW",
    aoe_body: "DEFER_TO_POST_CUTOVER_AOE_RECONCILIATION",
    remote_overloads: "KEEP_REMOTE_FOR_COMPATIBILITY_DURING_CUTOVER",
    cutover_target_schema: "canonical required product/security schema plus compatible remote legacy extras",
    next_after_history_alignment: "CI_CD_PIPELINE",
    next_safe_group: NEXT_SAFE_GROUP
  };
  validatePackage(result);
  return { result, inventory, graph, sequence, matrix };
}

function main() {
  const root = process.cwd();
  const pkg = buildPackage(root);
  writeSqlFiles(root);
  writeReports(root, pkg.result, pkg.inventory, pkg.graph, pkg.sequence, pkg.matrix);
  console.log(JSON.stringify({
    decision: pkg.result.decision,
    migration_count: pkg.result.migration_count,
    db_push_allowed: pkg.result.db_push_allowed,
    production_execution_authorized: pkg.result.production_execution_authorized,
    next_safe_group: pkg.result.next_safe_group
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
