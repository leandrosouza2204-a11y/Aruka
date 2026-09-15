import { isValidMetricSession } from "./studentExperienceV2Contracts.js";

export const STUDENT_HOME_REVIEW_STATUS = Object.freeze({
  FUTURE: "future",
  TODAY: "today",
  OVERDUE: "overdue",
  UNAVAILABLE: "unavailable",
});

export function normalizeStudentHomeV2Payload(payload = {}) {
  const activeSession = payload.activeSession || payload.active_session || null;
  const todayWorkout = payload.todayWorkout || payload.today_workout || null;
  const currentProgram = payload.currentProgram || payload.current_program || null;
  const weekly = payload.weeklyProgress || payload.weekly_progress || {};
  const evolution = payload.evolutionSummary || payload.evolution_summary || {};
  const calendar = payload.calendar || {};

  return {
    student: payload.student ? {
      id: payload.student.id || "",
      name: payload.student.name || payload.student.nome || "",
      status: payload.student.status || "",
    } : null,
    studentAccess: payload.studentAccess || payload.student_access || { status: "unlinked" },
    activeSession: activeSession ? normalizeActiveSession(activeSession) : null,
    todayWorkout: todayWorkout ? normalizeTodayWorkout(todayWorkout) : null,
    currentProgram: currentProgram ? normalizeProgram(currentProgram) : null,
    weeklyProgress: {
      completedCount: toCount(weekly.completedCount ?? weekly.completed_count),
      targetCount: toOptionalPositiveCount(weekly.targetCount ?? weekly.target_count),
    },
    review: normalizeReview(payload.review, calendar.today),
    evolutionSummary: {
      completedCount: toCount(evolution.completedCount ?? evolution.completed_count),
      lastCompletedAt: evolution.lastCompletedAt || evolution.last_completed_at || "",
      windowDays: toOptionalPositiveCount(evolution.windowDays ?? evolution.window_days) || 28,
    },
    calendar: {
      today: normalizeDateOnly(calendar.today),
      weekStart: normalizeDateOnly(calendar.weekStart || calendar.week_start),
      weekStartsOn: calendar.weekStartsOn || calendar.week_starts_on || "monday",
      timeZone: calendar.timeZone || calendar.time_zone || "America/Sao_Paulo",
    },
  };
}

export function buildStudentHomeV2(payload = {}) {
  const home = normalizeStudentHomeV2Payload(payload);
  const completed = home.weeklyProgress.completedCount;
  const target = home.weeklyProgress.targetCount;

  return {
    ...home,
    student: home.student
      ? { ...home.student, firstName: firstName(home.student.name), initials: initials(home.student.name) }
      : null,
    weeklyProgress: {
      ...home.weeklyProgress,
      text: target
        ? `${completed} de ${target} ${target === 1 ? "treino concluído" : "treinos concluídos"}`
        : `${completed} ${completed === 1 ? "treino concluído" : "treinos concluídos"} esta semana`,
      percentage: target ? Math.min(Math.round((completed / target) * 100), 100) : null,
    },
    evolutionSummary: { ...home.evolutionSummary, hasData: home.evolutionSummary.completedCount > 0 },
  };
}

export function countValidMetricSessions(sessions = []) {
  return (Array.isArray(sessions) ? sessions : []).filter(isValidMetricSession).length;
}

export function resolveReview(dateValue, todayValue) {
  const date = normalizeDateOnly(dateValue);
  const today = normalizeDateOnly(todayValue);
  if (!date || !today) return { status: STUDENT_HOME_REVIEW_STATUS.UNAVAILABLE, date: "", label: "" };
  if (date === today) return { status: STUDENT_HOME_REVIEW_STATUS.TODAY, date, label: "Revisão prevista para hoje" };
  if (date < today) return { status: STUDENT_HOME_REVIEW_STATUS.OVERDUE, date, label: "Revisão pendente" };
  return { status: STUDENT_HOME_REVIEW_STATUS.FUTURE, date, label: formatLongDate(date) };
}

export function formatShortDate(value) {
  const normalized = normalizeDateOnly(value);
  if (!normalized) return "";
  const [year, month, day] = normalized.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)))
    .replace(".", "");
}

function normalizeActiveSession(session) {
  return {
    id: session.id || "",
    treinoId: session.treinoId || session.treino_id || "",
    treinoDiaId: session.treinoDiaId || session.treino_dia_id || "",
    status: session.status || "",
    startedAt: session.startedAt || session.started_at || "",
    lastActivityAt: session.lastActivityAt || session.last_activity_at || "",
    workoutTitle: session.workoutTitle || session.workout_title || "Treino",
    dayName: session.dayName || session.day_name || "Treino atual",
    muscleGroups: session.muscleGroups || session.muscle_groups || "",
    exerciseCount: toCount(session.exerciseCount ?? session.exercise_count),
    completedSetCount: toCount(session.completedSetCount ?? session.completed_set_count),
    totalSetCount: toOptionalPositiveCount(session.totalSetCount ?? session.total_set_count),
  };
}

function normalizeTodayWorkout(workout) {
  return {
    treinoId: workout.treinoId || workout.treino_id || "",
    treinoDiaId: workout.treinoDiaId || workout.treino_dia_id || "",
    programDisplayName: workout.programDisplayName || workout.program_display_name || "",
    name: workout.name || workout.nome || "Treino",
    muscleGroups: workout.muscleGroups || workout.muscle_groups || "",
    exerciseCount: toCount(workout.exerciseCount ?? workout.exercise_count),
    setCount: toOptionalPositiveCount(workout.setCount ?? workout.set_count),
  };
}

function normalizeProgram(program) {
  const internalName = program.internalName || program.internal_name || program.name || "";
  return {
    id: program.id || "",
    displayName: program.displayName || program.display_name || internalName || "Seu programa",
    internalName,
    objective: program.objective || program.objetivo || "",
    level: program.level || program.nivel || "",
    weeklyTarget: toOptionalPositiveCount(program.weeklyTarget ?? program.weekly_target),
    startedOn: normalizeDateOnly(program.startedOn || program.started_on),
  };
}

function normalizeReview(review, today) {
  if (!review || typeof review !== "object") return resolveReview("", today);
  return resolveReview(review.date || review.data, today);
}

function normalizeDateOnly(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (date.getUTCFullYear() !== Number(match[1]) || date.getUTCMonth() !== Number(match[2]) - 1 || date.getUTCDate() !== Number(match[3])) return "";
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function formatLongDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function toCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function toOptionalPositiveCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : null;
}

function firstName(name) {
  return String(name || "Aluno").trim().split(/\s+/)[0] || "Aluno";
}

function initials(name) {
  const parts = String(name || "A").trim().split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? `${parts[0][0]}${parts.at(-1)[0]}` : parts[0]?.slice(0, 2) || "A").toUpperCase();
}
