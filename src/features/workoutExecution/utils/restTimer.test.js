import test from "node:test";
import assert from "node:assert/strict";
import {
  REST_TIMER_STORAGE_KEY,
  buildExecutionSetNumbers,
  clearRestTimerState,
  createRestDeadline,
  createRestTimerState,
  formatRestDuration,
  getRemainingRestTime,
  parseRestDuration,
  parsePrescribedSeriesCount,
  restoreRestTimerState,
  restoreRestTimerForSession,
  saveRestTimerState,
  shouldStartRestAfterSetUpdate,
} from "./restTimer.js";

test("parses accepted rest formats", () => {
  assert.equal(parseRestDuration("30"), 30);
  assert.equal(parseRestDuration("60s"), 60);
  assert.equal(parseRestDuration("90s"), 90);
  assert.equal(parseRestDuration("120s"), 120);
  assert.equal(parseRestDuration("1 min"), 60);
  assert.equal(parseRestDuration("1min"), 60);
  assert.equal(parseRestDuration("1:30"), 90);
  assert.equal(parseRestDuration(null), 0);
  assert.equal(parseRestDuration(0), 0);
  assert.equal(parseRestDuration("invalid text"), 0);
});

test("formats rest durations", () => {
  assert.equal(formatRestDuration(30), "00:30");
  assert.equal(formatRestDuration(60), "01:00");
  assert.equal(formatRestDuration(90), "01:30");
  assert.equal(formatRestDuration(120), "02:00");
});

test("uses absolute deadline as source of truth", () => {
  const deadline = createRestDeadline(90, 0);
  assert.equal(getRemainingRestTime(deadline, 10_000), 80);
  assert.equal(getRemainingRestTime(deadline, 70_000), 20);
  assert.equal(getRemainingRestTime(deadline, 90_000), 0);
});

test("saves, restores and isolates local timer state", () => {
  const storage = createMemoryStorage();
  const state = createRestTimerState({
    sessionId: "session-a",
    exerciseId: "exercise-a",
    exerciseName: "Supino",
    setNumber: 1,
    durationSeconds: 90,
    now: 0,
  });

  assert.equal(saveRestTimerState(storage, state), true);
  assert.deepEqual(restoreRestTimerState(storage, { sessionId: "session-a", exerciseId: "exercise-a", now: 20_000 }), state);
  assert.deepEqual(restoreRestTimerForSession(storage, { sessionId: "session-a", now: 20_000 }), state);
  assert.equal(restoreRestTimerState(storage, { sessionId: "session-b", exerciseId: "exercise-a", now: 20_000 }), null);
  assert.equal(restoreRestTimerState(storage, { sessionId: "session-a", exerciseId: "exercise-b", now: 20_000 }), null);
  assert.equal(restoreRestTimerState(storage, { sessionId: "session-a", exerciseId: "exercise-a", now: 91_000 }), null);

  storage.setItem(REST_TIMER_STORAGE_KEY, "{");
  assert.equal(restoreRestTimerState(storage, { sessionId: "session-a", exerciseId: "exercise-a", now: 20_000 }), null);

  clearRestTimerState(storage);
  assert.equal(storage.getItem(REST_TIMER_STORAGE_KEY), null);
});

test("starts rest on explicit completed set even after set data already marked it completed", () => {
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber: 2, reps: "10", loadValue: "40", completed: true },
      setNumber: 2,
      prescribedRest: "90s",
      prescribedSeries: "3 series",
    }),
    true
  );
});

test("does not start rest for empty, auto-filled or last prescribed set", () => {
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber: 1 },
      setNumber: 1,
      prescribedRest: "90s",
      prescribedSeries: "3 series",
    }),
    false
  );
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "reps",
      value: "10",
      set: { setNumber: 1, reps: "10" },
      setNumber: 1,
      prescribedRest: "90s",
      prescribedSeries: "3 series",
    }),
    false
  );
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber: 3, reps: "10" },
      setNumber: 3,
      prescribedRest: "90s",
      prescribedSeries: "3 series",
    }),
    false
  );
});

test("parses prescribed series count from series snapshot only", () => {
  assert.equal(parsePrescribedSeriesCount("1"), 1);
  assert.equal(parsePrescribedSeriesCount("2 series"), 2);
  assert.equal(parsePrescribedSeriesCount("3 séries"), 3);
  assert.equal(parsePrescribedSeriesCount("4 sets"), 4);
  assert.equal(parsePrescribedSeriesCount(""), 0);
  assert.equal(parsePrescribedSeriesCount("invalid"), 0);
  assert.equal(parsePrescribedSeriesCount("8-12"), 0);
});

test("builds execution set rows from prescribed series and preserves persisted overflow", () => {
  assert.deepEqual(buildExecutionSetNumbers("1"), [1]);
  assert.deepEqual(buildExecutionSetNumbers("2"), [1, 2]);
  assert.deepEqual(buildExecutionSetNumbers("3"), [1, 2, 3]);
  assert.deepEqual(buildExecutionSetNumbers("4"), [1, 2, 3, 4]);
  assert.deepEqual(buildExecutionSetNumbers("5"), [1, 2, 3, 4, 5]);
  assert.deepEqual(buildExecutionSetNumbers("6"), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(buildExecutionSetNumbers("", []), [1]);
  assert.deepEqual(buildExecutionSetNumbers("4", [{ setNumber: 5 }]), [1, 2, 3, 4, 5]);
});

test("last-set guard uses prescribed series count", () => {
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber: 1, reps: "10" },
      setNumber: 1,
      prescribedRest: "120s",
      prescribedSeries: "4",
    }),
    true
  );
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber: 4, reps: "10" },
      setNumber: 4,
      prescribedRest: "120s",
      prescribedSeries: "4",
    }),
    false
  );
});

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}
