import test from "node:test";
import assert from "node:assert/strict";
import { parseExerciseVideoUrl, parseStudentExerciseMedia } from "./exerciseVideoProvider.js";

const id = "dQw4w9WgXcQ";

test("parses supported YouTube URLs", () => {
  for (const url of [
    `https://youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?v=${id}&t=10`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=abc`,
    `https://youtube.com/shorts/${id}`,
    `https://www.youtube.com/shorts/${id}?feature=share`,
    `  https://www.youtube.com/watch?v=${id}  `,
  ]) {
    const parsed = parseExerciseVideoUrl(url);
    assert.equal(parsed.provider, "youtube");
    assert.equal(parsed.videoId, id);
    assert.equal(parsed.embedUrl, `https://www.youtube-nocookie.com/embed/${id}`);
  }
});

test("blocks unsupported and unsafe URLs", () => {
  for (const url of [
    "",
    null,
    "https://youtube.com/watch?v=bad",
    "https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ",
    "https://notyoutube.com/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)",
    "data:text/html,evil",
    "file:///tmp/video",
    "https://vimeo.com/123",
  ]) {
    assert.equal(parseExerciseVideoUrl(url), null);
  }
});

test("maps student YouTube media from validated snapshot id", () => {
  const parsed = parseStudentExerciseMedia({ type: "youtube", videoId: id });

  assert.equal(parsed.type, "youtube");
  assert.equal(parsed.embedUrl, `https://www.youtube-nocookie.com/embed/${id}`);
});

test("maps uploaded media marker without signed url persistence", () => {
  const mediaPath = "00000000-0000-4000-8000-000000009101/exercises/00000000-0000-4000-8000-000000009202/00000000-0000-4000-8000-000000009303.mp4";
  const parsed = parseStudentExerciseMedia({ type: "uploaded_video", mediaPath, mimeType: "video/mp4" });

  assert.equal(parsed.type, "uploaded_video");
  assert.equal(parsed.mediaPath, mediaPath);
  assert.equal(JSON.stringify(parsed).includes("signedUrl"), false);
});

test("maps uploaded media marker without exposing storage path in workout payload", () => {
  const parsed = parseStudentExerciseMedia({ type: "uploaded_video", mimeType: "video/mp4" });

  assert.equal(parsed.type, "uploaded_video");
  assert.equal(parsed.mediaPath, "");
});

test("blocks invalid uploaded media and supports no-media fallback", () => {
  assert.equal(parseStudentExerciseMedia({ type: "uploaded_video", mediaPath: "../private.mp4" }), null);
  assert.equal(parseStudentExerciseMedia({ type: "" }), null);
});
