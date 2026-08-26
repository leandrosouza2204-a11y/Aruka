import { readFileSync } from "node:fs";

const migration = [
  "supabase/migrations/20260822120000_workout_execution_history_foundation.sql",
  "supabase/migrations/20260824120000_workout_execution_session_local_date.sql",
].map((file) => readFileSync(file, "utf8")).join("\n");
const statements = migration
  .replace(/--.*$/gm, "")
  .split(";")
  .map((statement) => statement.replace(/\s+/g, " ").trim())
  .filter(Boolean);
const checks = [];

add("sessions_rls_enabled", /alter table public\.workout_execution_sessions enable row level security/.test(migration));
add("exercises_rls_enabled", /alter table public\.workout_execution_exercises enable row level security/.test(migration));
add("sets_rls_enabled", /alter table public\.workout_execution_sets enable row level security/.test(migration));
add("student_select_own_only", /a\.id = aluno_id and a\.student_user_id = auth\.uid\(\)/.test(migration));
add("professional_select_own_students_only", /a\.id = aluno_id and a\.user_id = auth\.uid\(\)/.test(migration));
add("student_writes_require_active_access", /student_access_status = 'active'/.test(migration));
add("student_writes_require_in_progress", /s\.status = 'in_progress'/.test(migration) && /status = 'in_progress'/.test(migration));
add("professional_no_write_policy", !statements.some((statement) =>
  /create policy "Professionals/i.test(statement) && /\bfor\s+(insert|update|delete|all)\b/i.test(statement)
));
add("anon_table_access_revoked", [
  "revoke all on table public.workout_execution_sessions from anon",
  "revoke all on table public.workout_execution_exercises from anon",
  "revoke all on table public.workout_execution_sets from anon",
].every((line) => migration.includes(line)));
add("no_anon_execute_grants", !/grant execute on function public\..*workout_execution[\s\S]*to anon/i.test(migration));
add("rpc_auth_required", (migration.match(/AUTH_REQUIRED/g) || []).length >= 2);
add("professional_history_rpc_checks_owner", /get_student_workout_execution_history[\s\S]*where id = p_aluno_id and user_id = v_professional_user_id/i.test(migration));
add("student_start_validates_active_workout", /lifecycle_status = 'active'/.test(migration));
add("student_start_requires_client_civil_date", /p_session_date date/.test(migration) && /WORKOUT_EXECUTION_SESSION_DATE_REQUIRED/.test(migration));
add("student_start_bounds_client_civil_date", /WORKOUT_EXECUTION_SESSION_DATE_OUT_OF_RANGE/.test(migration));

const failed = checks.filter((check) => !check.passed);
for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
if (failed.length) process.exitCode = 1;
if (!failed.length) {
  console.log("WORKOUT_EXECUTION_AUTHORIZATION_QA=PASS");
  console.log("PRODUCTION_ACCESSED=NO");
}

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}
