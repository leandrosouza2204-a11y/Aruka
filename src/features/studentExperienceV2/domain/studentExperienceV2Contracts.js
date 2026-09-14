export const STUDENT_EXPERIENCE_V2_ROUTES = Object.freeze({
  HOME: "/minha-area/inicio",
  TRAINING: "/minha-area/treinos",
  EVOLUTION: "/minha-area/evolucao",
  PROFILE: "/minha-area/perfil",
  WORKOUT: "/workout/:sessionId",
  LEGACY: "/minha-area",
});

export const SHORT_WORKOUT_THRESHOLD_SECONDS = 300;

export const VALID_METRIC_SESSION_STATUS = "completed";
export const INVALID_METRIC_SESSION_STATUSES = Object.freeze(["in_progress", "cancelled", "abandoned"]);

export function isValidMetricSession(session = {}) {
  return session.status === VALID_METRIC_SESSION_STATUS;
}

export const TRACKING_MODEL_DECISION = Object.freeze({
  storage: "treino_exercicios.tracking_config jsonb with execution snapshot",
  schemaImpact: true,
  migrationRequired: true,
  defaults: Object.freeze({ load: true, reps: true, rir: false, rpe: false, duration: false, distance: false }),
});
