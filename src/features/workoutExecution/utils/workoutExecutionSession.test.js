import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  buildExecutionHistorySummary,
  buildExecutionSavePayload,
  canCompleteSession,
  formatDateOnlyPtBr,
  getLocalDateOnly,
  hasExecutionSetPerformanceData,
  normalizeExecutionSet,
  validateExecutionSet,
} from "./workoutExecutionSession.js";

test("normalizes zero load and zero reps as valid performed data", () => {
  const set = normalizeExecutionSet({ setNumber: 1, reps: 0, loadValue: 0, completed: true });

  assert.equal(set.reps, 0);
  assert.equal(set.loadValue, 0);
  assert.equal(validateExecutionSet(set).valid, true);
  assert.equal(hasExecutionSetPerformanceData({ reps: 0 }), true);
  assert.equal(hasExecutionSetPerformanceData({ loadValue: 0 }), true);
});

test("formats date-only values independently from machine timezone", () => {
  for (const [input, expected] of [
    ["2026-01-01", "01/01/2026"],
    ["2026-08-23", "23/08/2026"],
    ["2026-08-24", "24/08/2026"],
    ["2026-08-25", "25/08/2026"],
    ["2026-12-31", "31/12/2026"],
  ]) {
    assert.equal(formatDateOnlyPtBr(input), expected);
  }
});

test("builds local date-only from the runtime calendar instead of UTC ISO", () => {
  const localBoundary = new Date(2026, 7, 24, 22, 0, 0);

  assert.equal(getLocalDateOnly(localBoundary), "2026-08-24");
  assert.equal(getLocalDateOnly(new Date(2026, 7, 24, 23, 59, 0)), "2026-08-24");
  assert.equal(getLocalDateOnly(new Date(2026, 7, 25, 0, 1, 0)), "2026-08-25");
  assert.equal(getLocalDateOnly(new Date(2026, 0, 1, 0, 1, 0)), "2026-01-01");
});

test("does not complete or persist empty sets as performed", () => {
  const emptyChecked = normalizeExecutionSet({ setNumber: 1, completed: true });

  assert.equal(emptyChecked.completed, false);
  assert.equal(hasExecutionSetPerformanceData({}), false);
  assert.equal(canCompleteSession({
    status: "in_progress",
    exercises: [{ status: WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL, sets: [{ setNumber: 1, completed: true }] }],
  }), false);
});

test("validates RIR and RPE ranges", () => {
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rir: 10, rpe: 9.5 }).valid, true);
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rir: 11 }).valid, false);
  assert.equal(validateExecutionSet({ setNumber: 1, reps: 10, rpe: -1 }).valid, false);
});

test("allows completion only with skipped exercise or completed real set", () => {
  assert.equal(canCompleteSession({ status: "in_progress", exercises: [] }), false);
  assert.equal(canCompleteSession({
    status: "in_progress",
    exercises: [{ status: WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL, sets: [] }],
  }), false);
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

test("save payload keeps zero values and completed contract explicit", () => {
  const payload = buildExecutionSavePayload({
    id: "session",
    status: "in_progress",
    exercises: [{
      id: "exercise",
      status: "partial",
      sets: [
        { setNumber: 1, reps: 0, loadValue: 0, rir: 0, rpe: 0, completed: true },
        { setNumber: 2, reps: "", loadValue: "", completed: true },
      ],
    }],
  });

  assert.deepEqual(payload[0].sets, [
    { setNumber: 1, reps: 0, loadValue: 0, loadUnit: "kg", bodyweight: false, rir: 0, rpe: 0, completed: true },
    { setNumber: 2, reps: 0, loadValue: null, loadUnit: "kg", bodyweight: false, rir: null, rpe: null, completed: false },
  ]);
});

test("save payload records actual set load without mutating prescribed load snapshot", () => {
  const payload = buildExecutionSavePayload({
    id: "session",
    status: "in_progress",
    exercises: [{
      id: "exercise",
      status: "partial",
      prescribedLoad: "24 kg",
      sets: [
        { setNumber: 1, reps: 10, loadValue: 20, loadUnit: "kg", completed: true },
        { setNumber: 2, reps: 9, loadValue: 22, loadUnit: "kg", completed: true },
        { setNumber: 3, reps: 8, loadValue: 24, loadUnit: "kg", completed: true },
      ],
    }],
  });

  assert.deepEqual(payload[0].sets.map((set) => set.loadValue), [20, 22, 24]);
  assert.equal("prescribedLoad" in payload[0], false);
});

test("prescribed load is not automatically recorded as executed load", () => {
  const payload = buildExecutionSavePayload({
    id: "session",
    status: "in_progress",
    exercises: [{
      id: "exercise",
      status: "partial",
      prescribedLoad: "24 kg",
      sets: [{ setNumber: 1, reps: 10, completed: true }],
    }],
  });

  assert.equal(payload[0].sets[0].loadValue, null);
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
    statusLabel: "Concluído",
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
