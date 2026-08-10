import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const checks = [];
const css = read("src/index.css");
const cards = read("src/features/treinos/components/TreinosCards.jsx");
const list = read("src/features/treinos/components/TreinosList.jsx");
const confirmation = read("src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx");
const details = read("src/features/treinos/components/TreinoDetalhesModal.jsx");
const cssDiff = git(["diff", "--", "src/index.css"]).join("\n");

add("cards usam grid responsivo existente", list.includes("repeat(auto-fit, minmax(280px, 1fr))"));
add("cards quebram texto longo", css.includes(".treino-library-card h3") && css.includes("overflow-wrap: anywhere"));
add("modal lifecycle limitado ao viewport", css.includes("workout-lifecycle-confirmation-modal") && css.includes("calc(100dvh - 36px)") && css.includes("calc(100vw - 36px)"));
add("modal mobile tem botoes de 44px", css.includes("workout-lifecycle-confirmation-modal footer button") && css.includes("min-height: 44px"));
add("menus usam TableActions portal", cards.includes("TableActions") && css.includes(".table-actions-dropdown"));
add("areas de acao tem texto", cards.includes("Entregar treino") && cards.includes("Concluir treino"));
add("detalhes nao usam largura fixa", !details.includes("width: 520") && !details.includes("minWidth: 520"));
add("sem overflow-x hidden global novo", !/^\+\s*overflow-x:\s*hidden/im.test(cssDiff));
add("data-testid para runtime", confirmation.includes("workout-lifecycle-confirmation") && cards.includes("workout-primary-action"));

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).split(/\r?\n/);
}

function report() {
  for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
