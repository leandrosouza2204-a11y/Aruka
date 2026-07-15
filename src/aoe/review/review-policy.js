export function reviewReasonCodes({ decision, risk, ambiguity, conflicts }) {
  const codes = new Set(decision.humanReview?.reasonCodes ?? []);
  if (decision.confidenceLevel === "LOW") codes.add("LOW_CONFIDENCE");
  if (risk.level === "HIGH" || risk.level === "CRITICAL") codes.add("HIGH_DECISION_RISK");
  if (decision.selectedModel?.strategy === "SPECIALIZATION") codes.add("HUMAN_REVIEW_REQUIRED");
  if ((decision.reasonCodes ?? []).includes("EQUIPMENT_ADAPTATION_REQUIRED")) codes.add("EQUIPMENT_ADAPTATION_REQUIRED");
  if ((decision.reasonCodes ?? []).includes("RECOVERY_AT_LIMIT")) codes.add("RECOVERY_AT_LIMIT");
  if ((decision.reasonCodes ?? []).includes("TIME_AT_LIMIT")) codes.add("TIME_AT_LIMIT");
  if ((decision.reasonCodes ?? []).includes("TIE_UNRESOLVED")) codes.add("TIE_UNRESOLVED");
  if (ambiguity.level === "HIGH") codes.add("AMBIGUOUS_SELECTION");
  if ((decision.reasonCodes ?? []).includes("MISSING_DATA")) codes.add("MISSING_DATA");
  if (conflicts.some((conflict) => conflict.severity === "critical")) codes.add("CRITICAL_CONSTRAINT");
  return [...codes];
}
