import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "src/features/treinos/utils/workoutTemplateApplication.js",
  "src/features/treinos/utils/workoutTemplateApplication.test.js",
  "src/features/treinos/components/TreinoTemplatesModal.jsx",
  "src/features/treinos/hooks/useTreinosPage.js",
  "src/services/treinosService.js",
];
const authorizedSupabaseDiff = new Set([
  "supabase/baseline-src/02-tables.sql",
  "supabase/baseline-src/03-constraints.sql",
  "supabase/baseline-src/04-indexes.sql",
  "supabase/baseline-src/05-functions.sql",
  "supabase/baseline-src/06-triggers.sql",
  "supabase/baseline-src/07-rls.sql",
  "supabase/baseline-src/08-policies.sql",
  "supabase/baseline-src/09-grants.sql",
  "supabase/baseline-src/10-storage.sql",
  "supabase/README.md",
  "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
  "supabase/migrations/20260730090000_student_identity_contract.sql",
  "supabase/migrations/20260905120000_exercise_library_media_v1.sql",
  "supabase/migrations/20260907090000_workout_exercise_library_integration_v1.sql",
]);

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
check("teste de imutabilidade profunda existe", test.includes("nao muta modelo oficial congelado") && test.includes("nao muta modelo pessoal profundamente aninhado"));
check("teste usa deepFreeze recursivo", test.includes("function deepFreeze") && test.includes("Object.freeze") && test.includes("Object.values"));
check("teste usa deepStrictEqual antes e depois", test.includes("structuredClone(input)") && test.includes("assert.deepStrictEqual(input, before)"));
check("teste confirma referencias independentes", test.includes("payload nao compartilha referencias mutaveis") && test.includes("assert.notStrictEqual"));
check("teste cobre modelo oficial", test.includes("officialTemplate") && test.includes("modelo oficial congelado"));
check("teste cobre modelo pessoal", test.includes("personalTemplate") && test.includes("modelo pessoal profundamente aninhado"));
check("teste cobre erro sem mutacao", test.includes("erro de persistencia preserva modelo"));
check("teste cobre submissao duplicada sem mutacao", test.includes("submissao duplicada preserva modelo"));

const supabaseChanged = [
  git(["diff", "--name-only", "--", "supabase/**"]),
  git(["diff", "--cached", "--name-only", "--", "supabase/**"]),
  git(["ls-files", "--others", "--exclude-standard", "--", "supabase"]),
].flat();
const unexpectedSupabaseChanged = supabaseChanged.filter((path) => !authorizedSupabaseDiff.has(path));
check("ausencia de alteracoes Supabase inesperadas", unexpectedSupabaseChanged.length === 0, unexpectedSupabaseChanged.join(", "));

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
