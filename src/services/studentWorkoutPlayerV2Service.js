import {
  normalizePreviousPerformance,
  normalizeWorkoutPlayerV2,
} from "../features/studentExperienceV2/domain/studentWorkoutPlayerV2.js";
import { completeWorkoutSession, completeWorkoutSet, getPreviousPerformance } from "./workoutExecutionService.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { supabase } from "./supabase.js";

export async function buscarMeuWorkoutPlayerV2(sessionId) {
  const id = String(sessionId || "").trim();
  if (!id) return null;
  await buscarUsuarioLogado();
  const requestStartedAt = monotonicNow();
  const { data, error } = await supabase.rpc("get_my_workout_player_v2", { p_session_id: id });
  const responseReceivedAt = monotonicNow();
  if (error) throw sanitizePlayerError(error);
  return normalizeWorkoutPlayerV2(data ? {
    ...data,
    serverRoundTripMs: Math.max(0, responseReceivedAt - requestStartedAt),
    serverReceivedMonotonicMs: responseReceivedAt,
  } : data);
}

function monotonicNow() {
  return typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : 0;
}

export async function concluirMinhaSerieNoWorkoutPlayerV2(sessionId, executionExerciseId, setNumber, values) {
  return completeWorkoutSet(sessionId, executionExerciseId, setNumber, values);
}

export async function concluirMeuWorkoutPlayerV2(sessionId, shortDurationConfirmed, feedback) {
  return completeWorkoutSession(sessionId, shortDurationConfirmed, feedback);
}

export async function buscarMeuDesempenhoAnteriorNoWorkoutPlayerV2(treinoExercicioId, sessionId) {
  if (!String(treinoExercicioId || "").trim()) return null;
  return normalizePreviousPerformance(await getPreviousPerformance(treinoExercicioId, sessionId));
}

function sanitizePlayerError(error) {
  const safe = new Error("Não foi possível carregar este treino agora.");
  safe.code = "STUDENT_WORKOUT_PLAYER_LOAD_FAILED";
  safe.cause = error;
  return safe;
}
