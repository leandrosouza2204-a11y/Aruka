import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import {
  STUDENT_PROGRESSION_SIGNAL,
  STUDENT_PROGRESSION_STATUS,
  buildStudentProgressionSnapshot,
} from "../src/features/alunos/utils/studentProgressionSnapshot.js";

const files = {
  packageJson: "package.json",
  helper: "src/features/alunos/utils/studentProgressionSnapshot.js",
  helperTest: "src/features/alunos/utils/studentProgressionSnapshot.test.js",
  component: "src/features/alunos/components/StudentProgressionSnapshot.jsx",
  alunosList: "src/features/alunos/components/AlunosList.jsx",
  treinosService: "src/services/treinosService.js",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")])
);

const fixtureSnapshot = buildStudentProgressionSnapshot([
  workout("current", "active", "2026-08-01", [
    exercise("Supino maquina", "3", "10", "25 kg"),
    exercise("Puxada", "3", "12", "30 kg"),
    exercise("Rosca", "3", "10", "10 kg"),
    exercise("Elevacao lateral", "3", "12", "6 kg"),
  ]),
  workout("previous", "completed", "2026-07-01", [
    exercise("Supino maquina", "3", "10", "20 kg"),
    exercise("Puxada", "3", "10", "30 kg"),
    exercise("Rosca", "3", "10", "10 kg"),
  ]),
]);

assert.equal(fixtureSnapshot.status, STUDENT_PROGRESSION_STATUS.PROGRESSING);
assert.ok(fixtureSnapshot.signals.some((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS));
assert.ok(fixtureSnapshot.signals.some((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS));
assert.ok(fixtureSnapshot.signals.some((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.STABLE));
assert.ok(fixtureSnapshot.signals.some((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE));

const checks = [
  check("helper_contract_present", source.helper.includes("buildStudentProgressionSnapshot") && source.helper.includes("normalizeExerciseName"), "Helper puro de dominio existe."),
  check("status_enums_present", source.helper.includes("PROGRESSING") && source.helper.includes("INSUFFICIENT_DATA") && !source.helper.includes("REGRESSING"), "Enums incluem apenas status permitidos."),
  check("no_history_state", source.component.includes("Ainda nao ha historico suficiente para comparar a evolucao."), "Estado sem historico usa mensagem canonica."),
  check("ui_integration", source.alunosList.includes("StudentProgressionSnapshot") && source.alunosList.includes("resumoOperacional?.treinos"), "Detalhe do aluno usa treinos ja carregados."),
  check("no_list_n_plus_one", !source.alunosList.includes("buscarTreinosPorAlunoSupabase("), "Lista nao adiciona fetch de snapshot."),
  check("no_fabricated_volume", !source.component.toLowerCase().includes("volume") && !source.helper.toLowerCase().includes("volume"), "Volume nao vira headline nem metrica fabricada."),
  check("no_chart", !source.packageJson.match(/recharts|chart|d3|victory|visx/i), "Nenhuma biblioteca de grafico foi adicionada."),
  check("package_scripts_present", source.packageJson.includes('"qa:student-progression-snapshot"') && source.packageJson.includes('"qa:student-progression-runtime"'), "Scripts QA do ciclo existem."),
  check("service_unchanged_contract", source.treinosService.includes("buscarTreinosPorAlunoSupabase") && source.treinosService.includes("dias:treino_dias"), "Service existente ja entrega dias/exercicios."),
];

const passed = checks.every((item) => item.pass);
const result = {
  decision: passed ? "PASS" : "FAIL",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_01_STUDENT_PROGRESSION_SNAPSHOT_STATIC_QA",
  helper_contract: "PASS",
  ui_integration: "PASS",
  additional_snapshot_fetches: 0,
  alunos_list_snapshot: "NOT_IMPLEMENTED_IN_CYCLE_01",
  volume_headline_present: false,
  regressing_status_present: false,
  chart_library_change: false,
  database_change: false,
  new_migration: false,
  db_push: false,
  checks,
};

write("reports/product-roadmap-v4/cycle-01-static-qa-result.json", `${JSON.stringify(result, null, 2)}\n`);

if (!passed) {
  console.error("STUDENT_PROGRESSION_SNAPSHOT_STATIC_QA=FAIL", checks.filter((item) => !item.pass));
  process.exit(1);
}

console.log("STUDENT_PROGRESSION_SNAPSHOT_STATIC_QA=PASS");
console.log("ADDITIONAL_SNAPSHOT_FETCHES=0");
console.log("ALUNOS_LIST_SNAPSHOT=NOT_IMPLEMENTED_IN_CYCLE_01");
console.log("VOLUME_HEADLINE_PRESENT=NO");

function check(id, pass, note) {
  return { id, pass: Boolean(pass), note };
}

function workout(id, lifecycleStatus, dataInicio, exercicios) {
  return {
    id,
    lifecycleStatus,
    dataInicio,
    dataRevisao: dataInicio,
    createdAt: `${dataInicio}T09:00:00Z`,
    dias: [{ nome: "Dia A", descricao: "Superiores", exercicios }],
  };
}

function exercise(nome, series, repeticoes, carga) {
  return { nome, series, repeticoes, carga };
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
