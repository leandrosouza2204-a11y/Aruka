import {
  DEFAULT_TRACKING_CONFIG,
  WORKOUT_EXECUTION_EXERCISE_STATUS,
  WORKOUT_EXECUTION_SESSION_STATUS,
  normalizeTrackingConfig,
} from "../../workoutExecution/utils/workoutExecutionSession.js";

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
    sets: (Array.isArray(exercise.sets) ? exercise.sets : []).map((set) => ({
      id: clean(set.id),
      setNumber: Math.max(1, Number(set.setNumber ?? set.set_number ?? 1)),
      completed: set.completed === true,
    })),
  };
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
