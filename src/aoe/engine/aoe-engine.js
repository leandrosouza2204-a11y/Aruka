import { getVersionRegistry } from "../config/versions.js";
import { RecommendationStatus, ReasonCodes } from "../domain/enums.js";
import { AOEInputError, AOECatalogError } from "../domain/errors.js";
import { activeAplCatalog } from "../fixtures/catalogs/apl-active.catalog.js";
import { normalizeModelCatalog } from "../normalization/normalize-model-catalog.js";
import { normalizeStudentProfile } from "../normalization/normalize-student-profile.js";
import { buildNoEligibleResult } from "../selection/fallback-policy.js";
import { detectTechnicalTie } from "../selection/tiebreakers.js";
import { buildDecisionTrace } from "./decision-trace-builder.js";
import { applyExclusions } from "./exclusion-engine.js";
import { evaluateConfidence } from "./confidence-engine.js";
import { evaluateEligibility } from "./eligibility-engine.js";
import { evaluateHumanReview } from "./human-review-engine.js";
import { rankCandidates } from "./ranking-engine.js";
import { scoreCandidates } from "./scoring-engine.js";
import { selectRecommendation } from "./selection-engine.js";
import { validateDecisionState } from "./validation-engine.js";

function modelSummary(item) {
  if (!item) return null;
  return {
    modelCode: item.model.modelCode,
    aplRelease: item.model.aplRelease,
    split: item.model.split,
    strategy: item.model.strategy,
    experienceLevel: item.model.experienceLevel,
    frequency: item.model.frequency,
    duration: {
      minimum: item.model.minimumSessionDuration,
      maximum: item.model.maximumSessionDuration,
    },
  };
}

function resolveStatus(selected, confidence, humanReview, warnings) {
  if (!selected) return RecommendationStatus.NO_ELIGIBLE_MODEL;
  if (humanReview.status === "REQUIRED") return RecommendationStatus.HUMAN_REVIEW_REQUIRED;
  if (confidence.reasonCodes.includes(ReasonCodes.MISSING_DATA)) return RecommendationStatus.ADDITIONAL_DATA_REQUIRED;
  if (warnings.length > 0) return RecommendationStatus.RECOMMENDED_WITH_WARNINGS;
  return RecommendationStatus.RECOMMENDED;
}

function failureResult(error, versions) {
  if (error instanceof AOEInputError) {
    return {
      status: RecommendationStatus.INVALID_INPUT,
      selectedModel: null,
      alternatives: [],
      compatibilityScore: 0,
      rawScore: 0,
      penalties: { items: [], total: 0 },
      confidenceScore: 0,
      confidenceLevel: "LOW",
      warnings: [],
      reasonCodes: [ReasonCodes.MISSING_DATA],
      humanReview: { status: "REQUIRED", reasonCodes: [ReasonCodes.MISSING_DATA] },
      decisionTrace: { error: error.message },
      versions,
    };
  }
  if (error instanceof AOECatalogError) {
    return {
      status: RecommendationStatus.CATALOG_UNAVAILABLE,
      selectedModel: null,
      alternatives: [],
      compatibilityScore: 0,
      rawScore: 0,
      penalties: { items: [], total: 0 },
      confidenceScore: 0,
      confidenceLevel: "LOW",
      warnings: [],
      reasonCodes: [ReasonCodes.CATALOG_INVALID],
      humanReview: { status: "REQUIRED", reasonCodes: [ReasonCodes.CATALOG_INVALID] },
      decisionTrace: { error: error.message },
      versions,
    };
  }
  throw error;
}

export function runAOEDecision({ profile, catalog = activeAplCatalog, options = {} }) {
  const versions = getVersionRegistry();
  const startedAt = options.now ?? "2026-07-15T00:00:00.000Z";
  const requestId = options.requestId ?? `aoe-${startedAt}`;
  try {
    const normalizedProfile = normalizeStudentProfile(profile);
    const normalizedCatalog = normalizeModelCatalog(catalog, options.activeReleases ?? ["SPRINT_01", "SPRINT_02"]);
    const eligibility = evaluateEligibility(normalizedProfile, normalizedCatalog);
    const { candidates, excluded } = applyExclusions(eligibility);

    if (candidates.length === 0) {
      const reasonCodes = [...new Set(excluded.flatMap((item) => item.reasonCodes))];
      const base = buildNoEligibleResult(reasonCodes, excluded);
      const decisionTrace = buildDecisionTrace({
        requestId,
        startedAt,
        profile: normalizedProfile,
        normalizedCatalog,
        excluded,
        ranked: [],
        technicalTie: { hasTie: false, tiedModels: [] },
        confidence: { score: 0, level: "LOW", dimensions: {}, reasonCodes: base.reasonCodes },
      });
      return { ...base, decisionTrace, versions };
    }

    const scored = scoreCandidates(normalizedProfile, candidates);
    const ranked = rankCandidates(scored);
    const technicalTie = detectTechnicalTie(ranked);
    const { selected, alternatives } = selectRecommendation(ranked);
    validateDecisionState({ ranked, selected, versions });
    const confidence = evaluateConfidence({ profile: normalizedProfile, catalog: normalizedCatalog, ranked, excluded, technicalTie });
    const humanReview = evaluateHumanReview({ selected, confidence, technicalTie });
    const warnings = [...new Set([...(selected?.warnings ?? []), ...confidence.reasonCodes])];
    const exclusionReasonCodes = excluded.flatMap((item) => item.reasonCodes);
    const reasonCodes = [...new Set([...(selected?.reasonCodes ?? []), ...confidence.reasonCodes, ...humanReview.reasonCodes, ...exclusionReasonCodes])];
    const status = resolveStatus(selected, confidence, humanReview, warnings);
    const decisionTrace = buildDecisionTrace({ requestId, startedAt, profile: normalizedProfile, normalizedCatalog, excluded, ranked, technicalTie, confidence });

    return {
      status,
      selectedModel: modelSummary(selected),
      alternatives: alternatives.map(modelSummary),
      compatibilityScore: selected?.finalScore ?? 0,
      rawScore: selected?.rawScore ?? 0,
      penalties: selected?.penalties ?? { items: [], total: 0 },
      confidenceScore: confidence.score,
      confidenceLevel: confidence.level,
      warnings,
      reasonCodes,
      humanReview,
      decisionTrace,
      versions,
    };
  } catch (error) {
    return failureResult(error, versions);
  }
}
