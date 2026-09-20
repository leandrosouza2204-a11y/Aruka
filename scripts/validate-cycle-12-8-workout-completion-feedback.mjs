import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const migration = read("supabase/migrations/20260920104727_cycle12_workout_completion_feedback.sql");
const player = read("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx");
const domain = read("src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js");
const executionService = read("src/services/workoutExecutionService.js");
const playerService = read("src/services/studentWorkoutPlayerV2Service.js");
const css = read("src/index.css");

const checks = [
  ["completion stays explicit and separate from set completion", /Finalizar treino/.test(player) && /Concluir série/.test(player) && /onComplete/.test(player)],
  ["rest expiry never invokes workout completion", !/RestTimerNotice[\s\S]*?completeSession\(/.test(player) && !/setInterval[\s\S]{0,500}(concluirMeuWorkout|completeWorkoutSession)/.test(player)],
  ["canonical command owns locks validates sets and short duration", /for update of s/i.test(migration) && /ZERO_COMPLETED_SETS/.test(migration) && /SHORT_WORKOUT_CONFIRMATION_REQUIRED/.test(migration)],
  ["authorization derives student ownership from auth uid", /a\.student_user_id = auth\.uid\(\)/.test(migration) && /student_access_status = 'active'/.test(migration) && /SESSION_NOT_OWNED/.test(migration)],
  ["feedback is optional bounded session data written in the completion transaction", /workout_execution_session_feedback/.test(migration) && /between 1 and 1000/.test(migration) && /insert into public\.workout_execution_session_feedback/.test(migration)],
  ["feedback storage is closed to direct client access", /enable row level security/.test(migration) && /revoke all on table public\.workout_execution_session_feedback from public, anon, authenticated/.test(migration)],
  ["session table keeps SELECT but revokes unused direct capabilities", /revoke\s+truncate, references, trigger, maintain\s+on table public\.workout_execution_sessions\s+from authenticated/i.test(migration) && !/revoke\s+select[^;]*public\.workout_execution_sessions/i.test(migration)],
  ["security definer functions pin an empty search path and least privilege execute", /security definer\s+set search_path = ''/i.test(migration) && /revoke all on function public\.complete_workout_execution_session_v2\(uuid, boolean, text\)/.test(migration) && /to authenticated/.test(migration)],
  ["equal retries are idempotent and divergent feedback conflicts", /v_feedback is distinct from v_existing_feedback/.test(migration) && /FEEDBACK_CONFLICT/.test(migration)],
  ["client sends feedback only with canonical completion", /p_feedback_text: feedback \|\| null/.test(executionService) && /concluirMeuWorkoutPlayerV2/.test(playerService + player)],
  ["known backend gates are sanitized without exposing raw database errors", /SHORT_WORKOUT_CONFIRMATION_REQUIRED/.test(executionService) && /ZERO_COMPLETED_SETS/.test(executionService) && /WORKOUT_EXECUTION_FAILED/.test(executionService)],
  ["ambiguous failures reconcile before retry and preserve feedback", /Verificando se o treino foi concluído/.test(player) && /Seu feedback foi preservado/.test(player) && /status === "completed"/.test(player)],
  ["reload renders a backend-confirmed result summary and persisted feedback", /workout-completion-result/.test(player) && /deriveWorkoutCompletionSummary/.test(domain + player) && /'feedback'/.test(migration)],
  ["feedback is not stored in local or session storage", !/(localStorage|sessionStorage)[\s\S]{0,120}feedback/i.test(player + playerService + executionService)],
  ["completion dialog and result retain keyboard and reduced-motion foundations", /<dialog aria-labelledby="complete-workout-title"/.test(player) && /aria-invalid/.test(player) && /focus-visible/.test(css) && /prefers-reduced-motion/.test(css)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
assert.equal(failed, false, "Cycle 12.8 static contract failed");
