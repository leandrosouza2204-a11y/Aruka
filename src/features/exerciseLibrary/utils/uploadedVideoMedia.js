export const EXERCISE_VIDEO_BUCKET = "exercise-media";
export const EXERCISE_VIDEO_MAX_SIZE_BYTES = 100 * 1024 * 1024;
export const EXERCISE_VIDEO_SIGNED_URL_TTL_SECONDS = 10 * 60;
export const EXERCISE_VIDEO_ALLOWED_MIME_TYPES = ["video/mp4", "video/webm"];

const EXTENSION_BY_MIME = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export const EXERCISE_VIDEO_FILE_ERRORS = {
  REQUIRED: "REQUIRED",
  EMPTY: "EMPTY",
  UNSUPPORTED_TYPE: "UNSUPPORTED_TYPE",
  TOO_LARGE: "TOO_LARGE",
};

export function validateExerciseVideoFile(file) {
  if (!file) return failure(EXERCISE_VIDEO_FILE_ERRORS.REQUIRED);
  if (file.size <= 0) return failure(EXERCISE_VIDEO_FILE_ERRORS.EMPTY);
  if (!EXERCISE_VIDEO_ALLOWED_MIME_TYPES.includes(file.type)) {
    return failure(EXERCISE_VIDEO_FILE_ERRORS.UNSUPPORTED_TYPE);
  }
  if (file.size > EXERCISE_VIDEO_MAX_SIZE_BYTES) {
    return failure(EXERCISE_VIDEO_FILE_ERRORS.TOO_LARGE);
  }

  return {
    ok: true,
    error: null,
    message: "",
    extension: EXTENSION_BY_MIME[file.type],
  };
}

export function getExerciseVideoFileErrorMessage(error) {
  if (error === EXERCISE_VIDEO_FILE_ERRORS.EMPTY) return "Selecione um vídeo válido.";
  if (error === EXERCISE_VIDEO_FILE_ERRORS.UNSUPPORTED_TYPE) {
    return "Formato de vídeo não suportado. Use MP4 ou WEBM.";
  }
  if (error === EXERCISE_VIDEO_FILE_ERRORS.TOO_LARGE) {
    return "O vídeo excede o tamanho máximo permitido de 100 MB.";
  }
  return "Selecione um vídeo válido.";
}

export function buildExerciseVideoPath({ userId, exerciseId, file, assetId }) {
  const validation = validateExerciseVideoFile(file);
  if (!validation.ok) {
    const error = new Error(getExerciseVideoFileErrorMessage(validation.error));
    error.code = validation.error;
    throw error;
  }
  if (!isUuidLike(userId) || !isUuidLike(exerciseId) || !isSafeAssetId(assetId)) {
    throw new Error("Dados insuficientes para enviar o vídeo.");
  }

  return `${userId}/exercises/${exerciseId}/${assetId}.${validation.extension}`;
}

export function isExerciseVideoPath(value) {
  return typeof value === "string" && /^[0-9a-f-]{36}\/exercises\/[0-9a-f-]{36}\/[0-9a-f-]{36}\.(mp4|webm)$/i.test(value);
}

export function criarPayloadMidiaUpload({ path, mimeType }) {
  return {
    youtube_url: "",
    media_type: "uploaded_video",
    media_path: path,
    thumbnail_path: null,
    media_mime_type: mimeType,
  };
}

export function criarPayloadSemMidia() {
  return {
    youtube_url: "",
    media_type: null,
    media_path: null,
    thumbnail_path: null,
    media_mime_type: null,
  };
}

function failure(error) {
  return {
    ok: false,
    error,
    message: getExerciseVideoFileErrorMessage(error),
    extension: "",
  };
}

function isUuidLike(value) {
  return /^[0-9a-f-]{36}$/i.test(String(value || ""));
}

function isSafeAssetId(value) {
  return /^[0-9a-f-]{36}$/i.test(String(value || ""));
}
