export function validateDecisionRisk(decision) {
  return [
    { id: "RSK-001", valid: decision.risk.score >= 0 && decision.risk.score <= 100, message: "Risk score range." },
    { id: "RSK-002", valid: decision.risk.level !== "HIGH" && decision.risk.level !== "CRITICAL" || decision.humanReview.required, message: "High or critical risk requires human review." },
    { id: "RSK-003", valid: decision.risk.level !== "CRITICAL" || decision.status !== "RECOMMENDED", message: "Critical risk cannot be recommended automatically." },
  ];
}
