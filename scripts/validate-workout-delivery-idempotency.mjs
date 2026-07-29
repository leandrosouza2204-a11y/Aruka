import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const checks = [];
const application = read("src/features/treinos/utils/workoutTemplateApplication.js");
const applicationTest = read("src/features/treinos/utils/workoutTemplateApplication.test.js");
const contract = read("src/features/treinos/utils/workoutDataContract.js");
const service = read("src/services/treinosService.js");
const modal = read("src/features/treinos/components/TreinoTemplatesModal.jsx");

add("idempotency key created before submit", application.includes("createApplicationIdempotencyKey"));
add("idempotency key persisted in payload", application.includes("applicationIdempotencyKey") && contract.includes("applicationIdempotencyKey"));
add("controller reuses same intent on retry", application.includes("getOrCreateWorkoutTemplateApplicationIntent") && application.includes("if (controller?.intent) return controller.intent"));
add("modal passes intent to hook", modal.includes("getOrCreateWorkoutTemplateApplicationIntent") && modal.includes("intent,"));
add("duplicate submission reuses same promise", application.includes("controller?.active || controller?.result"));
add("database idempotency conflict mapped", service.includes("WORKOUT_DELIVERY_IDEMPOTENCY_CONFLICT"));
add("tests cover retry intent", applicationTest.includes("reaproveita intencao de aplicacao"));
add("tests cover duplicate submission", applicationTest.includes("bloqueia submissao duplicada"));
add("no Supabase diff in service integration stage", git(["diff", "--name-only", "--", "supabase/**"]).length === 0);
add("no staged Supabase diff in service integration stage", git(["diff", "--cached", "--name-only", "--", "supabase/**"]).length === 0);

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function read(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : "";
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function report() {
  for (const check of checks) {
    console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  }
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
