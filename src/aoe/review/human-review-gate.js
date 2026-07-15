import { buildReviewChecklist } from "./review-checklist.js";
import { buildReviewDecision } from "./review-decision.js";
import { reviewReasonCodes } from "./review-policy.js";

export function evaluateHumanReviewGate({ decision, risk, ambiguity, conflicts }) {
  const reasonCodes = reviewReasonCodes({ decision, risk, ambiguity, conflicts });
  const blocking = risk.level === "CRITICAL" || reasonCodes.includes("MISSING_DATA") || conflicts.some((conflict) => conflict.severity === "critical");
  const required = blocking || reasonCodes.length > 0;
  return buildReviewDecision({
    required,
    blocking,
    reasonCodes,
    checklist: buildReviewChecklist(reasonCodes),
  });
}
