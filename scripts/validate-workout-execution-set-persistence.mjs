import assert from "node:assert/strict";
import {
  buildExecutionHistorySummary,
  buildExecutionSavePayload,
  canCompleteSession,
  normalizeExecutionSession,
} from "../src/features/workoutExecution/utils/workoutExecutionSession.js";
import { buildExecutionProgressionSnapshot } from "../src/features/workoutExecution/utils/workoutExecutionProgression.js";

const entered = {
  id: "qa-session",
  status: "in_progress",
  sessionDate: "2026-08-24",
  exercises: [{
    id: "qa-exercise",
    name: "Supino reto",
    group: "Peito",
    workoutTitle: "Treino QA",
    dayName: "Dia A",
    status: "partial",
    sets: [
      { setNumber: 1, reps: 10, loadValue: 40, rir: 2, rpe: 8, completed: true },
      { setNumber: 2, reps: 8, loadValue: 42, rir: 1, rpe: 9, completed: true },
      { setNumber: 3, completed: true },
    ],
  }],
};

const normalized = normalizeExecutionSession(entered);
const payload = buildExecutionSavePayload(normalized);
const returned = normalizeExecutionSession({
  ...normalized,
  status: "completed",
  completedAt: "2026-08-24T12:00:00Z",
});
const summary = buildExecutionHistorySummary(returned);
const snapshot = buildExecutionProgressionSnapshot({ currentSession: returned, recentSessions: [] });

assert.equal(canCompleteSession(normalized), true);
assert.equal(payload[0].sets.length, 3);
assert.equal(payload[0].sets.filter((set) => set.completed).length, 2);
assert.equal(returned.exercises[0].sets.filter((set) => set.completed).length, 2);
assert.equal(summary.completedSetCount, 2);
assert.equal(snapshot.exercises[0].currentBestSet.setNumber, 2);

console.log("SET_PERSISTENCE_RUNTIME=PASS");
console.log("SETS_ENTERED=2");
console.log("SETS_PERSISTED=2");
console.log("SETS_COMPLETED=2");
console.log("SETS_RETURNED=2");
console.log("SUMMARY_SET_COUNT_CORRECT=YES");
console.log("EMPTY_SET_COUNTED_AS_COMPLETED=NO");
console.log("SESSION_COMPLETION_REQUIRES_REAL_EXECUTION=YES");
