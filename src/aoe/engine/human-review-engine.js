import { ConfidenceLevel, HumanReviewStatus, ReasonCodes, Strategy } from "../domain/enums.js";

export function evaluateHumanReview({ selected, confidence, technicalTie, status }) {
  const reasonCodes = [];
  if (!selected) reasonCodes.push(ReasonCodes.HUMAN_REVIEW_REQUIRED);
  if (confidence.level === ConfidenceLevel.LOW) reasonCodes.push(ReasonCodes.LOW_CONFIDENCE);
  if (technicalTie.hasTie) reasonCodes.push(ReasonCodes.TIE_UNRESOLVED);
  if (selected?.model.strategy === Strategy.SPECIALIZATION) reasonCodes.push(ReasonCodes.HUMAN_REVIEW_REQUIRED);
  if (status === "NO_ELIGIBLE_MODEL") reasonCodes.push(ReasonCodes.HUMAN_REVIEW_REQUIRED);
  return {
    status: reasonCodes.length > 0 ? HumanReviewStatus.REQUIRED : HumanReviewStatus.NOT_REQUIRED,
    reasonCodes: [...new Set(reasonCodes)],
  };
}
