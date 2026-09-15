import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPrescriptionFacts,
  isRecentlyCompleted,
  normalizeStudentTrainingLibraryV2,
  normalizeStudentWorkoutDetailV2,
} from "./studentTrainingLibraryV2.js";

test("normalizes program public name, ordered summaries and active-session mapping", () => {
  const library = normalizeStudentTrainingLibraryV2({
    currentProgram: { id: "program", displayName: "Hipertrofia — Fase 2", weeklyTarget: 3, workoutCount: 2 },
    workouts: [
      { id: "day-a", name: "Treino A", order: 1, exerciseCount: 2, setCount: 7 },
      { id: "day-b", name: "Treino B", order: 2, exerciseCount: 1, setCount: null },
    ],
    activeSession: { id: "session", treinoDiaId: "day-b", dayName: "Treino B" },
  });
  assert.equal(library.currentProgram.displayName, "Hipertrofia — Fase 2");
  assert.deepEqual(library.workouts.map((workout) => workout.id), ["day-a", "day-b"]);
  assert.equal(library.workouts[1].setCount, null);
  assert.equal(library.activeSession.treinoDiaId, "day-b");
});

test("represents no-program and empty-program states without invented data", () => {
  const noProgram = normalizeStudentTrainingLibraryV2({ currentProgram: null, workouts: [] });
  assert.equal(noProgram.currentProgram, null);
  assert.deepEqual(noProgram.workouts, []);

  const empty = normalizeStudentTrainingLibraryV2({ currentProgram: { id: "p", displayName: "Base" }, workouts: [] });
  assert.equal(empty.currentProgram.displayName, "Base");
  assert.equal(empty.currentProgram.weeklyTarget, null);
  assert.equal(empty.workouts.length, 0);
});

test("keeps prescription fields literal and media optional", () => {
  const detail = normalizeStudentWorkoutDetailV2({
    id: "day",
    exercises: [{
      id: "exercise",
      name: "Agachamento",
      series: "3",
      repetitions: "8–12",
      rest: "90 s",
      notes: "Controle a descida.",
      media: null,
      trackingConfig: { load: true, reps: true, rir: false },
    }],
  });
  const exercise = detail.exercises[0];
  assert.deepEqual(buildPrescriptionFacts(exercise), ["3 × 8–12", "Descanso: 90 s"]);
  assert.deepEqual(exercise.media, { type: "" });
  assert.equal(exercise.trackingConfig.load, true);
  assert.equal(exercise.trackingConfig.rir, false);
});

test("does not invent a repetition range or series count", () => {
  assert.deepEqual(buildPrescriptionFacts({ series: "3" }), ["3 séries"]);
  assert.deepEqual(buildPrescriptionFacts({ repetitions: "até a falha" }), ["até a falha repetições"]);
  assert.deepEqual(buildPrescriptionFacts({}), []);
});

test("marks only completions from the previous seven days as recent", () => {
  const now = new Date("2026-09-15T12:00:00Z");
  assert.equal(isRecentlyCompleted("2026-09-10T12:00:00Z", now), true);
  assert.equal(isRecentlyCompleted("2026-09-01T12:00:00Z", now), false);
  assert.equal(isRecentlyCompleted("invalid", now), false);
});

test("returns null for an unavailable detail", () => {
  assert.equal(normalizeStudentWorkoutDetailV2(null), null);
});
