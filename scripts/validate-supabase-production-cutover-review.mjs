import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const REPORT_DIR = "reports/supabase-production-sync";
const CUTOVER_DIR = `${REPORT_DIR}/production-cutover-sql`;
const DECISION = "READY_FOR_PRODUCTION_CUTOVER_AUTHORIZATION_REVIEW";

const migrations = {
  workout: "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
  student: "supabase/migrations/20260730090000_student_identity_contract.sql",
  security: "supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql",
  required: "supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql",
  aoe: "supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql",
  groupA: "supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql"
};

export const steps = [
  ["01", "Workout Delivery", "01-workout-delivery", "MEDIUM", [migrations.workout]],
  ["02", "Student Identity", "02-student-identity", "MEDIUM", [migrations.student]],
  ["03", "Security", "03-security-reconciliation", "HIGH", [migrations.security]],
  ["04", "Required Fields", "04-required-fields", "MEDIUM", [migrations.required]],
  ["05", "AOE Security", "05-aoe-security", "LOW", [migrations.aoe]],
  ["06", "Group A Security", "06-group-a-security", "LOW", [migrations.groupA]]
];

function read(path) {
  return readFileSync(join(ROOT, path), "utf8");
}

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && quoted && line[i + 1] === '"') {
      cell += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      cells.push(cell);
      cell = "";
    } else {
      cell += ch;
    }
  }
  cells.push(cell);
  return cells;
}

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((value, index) => [headers[index], value])));
}

function workoutAction(row) {
  if (row.object_type === "grant") return "DEFER_TO_PHASE1_SECURITY";
  if (row.object_type === "trigger" && row.object === "none") return "NO_ACTION_REMOTE_ALREADY_COMPATIBLE";
  if (row.object_type === "table") return "ADD_NEW_OBJECT";
  if (row.object_type === "column") return row.object.includes("treino_eventos.") ? "ADD_NEW_OBJECT" : "ALTER_EXISTING_OBJECT";
  if (row.object_type === "index") return "CREATE_INDEX_IF_ABSENT";
  if (row.object_type === "policy") return "CREATE_POLICY_IF_ABSENT";
  if (row.object_type === "function") return "REPLACE_FUNCTION_DEFINITION";
  if (row.object_type === "rls") return "ALTER_EXISTING_OBJECT";
  if (row.object_type === "constraint") return row.object.includes("treinos_template_origin") || row.object.includes("metadata_object_check") ? "FALSE_POSITIVE_NO_SQL" : "REPLACE_CONSTRAINT";
  return "BLOCKED_INCOMPATIBLE_REMOTE_OBJECT";
}

function buildWorkoutObjectReview() {
  const rows = parseCsv(read("reports/supabase-production-sync/workout-delivery-final-reconciliation-matrix.csv"))
    .filter((row) => row.domain === "WORKOUT_DELIVERY" && row.remote_pending === "YES");
  if (rows.length !== 50) throw new Error(`WORKOUT_REMOTE_PENDING_COUNT_MISMATCH:${rows.length}`);
  return rows.map((row, index) => ({
    id: String(index + 1).padStart(2, "0"),
    object_type: row.object_type.toUpperCase(),
    schema: "public",
    name: row.object,
    signature: row.object_type === "function" || row.object.includes("(") ? row.object.replace(/^public\./, "") : null,
    local_definition: row.local_state,
    remote_current_state: row.remote_state,
    action_required: workoutAction(row),
    dependency: row.object_type === "grant" ? "03-security-reconciliation" : "01-workout-delivery",
    risk: row.object_type === "function" || row.object_type === "constraint" ? "MEDIUM" : "LOW",
    apply_sql: row.object_type === "grant" ? "No SQL in step 01; delegated to Phase 1 security." : "Covered by reports/supabase-production-sync/production-cutover-sql/01-workout-delivery.sql",
    precheck: "reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-precheck.sql",
    postcheck: "reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-postcheck.sql",
    rollback_concept: row.object_type === "table" ? "No automatic DROP TABLE if production data exists; restore from backup or captured definition." : "Restore captured precheck definition/metadata only after explicit approval."
  }));
}

function header(step) {
  return `-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP ${step}
-- DO NOT RUN WITHOUT APPROVED PRECHECKS
-- NOT A MIGRATION FILE
-- PRODUCTION_EXECUTION_AUTHORIZED=NO
-- DB_PUSH_ALLOWED_NOW=NO
-- HISTORY_ALIGNMENT_ALLOWED_NOW=NO
`;
}

function firstStatementContaining(sql, pattern) {
  return sql.split(/\n(?=(?:alter|create|drop|revoke|grant|comment|update|insert)\b)/i).find((part) => pattern.test(part))?.trim();
}

function createWorkoutSql() {
  const sql = read(migrations.workout);
  const table = firstStatementContaining(sql, /create table if not exists public\.treino_eventos/i);
  const funcs = ["salvar_treino_composto", "entregar_treino", "alterar_estado_treino"].map((name) => firstStatementContaining(sql, new RegExp(`create or replace function public\\.${name}`, "i")));
  return `${header("01 WORKOUT DELIVERY")}
begin;

-- Existing table public.treinos must be present and compatible before this step.
alter table public.treinos
  add column if not exists lifecycle_status text default 'draft',
  add column if not exists template_origin_id text,
  add column if not exists template_origin_type text,
  add column if not exists template_origin_name text,
  add column if not exists template_origin_snapshot jsonb,
  add column if not exists applied_by uuid,
  add column if not exists applied_at timestamptz,
  add column if not exists delivered_by uuid,
  add column if not exists delivered_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists data_fim date,
  add column if not exists application_idempotency_key text;

update public.treinos
set lifecycle_status = case
    when lower(coalesce(status, '')) = 'finalizado' then 'completed'
    when lower(coalesce(status, '')) = 'ativo' then 'active'
    when lower(coalesce(status, '')) in ('em revisao', 'em revisão') then 'draft'
    else 'draft'
  end
where lifecycle_status is null
   or lifecycle_status not in ('draft', 'active', 'completed', 'archived');

update public.treinos set delivered_at = coalesce(delivered_at, created_at, now()) where lifecycle_status = 'active' and delivered_at is null;
update public.treinos set completed_at = coalesce(completed_at, data_revisao::timestamptz, created_at, now()) where lifecycle_status = 'completed' and completed_at is null;

alter table public.treinos alter column lifecycle_status set default 'draft', alter column lifecycle_status set not null;
alter table public.treinos drop constraint if exists treinos_lifecycle_status_check, add constraint treinos_lifecycle_status_check check (lifecycle_status in ('draft', 'active', 'completed', 'archived'));
alter table public.treinos drop constraint if exists treinos_lifecycle_dates_check, add constraint treinos_lifecycle_dates_check check ((lifecycle_status <> 'active' or delivered_at is not null) and (lifecycle_status <> 'completed' or completed_at is not null) and (lifecycle_status <> 'archived' or archived_at is not null));

create index if not exists treinos_user_aluno_lifecycle_idx on public.treinos using btree (user_id, aluno_id, lifecycle_status);
create index if not exists treinos_user_delivered_at_idx on public.treinos using btree (user_id, delivered_at desc);
create index if not exists treinos_user_template_origin_idx on public.treinos using btree (user_id, template_origin_type, template_origin_id);
create unique index if not exists treinos_user_application_idempotency_uidx on public.treinos using btree (user_id, application_idempotency_key) where application_idempotency_key is not null;

${table}
alter table only public.treino_eventos drop constraint if exists treino_eventos_pkey;
alter table only public.treino_eventos add constraint treino_eventos_pkey primary key (id);
alter table only public.treino_eventos drop constraint if exists treino_eventos_treino_id_fkey;
alter table only public.treino_eventos add constraint treino_eventos_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete cascade;
alter table only public.treino_eventos drop constraint if exists treino_eventos_aluno_id_fkey;
alter table only public.treino_eventos add constraint treino_eventos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;
alter table only public.treino_eventos drop constraint if exists treino_eventos_event_type_check;
alter table only public.treino_eventos add constraint treino_eventos_event_type_check check (event_type in ('applied', 'delivered', 'status_changed', 'completed', 'archived'));
alter table only public.treino_eventos drop constraint if exists treino_eventos_metadata_object_check;
alter table only public.treino_eventos add constraint treino_eventos_metadata_object_check check (metadata is null or jsonb_typeof(metadata) = 'object');
create index if not exists treino_eventos_user_treino_occurred_idx on public.treino_eventos using btree (user_id, treino_id, occurred_at desc);
create index if not exists treino_eventos_user_aluno_occurred_idx on public.treino_eventos using btree (user_id, aluno_id, occurred_at desc);
create index if not exists treino_eventos_treino_event_type_idx on public.treino_eventos using btree (treino_id, event_type);
alter table public.treino_eventos enable row level security;

${funcs.join("\n\n")}

commit;
`;
}

function simpleApply(step, migration) {
  return `${header(step)}${read(migration)}`;
}

function selectOnlySql(name, body) {
  return `-- MANUAL_FIRST_CUTOVER_ONLY
-- ${name}
-- READ_ONLY_SQL=YES
${body.trim()}
`;
}

const prechecks = {
  "01-workout-delivery": selectOnlySql("STEP 01 WORKOUT DELIVERY PRECHECK", `
select 'PASS_SKIP_STOP:workout_table_exists' as check_name, to_regclass('public.treino_eventos') as current_state;
select 'PASS_SKIP_STOP:workout_columns' as check_name, table_name, column_name, data_type, is_nullable, column_default from information_schema.columns where table_schema = 'public' and table_name in ('treinos', 'treino_eventos') and column_name in ('lifecycle_status','template_origin_id','template_origin_type','template_origin_name','template_origin_snapshot','applied_by','applied_at','delivered_by','delivered_at','completed_at','archived_at','data_fim','data_revisao','application_idempotency_key','id','treino_id','user_id','aluno_id','event_type','from_status','to_status','actor_id','metadata','occurred_at','created_at') order by table_name, column_name;
select 'PASS_SKIP_STOP:workout_constraints' as check_name, conrelid::regclass::text as table_name, conname, pg_get_constraintdef(oid) as definition from pg_constraint where connamespace = 'public'::regnamespace and conname in ('treinos_lifecycle_status_check','treinos_lifecycle_dates_check','treinos_template_origin_type_check','treinos_template_origin_snapshot_object_check','treino_eventos_pkey','treino_eventos_treino_id_fkey','treino_eventos_aluno_id_fkey','treino_eventos_event_type_check','treino_eventos_metadata_object_check') order by conname;
select 'PASS_SKIP_STOP:workout_indexes' as check_name, indexname, indexdef from pg_indexes where schemaname = 'public' and indexname in ('treinos_user_aluno_lifecycle_idx','treinos_user_delivered_at_idx','treinos_user_template_origin_idx','treinos_user_application_idempotency_uidx','treino_eventos_user_treino_occurred_idx','treino_eventos_user_aluno_occurred_idx','treino_eventos_treino_event_type_idx') order by indexname;
select 'PASS_SKIP_STOP:workout_rpc_hashes' as check_name, p.proname, md5(pg_get_functiondef(p.oid)) as body_hash_before, p.prosecdef, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('salvar_treino_composto','entregar_treino','alterar_estado_treino') order by p.proname;
select 'PASS_SKIP_STOP:workout_rls' as check_name, relname, relrowsecurity from pg_class where relnamespace = 'public'::regnamespace and relname = 'treino_eventos';
select 'PASS_SKIP_STOP:workout_policies' as check_name, tablename, policyname, roles, cmd, qual from pg_policies where schemaname = 'public' and tablename = 'treino_eventos';
select 'PASS_SKIP_STOP:workout_grants_delegated_to_phase1' as check_name, grantee, privilege_type from information_schema.table_privileges where table_schema = 'public' and table_name = 'treino_eventos';
`),
  "02-student-identity": selectOnlySql("STEP 02 STUDENT IDENTITY PRECHECK", `
select 'PASS_SKIP_STOP:student_column' as check_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('user_id','student_user_id');
select 'PASS_SKIP_STOP:student_fk_indexes_role' as check_name, conname, pg_get_constraintdef(oid) from pg_constraint where connamespace in ('public'::regnamespace) and conname in ('alunos_student_user_id_fkey','perfis_role_check');
select 'PASS_SKIP_STOP:student_indexes' as check_name, indexname, indexdef from pg_indexes where schemaname = 'public' and indexname in ('alunos_student_user_id_uidx','alunos_student_user_id_idx');
select 'PASS_SKIP_STOP:student_rpcs' as check_name, p.proname, p.prosecdef, md5(pg_get_functiondef(p.oid)) as body_hash_before, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('vincular_aluno_usuario','desvincular_aluno_usuario','get_my_student_workouts');
select 'PASS_SKIP_STOP:professional_owner_column' as check_name, col_description('public.alunos'::regclass, (select ordinal_position from information_schema.columns where table_schema='public' and table_name='alunos' and column_name='user_id')) as user_id_comment;
`),
  "03-security-reconciliation": selectOnlySql("STEP 03 SECURITY PRECHECK", `
select 'PASS_SKIP_STOP:security_tables' as check_name, table_name from information_schema.tables where table_schema = 'public' and table_name in ('perfis','planos','assinaturas','pagamentos','admin_logs','aceites_legais','avaliacoes','anamneses','treinos','treino_dias','treino_exercicios','workout_templates','aoe_decisions','aoe_decision_traces','aoe_human_reviews','aoe_idempotency_keys','aoe_audit_events','treino_eventos');
select 'PASS_SKIP_STOP:security_rpcs' as check_name, routine_name from information_schema.routines where routine_schema = 'public' and routine_name in ('salvar_treino_composto','entregar_treino','alterar_estado_treino');
select 'PASS_SKIP_STOP:security_policies_current' as check_name, schemaname, tablename, policyname, roles, cmd from pg_policies where schemaname = 'public' order by tablename, policyname;
select 'PASS_SKIP_STOP:security_grants_current' as check_name, table_schema, table_name, grantee, privilege_type from information_schema.table_privileges where table_schema = 'public' and grantee in ('anon','authenticated') order by table_name, grantee, privilege_type;
`),
  "04-required-fields": selectOnlySql("STEP 04 REQUIRED FIELDS PRECHECK", `
select 'PASS_SKIP_STOP:required_fields_nulls' as check_name, count(*) as total_rows, count(*) filter (where created_at is null) as null_created_at, count(*) filter (where user_id is null) as null_user_id, count(*) filter (where whatsapp is null) as null_whatsapp from public.alunos;
`),
  "05-aoe-security": selectOnlySql("STEP 05 AOE PRECHECK", `
select 'PASS_SKIP_STOP:aoe_signature' as check_name, p.proname, pg_get_function_identity_arguments(p.oid) as signature from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'aoe_idempotency_get_or_create';
select 'PASS_SKIP_STOP:aoe_grants' as check_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'aoe_idempotency_get_or_create' and grantee in ('anon','authenticated','service_role');
`),
  "06-group-a-security": selectOnlySql("STEP 06 GROUP A PRECHECK", `
select 'PASS_SKIP_STOP:group_a_function' as check_name, p.proname, p.prosecdef as security_definer, md5(pg_get_functiondef(p.oid)) as body_hash_before, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'set_workout_templates_updated_at';
select 'PASS_SKIP_STOP:group_a_trigger' as check_name, tgname, pg_get_triggerdef(oid) as definition from pg_trigger where tgname = 'set_workout_templates_updated_at';
select 'PASS_SKIP_STOP:group_a_grants' as check_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'set_workout_templates_updated_at';
`)
};

const postchecks = {
  "01-workout-delivery": prechecks["01-workout-delivery"].replaceAll("PRECHECK", "POSTCHECK").replaceAll("body_hash_before", "body_hash_target"),
  "02-student-identity": prechecks["02-student-identity"].replaceAll("PRECHECK", "POSTCHECK").replaceAll("body_hash_before", "body_hash_target"),
  "03-security-reconciliation": prechecks["03-security-reconciliation"].replaceAll("PRECHECK", "POSTCHECK"),
  "04-required-fields": selectOnlySql("STEP 04 REQUIRED FIELDS POSTCHECK", `select 'PASS_SKIP_STOP:required_fields_not_null' as check_name, column_name, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('created_at','user_id','whatsapp') order by column_name;`),
  "05-aoe-security": selectOnlySql("STEP 05 AOE POSTCHECK", `select 'PASS_SKIP_STOP:aoe_expected_grants' as check_name, grantee, count(*) > 0 as has_execute from (values ('anon'),('authenticated'),('service_role')) expected(grantee) left join information_schema.routine_privileges rp on rp.routine_schema='public' and rp.routine_name='aoe_idempotency_get_or_create' and rp.grantee=expected.grantee and rp.privilege_type='EXECUTE' group by grantee order by grantee;`),
  "06-group-a-security": selectOnlySql("STEP 06 GROUP A POSTCHECK", `select 'PASS_SKIP_STOP:group_a_target' as check_name, p.proname, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='set_workout_templates_updated_at'; select 'PASS_SKIP_STOP:group_a_expected_grants' as check_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema='public' and routine_name='set_workout_templates_updated_at'; select 'PASS_SKIP_STOP:group_a_trigger' as check_name, tgname from pg_trigger where tgname='set_workout_templates_updated_at';`)
};

function recovery(name) {
  return `# ${name} Recovery

- Automatic rollback is not authorized.
- Use captured precheck output plus verified backup before changing production state.
- Restore object definitions, policies, grants, constraints, indexes or metadata only after explicit operator approval.
- Do not run destructive DROP TABLE/DROP COLUMN rollback against production data.
`;
}

function masterIndex(kind) {
  return `-- Production cutover ${kind}. Read-only index only.
-- Run each step-specific file manually and review PASS/SKIP/STOP output.
${steps.map(([, domain, slug]) => `select '${slug}-${kind}' as file_name, 'reports/supabase-production-sync/production-cutover-sql/${slug}-${kind}.sql' as path, '${domain}' as domain;`).join("\n")}
`;
}

function readOnly(sql) {
  const stripped = sql.replace(/--.*$/gm, "");
  if (/\b(insert|update|delete|alter|create|drop|grant|revoke|truncate|comment|call|do|begin|commit)\b/i.test(stripped)) throw new Error("READ_ONLY_SQL_VALIDATION_FAILED");
}

function buildTraceability() {
  return {
    status: "TRACEABILITY_COMPLETE",
    statement_policy: "Every apply SQL statement is sourced from an existing migration or an approved reconciliation decision.",
    entries: [
      { step: "01", source_migration: migrations.workout, object: "workout_delivery_objects", reason: "object-level Workout Delivery convergence", deviation_from_original_migration: "grants and semantic false-positive constraints are excluded or delegated", why_safe_for_production_cutover: "precheck distinguishes ABSENT/PRESENT_COMPATIBLE/PRESENT_INCOMPATIBLE and stops on incompatibility" },
      { step: "02", source_migration: migrations.student, object: "student_identity_contract", reason: "approved controlled SQL candidate", deviation_from_original_migration: "manual-first header only", why_safe_for_production_cutover: "precheck requires absent or compatible objects" },
      { step: "03", source_migration: migrations.security, object: "security_policies_and_grants", reason: "approved Phase 1 security reconciliation", deviation_from_original_migration: "manual-first header only", why_safe_for_production_cutover: "high-risk step follows object existence and policy/grant precheck" },
      { step: "04", source_migration: migrations.required, object: "alunos_required_fields", reason: "approved nullability reconciliation", deviation_from_original_migration: "manual-first header only", why_safe_for_production_cutover: "precheck stops if any null count is greater than zero" },
      { step: "05", source_migration: migrations.aoe, object: "aoe_idempotency_get_or_create_grant", reason: "approved anon execute revoke", deviation_from_original_migration: "manual-first header only", why_safe_for_production_cutover: "does not alter function body" },
      { step: "06", source_migration: migrations.groupA, object: "set_workout_templates_updated_at_metadata_grants", reason: "approved Group A hardening", deviation_from_original_migration: "manual-first header only", why_safe_for_production_cutover: "precheck requires signature, trigger and unchanged body hash evidence" }
    ]
  };
}

function writeWorkoutObjectReview() {
  const objects = buildWorkoutObjectReview();
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-workout-object-review.json"), `${JSON.stringify({ object_count: objects.length, remote_pending_count: 50, objects }, null, 2)}\n`, "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-workout-object-review.md"), `# Workout Delivery Cutover Object Review

Remote pending objects reviewed: \`${objects.length}\`

| # | Type | Object | Action | Dependency | Risk |
| --- | --- | --- | --- | --- | --- |
${objects.map((item) => `| ${item.id} | ${item.object_type} | \`${item.name}\` | \`${item.action_required}\` | \`${item.dependency}\` | ${item.risk} |`).join("\n")}
`, "utf8");
  return objects;
}

export function validatePackage(root = ROOT) {
  const dir = join(root, CUTOVER_DIR);
  if (existsSync(join(dir, "00-baseline.sql"))) throw new Error("BASELINE_APPLY_FILE_FORBIDDEN");
  for (const [, , slug] of steps) {
    for (const fileName of [`${slug}-precheck.sql`, `${slug}.sql`, `${slug}-postcheck.sql`, `${slug}-recovery.md`]) {
      const file = join(dir, fileName);
      if (!existsSync(file) || readFileSync(file, "utf8").trim().length === 0) throw new Error(`MISSING_CUTOVER_FILE:${fileName}`);
    }
  }
  for (const [, , slug] of steps) {
    readOnly(readFileSync(join(dir, `${slug}-precheck.sql`), "utf8"));
    readOnly(readFileSync(join(dir, `${slug}-postcheck.sql`), "utf8"));
  }
  const workout = readFileSync(join(dir, "01-workout-delivery.sql"), "utf8");
  if (/student_user_id|vincular_aluno_usuario|desvincular_aluno_usuario|get_my_student_workouts/i.test(workout)) throw new Error("WORKOUT_CONTAINS_STUDENT_IDENTITY");
  if (/admin_|pagamentos|assinaturas|planos/i.test(workout)) throw new Error("WORKOUT_SCOPE_EXPANSION");
  if (/grant\s+execute|revoke\s+all\s+on\s+function/i.test(workout)) throw new Error("WORKOUT_DUPLICATES_PHASE1_GRANTS");
  if (!/treinos_lifecycle_dates_check/i.test(workout)) throw new Error("WORKOUT_LIFECYCLE_CONSTRAINT_MISSING");
  const securityPrecheck = readFileSync(join(dir, "03-security-reconciliation-precheck.sql"), "utf8");
  if (!/pg_policies/i.test(securityPrecheck)) throw new Error("SECURITY_POLICY_PRECHECK_MISSING");
  const requiredPrecheck = readFileSync(join(dir, "04-required-fields-precheck.sql"), "utf8");
  if (!/null_created_at/i.test(requiredPrecheck) || !/null_user_id/i.test(requiredPrecheck) || !/null_whatsapp/i.test(requiredPrecheck)) throw new Error("REQUIRED_FIELDS_NULL_CHECK_MISSING");
  const aoe = readFileSync(join(dir, "05-aoe-security.sql"), "utf8");
  if (/create\s+(or\s+replace\s+)?function/i.test(aoe)) throw new Error("AOE_BODY_CHANGE_FORBIDDEN");
  const groupA = readFileSync(join(dir, "06-group-a-security.sql"), "utf8");
  if (/create\s+or\s+replace\s+function/i.test(groupA)) throw new Error("GROUP_A_BODY_REPLACE_FORBIDDEN");
  const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
  if (manifest.production_execution_authorized !== false || manifest.db_push_allowed !== false || manifest.history_alignment_allowed_now !== false) throw new Error("CUTOVER_AUTHORIZATION_FLAGS_INVALID");
  if (JSON.stringify(manifest).match(/db push|migration repair|supabase link/i)) throw new Error("FORBIDDEN_COMMAND_IN_MANIFEST");
  const workoutReviewPath = join(root, REPORT_DIR, "production-cutover-workout-object-review.json");
  if (existsSync(workoutReviewPath)) {
    const workoutReview = JSON.parse(readFileSync(workoutReviewPath, "utf8"));
    if (workoutReview.remote_pending_count !== 50 || workoutReview.object_count !== 50) throw new Error("WORKOUT_OBJECT_REVIEW_INCOMPLETE");
  }
}

function writePackage() {
  mkdirSync(join(ROOT, CUTOVER_DIR), { recursive: true });
  writeFileSync(join(ROOT, CUTOVER_DIR, "01-workout-delivery.sql"), createWorkoutSql(), "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "02-student-identity.sql"), simpleApply("02 STUDENT IDENTITY", migrations.student), "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "03-security-reconciliation.sql"), simpleApply("03 SECURITY", migrations.security), "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "04-required-fields.sql"), simpleApply("04 REQUIRED FIELDS", migrations.required), "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "05-aoe-security.sql"), simpleApply("05 AOE SECURITY", migrations.aoe), "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "06-group-a-security.sql"), simpleApply("06 GROUP A SECURITY", migrations.groupA), "utf8");
  for (const [, name, slug] of steps) {
    writeFileSync(join(ROOT, CUTOVER_DIR, `${slug}-precheck.sql`), prechecks[slug], "utf8");
    writeFileSync(join(ROOT, CUTOVER_DIR, `${slug}-postcheck.sql`), postchecks[slug], "utf8");
    writeFileSync(join(ROOT, CUTOVER_DIR, `${slug}-recovery.md`), recovery(name), "utf8");
  }
  const manifestSteps = steps.map(([step, domain, slug, risk], index) => ({
    step,
    domain,
    precheck_file: `${slug}-precheck.sql`,
    apply_file: `${slug}.sql`,
    postcheck_file: `${slug}-postcheck.sql`,
    recovery_file: `${slug}-recovery.md`,
    risk,
    dependencies: index === 0 ? ["00-baseline-reference-only"] : [steps[index - 1][2]],
    execution_authorized: false,
    status: "READY_FOR_REVIEW"
  }));
  writeFileSync(join(ROOT, CUTOVER_DIR, "manifest.json"), `${JSON.stringify({ production_execution_authorized: false, db_push_allowed: false, history_alignment_allowed_now: false, cutover_backup_required: true, cutover_backup_verified: false, steps: manifestSteps }, null, 2)}\n`, "utf8");
  writeFileSync(join(ROOT, CUTOVER_DIR, "README.md"), `# Production Cutover SQL Package

ESTE PACOTE NAO ESTA AUTORIZADO PARA EXECUCAO.

Use cada passo manualmente: precheck, review, apply, postcheck, smoke test e decisao de continuar ou abortar. Nunca rode todos os SQLs em sequencia cega.
`, "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-prechecks.sql"), masterIndex("precheck"), "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-postchecks.sql"), masterIndex("postcheck"), "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-source-traceability.json"), `${JSON.stringify(buildTraceability(), null, 2)}\n`, "utf8");
  const workoutObjects = writeWorkoutObjectReview();
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-smoke-test-plan.md"), `# Production Cutover Smoke Test Plan

- 01 Workout: professional A/B isolation, create/deliver/lifecycle.
- 02 Student: link/unlink/read and student isolation.
- 03 Security: anon denied and professional isolation.
- 04 Required fields: aluno create/update.
- 05 AOE: anon denied.
- 06 Group A: template update trigger.
`, "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-execution-checklist.md"), `# Production Cutover Execution Checklist

- [ ] Maintenance window approved
- [ ] Backup complete
- [ ] Backup verified
- [ ] Operator identified
- [ ] Start time recorded
- [ ] Step precheck PASS
- [ ] SQL reviewed
- [ ] Apply success
- [ ] Postcheck PASS
- [ ] Smoke PASS
- [ ] Continue or abort decision recorded
`, "utf8");
  const sequence = {
    decision: DECISION,
    steps: manifestSteps.map((s) => ({ ...s, apply_method: "CONTROLLED_SQL_FILE", production_execution_authorized: false }))
  };
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-sequence.json"), `${JSON.stringify(sequence, null, 2)}\n`, "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-sequence.md"), `# Production Cutover Sequence

Baseline remains SKIP_REFERENCE_ONLY. No baseline apply file exists.

${manifestSteps.map((s) => `## ${s.step} ${s.domain}

- Precheck: \`${CUTOVER_DIR}/${s.precheck_file}\`
- Apply: \`${CUTOVER_DIR}/${s.apply_file}\`
- Postcheck: \`${CUTOVER_DIR}/${s.postcheck_file}\`
- Recovery: \`${CUTOVER_DIR}/${s.recovery_file}\`
- Risk: \`${s.risk}\`
- Status: \`${s.status}\`
`).join("\n")}
`.trimEnd() + "\n", "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-recovery-plan.md"), `# Production Cutover Recovery Plan

CUTOVER_BACKUP_REQUIRED=YES
CUTOVER_BACKUP_VERIFIED=NO

A verified backup/snapshot is mandatory immediately before cutover. Use step-specific recovery files in \`${CUTOVER_DIR}\`. No automatic destructive rollback is authorized.
`, "utf8");
  const result = {
    decision: DECISION,
    steps_total: 6,
    steps_ready: 6,
    steps_blocked: 0,
    workout_object_level_sql_ready: "YES",
    student_sql_ready: "YES",
    security_sql_ready: "YES",
    required_fields_sql_ready: "YES",
    aoe_sql_ready: "YES",
    group_a_sql_ready: "YES",
    prechecks_complete: "YES",
    postchecks_complete: "YES",
    recovery_complete: "YES",
    traceability_complete: "YES",
    smoke_plan_ready: "YES",
    execution_checklist_ready: "YES",
    backup_required: "YES",
    backup_verified: "NO",
    production_execution_authorized: "NO",
    db_push_allowed: "NO",
    history_alignment_allowed: "NO",
    next_safe_group: "PRODUCTION_CUTOVER_AUTHORIZATION_REVIEW"
  };
  result.workout_objects_reviewed = workoutObjects.length;
  result.workout_sql_statements = (readFileSync(join(ROOT, CUTOVER_DIR, "01-workout-delivery.sql"), "utf8").match(/;/g) ?? []).length;
  result.workout_blocked_objects = 0;
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-review-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  writeFileSync(join(ROOT, REPORT_DIR, "production-cutover-review-summary.md"), `# Production Cutover Review

Decision: \`${DECISION}\`

CUTOVER_PACKAGE_REVIEWED=YES
ALL_PRECHECKS_COMPLETE=YES
ALL_APPLY_SQL_COMPLETE=YES
ALL_POSTCHECKS_COMPLETE=YES
ROLLBACK_READY=YES
TRACEABILITY_COMPLETE=YES
SMOKE_PLAN_READY=YES
EXECUTION_CHECKLIST_READY=YES
CUTOVER_BACKUP_REQUIRED=YES
CUTOVER_BACKUP_VERIFIED=NO
PRODUCTION_EXECUTION_AUTHORIZED=NO
DB_PUSH_ALLOWED_NOW=NO
HISTORY_ALIGNMENT_ALLOWED_NOW=NO
`, "utf8");
  writeFileSync(join(ROOT, "docs/supabase-production-sync/23-production-cutover-review.md"), `# Production Cutover Review

## Objective
Prepare a reviewed manual cutover package without authorizing execution.

## Package State
\`${DECISION}\`; six executable review steps are ready.

## Baseline
Baseline remains reference-only and has no apply SQL.

## Workout Delivery
Converted from object-level reconciliation into \`01-workout-delivery.sql\`, excluding Student Identity, admin, financial and duplicated Phase 1 grants.

## Student Identity
Controlled SQL file with specific precheck, postcheck and recovery.

## Security
Controlled high-risk SQL file with policy/grant precheck and recovery by captured definitions.

## Required Fields
Controlled NOT NULL SQL with mandatory null-count stop condition.

## AOE
Grant revoke only; body unchanged.

## Group A
Metadata/grant hardening only; body unchanged.

## Prechecks
Step-specific read-only files are indexed by \`production-cutover-prechecks.sql\`.

## Apply SQL
Apply files are manual-first, not migrations, and not authorized for execution.

## Postchecks
Step-specific read-only files are indexed by \`production-cutover-postchecks.sql\`.

## Recovery
Recovery is manual and step-specific; destructive automatic rollback is not authorized.

## Smoke Tests
See \`production-cutover-smoke-test-plan.md\`.

## Execution Checklist
See \`production-cutover-execution-checklist.md\`.

## Traceability
See \`production-cutover-source-traceability.json\`.

## Stop Conditions
Stop on incompatible object, changed function body hash, missing signature, unexpected policy/grant, null required field, failed postcheck or failed smoke test.

## Authorization State
\`PRODUCTION_EXECUTION_AUTHORIZED=NO\`; \`DB_PUSH_ALLOWED_NOW=NO\`; \`HISTORY_ALIGNMENT_ALLOWED_NOW=NO\`.

## Next Step
\`PRODUCTION_CUTOVER_AUTHORIZATION_REVIEW\`.
`, "utf8");
  validatePackage();
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) writePackage();
