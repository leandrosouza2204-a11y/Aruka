import { normalizeStudentWorkoutPayload } from "../features/studentDailyExperience/utils/studentDailyExperience.js";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarMinhaExperienciaDiariaAluno() {
  await buscarUsuarioLogado();

  const { data, error } = await supabase.rpc("get_my_student_workouts");
  if (error) throw sanitizeStudentDailyError(error);

  return normalizeStudentWorkoutPayload(data || {});
}

export async function getStudentExerciseMediaSignedUrl(treinoExercicioId) {
  const id = String(treinoExercicioId || "").trim();
  if (!id) throw new Error("Exercício obrigatório.");
  await buscarUsuarioLogado();

  const { data, error } = await supabase.rpc("get_my_student_exercise_media", {
    p_treino_exercicio_id: id,
  });
  if (error) throw sanitizeStudentDailyError(error);

  const media = data || {};
  if (media.type !== "uploaded_video" || !media.mediaPath) {
    throw new Error("Vídeo indisponível.");
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(media.bucket || "exercise-media")
    .createSignedUrl(media.mediaPath, media.ttlSeconds || 600);
  if (signError || !signed?.signedUrl) throw sanitizeStudentDailyError(signError);

  return {
    signedUrl: signed.signedUrl,
    expiresIn: media.ttlSeconds || 600,
  };
}

function sanitizeStudentDailyError(error) {
  const sanitized = new Error("Não foi possível carregar sua área agora.");
  sanitized.code = "STUDENT_DAILY_LOAD_FAILED";
  sanitized.cause = error;
  return sanitized;
}
