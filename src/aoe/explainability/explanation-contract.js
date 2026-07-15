export function validateExplanation(explanation) {
  const required = ["summary", "primaryReasons", "supportingReasons", "exclusions", "scoreBreakdown", "penalties", "warnings", "confidenceExplanation", "riskExplanation", "alternativesExplanation", "humanReviewExplanation", "versions"];
  const missing = required.filter((key) => explanation[key] === undefined || explanation[key] === null);
  return { valid: missing.length === 0 && String(explanation.summary ?? "").trim().length > 0, missing };
}
