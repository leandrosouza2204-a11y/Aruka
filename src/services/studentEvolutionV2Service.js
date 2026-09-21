import { normalizeStudentEvolutionPayload } from "../features/studentExperienceV2/domain/studentEvolutionV2.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { getValidWorkoutExecutionHistory } from "./workoutExecutionService.js";
import { supabase } from "./supabase.js";

export async function buscarMinhaFrequenciaAlunoV2() {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_student_workout_frequency_v2");
  if (error) throw safeEvolutionError("STUDENT_EVOLUTION_FREQUENCY_FAILED", error);
  return normalizeStudentEvolutionPayload(data || {});
}

export async function buscarMinhasAvaliacoesAlunoV2() {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_student_assessments_v2");
  if (error) throw safeEvolutionError("STUDENT_EVOLUTION_ASSESSMENTS_FAILED", error);
  return normalizeStudentEvolutionPayload({ assessments: data || {} }).assessments;
}

export async function buscarMeuHistoricoValidoV2(limit = 20) {
  try {
    return await getValidWorkoutExecutionHistory(limit);
  } catch (error) {
    throw safeEvolutionError("STUDENT_EVOLUTION_HISTORY_FAILED", error);
  }
}

function safeEvolutionError(code, cause) {
  const error = new Error("Não foi possível carregar estes dados agora.");
  error.code = code;
  error.cause = cause;
  return error;
}
