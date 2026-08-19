import { normalizeStudentWorkoutPayload } from "../features/studentDailyExperience/utils/studentDailyExperience.js";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarMinhaExperienciaDiariaAluno() {
  await buscarUsuarioLogado();

  const { data, error } = await supabase.rpc("get_my_student_workouts");
  if (error) throw sanitizeStudentDailyError(error);

  return normalizeStudentWorkoutPayload(data || {});
}

function sanitizeStudentDailyError(error) {
  const sanitized = new Error("Não foi possível carregar sua área agora.");
  sanitized.code = "STUDENT_DAILY_LOAD_FAILED";
  sanitized.cause = error;
  return sanitized;
}
