import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAssessmentEvolution,
  buildWorkoutEvolutionHistory,
  formatMeasurement,
  normalizeStudentEvolutionPayload,
} from "./studentEvolutionV2.js";

test("normalizes complete frequency periods independently from recent history", () => {
  const view = normalizeStudentEvolutionPayload({
    calendar: { today: "2026-09-20", timeZone: "America/Sao_Paulo" },
    frequency: [
      { key: "last7Days", startDate: "2026-09-14", endDate: "2026-09-20", completedCount: 63 },
      { key: "last28Days", startDate: "2026-08-24", endDate: "2026-09-20", completedCount: 80 },
    ],
  });
  assert.equal(view.frequency[0].completedCount, 63);
  assert.equal(view.frequency[1].completedCount, 80);
  assert.equal(view.frequency[0].label, "Últimos 7 dias");
});

test("history includes only completed sessions and counts only completed sets and exercises", () => {
  const history = buildWorkoutEvolutionHistory([
    { id: "pending", status: "in_progress", sessionDate: "2026-09-20" },
    { id: "cancelled", status: "cancelled", sessionDate: "2026-09-19" },
    {
      id: "short-valid", status: "completed", sessionDate: "2026-09-18", shortDurationConfirmed: true,
      exercises: [
        { workoutTitle: "A", dayName: "Superior", status: "skipped", sets: [] },
        { workoutTitle: "A", dayName: "Superior", sets: [{ completed: true }, { completed: false }] },
      ],
    },
  ]);
  assert.deepEqual(history.map((item) => item.id), ["short-valid"]);
  assert.equal(history[0].completedSetCount, 1);
  assert.equal(history[0].completedExerciseCount, 1);
  assert.equal(history[0].shortDurationConfirmed, true);
});

test("history ordering is stable for equal civil dates", () => {
  const history = buildWorkoutEvolutionHistory([
    { id: "a", status: "completed", sessionDate: "2026-09-20", completedAt: "2026-09-20T10:00:00Z" },
    { id: "b", status: "completed", sessionDate: "2026-09-20", completedAt: "2026-09-20T11:00:00Z" },
  ]);
  assert.deepEqual(history.map((item) => item.id), ["b", "a"]);
});

test("assessment states distinguish empty baseline comparable and partial data", () => {
  assert.equal(buildAssessmentEvolution({ items: [] }).status, "empty");
  const baseline = buildAssessmentEvolution({ items: [{ id: "a", date: "2026-01-01", measurements: { weightKg: 80 } }] });
  assert.equal(baseline.status, "baseline");
  assert.equal(baseline.comparableCount, 0);
  const compared = buildAssessmentEvolution({ items: [
    { id: "new", date: "2026-02-01", measurements: { weightKg: 79, waistCm: 88 } },
    { id: "old", date: "2026-01-01", measurements: { weightKg: 80 } },
  ] });
  assert.equal(compared.status, "comparable");
  assert.equal(compared.comparableCount, 1);
  assert.equal(compared.comparisons.find((item) => item.key === "weightKg").delta, -1);
  assert.equal(compared.comparisons.find((item) => item.key === "waistCm").delta, null);
  assert.equal(formatMeasurement(-1, "kg", true), "-1,0 kg");
});

test("student assessment model contains no clinical interpretation or private fields", () => {
  const result = buildAssessmentEvolution({ items: [{
    id: "a", date: "2026-01-01", measurements: { weightKg: 80 },
    observacoes: "private", foto_frente_url: "private", percentual_gordura: 20,
  }] });
  const serialized = JSON.stringify(result);
  assert.doesNotMatch(serialized, /observacoes|foto|gordura|diagn[oó]stico|melhor|pior|recomenda/i);
});
