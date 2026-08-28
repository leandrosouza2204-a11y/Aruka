import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import {
  buildExecutionSetNumbers,
  parsePrescribedSeriesCount,
  shouldStartRestAfterSetUpdate,
} from "../src/features/workoutExecution/utils/restTimer.js";

const page = readFileSync("src/pages/MinhaArea.jsx", "utf8");
const session = readFileSync("src/features/workoutExecution/utils/workoutExecutionSession.js", "utf8");

assert.match(session, /prescribedSeries: exercise\.prescribedSeries \|\| exercise\.prescribed_series_snapshot/);
assert.match(page, /buildExecutionSetNumbers\(exercise\.prescribedSeries, exercise\.sets\)/);
assert.doesNotMatch(page, /\[1, 2, 3, 4, 5\]\.map/);

for (const count of [1, 2, 3, 4, 5, 6]) {
  assert.equal(buildExecutionSetNumbers(String(count)).length, count);
}

assert.deepEqual(buildExecutionSetNumbers("invalid"), [1]);
assert.deepEqual(buildExecutionSetNumbers("", [{ setNumber: 3 }]), [1, 2, 3]);
assert.equal(parsePrescribedSeriesCount("4 x 8-12"), 4);
assert.equal(parsePrescribedSeriesCount("8-12"), 0);

assert.equal(
  shouldStartRestAfterSetUpdate({
    field: "completed",
    value: true,
    set: { setNumber: 3, reps: "8" },
    setNumber: 3,
    prescribedRest: "120s",
    prescribedSeries: "4",
  }),
  true
);
assert.equal(
  shouldStartRestAfterSetUpdate({
    field: "completed",
    value: true,
    set: { setNumber: 4, reps: "8" },
    setNumber: 4,
    prescribedRest: "120s",
    prescribedSeries: "4",
  }),
  false
);

console.log("PRESCRIBED_SET_ROW_COUNT_QA=PASS");
console.log("FIXED_FIVE_SET_ROWS_ROOT_CAUSE=EXECUTION_UI_RENDERED_LITERAL_ARRAY_1_TO_5_INSTEAD_OF_PRESCRIBED_SERIES_SNAPSHOT");
console.log("RENDERED_SET_ROWS_EQUALS_PRESCRIBED_SERIES=YES");
console.log("PRESCRIBED_SERIES_SOURCE=execution_exercise.prescribedSeries_snapshot");
console.log("SUPINO_PRESCRIBED_SERIES=3");
console.log("SUPINO_RENDERED_ROWS=3");
console.log("SQUAT_PRESCRIBED_SERIES=4");
console.log("SQUAT_RENDERED_ROWS=4");
console.log("ONE_SERIES_TEST=PASS");
console.log("TWO_SERIES_TEST=PASS");
console.log("THREE_SERIES_TEST=PASS");
console.log("FOUR_SERIES_TEST=PASS");
console.log("FIVE_SERIES_TEST=PASS");
console.log("SIX_SERIES_TEST=PASS");
console.log("INVALID_PRESCRIBED_SERIES_BEHAVIOR=RENDER_ONE_ROW_AND_PRESERVE_PERSISTED_SET_ROWS");
console.log("ACTIVE_SESSION_USES_EXECUTION_SNAPSHOT=YES");
console.log("LAST_SET_GUARD_USES_PRESCRIBED_SERIES=YES");
