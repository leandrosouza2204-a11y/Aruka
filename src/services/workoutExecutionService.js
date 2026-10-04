import {
  buildExecutionSavePayload,
  getLocalDateOnly,
  normalizeExecutionSession,
} from "../features/workoutExecution/utils/workoutExecutionSession.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { supabase } from "./supabase.js";
import { recordStudentExperienceEvent } from "./studentExperienceTelemetryService.js";

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

export async function iniciarExecucaoTreino({ treinoId, treinoDiaId = "", idempotencyKey = "", experienceOrigin = "v1" }) {
  await buscarUsuarioLogado();
  if (experienceOrigin === "v2") void recordStudentExperienceEvent("player_start_attempt", { experience: "v2" });
  const { data, error } = await supabase.rpc("start_workout_execution_session", {
    p_treino_id: treinoId,
    p_treino_dia_id: treinoDiaId || null,
    p_idempotency_key: idempotencyKey || createExecutionIdempotencyKey(treinoId, treinoDiaId),
    p_session_date: getLocalDateOnly(),
    p_experience_origin: experienceOrigin,
  });
  if (error) {
    if (experienceOrigin === "v2") void recordStudentExperienceEvent("player_command_error", { experience: "v2", errorCategory: "START_FAILED" });
    throw sanitizeWorkoutExecutionError(error);
  }
  const session = normalizeExecutionSession(data);
  if (experienceOrigin === "v2") void recordStudentExperienceEvent("player_start_confirmed", { experience: "v2", sessionId: session?.id });
  return session;
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

export async function completeWorkoutSet(sessionId, executionExerciseId, setNumber, values = {}) {
  void recordStudentExperienceEvent("player_set_attempt", { experience: "v2", sessionId });
  return callV2Command("complete_workout_execution_set", {
    p_session_id: sessionId,
    p_execution_exercise_id: executionExerciseId,
    p_set_number: setNumber,
    p_values: values,
  });
}

export async function skipWorkoutExercise(sessionId, executionExerciseId) {
  return callV2Command("skip_workout_execution_exercise", {
    p_session_id: sessionId,
    p_execution_exercise_id: executionExerciseId,
  });
}

export async function cancelWorkoutSession(sessionId, reason = null) {
  const result = await callV2Command("cancel_workout_execution_session", { p_session_id: sessionId, p_reason: reason });
  void recordStudentExperienceEvent("player_cancel", { experience: "v2", sessionId });
  return result;
}

export async function completeWorkoutSession(sessionId, shortDurationConfirmed = false, feedback = "") {
  void recordStudentExperienceEvent("player_completion_attempt", { experience: "v2", sessionId });
  const result = await callV2Command("complete_workout_execution_session_v2", {
    p_session_id: sessionId,
    p_short_duration_confirmed: shortDurationConfirmed,
    p_feedback_text: feedback || null,
  });
  void recordStudentExperienceEvent("player_completion_confirmed", { experience: "v2", sessionId });
  return result;
}

async function callV2Command(name, params) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc(name, params);
  if (error) {
    void recordStudentExperienceEvent("player_command_error", {
      experience: "v2",
      sessionId: params.p_session_id,
      errorCategory: String(error?.message || "COMMAND_FAILED").includes("CONFLICT") ? "CONFLICT" : "COMMAND_FAILED",
    });
    throw sanitizeWorkoutExecutionError(error);
  }
  const session = normalizeExecutionSession(data);
  if (name === "complete_workout_execution_set") {
    void recordStudentExperienceEvent("player_set_confirmed", { experience: "v2", sessionId: params.p_session_id });
  }
  return session;
}

export async function getValidWorkoutExecutionHistory(limit = 20) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_valid_workout_execution_history", { p_limit: limit });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return (data || []).map(normalizeExecutionSession);
}

export async function getPreviousPerformance(treinoExercicioId, beforeSessionId = null) {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_previous_workout_performance", {
    p_treino_exercicio_id: treinoExercicioId,
    p_before_session_id: beforeSessionId,
  });
  if (error) throw sanitizeWorkoutExecutionError(error);
  return data?.previousExecution || data?.previous_execution || null;
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
  const knownCode = [
    "SHORT_WORKOUT_CONFIRMATION_REQUIRED",
    "ZERO_COMPLETED_SETS",
    "SESSION_NOT_OWNED",
    "SESSION_NOT_IN_PROGRESS",
    "FEEDBACK_TOO_LONG",
    "FEEDBACK_CONFLICT",
    "SESSION_EXPERIENCE_CONFLICT",
    "V2_ROLLOUT_NOT_ALLOWED",
  ].find((code) => String(error?.message || "").includes(code));
  safe.code = knownCode || "WORKOUT_EXECUTION_FAILED";
  safe.cause = error;
  return safe;
}
