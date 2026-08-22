import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  buildExecutionHistorySummary,
  canCompleteSession,
  normalizeExecutionSet,
  validateExecutionSet,
} from "./workoutExecutionSession.js";

test("normalizes zero load and zero reps as valid performed data", () => {
  const set = normalizeExecutionSet({ setNumber: 1, reps: 0, loadValue: 0, completed: true });

  assert.equal(set.reps, 0);
  assert.equal(set.loadValue, 0);
  assert.equal(validateExecutionSet(set).valid, true);
});

test("validates RIR and RPE ranges", () => {
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rir: 10, rpe: 9.5 }).valid, true);
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rir: 11 }).valid, false);
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rpe: -1 }).valid, false);
});

test("allows completion only with touched exercise or completed set", () => {
  assert.equal(canCompleteSession({ status: "in_progress", exercises: [] }), false);
  assert.equal(canCompleteSession({
    status: "in_progress",
    exercises: [{ status: WORKOUT_EXECUTION_EXERCISE_STATUS.SKIPPED, sets: [] }],
  }), true);
  assert.equal(canCompleteSession({
    status: "in_progress",
    exercises: [{ status: "not_started", sets: [{ setNumber: 1, reps: 8, completed: true }] }],
  }), true);
  assert.equal(canCompleteSession({
    status: "completed",
    exercises: [{ status: "completed", sets: [{ setNumber: 1, reps: 8, completed: true }] }],
  }), false);
});

test("summarizes recent history without analytics claims", () => {
  const summary = buildExecutionHistorySummary({
    id: "session-1",
    status: "completed",
    sessionDate: "2026-08-22",
    completedAt: "2026-08-22T12:00:00Z",
    exercises: [
      {
        workoutTitle: "Treino A",
        dayName: "Dia 1",
        status: "completed",
        sets: [{ setNumber: 1, reps: 10, completed: true }],
      },
    ],
  });

  assert.deepEqual(summary, {
    id: "session-1",
    status: "completed",
    date: "2026-08-22",
    dateLabel: "22/08/2026",
    workoutTitle: "Treino A",
    dayName: "Dia 1",
    statusLabel: "Concluido",
    exerciseCount: 1,
    setCount: 1,
    completedSetCount: 1,
    completedAt: "2026-08-22T12:00:00Z",
    abandonedAt: "",
  });
});

test("summarizes recent history lists for UI rendering", () => {
  const summary = buildExecutionHistorySummary([
    {
      id: "session-1",
      status: "abandoned",
      sessionDate: "2026-08-21",
      exercises: [],
    },
  ]);

  assert.equal(summary.length, 1);
  assert.equal(summary[0].statusLabel, "Abandonado");
});
