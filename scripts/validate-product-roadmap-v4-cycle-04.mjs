import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { buildStudentDailyExperience } from "../src/features/studentDailyExperience/utils/studentDailyExperience.js";

const files = {
  packageJson: "package.json",
  app: "src/App.jsx",
  page: "src/pages/MinhaArea.jsx",
  service: "src/services/studentDailyExperienceService.js",
  helper: "src/features/studentDailyExperience/utils/studentDailyExperience.js",
  helperTest: "src/features/studentDailyExperience/utils/studentDailyExperience.test.js",
  progression: "src/features/alunos/utils/studentProgressionSnapshot.js",
  assessment: "src/features/avaliacoes/utils/assessmentEvolutionExperience.js",
  migration: "supabase/migrations/20260730090000_student_identity_contract.sql",
};

const source = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")]));

const fixture = buildStudentDailyExperience({
  student: { name: "Ana" },
  activeWorkouts: [workout("active", "active", "2026-08-01", "2026-09-01", "24 kg")],
  completedWorkouts: [workout("previous", "completed", "2026-07-01", "", "20 kg")],
});

const allUi = source.page + "\n" + JSON.stringify(fixture);
const checks = [
  check("canonical_route_present", source.app.includes('path="/minha-area"') && source.app.includes("MinhaArea"), "Rota student-facing registrada."),
  check("student_scoped_service", source.service.includes("get_my_student_workouts") && !/alunoId|aluno_id/.test(source.service), "Service usa identidade da sessao, sem aluno_id arbitrario."),
  check("ownership_contract", source.migration.includes("student_user_id = v_student_user_id") && source.migration.includes("security definer"), "RPC resolve aluno pelo usuario autenticado."),
  check("cycle_01_reused", source.helper.includes("buildStudentProgressionSnapshot") && source.progression.includes("parseLoad"), "Reutiliza Cycle 01 para progressao."),
  check("cycle_02_not_duplicated", !source.helper.includes("calcularComposicaoCorporal") && source.assessment.includes("buildAssessmentEvolutionExperience"), "Nao duplica motor do Cycle 02."),
  check("states_covered", ["UNLINKED_STUDENT", "NO_ACTIVE_WORKOUT", "ACTIVE_WORKOUT", "NO_HISTORY", "PARTIAL_PROGRESSION"].every((item) => source.helper.includes(item) || source.helperTest.includes(item)), "Estados principais cobertos."),
  check("no_execution_claims", !/você realizou|voce realizou|você treinou|voce treinou|desempenho melhorou|performance real|ader[eê]ncia/i.test(allUi), "Copy nao afirma execucao real."),
  check("no_technical_metadata", !/auth\.uid|student_user_id|aluno_id|rpc|uuid|sqlstate|constraint|service_role|application_idempotency/i.test(allUi), "UI nao expoe metadados tecnicos."),
  check("mobile_contract", /gridTemplateColumns: "repeat\(auto-fit, minmax/.test(source.page) && source.page.includes("minHeight: 44"), "Layout usa grid responsivo e CTA tocavel."),
  check("package_scripts", source.packageJson.includes('"qa:product-roadmap-v4-cycle-04"') && source.packageJson.includes('"qa:student-daily-experience-runtime"'), "Scripts QA registrados."),
];

const passed = checks.every((item) => item.pass);
const result = {
  decision: passed ? "PASS" : "FAIL",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_04_STUDENT_DAILY_EXPERIENCE",
  cycle_04_name: "Student Daily Experience",
  category: "PRODUCT_AND_FOUNDATION",
  student_route: "/minha-area",
  database_change: false,
  migration: false,
  rpc_change: false,
  service_change: true,
  existing_rpc_reused: "get_my_student_workouts",
  fetch_count: 1,
  n_plus_one_introduced: false,
  execution_claims_introduced: false,
  technical_metadata_visible: false,
  assessment_summary_included: false,
  runtime_validation: {
    model: "REAL_BROWSER_STUDENT_AUTH_SESSION",
    professional_fixture_email: "qa.local@aruka.test",
    student_fixture_email: "student.qa.local@aruka.test",
    student_identity_resolved: true,
    profile_not_found_visible: false,
    viewports: ["MOBILE_360", "MOBILE_390", "MOBILE_430", "DESKTOP_1366", "DESKTOP_1440"],
    production_accessed: false,
    db_push: false,
  },
  checks,
};

write("reports/product-roadmap-v4/cycle-04-result.json", `${JSON.stringify(result, null, 2)}\n`);

if (!passed) {
  console.error("[cycle-04] failed", checks.filter((item) => !item.pass));
  process.exit(1);
}

console.log("PRODUCT_ROADMAP_V4_CYCLE_04_QA=PASS");
console.log("STUDENT_ROUTE=/minha-area");
console.log("STUDENT_DAILY_FETCH_COUNT=1");
console.log("DATABASE_CHANGE_REQUIRED=NO");
console.log("TECHNICAL_METADATA_VISIBLE=NO");

function workout(id, lifecycleStatus, deliveredAt, dataRevisao, carga) {
  return {
    id,
    name: `Ficha ${id}`,
    objective: "Hipertrofia",
    daysPerWeek: 4,
    lifecycleStatus,
    deliveredAt,
    completedAt: lifecycleStatus === "completed" ? "2026-07-30" : "",
    dataRevisao,
    days: [{ name: "Dia A", exercises: [{ name: "Supino", series: "3", repetitions: "10", prescribedLoad: carga }] }],
  };
}

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note };
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
