import assert from "node:assert/strict";
import {
  EXECUTION_PROGRESS_SIGNAL,
  buildExecutionProgressionSnapshot,
  buildExecutionSessionFrequency,
} from "../src/features/workoutExecution/utils/workoutExecutionProgression.js";

const editedWorkout = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    exercise("Supino reto", "Peito", [set(1, 10, 42)], { treinoExercicioId: "new-id", dayName: "Dia A" }),
  ]),
  recentSessions: [
    session("previous", "completed", "2026-08-15", [
      exercise("Supino reto", "Peito", [set(1, 10, 40)], { treinoExercicioId: "old-id", dayName: "Dia antigo" }),
    ]),
  ],
});

const falseMatch = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    exercise("Remada baixa", "Costas", [set(1, 10, 40)]),
  ]),
  recentSessions: [
    session("previous", "completed", "2026-08-15", [exercise("Remada alta", "Costas", [set(1, 10, 40)])]),
  ],
});

const unitMismatch = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    exercise("Supino reto", "Peito", [set(1, 10, 40, "kg")]),
  ]),
  recentSessions: [
    session("previous", "completed", "2026-08-15", [exercise("Supino reto", "Peito", [set(1, 10, 90, "lb")])]),
  ],
});

const bodyweight = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    exercise("Flexao", "Peito", [set(1, 15, null, "bodyweight", true)]),
  ]),
  recentSessions: [
    session("previous", "completed", "2026-08-15", [exercise("Flexao", "Peito", [set(1, 12, null, "bodyweight", true)])]),
  ],
});

const abandoned = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    exercise("Agachamento", "Pernas", [set(1, 10, 60)]),
  ]),
  recentSessions: [
    session("abandoned", "abandoned", "2026-08-21", [exercise("Agachamento", "Pernas", [set(1, 10, 55)])]),
  ],
});

const skipped = buildExecutionProgressionSnapshot({
  currentSession: session("current", "in_progress", "2026-08-22", [
    { ...exercise("Puxada", "Costas", [set(1, 10, 40)]), status: "skipped" },
  ]),
  recentSessions: [
    session("previous", "completed", "2026-08-15", [exercise("Puxada", "Costas", [set(1, 10, 40)])]),
  ],
});

const frequency = buildExecutionSessionFrequency([
  session("today", "completed", "2026-08-22", []),
  session("week", "completed", "2026-08-16", []),
  session("month", "completed", "2026-08-02", []),
  session("abandoned", "abandoned", "2026-08-21", []),
], { now: "2026-08-22T23:30:00-03:00" });

assert.equal(editedWorkout.exercises[0].loadComparable, true);
assert.equal(falseMatch.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD);
assert.equal(unitMismatch.exercises[0].loadComparable, false);
assert.equal(bodyweight.exercises[0].repComparable, true);
assert.equal(bodyweight.exercises[0].loadComparable, false);
assert.equal(abandoned.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD);
assert.equal(skipped.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE);
assert.equal(frequency.completed7d, 2);
assert.equal(frequency.completed30d, 3);

console.log("EXECUTION_PROGRESSION_QA=PASS");
console.log("WORKOUT_EDIT_HISTORY_COMPARISON=SAFE");
console.log("FALSE_MATCH_BLOCKED=YES");
console.log("UNIT_MISMATCH_DELTA_BLOCKED=YES");
console.log("ABANDONED_SESSION_EXCLUDED_FROM_PROGRESSION=YES");
console.log("SKIPPED_EXERCISE_EXCLUDED=YES");
console.log("ADHERENCE_PERCENTAGE_IMPLEMENTED=NO");

function session(id, status, sessionDate, exercises) {
  return {
    id,
    status,
    sessionDate,
    startedAt: `${sessionDate}T12:00:00Z`,
    completedAt: status === "completed" ? `${sessionDate}T13:00:00Z` : "",
    exercises,
  };
}

function exercise(name, group, sets, overrides = {}) {
  return {
    id: `${name}-${overrides.treinoExercicioId || "id"}`,
    name,
    group,
    dayName: overrides.dayName || "Dia A",
    exerciseOrder: 1,
    status: "completed",
    sets,
    ...overrides,
  };
}

function set(setNumber, reps, loadValue, loadUnit = "kg", bodyweight = false) {
  return {
    setNumber,
    reps,
    loadValue,
    loadUnit,
    bodyweight,
    completed: true,
    rir: "",
    rpe: "",
  };
}
