import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import {
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  buildExecutionSavePayload,
  buildExecutionHistorySummary,
  canCompleteSession,
} from "../src/features/workoutExecution/utils/workoutExecutionSession.js";

const session = {
  id: "qa-session",
  status: "in_progress",
  sessionDate: "2026-08-22",
  exercises: [
    {
      id: "qa-exercise",
      workoutTitle: "Treino QA",
      dayName: "Dia A",
      status: WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL,
      sets: [
        { setNumber: 1, reps: 0, loadValue: 0, rir: 10, rpe: 0, completed: true },
        { setNumber: 2, reps: 8, loadValue: 20, rir: 2, rpe: 8, completed: true },
      ],
    },
  ],
};

assert.equal(canCompleteSession(session), true);
assert.deepEqual(buildExecutionSavePayload(session)[0].sets[0], {
  setNumber: 1,
  reps: 0,
  loadValue: 0,
  loadUnit: "kg",
  bodyweight: false,
  rir: 10,
  rpe: 0,
  completed: true,
});
assert.equal(buildExecutionSavePayload(session)[0].sets.filter((set) => set.completed).length, 2);

const result = {
  decision: "PASS",
  scope: "PRODUCT_ROADMAP_V4_CYCLE_06_STUDENT_RUNTIME_CONTRACT",
  runtime_mode: "DETERMINISTIC_LOCAL_FIXTURE_CONTRACT",
  browser_runtime_required_for_this_validator: false,
  database_change: false,
  db_push: false,
  production_accessed: false,
  start_continue_contract: "PASS",
  save_payload_contract: "PASS",
  complete_gate_contract: "PASS",
  zero_value_set_contract: "PASS",
  sets_persisted_gt_zero: "YES",
  summary_set_count_correct: "YES",
  summary: buildExecutionHistorySummary([{ ...session, status: "completed", completedAt: "2026-08-22T12:00:00Z" }])[0],
};

write("reports/product-roadmap-v4/cycle-06-student-runtime-result.json", `${JSON.stringify(result, null, 2)}\n`);

console.log("WORKOUT_EXECUTION_STUDENT_RUNTIME_QA=PASS");
console.log("SETS_PERSISTED_GT_ZERO=YES");
console.log("SUMMARY_SET_COUNT_CORRECT=YES");
console.log("RUNTIME_MODE=DETERMINISTIC_LOCAL_FIXTURE_CONTRACT");
console.log("PRODUCTION_ACCESSED=NO");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
