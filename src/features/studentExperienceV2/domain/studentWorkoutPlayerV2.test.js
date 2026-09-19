import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPlayerPrescriptionFacts,
  derivePlayerProgress,
  isPlayerSessionTerminal,
  normalizeWorkoutPlayerV2,
  resolveCurrentExerciseIndex,
} from "./studentWorkoutPlayerV2.js";

test("normalizes and orders player exercises by canonical snapshot order", () => {
  const player = normalizeWorkoutPlayerV2({
    id: "session-1",
    status: "in_progress",
    exercises: [
      { id: "c", dayOrder: 2, exerciseOrder: 1, name: "C" },
      { id: "b", dayOrder: 1, exerciseOrder: 2, name: "B" },
      { id: "a", dayOrder: 1, exerciseOrder: 2, name: "A" },
      { id: "z", dayOrder: 1, exerciseOrder: 1, name: "Z" },
    ],
  });
  assert.deepEqual(player.exercises.map((exercise) => exercise.id), ["z", "a", "b", "c"]);
});

test("resolves stored exercise without treating navigation as completion", () => {
  const exercises = [
    { id: "a", status: "not_started", sets: [] },
    { id: "b", status: "skipped", sets: [] },
    { id: "c", status: "partial", sets: [{ completed: true }] },
  ];
  assert.equal(resolveCurrentExerciseIndex(exercises, "c"), 2);
  assert.deepEqual(exercises.map((exercise) => exercise.status), ["not_started", "skipped", "partial"]);
});

test("falls back to first actionable exercise and derives structural progress", () => {
  const exercises = [
    { id: "a", status: "skipped", sets: [] },
    { id: "b", status: "not_started", sets: [] },
    { id: "c", status: "not_started", sets: [] },
  ];
  assert.equal(resolveCurrentExerciseIndex(exercises), 1);
  assert.deepEqual(derivePlayerProgress(exercises, 1), { total: 3, position: 2, percent: 67 });
  assert.deepEqual(derivePlayerProgress([], -1), { total: 0, position: 0, percent: 0 });
});

test("uses only real snapshot prescription values", () => {
  assert.deepEqual(buildPlayerPrescriptionFacts({ prescribedSeries: "3", prescribedReps: "8-10", prescribedRest: "60s" }), ["3 × 8-10", "Descanso: 60s"]);
  assert.deepEqual(buildPlayerPrescriptionFacts({}), []);
});

test("terminal sessions are immutable in the player contract", () => {
  assert.equal(isPlayerSessionTerminal("completed"), true);
  assert.equal(isPlayerSessionTerminal("cancelled"), true);
  assert.equal(isPlayerSessionTerminal("abandoned"), true);
  assert.equal(isPlayerSessionTerminal("in_progress"), false);
});
