import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const checks = [];
const read = (path) => readFileSync(path, "utf8");

const utilityPath = "src/features/treinos/utils/personalWorkoutTemplateManagement.js";
const testPath = "src/features/treinos/utils/personalWorkoutTemplateManagement.test.js";
const servicePath = "src/services/workoutTemplatesService.js";
const modalPath = "src/features/treinos/components/TreinoSalvarModeloModal.jsx";
const libraryPath = "src/features/treinos/components/TreinoTemplatesModal.jsx";
const authorizedSupabaseDiff = new Set([
  "supabase/baseline-src/02-tables.sql",
  "supabase/baseline-src/03-constraints.sql",
  "supabase/baseline-src/04-indexes.sql",
  "supabase/baseline-src/05-functions.sql",
  "supabase/baseline-src/08-policies.sql",
  "supabase/baseline-src/09-grants.sql",
  "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
  "supabase/migrations/20260730090000_student_identity_contract.sql",
]);

const utility = existsSync(utilityPath) ? read(utilityPath) : "";
const tests = existsSync(testPath) ? read(testPath) : "";
const service = existsSync(servicePath) ? read(servicePath) : "";
const modal = existsSync(modalPath) ? read(modalPath) : "";
const library = existsSync(libraryPath) ? read(libraryPath) : "";

check("utility de gerenciamento existe", existsSync(utilityPath));
check("testes existem", existsSync(testPath));
check("servico centralizado e usado", service.includes("createPersonalWorkoutTemplate") && service.includes(".from(\"workout_templates\")"));
check("contrato canonico e usado", utility.includes("workoutTemplateSanitization") && service.includes("normalizeCanonicalTemplateData"));
check("sanitizacao e usada", utility.includes("sanitizeWorkoutForTemplate") && service.includes("validarTemplate"));
check("criacao existe", utility.includes("CREATE: \"create\"") && library.includes("personal-template-create"));
check("edicao existe", utility.includes("EDIT: \"edit\"") && library.includes("setModeloEditando"));
check("duplicacao oficial existe", utility.includes("DUPLICATE_OFFICIAL") && library.includes("duplicateOfficial"));
check("duplicacao pessoal existe", utility.includes("DUPLICATE_PERSONAL") && library.includes("duplicatePersonal"));
check("criacao a partir de treino existe", utility.includes("CREATE_FROM_WORKOUT") && tests.includes("criacao a partir de treino"));
check("modelos oficiais nao sao editaveis", utility.includes("Modelos oficiais sao somente leitura") && !library.includes("modelo.isSystem && setModeloEditando"));
check("identificadores sao removidos em duplicacao", tests.includes("remove identificador") && tests.includes("payload.id, undefined"));
check("protecao contra duplo envio existe", utility.includes("submitPersonalTemplateOnce") && modal.includes("submitGateRef"));
check("testes de deepFreeze existem", tests.includes("deepFreeze"));
check("testes de referencias independentes existem", tests.includes("assert.notStrictEqual"));
check("confirmacao explicita existe", modal.includes("personal-template-preview") && modal.includes("workout-template-confirm-save"));
check("ausencia de inserts ou updates espalhados em componentes", !/\.from\(["']workout_templates["']\)\s*\.(insert|update|delete)/.test(modal + library));
const unexpectedSupabaseChanged = supabaseChanged().filter((path) => !authorizedSupabaseDiff.has(path));
check("ausencia de alteracoes Supabase inesperadas", unexpectedSupabaseChanged.length === 0, unexpectedSupabaseChanged.join(", "));

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}${item.detail ? `: ${item.detail}` : ""}`);
}

if (failed.length) {
  process.exitCode = 1;
}

function check(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
}

function supabaseChanged() {
  const commands = [
    ["git", ["diff", "--name-only", "--", "supabase/**"]],
    ["git", ["diff", "--cached", "--name-only", "--", "supabase/**"]],
    ["git", ["ls-files", "--others", "--exclude-standard", "--", "supabase"]],
  ];

  return commands.flatMap(([command, args]) =>
    execFileSync(command, args, { encoding: "utf8" })
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  );
}
