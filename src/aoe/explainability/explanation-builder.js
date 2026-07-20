import { resolveReasons } from "./reason-resolver.js";
import { buildRecommendationSummary } from "./recommendation-summary.js";
import { explainScore } from "./score-explanation.js";
import { explainExclusions } from "./exclusion-explanation.js";
import { explainAlternatives } from "./candidate-explanation.js";
import { explainWarnings } from "./warning-explanation.js";

export function buildExplanation({ decision, risk, conflicts, versions }) {
  const reasons = resolveReasons(decision.reasonCodes ?? []);
  const selectedCodes = [...new Set([...(decision.warnings ?? []), ...(decision.humanReview?.reasonCodes ?? [])])];
  const selectedReasons = resolveReasons(selectedCodes);
  const primarySource = selectedReasons.length
    ? selectedReasons
    : reasons.filter((reason) => ["penalty", "risk", "confidence", "validation"].includes(reason.category));
  const primaryReasons = primarySource.filter((reason) => reason.severity === "critical" || reason.requiresHumanReview || reason.severity === "warning").slice(0, 5);
  const supportingReasons = reasons.filter((reason) => !primaryReasons.includes(reason)).slice(0, 8);
  return {
    summary: buildRecommendationSummary(decision, primaryReasons),
    primaryReasons,
    supportingReasons,
    exclusions: explainExclusions(decision.decisionTrace),
    scoreBreakdown: explainScore(decision.decisionTrace),
    penalties: decision.penalties ?? { items: [], total: 0 },
    warnings: explainWarnings(decision.warnings ?? []),
    confidenceExplanation: {
      score: decision.confidenceScore,
      level: decision.confidenceLevel,
      positiveFactors: decision.confidenceScore >= 75 ? ["Campos críticos presentes", "Catálogo disponível"] : [],
      negativeFactors: reasons.filter((reason) => ["confidence", "penalty", "risk"].includes(reason.category)).map((reason) => reason.title),
      missingData: reasons.some((reason) => reason.code === "MISSING_DATA"),
      conflicts,
      scoreGap: decision.decisionTrace?.technicalTie?.gap ?? null,
      catalogIntegrity: decision.decisionTrace?.catalogChecksumSummary ?? null,
    },
    riskExplanation: {
      score: risk.score,
      level: risk.level,
      factors: risk.factors,
    },
    alternativesExplanation: explainAlternatives(decision),
    humanReviewExplanation: {
      status: decision.humanReview?.status,
      required: decision.humanReview?.required ?? decision.humanReview?.status === "REQUIRED",
      reasons: resolveReasons(decision.humanReview?.reasonCodes ?? []).map((reason) => reason.userDescription),
    },
    versions,
  };
}
