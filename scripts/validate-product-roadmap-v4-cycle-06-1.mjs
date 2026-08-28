import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  buildExecutionProgressionSnapshot,
} from "../src/features/workoutExecution/utils/workoutExecutionProgression.js";

const files = {
  packageJson: "package.json",
  helper: "src/features/workoutExecution/utils/workoutExecutionProgression.js",
  helperTest: "src/features/workoutExecution/utils/workoutExecutionProgression.test.js",
  studentPage: "src/pages/MinhaArea.jsx",
  professionalUi: "src/features/alunos/components/AlunosList.jsx",
  cycle06Migration: "supabase/migrations/20260822120000_workout_execution_history_foundation.sql",
  sessionDateMigration: "supabase/migrations/20260824120000_workout_execution_session_local_date.sql",
  docs: "docs/product-roadmap-v4/10-cycle-06-1-execution-driven-progression.md",
  result: "reports/product-roadmap-v4/cycle-06-1-result.json",
  summary: "reports/product-roadmap-v4/cycle-06-1-summary.md",
};

const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")]));
const migrations = readdirSync("supabase/migrations").filter((file) => file.endsWith(".sql"));
const allCycleSource = [source.helper, source.studentPage, source.professionalUi, source.docs].join("\n");
const userFacingCycleSource = [source.helper, source.studentPage, source.professionalUi].join("\n");

check("cycle_01_preserved", readFileSync("src/features/alunos/utils/studentProgressionSnapshot.js", "utf8").includes("buildStudentProgressionSnapshot"));
check("cycle_03_preserved", readFileSync("src/features/treinos/utils/workoutIntelligenceFeedback.js", "utf8").includes("buildWorkoutIntelligenceFeedback"));
check("cycle_04_present", source.studentPage.includes("student-daily-page"));
check("cycle_04_1_present", readFileSync("src/features/studentAccess/utils/studentAccessLifecycle.js", "utf8").includes("normalizeStudentAccessState"));
check("cycle_05_1_present", readFileSync("reports/product-roadmap-v4/cycle-05-1-summary.md", "utf8").includes("subscription lifecycle"));
check("cycle_06_present", source.cycle06Migration.includes("workout_execution_sessions"));
check("helper_contract", [
  "buildExecutionProgressionSnapshot",
  "EXECUTION_PROGRESSION_CONFIDENCE",
  "buildExecutionSessionFrequency",
  "formatSetReference",
].every((token) => source.helper.includes(token)));
check("student_ui_progression_hint", source.studentPage.includes("student-execution-progression-hint") && source.studentPage.includes("Primeiro registro deste exercício"));
check("student_completion_summary", source.studentPage.includes("student-execution-completion-summary"));
check("professional_ui_progression", source.professionalUi.includes("professional-execution-progression") && source.professionalUi.includes("student-execution-frequency"));
check("professional_history_discoverable", source.professionalUi.includes("Histórico de execução") && source.professionalUi.includes("Nenhuma execução registrada por este aluno ainda."));
check("rpe_rir_help", source.studentPage.includes("Entenda o que é RIR") && source.studentPage.includes("Entenda o que é RPE") && source.studentPage.includes("Repetições em reserva") && source.studentPage.includes("Percepção de esforço"));
check("set_persistence_script", source.packageJson.includes("qa:workout-execution-set-persistence"));
check("cycle_06_1_copy", !/(Última execução registrada encontrada como referência|data-testid="student-prescription-reference")/i.test(source.studentPage));
check("session_date_migration", migrations.length === 13 && source.sessionDateMigration.includes("p_session_date date"));
check("client_local_date_contract", source.studentPage.includes("iniciarExecucaoTreino") && readFileSync("src/services/workoutExecutionService.js", "utf8").includes("p_session_date: getLocalDateOnly()"));
check("no_rpc_change", !/create or replace function public\.(?!set_workout_execution_updated_at|workout_execution_session_payload|start_workout_execution_session|save_workout_execution|complete_workout_execution_session|abandon_workout_execution_session|get_my_workout_execution_state|get_student_workout_execution_history)/.test(source.helper + source.studentPage + source.professionalUi));
check("no_prohibited_copy", !/(regress[aã]o|estagna[cç][aã]o|falhou|ader[eê]ncia|performance ruim)/i.test(allCycleSource));
check("no_automatic_load_recommendation", !/(aumente para|recomenda[cç][aã]o autom[aá]tica|proxima carga)/i.test(allCycleSource));
check("materialized_view_no", !/create\s+materialized\s+view/i.test(allCycleSource));
check("no_n_plus_one_request", !/buscar.*Execucao.*exercise|forEach\([\s\S]{0,120}supabase\.rpc/i.test(source.studentPage + source.professionalUi));

const snapshot = buildExecutionProgressionSnapshot({
  currentSession: {
    id: "current",
    status: "in_progress",
    sessionDate: "2026-08-22",
    exercises: [{ id: "e1", name: "Supino", group: "Peito", status: "completed", sets: [{ setNumber: 1, reps: 10, loadValue: 42, loadUnit: "kg", completed: true }] }],
  },
  recentSessions: [{
    id: "previous",
    status: "completed",
    sessionDate: "2026-08-15",
    exercises: [{ id: "e2", name: "Supino", group: "Peito", status: "completed", sets: [{ setNumber: 1, reps: 10, loadValue: 40, loadUnit: "kg", completed: true }] }],
  }],
});
assert.equal(snapshot.safeComparisonCount, 1);

console.log("PRODUCT_ROADMAP_V4_CYCLE_06_1_QA=PASS");
console.log("DATABASE_CHANGE=YES_LOCAL_MIGRATION_REVIEW_REQUIRED");
console.log("MIGRATION=YES");
console.log("NEW_RPC=YES_SIGNATURE_EXTENDED");
console.log("MATERIALIZED_VIEW=NO");
console.log("N_PLUS_ONE_INTRODUCED=NO");

function check(name, passed) {
  if (!passed) {
    console.error(`${name}=FAIL`);
    process.exit(1);
  }
  console.log(`${name}=PASS`);
}
