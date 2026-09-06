import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const files = {
  app: "src/App.jsx",
  sidebar: "src/components/Sidebar.jsx",
  mobileNav: "src/components/MobileBottomNavigation.jsx",
  page: "src/pages/Exercicios.jsx",
  component: "src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx",
  hook: "src/features/exerciseLibrary/hooks/useExerciseLibraryPage.js",
  service: "src/services/exerciseLibraryService.js",
  mapper: "src/services/exerciseLibraryMapper.js",
  tests: "src/services/exerciseLibraryService.test.js",
  css: "src/index.css",
  audit: "docs/product-roadmap-v4-cycle-09/05-read-experience-audit.md",
  implementation: "docs/product-roadmap-v4-cycle-09/06-read-experience-implementation.md",
  validation: "docs/product-roadmap-v4-cycle-09/07-read-experience-validation.md",
  result: "reports/product-roadmap-v4/cycle-09-2-result.json",
  summary: "reports/product-roadmap-v4/cycle-09-2-summary.md",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const checks = [];

check("arquivos da experiencia existem", ["page", "component", "hook", "service", "mapper", "tests"].every((key) => source[key]));
check("rota autenticada /exercicios registrada", all(source.app, ["path=\"/exercicios\"", "<Exercicios />", "<ProtectedRoute>", "<SubscriptionRoute>", "<LegalRoute>"]));
check("navegacao desktop e mobile exposta", all(source.sidebar + source.mobileNav, ["/exercicios", "BookOpenCheck", "Exercicios"]));
check("servico usa tabela canonica com leitura ativa", all(source.service, [".from(\"exercise_library\")", ".eq(\"status\", \"active\")", ".select(EXERCISE_LIBRARY_SELECT)"]));
check("servico nao seleciona campos privados", !/owner_id|media_path/.test(source.service.match(/EXERCISE_LIBRARY_SELECT[\s\S]*?\]\.join/s)?.[0] ?? ""));
check("servico nao usa role privilegiada", !/service_role|SUPABASE_SERVICE|createClient\(/.test(source.service));
check("mapeamento cobre origem, grupo, categoria e midia", all(source.mapper, ["origemLabel", "grupoMuscular", "categoria", "youtube", "uploaded_video"]));
check("filtros cobrem busca, origem, grupo muscular e midia", all(source.mapper + source.component, ["busca", "origem", "grupoMuscular", "midia", "exercise-library-search"]));
check("tela tem estados de carregamento, vazio, erro e retry", all(source.component + source.hook, ["LoadingState", "EmptyState", "exercise-library-error", "tentarNovamente"]));
check("leitura 09.2 preservada apos evolucao", all(source.service + source.component + source.hook, ["buscarBibliotecaExerciciosSupabase", "exercise-library-search", "exercise-library-grid"]));
check("sem integracao com montagem de treino nesta etapa", !/treino_exercicios|adicionar.*treino|workout insertion|inserir/i.test(source.service + source.component + source.hook));
check("responsividade dedicada presente", all(source.css, [".exercise-library-page", "@media (max-width: 900px)", "@media (max-width: 420px)", "grid-template-columns: 1fr !important"]));
check("testes unitarios da experiencia existem", all(source.tests, ["rowParaExercicioBiblioteca", "filtrarExerciciosBiblioteca", "criarErroBibliotecaExercicios"]));
check("documentacao e relatorios existem", ["audit", "implementation", "validation", "result", "summary"].every((key) => source[key]));
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
    return parsed.stage === "09.2" && parsed.supabaseChange === false;
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
