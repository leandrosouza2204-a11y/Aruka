import { isProfessionalProfile } from "./professionalAccess.js";

export const PROFESSIONAL_DEFAULT_ROUTE = "/dashboard";
export const STUDENT_DEFAULT_ROUTE = "/minha-area";

export async function resolverDestinoPosLogin(buscarExperienciaAluno = null, buscarPerfil = null) {
  try {
    if (!buscarPerfil) {
      ({ buscarPerfilUsuario: buscarPerfil } = await import("../services/perfisService.js"));
    }

    if (isProfessionalProfile(await buscarPerfil())) {
      return PROFESSIONAL_DEFAULT_ROUTE;
    }
  } catch {
    // A ausencia temporaria do perfil nao deve bloquear a verificacao de aluno.
  }

  try {
    if (!buscarExperienciaAluno) {
      ({ buscarMinhaExperienciaDiariaAluno: buscarExperienciaAluno } = await import(
        "../services/studentDailyExperienceService.js"
      ));
    }
    const experienciaAluno = await buscarExperienciaAluno();
    if (experienciaAluno?.student?.id) return STUDENT_DEFAULT_ROUTE;
  } catch {
    return PROFESSIONAL_DEFAULT_ROUTE;
  }

  return PROFESSIONAL_DEFAULT_ROUTE;
}
