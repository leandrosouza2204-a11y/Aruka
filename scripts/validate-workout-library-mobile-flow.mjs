import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const checks = [];
const files = {
  library: "src/features/treinos/components/TreinoTemplatesModal.jsx",
  saveModal: "src/features/treinos/components/TreinoSalvarModeloModal.jsx",
  css: "src/index.css",
  application: "src/features/treinos/utils/workoutTemplateApplication.js",
  personal: "src/features/treinos/utils/personalWorkoutTemplateManagement.js",
  service: "src/services/workoutTemplatesService.js",
  audit: "docs/workout-library-mobile-flow-v1/01-mobile-audit.md",
  implementation: "docs/workout-library-mobile-flow-v1/02-mobile-implementation.md",
  validation: "docs/workout-library-mobile-flow-v1/03-mobile-validation.md",
  result: "reports/workout-library-mobile-flow-v1/result.json",
  summary: "reports/workout-library-mobile-flow-v1/summary.md",
};
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

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const progressBlock = extractProgressBlock(source.library);
const stepTextBlock = extractStepTextBlock(source.library);

check("componentes centrais presentes", ["library", "saveModal", "application", "personal"].every((key) => source[key]));
check("descoberta, filtros e estados vazios presentes", all(source.library, [
  "template-discovery-controls",
  "template-search",
  "template-filter-origin",
  "template-filter-split",
  "template-filter-objective",
  "template-filter-level",
  "template-filter-muscle-group",
  "custom-template-empty-state",
]));
check("jornada guiada preserva preview, submitting, error e success", all(source.library, [
  "ApplicationSummary",
  "treino-template-preview",
  "treino-template-submitting",
  "treino-template-application-error",
  "treino-template-application-success",
  "submitWorkoutTemplateApplicationOnce",
]));
check("jornada pessoal cobre criacao, edicao e duplicacao", all(source.library + source.saveModal + source.personal, [
  "personal-template-create",
  "duplicateOfficial",
  "duplicatePersonal",
  "Editar modelo pessoal",
  "personal-template-preview",
  "workout-template-confirm-save",
]));
check("acoes oficiais e pessoais corretas", source.library.includes("Duplicar como modelo pessoal") && !/modelo\.isSystem[\s\S]{0,120}setModeloEditando/.test(source.library));
check("menus usam botao real e aria-expanded", source.library.includes("aria-expanded") && source.library.includes("official-template-actions-trigger") && !source.library.includes("role=\"button\""));
check("Escape respeita modais filhos", all(source.library, [
  "if (event.key !== \"Escape\") return;",
  "if (menuAbertoId)",
  "setMenuAbertoId(\"\")",
  "if (modeloEditando || modeloGerenciando || isSubmitting) return;",
  "onClose();",
  "document.addEventListener(\"keydown\", handleKeyDown)",
  "document.removeEventListener(\"keydown\", handleKeyDown)",
  "modeloEditando, modeloGerenciando",
]));
check("progresso visual usa aria-hidden", progressBlock.includes("aria-hidden=\"true\""), "O progresso visual deve usar aria-hidden=\"true\".");
check("progresso decorativo sem aria-label", !progressBlock.includes("aria-label"), "O progresso decorativo nao deve possuir aria-label.");
check("marcadores decorativos sem aria-current", !progressBlock.includes("aria-current"), "Os marcadores decorativos nao devem usar aria-current.");
check("progresso visual nao interativo", !/\b(role|tabIndex)=|<button\b|<a\b/.test(progressBlock), "O progresso visual nao deve ser transformado em elemento interativo.");
check("etapa atual tem texto acessivel", all(stepTextBlock, ["Etapa", "etapa + 1", "etapas.length", "etapas[etapa]"]), "O texto visivel deve informar o nome da etapa atual por meio de etapas[etapa].");
check("aria-busy e aria-live presentes", all(source.library + source.saveModal, ["aria-busy", "aria-live"]));
check("dialogos rotulados por id", source.library.includes("aria-labelledby={modalTitleId}") && source.saveModal.includes("aria-labelledby={modalTitleId}"));
check("erros de campo vinculados", source.saveModal.includes("aria-describedby") && source.saveModal.includes("nameErrorId"));
check("erro geral de exercicios vinculado a secao", all(source.saveModal, [
  "const exercisesErrorId = useId();",
  "aria-invalid={Boolean(errors.exercises)}",
  "aria-describedby={errors.exercises ? exercisesErrorId : undefined}",
  "id={exercisesErrorId}",
]));
check("modais limitados por viewport com dvh e fallback", all(source.css, [
  "max-height: calc(100vh - 48px)",
  "max-height: calc(100dvh - 48px)",
  "height: 100vh",
  "height: 100dvh",
]));
check("scroll interno e footer responsivo", all(source.css, [
  ".treino-template-scroll",
  "overscroll-behavior: contain",
  ".treino-save-template-form .treino-template-footer",
  "position: sticky",
  "flex-direction: column-reverse",
]));
check("filhos criticos com min-width zero", count(source.css, "min-width: 0") >= 12);
check("textos longos quebram", count(source.css, "overflow-wrap: anywhere") >= 8);
check("grids responsivos usam minmax zero", source.css.includes("minmax(0, 1fr)") && source.css.includes("repeat(2, minmax(0, 1fr))"));
check("menus limitados por viewport", source.css.includes("max-width: calc(100vw - 32px)") && source.css.includes("width: min(220px, calc(100vw - 32px))"));
check("sem novo overflow-x hidden global como correcao", !git(["diff", "--", "src/index.css"]).some((line) => /^\+\s*overflow-x:\s*hidden/.test(line)));
check("sem persistencia Supabase em componentes", !/\.from\(["']workout_templates["']\)|supabase\./.test(source.library + source.saveModal));
check("servico segue centralizado em workout_templates", source.service.includes(".from(\"workout_templates\")"));
check("documentacao e relatorios do ciclo existem", ["audit", "implementation", "validation", "result", "summary"].every((key) => source[key]));
check("result.json valido", parseJson(source.result));
check("runtime bloqueado ou reportado", source.result.includes("BLOCKED_INFRASTRUCTURE") || source.result.includes("runtimeQa"));
const unexpectedSupabaseChanged = supabaseChanged().filter((path) => !authorizedSupabaseDiff.has(path));
check("Supabase sem alteracoes inesperadas", unexpectedSupabaseChanged.length === 0, unexpectedSupabaseChanged.join(", "));

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

function count(text, marker) {
  return text.split(marker).length - 1;
}

function extractProgressBlock(text) {
  const classIndex = text.indexOf("className=\"treino-template-progress\"");
  if (classIndex === -1) return "";
  const openIndex = text.lastIndexOf("<div", classIndex);
  const closeIndex = text.indexOf("</div>", classIndex);
  if (openIndex === -1 || closeIndex === -1) return "";
  return text.slice(openIndex, closeIndex + "</div>".length);
}

function extractStepTextBlock(text) {
  const classIndex = text.indexOf("className=\"treino-template-step\"");
  if (classIndex === -1) return "";
  const openIndex = text.lastIndexOf("<span", classIndex);
  const closeIndex = text.indexOf("</span>", classIndex);
  if (openIndex === -1 || closeIndex === -1) return "";
  return text.slice(openIndex, closeIndex + "</span>".length);
}

function parseJson(text) {
  if (!text) return false;
  try {
    JSON.parse(text);
    return true;
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
