import { STUDENT_EXPERIENCE } from "../features/studentExperienceV2/domain/studentExperienceRouteDecision.js";
import { STUDENT_EXPERIENCE_V2_ROUTES } from "../features/studentExperienceV2/domain/studentExperienceV2Contracts.js";
import { buscarMinhaRotaExperienciaAluno } from "../services/studentExperienceRouteService.js";

export const PROFESSIONAL_DEFAULT_ROUTE = "/dashboard";
export const STUDENT_DEFAULT_ROUTE = STUDENT_EXPERIENCE_V2_ROUTES.LEGACY;
export const STUDENT_V2_DEFAULT_ROUTE = STUDENT_EXPERIENCE_V2_ROUTES.HOME;

export async function resolverDestinoPosLogin(
  buscarDecisao = buscarMinhaRotaExperienciaAluno,
  { fallbackRoute = PROFESSIONAL_DEFAULT_ROUTE } = {}
) {
  try {
    const decision = await buscarDecisao();
    if (decision?.experience === STUDENT_EXPERIENCE.PROFESSIONAL) return PROFESSIONAL_DEFAULT_ROUTE;
    if (decision?.experience === STUDENT_EXPERIENCE.V2) return STUDENT_V2_DEFAULT_ROUTE;
    return STUDENT_DEFAULT_ROUTE;
  } catch {
    return fallbackRoute;
  }
}
