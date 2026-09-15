import { normalizeStudentHomeV2Payload } from "../features/studentExperienceV2/domain/studentHomeV2.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { supabase } from "./supabase.js";

export async function buscarMinhaHomeAlunoV2() {
  await buscarUsuarioLogado();
  const { data, error } = await supabase.rpc("get_my_student_home_v2");
  if (error) throw sanitizeStudentHomeError(error);
  return normalizeStudentHomeV2Payload(data || {});
}

function sanitizeStudentHomeError(error) {
  const safe = new Error("Não foi possível carregar sua área agora.");
  safe.code = "STUDENT_HOME_V2_LOAD_FAILED";
  safe.cause = error;
  return safe;
}
