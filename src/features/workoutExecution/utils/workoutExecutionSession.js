export const WORKOUT_EXECUTION_SESSION_STATUS = Object.freeze({
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ABANDONED: "abandoned",
});

export const WORKOUT_EXECUTION_EXERCISE_STATUS = Object.freeze({
  NOT_STARTED: "not_started",
  PARTIAL: "partial",
  COMPLETED: "completed",
  SKIPPED: "skipped",
});

export const LOAD_UNITS = Object.freeze(["kg", "lb", "bodyweight", "machine_level", "unknown"]);

export function normalizeExecutionSession(session = null) {
  if (!session) return null;
  const exercises = Array.isArray(session.exercises) ? session.exercises : [];
  return {
    id: session.id || "",
    alunoId: session.alunoId || session.aluno_id || "",
    treinoId: session.treinoId || session.treino_id || "",
    treinoDiaId: session.treinoDiaId || session.treino_dia_id || "",
    status: normalizeSessionStatus(session.status),
    sessionDate: session.sessionDate || session.session_date || "",
    startedAt: session.startedAt || session.started_at || "",
    completedAt: session.completedAt || session.completed_at || "",
    abandonedAt: session.abandonedAt || session.abandoned_at || "",
    notes: session.notes || "",
    exercises: exercises.map(normalizeExecutionExercise),
  };
}

export function normalizeExecutionExercise(exercise = {}) {
  const sets = Array.isArray(exercise.sets) ? exercise.sets : [];
  return {
    id: exercise.id || "",
    treinoExercicioId: exercise.treinoExercicioId || exercise.treino_exercicio_id || "",
    treinoDiaId: exercise.treinoDiaId || exercise.treino_dia_id || "",
    name: exercise.name || exercise.exerciseNameSnapshot || exercise.exercise_name_snapshot || "Exercicio",
    prescribedSeries: exercise.prescribedSeries || exercise.prescribed_series_snapshot || "",
    prescribedReps: exercise.prescribedReps || exercise.prescribed_reps_snapshot || "",
    prescribedLoad: exercise.prescribedLoad || exercise.prescribed_load_snapshot || "",
    prescribedRest: exercise.prescribedRest || exercise.prescribed_rest_snapshot || "",
    prescribedNotes: exercise.prescribedNotes || exercise.prescribed_notes_snapshot || "",
    dayName: exercise.dayName || exercise.day_name_snapshot || "",
    group: exercise.group || exercise.group_snapshot || "",
    exerciseOrder: Number(exercise.exerciseOrder || exercise.exercise_order_snapshot || 0),
    dayOrder: Number(exercise.dayOrder || exercise.day_order_snapshot || 0),
    workoutTitle: exercise.workoutTitle || exercise.workout_title_snapshot || "",
    status: normalizeExerciseStatus(exercise.status),
    notes: exercise.notes || "",
    sets: sets.map(normalizeExecutionSet),
  };
}

export function normalizeExecutionSet(set = {}) {
  return {
    id: set.id || "",
    setNumber: Math.max(Number(set.setNumber || set.set_number || 1), 1),
    reps: Math.max(Number(set.reps || 0), 0),
    loadValue: set.loadValue === null || set.loadValue === undefined || set.loadValue === ""
      ? ""
      : Number(set.loadValue ?? set.load_value),
    loadUnit: LOAD_UNITS.includes(set.loadUnit || set.load_unit) ? (set.loadUnit || set.load_unit) : "kg",
    bodyweight: Boolean(set.bodyweight),
    rir: set.rir === null || set.rir === undefined || set.rir === "" ? "" : Number(set.rir),
    rpe: set.rpe === null || set.rpe === undefined || set.rpe === "" ? "" : Number(set.rpe),
    completed: Boolean(set.completed),
  };
}

export function normalizeSessionStatus(status) {
  return Object.values(WORKOUT_EXECUTION_SESSION_STATUS).includes(status)
    ? status
    : WORKOUT_EXECUTION_SESSION_STATUS.IN_PROGRESS;
}

export function normalizeExerciseStatus(status) {
  return Object.values(WORKOUT_EXECUTION_EXERCISE_STATUS).includes(status)
    ? status
    : WORKOUT_EXECUTION_EXERCISE_STATUS.NOT_STARTED;
}

export function validateExecutionSet(set = {}) {
  const errors = [];
  const normalized = normalizeExecutionSet(set);
  if (normalized.setNumber <= 0) errors.push("Numero da serie invalido.");
  if (normalized.reps < 0) errors.push("Repeticoes nao podem ser negativas.");
  if (normalized.loadValue !== "" && normalized.loadValue < 0) errors.push("Carga nao pode ser negativa.");
  if (normalized.rir !== "" && (normalized.rir < 0 || normalized.rir > 10)) errors.push("RIR deve ficar entre 0 e 10.");
  if (normalized.rpe !== "" && (normalized.rpe < 0 || normalized.rpe > 10)) errors.push("RPE deve ficar entre 0 e 10.");
  return { valid: errors.length === 0, errors, set: normalized };
}

export function canCompleteSession(session) {
  const normalized = normalizeExecutionSession(session);
  if (!normalized || normalized.status !== WORKOUT_EXECUTION_SESSION_STATUS.IN_PROGRESS) return false;
  return normalized.exercises.some((exercise) =>
    [WORKOUT_EXECUTION_EXERCISE_STATUS.PARTIAL, WORKOUT_EXECUTION_EXERCISE_STATUS.COMPLETED, WORKOUT_EXECUTION_EXERCISE_STATUS.SKIPPED].includes(exercise.status) ||
    exercise.sets.some((set) => set.completed)
  );
}

export function buildExecutionHistorySummary(session) {
  if (Array.isArray(session)) {
    return session.map(buildExecutionHistorySummary).filter(Boolean);
  }

  const normalized = normalizeExecutionSession(session);
  if (!normalized) return null;
  const completedSets = normalized.exercises.flatMap((exercise) => exercise.sets).filter((set) => set.completed);
  const touchedExercises = normalized.exercises.filter((exercise) =>
    exercise.status !== WORKOUT_EXECUTION_EXERCISE_STATUS.NOT_STARTED || exercise.sets.length > 0
  );
  return {
    id: normalized.id,
    status: normalized.status,
    date: normalized.sessionDate || normalized.startedAt,
    dateLabel: formatExecutionDate(normalized.sessionDate || normalized.startedAt),
    workoutTitle: normalized.exercises[0]?.workoutTitle || "Treino",
    dayName: normalized.exercises[0]?.dayName || "Ficha",
    statusLabel: formatExecutionStatus(normalized.status),
    exerciseCount: touchedExercises.length,
    setCount: completedSets.length,
    completedSetCount: completedSets.length,
    completedAt: normalized.completedAt,
    abandonedAt: normalized.abandonedAt,
  };
}

export function buildExecutionSavePayload(session) {
  const normalized = normalizeExecutionSession(session);
  if (!normalized) return [];
  return normalized.exercises.map((exercise) => ({
    id: exercise.id,
    status: exercise.status,
    notes: exercise.notes,
    sets: exercise.sets.map((set) => ({
      setNumber: set.setNumber,
      reps: set.reps,
      loadValue: set.loadValue === "" ? null : set.loadValue,
      loadUnit: set.bodyweight ? "bodyweight" : set.loadUnit,
      bodyweight: set.bodyweight,
      rir: set.rir === "" ? null : set.rir,
      rpe: set.rpe === "" ? null : set.rpe,
      completed: set.completed,
    })),
  }));
}

function formatExecutionStatus(status) {
  if (status === WORKOUT_EXECUTION_SESSION_STATUS.COMPLETED) return "Concluido";
  if (status === WORKOUT_EXECUTION_SESSION_STATUS.ABANDONED) return "Abandonado";
  return "Em andamento";
}

function formatExecutionDate(value) {
  if (!value) return "data nao informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "data nao informada";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(date);
}
