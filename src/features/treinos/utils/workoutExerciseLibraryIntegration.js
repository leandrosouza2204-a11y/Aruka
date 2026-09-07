import { parseYouTubeMediaInput } from "../../exerciseLibrary/utils/youtubeMedia.js";

export function libraryExerciseToWorkoutExercise(exercise, options = {}) {
  const snapshot = createExerciseLibrarySnapshot(exercise);

  return {
    id: createId(),
    exerciseId: sanitizeText(exercise?.id),
    nome: snapshot.name,
    series: sanitizeText(options.series),
    repeticoes: sanitizeText(options.repeticoes),
    carga: sanitizeText(options.carga),
    descanso: sanitizeText(options.descanso),
    observacoes: sanitizeText(options.observacoes),
    video: snapshot.media.type === "youtube" ? snapshot.media.youtubeUrl : "",
    exerciseMediaSnapshot: snapshot,
  };
}

export function manualWorkoutExercise(input = {}) {
  return {
    ...input,
    exerciseId: "",
    exerciseMediaSnapshot: {},
  };
}

export function normalizeWorkoutExerciseReference(exercise = {}) {
  const exerciseId = sanitizeText(exercise.exerciseId || exercise.exercise_id);
  const snapshot = normalizeExerciseMediaSnapshot(
    exercise.exerciseMediaSnapshot || exercise.exercise_media_snapshot
  );

  return {
    exerciseId,
    exerciseMediaSnapshot: exerciseId ? snapshot : {},
  };
}

export function createExerciseLibrarySnapshot(exercise = {}) {
  return {
    schemaVersion: 1,
    exerciseId: sanitizeText(exercise.id),
    source: exercise.origem === "personal" ? "personal" : "official",
    name: sanitizeText(exercise.nome),
    description: sanitizeText(exercise.descricao),
    instructions: sanitizeText(exercise.instrucoes),
    muscleGroup: sanitizeText(exercise.grupoMuscular),
    category: sanitizeText(exercise.categoria),
    media: createExerciseMediaSnapshot(exercise.midia),
  };
}

export function normalizeExerciseMediaSnapshot(value = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return {
    schemaVersion: positiveInteger(value.schemaVersion, 1),
    exerciseId: sanitizeText(value.exerciseId),
    source: value.source === "personal" ? "personal" : value.source === "official" ? "official" : "",
    name: sanitizeText(value.name),
    description: sanitizeText(value.description),
    instructions: sanitizeText(value.instructions),
    muscleGroup: sanitizeText(value.muscleGroup),
    category: sanitizeText(value.category),
    media: createExerciseMediaSnapshot(value.media),
  };
}

export function createExerciseMediaSnapshot(media = {}) {
  if (media?.type === "youtube") {
    const parsed = parseYouTubeMediaInput(media.youtubeUrl || media.url);
    return {
      type: "youtube",
      youtubeUrl: parsed.ok ? parsed.media.canonicalUrl : sanitizeText(media.youtubeUrl),
      videoId: parsed.ok ? parsed.media.videoId : sanitizeText(media.videoId),
      thumbnailUrl: parsed.ok ? parsed.media.thumbnailUrl : sanitizeText(media.thumbnailUrl),
    };
  }

  if (media?.type === "uploaded_video") {
    return {
      type: "uploaded_video",
      mediaPath: sanitizeText(media.mediaPath || media.media_path),
      mimeType: sanitizeText(media.mimeType || media.media_mime_type),
      thumbnailPath: sanitizeText(media.thumbnailPath || media.thumbnail_path),
    };
  }

  return { type: "" };
}

export function hasPersistedSignedUrl(value) {
  return JSON.stringify(value || {}).includes("signedUrl");
}

function sanitizeText(value) {
  return String(value || "").trim();
}

function positiveInteger(value, fallback) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tmp-${Math.random().toString(36).slice(2)}`;
}
