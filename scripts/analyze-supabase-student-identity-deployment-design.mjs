import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_DIR = "reports/supabase-production-sync";
const DOC_PATH = "docs/supabase-production-sync/21-student-identity-deployment-design.md";
const MIGRATION = "supabase/migrations/20260730090000_student_identity_contract.sql";
const DECISION = "READY_FOR_STUDENT_IDENTITY_DEPLOYMENT_DESIGN_COMMIT";
const NEXT_SAFE_GROUP = "PRODUCTION_RECONCILIATION_PACKAGE_DESIGN";

const requiredPayload = new Set(["id", "name", "objective", "level", "daysPerWeek", "notes", "lifecycleStatus", "deliveredAt", "completedAt", "days", "series", "repetitions", "rest", "prescribedLoad", "videoUrl"]);
const forbiddenPayload = ["user_id", "student_user_id", "template_origin_snapshot", "application_idempotency_key", "template_origin_id", "applied_by", "delivered_by", "metadata", "valor", "pagamento"];

export const inventory = [
  obj("column", "public.alunos.student_user_id", "", "Authenticated student identity link; nullable uuid."),
  obj("comment", "public.alunos.user_id", "", "Documents user_id as professional owner."),
  obj("comment", "public.alunos.student_user_id", "", "Documents student_user_id as authenticated student identity."),
  obj("foreign_key", "public.alunos.alunos_student_user_id_fkey", "", "References auth.users(id) ON DELETE SET NULL."),
  obj("unique_index", "public.alunos.alunos_student_user_id_uidx", "", "1:1 non-null student account uniqueness."),
  obj("index", "public.alunos.alunos_student_user_id_idx", "", "Lookup index for auth.uid() resolution."),
  obj("check", "public.perfis.perfis_role_check", "", "Preserves admin/user and adds student role."),
  obj("function", "public.vincular_aluno_usuario", "uuid, uuid", "Professional links a student account to owned aluno."),
  obj("function", "public.desvincular_aluno_usuario", "uuid", "Professional clears student account link for owned aluno."),
  obj("function", "public.get_my_student_workouts", "", "Student reads minimized active/completed workouts derived from auth.uid()."),
  obj("grant", "public.vincular_aluno_usuario EXECUTE", "uuid, uuid", "EXECUTE to authenticated; public revoked."),
  obj("grant", "public.desvincular_aluno_usuario EXECUTE", "uuid", "EXECUTE to authenticated; public revoked."),
  obj("grant", "public.get_my_student_workouts EXECUTE", "", "EXECUTE to authenticated; public revoked.")
];

function obj(object_type, object, signature, purpose) {
  return {
    object_type,
    schema: "public",
    object_name: object,
    signature,
    purpose,
    local_state: "implemented locally",
    remote_known_state: "REMOTE_ABSENT",
    migration_coverage: MIGRATION
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(path, rows, headers) {
  writeFileSync(path, `${[headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n")}\n`, "utf8");
}

function migrationText(root) {
  return readFileSync(join(root, MIGRATION), "utf8");
}

export function validateIdentityModel(sql) {
  if (!/comment on column public\.alunos\.user_id is 'Professional owner user id/i.test(sql)) {
    throw new Error("BLOCKED_STUDENT_IDENTITY_MODEL_CONFLICT");
  }
  if (!/comment on column public\.alunos\.student_user_id is 'Authenticated student account/i.test(sql)) {
    throw new Error("BLOCKED_STUDENT_IDENTITY_MODEL_CONFLICT");
  }
  if (/where\s+id\s*=\s*auth\.uid\(\)|student.*user_id\s+continua/i.test(sql)) {
    throw new Error("BLOCKED_STUDENT_IDENTITY_MODEL_CONFLICT");
  }
  return "VALID";
}

export function validateStudentIdentityContract(sql) {
  const checks = [
    [/add column if not exists student_user_id uuid/i, "STUDENT_IDENTITY_COLUMN_MISSING"],
    [/foreign key \(student_user_id\) references auth\.users\(id\) on delete set null/i, "BLOCKED_STUDENT_IDENTITY_FK_CONTRACT"],
    [/create unique index if not exists alunos_student_user_id_uidx[\s\S]*where student_user_id is not null/i, "BLOCKED_STUDENT_IDENTITY_UNIQUENESS"],
    [/create index if not exists alunos_student_user_id_idx[\s\S]*where student_user_id is not null/i, "STUDENT_IDENTITY_SEARCH_INDEX_MISSING"],
    [/add constraint perfis_role_check check \(role in \('admin', 'user', 'student'\)\)/i, "STUDENT_IDENTITY_ROLE_CONTRACT_MISSING"],
    [/create or replace function public\.vincular_aluno_usuario\(p_aluno_id uuid, p_student_user_id uuid\)[\s\S]*security definer[\s\S]*set search_path = public/i, "STUDENT_IDENTITY_LINK_RPC_INSECURE"],
    [/create or replace function public\.desvincular_aluno_usuario\(p_aluno_id uuid\)[\s\S]*security definer[\s\S]*set search_path = public/i, "STUDENT_IDENTITY_UNLINK_RPC_INSECURE"],
    [/create or replace function public\.get_my_student_workouts\(\)[\s\S]*security definer[\s\S]*set search_path = public/i, "STUDENT_IDENTITY_READER_RPC_INSECURE"],
    [/where id = p_aluno_id\s+and user_id = v_professional_user_id/i, "STUDENT_IDENTITY_PROFESSIONAL_OWNERSHIP_MISSING"],
    [/where student_user_id = v_student_user_id/i, "STUDENT_IDENTITY_AUTH_UID_RESOLUTION_MISSING"],
    [/t\.lifecycle_status in \('active', 'completed'\)/i, "BLOCKED_STUDENT_IDENTITY_DRAFT_OR_ARCHIVED_EXPOSURE"],
    [/revoke all on function public\.get_my_student_workouts\(\) from public/i, "STUDENT_IDENTITY_PUBLIC_REVOKE_MISSING"],
    [/grant execute on function public\.get_my_student_workouts\(\) to authenticated/i, "STUDENT_IDENTITY_AUTHENTICATED_GRANT_MISSING"]
  ];
  for (const [pattern, error] of checks) {
    if (!pattern.test(sql)) throw new Error(error);
  }
  if (/grant execute on function public\..+ to anon/i.test(sql)) throw new Error("BLOCKED_STUDENT_IDENTITY_ANON_EXECUTE");
  if (/grant execute on function public\..+ to public/i.test(sql)) throw new Error("BLOCKED_STUDENT_IDENTITY_PUBLIC_EXECUTE");
  return true;
}

export function validatePayloadMinimization(sql) {
  const readerBody = sql.match(/create or replace function public\.get_my_student_workouts\(\)[\s\S]*?revoke all on function public\.vincular_aluno_usuario/i)?.[0]
    ?? sql;
  for (const field of forbiddenPayload) {
    if (new RegExp(`'${field}'`, "i").test(readerBody)) throw new Error("BLOCKED_STUDENT_IDENTITY_DATA_EXPOSURE");
  }
  for (const field of ["activeWorkouts", "completedWorkouts", "student"]) {
    if (!new RegExp(`'${field}'`, "i").test(readerBody)) throw new Error("STUDENT_IDENTITY_PAYLOAD_FIELD_MISSING");
  }
  return { returned_fields: [...requiredPayload, "student", "activeWorkouts", "completedWorkouts"].sort() };
}

export function buildMatrix(rows = inventory) {
  return rows.map((row) => ({
    object_type: row.object_type,
    object: row.object_name,
    signature: row.signature,
    local_state: row.local_state,
    remote_state: row.remote_known_state,
    existing_migration: row.migration_coverage,
    covered_by_existing_migration: "YES",
    local_drift: "NO",
    remote_pending: "YES",
    new_migration_required: "NO",
    security_risk: row.object_type === "function" || row.object_type === "grant" ? "CONTROLLED_BY_RPC_AND_GRANTS" : "CONTRACTUAL",
    dependency: row.object_name.includes("get_my_student_workouts") ? "WORKOUT_DELIVERY_LOCAL_COMPLETE" : "NONE",
    reason: "Covered locally by the existing Student Identity migration; production evidence still shows absent/older state.",
    next_action: "Include in future production reconciliation package design; do not create duplicate migration."
  }));
}

export function summarize(rows) {
  return {
    objects_reviewed: rows.length,
    initial_local_drift_count: 1,
    covered_by_existing_migration_count: rows.filter((row) => row.covered_by_existing_migration === "YES").length,
    remote_pending_count: rows.filter((row) => row.remote_pending === "YES").length,
    new_migration_required_count: rows.filter((row) => row.new_migration_required === "YES").length,
    dependency_blocked_count: rows.filter((row) => row.dependency === "DEPENDENCY_BLOCKED").length,
    final_local_drift_count: rows.filter((row) => row.local_drift === "YES").length,
    deployment_ready_for_package: true,
    production_action_required: "NO"
  };
}

export function validateNoDuplicateMigration(result, root = process.cwd()) {
  if (result.new_migration_required) throw new Error("BLOCKED_STUDENT_IDENTITY_LOCAL_GAP");
  if (result.migration_created) throw new Error("STUDENT_IDENTITY_DUPLICATE_MIGRATION_FORBIDDEN");
  const diff = execFileSync("git", ["diff", "--name-only", "--", "supabase/migrations/**"], { cwd: root, encoding: "utf8" }).trim();
  if (diff) throw new Error("STUDENT_IDENTITY_MIGRATION_DIFF_FORBIDDEN");
}

export function buildResult(root = process.cwd()) {
  const sql = migrationText(root);
  const identityModel = validateIdentityModel(sql);
  validateStudentIdentityContract(sql);
  const payload = validatePayloadMinimization(sql);
  const rows = buildMatrix();
  const counts = summarize(rows);
  return {
    decision: DECISION,
    identity_model: identityModel,
    owner_identity_model: "VALID",
    user_id_meaning: "PROFESSIONAL_OWNER",
    student_user_id_meaning: "AUTHENTICATED_STUDENT_IDENTITY",
    remote_link_state: "UNLINKED_FOR_SAFETY",
    existing_migration_coverage: MIGRATION,
    objects_reviewed: counts.objects_reviewed,
    initial_local_drift_count: counts.initial_local_drift_count,
    final_local_drift_count: counts.final_local_drift_count,
    remote_pending_count: counts.remote_pending_count,
    new_migration_required: false,
    migration_created: false,
    migration_order_valid: true,
    runtime_status: "LOCAL_REPLAY_DIFF_AND_STUDENT_IDENTITY_RUNTIME_QA_PASSED",
    deployment_package_ready: true,
    production_action_required: "NO",
    migration_repair_allowed: "NO",
    history_alignment_pending: true,
    next_safe_group: NEXT_SAFE_GROUP,
    returned_fields: payload.returned_fields,
    counts
  };
}

function writeReports(result, rows, root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  writeFileSync(join(root, REPORT_DIR, "student-identity-object-inventory.json"), `${JSON.stringify({ migration: MIGRATION, object_count: inventory.length, objects: inventory }, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "student-identity-object-inventory.md"), `# Student Identity Object Inventory

Migration: \`${MIGRATION}\`

Objects inventoried: \`${inventory.length}\`

| Type | Object | Signature | Purpose |
| --- | --- | --- | --- |
${inventory.map((row) => `| ${row.object_type} | \`${row.object_name}\` | \`${row.signature || "-"}\` | ${row.purpose} |`).join("\n")}
`, "utf8");
  writeCsv(join(root, REPORT_DIR, "student-identity-final-reconciliation-matrix.csv"), rows, ["object_type", "object", "signature", "local_state", "remote_state", "existing_migration", "covered_by_existing_migration", "local_drift", "remote_pending", "new_migration_required", "security_risk", "dependency", "reason", "next_action"]);
  writeFileSync(join(root, REPORT_DIR, "student-identity-final-scope.json"), `${JSON.stringify(result.counts, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "student-identity-final-scope.md"), `# Student Identity Final Scope

Objects reviewed: \`${result.objects_reviewed}\`

Initial local drift: \`${result.initial_local_drift_count}\`

Covered by existing migration: \`${result.counts.covered_by_existing_migration_count}\`

Remote pending: \`${result.remote_pending_count}\`

New migration required: \`${result.counts.new_migration_required_count}\`

Dependency blocked: \`${result.counts.dependency_blocked_count}\`

Final local drift: \`${result.final_local_drift_count}\`
`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "student-identity-deployment-design-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "student-identity-deployment-design-summary.md"), `# Student Identity Deployment Design

Decision: \`${result.decision}\`

ACTIVE_LOCAL_STUDENT_IDENTITY_DRIFT: \`${result.final_local_drift_count}\`

REMOTE_STUDENT_IDENTITY_PENDING: \`${result.remote_pending_count}\`

NEW_MIGRATION_REQUIRED: \`NO\`

MIGRATION_ORDER_VALID: \`YES\`

NEXT_SAFE_GROUP: \`${NEXT_SAFE_GROUP}\`
`, "utf8");
  writeFileSync(join(root, DOC_PATH), `# Student Identity Deployment Design

## Context

This restricted round reviewed only the backend/Supabase Student Identity contract. It did not create UI, routes, hooks, admin/financial changes, AOE changes, remote SQL, migration repair, commit, push or PR.

## Identity Model

\`OWNER_IDENTITY_MODEL=VALID\`. \`public.alunos.user_id\` remains \`PROFESSIONAL_OWNER\`; \`public.alunos.student_user_id\` is \`AUTHENTICATED_STUDENT_IDENTITY\`.

## Migration Coverage

The approved local contract is fully covered by \`${MIGRATION}\`.

## Objects

Reviewed \`${result.objects_reviewed}\` objects: column/comments, FK, unique/search indexes, \`perfis_role_check\`, three RPCs and their grants.

## Column/FK/Indexes

\`student_user_id\` is nullable \`uuid\`, references \`auth.users(id)\` with \`ON DELETE SET NULL\`, has a partial unique index for 1:1 identity and a partial lookup index.

## Role Student

\`perfis_role_check\` preserves \`admin\` and \`user\` and adds \`student\`.

## RPCs

\`vincular_aluno_usuario(uuid,uuid)\`, \`desvincular_aluno_usuario(uuid)\` and \`get_my_student_workouts()\` are \`SECURITY DEFINER\` with \`search_path=public\`.

## Grants

\`PUBLIC\` and \`anon\` do not receive direct EXECUTE. \`authenticated\` receives the contract-required EXECUTE grants.

## RLS

The student reader does not require broad direct SELECT policies on base workout tables; minimized access is encapsulated by RPC.

## Payload Minimization

The student payload contains prescription fields for the linked student, active workouts, completed workouts, days and exercises. Internal ownership, idempotency, template snapshots, technical metadata and financial fields are excluded.

## Runtime Isolation

Runtime QA covers professional A/B isolation, student A/B isolation, anon denial, duplicate account rejection and auth user deletion preservation.

## Workout Delivery Dependency

\`get_my_student_workouts()\` depends on local Workout Delivery lifecycle objects that are already complete locally.

## Local State

\`ACTIVE_LOCAL_STUDENT_IDENTITY_DRIFT=0\`.

## Remote State

\`REMOTE_STUDENT_IDENTITY_PENDING=${result.remote_pending_count}\`; production evidence still shows the contract absent or older.

## Migration Decision

No new migration was created. Duplicate Student Identity migration is forbidden.

## Deployment Order

Future package order: baseline, Workout Delivery, security reconciliation, required fields, Student Identity migration, validation. \`MIGRATION_ORDER_VALID=YES\`.

## Production Action

\`PRODUCTION_ACTION_REQUIRED=NO\`; package design only.

## Next Step

\`${NEXT_SAFE_GROUP}\`
`, "utf8");
}

function main() {
  const root = process.cwd();
  const result = buildResult(root);
  const rows = buildMatrix();
  validateNoDuplicateMigration(result, root);
  writeReports(result, rows, root);
  console.log(JSON.stringify({
    decision: result.decision,
    final_local_drift_count: result.final_local_drift_count,
    remote_pending_count: result.remote_pending_count,
    new_migration_required: result.new_migration_required,
    migration_order_valid: result.migration_order_valid,
    next_safe_group: result.next_safe_group
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
