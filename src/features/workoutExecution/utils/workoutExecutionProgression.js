import {
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  WORKOUT_EXECUTION_SESSION_STATUS,
  normalizeExecutionSession,
} from "./workoutExecutionSession.js";
import { normalizeExerciseName } from "../../alunos/utils/studentProgressionSnapshot.js";

export const EXECUTION_PROGRESSION_CONFIDENCE = Object.freeze({
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  INSUFFICIENT: "INSUFFICIENT",
});

export const EXECUTION_PROGRESS_SIGNAL = Object.freeze({
  FIRST_RECORD: "FIRST_RECORD",
  LOAD_INCREASE_SAME_REPS: "LOAD_INCREASE_SAME_REPS",
  REPS_INCREASE_SAME_LOAD: "REPS_INCREASE_SAME_LOAD",
  FACTUAL_COMPARISON: "FACTUAL_COMPARISON",
  NOT_COMPARABLE: "NOT_COMPARABLE",
});

const DEFAULT_HISTORY_LIMIT = 10;
const MS_PER_DAY = 86400000;

export function buildExecutionProgressionSnapshot({
  currentSession = null,
  recentSessions = [],
  now = new Date(),
  historyLimit = DEFAULT_HISTORY_LIMIT,
} = {}) {
  const normalizedCurrent = normalizeExecutionSession(currentSession);
  const normalizedHistory = normalizeSessions(recentSessions).slice(0, historyLimit);
  const baselineSessions = normalizedHistory.filter(isCompletedSession);
  const targetSession = normalizedCurrent || baselineSessions[0] || null;
  const priorSessions = targetSession
    ? baselineSessions.filter((session) => session.id !== targetSession.id)
    : baselineSessions;
  const exercises = targetSession
    ? targetSession.exercises.map((exercise) => buildExerciseProgression(exercise, priorSessions))
    : [];

  return {
    currentSessionId: targetSession?.id || "",
    exercises,
    frequency: buildExecutionSessionFrequency(normalizedHistory, { now }),
    safeComparisonCount: exercises.filter((item) => item.loadComparable || item.repComparable).length,
    firstRecordCount: exercises.filter((item) => item.signal === EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD).length,
    historyBound: Math.min(historyLimit, DEFAULT_HISTORY_LIMIT),
  };
}

export function buildExecutionProgressionForSessions(sessions = [], options = {}) {
  const normalized = normalizeSessions(sessions).slice(0, options.historyLimit || DEFAULT_HISTORY_LIMIT);
  return normalized.map((session, index) => {
    const priorSessions = normalized.slice(index + 1).filter(isCompletedSession);
    return {
      sessionId: session.id,
      exercises: session.exercises.map((exercise) => buildExerciseProgression(exercise, priorSessions)),
    };
  });
}

export function buildExecutionSessionFrequency(sessions = [], { now = new Date() } = {}) {
  const today = normalizeDateOnly(now);
  const completed = normalizeSessions(sessions).filter(isCompletedSession);
  return {
    completed7d: countCompletedSince(completed, today, 7),
    completed30d: countCompletedSince(completed, today, 30),
  };
}

export function buildExerciseProgression(exercise = {}, priorSessions = []) {
  const normalizedExercise = normalizeExecutionExerciseForProgression(exercise);
  if (!isEligibleExercise(normalizedExercise)) {
    return createProgressionResult({
      exercise: normalizedExercise,
      signal: EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE,
      confidence: EXECUTION_PROGRESSION_CONFIDENCE.INSUFFICIENT,
      reason: "Exercício sem registro concluído para comparação.",
    });
  }

  const currentBestSet = pickBestSet(normalizedExercise.sets);
  if (!currentBestSet) {
    const previous = findPreviousExerciseMatch(normalizedExercise, priorSessions);
    return createProgressionResult({
      exercise: normalizedExercise,
      previousExercise: previous.exercise || null,
      previousBestSet: previous.bestSet || null,
      previousSession: previous.session || null,
      signal: EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE,
      confidence: previous.exercise
        ? previous.confidence
        : EXECUTION_PROGRESSION_CONFIDENCE.INSUFFICIENT,
      reason: previous.exercise
        ? "Última execução registrada encontrada como referência."
        : "Sem série concluída para comparação.",
    });
  }

  const previous = findPreviousExerciseMatch(normalizedExercise, priorSessions);
  if (!previous.exercise || !previous.bestSet) {
    return createProgressionResult({
      exercise: normalizedExercise,
      currentBestSet,
      signal: EXECUTION_PROGRESS_SIGNAL.FIRST_RECORD,
      confidence: EXECUTION_PROGRESSION_CONFIDENCE.INSUFFICIENT,
      reason: "Primeiro registro deste exercício.",
    });
  }

  const comparison = compareSets(currentBestSet, previous.bestSet);
  const signal = classifySignal(comparison);

  return createProgressionResult({
    exercise: normalizedExercise,
    currentBestSet,
    previousExercise: previous.exercise,
    previousBestSet: previous.bestSet,
    previousSession: previous.session,
    signal,
    confidence: mergeConfidence(previous.confidence, comparison),
    loadComparable: comparison.loadComparable,
    repComparable: comparison.repComparable,
    deltaLoad: comparison.deltaLoad,
    deltaReps: comparison.deltaReps,
    reason: buildReason(signal, comparison),
  });
}

export function formatSetReference(set = null) {
  if (!set) return "";
  const reps = `${set.reps} reps`;
  if (set.bodyweight || set.loadUnit === "bodyweight") return `Peso corporal x ${set.reps}`;
  if (set.loadValue === "" || set.loadValue === null || set.loadValue === undefined) return reps;
  return `${formatNumber(set.loadValue)} ${set.loadUnit} x ${set.reps}`;
}

export function formatPerformedSetLine(set = null) {
  if (!set) return "";
  const parts = [`${set.reps || 0} reps`];
  if (set.bodyweight || set.loadUnit === "bodyweight") {
    parts.push("Peso corporal");
  } else if (set.loadValue !== "" && set.loadValue !== null && set.loadValue !== undefined) {
    parts.push(`${formatNumber(set.loadValue)} ${set.loadUnit || "kg"}`);
  }
  if (set.rir !== "" && set.rir !== null && set.rir !== undefined) parts.push(`RIR ${set.rir}`);
  if (set.rpe !== "" && set.rpe !== null && set.rpe !== undefined) parts.push(`RPE ${set.rpe}`);
  return parts.join(" · ");
}

export function getCompletedExerciseSets(exercise = null) {
  return (exercise?.sets || [])
    .filter((set) => set.completed)
    .sort((a, b) => a.setNumber - b.setNumber);
}

function normalizeSessions(sessions = []) {
  return (Array.isArray(sessions) ? sessions : [])
    .map(normalizeExecutionSession)
    .filter(Boolean)
    .sort(compareSessionsDesc);
}

function normalizeExecutionExerciseForProgression(exercise = {}) {
  return {
    ...exercise,
    normalizedName: normalizeExerciseName(exercise.name),
    normalizedGroup: normalizeExerciseName(exercise.group),
    normalizedDayName: normalizeExerciseName(exercise.dayName),
  };
}

function isCompletedSession(session) {
  return session?.status === WORKOUT_EXECUTION_SESSION_STATUS.COMPLETED;
}

function isEligibleExercise(exercise) {
  return exercise?.status !== WORKOUT_EXECUTION_EXERCISE_STATUS.SKIPPED && Boolean(exercise?.normalizedName);
}

function pickBestSet(sets = []) {
  const completedSets = sets.filter((set) => set.completed);
  if (!completedSets.length) return null;
  return [...completedSets].sort(compareSetsForBest)[0];
}

function compareSetsForBest(a, b) {
  if (isExternalLoadComparable(a, b) && Number(a.loadValue) !== Number(b.loadValue)) {
    return Number(b.loadValue) - Number(a.loadValue);
  }
  return Number(b.reps || 0) - Number(a.reps || 0);
}

function findPreviousExerciseMatch(currentExercise, priorSessions) {
  const candidates = [];
  for (const session of priorSessions) {
    for (const exercise of session.exercises.map(normalizeExecutionExerciseForProgression)) {
      if (!isEligibleExercise(exercise)) continue;
      if (exercise.normalizedName !== currentExercise.normalizedName) continue;
      const bestSet = pickBestSet(exercise.sets);
      if (!bestSet) continue;
      candidates.push({
        exercise,
        bestSet,
        session,
        confidence: classifyMatchConfidence(currentExercise, exercise),
      });
    }
  }

  return candidates.find((candidate) => candidate.confidence === EXECUTION_PROGRESSION_CONFIDENCE.HIGH)
    || candidates.find((candidate) => candidate.confidence === EXECUTION_PROGRESSION_CONFIDENCE.MEDIUM)
    || candidates[0]
    || {};
}

function classifyMatchConfidence(currentExercise, previousExercise) {
  const sameGroup = currentExercise.normalizedGroup && currentExercise.normalizedGroup === previousExercise.normalizedGroup;
  const sameDay = currentExercise.normalizedDayName && currentExercise.normalizedDayName === previousExercise.normalizedDayName;
  const sameOrder = currentExercise.exerciseOrder > 0 && currentExercise.exerciseOrder === previousExercise.exerciseOrder;

  if (sameGroup && sameDay) return EXECUTION_PROGRESSION_CONFIDENCE.HIGH;
  if (sameGroup || sameDay || sameOrder) return EXECUTION_PROGRESSION_CONFIDENCE.MEDIUM;
  return EXECUTION_PROGRESSION_CONFIDENCE.LOW;
}

function compareSets(currentSet, previousSet) {
  const loadComparable = isLoadComparable(currentSet, previousSet);
  const repComparable = isRepComparable(currentSet, previousSet, loadComparable);
  return {
    loadComparable,
    repComparable,
    sameReps: Number(currentSet.reps) === Number(previousSet.reps),
    deltaLoad: loadComparable ? Number(currentSet.loadValue) - Number(previousSet.loadValue) : null,
    deltaReps: repComparable ? Number(currentSet.reps) - Number(previousSet.reps) : null,
  };
}

function isLoadComparable(currentSet, previousSet) {
  if (!hasExternalLoad(currentSet) || !hasExternalLoad(previousSet)) return false;
  return isExternalLoadComparable(currentSet, previousSet);
}

function isRepComparable(currentSet, previousSet, loadComparable) {
  if (!Number.isFinite(Number(currentSet.reps)) || !Number.isFinite(Number(previousSet.reps))) return false;
  if (isBodyweightSet(currentSet) && isBodyweightSet(previousSet)) return true;
  if (!hasExternalLoad(currentSet) && !hasExternalLoad(previousSet)) return true;
  return loadComparable && Number(currentSet.loadValue) === Number(previousSet.loadValue);
}

function hasExternalLoad(set) {
  return !isBodyweightSet(set) && set.loadValue !== "" && set.loadValue !== null && set.loadValue !== undefined;
}

function isBodyweightSet(set) {
  return Boolean(set.bodyweight) || set.loadUnit === "bodyweight";
}

function isExternalLoadComparable(a, b) {
  return hasExternalLoad(a) && hasExternalLoad(b) && a.loadUnit === b.loadUnit;
}

function classifySignal(comparison) {
  if (comparison.loadComparable && comparison.deltaLoad > 0 && comparison.sameReps) {
    return EXECUTION_PROGRESS_SIGNAL.LOAD_INCREASE_SAME_REPS;
  }
  if (comparison.repComparable && comparison.deltaReps > 0) {
    return EXECUTION_PROGRESS_SIGNAL.REPS_INCREASE_SAME_LOAD;
  }
  if (comparison.loadComparable || comparison.repComparable) {
    return EXECUTION_PROGRESS_SIGNAL.FACTUAL_COMPARISON;
  }
  return EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE;
}

function mergeConfidence(matchConfidence, comparison) {
  if (!comparison.loadComparable && !comparison.repComparable) return EXECUTION_PROGRESSION_CONFIDENCE.LOW;
  return matchConfidence;
}

function buildReason(signal, comparison) {
  if (signal === EXECUTION_PROGRESS_SIGNAL.LOAD_INCREASE_SAME_REPS) {
    return `${formatNumber(comparison.deltaLoad)} a mais com as mesmas repetições.`;
  }
  if (signal === EXECUTION_PROGRESS_SIGNAL.REPS_INCREASE_SAME_LOAD) {
    return pluralizePt(comparison.deltaReps, "repetição a mais com a mesma carga.", "repetições a mais com a mesma carga.");
  }
  if (signal === EXECUTION_PROGRESS_SIGNAL.NOT_COMPARABLE) {
    return "Última execução registrada encontrada, sem delta seguro.";
  }
  return "Comparação com execução anterior disponível.";
}

function createProgressionResult({
  exercise,
  currentBestSet = null,
  previousExercise = null,
  previousBestSet = null,
  previousSession = null,
  signal,
  confidence,
  loadComparable = false,
  repComparable = false,
  deltaLoad = null,
  deltaReps = null,
  reason = "",
}) {
  return {
    exerciseId: exercise.id || "",
    exerciseName: exercise.name || "Exercício",
    currentBestSet,
    previousExercise,
    previousExerciseName: previousExercise?.name || "",
    previousBestSet,
    previousSessionDate: previousSession?.sessionDate || previousSession?.startedAt || "",
    signal,
    confidence,
    loadComparable,
    repComparable,
    deltaLoad,
    deltaReps,
    reason,
  };
}

function countCompletedSince(sessions, today, days) {
  if (!today) return 0;
  const start = new Date(today.getTime() - (days - 1) * MS_PER_DAY);
  return sessions.filter((session) => {
    const date = normalizeDateOnly(session.sessionDate || session.completedAt || session.startedAt);
    return date && date >= start && date <= today;
  }).length;
}

function normalizeDateOnly(value) {
  if (!value) return null;
  if (typeof value === "string") {
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnly) {
      return new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])));
    }
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function compareSessionsDesc(a, b) {
  return getSessionTime(b) - getSessionTime(a);
}

function getSessionTime(session) {
  const value = session.completedAt || session.startedAt || session.sessionDate;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
}

function formatNumber(value) {
  return Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

function pluralizePt(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}
