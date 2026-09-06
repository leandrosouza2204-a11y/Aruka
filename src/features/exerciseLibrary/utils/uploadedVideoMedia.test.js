import assert from "node:assert/strict";
import test from "node:test";
import {
  EXERCISE_VIDEO_ALLOWED_MIME_TYPES,
  EXERCISE_VIDEO_FILE_ERRORS,
  EXERCISE_VIDEO_MAX_SIZE_BYTES,
  buildExerciseVideoPath,
  criarPayloadMidiaUpload,
  criarPayloadSemMidia,
  isExerciseVideoPath,
  validateExerciseVideoFile,
} from "./uploadedVideoMedia.js";

const userId = "00000000-0000-4000-8000-000000009101";
const exerciseId = "00000000-0000-4000-8000-000000009202";
const assetId = "00000000-0000-4000-8000-000000009303";

test("aceita somente mp4 e webm dentro do limite", () => {
  assert.deepEqual(EXERCISE_VIDEO_ALLOWED_MIME_TYPES, ["video/mp4", "video/webm"]);
  assert.equal(validateExerciseVideoFile(file("video/mp4", 1024)).ok, true);
  assert.equal(validateExerciseVideoFile(file("video/webm", EXERCISE_VIDEO_MAX_SIZE_BYTES)).ok, true);
});

test("rejeita arquivo vazio, MIME invalido e oversize", () => {
  assert.equal(validateExerciseVideoFile(file("video/mp4", 0)).error, EXERCISE_VIDEO_FILE_ERRORS.EMPTY);
  assert.equal(validateExerciseVideoFile(file("video/quicktime", 1024)).error, EXERCISE_VIDEO_FILE_ERRORS.UNSUPPORTED_TYPE);
  assert.equal(validateExerciseVideoFile(file("application/octet-stream", 1024)).error, EXERCISE_VIDEO_FILE_ERRORS.UNSUPPORTED_TYPE);
  assert.equal(validateExerciseVideoFile(file("video/mp4", EXERCISE_VIDEO_MAX_SIZE_BYTES + 1)).error, EXERCISE_VIDEO_FILE_ERRORS.TOO_LARGE);
});

test("gera path seguro sem usar filename original", () => {
  const path = buildExerciseVideoPath({
    userId,
    exerciseId,
    assetId,
    file: file("video/mp4", 1024, "../malicioso<script>.mov"),
  });

  assert.equal(path, `${userId}/exercises/${exerciseId}/${assetId}.mp4`);
  assert.equal(path.includes("malicioso"), false);
  assert.equal(isExerciseVideoPath(path), true);
  assert.equal(isExerciseVideoPath(`${userId}/../bad.mp4`), false);
});

test("cria payloads de upload e remocao sem signed URL", () => {
  const path = `${userId}/exercises/${exerciseId}/${assetId}.webm`;
  const upload = criarPayloadMidiaUpload({ path, mimeType: "video/webm" });

  assert.deepEqual(upload, {
    youtube_url: "",
    media_type: "uploaded_video",
    media_path: path,
    thumbnail_path: null,
    media_mime_type: "video/webm",
  });
  assert.equal("signedUrl" in upload, false);
  assert.equal(criarPayloadSemMidia().media_type, null);
});

function file(type, size, name = "video.mp4") {
  return { type, size, name };
}
