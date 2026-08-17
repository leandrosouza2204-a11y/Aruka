import assert from "node:assert/strict";
import test from "node:test";
import {
  EXERCISE_MATCH_CONFIDENCE,
  STUDENT_PROGRESSION_SIGNAL,
  STUDENT_PROGRESSION_STATUS,
  buildStudentProgressionSnapshot,
  normalizeExerciseName,
  parseLoad,
  parseReps,
} from "./studentProgressionSnapshot.js";

test("detecta progressao de carga numerica compativel", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Supino maquina", "3", "10", "25 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Supino maquina", "3", "10", "20 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.PROGRESSING);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS);
});

test("detecta progressao de repeticoes com mesma carga", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Puxada", "3", "12", "30 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Puxada", "3", "10", "30 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.PROGRESSING);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS);
});

test("classifica stable quando carga e reps permanecem iguais", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Rosca", "3", "10", "10 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Rosca", "3", "10", "10 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.STABLE);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.STABLE);
});

test("um unico treino gera dados insuficientes", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Supino", "3", "10", "20 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA);
});

test("exercicio novo nao vira progressao", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Elevacao lateral", "3", "12", "6 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Supino", "3", "10", "20 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE);
});

test("carga textual fica como historico parcial", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Supino", "3", "10", "pesada")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Supino", "3", "10", "moderada")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.PARTIAL_HISTORY);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA);
});

test("faixa de reps nao e comparada numericamente", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Supino", "3", "10-12", "20 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Supino", "3", "8-12", "20 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.PARTIAL_HISTORY);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA);
});

test("nome com acento e case mantem match seguro", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Supino Maquina", "3", "10", "25 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("supino máquina", "3", "10", "20 kg")]),
  ]);

  assert.equal(normalizeExerciseName(" Supino Máquina "), "supino maquina");
  assert.equal(snapshot.signals[0].matchConfidence, EXERCISE_MATCH_CONFIDENCE.NAME_AND_GROUP);
});

test("exercicio trocado fica sem match", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Agachamento", "3", "10", "40 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Leg press", "3", "10", "80 kg")]),
  ]);

  assert.equal(snapshot.signals[0].matchConfidence, EXERCISE_MATCH_CONFIDENCE.NO_MATCH);
  assert.equal(snapshot.signals[0].type, STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE);
});

test("dois treinos sem comparaveis ficam insuficientes", () => {
  const snapshot = buildStudentProgressionSnapshot([
    treino("atual", "active", "2026-08-10", [exercicio("Agachamento", "3", "10", "40 kg")]),
    treino("anterior", "completed", "2026-07-10", [exercicio("Supino", "3", "10", "20 kg")]),
  ]);

  assert.equal(snapshot.status, STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA);
});

test("parsers aceitam apenas formatos conservadores", () => {
  assert.deepEqual(parseLoad("20,5 kg"), { raw: "20,5 kg", numericValue: 20.5, unit: "kg", parseable: true });
  assert.equal(parseLoad("barra + 10").parseable, false);
  assert.equal(parseLoad("peso corporal").parseable, false);
  assert.equal(parseReps("12").numericValue, 12);
  assert.equal(parseReps("8-12").parseable, false);
});

function treino(id, lifecycleStatus, dataInicio, exercicios) {
  return {
    id,
    lifecycleStatus,
    dataInicio,
    dataRevisao: dataInicio,
    createdAt: `${dataInicio}T09:00:00Z`,
    dias: [{ nome: "Dia A", descricao: "Superiores", exercicios }],
  };
}

function exercicio(nome, series, repeticoes, carga) {
  return { nome, series, repeticoes, carga };
}
