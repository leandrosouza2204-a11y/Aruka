import {
  buildExecutionSavePayload,
  getLocalDateOnly,
  normalizeExecutionSession,
} from "../features/workoutExecution/utils/workoutExecutionSession.js";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarMeuEstadoExecucaoTreino(limit = 5) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_workout_execution_state", {
    p_limit: limit,
  });
  if (error) throw sanitizeWorkoutExecutionError(error);

  const activeSession = normalizeExecutionSession(data?.currentSession || data?.current_session || null);
  return {
    activeSession,
    currentSession: activeSession,
    recentSessions: (data?.recentSessions || data?.recent_sessions || []).map(normalizeExecutionSession),
  };
}

export async function iniciarExecucaoTreino({ treinoId, treinoDiaId = "", idempotencyKey = "" }) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("start_workout_execution_session", {
    p_treino_id: treinoId,
    p_treino_dia_id: treinoDiaId || null,
    p_idempotency_key: idempotencyKey || createExecutionIdempotencyKey(treinoId, treinoDiaId),
    p_session_date: getLocalDateOnly(),
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return normalizeExecutionSession(data);
}

export async function salvarExecucaoTreino(session) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("save_workout_execution", {
    p_session_id: session.id,
    p_exercises: buildExecutionSavePayload(session),
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return normalizeExecutionSession(data);
}

export async function concluirExecucaoTreino(sessionId) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("complete_workout_execution_session", {
    p_session_id: sessionId,
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return normalizeExecutionSession(data);
}

export async function abandonarExecucaoTreino(sessionId) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("abandon_workout_execution_session", {
    p_session_id: sessionId,
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return normalizeExecutionSession(data);
}

export async function buscarHistoricoExecucaoAluno(alunoId, limit = 5) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_student_workout_execution_history", {
    p_aluno_id: alunoId,
    p_limit: limit,
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return (data || []).map(normalizeExecutionSession);
}

export function createExecutionIdempotencyKey(treinoId, treinoDiaId = "") {
  const random = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `workout-execution:${treinoId || "workout"}:${treinoDiaId || "all"}:${random}`.slice(0, 180);
}

function sanitizeWorkoutExecutionError(error) {
  const safe = new Error("Não foi possível atualizar a execução do treino agora.");
  safe.code = "WORKOUT_EXECUTION_FAILED";
  safe.cause = error;
  return safe;
}
