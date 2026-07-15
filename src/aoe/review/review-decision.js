export function buildReviewDecision({ required, blocking, reasonCodes, checklist }) {
  const status = blocking ? "BLOCKING" : required ? "REQUIRED" : "NOT_REQUIRED";
  return {
    required,
    blocking,
    status,
    reasonCodes,
    reasons: reasonCodes,
    checklist,
    suggestedActions: checklist.map((item) => item.label),
  };
}
