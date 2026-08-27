import { readFileSync } from "node:fs";

const app = readFileSync("src/App.jsx", "utf8");
const alunosHook = readFileSync("src/features/alunos/hooks/useAlunosPage.js", "utf8");
const alunosService = readFileSync("src/services/alunosService.js", "utf8");
const domain = readFileSync("src/features/alunos/utils/coachWorkflowSignals.js", "utf8");
const studentDaily = readFileSync("src/pages/MinhaArea.jsx", "utf8");

check(app.includes('path="/alunos"') && app.includes("ProtectedRoute"), "ALUNOS_PROTECTED_ROUTE_PRESENT");
check(alunosHook.includes("buscarAlunosSupabase()"), "PROFESSIONAL_LIST_SERVICE_USED");
check(alunosService.includes("buscarUsuarioLogado"), "ALUNOS_SERVICE_AUTHENTICATED");
check(!domain.includes("supabase"), "SIGNALS_DOMAIN_NO_DIRECT_DATA_ACCESS");
check(!studentDaily.includes("coach-workflow-signals"), "STUDENT_UI_UNCHANGED");
check(!/insert|update|delete|upsert/i.test(domain), "PROFESSIONAL_EXECUTION_MUTATION_NO");

console.log("COACH_WORKFLOW_SIGNALS_AUTHORIZATION_QA=PASS");

function check(condition, code) {
  if (!condition) {
    console.error(`COACH_WORKFLOW_SIGNALS_AUTHORIZATION_QA=FAIL:${code}`);
    process.exit(1);
  }
}
