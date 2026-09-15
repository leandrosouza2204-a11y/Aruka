import {
  normalizeStudentTrainingLibraryV2,
  normalizeStudentWorkoutDetailV2,
} from "../features/studentExperienceV2/domain/studentTrainingLibraryV2.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { supabase } from "./supabase.js";

export async function buscarMinhaBibliotecaTreinosV2() {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_student_training_library_v2");
  if (error) throw sanitizeLibraryError(error);
  return normalizeStudentTrainingLibraryV2(data || {});
}

export async function buscarDetalhesMeuTreinoV2(treinoDiaId) {
  const id = String(treinoDiaId || "").trim();
  if (!id) return null;
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_student_workout_detail_v2", {
    p_treino_dia_id: id,
  });
  if (error) throw sanitizeDetailError(error);
  return normalizeStudentWorkoutDetailV2(data);
}

function sanitizeLibraryError(error) {
  const safe = new Error("Não foi possível carregar seus treinos agora.");
  safe.code = "STUDENT_TRAINING_LIBRARY_LOAD_FAILED";
  safe.cause = error;
  return safe;
}

function sanitizeDetailError(error) {
  const safe = new Error("Não foi possível carregar os detalhes deste treino.");
  safe.code = "STUDENT_WORKOUT_DETAIL_LOAD_FAILED";
  safe.cause = error;
  return safe;
}
