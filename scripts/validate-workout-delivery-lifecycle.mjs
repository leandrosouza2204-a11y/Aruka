import { existsSync, readFileSync } from "node:fs";

const checks = [];
const contract = read("src/features/treinos/utils/workoutDataContract.js");
const service = read("src/services/treinosService.js");
const hook = read("src/features/treinos/hooks/useTreinosPage.js");

add("canonical lifecycle statuses remain constrained", /DRAFT:\s*"draft"[\s\S]*ACTIVE:\s*"active"[\s\S]*COMPLETED:\s*"completed"[\s\S]*ARCHIVED:\s*"archived"/.test(contract));
add("legacy status aliases remain compatible", contract.includes("[\"ativo\"") && contract.includes("[\"finalizado\""));
add("delivery RPC uses entregar_treino", service.includes('rpc("entregar_treino"'));
add("state RPC uses alterar_estado_treino", service.includes('rpc("alterar_estado_treino"'));
add("invalid lifecycle status rejected client-side", service.includes("Status de ciclo de vida invalido.") || service.includes("Status de ciclo de vida invÃ¡lido.") || service.includes("Status de ciclo de vida inválido."));
add("invalid transition mapped", service.includes("WORKOUT_DELIVERY_INVALID_TRANSITION"));
add("authorization mapped", service.includes("WORKOUT_DELIVERY_NOT_AUTHORIZED"));
add("hook refreshes list after delivery", hook.includes("await entregarTreinoSupabase") && hook.includes("await carregarDados({ silencioso: true })"));
add("hook refreshes list after lifecycle change", hook.includes("await alterarEstadoTreinoSupabase") && hook.includes("await carregarDados({ silencioso: true })"));
add("hook exposes loading ids", hook.includes("entregandoTreinoId") && hook.includes("alterandoEstadoTreinoId"));

for (const check of checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
}
if (checks.some((check) => !check.passed)) process.exitCode = 1;

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}
