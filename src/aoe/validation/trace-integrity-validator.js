export function validateTraceIntegrity(decision) {
  const trace = decision.decisionTrace ?? {};
  return [
    { id: "TRC-001", valid: Array.isArray(trace.pipeline) && trace.pipeline.length > 0, message: "Pipeline trace present." },
    { id: "TRC-002", valid: trace.riskAssessment !== undefined, message: "Risk assessment trace present." },
    { id: "TRC-003", valid: trace.explanationTrace !== undefined, message: "Explanation trace present." },
    { id: "TRC-004", valid: trace.humanReviewGate !== undefined, message: "Human review gate trace present." },
  ];
}
