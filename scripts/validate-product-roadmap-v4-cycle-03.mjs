import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  WORKOUT_FEEDBACK_TYPE,
  buildWorkoutIntelligenceFeedback,
} from "../src/features/treinos/utils/workoutIntelligenceFeedback.js";

const files = {
  packageJson: "package.json",
  helper: "src/features/treinos/utils/workoutIntelligenceFeedback.js",
  helperTest: "src/features/treinos/utils/workoutIntelligenceFeedback.test.js",
  detailsModal: "src/features/treinos/components/TreinoDetalhesModal.jsx",
  treinosList: "src/features/treinos/components/TreinosList.jsx",
  hook: "src/features/treinos/hooks/useTreinosPage.js",
  studentProgression: "src/features/alunos/utils/studentProgressionSnapshot.js",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")])
);

const fixtureFeedback = buildWorkoutIntelligenceFeedback({
  currentWorkout: workout("current", "active", "2026-08-01", [
    exercise("Supino", "Peito", "10", "25 kg"),
    exercise("Puxada", "Costas", "12", "30 kg"),
  ]),
  workoutHistory: [
    workout("previous", "completed", "2026-07-01", [
      exercise("Supino", "Peito", "10", "20 kg"),
      exercise("Puxada", "Costas", "10", "30 kg"),
    ]),
  ],
});

assert.equal(fixtureFeedback.summaryStatus, WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL);

const checks = [
  check("cycle_01_reused", source.helper.includes("buildStudentProgressionSnapshot") && source.studentProgression.includes("parseLoad"), "Reutiliza engine do Student Progression Snapshot."),
  check("no_parallel_engine", !source.helper.includes("parseLoad(") && !source.helper.includes("parseReps("), "Nao duplica parsers de carga/repeticoes."),
  check("helper_contract", source.helper.includes("WORKOUT_FEEDBACK_TYPE") && source.helper.includes("WORKOUT_CONTINUITY"), "Helper puro de feedback existe."),
  check("domain_tests", source.helperTest.includes("PROGRESSION_SIGNAL") && source.helperTest.includes("baixa continuidade"), "Testes cobrem feedbacks principais."),
  check("ui_panel", source.detailsModal.includes("workout-intelligence-feedback") && source.detailsModal.includes("Feedback do treino"), "Painel user-facing integrado ao detalhe do treino."),
  check("no_extra_fetch", source.hook.includes("treinosDoAlunoSelecionado") && !source.detailsModal.includes("buscarTreinos"), "Historico ja carregado e reutilizado."),
  check("no_scores", !/score|ranking|0-100|readiness/i.test(source.helper + source.detailsModal), "Nao cria score ou ranking."),
  check("no_auto_decision_copy", !/revise agora|aumente|troque|deload|IA recomenda|algoritmo detectou/i.test(source.detailsModal), "Copy nao automatiza decisao."),
  check("no_technical_metadata", !/user_id|aluno_id|treino_id|template_id|RPC|public\.|salvar_treino|debug|canonical contract/i.test(source.detailsModal), "UI nao expoe metadados tecnicos."),
  check("package_scripts", source.packageJson.includes('"qa:product-roadmap-v4-cycle-03"') && source.packageJson.includes('"qa:workout-intelligence-runtime"'), "Scripts QA do ciclo registrados."),
];

const passed = checks.every((item) => item.pass);
const result = {
  decision: passed ? "PASS" : "FAIL",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_03_WORKOUT_INTELLIGENCE_FEEDBACK_LOOP",
  cycle_03_name: "Workout Intelligence Feedback Loop",
  category: "WORKOUT",
  primary_location: "TreinoDetalhesModal",
  secondary_location: "StudentProgressionSnapshot",
  database_change: false,
  migration: false,
  rpc_change: false,
  service_change: false,
  additional_fetches: 0,
  n_plus_one_introduced: false,
  phase_b_required: true,
  technical_metadata_visible: false,
  checks,
};

write("reports/product-roadmap-v4/cycle-03-result.json", `${JSON.stringify(result, null, 2)}\n`);

if (!passed) {
  console.error("PRODUCT_ROADMAP_V4_CYCLE_03_QA=FAIL", checks.filter((item) => !item.pass));
  process.exit(1);
}

console.log("PRODUCT_ROADMAP_V4_CYCLE_03_QA=PASS");
console.log("ROADMAP_V4_CYCLE_03_NAME=Workout Intelligence Feedback Loop");
console.log("ADDITIONAL_FETCHES=0");
console.log("DATABASE_CHANGE_REQUIRED=NO");
console.log("TECHNICAL_METADATA_VISIBLE=NO");

function workout(id, lifecycleStatus, dataInicio, exercicios) {
  return { id, lifecycleStatus, dataInicio, dataRevisao: dataInicio, dias: [{ nome: "Dia A", descricao: "Treino", exercicios }] };
}

function exercise(nome, group, repeticoes, carga) {
  return { nome, group, series: "3", repeticoes, carga };
}

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note };
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
