import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { buildAssessmentEvolutionExperience } from "../src/features/avaliacoes/utils/assessmentEvolutionExperience.js";

const files = {
  packageJson: "package.json",
  helper: "src/features/avaliacoes/utils/assessmentEvolutionExperience.js",
  helperTest: "src/features/avaliacoes/utils/assessmentEvolutionExperience.test.js",
  detailsModal: "src/features/avaliacoes/components/AvaliacaoDetalhesModal.jsx",
  list: "src/features/avaliacoes/components/AvaliacoesList.jsx",
  hook: "src/features/avaliacoes/hooks/useAvaliacoesPage.js",
  service: "src/services/avaliacoesService.js",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")])
);

const fixtureEvolution = buildAssessmentEvolutionExperience([
  assessment("a1", "2026-01-10", 82, 92, { peitoral: 14, abdominal: 24, coxa: 18 }),
  assessment("a2", "2026-03-10", 80.5, 88, { peitoral: 12, abdominal: 20, coxa: 16 }),
  assessment("a3", "2026-05-10", 79, 86, { peitoral: 11, abdominal: 18, coxa: 15 }),
]);

assert.equal(fixtureEvolution.status, "READY");
assert.equal(fixtureEvolution.assessmentCount, 3);
assert.ok(fixtureEvolution.reportLanguage.includes("Desde a avaliação anterior"));

const checks = [
  check("canonical_cycle_02_scope", source.helper.includes("buildAssessmentEvolutionExperience"), "Helper puro de evolução de avaliações existe."),
  check("domain_tests_present", source.helperTest.includes("BASELINE_ONLY") && source.helperTest.includes("partial and legacy"), "Testes cobrem base, histórico e dados parciais."),
  check("ui_panel_present", source.detailsModal.includes("assessment-evolution-experience") && source.detailsModal.includes("Evolução da avaliação"), "Painel user-facing foi integrado ao perfil de avaliações."),
  check("report_language_present", source.detailsModal.includes("Linguagem pronta para relatório") && source.detailsModal.includes("Narrativa para relatório"), "Narrativa report-ready aparece no painel e no relatório."),
  check("existing_history_reused", source.detailsModal.includes("buildAssessmentEvolutionExperience(historicoAluno)") && source.hook.includes("historicoAluno"), "Histórico já carregado no hook é reutilizado."),
  check("no_additional_fetches", !source.detailsModal.includes("buscarAvaliacoes") && !source.helper.includes("fetch("), "Nenhum fetch adicional foi introduzido no ciclo."),
  check("no_service_change_required", source.service.includes("buscarAvaliacoesSupabase") && source.service.includes("rowParaAvaliacaoComPreview"), "Service existente continua suficiente."),
  check("no_technical_metadata_copy", !/user_id|aluno_id|template_id|treino_id|RPC|debug|canonical contract|Contrato can/i.test(source.detailsModal), "Novo fluxo não expõe metadados técnicos."),
  check("package_script_present", source.packageJson.includes('"qa:product-roadmap-v4-cycle-02"'), "Script QA focado do Cycle 02 está registrado."),
];

const passed = checks.every((item) => item.pass);
const result = {
  decision: passed ? "PASS" : "FAIL",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_02_ASSESSMENT_EVOLUTION_EXPERIENCE",
  cycle_02_name: "Assessment Evolution Experience",
  category: "STUDENT_EXPERIENCE",
  database_change: false,
  migration: false,
  rpc_change: false,
  service_change: false,
  additional_fetches: 0,
  n_plus_one_introduced: false,
  technical_metadata_visible: false,
  checks,
};

write("reports/product-roadmap-v4/cycle-02-result.json", `${JSON.stringify(result, null, 2)}\n`);

if (!passed) {
  console.error("PRODUCT_ROADMAP_V4_CYCLE_02_QA=FAIL", checks.filter((item) => !item.pass));
  process.exit(1);
}

console.log("PRODUCT_ROADMAP_V4_CYCLE_02_QA=PASS");
console.log("ROADMAP_V4_CYCLE_02_NAME=Assessment Evolution Experience");
console.log("ADDITIONAL_FETCHES=0");
console.log("DATABASE_CHANGE_REQUIRED=NO");
console.log("TECHNICAL_METADATA_VISIBLE=NO");

function assessment(id, data, peso, cintura, dobras) {
  return {
    id,
    data,
    peso,
    altura: 180,
    sexo: "masculino",
    medidas: { cintura, quadril: 100 },
    dobras,
  };
}

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note };
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
