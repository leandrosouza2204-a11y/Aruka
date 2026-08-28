import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import { parseExerciseVideoUrl } from "../src/features/workoutExecution/utils/exerciseVideoProvider.js";

const source = readFileSync("src/features/workoutExecution/components/ExerciseVideoPlayer.jsx", "utf8");
const valid = parseExerciseVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");

assert.equal(valid.embedUrl, "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
assert.equal(parseExerciseVideoUrl("https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ"), null);
assert.equal(parseExerciseVideoUrl("javascript:alert(1)"), null);
assert.match(source, /allowFullScreen/);
assert.match(source, /loading="lazy"/);
assert.doesNotMatch(source, /autoplay/i);

console.log("EXERCISE_VIDEO_PROVIDER_QA=PASS");
console.log("ARBITRARY_IFRAME=BLOCKED");
console.log("FAKE_YOUTUBE_DOMAIN=BLOCKED");
console.log("UNSUPPORTED_SCHEME=BLOCKED");
console.log("EMBED_DOMAIN=youtube-nocookie.com");
console.log("IFRAME_MOUNTED_ON_DEMAND=YES");
console.log("AUTOPLAY=NO");
