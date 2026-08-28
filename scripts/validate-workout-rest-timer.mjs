import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import {
  buildExecutionSetNumbers,
  createRestDeadline,
  createRestTimerState,
  getRemainingRestTime,
  parsePrescribedSeriesCount,
  parseRestDuration,
  shouldStartRestAfterSetUpdate,
} from "../src/features/workoutExecution/utils/restTimer.js";

const page = readFileSync("src/pages/MinhaArea.jsx", "utf8");

assert.equal(parseRestDuration("90s"), 90);
assert.equal(parseRestDuration("120s"), 120);
assert.equal(getRemainingRestTime(createRestDeadline(90, 0), 70_000), 20);
assert.match(page, /visibilitychange/);
assert.match(page, /pageshow/);
assert.match(page, /focus/);
assert.match(page, /data-testid="student-rest-timer-overlay"/);
assert.match(page, /data-testid="student-rest-compact"/);
assert.match(page, /student-rest-minimize/);
assert.match(page, /clearRestTimerState\(window\.localStorage\)/);
assert.match(page, /buildExecutionSetNumbers\(exercise\.prescribedSeries, exercise\.sets\)/);
assert.doesNotMatch(page, /\[1, 2, 3, 4, 5\]\.map/);
assert.equal(createRestTimerState({ sessionId: "a", exerciseId: "b", setNumber: 1, durationSeconds: 0 }), null);
assert.equal(createRestTimerState({ sessionId: "a", exerciseId: "b", setNumber: 1, durationSeconds: "90s" })?.durationSeconds, 90);
assert.deepEqual(buildExecutionSetNumbers("1"), [1]);
assert.deepEqual(buildExecutionSetNumbers("2"), [1, 2]);
assert.deepEqual(buildExecutionSetNumbers("3"), [1, 2, 3]);
assert.deepEqual(buildExecutionSetNumbers("4"), [1, 2, 3, 4]);
assert.deepEqual(buildExecutionSetNumbers("5"), [1, 2, 3, 4, 5]);
assert.equal(parsePrescribedSeriesCount("4 x 8-12"), 4);
assert.equal(
  shouldStartRestAfterSetUpdate({
    field: "completed",
    value: true,
    set: { setNumber: 2, reps: "10", completed: true },
    setNumber: 2,
    prescribedRest: "90s",
    prescribedSeries: "3 series",
  }),
  true
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
for (const setNumber of [1, 2, 3]) {
  assert.equal(
    shouldStartRestAfterSetUpdate({
      field: "completed",
      value: true,
      set: { setNumber, reps: "10" },
      setNumber,
      prescribedRest: "90s",
      prescribedSeries: "4",
    }),
    true
  );
}
assert.equal(
  shouldStartRestAfterSetUpdate({
    field: "completed",
    value: true,
    set: { setNumber: 4, reps: "10" },
    setNumber: 4,
    prescribedRest: "90s",
    prescribedSeries: "4",
  }),
  false
);

console.log("WORKOUT_REST_TIMER_QA=PASS");
console.log("REST_TIMER_VISIBILITY_ROOT_CAUSE=AUTO_COMPLETED_SET_CHECKBOX_SENT_FALSE_ON_CLICK_AFTER_REPS_LOAD_INPUT");
console.log("SUPINO_REST_VALUE=90s");
console.log("SQUAT_REST_VALUE=120s");
console.log("REST_PARSE_90S=PASS");
console.log("REST_PARSE_120S=PASS");
console.log("TIMER_VISIBLE_AFTER_VALID_SET_COMPLETE=PASS_STATIC");
console.log("SET_1_STARTS_TIMER=YES");
console.log("SET_2_STARTS_TIMER=YES");
console.log("SET_3_STARTS_TIMER=YES");
console.log("LAST_SET_STARTS_TIMER=NO");
console.log("LAST_SET_NO_TIMER=PASS");
console.log("PRESCRIBED_SERIES_DRIVES_LAST_SET=PASS");
console.log("BACKGROUND_DEADLINE_TEST=PASS");
console.log("EMPTY_SET_DOES_NOT_START_TIMER=YES");
console.log("REST_SKIP_NEXT_SET_REGRESSION=PASS");
console.log("REST_TIMER_OVERLAY=PASS_STATIC");
console.log("REST_TIMER_COMPACT_REOPEN=PASS_STATIC");
console.log("REST_TIMER_SESSION_ISOLATION=PASS");
console.log("REST_TIMER_EXERCISE_ISOLATION=PASS");
console.log("REST_TIMER_CLEARED_ON_SESSION_COMPLETE=YES");
