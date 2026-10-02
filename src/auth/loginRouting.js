import { isProfessionalProfile } from "./professionalAccess.js";
import { isStudentExperienceV2Enabled } from "../features/studentExperienceV2/config/studentExperienceV2Config.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../features/studentExperienceV2/domain/studentExperienceV2Contracts.js";
import {
  resolveStudentExperienceV2Access,
  STUDENT_V2_ACCESS,
} from "../features/studentExperienceV2/guards/studentExperienceV2Access.js";

export const PROFESSIONAL_DEFAULT_ROUTE = "/dashboard";
export const STUDENT_DEFAULT_ROUTE = STUDENT_EXPERIENCE_V2_ROUTES.LEGACY;
export const STUDENT_V2_DEFAULT_ROUTE = STUDENT_EXPERIENCE_V2_ROUTES.HOME;

export async function resolverDestinoPosLogin(
  buscarExperienciaAluno = null,
  buscarPerfil = null,
  { v2Enabled, fallbackRoute = PROFESSIONAL_DEFAULT_ROUTE } = {}
) {
  const shouldUseV2 = isStudentExperienceV2Enabled(v2Enabled);

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
    if (experienciaAluno?.student?.id) {
      const access = resolveStudentExperienceV2Access(experienciaAluno);
      if (shouldUseV2 && access.state === STUDENT_V2_ACCESS.ALLOWED) {
        return STUDENT_V2_DEFAULT_ROUTE;
      }
      return STUDENT_DEFAULT_ROUTE;
    }
  } catch {
    return fallbackRoute;
  }

  return fallbackRoute;
}
