import { buildExplanation } from "./explanation-builder.js";

export function buildRecommendationExplanation({ decisionResult, risk, ambiguity, conflicts, versions }) {
  return buildExplanation({ decision: decisionResult, risk, ambiguity, conflicts, versions });
}
