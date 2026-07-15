export function validateOutputConsistency(decision) {
  const checks = [];
  const add = (id, valid, message) => checks.push({ id, valid, message });
  add("OUT-001", decision.status !== "RECOMMENDED" || Boolean(decision.selectedModel), "Recommended output must have selected model.");
  add("OUT-002", decision.compatibilityScore >= 0 && decision.compatibilityScore <= 100, "Compatibility score must be 0-100.");
  add("OUT-003", decision.rawScore >= 0 && decision.rawScore <= 100, "Raw score must be 0-100.");
  add("OUT-004", (decision.penalties?.total ?? 0) >= -20, "Penalty total must not be below -20.");
  add("OUT-005", decision.confidence?.score >= 0 && decision.confidence?.score <= 100, "Confidence must be 0-100.");
  add("OUT-006", decision.risk?.score >= 0 && decision.risk?.score <= 100, "Risk must be 0-100.");
  add("OUT-007", JSON.stringify(decision).length > 0, "Output must be serializable.");
  return checks;
}
