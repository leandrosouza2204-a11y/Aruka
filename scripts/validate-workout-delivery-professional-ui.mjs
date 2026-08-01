import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const checks = [];
const files = [
  "src/features/treinos/utils/workoutLifecyclePresentation.js",
  "src/features/treinos/components/WorkoutLifecycleBadge.jsx",
  "src/features/treinos/components/WorkoutLifecycleActions.jsx",
  "src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx",
  "src/features/treinos/components/WorkoutOriginLabel.jsx",
  "src/features/treinos/components/TreinosCards.jsx",
  "src/features/treinos/components/TreinoDetalhesModal.jsx",
  "src/features/treinos/components/TreinosFilters.jsx",
  "src/features/treinos/components/TreinosList.jsx",
];

for (const file of files) add(`arquivo presente: ${file}`, existsSync(file));

const presentation = read("src/features/treinos/utils/workoutLifecyclePresentation.js");
const cards = read("src/features/treinos/components/TreinosCards.jsx");
const details = read("src/features/treinos/components/TreinoDetalhesModal.jsx");
const confirmation = read("src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx");
const filters = read("src/features/treinos/components/TreinosFilters.jsx");
const list = read("src/features/treinos/components/TreinosList.jsx");
const all = [presentation, cards, details, confirmation, filters, list].join("\n");
const authorizedSupabaseDiff = new Set([
  "supabase/baseline-src/02-tables.sql",
  "supabase/baseline-src/03-constraints.sql",
  "supabase/baseline-src/04-indexes.sql",
  "supabase/baseline-src/05-functions.sql",
  "supabase/baseline-src/09-grants.sql",
  "supabase/migrations/20260730090000_student_identity_contract.sql",
]);

add("badges em português", ["Em revisão", "Ativo", "Concluído", "Arquivado"].every((label) => presentation.includes(label)));
add("ações centralizadas por lifecycle", presentation.includes("getWorkoutLifecycleActions") && presentation.includes("deliver") && presentation.includes("complete") && presentation.includes("archive"));
add("entrega, conclusão e arquivamento com confirmação", confirmation.includes("Entregar treino?") && confirmation.includes("Concluir treino?") && confirmation.includes("Arquivar treino?"));
add("loading textual", confirmation.includes("Entregando...") && confirmation.includes("Concluindo...") && confirmation.includes("Arquivando..."));
add("origem legivel sem snapshot bruto", details.includes("WorkoutOriginLabel") && !details.includes("templateOriginSnapshot") && !details.includes("applicationIdempotencyKey"));
add("filtro usa estado lifecycle", filters.includes("Filtrar por estado") && presentation.includes("WORKOUT_LIFECYCLE_FILTER_OPTIONS"));
add("callbacks da etapa 2 consumidos", list.includes("treinosPage.entregarTreino") && list.includes("treinosPage.concluirTreino") && list.includes("treinosPage.arquivarTreino"));
add("exclusão física não é ação visível dos cards", !cards.includes("onExcluir") && !cards.includes("Trash2") && !cards.includes("Excluir"));
add("nenhuma chave tecnica exposta", !all.includes("application_idempotency_key") && !all.includes("template_origin_snapshot"));
add("sem diff Supabase inesperado", git(["diff", "--name-only", "--", "supabase/**"]).every((path) => authorizedSupabaseDiff.has(path)));
add("sem diff financeiro", git(["diff", "--name-only", "--", "src/features/financeiro/**", "src/services/*pagamento*", "src/services/*plano*"]).length === 0);

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).split(/\r?\n/).filter(Boolean);
}

function report() {
  for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
