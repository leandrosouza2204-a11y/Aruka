import assert from "node:assert/strict";
import test from "node:test";
import {
  STUDENT_HOME_REVIEW_STATUS,
  buildStudentHomeV2,
  countValidMetricSessions,
  normalizeStudentHomeV2Payload,
  resolveReview,
} from "./studentHomeV2.js";

test("normalizes the bounded home payload and prefers program display name", () => {
  const home = buildStudentHomeV2({
    student: { id: "student-a", name: "Ana Souza" },
    studentAccess: { status: "active" },
    activeSession: { id: "session-a", completedSetCount: 3, totalSetCount: 10 },
    currentProgram: { displayName: "Hipertrofia — Fase 2", internalName: "Modelo ABC - Cópia", weeklyTarget: 3 },
    weeklyProgress: { completedCount: 1, targetCount: 3 },
    calendar: { today: "2026-09-14" },
  });

  assert.equal(home.student.firstName, "Ana");
  assert.equal(home.student.initials, "AS");
  assert.equal(home.currentProgram.displayName, "Hipertrofia — Fase 2");
  assert.equal(home.activeSession.completedSetCount, 3);
  assert.equal(home.weeklyProgress.text, "1 de 3 treinos concluídos");
  assert.equal(home.weeklyProgress.percentage, 33);
});

test("falls back to internal program name and omits an unknown weekly denominator", () => {
  const home = buildStudentHomeV2({
    currentProgram: { internalName: "Programa Essencial" },
    weeklyProgress: { completedCount: 1, targetCount: null },
  });

  assert.equal(home.currentProgram.displayName, "Programa Essencial");
  assert.equal(home.weeklyProgress.text, "1 treino concluído esta semana");
  assert.equal(home.weeklyProgress.percentage, null);
});

test("counts only completed sessions, including confirmed short completions", () => {
  const sessions = [
    { status: "completed", shortDurationConfirmed: false },
    { status: "completed", shortDurationConfirmed: true },
    { status: "in_progress" },
    { status: "cancelled" },
    { status: "abandoned" },
  ];
  assert.equal(countValidMetricSessions(sessions), 2);
});

test("resolves future, today, overdue, absent and invalid reviews", () => {
  assert.equal(resolveReview("2026-10-03", "2026-09-14").status, STUDENT_HOME_REVIEW_STATUS.FUTURE);
  assert.equal(resolveReview("2026-09-14", "2026-09-14").status, STUDENT_HOME_REVIEW_STATUS.TODAY);
  assert.equal(resolveReview("2026-09-13", "2026-09-14").status, STUDENT_HOME_REVIEW_STATUS.OVERDUE);
  assert.equal(resolveReview(null, "2026-09-14").status, STUDENT_HOME_REVIEW_STATUS.UNAVAILABLE);
  assert.equal(resolveReview("2026-02-31", "2026-09-14").status, STUDENT_HOME_REVIEW_STATUS.UNAVAILABLE);
});

test("supports new-student and no-workout empty states without fabricated metrics", () => {
  const home = buildStudentHomeV2(normalizeStudentHomeV2Payload({
    student: { name: "Bia" },
    studentAccess: { status: "active" },
    todayWorkout: null,
    currentProgram: null,
    evolutionSummary: { completedCount: 0 },
  }));

  assert.equal(home.todayWorkout, null);
  assert.equal(home.currentProgram, null);
  assert.equal(home.evolutionSummary.hasData, false);
  assert.equal(home.weeklyProgress.targetCount, null);
});
