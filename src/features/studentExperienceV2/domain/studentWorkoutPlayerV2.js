import {
  DEFAULT_TRACKING_CONFIG,
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  WORKOUT_EXECUTION_SESSION_STATUS,
  normalizeTrackingConfig,
} from "../../workoutExecution/utils/workoutExecutionSession.js";
import { buildExecutionSetNumbers } from "../../workoutExecution/utils/restTimer.js";

export const PLAYER_TRACKING_FIELDS = Object.freeze(["reps", "load", "rir", "rpe"]);

export const PLAYER_TERMINAL_STATUSES = Object.freeze([
  WORKOUT_EXECUTION_SESSION_STATUS.COMPLETED,
  WORKOUT_EXECUTION_SESSION_STATUS.CANCELLED,
  WORKOUT_EXECUTION_SESSION_STATUS.ABANDONED,
]);

export function normalizeWorkoutPlayerV2(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  const exercises = (Array.isArray(payload.exercises) ? payload.exercises : [])
    .map(normalizePlayerExercise)
    .sort(comparePlayerExercises);
  return {
    id: clean(payload.id),
    treinoId: clean(payload.treinoId ?? payload.treino_id),
    treinoDiaId: clean(payload.treinoDiaId ?? payload.treino_dia_id),
    status: clean(payload.status) || WORKOUT_EXECUTION_SESSION_STATUS.IN_PROGRESS,
    startedAt: clean(payload.startedAt ?? payload.started_at),
    lastActivityAt: clean(payload.lastActivityAt ?? payload.last_activity_at),
    workoutTitle: clean(payload.workoutTitle ?? payload.workout_title) || "Treino",
    dayName: clean(payload.dayName ?? payload.day_name) || "Treino atual",
    exercises,
  };
}

export function normalizePlayerExercise(exercise = {}) {
  return {
    id: clean(exercise.id),
    treinoExercicioId: clean(exercise.treinoExercicioId ?? exercise.treino_exercicio_id),
    name: clean(exercise.name) || "Exercício",
    dayName: clean(exercise.dayName ?? exercise.day_name),
    group: clean(exercise.group),
    exerciseOrder: toOrder(exercise.exerciseOrder ?? exercise.exercise_order),
    dayOrder: toOrder(exercise.dayOrder ?? exercise.day_order),
    prescribedSeries: clean(exercise.prescribedSeries ?? exercise.prescribed_series),
    prescribedReps: clean(exercise.prescribedReps ?? exercise.prescribed_reps),
    prescribedLoad: clean(exercise.prescribedLoad ?? exercise.prescribed_load),
    prescribedRest: clean(exercise.prescribedRest ?? exercise.prescribed_rest),
    prescribedNotes: clean(exercise.prescribedNotes ?? exercise.prescribed_notes),
    trackingConfig: normalizeTrackingConfig(exercise.trackingConfig ?? exercise.tracking_config ?? DEFAULT_TRACKING_CONFIG),
    status: clean(exercise.status) || WORKOUT_EXECUTION_EXERCISE_STATUS.NOT_STARTED,
    media: normalizePlayerMedia(exercise.media),
    sets: (Array.isArray(exercise.sets) ? exercise.sets : []).map(normalizePlayerSet),
  };
}

export function normalizePlayerSet(set = {}) {
  return {
    id: clean(set.id),
    setNumber: Math.max(1, Number(set.setNumber ?? set.set_number ?? 1)),
    reps: optionalNumber(set.reps),
    loadValue: optionalNumber(set.loadValue ?? set.load_value),
    loadUnit: clean(set.loadUnit ?? set.load_unit) || "kg",
    bodyweight: set.bodyweight === true,
    rir: optionalNumber(set.rir),
    rpe: optionalNumber(set.rpe),
    completed: set.completed === true,
    completedAt: clean(set.completedAt ?? set.completed_at),
  };
}

export function getPlayerTrackingFields(trackingConfig = {}) {
  const normalized = normalizeTrackingConfig(trackingConfig);
  return PLAYER_TRACKING_FIELDS.filter((field) => normalized[field]);
}

export function buildPlayerSetRows(exercise = {}) {
  const persisted = Array.isArray(exercise.sets) ? exercise.sets : [];
  return buildExecutionSetNumbers(exercise.prescribedSeries, persisted).map((setNumber) => (
    persisted.find((set) => set.setNumber === setNumber) || normalizePlayerSet({ setNumber })
  ));
}

export function resolveCurrentSetNumber(exercise = {}, preferredSetNumber = 0) {
  const rows = buildPlayerSetRows(exercise);
  if (rows.some((set) => set.setNumber === Number(preferredSetNumber))) return Number(preferredSetNumber);
  return rows.find((set) => !set.completed)?.setNumber || rows.at(-1)?.setNumber || 1;
}

export function deriveCanonicalSetProgress(exercises = []) {
  const rows = exercises.flatMap(buildPlayerSetRows);
  const completed = rows.filter((set) => set.completed).length;
  return { completed, total: rows.length, percent: rows.length ? Math.round((completed / rows.length) * 100) : 0 };
}

export function validatePlayerSetInput(values = {}, trackingConfig = {}) {
  const enabled = new Set(getPlayerTrackingFields(trackingConfig));
  const errors = {};
  validateNumber("reps", values.reps, enabled, errors, { integer: true, min: 0 });
  validateNumber("load", values.loadValue, enabled, errors, { min: 0 });
  validateNumber("rir", values.rir, enabled, errors, { integer: true, min: 0, max: 10 });
  validateNumber("rpe", values.rpe, enabled, errors, { min: 0, max: 10 });
  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildPlayerSetCommandValues(values = {}, trackingConfig = {}) {
  const enabled = new Set(getPlayerTrackingFields(trackingConfig));
  const payload = {};
  if (enabled.has("reps") && hasValue(values.reps)) payload.reps = Number(values.reps);
  if (enabled.has("load")) {
    const bodyweight = values.loadUnit === "bodyweight";
    if (hasValue(values.loadValue) && !bodyweight) payload.loadValue = Number(values.loadValue);
    payload.loadUnit = bodyweight ? "bodyweight" : (values.loadUnit || "kg");
    payload.bodyweight = bodyweight;
  }
  if (enabled.has("rir") && hasValue(values.rir)) payload.rir = Number(values.rir);
  if (enabled.has("rpe") && hasValue(values.rpe)) payload.rpe = Number(values.rpe);
  return payload;
}

export function normalizePreviousPerformance(payload = null) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null;
  return {
    sessionId: clean(payload.sessionId ?? payload.session_id),
    sessionDate: clean(payload.sessionDate ?? payload.session_date),
    completedAt: clean(payload.completedAt ?? payload.completed_at),
    executionExerciseId: clean(payload.executionExerciseId ?? payload.execution_exercise_id),
    trackingConfig: normalizeTrackingConfig(payload.trackingConfig ?? payload.tracking_config),
    sets: (Array.isArray(payload.sets) ? payload.sets : []).map(normalizePlayerSet),
  };
}

export function getPreviousSetReference(previousPerformance, setNumber) {
  if (!previousPerformance) return null;
  const set = previousPerformance.sets.find((item) => item.setNumber === Number(setNumber));
  if (!set) return null;
  const facts = [];
  if (set.reps !== "") facts.push(`${set.reps} repetições`);
  if (set.bodyweight) facts.push("peso corporal");
  else if (set.loadValue !== "") facts.push(`${set.loadValue} ${set.loadUnit}`);
  if (set.rir !== "") facts.push(`RIR ${set.rir}`);
  if (set.rpe !== "") facts.push(`RPE ${set.rpe}`);
  return facts.length ? { setNumber: set.setNumber, facts } : null;
}

export function comparePlayerExercises(left, right) {
  return left.dayOrder - right.dayOrder
    || left.exerciseOrder - right.exerciseOrder
    || left.id.localeCompare(right.id);
}

export function resolveCurrentExerciseIndex(exercises = [], preferredExerciseId = "") {
  if (!exercises.length) return -1;
  const preferred = exercises.findIndex((exercise) => exercise.id === preferredExerciseId);
  if (preferred >= 0) return preferred;
  const actionable = exercises.findIndex((exercise) => exercise.status !== WORKOUT_EXECUTION_EXERCISE_STATUS.SKIPPED
    && !exercise.sets.some((set) => set.completed));
  return actionable >= 0 ? actionable : 0;
}

export function derivePlayerProgress(exercises = [], currentIndex = -1) {
  const total = exercises.length;
  const position = total && currentIndex >= 0 ? Math.min(currentIndex + 1, total) : 0;
  return { total, position, percent: total ? Math.round((position / total) * 100) : 0 };
}

export function buildPlayerPrescriptionFacts(exercise = {}) {
  const facts = [];
  if (exercise.prescribedSeries && exercise.prescribedReps) facts.push(`${exercise.prescribedSeries} × ${exercise.prescribedReps}`);
  else if (exercise.prescribedSeries) facts.push(`${exercise.prescribedSeries} séries`);
  else if (exercise.prescribedReps) facts.push(`${exercise.prescribedReps} repetições`);
  if (exercise.prescribedLoad) facts.push(`Carga: ${exercise.prescribedLoad}`);
  if (exercise.prescribedRest) facts.push(`Descanso: ${exercise.prescribedRest}`);
  return facts;
}

export function isPlayerSessionTerminal(status) {
  return PLAYER_TERMINAL_STATUSES.includes(status);
}

export function normalizePlayerMedia(media) {
  if (!media || typeof media !== "object" || Array.isArray(media)) return { type: "" };
  if (media.type === "youtube") return {
    type: "youtube",
    videoId: clean(media.videoId ?? media.video_id),
    youtubeUrl: clean(media.youtubeUrl ?? media.youtube_url),
  };
  if (media.type === "uploaded_video") return { type: "uploaded_video", mimeType: clean(media.mimeType ?? media.mime_type) };
  if (media.type === "image" && clean(media.url)) return { type: "image", url: clean(media.url), alt: clean(media.alt) };
  return { type: "" };
}

function clean(value) { return String(value || "").trim(); }
function toOrder(value) { const number = Number(value); return Number.isFinite(number) ? number : 0; }
function optionalNumber(value) { return hasValue(value) && Number.isFinite(Number(value)) ? Number(value) : ""; }
function hasValue(value) { return value !== null && value !== undefined && String(value).trim() !== ""; }
function validateNumber(field, value, enabled, errors, { integer = false, min, max } = {}) {
  if (!enabled.has(field) || !hasValue(value)) return;
  const number = Number(value);
  if (!Number.isFinite(number) || (integer && !Number.isInteger(number)) || number < min || (max !== undefined && number > max)) {
    errors[field] = field === "rir" || field === "rpe"
      ? `${field.toUpperCase()} deve ficar entre 0 e 10.`
      : `${field === "reps" ? "Repetições" : "Carga"} deve ser um número ${integer ? "inteiro " : ""}igual ou maior que zero.`;
  }
}
