import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EXECUTION_PROGRESSION_CONFIDENCE,
  EXECUTION_PROGRESS_SIGNAL,
  buildExecutionProgressionSnapshot,
  buildExecutionSessionFrequency,
  formatPerformedSetLine,
  formatSetReference,
  getCompletedExerciseSets,
} from "./workoutExecutionProgression.js";

test("returns first record when there is no comparable previous execution", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Supino reto", "Peito", [set(1, 10, 40)]),
    ]),
    recentSessions: [],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD);
  assert.equal(snapshot.exercises[0].reason, "Primeiro registro deste exercício.");
});

test("detects same reps with more load as factual load delta", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Supino reto", "Peito", [set(1, 10, 42)]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Supino reto", "Peito", [set(1, 10, 40)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.LOAD_INCREASE_SAME_REPS);
  assert.equal(snapshot.exercises[0].loadComparable, true);
  assert.equal(snapshot.exercises[0].deltaLoad, 2);
});

test("returns previous completed session with detailed actual sets", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-28", [
      exercise("Supino reto", "Peito", []),
    ]),
    recentSessions: [
      session("session-a", "completed", "2026-08-27", [
        exercise("Supino reto", "Peito", [
          set(1, 12, 22, "kg", false, 4, 6),
          set(2, 10, 24, "kg", false, 2, 8),
          set(3, 10, 26, "kg", false, 0, 10),
        ]),
      ]),
    ],
  });

  const reference = snapshot.exercises[0];
  const previousSets = getCompletedExerciseSets(reference.previousExercise);

  assert.equal(reference.previousSessionDate, "2026-08-27");
  assert.deepEqual(previousSets.map((item) => item.loadValue), [22, 24, 26]);
  assert.deepEqual(previousSets.map((item) => item.reps), [12, 10, 10]);
  assert.deepEqual(previousSets.map((item) => item.rir), [4, 2, 0]);
  assert.deepEqual(previousSets.map((item) => item.rpe), [6, 8, 10]);
  assert.equal(formatPerformedSetLine(previousSets[0]), "12 reps · 22 kg · RIR 4 · RPE 6");
  assert.equal(formatSetReference(reference.previousBestSet), "26 kg x 10");
});

test("detects same load with more reps as factual rep delta", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Puxada", "Costas", [set(1, 12, 40)]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Puxada", "Costas", [set(1, 10, 40)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.REPS_INCREASE_SAME_LOAD);
  assert.equal(snapshot.exercises[0].repComparable, true);
  assert.equal(snapshot.exercises[0].deltaReps, 2);
});

test("lower load or lower reps stays factual without regression language", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Rosca direta", "Biceps", [set(1, 8, 8)]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Rosca direta", "Biceps", [set(1, 10, 10)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FACTUAL_COMPARISON);
  assert.doesNotMatch(JSON.stringify(snapshot), /regress/i);
});

test("blocks unit mismatch delta", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Supino reto", "Peito", [set(1, 10, 40, "kg")]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Supino reto", "Peito", [set(1, 10, 90, "lb")])]),
    ],
  });

  assert.equal(snapshot.exercises[0].loadComparable, false);
  assert.equal(snapshot.exercises[0].deltaLoad, null);
});

test("keeps previous actual sets visible when units differ but blocks delta", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-28", [
      exercise("Supino reto", "Peito", [set(1, 10, 30, "kg")]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-27", [
        exercise("Supino reto", "Peito", [set(1, 10, 66, "lb")]),
      ]),
    ],
  });

  assert.equal(snapshot.exercises[0].loadComparable, false);
  assert.equal(snapshot.exercises[0].deltaLoad, null);
  assert.equal(formatPerformedSetLine(getCompletedExerciseSets(snapshot.exercises[0].previousExercise)[0]), "10 reps · 66 lb");
});

test("compares bodyweight reps but never load", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Flexao", "Peito", [set(1, 15, null, "bodyweight", true)]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Flexao", "Peito", [set(1, 12, null, "bodyweight", true)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].loadComparable, false);
  assert.equal(snapshot.exercises[0].repComparable, true);
  assert.equal(snapshot.exercises[0].deltaReps, 3);
  assert.equal(formatPerformedSetLine(snapshot.exercises[0].previousBestSet), "12 reps · Peso corporal");
  assert.equal(formatSetReference(snapshot.exercises[0].previousBestSet), "Peso corporal x 12");
});

test("handles missing load, missing RIR and missing RPE", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Abdominal", "Core", [{ setNumber: 1, reps: 20, completed: true }]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [
        exercise("Abdominal", "Core", [{ setNumber: 1, reps: 15, completed: true }]),
      ]),
    ],
  });

  assert.equal(snapshot.exercises[0].repComparable, true);
  assert.equal(snapshot.exercises[0].currentBestSet.rir, "");
  assert.equal(snapshot.exercises[0].currentBestSet.rpe, "");
});

test("excludes abandoned sessions from progression baseline", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Agachamento", "Pernas", [set(1, 10, 60)]),
    ]),
    recentSessions: [
      session("abandoned", "abandoned", "2026-08-21", [exercise("Agachamento", "Pernas", [set(1, 10, 55)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD);
});

test("excludes skipped exercise from comparison", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      { ...exercise("Remada baixa", "Costas", [set(1, 10, 40)]), status: "skipped" },
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Remada baixa", "Costas", [set(1, 10, 40)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE);
});

test("keeps edited workout ids comparable with limited confidence", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      { ...exercise("Supino reto", "Peito", [set(1, 10, 42)]), treinoExercicioId: "new-id" },
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [
        { ...exercise("Supino reto", "Peito", [set(1, 10, 40)]), treinoExercicioId: "old-id", dayName: "A antigo" },
      ]),
    ],
  });

  assert.equal(snapshot.exercises[0].loadComparable, true);
  assert.equal(snapshot.exercises[0].confidence, EXECUTION_PROGRESSION_CONFIDENCE.MEDIUM);
});

test("blocks false name matches", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Remada baixa", "Costas", [set(1, 10, 40)]),
    ]),
    recentSessions: [
      session("previous", "completed", "2026-08-15", [exercise("Remada alta", "Costas", [set(1, 10, 40)])]),
    ],
  });

  assert.equal(snapshot.exercises[0].signal, EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD);
});

test("counts completed frequency by session_date boundaries", () => {
  const frequency = buildExecutionSessionFrequency([
    session("today", "completed", "2026-08-22", []),
    session("six-days", "completed", "2026-08-16", []),
    session("eight-days", "completed", "2026-08-14", []),
    session("twenty-days", "completed", "2026-08-02", []),
    session("abandoned", "abandoned", "2026-08-21", []),
  ], { now: "2026-08-22T23:30:00-03:00" });

  assert.equal(frequency.completed7d, 2);
  assert.equal(frequency.completed30d, 4);
});

test("returns insufficient data without completed sets", () => {
  const snapshot = buildExecutionProgressionSnapshot({
    currentSession: session("current", "in_progress", "2026-08-22", [
      exercise("Cadeira extensora", "Pernas", [{ setNumber: 1, reps: 12, loadValue: 30, completed: false }]),
    ]),
    recentSessions: [],
  });

  assert.equal(snapshot.exercises[0].confidence, EXECUTION_PROGRESSION_CONFIDENCE.INSUFFICIENT);
});

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

function exercise(name, group, sets) {
  return {
    id: `${name}-id`,
    name,
    group,
    dayName: "Dia A",
    exerciseOrder: 1,
    status: "completed",
    sets,
  };
}

function set(setNumber, reps, loadValue, loadUnit = "kg", bodyweight = false, rir = "", rpe = "") {
  return {
    setNumber,
    reps,
    loadValue,
    loadUnit,
    bodyweight,
    completed: true,
    rir,
    rpe,
  };
}
