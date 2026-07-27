import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = {
  modal: "src/features/treinos/components/TreinoTemplatesModal.jsx",
  discovery: "src/features/treinos/utils/workoutTemplateDiscovery.js",
  queryState: "src/features/treinos/utils/workoutTemplateDiscoveryQueryState.js",
  discoveryTest: "src/features/treinos/utils/workoutTemplateDiscovery.test.js",
  queryStateTest: "src/features/treinos/utils/workoutTemplateDiscoveryQueryState.test.js",
};

const contents = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")])
);

assertIncludes(contents.discovery, "TEMPLATE_DISCOVERY_PAGE_SIZE = 12", "Paginacao deve usar 12 itens.");
assertIncludes(contents.discovery, "filterWorkoutTemplates", "Utilitario de filtro ausente.");
assertIncludes(contents.discovery, "sortWorkoutTemplates", "Utilitario de ordenacao ausente.");
assertIncludes(contents.discovery, "paginateWorkoutTemplates", "Utilitario de paginacao ausente.");

[
  "templateQ",
  "templateSplit",
  "templateObjective",
  "templateLevel",
  "templateMuscleGroup",
  "templateOrigin",
  "templateSort",
  "templatePage",
].forEach((param) => {
  assertIncludes(contents.queryState, param, `Parametro ${param} ausente.`);
});

[
  "template-filter-origin",
  "template-filter-split",
  "template-filter-objective",
  "template-filter-level",
  "template-filter-muscle-group",
  "template-sort",
  "template-pagination",
  "template-results-count",
  "template-clear-filters",
].forEach((testId) => {
  assertIncludes(contents.modal, testId, `Controle ${testId} ausente no modal.`);
});

const forbiddenMvpTerms = /\b(equipment|favorite|recent|favorito|equipamento|recente)\b/i;
if (forbiddenMvpTerms.test(contents.discovery) || forbiddenMvpTerms.test(contents.queryState)) {
  throw new Error("Utilitarios de descoberta contem termos fora do MVP.");
}

const discoveryMarker = "treino-template-discovery";
const discoveryIndex = contents.modal.indexOf(discoveryMarker);
if (discoveryIndex < 0) {
  throw new Error(`Marcador ${discoveryMarker} nao encontrado no modal.`);
}

const modalFilterArea = contents.modal.slice(discoveryIndex);
if (/buscarModelosPessoaisSupabase|supabase\.from|\.rpc\(/.test(modalFilterArea)) {
  throw new Error("Descoberta nao deve disparar consulta Supabase por filtro.");
}

Object.values(files).forEach((path) => {
  if (!readFileSync(path, "utf8").trim()) {
    throw new Error(`Arquivo obrigatorio vazio: ${path}`);
  }
});

[
  ["diff", "--name-only", "--", "supabase/**"],
  ["diff", "--cached", "--name-only", "--", "supabase/**"],
  ["ls-files", "--others", "--exclude-standard", "--", "supabase"],
].forEach((args) => {
  assertIncludes(
    readFileSync(new URL(import.meta.url), "utf8"),
    args.join('", "'),
    `Guard Supabase deve conter git ${args.join(" ")}.`
  );
});

const supabaseDiff = uniqueLines([
  gitOutput(["diff", "--name-only", "--", "supabase/**"]),
  gitOutput(["diff", "--cached", "--name-only", "--", "supabase/**"]),
  gitOutput(["ls-files", "--others", "--exclude-standard", "--", "supabase"]),
]);

if (supabaseDiff.length) {
  throw new Error(
    `Arquivos Supabase alterados indevidamente:\n${supabaseDiff.map((path) => `- ${path}`).join("\n")}`
  );
}

console.log("Descoberta de modelos de treino aprovada.");

function assertIncludes(content, needle, message) {
  if (!content.includes(needle)) throw new Error(message);
}

function gitOutput(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

function uniqueLines(outputs) {
  return [...new Set(outputs.join("\n").split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
}
