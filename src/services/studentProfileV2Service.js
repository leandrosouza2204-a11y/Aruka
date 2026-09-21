import { normalizeStudentProfileV2Payload } from "../features/studentExperienceV2/domain/studentProfileV2.js";
import { buscarUsuarioLogado } from "./authSessionService.js";
import { loadProfileForSession } from "./studentProfileRequestContract.js";
import { supabase } from "./supabase.js";

export async function buscarMeuPerfilAlunoV2({ expectedUserId } = {}) {
  try {
    const { payload, user } = await loadProfileForSession({
      expectedUserId,
      getUser: buscarUsuarioLogado,
      fetchProfile: async () => {
        const { data, error } = await supabase.rpc("get_my_student_profile_v2");
        if (error) throw error;
        return data || {};
      },
    });
    return normalizeStudentProfileV2Payload(payload, user.email || "");
  } catch (error) {
    if (error?.code === "STUDENT_PROFILE_SESSION_CHANGED") throw error;
    const safe = new Error("Não foi possível carregar seu perfil agora.");
    safe.code = "STUDENT_PROFILE_V2_LOAD_FAILED";
    safe.cause = error;
    throw safe;
  }
}
