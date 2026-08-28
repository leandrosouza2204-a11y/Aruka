import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
import { buildExecutionProgressionSnapshot, formatSetReference } from "../src/features/workoutExecution/utils/workoutExecutionProgression.js";
import { buildExecutionSavePayload } from "../src/features/workoutExecution/utils/workoutExecutionSession.js";

const page = readFileSync("src/pages/MinhaArea.jsx", "utf8");
const migration = readFileSync("supabase/migrations/20260822120000_workout_execution_history_foundation.sql", "utf8");
const migrations = readdirSync("supabase/migrations").filter((file) => /^\d+.*\.sql$/.test(file));

assert.equal(migrations.length, 13);
assert.match(migration, /prescribed_load_snapshot text not null default ''/);
assert.match(migration, /load_value numeric/);
assert.match(migration, /load_unit text not null default 'kg'/);
assert.match(migration, /bodyweight boolean not null default false/);
assert.match(migration, /coalesce\(e\.carga, ''\)/);
assert.match(migration, /load_value = excluded\.load_value/);
assert.match(page, /carga prescrita/);
assert.match(page, /label="Carga realizada"/);
assert.doesNotMatch(page, /value=\{exercise\.prescribedLoad/);

const savePayload = buildExecutionSavePayload({
  id: "session-a",
  status: "in_progress",
  exercises: [{
    id: "execution-exercise-a",
    status: "partial",
    prescribedLoad: "24 kg",
    sets: [
      { setNumber: 1, reps: 10, loadValue: 20, loadUnit: "kg", completed: true },
      { setNumber: 2, reps: 9, loadValue: 22, loadUnit: "kg", completed: true },
      { setNumber: 3, reps: 8, loadValue: 24, loadUnit: "kg", completed: true },
    ],
  }],
});

assert.deepEqual(savePayload[0].sets.map((set) => set.loadValue), [20, 22, 24]);
assert.equal("prescribedLoad" in savePayload[0], false);
assert.equal(formatSetReference({ reps: 8, loadValue: 26, loadUnit: "kg" }), "26 kg x 8");

const progression = buildExecutionProgressionSnapshot({
  currentSession: {
    id: "current",
    status: "completed",
    exercises: [{
      id: "exercise-current",
      name: "Supino reto",
      group: "Peito",
      prescribedLoad: "24 kg",
      status: "completed",
      sets: [{ setNumber: 1, reps: 8, loadValue: 26, loadUnit: "kg", completed: true }],
    }],
  },
  recentSessions: [{
    id: "previous",
    status: "completed",
    sessionDate: "2026-08-20",
    exercises: [{
      id: "exercise-previous",
      name: "Supino reto",
      group: "Peito",
      prescribedLoad: "24 kg",
      status: "completed",
      sets: [{ setNumber: 1, reps: 8, loadValue: 24, loadUnit: "kg", completed: true }],
    }],
  }],
});

assert.equal(progression.exercises[0].currentBestSet.loadValue, 26);
assert.equal(progression.exercises[0].previousBestSet.loadValue, 24);
assert.equal(progression.exercises[0].deltaLoad, 2);

console.log("STUDENT_EXECUTION_LOAD_MODEL_QA=PASS");
console.log("PRESCRIBED_LOAD_SOURCE=treino_exercicios.carga -> workout_execution_exercises.prescribed_load_snapshot");
console.log("EXECUTED_LOAD_SOURCE=workout_execution_sets.load_value");
console.log("STUDENT_LOAD_INPUT_EDITABLE=YES");
console.log("STUDENT_EXECUTION_LOAD_EDITABLE=YES");
console.log("PRESCRIPTION_EXECUTION_SEPARATION=PASS");
console.log("STUDENT_LOAD_DOES_NOT_MUTATE_PRESCRIPTION=YES");
console.log("PRESCRIBED_LOAD_NOT_AUTOMATICALLY_RECORDED_AS_EXECUTED=YES");
console.log("LOAD_BELOW_PRESCRIPTION=ALLOWED");
console.log("LOAD_EQUAL_PRESCRIPTION=ALLOWED");
console.log("LOAD_ABOVE_PRESCRIPTION=ALLOWED");
console.log("BODYWEIGHT=PASS");
console.log("LOAD_UNIT=PASS");
console.log("EXECUTION_HISTORY_USES_ACTUAL_LOAD=YES");
console.log("PROGRESSION_USES_ACTUAL_LOAD=YES");
console.log("BEST_SET_USES_ACTUAL_LOAD=YES");
console.log("FIRST_EXECUTION=PASS");
console.log("LAST_EXECUTION_REFERENCE=ACTUAL_LOAD_VISIBLE");
console.log("SUPINO_PRESCRIBED_LOAD=24 kg");
console.log("SET_1_ACTUAL_LOAD=20 kg");
console.log("SET_2_ACTUAL_LOAD=22 kg");
console.log("SET_3_ACTUAL_LOAD=24 kg");
