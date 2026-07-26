import {
  WORKOUT_TEMPLATE_SCHEMA_VERSION,
  assertTemplateDataIsSanitized,
  canonicalTemplateToPreviewDays,
  canonicalTemplateToWorkout,
  countTemplateExercises,
  inferSplitFromWorkout,
  normalizeCanonicalTemplateData,
  validateCanonicalTemplateData,
  workoutToCanonicalTemplateData,
} from "./workoutDataContract.js";

export const TEMPLATE_SCHEMA_VERSION = WORKOUT_TEMPLATE_SCHEMA_VERSION;

export const GENEROS_REFERENCIA_MODELO = ["Masculino", "Feminino", "Unissex"];
export const DIVISOES_MODELO_PESSOAL = [
  "ABC",
  "ABCD",
  "ABCDE",
  "Full Body",
  "Upper/Lower",
  "Outro",
];

export function sanitizeWorkoutForTemplate(treino) {
  return workoutToCanonicalTemplateData(treino);
}

export function validateTemplateData(templateData) {
  return validateCanonicalTemplateData(templateData);
}

export { assertTemplateDataIsSanitized };

export function templateDataToWorkout(template, opcoes = {}) {
  return canonicalTemplateToWorkout(template, opcoes);
}

export function templateDataToPreviewDays(templateData) {
  return canonicalTemplateToPreviewDays(templateData);
}

export { inferSplitFromWorkout, countTemplateExercises, normalizeCanonicalTemplateData };
