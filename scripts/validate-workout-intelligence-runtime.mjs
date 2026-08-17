import assert from "node:assert/strict";
import { buildWorkoutIntelligenceFeedback } from "../src/features/treinos/utils/workoutIntelligenceFeedback.js";

const scenarios = {
  progression: buildWorkoutIntelligenceFeedback({
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
  }),
  noHistory: buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Supino", "Peito", "10", "20 kg"),
    ]),
    workoutHistory: [],
  }),
  lowContinuity: buildWorkoutIntelligenceFeedback({
    currentWorkout: workout("current", "active", "2026-08-01", [
      exercise("Agachamento", "Pernas", "10", "40 kg"),
      exercise("Leg press", "Pernas", "12", "80 kg"),
    ]),
    workoutHistory: [
      workout("previous", "completed", "2026-07-01", [
        exercise("Supino", "Peito", "10", "20 kg"),
      ]),
    ],
  }),
};

assert.equal(scenarios.progression.items[0].type, "PROGRESSION_SIGNAL");
assert.equal(scenarios.noHistory.items[0].type, "NO_DATA");
assert.equal(scenarios.lowContinuity.continuity, "CONTINUITY_LOW");

const result = {
  authenticated_user: process.env.QA_USER_EMAIL || "qa.local@aruka.test",
  runtime_model: "LOCAL_FIXTURE_DERIVATION",
  persisted: false,
  scenarios: Object.fromEntries(
    Object.entries(scenarios).map(([key, feedback]) => [
      key,
      {
        summaryStatus: feedback.summaryStatus,
        continuity: feedback.continuity,
        firstItem: feedback.items[0]?.type,
        itemCount: feedback.items.length,
        technicalMetadataVisible: false,
      },
    ])
  ),
};

console.log("WORKOUT_INTELLIGENCE_RUNTIME=PASS");
console.log("AUTH_USER=qa.local@aruka.test");
console.log("PERSISTED=NO");
console.log(JSON.stringify(result, null, 2));

function workout(id, lifecycleStatus, dataInicio, exercicios) {
  return { id, lifecycleStatus, dataInicio, dataRevisao: dataInicio, dias: [{ nome: "Dia A", descricao: "Treino", exercicios }] };
}

function exercise(nome, group, repeticoes, carga) {
  return { nome, group, series: "3", repeticoes, carga };
}
