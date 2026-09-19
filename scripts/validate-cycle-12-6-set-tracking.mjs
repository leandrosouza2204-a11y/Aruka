import { readFile } from "node:fs/promises";

const [player, domain, service, executionService, migration, commands, previousRead, css] = await Promise.all([
  readFile("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js", "utf8"),
  readFile("src/services/studentWorkoutPlayerV2Service.js", "utf8"),
  readFile("src/services/workoutExecutionService.js", "utf8"),
  readFile("supabase/migrations/20260919120000_cycle12_set_tracking_player_payload.sql", "utf8"),
  readFile("supabase/migrations/20260914131000_cycle12_execution_commands.sql", "utf8"),
  readFile("supabase/migrations/20260914185833_cycle12_canonical_execution_reads.sql", "utf8"),
  readFile("src/index.css", "utf8"),
]);

const checks = [
  ["Player uses the canonical set command", /concluirMinhaSerieNoWorkoutPlayerV2/.test(player) && /completeWorkoutSet/.test(service) && /complete_workout_execution_set/.test(executionService)],
  ["success waits for a canonical command response", /onApplyConfirmed\(exercise\.id, setNumber, result\)/.test(player) && /Série registrada com sucesso/.test(player)],
  ["ambiguous failures reconcile before retry", /Verificando se o registro foi concluído/.test(player) && /status: "uncertain"/.test(player) && /Verificar registro/.test(player)],
  ["completed sets are read-only", /selected\.completed \? <CompletedSet/.test(player) && /somente para leitura/.test(player)],
  ["navigation is not a completion command", /selectSet\(nextSetNumber/.test(player) && !/function selectSet[\s\S]{0,500}concluirMinhaSerie/.test(player)],
  ["tracking fields are snapshot-driven and allowlisted", /PLAYER_TRACKING_FIELDS/.test(domain) && /getPlayerTrackingFields\(exercise\.trackingConfig\)/.test(player)],
  ["reserved duration and distance are not serialized", /PLAYER_TRACKING_FIELDS = Object\.freeze\(\["reps", "load", "rir", "rpe"\]\)/.test(domain) && /Duração e distância/.test(player)],
  ["canonical set progress is backend-confirmed", /deriveCanonicalSetProgress/.test(domain) && /set\.completed/.test(domain) && /progress\.sets\.completed/.test(player)],
  ["Player payload exposes persisted metrics and server timestamp", /'reps', ws\.reps/.test(migration) && /'loadValue', ws\.load_value/.test(migration) && /'completedAt'.*ws\.updated_at/.test(migration)],
  ["Player RPC keeps ownership, safe search path and least privilege", /auth\.uid\(\)/.test(migration) && /s\.aluno_id = v_aluno_id/.test(migration) && /set search_path = ''/.test(migration) && /revoke all.*public, anon/.test(migration)],
  ["set command retains row locking and natural idempotency", /for update/.test(commands) && /SET_CONFLICT/.test(commands) && /on conflict \(execution_exercise_id,set_number\)/.test(commands)],
  ["previous performance is bounded to one valid completed execution", /valid_workout_execution_sessions/.test(previousRead) && /limit 1/.test(previousRead) && /e\.treino_exercicio_id = p_treino_exercicio_id/.test(previousRead)],
  ["previous performance is one request per exercise, never per set", /buscarMeuDesempenhoAnteriorNoWorkoutPlayerV2\(exercise\.treinoExercicioId, sessionId\)/.test(player) && !/rows\.map[\s\S]{0,400}buscarMeuDesempenho/.test(player)],
  ["rest timer handoff uses confirmed server timestamp and snapshot rest", /data-rest-started-at=\{selected\.completedAt/.test(player) && /data-rest-duration=\{exercise\.prescribedRest\}/.test(player)],
  ["mobile and accessible controls remain explicit", /aria-invalid/.test(player) && /role="progressbar"/.test(player) && /min-height: 48px/.test(css) && /max-width: 430px/.test(css)],
  ["no workout completion or client countdown was introduced", !/completeWorkoutSession|setInterval|countdown/i.test(player)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
if (failed) process.exit(1);
