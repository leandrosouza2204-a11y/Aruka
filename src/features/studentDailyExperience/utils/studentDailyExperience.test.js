import test from "node:test";
import assert from "node:assert/strict";
import {
  buildStudentDailyExperience,
  normalizeStudentWorkoutPayload,
} from "./studentDailyExperience.js";

test("shows unlinked state without technical identifiers", () => {
  const daily = buildStudentDailyExperience({});
  assert.equal(daily.state, "UNLINKED_STUDENT");
  assert.match(daily.nextAction.text, /perfil de aluno vinculado/i);
  assert.doesNotMatch(JSON.stringify(daily), /auth\.uid|rpc|uuid|student_user_id/i);
});

test("shows no active workout with empty history", () => {
  const daily = buildStudentDailyExperience({ student: { name: "Ana" }, activeWorkouts: [], completedWorkouts: [] });
  assert.equal(daily.state, "NO_ACTIVE_WORKOUT");
  assert.equal(daily.historyStatus, "NO_HISTORY");
  assert.equal(daily.nextAction.type, "NO_WORKOUT_HISTORY");
});

test("shows friendly suspended access state without workout data", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    studentAccess: { status: "suspended" },
    activeWorkouts: [workout("a", "active", "2026-08-01")],
  });
  assert.equal(daily.state, "ACCESS_BLOCKED");
  assert.match(daily.blockedState.title, /temporariamente indisponivel/i);
  assert.equal(daily.activeWorkout.title, "Ficha a");
});

test("shows friendly revoked access state", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    studentAccess: { status: "revoked" },
  });
  assert.equal(daily.state, "ACCESS_BLOCKED");
  assert.match(daily.blockedState.title, /nao esta ativo/i);
});

test("builds active workout hero and review note", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [workout("a", "active", "2026-08-01", "2026-09-01", "20 kg", "10", { objective: "Forca", daysPerWeek: 3 })],
    completedWorkouts: [],
  });
  assert.equal(daily.state, "ACTIVE_WORKOUT");
  assert.equal(daily.activeWorkout.title, "Ficha a");
  assert.equal(daily.activeWorkout.objective, "Força");
  assert.equal(daily.activeWorkout.daysText, "3 dias por semana");
  assert.equal(daily.nextAction.type, "REVIEW_CONTEXT");
  assert.match(daily.activeWorkout.reviewText, /Revisão prevista/);
});

test("formats one prescribed day naturally", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [workout("a", "active", "2026-08-01", "", "20 kg", "10", { daysPerWeek: 1 })],
    completedWorkouts: [],
  });

  assert.equal(daily.activeWorkout.daysText, "1 dia por semana");
  assert.doesNotMatch(daily.activeWorkout.daysText, /dia\(s\)/i);
});

test("orders multiple active workouts without relying on array order", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [
      workout("old", "active", "2026-07-01"),
      workout("new", "active", "2026-08-01"),
    ],
    completedWorkouts: [],
  });
  assert.equal(daily.activeWorkout.title, "Ficha new");
});

test("keeps archived and completed language as workout sheet history", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [],
    completedWorkouts: [workout("c", "completed", "2026-07-01")],
  });
  assert.equal(daily.historyStatus, "HISTORY_AVAILABLE");
  assert.equal(daily.history[0].statusText, "Ficha anterior");
  assert.doesNotMatch(JSON.stringify(daily.history), /realiz|execut|performance/i);
});

test("derives student-facing prescription progression without execution claims", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [workout("a", "active", "2026-08-01", "", "24 kg", "10")],
    completedWorkouts: [workout("p", "completed", "2026-07-01", "", "20 kg", "10")],
  });
  assert.equal(daily.progression.status, "READY");
  assert.match(daily.progression.text, /fichas prescritas/);
  assert.doesNotMatch(JSON.stringify(daily.progression), /aumentou sua carga|desempenho|treinou/i);
});

test("marks partial progression for legacy textual exercise values", () => {
  const daily = buildStudentDailyExperience({
    student: { name: "Ana" },
    activeWorkouts: [workout("a", "active", "2026-08-01", "", "moderada", "8 a 10")],
    completedWorkouts: [workout("p", "completed", "2026-07-01", "", "leve", "8 a 10")],
  });
  assert.equal(daily.progression.status, "PARTIAL_PROGRESSION");
});

test("normalizes rpc payload into app workout shape", () => {
  const payload = normalizeStudentWorkoutPayload({
    student: { name: "Ana" },
    activeWorkouts: [{
      name: "Superior",
      daysPerWeek: 3,
      days: [{ name: "Dia 1", exercises: [{ name: "Remada", prescribedLoad: "20 kg", repetitions: "10" }] }],
    }],
  });
  assert.equal(payload.activeWorkouts[0].rotina, "Superior");
  assert.equal(payload.activeWorkouts[0].dias[0].exercicios[0].carga, "20 kg");
});

function workout(id, lifecycleStatus, deliveredAt, dataRevisao = "", carga = "20 kg", repeticoes = "10", overrides = {}) {
  return {
    id,
    name: `Ficha ${id}`,
    objective: "Hipertrofia",
    daysPerWeek: 4,
    lifecycleStatus,
    deliveredAt,
    completedAt: lifecycleStatus === "completed" ? "2026-07-30" : "",
    dataRevisao,
    days: [{
      name: "Dia A",
      exercises: [{ name: "Supino", series: "3", repetitions: repeticoes, prescribedLoad: carga, rest: "90s" }],
    }],
    ...overrides,
  };
}
