import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  buildExecutionHistorySummary,
  canCompleteSession,
  validateExecutionSet,
} from "../src/features/workoutExecution/utils/workoutExecutionSession.js";

const files = {
  migration: "supabase/migrations/20260822120000_workout_execution_history_foundation.sql",
  service: "src/services/workoutExecutionService.js",
  studentPage: "src/pages/MinhaArea.jsx",
  alunosList: "src/features/alunos/components/AlunosList.jsx",
  alunosHook: "src/features/alunos/hooks/useAlunosPage.js",
  daily: "src/features/studentDailyExperience/utils/studentDailyExperience.js",
  domain: "src/features/workoutExecution/utils/workoutExecutionSession.js",
  docs: "docs/product-roadmap-v4/09-cycle-06-workout-execution-history-foundation.md",
  result: "reports/product-roadmap-v4/cycle-06-result.json",
  summary: "reports/product-roadmap-v4/cycle-06-summary.md",
};

const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")]));
const migrations = readdirSync("supabase/migrations").filter((file) => file.endsWith(".sql"));

check("migration_count_12", migrations.length === 12);
check("three_execution_tables", [
  "workout_execution_sessions",
  "workout_execution_exercises",
  "workout_execution_sets",
].every((table) => source.migration.includes(`public.${table}`)));
check("snapshot_columns_present", [
  "exercise_name_snapshot",
  "prescribed_series_snapshot",
  "prescribed_reps_snapshot",
  "prescribed_load_snapshot",
  "prescribed_rest_snapshot",
  "workout_title_snapshot",
].every((field) => source.migration.includes(field)));
check("rls_enabled_all_tables", [
  "alter table public.workout_execution_sessions enable row level security",
  "alter table public.workout_execution_exercises enable row level security",
  "alter table public.workout_execution_sets enable row level security",
].every((line) => source.migration.includes(line)));
check("student_and_professional_read_policies", /student_user_id = auth\.uid\(\)/.test(source.migration) && /a\.user_id = auth\.uid\(\)/.test(source.migration));
check("student_active_write_policies", /student_access_status = 'active'/.test(source.migration) && /status = 'in_progress'/.test(source.migration));
check("rpc_contract", [
  "start_workout_execution_session",
  "save_workout_execution",
  "complete_workout_execution_session",
  "abandon_workout_execution_session",
  "get_my_workout_execution_state",
  "get_student_workout_execution_history",
].every((fn) => source.migration.includes(`public.${fn}`)));
check("idempotency_and_active_unique", source.migration.includes("workout_execution_sessions_idempotency_uidx") && source.migration.includes("workout_execution_sessions_active_uidx"));
check("no_execution_analytics_scope", !/score|gamification|wearable|timer|volume_pr|adherence/i.test(source.migration + source.service + source.studentPage));
check("student_ui_contract", [
  "student-execution-start",
  "student-execution-session",
  "student-execution-exercise",
  "student-execution-history",
].every((testId) => source.studentPage.includes(testId)));
check("professional_readonly_contract", source.alunosList.includes("StudentExecutionHistoryPanel") && source.alunosHook.includes("buscarHistoricoExecucaoAluno"));
check("daily_preserves_prescription_ids", /id: day\.id/.test(source.daily) && /id: exercise\.id/.test(source.daily));
check("service_rpc_contract", [
  "buscarMeuEstadoExecucaoTreino",
  "iniciarExecucaoTreino",
  "salvarExecucaoTreino",
  "concluirExecucaoTreino",
  "abandonarExecucaoTreino",
  "buscarHistoricoExecucaoAluno",
].every((name) => source.service.includes(`function ${name}`)));

assert.equal(validateExecutionSet({ setNumber: 1, reps: 0, loadValue: 0, completed: true }).valid, true);
assert.equal(canCompleteSession({ status: "in_progress", exercises: [{ status: "skipped", sets: [] }] }), true);
assert.equal(buildExecutionHistorySummary([{ id: "s1", status: "completed", sessionDate: "2026-08-22", exercises: [] }]).length, 1);

console.log("PRODUCT_ROADMAP_V4_CYCLE_06_QA=PASS");
console.log("EXECUTABLE_MIGRATIONS=12");
console.log("PRODUCTION_ACCESSED=NO");
console.log("REMOTE_DB_PUSH=NO");

function check(name, passed) {
  if (!passed) {
    console.error(`${name}=FAIL`);
    process.exit(1);
  }
  console.log(`${name}=PASS`);
}
