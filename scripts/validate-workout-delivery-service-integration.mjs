import { existsSync, readFileSync } from "node:fs";

const files = {
  service: "src/services/treinosService.js",
  hook: "src/features/treinos/hooks/useTreinosPage.js",
  application: "src/features/treinos/utils/workoutTemplateApplication.js",
  modal: "src/features/treinos/components/TreinoTemplatesModal.jsx",
};
const checks = [];

for (const [name, file] of Object.entries(files)) {
  add(`${name} file exists`, existsSync(file));
}

const service = read(files.service);
const hook = read(files.hook);
const application = read(files.application);
const modal = read(files.modal);

add("application payload prepared by contract helper", hook.includes("prepareWorkoutTemplateApplicationPayload"));
add("model application persists through service only", hook.includes("adicionarTreinoSupabase(payload)") && !hook.includes(".insert("));
add("model application creates draft lifecycle", application.includes("WORKOUT_LIFECYCLE_STATUS.DRAFT"));
add("model application preserves legacy review status", application.includes("WORKOUT_STATUS.IN_REVIEW"));
add("template origin persisted", application.includes("templateOriginId") && application.includes("templateOriginSnapshot"));
add("service maps delivery RPC errors", service.includes("mapWorkoutDeliveryRpcError(error, \"deliver\")"));
add("service maps lifecycle RPC errors", service.includes("mapWorkoutDeliveryRpcError(error, \"lifecycle\")"));
add("hook exposes explicit delivery action", hook.includes("async function entregarTreino"));
add("hook exposes lifecycle actions", hook.includes("concluirTreino") && hook.includes("arquivarTreino"));
add("UI keeps modal in submitting/error/success states", modal.includes("submitting") && modal.includes("setFlowState(\"error\")") && modal.includes("setFlowState(\"success\")"));

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function report() {
  for (const check of checks) {
    console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  }
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
