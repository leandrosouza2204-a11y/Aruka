export const STUDENT_PROGRESSION_STATUS = Object.freeze({
  PROGRESSING: "PROGRESSING",
  STABLE: "STABLE",
  PARTIAL_HISTORY: "PARTIAL_HISTORY",
  INSUFFICIENT_DATA: "INSUFFICIENT_DATA",
});

export const STUDENT_PROGRESSION_SIGNAL = Object.freeze({
  LOAD_PROGRESS: "LOAD_PROGRESS",
  REP_PROGRESS: "REP_PROGRESS",
  STABLE: "STABLE",
  PARTIAL_DATA: "PARTIAL_DATA",
  NO_DATA: "NO_DATA",
  NEW_EXERCISE: "NEW_EXERCISE",
});

export const EXERCISE_MATCH_CONFIDENCE = Object.freeze({
  EXACT_NAME: "EXACT_NAME",
  NAME_AND_GROUP: "NAME_AND_GROUP",
  PARTIAL: "PARTIAL",
  NO_MATCH: "NO_MATCH",
});

export const HISTORY_QUALITY = Object.freeze({
  GOOD: "GOOD",
  PARTIAL: "PARTIAL",
  INSUFFICIENT: "INSUFFICIENT",
});

const ACTIVE_LIFECYCLE_RANK = {
  active: 4,
  draft: 3,
  completed: 2,
  archived: 1,
};

export function buildStudentProgressionSnapshot(treinos = [], options = {}) {
  const now = normalizeDate(options.now) || new Date();
  const ordered = orderWorkoutsForProgression(treinos);
  const currentWorkout = ordered[0] || null;
  const previousWorkout = ordered.find((treino) => treino?.id !== currentWorkout?.id) || null;
  const currentExercises = flattenWorkoutExercises(currentWorkout);
  const previousExercises = flattenWorkoutExercises(previousWorkout);
  const lastReviewDate = getLastReviewDate(currentWorkout);
  const daysSinceReview = calculateDaysSince(lastReviewDate, now);

  if (!currentWorkout || !previousWorkout) {
    return createSnapshot({
      status: STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA,
      currentWorkout,
      previousWorkout,
      currentExercisesCount: currentExercises.length,
      lastReviewDate,
      daysSinceReview,
      historyQuality: HISTORY_QUALITY.INSUFFICIENT,
    });
  }

  const signals = currentExercises.map((exercise) =>
    classifyExerciseProgression(exercise, previousExercises)
  );
  const comparableExercisesCount = signals.filter(
    (signal) => signal.matchConfidence !== EXERCISE_MATCH_CONFIDENCE.NO_MATCH
  ).length;
  const progressionCount = signals.filter((signal) =>
    [STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS, STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS].includes(signal.type)
  ).length;
  const stableCount = signals.filter((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.STABLE).length;
  const partialCount = signals.filter((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA).length;
  const newExerciseCount = signals.filter((signal) => signal.type === STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE).length;

  let status;
  let historyQuality;

  if (comparableExercisesCount === 0) {
    status = STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA;
    historyQuality = HISTORY_QUALITY.INSUFFICIENT;
  } else if (progressionCount > 0) {
    status = STUDENT_PROGRESSION_STATUS.PROGRESSING;
    historyQuality = partialCount > 0 ? HISTORY_QUALITY.PARTIAL : HISTORY_QUALITY.GOOD;
  } else if (stableCount > 0 && partialCount === 0) {
    status = STUDENT_PROGRESSION_STATUS.STABLE;
    historyQuality = HISTORY_QUALITY.GOOD;
  } else {
    status = STUDENT_PROGRESSION_STATUS.PARTIAL_HISTORY;
    historyQuality = HISTORY_QUALITY.PARTIAL;
  }

  return createSnapshot({
    status,
    currentWorkout,
    previousWorkout,
    comparableExercisesCount,
    currentExercisesCount: currentExercises.length,
    signals,
    progressionCount,
    stableCount,
    partialCount,
    newExerciseCount,
    lastReviewDate,
    daysSinceReview,
    historyQuality,
  });
}

export function orderWorkoutsForProgression(treinos = []) {
  return [...treinos].sort((a, b) => compareWorkoutPriority(b) - compareWorkoutPriority(a));
}

export function normalizeExerciseName(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseLoad(value = "") {
  const raw = String(value || "").trim().toLowerCase().replace(",", ".");
  const match = raw.match(/^(\d+(?:\.\d+)?)\s*(kg)?$/);
  if (!match) return { raw: value, numericValue: null, unit: "", parseable: false };

  return {
    raw: value,
    numericValue: Number(match[1]),
    unit: match[2] || "unitless",
    parseable: true,
  };
}

export function parseReps(value = "") {
  const raw = String(value || "").trim();
  if (!/^\d+$/.test(raw)) return { raw: value, numericValue: null, parseable: false };

  return { raw: value, numericValue: Number(raw), parseable: true };
}

export function classifyExerciseProgression(currentExercise, previousExercises = []) {
  const match = findPreviousExerciseMatch(currentExercise, previousExercises);
  if (!match.exercise) {
    return createSignal(STUDENT_PROGRESSION_SIGNAL.NEW_EXERCISE, currentExercise, null, match.confidence);
  }

  const previousExercise = match.exercise;
  const currentLoad = parseLoad(currentExercise.carga);
  const previousLoad = parseLoad(previousExercise.carga);
  const currentReps = parseReps(currentExercise.repeticoes);
  const previousReps = parseReps(previousExercise.repeticoes);
  const loadComparable =
    currentLoad.parseable && previousLoad.parseable && currentLoad.unit === previousLoad.unit;
  const repsComparable = currentReps.parseable && previousReps.parseable;

  if (match.confidence === EXERCISE_MATCH_CONFIDENCE.PARTIAL) {
    return createSignal(STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA, currentExercise, previousExercise, match.confidence);
  }

  if (loadComparable && currentLoad.numericValue > previousLoad.numericValue && !hasClearRepDrop(currentReps, previousReps)) {
    return createSignal(STUDENT_PROGRESSION_SIGNAL.LOAD_PROGRESS, currentExercise, previousExercise, match.confidence);
  }

  if (repsComparable && currentReps.numericValue > previousReps.numericValue) {
    if (!loadComparable || currentLoad.numericValue === previousLoad.numericValue) {
      return createSignal(STUDENT_PROGRESSION_SIGNAL.REP_PROGRESS, currentExercise, previousExercise, match.confidence);
    }
  }

  if (loadComparable && repsComparable) {
    return createSignal(STUDENT_PROGRESSION_SIGNAL.STABLE, currentExercise, previousExercise, match.confidence);
  }

  return createSignal(STUDENT_PROGRESSION_SIGNAL.PARTIAL_DATA, currentExercise, previousExercise, match.confidence);
}

function createSnapshot(overrides = {}) {
  return {
    status: STUDENT_PROGRESSION_STATUS.INSUFFICIENT_DATA,
    currentWorkout: null,
    previousWorkout: null,
    comparableExercisesCount: 0,
    currentExercisesCount: 0,
    signals: [],
    progressionCount: 0,
    stableCount: 0,
    partialCount: 0,
    newExerciseCount: 0,
    lastReviewDate: null,
    daysSinceReview: null,
    historyQuality: HISTORY_QUALITY.INSUFFICIENT,
    ...overrides,
  };
}

function compareWorkoutPriority(treino) {
  const lifecycle = String(treino?.lifecycleStatus || treino?.lifecycle_status || "").toLowerCase();
  const lifecycleRank = ACTIVE_LIFECYCLE_RANK[lifecycle] || 0;
  return lifecycleRank * 1e13 + getWorkoutComparableDate(treino).getTime();
}

function getWorkoutComparableDate(treino) {
  return (
    normalizeDate(treino?.dataInicio) ||
    normalizeDate(treino?.deliveredAt) ||
    normalizeDate(treino?.delivered_at) ||
    normalizeDate(treino?.completedAt) ||
    normalizeDate(treino?.completed_at) ||
    normalizeDate(treino?.createdAt) ||
    normalizeDate(treino?.created_at) ||
    new Date(0)
  );
}

function getLastReviewDate(treino) {
  return (
    normalizeDate(treino?.dataRevisao) ||
    normalizeDate(treino?.updatedAt) ||
    normalizeDate(treino?.updated_at) ||
    normalizeDate(treino?.createdAt) ||
    normalizeDate(treino?.created_at) ||
    null
  );
}

function calculateDaysSince(date, now) {
  if (!date) return null;
  const start = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const end = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.floor((end - start) / 86400000));
}

function normalizeDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function flattenWorkoutExercises(treino) {
  return (treino?.dias || []).flatMap((dia, diaIndex) =>
    (dia.exercicios || []).map((exercise, exerciseIndex) => ({
      ...exercise,
      group: dia.descricao || dia.grupo_muscular || dia.nome || "",
      dayName: dia.nome || "",
      dayIndex: diaIndex,
      exerciseIndex,
      normalizedName: normalizeExerciseName(exercise.nome),
    }))
  );
}

function findPreviousExerciseMatch(currentExercise, previousExercises) {
  const sameName = previousExercises.filter(
    (exercise) => exercise.normalizedName && exercise.normalizedName === currentExercise.normalizedName
  );
  if (sameName.length === 0) return { exercise: null, confidence: EXERCISE_MATCH_CONFIDENCE.NO_MATCH };

  const currentGroup = normalizeExerciseName(currentExercise.group);
  const sameGroup = sameName.find((exercise) => normalizeExerciseName(exercise.group) === currentGroup);
  if (sameGroup) return { exercise: sameGroup, confidence: EXERCISE_MATCH_CONFIDENCE.NAME_AND_GROUP };

  const samePosition = sameName.find(
    (exercise) => exercise.dayIndex === currentExercise.dayIndex || exercise.exerciseIndex === currentExercise.exerciseIndex
  );
  if (samePosition) return { exercise: samePosition, confidence: EXERCISE_MATCH_CONFIDENCE.EXACT_NAME };

  return { exercise: sameName[0], confidence: EXERCISE_MATCH_CONFIDENCE.PARTIAL };
}

function hasClearRepDrop(currentReps, previousReps) {
  return currentReps.parseable && previousReps.parseable && currentReps.numericValue < previousReps.numericValue;
}

function createSignal(type, currentExercise, previousExercise, matchConfidence) {
  return {
    type,
    exerciseName: currentExercise?.nome || "",
    current: pickComparableExerciseFields(currentExercise),
    previous: previousExercise ? pickComparableExerciseFields(previousExercise) : null,
    matchConfidence,
  };
}

function pickComparableExerciseFields(exercise) {
  return {
    nome: exercise?.nome || "",
    series: exercise?.series || "",
    repeticoes: exercise?.repeticoes || "",
    carga: exercise?.carga || "",
    group: exercise?.group || "",
  };
}
