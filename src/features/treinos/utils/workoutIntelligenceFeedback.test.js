import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WORKOUT_CONTINUITY,
  WORKOUT_FEEDBACK_CONFIDENCE,
  WORKOUT_FEEDBACK_TYPE,
  buildWorkoutIntelligenceFeedback,
} from "./workoutIntelligenceFeedback.js";

test("prioriza sinais de progressao prescrita sem afirmar execucao real", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
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

  assert.equal(feedback.summaryStatus, WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL);
  assert.equal(feedback.continuity, WORKOUT_CONTINUITY.GOOD);
  assert.equal(feedback.items[0].type, WORKOUT_FEEDBACK_TYPE.PROGRESSION_SIGNAL);
  assert.equal(feedback.items[0].confidence, WORKOUT_FEEDBACK_CONFIDENCE.HIGH);
  assert.equal(feedback.evidence.loadProgressCount, 1);
  assert.equal(feedback.evidence.repProgressCount, 1);
});

test("identifica padrao estavel como informativo", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Supino", "Peito", "10", "20 kg"),
      exercise("Puxada", "Costas", "12", "30 kg"),
    ]),
    workoutHistory: [
      workout("previous", "completed", "2026-07-01", [
        exercise("Supino", "Peito", "10", "20 kg"),
        exercise("Puxada", "Costas", "12", "30 kg"),
      ]),
    ],
  });

  assert.equal(feedback.summaryStatus, WORKOUT_FEEDBACK_TYPE.STABLE_PATTERN);
  assert.equal(feedback.items[0].type, WORKOUT_FEEDBACK_TYPE.STABLE_PATTERN);
  assert.equal(feedback.evidence.stableCount, 2);
});

test("marca historico parcial quando campos nao sao comparaveis", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Supino", "Peito", "10-12", "moderada"),
    ]),
    workoutHistory: [
      workout("previous", "completed", "2026-07-01", [
        exercise("Supino", "Peito", "8-10", "leve"),
      ]),
    ],
  });

  assert.equal(feedback.summaryStatus, WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY);
  assert.equal(feedback.items[0].type, WORKOUT_FEEDBACK_TYPE.PARTIAL_HISTORY);
  assert.equal(feedback.evidence.partialCount, 1);
});

test("distingue exercicios novos de progresso", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Supino", "Peito", "10", "20 kg"),
      exercise("Remada", "Costas", "12", "25 kg"),
    ]),
    workoutHistory: [
      workout("previous", "completed", "2026-07-01", [
        exercise("Supino", "Peito", "10", "20 kg"),
      ]),
    ],
  });

  assert.equal(feedback.evidence.newExerciseCount, 1);
  assert.ok(feedback.items.some((item) => item.type === WORKOUT_FEEDBACK_TYPE.NEW_EXERCISE));
  assert.equal(feedback.evidence.loadProgressCount, 0);
});

test("retorna estado sem dados quando nao ha ficha anterior", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Supino", "Peito", "10", "20 kg"),
    ]),
    workoutHistory: [],
  });

  assert.equal(feedback.summaryStatus, WORKOUT_FEEDBACK_TYPE.NO_DATA);
  assert.equal(feedback.continuity, WORKOUT_CONTINUITY.UNKNOWN);
  assert.equal(feedback.items[0].type, WORKOUT_FEEDBACK_TYPE.NO_DATA);
});

test("classifica baixa continuidade quando quase nada combina", () => {
  const feedback = buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Agachamento", "Pernas", "10", "40 kg"),
      exercise("Leg press", "Pernas", "12", "80 kg"),
      exercise("Cadeira extensora", "Pernas", "12", "30 kg"),
    ]),
    workoutHistory: [
      workout("previous", "completed", "2026-07-01", [
        exercise("Supino", "Peito", "10", "20 kg"),
        exercise("Puxada", "Costas", "12", "30 kg"),
      ]),
    ],
  });

  assert.equal(feedback.continuity, WORKOUT_CONTINUITY.LOW);
  assert.ok(feedback.items.some((item) => item.type === WORKOUT_FEEDBACK_TYPE.CONTINUITY_BREAK));
});

function workout(id, lifecycleStatus, dataInicio, exercicios) {
  return {
    id,
    lifecycleStatus,
    dataInicio,
    dataRevisao: dataInicio,
    createdAt: `${dataInicio}T09:00:00Z`,
    alunoId: "student-1",
    dias: [{ nome: "Dia A", descricao: exercicios[0]?.group || "Treino", exercicios }],
  };
}

function exercise(nome, group, repeticoes, carga) {
  return { nome, group, series: "3", repeticoes, carga };
}
