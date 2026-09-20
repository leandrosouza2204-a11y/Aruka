import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const domain = read("src/features/studentExperienceV2/domain/workoutRestTimerV2.js");
const player = read("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx");
const service = read("src/services/studentWorkoutPlayerV2Service.js");
const migration = read("supabase/migrations/20260919231657_cycle12_rest_timer_server_clock.sql");
const css = read("src/index.css");

const checks = [
  ["existing bounded Player RPC gains a stable backend clock without a new RPC or table", /create or replace function public\.get_my_workout_player_v2/.test(migration) && /'serverNow', statement_timestamp\(\)/.test(migration) && /\nstable\n/.test(migration) && !/create table|create function public\.(?!get_my_workout_player_v2)/i.test(migration)],
  ["canonical inputs are persisted completion timestamp and immutable rest snapshot", /set\.completedAt/.test(domain) && /exercise\.prescribedRest/.test(domain) && /completedAt'.*ws\.updated_at/s.test(migration) && /prescribedRest'.*prescribed_rest_snapshot/s.test(migration)],
  ["identity isolates session exercise set completion and duration", /JSON\.stringify\(\[player\.id, latest\.exerciseId, latest\.setNumber, latest\.startedAt, latest\.durationSeconds\]\)/.test(domain)],
  ["remaining time derives from deadline and monotonic backend anchor", /rest\.endsAtMs - Number\(serverNowMs\)/.test(domain) && /performance\.now/.test(player) && !/Date\.now/.test(domain + player)],
  ["visual ticks are local and no periodic backend writes or polling exist", /setInterval/.test(player) && !/setInterval[\s\S]{0,400}onRefresh/.test(player) && !/localStorage/.test(domain + player + service)],
  ["visibility focus and bfcache resume trigger bounded reconciliation", /visibilitychange/.test(player) && /pageshow/.test(player) && /window\.addEventListener\("focus"/.test(player)],
  ["terminal skipped invalid and final-workout guards exist", /TERMINAL_SESSION_STATUSES/.test(domain) && /exercise\.status === "skipped"/.test(domain) && /hasPendingWorkoutSet/.test(domain)],
  ["dismissal is visual session storage only", /sessionStorage\.setItem\(dismissedRestKey/.test(player) && /Dispensar aviso/.test(player)],
  ["no workout completion or rest mutation command was introduced", !/completeWorkoutSession|pauseRest|restartRest|updateRest/i.test(player + service)],
  ["accessibility avoids per-second live announcements", /aria-live="polite" className="sr-only"/.test(player) && !/<strong[^>]*aria-live/.test(player) && /focus-visible/.test(css) && /prefers-reduced-motion/.test(css)],
  ["clock uncertainty is recorded from bounded request timing", /serverRoundTripMs/.test(service) && /uncertaintyMs/.test(domain)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
assert.equal(failed, false, "Cycle 12.7 static contract failed");
