import { readFileSync } from "node:fs";

const checks = [];

function add(name, passed, details = "") {
  checks.push({ name, passed: Boolean(passed), details });
}

const contract = readFileSync("src/features/treinos/utils/workoutDataContract.js", "utf8");
const service = readFileSync("src/services/treinosService.js", "utf8");
const componentDiffForbidden = [
  "src/features/treinos/components/",
  "src/components/TreinoModal.jsx",
  "src/pages/",
  "src/index.css",
];

add("lifecycle constants exported", /WORKOUT_LIFECYCLE_STATUS\s*=\s*\{[\s\S]*DRAFT:\s*"draft"[\s\S]*ACTIVE:\s*"active"[\s\S]*COMPLETED:\s*"completed"[\s\S]*ARCHIVED:\s*"archived"/.test(contract));
add("template origin constants exported", /WORKOUT_TEMPLATE_ORIGIN_TYPE\s*=\s*\{[\s\S]*OFFICIAL:\s*"official"[\s\S]*PERSONAL:\s*"personal"/.test(contract));
add("lifecycle normalizer exists", contract.includes("normalizeWorkoutLifecycleStatus"));
add("template origin normalizer exists", contract.includes("normalizeWorkoutTemplateOrigin"));
add("application idempotency key normalizer exists", contract.includes("normalizeApplicationIdempotencyKey"));
add("persistence payload carries lifecycle status", contract.includes("lifecycleStatus"));
add("persistence payload carries template origin", contract.includes("templateOriginType") && contract.includes("templateOriginSnapshot"));
add("persistence payload carries application idempotency key", contract.includes("applicationIdempotencyKey"));
add("legacy status fallback documented in code", contract.includes('["ativo"') && contract.includes('["finalizado"'));
add("delivery service exported", /export async function entregarTreinoSupabase/.test(service));
add("state change service exported", /export async function alterarEstadoTreinoSupabase/.test(service));

const staged = process.env.ARUKA_STAGED_FILES || "";
for (const forbidden of componentDiffForbidden) {
  add(`no visual file staged for ${forbidden}`, !staged.includes(forbidden));
}

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}${check.details ? ` - ${check.details}` : ""}`);
}

if (failed.length) {
  process.exitCode = 1;
}
