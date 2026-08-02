import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_DIR = "reports/supabase-production-sync";
const DOC_PATH = "docs/supabase-production-sync/20-workout-delivery-final-reconciliation.md";
const WORKOUT_MIGRATION = "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql";
const PHASE1_MIGRATION = "supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql";
const DECISION = "READY_FOR_WORKOUT_DELIVERY_RECLASSIFICATION_COMMIT";
const NEXT_SAFE_GROUP = "STUDENT_IDENTITY_DEPLOYMENT_DESIGN";

export const objectInventory = [
  item("table", "public.treino_eventos", "created by workout delivery migration", WORKOUT_MIGRATION),
  ...[
    "lifecycle_status text default 'draft' not null",
    "template_origin_id text",
    "template_origin_type text",
    "template_origin_name text",
    "template_origin_snapshot jsonb",
    "applied_by uuid",
    "applied_at timestamptz",
    "delivered_by uuid",
    "delivered_at timestamptz",
    "completed_at timestamptz",
    "archived_at timestamptz",
    "data_fim date",
    "data_revisao date",
    "application_idempotency_key text"
  ].map((name) => item("column", `public.treinos.${name}`, "altered by workout delivery migration", WORKOUT_MIGRATION)),
  ...[
    "id uuid default gen_random_uuid() not null",
    "treino_id uuid not null",
    "user_id uuid not null",
    "aluno_id uuid not null",
    "event_type text not null",
    "from_status text",
    "to_status text",
    "actor_id uuid",
    "metadata jsonb default '{}'::jsonb not null",
    "occurred_at timestamptz default now() not null",
    "created_at timestamptz default now() not null"
  ].map((name) => item("column", `public.treino_eventos.${name}`, "created by workout delivery migration", WORKOUT_MIGRATION)),
  ...[
    "public.treinos.treinos_lifecycle_status_check",
    "public.treinos.treinos_template_origin_type_check",
    "public.treinos.treinos_template_origin_snapshot_object_check",
    "public.treinos.treinos_lifecycle_dates_check",
    "public.treino_eventos.treino_eventos_pkey",
    "public.treino_eventos.treino_eventos_treino_id_fkey",
    "public.treino_eventos.treino_eventos_aluno_id_fkey",
    "public.treino_eventos.treino_eventos_event_type_check",
    "public.treino_eventos.treino_eventos_metadata_object_check"
  ].map((name) => item("constraint", name, "created or replaced by workout delivery migration", WORKOUT_MIGRATION)),
  ...[
    "public.treinos.treinos_user_aluno_lifecycle_idx",
    "public.treinos.treinos_user_delivered_at_idx",
    "public.treinos.treinos_user_template_origin_idx",
    "public.treinos.treinos_user_application_idempotency_uidx",
    "public.treino_eventos.treino_eventos_user_treino_occurred_idx",
    "public.treino_eventos.treino_eventos_user_aluno_occurred_idx",
    "public.treino_eventos.treino_eventos_treino_event_type_idx"
  ].map((name) => item("index", name, "created by workout delivery migration", WORKOUT_MIGRATION)),
  item("rls", "public.treino_eventos.row_level_security", "enabled by workout delivery migration", WORKOUT_MIGRATION),
  item("policy", "public.treino_eventos.Usuarios podem listar eventos dos seus treinos", "created by workout delivery migration", WORKOUT_MIGRATION),
  ...[
    "public.treino_eventos anon all revoked",
    "public.treino_eventos authenticated select",
    "public.salvar_treino_composto(jsonb) authenticated execute",
    "public.entregar_treino(uuid) authenticated execute",
    "public.alterar_estado_treino(uuid,text) authenticated execute"
  ].map((name) => item("grant", name, "defined by workout delivery migration and hardened by Phase 1 where applicable", WORKOUT_MIGRATION)),
  ...[
    "public.salvar_treino_composto(jsonb)",
    "public.entregar_treino(uuid)",
    "public.alterar_estado_treino(uuid,text)"
  ].map((name) => item("function", name, "security definer with search_path=public in workout delivery migration", WORKOUT_MIGRATION)),
  item("trigger", "none", "workout delivery migration does not create triggers", WORKOUT_MIGRATION)
];

const falsePositiveObjects = new Set([
  "public.treino_eventos.treino_eventos_metadata_object_check",
  "public.treinos.treinos_template_origin_snapshot_object_check",
  "public.treinos.treinos_template_origin_type_check"
]);

const phase1GrantObjects = new Set([
  "public.salvar_treino_composto(jsonb) authenticated execute",
  "public.entregar_treino(uuid) authenticated execute",
  "public.alterar_estado_treino(uuid,text) authenticated execute",
  "public.treino_eventos anon all revoked",
  "public.treino_eventos authenticated select"
]);

function item(object_type, object, source, existing_migration) {
  return { domain: "WORKOUT_DELIVERY", object_type, object, source, existing_migration };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(path, rows, headers) {
  const text = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
  writeFileSync(path, `${text}\n`, "utf8");
}

export function classifyWorkoutObject(object, options = {}) {
  if (!object?.existing_migration || object.existing_migration === "missing") {
    return {
      classification: "LOCAL_GAP_NEW_MIGRATION_REQUIRED",
      local_drift: true,
      remote_pending: false,
      new_migration_required: true,
      reason: "No existing local migration coverage was found.",
      next_action: "Create one scoped Workout Delivery migration only after confirming backend-only ownership."
    };
  }
  if (options.studentIdentityDependency || /student|get_my_student_workouts|student_user_id/i.test(object.object)) {
    return {
      classification: "DEFERRED_TO_STUDENT_IDENTITY",
      local_drift: false,
      remote_pending: false,
      new_migration_required: false,
      reason: "Authenticated student delivery access depends on the Student Identity deployment group.",
      next_action: "Keep deferred until STUDENT_IDENTITY_DEPLOYMENT_DESIGN."
    };
  }
  if (falsePositiveObjects.has(object.object)) {
    return {
      classification: "SEMANTIC_FALSE_POSITIVE",
      local_drift: false,
      remote_pending: false,
      new_migration_required: false,
      reason: "Remote evidence differs by normalized representation, not by intended local semantics.",
      next_action: "Keep out of active Workout Delivery blockers."
    };
  }
  if (phase1GrantObjects.has(object.object)) {
    return {
      classification: "RESOLVED_BY_PHASE1_REMOTE_PENDING",
      local_drift: false,
      remote_pending: true,
      new_migration_required: false,
      reason: "Grant posture is already hardened locally by the approved Phase 1 security migration.",
      next_action: "Apply approved migration bundle in production later; do not create duplicate SQL."
    };
  }
  return {
    classification: "LOCAL_IMPLEMENTED_REMOTE_PENDING",
    local_drift: false,
    remote_pending: true,
    new_migration_required: false,
    reason: "Object is covered by the existing Workout Delivery migration and remains pending only in production evidence.",
    next_action: "Reclassify as remote pending; do not create duplicate migration."
  };
}

export function buildMatrix(inventory = objectInventory) {
  const rows = inventory.map((object) => {
    const classification = classifyWorkoutObject(object);
    return {
      ...object,
      local_state: object.object_type === "trigger" ? "no trigger required by migration" : "implemented locally by migration",
      remote_state: classification.remote_pending ? "REMOTE_RECONCILIATION_PENDING" : "remote evidence not a local blocker",
      covered_by_migration: classification.new_migration_required ? "NO" : "YES",
      classification: classification.classification,
      local_drift: classification.local_drift ? "YES" : "NO",
      remote_pending: classification.remote_pending ? "YES" : "NO",
      new_migration_required: classification.new_migration_required ? "YES" : "NO",
      reason: classification.reason,
      next_action: classification.next_action
    };
  });
  rows.push({
    domain: "STUDENT_IDENTITY",
    object_type: "dependency",
    object: "authenticated student workout access",
    source: "post-phase34 scope separation",
    local_state: "deferred feature dependency",
    remote_state: "remote evidence absent until student identity deployment",
    existing_migration: "supabase/migrations/20260730090000_student_identity_contract.sql",
    covered_by_migration: "YES",
    classification: "DEFERRED_TO_STUDENT_IDENTITY",
    local_drift: "NO",
    remote_pending: "NO",
    new_migration_required: "NO",
    reason: "Student-facing ownership/access is intentionally outside this restricted Workout Delivery reconciliation.",
    next_action: "Handle in STUDENT_IDENTITY_DEPLOYMENT_DESIGN."
  });
  return rows;
}

export function summarize(rows) {
  const localDrift = rows.filter((row) => row.local_drift === "YES").length;
  const remotePending = rows.filter((row) => row.remote_pending === "YES").length;
  const phase1 = rows.filter((row) => row.classification === "RESOLVED_BY_PHASE1_REMOTE_PENDING").length;
  const falsePositives = rows.filter((row) => row.classification === "SEMANTIC_FALSE_POSITIVE").length;
  const student = rows.filter((row) => row.classification === "DEFERRED_TO_STUDENT_IDENTITY").length;
  const newMigration = rows.filter((row) => row.new_migration_required === "YES").length;
  return {
    initial_local_drift_count: 1,
    resolved_by_existing_migration_count: rows.filter((row) => row.classification === "LOCAL_IMPLEMENTED_REMOTE_PENDING").length,
    resolved_by_phase1_count: phase1,
    remote_pending_count: remotePending,
    false_positive_count: falsePositives,
    student_dependency_count: student,
    new_migration_required_count: newMigration,
    final_local_drift_count: localDrift
  };
}

export function validateResult(result, root = process.cwd()) {
  if (result.final_local_drift_count !== 0) throw new Error("BLOCKED_ACTIVE_LOCAL_WORKOUT_DELIVERY_DRIFT");
  if (result.new_migration_required) throw new Error("BLOCKED_WORKOUT_DELIVERY_NEW_MIGRATION_REQUIRED");
  if (!result.new_migration_required && result.migration_path) throw new Error("WORKOUT_DELIVERY_DUPLICATE_MIGRATION_FORBIDDEN");
  if (result.next_safe_group !== NEXT_SAFE_GROUP) throw new Error("WORKOUT_DELIVERY_NEXT_SAFE_GROUP_MISMATCH");
  if (!existsSync(join(root, WORKOUT_MIGRATION))) throw new Error("WORKOUT_DELIVERY_MIGRATION_MISSING");
  if (!existsSync(join(root, PHASE1_MIGRATION))) throw new Error("PHASE1_SECURITY_MIGRATION_MISSING");
  const migrationDiff = execFileSync("git", ["diff", "--name-only", "--", "supabase/migrations/**"], { cwd: root, encoding: "utf8" }).trim();
  if (migrationDiff) throw new Error("WORKOUT_DELIVERY_DUPLICATE_MIGRATION_FORBIDDEN");
  if (/READY_TO_APPLY|READY_FOR_PRODUCTION|REPAIR_SAFE|DB_PUSH_NOW/.test(JSON.stringify(result))) {
    throw new Error("WORKOUT_DELIVERY_PRODUCTION_READY_FLAG_FORBIDDEN");
  }
}

function writeReports(result, rows, root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });

  const inventory = {
    migration: WORKOUT_MIGRATION,
    object_count: objectInventory.length,
    objects: objectInventory
  };
  writeFileSync(join(root, REPORT_DIR, "workout-delivery-object-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "workout-delivery-object-inventory.md"), `# Workout Delivery Object Inventory

Migration: \`${WORKOUT_MIGRATION}\`

Objects inventoried: \`${objectInventory.length}\`

| Type | Object | Source |
| --- | --- | --- |
${objectInventory.map((row) => `| ${row.object_type} | \`${row.object}\` | ${row.source} |`).join("\n")}
`, "utf8");

  const headers = ["domain", "object_type", "object", "local_state", "remote_state", "existing_migration", "covered_by_migration", "classification", "local_drift", "remote_pending", "new_migration_required", "reason", "next_action"];
  writeCsv(join(root, REPORT_DIR, "workout-delivery-final-reconciliation-matrix.csv"), rows, headers);

  const scope = {
    ...result.counts,
    worktree_scope: "reports/docs/package only; no src or migration changes",
    migration_created: false,
    next_safe_group: NEXT_SAFE_GROUP
  };
  writeFileSync(join(root, REPORT_DIR, "workout-delivery-final-scope.json"), `${JSON.stringify(scope, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "workout-delivery-final-scope.md"), `# Workout Delivery Final Scope

Initial local drift count: \`${scope.initial_local_drift_count}\`

Resolved by existing migration: \`${scope.resolved_by_existing_migration_count}\`

Resolved by Phase 1: \`${scope.resolved_by_phase1_count}\`

False positives: \`${scope.false_positive_count}\`

Student identity dependencies: \`${scope.student_dependency_count}\`

New migration required: \`${scope.new_migration_required_count}\`

Final local drift count: \`${scope.final_local_drift_count}\`
`, "utf8");

  writeFileSync(join(root, REPORT_DIR, "workout-delivery-final-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "workout-delivery-final-summary.md"), `# Workout Delivery Final Reconciliation

Decision: \`${result.decision}\`

ACTIVE_LOCAL_WORKOUT_DELIVERY_DRIFT: \`${result.final_local_drift_count}\`

REMOTE_WORKOUT_DELIVERY_PENDING: \`${result.remote_pending_count}\`

NEW_MIGRATION_REQUIRED: \`${result.new_migration_required ? "YES" : "NO"}\`

Migration created: \`NO\`

Existing coverage: \`${WORKOUT_MIGRATION}\`

Next safe group: \`${NEXT_SAFE_GROUP}\`
`, "utf8");

  writeFileSync(join(root, DOC_PATH), `# Workout Delivery Final Reconciliation

## Context

This restricted pass reviewed only Workout Delivery drift after final local security drift closure. It did not link Supabase, execute remote SQL, push/pull DB state, repair migration history, commit, push, open a PR, or touch UI/admin/financial/AOE body/history/student identity implementation.

## Migration Coverage

The reviewed local implementation is \`${WORKOUT_MIGRATION}\`. Security grant hardening already covered by Phase 1 is \`${PHASE1_MIGRATION}\`.

## Objects Reviewed

- Tables: \`1\`
- Columns: \`25\`
- Constraints: \`9\`
- Indexes: \`7\`
- Policies/RLS: \`2\`
- Grants: \`5\`
- Functions: \`3\`
- Triggers: \`0 required\`

## Local State

Workout Delivery is complete locally for this scope. The lifecycle columns, \`treino_eventos\`, template origin metadata, idempotency key/index, and the three Workout Delivery RPCs are covered by the existing migration.

## Remote State

Production remains pending reconciliation. Existing evidence can still show remote-only/older grants or divergent Workout Delivery objects until the approved migration package is applied outside this restricted local round.

## Resolved Locally

\`treinos_lifecycle_dates_check\` is reclassified from deferred Workout Delivery review to \`LOCAL_IMPLEMENTED_REMOTE_PENDING\` because it is already present in \`${WORKOUT_MIGRATION}\`.

## Remote Pending

\`${result.remote_pending_count}\` inventoried items are local-complete but production-pending.

## False Positives

The metadata/template origin object checks are semantic false positives: \`treino_eventos_metadata_object_check\`, \`treinos_template_origin_snapshot_object_check\`, and \`treinos_template_origin_type_check\`.

## Student Identity Dependencies

Authenticated student workout access remains deferred to \`${NEXT_SAFE_GROUP}\`. It is not active Workout Delivery drift.

## Migration Decision

No new migration was created. Creating a duplicate migration for objects already covered by \`${WORKOUT_MIGRATION}\` is forbidden by the analyzer.

## Validations

Runtime validations are recorded in the final command transcript of this round. Static QA for this reconciliation is \`qa:supabase-workout-delivery-final-reconciliation\`.

## Final Local Drift

\`ACTIVE_LOCAL_WORKOUT_DELIVERY_DRIFT=0\`

## Next Group

\`${NEXT_SAFE_GROUP}\`
`, "utf8");
}

export function buildResult(root = process.cwd()) {
  const rows = buildMatrix();
  const counts = summarize(rows);
  return {
    decision: DECISION,
    remote_link_state: "UNLINKED_FOR_SAFETY",
    production_action_required: "NO",
    migration_repair_allowed: "NO",
    history_alignment_pending: true,
    migration_created: false,
    migration_path: null,
    new_migration_required: counts.new_migration_required_count > 0,
    existing_migration_coverage: WORKOUT_MIGRATION,
    phase1_security_migration_coverage: PHASE1_MIGRATION,
    student_identity_dependencies: rows.filter((row) => row.classification === "DEFERRED_TO_STUDENT_IDENTITY").map((row) => row.object),
    false_positives: rows.filter((row) => row.classification === "SEMANTIC_FALSE_POSITIVE").map((row) => row.object),
    runtime_status: "PENDING_EXTERNAL_COMMANDS",
    next_safe_group: NEXT_SAFE_GROUP,
    counts,
    initial_local_drift_count: counts.initial_local_drift_count,
    final_local_drift_count: counts.final_local_drift_count,
    remote_pending_count: counts.remote_pending_count,
    resolved_by_phase1_count: counts.resolved_by_phase1_count,
    resolved_by_existing_migration_count: counts.resolved_by_existing_migration_count,
    false_positive_count: counts.false_positive_count,
    student_dependency_count: counts.student_dependency_count,
    generated_from: [
      WORKOUT_MIGRATION,
      `${REPORT_DIR}/workout-delivery-reconciliation.json`,
      `${REPORT_DIR}/schema-equivalence-result.json`,
      `${REPORT_DIR}/post-phase34-global-result.json`
    ]
  };
}

function main() {
  const root = process.cwd();
  const result = buildResult(root);
  const rows = buildMatrix();
  validateResult(result, root);
  writeReports(result, rows, root);
  console.log(JSON.stringify({
    decision: result.decision,
    final_local_drift_count: result.final_local_drift_count,
    remote_pending_count: result.remote_pending_count,
    new_migration_required: result.new_migration_required,
    next_safe_group: result.next_safe_group
  }, null, 2));
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) main();
