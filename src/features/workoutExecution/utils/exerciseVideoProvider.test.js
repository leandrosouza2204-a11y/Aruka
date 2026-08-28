import test from "node:test";
import assert from "node:assert/strict";
import { parseExerciseVideoUrl } from "./exerciseVideoProvider.js";

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
