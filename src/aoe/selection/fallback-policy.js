import { RecommendationStatus, ReasonCodes } from "../domain/enums.js";

export function buildNoEligibleResult(reasonCodes, excluded) {
  return {
    status: RecommendationStatus.NO_ELIGIBLE_MODEL,
    selectedModel: null,
    alternatives: [],
    compatibilityScore: 0,
    rawScore: 0,
    penalties: { items: [], total: 0 },
    confidenceScore: 0,
    confidenceLevel: "LOW",
    warnings: [],
    reasonCodes: [...new Set([ReasonCodes.HUMAN_REVIEW_REQUIRED, ...reasonCodes])],
    humanReview: { status: "REQUIRED", reasonCodes: [ReasonCodes.HUMAN_REVIEW_REQUIRED] },
    excluded,
  };
}
