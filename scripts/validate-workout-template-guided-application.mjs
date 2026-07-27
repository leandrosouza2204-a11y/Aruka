import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "src/features/treinos/utils/workoutTemplateApplication.js",
  "src/features/treinos/utils/workoutTemplateApplication.test.js",
  "src/features/treinos/components/TreinoTemplatesModal.jsx",
  "src/features/treinos/hooks/useTreinosPage.js",
  "src/services/treinosService.js",
];

const checks = [];

function check(name, ok, detail = "") {
  checks.push({ name, ok, detail });
}

for (const file of requiredFiles) {
  check(`arquivo obrigatorio: ${file}`, existsSync(file) && statSync(file).size > 0);
}

const application = read("src/features/treinos/utils/workoutTemplateApplication.js");
const modal = read("src/features/treinos/components/TreinoTemplatesModal.jsx");
const hook = read("src/features/treinos/hooks/useTreinosPage.js");
const service = read("src/services/treinosService.js");
const test = read("src/features/treinos/utils/workoutTemplateApplication.test.js");

check("camada de aplicacao existe", application.includes("buildWorkoutTemplateApplicationPreview"));
check("usa contrato canonico", application.includes("normalizeCanonicalTemplateData") && application.includes("canonicalTemplateToWorkout"));
check("previa presente", modal.includes("ApplicationSummary") && modal.includes("Preview"));
check("confirmacao explicita", modal.includes("Aplicar treino ao aluno"));
check("estado submitting presente", modal.includes("submitting") && modal.includes("aria-busy"));
check("protecao contra duplo envio", application.includes("submitWorkoutTemplateApplicationOnce") && modal.includes("isSubmitting"));
check("persistencia atomica existente usada", hook.includes("adicionarTreinoSupabase") && service.includes('rpc("salvar_treino_composto"'));
check("sem inserts independentes no novo fluxo", !application.includes(".insert(") && !modal.includes(".insert(") && !hook.includes("treino_dias"));
check("teste de duplicidade presente", test.includes("bloqueia submissao duplicada"));
check("testes associados presentes", test.includes("prepara payload") && test.includes("rejeita aplicacao"));

const supabaseChanged = [
  git(["diff", "--name-only", "--", "supabase/**"]),
  git(["diff", "--cached", "--name-only", "--", "supabase/**"]),
  git(["ls-files", "--others", "--exclude-standard", "--", "supabase"]),
].flat();
check("ausencia de alteracoes Supabase", supabaseChanged.length === 0, supabaseChanged.join(", "));

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
}

if (failed.length) {
  process.exitCode = 1;
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
