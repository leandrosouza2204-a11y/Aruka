export function validateRisk(risk) {
  return {
    valid: Number.isFinite(risk?.score) && risk.score >= 0 && risk.score <= 100 && ["LOW", "MODERATE", "HIGH", "CRITICAL"].includes(risk.level),
    errors: [],
  };
}
