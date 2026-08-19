export const PROFESSIONAL_DEFAULT_ROUTE = "/dashboard";
export const STUDENT_DEFAULT_ROUTE = "/minha-area";

export async function resolverDestinoPosLogin(buscarExperienciaAluno = null) {
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
