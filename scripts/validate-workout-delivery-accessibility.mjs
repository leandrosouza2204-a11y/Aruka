import { existsSync, readFileSync } from "node:fs";

const checks = [];
const badge = read("src/features/treinos/components/WorkoutLifecycleBadge.jsx");
const confirmation = read("src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx");
const actions = read("src/features/treinos/components/WorkoutLifecycleActions.jsx");
const cards = read("src/features/treinos/components/TreinosCards.jsx");
const tableActions = read("src/components/TableActions.jsx");

add("badge textual com aria-label", badge.includes("aria-label") && badge.includes("Estado do treino") && badge.includes("presentation.label"));
add("modal tem alertdialog e titulo acessivel", confirmation.includes('role="alertdialog"') && confirmation.includes("aria-labelledby") && confirmation.includes("aria-describedby"));
add("modal gerencia foco inicial", confirmation.includes("cancelRef.current?.focus()"));
add("modal respeita escape com loading", confirmation.includes("event.key !== \"Escape\" || loading"));
add("loading anunciado por aria-busy", confirmation.includes("aria-busy") && cards.includes("aria-busy"));
add("menus possuem aria-expanded", tableActions.includes("aria-expanded"));
add("acoes nao sao apenas icones", actions.includes("meta.label") && cards.includes("primaryActionLabel"));
add("tooltips nao sao unica fonte", !actions.includes("title="));
add("data-testid estavel", confirmation.includes("workout-lifecycle-confirm") && badge.includes("workout-lifecycle-badge"));

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function report() {
  for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
