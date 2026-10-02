import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const player = read("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx");
const continuity = read("src/features/studentExperienceV2/player/playerContinuity.js");
const domain = read("src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js");
const profile = read("src/features/studentExperienceV2/profile/StudentProfileV2.jsx");
const css = read("src/index.css");

test("Player revalidation is latest-response-only and selection is exercise-id based", () => {
  assert.match(player, /requestGuardRef\.current\.start\(\)/);
  assert.match(player, /requestGuardRef\.current\.isCurrent\(requestVersion\)/);
  assert.match(player, /activeExerciseId/);
  assert.match(player, /persistExerciseSelection\(sessionId, nextId\)/);
  assert.doesNotMatch(player, /const \[currentIndex, setCurrentIndex\]/);
  assert.match(domain, /!isPlayerExerciseComplete\(exercise\)/);
});

test("unsent drafts are volatile and isolated by session exercise and set", () => {
  assert.match(player, /draftStore\.read\(\s*sessionId,\s*exercise\.id,\s*setNumber/);
  assert.match(player, /draftStore\.write\(sessionId, exercise\.id, setNumber, next\)/);
  assert.match(player, /draftStore\.clear\(sessionId, exercise\.id, setNumber\)/);
  assert.match(continuity, /exerciseKey\(sessionId, exerciseId\).*Number\(setNumber\)/s);
  assert.match(continuity, /Symbol\.for\("aruka\.studentExperienceV2\.playerDraftStore"\)/);
  assert.match(player, /getVolatilePlayerDraftStore\(\)/);
  assert.doesNotMatch(continuity, /localStorage|sessionStorage|indexedDB/i);
});

test("Player header exposes full wrapping text without ellipsis clipping", () => {
  assert.match(css, /\.workout-player-header-copy[^}]*overflow:\s*visible/);
  assert.match(css, /\.workout-player-header-copy span[^}]*overflow-wrap:\s*anywhere[^}]*white-space:\s*normal/);
  assert.match(css, /\.workout-player-header-copy strong[^}]*overflow-wrap:\s*anywhere[^}]*white-space:\s*normal/);
  assert.doesNotMatch(css, /\.workout-player-header-copy (?:span|strong)[^}]*text-overflow:\s*ellipsis/);
});

test("WhatsApp handoff keeps the official wa.me HTTPS link and a separate browsing context", () => {
  assert.match(profile, /href=\{profile\.professional\.whatsappUrl\}/);
  assert.match(profile, /target="_blank"/);
  assert.match(profile, /rel="noreferrer"/);
  assert.doesNotMatch(profile, /api\.whatsapp\.com|window\.open/);
});
