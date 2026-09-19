import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPlayerSetCommandValues,
  buildPlayerSetRows,
  buildPlayerPrescriptionFacts,
  deriveCanonicalSetProgress,
  derivePlayerProgress,
  getPlayerTrackingFields,
  getPreviousSetReference,
  isPlayerSessionTerminal,
  normalizePreviousPerformance,
  normalizeWorkoutPlayerV2,
  resolveCurrentSetNumber,
  resolveCurrentExerciseIndex,
  validatePlayerSetInput,
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

test("builds prescribed rows and selects the first canonically pending set", () => {
  const exercise = {
    prescribedSeries: "3",
    sets: [{ setNumber: 1, reps: 10, completed: true, completedAt: "2026-09-19T12:00:00Z" }],
  };
  assert.deepEqual(buildPlayerSetRows(exercise).map((set) => set.setNumber), [1, 2, 3]);
  assert.equal(resolveCurrentSetNumber(exercise), 2);
  assert.equal(resolveCurrentSetNumber(exercise, 1), 1);
});

test("derives workout progress only from backend-confirmed sets", () => {
  const exercises = [
    { prescribedSeries: "2", sets: [{ setNumber: 1, completed: true }] },
    { prescribedSeries: "2", sets: [{ setNumber: 1, completed: false }] },
  ];
  assert.deepEqual(deriveCanonicalSetProgress(exercises), { completed: 1, total: 4, percent: 25 });
});

test("renders and serializes only canonically supported snapshot fields", () => {
  const config = { load: false, reps: true, rir: true, rpe: false, duration: true, distance: false };
  assert.deepEqual(getPlayerTrackingFields(config), ["reps", "rir"]);
  assert.deepEqual(buildPlayerSetCommandValues({ reps: "0", loadValue: "99", rir: "2" }, config), { reps: 0, rir: 2 });
  assert.equal(validatePlayerSetInput({ reps: "8.5", rir: "11" }, config).valid, false);
  assert.equal(validatePlayerSetInput({ reps: "0", rir: "0" }, config).valid, true);
});

test("normalizes persisted values and matches previous performance by prescription RPC and ordinal", () => {
  const player = normalizeWorkoutPlayerV2({
    exercises: [{ id: "execution", sets: [{ setNumber: 1, reps: 10, loadValue: 20, loadUnit: "kg", completed: true, completedAt: "2026-09-19T12:00:00Z" }] }],
  });
  assert.equal(player.exercises[0].sets[0].loadValue, 20);
  assert.equal(player.exercises[0].sets[0].completedAt, "2026-09-19T12:00:00Z");

  const previous = normalizePreviousPerformance({ sessionId: "previous", sets: [{ setNumber: 2, reps: 8, bodyweight: true, rir: 1 }] });
  assert.deepEqual(getPreviousSetReference(previous, 2), { setNumber: 2, facts: ["8 repetições", "peso corporal", "RIR 1"] });
  assert.equal(getPreviousSetReference(previous, 1), null);
  assert.equal(normalizePreviousPerformance(null), null);
});
