import assert from "node:assert/strict";
import test from "node:test";
import {
  YOUTUBE_MEDIA_ERRORS,
  normalizeYouTubeMediaInput,
  parseYouTubeMediaInput,
} from "./youtubeMedia.js";

const id = "dQw4w9WgXcQ";

test("normaliza formatos aceitos do YouTube", () => {
  for (const input of [
    id,
    `https://youtube.com/watch?v=${id}`,
    `https://www.youtube.com/watch?v=${id}&t=10`,
    `https://m.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}?si=abc`,
    `https://youtube.com/shorts/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `youtube.com/watch?v=${id}`,
    `www.youtube.com/watch?v=${id}`,
    `youtu.be/${id}`,
    `  https://www.youtube.com/watch?v=${id}  `,
  ]) {
    const result = parseYouTubeMediaInput(input);
    assert.equal(result.ok, true);
    assert.equal(result.media.videoId, id);
    assert.equal(result.media.canonicalUrl, `https://www.youtube.com/watch?v=${id}`);
    assert.equal(result.media.embedUrl, `https://www.youtube-nocookie.com/embed/${id}`);
    assert.equal(result.media.thumbnailUrl, `https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
  }
});

test("preserva caixa do ID validado", () => {
  const mixedId = "AbC_123-XyZ";
  const media = normalizeYouTubeMediaInput(`https://youtu.be/${mixedId}`);

  assert.equal(media.videoId, mixedId);
  assert.equal(media.canonicalUrl, `https://www.youtube.com/watch?v=${mixedId}`);
});

test("rejeita hosts, esquemas e conteudo arbitrario", () => {
  const unsafeInputs = [
    ["", YOUTUBE_MEDIA_ERRORS.EMPTY],
    [null, YOUTUBE_MEDIA_ERRORS.EMPTY],
    ["https://youtube.com/watch?v=bad", YOUTUBE_MEDIA_ERRORS.INVALID_VIDEO_ID],
    ["https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ", YOUTUBE_MEDIA_ERRORS.UNSUPPORTED_HOST],
    ["https://notyoutube.com/watch?v=dQw4w9WgXcQ", YOUTUBE_MEDIA_ERRORS.UNSUPPORTED_HOST],
    ["javascript:alert(1)", YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT],
    ["data:text/html,evil", YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT],
    ["file:///tmp/video", YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT],
    ["ftp://youtube.com/watch?v=dQw4w9WgXcQ", YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT],
    ['<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>', YOUTUBE_MEDIA_ERRORS.INVALID_FORMAT],
  ];

  for (const [input, expectedError] of unsafeInputs) {
    const result = parseYouTubeMediaInput(input);
    assert.equal(result.ok, false);
    assert.equal(result.error, expectedError);
  }
});
