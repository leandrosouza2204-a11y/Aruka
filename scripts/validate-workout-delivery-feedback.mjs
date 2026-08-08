import { readFile } from "node:fs/promises";

const lifecycleFeedback = await readFile("src/features/treinos/utils/workoutLifecycleFeedback.js", "utf8");
const lifecycleActions = await readFile("src/features/treinos/components/WorkoutLifecycleActions.jsx", "utf8");
const treinosPage = await readFile("src/features/treinos/hooks/useTreinosPage.js", "utf8");
const confirmation = await readFile("src/features/treinos/components/WorkoutLifecycleConfirmationModal.jsx", "utf8");

const checks = [
  ["deliver feedback exists", /Entregando treino|Treino entregue|Não foi possível entregar/.test(lifecycleFeedback)],
  ["complete feedback exists", /Concluindo treino|Treino concluído|Não foi possível concluir/.test(lifecycleFeedback)],
  ["archive feedback exists", /Arquivando treino|Treino arquivado|Não foi possível arquivar/.test(lifecycleFeedback)],
  ["action buttons show loading labels", /loadingLabel\(action\)/.test(lifecycleActions)],
  ["action buttons disabled while loading", /disabled=\{disabled \|\| loading\}/.test(lifecycleActions)],
  ["delivery blocks concurrent action", /entregandoTreinoId \|\| alterandoEstadoTreinoId/.test(treinosPage)],
  ["lifecycle blocks concurrent action", /setAlterandoEstadoTreinoId\(id\)/.test(treinosPage)],
  ["success uses action-specific feedback", /feedback\.successTitle/.test(treinosPage)],
  ["confirmation has busy state", /aria-busy=\{loading\}/.test(confirmation)],
  ["confirmation confirm button disabled while loading", /disabled=\{loading\}/.test(confirmation)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
