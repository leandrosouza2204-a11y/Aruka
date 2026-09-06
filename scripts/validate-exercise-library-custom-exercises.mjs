import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const files = {
  component: "src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx",
  hook: "src/features/exerciseLibrary/hooks/useExerciseLibraryPage.js",
  service: "src/services/exerciseLibraryService.js",
  form: "src/services/exerciseLibraryForm.js",
  tests: "src/services/exerciseLibraryService.test.js",
  css: "src/index.css",
  audit: "docs/product-roadmap-v4-cycle-09/09-custom-exercises-audit.md",
  implementation: "docs/product-roadmap-v4-cycle-09/10-custom-exercises-implementation.md",
  validation: "docs/product-roadmap-v4-cycle-09/11-custom-exercises-validation.md",
  result: "reports/product-roadmap-v4/cycle-09-3-result.json",
  summary: "reports/product-roadmap-v4/cycle-09-3-summary.md",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const checks = [];

check("arquivos 09.3 existem", ["component", "hook", "service", "form", "tests"].every((key) => source[key]));
check("formulario pessoal valida campos obrigatorios", all(source.form, ["Informe o nome do exercício.", "Informe o grupo muscular.", "Informe a categoria."]));
check("payload força personal active e owner_id", all(source.form, ["owner_id: ownerId", "origin: \"personal\"", "status: \"active\""]));
check("payload preserva contrato de midia pessoal", all(source.form, ["youtube_url:", "media_type:", "media_path: null"]));
check("servico cria exercicio pessoal via usuario autenticado", all(source.service, ["criarExercicioPessoalSupabase", "buscarUsuarioAtualId", ".insert(resultado.payload)"]));
check("servico edita somente origem personal", all(source.service, ["atualizarExercicioPessoalSupabase", ".eq(\"origin\", \"personal\")", ".update(payload)"]));
check("servico arquiva por status sem hard delete", all(source.service, ["arquivarExercicioPessoalSupabase", "status: \"archived\"", "archived_at"]) && !source.service.includes(".delete("));
check("UI tem criar editar arquivar", all(source.component, ["exercise-library-create", "exercise-library-edit", "exercise-library-archive"]));
check("UI limita acoes a exercicios pessoais", all(source.component, ["isPersonal", "exercicio.origem === \"personal\""]));
check("modal acessivel e formulario rotulado", all(source.component, ["role=\"dialog\"", "aria-modal=\"true\"", "aria-labelledby", "aria-describedby", "aria-invalid"]));
check("estados saving/error/success presentes", all(source.hook + source.component, ["salvando", "mensagem", "validationErrors", "aria-busy"]));
check("responsivo de modal e acoes presente", all(source.css, [".exercise-library-modal", ".exercise-library-form-grid", ".exercise-library-card-actions"]));
check("docs e reports 09.3 existem", ["audit", "implementation", "validation", "result", "summary"].every((key) => source[key]));
check("result.json valido e sem Supabase change", parseResult(source.result));
check("sem alteracoes Supabase", supabaseChanged().length === 0, supabaseChanged().join(", "));

for (const item of checks) {
  console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
}

if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}

function parseResult(text) {
  if (!text) return false;
  try {
    const parsed = JSON.parse(text);
    return parsed.stage === "09.3" && parsed.supabaseChanged === false;
  } catch {
    return false;
  }
}

function supabaseChanged() {
  return [
    git(["diff", "--name-only", "--", "supabase/**"]),
    git(["diff", "--cached", "--name-only", "--", "supabase/**"]),
    git(["ls-files", "--others", "--exclude-standard", "--", "supabase"]),
  ].flat();
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
