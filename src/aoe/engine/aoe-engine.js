import { getVersionRegistry } from "../config/versions.js";
import { RecommendationStatus, ReasonCodes } from "../domain/enums.js";
import { AOEInputError, AOECatalogError } from "../domain/errors.js";
import { activeAplCatalog } from "../fixtures/catalogs/apl-active.catalog.js";
import { loadAPLCatalog } from "../catalog/index.js";
import { CatalogSource } from "../catalog/catalog-schema.js";
import { buildRecommendationExplanation } from "../explainability/index.js";
import { evaluateDecisionRisk } from "../risk/index.js";
import { evaluateHumanReviewGate } from "../review/index.js";
import { validateHardenedRecommendation } from "../validation/recommendation-hardening-validator.js";
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
    modelVersion: item.model.modelVersion,
    checksum: item.model.checksum,
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
      decisionTrace: { error: error.message, pipeline: ["input-validation"], excluded: [], ranking: [] },
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
      decisionTrace: { error: error.message, pipeline: ["catalog-validation"], excluded: [], ranking: [] },
      versions,
    };
  }
  throw error;
}

function hardenDecision(baseDecision, profile, versions) {
  const { risk, ambiguity, conflicts } = evaluateDecisionRisk({ profile, decision: baseDecision });
  const gate = evaluateHumanReviewGate({ decision: baseDecision, risk, ambiguity, conflicts, profile, selectedModel: baseDecision.selectedModel });
  const reasonCodes = [...new Set([...(baseDecision.reasonCodes ?? []), ...gate.reasonCodes, ...(risk.factors ?? []).map((factor) => factor.reasonCode), ...conflicts.map((conflict) => conflict.reasonCode)])];
  const humanReview = {
    ...(baseDecision.humanReview ?? {}),
    ...gate,
    reasonCodes: gate.reasonCodes,
  };
  let status = baseDecision.status;
  if (baseDecision.status === RecommendationStatus.RECOMMENDED && gate.required) status = RecommendationStatus.HUMAN_REVIEW_REQUIRED;
  if (risk.level === "CRITICAL" && status === RecommendationStatus.RECOMMENDED) status = RecommendationStatus.HUMAN_REVIEW_REQUIRED;
  if (reasonCodes.includes(ReasonCodes.MISSING_DATA)) status = RecommendationStatus.ADDITIONAL_DATA_REQUIRED;
  const hardened = {
    ...baseDecision,
    status,
    confidence: { score: baseDecision.confidenceScore, level: baseDecision.confidenceLevel },
    risk,
    ambiguity,
    conflicts,
    reasonCodes,
    humanReview,
  };
  const explanation = buildRecommendationExplanation({ decisionResult: hardened, risk, ambiguity, conflicts, versions });
  const withExplanation = { ...hardened, explanation };
  withExplanation.decisionTrace = {
    ...(withExplanation.decisionTrace ?? {}),
    explanationTrace: { version: versions.explainability, generated: true, reasonCodes },
    riskAssessment: { version: versions.riskModel, ...risk },
    ambiguityAssessment: ambiguity,
    conflictAssessment: conflicts,
    humanReviewGate: gate,
    validationHardening: { version: versions.validationHardening },
    sensitivityResults: ambiguity.sensitivity,
  };
  const validation = validateHardenedRecommendation(withExplanation);
  const finalDecision = { ...withExplanation, validation };
  if (!validation.valid && finalDecision.status === RecommendationStatus.RECOMMENDED) {
    return { ...finalDecision, status: RecommendationStatus.INVALID_RECOMMENDATION };
  }
  return finalDecision;
}

export function runAOEDecision({ profile, catalog, catalogProvider, options = {} }) {
  const versions = getVersionRegistry();
  const startedAt = options.now ?? "2026-07-15T00:00:00.000Z";
  const requestId = options.requestId ?? `aoe-${startedAt}`;
  try {
    const normalizedProfile = normalizeStudentProfile(profile);
    let catalogContext = {
      catalogSource: catalog ? CatalogSource.PROVIDED : CatalogSource.FIXTURE,
      activeAPLReleases: options.activeReleases ?? ["SPRINT_01", "SPRINT_02"],
    };
    let effectiveCatalog = catalog ?? activeAplCatalog;
    if (options.catalogSource === CatalogSource.APL_RELEASES) {
      const catalogResult = loadAPLCatalog({
        projectRoot: options.projectRoot,
        activeReleases: options.activeReleases ?? ["SPRINT_01", "SPRINT_02"],
        now: startedAt,
      });
      effectiveCatalog = catalogResult.catalog;
      catalogContext = {
        catalogSource: CatalogSource.APL_RELEASES,
        catalogAdapterVersion: catalogResult.versions.catalogAdapter,
        activeAPLReleases: catalogResult.releases.filter((release) => release.status === "ACTIVE").map((release) => `${release.releaseId}@${release.releaseVersion}`),
        catalogGeneratedAt: catalogResult.generatedAt,
        catalogChecksumSummary: {
          valid: catalogResult.statistics.checksumsValid,
          invalid: catalogResult.statistics.checksumsInvalid,
        },
        catalogWarnings: catalogResult.warnings,
      };
    } else if (!catalog && typeof catalogProvider === "function") {
      const provided = catalogProvider();
      effectiveCatalog = provided.catalog ?? provided;
      catalogContext.catalogSource = "PROVIDER";
    }
    const normalizedCatalog = normalizeModelCatalog(effectiveCatalog, options.activeReleases ?? ["SPRINT_01", "SPRINT_02"]);
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
        catalogContext,
      });
      return hardenDecision({ ...base, decisionTrace, versions }, profile, versions);
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
    const decisionTrace = buildDecisionTrace({ requestId, startedAt, profile: normalizedProfile, normalizedCatalog, excluded, ranked, technicalTie, confidence, catalogContext });

    const baseDecision = {
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
    return hardenDecision(baseDecision, profile, versions);
  } catch (error) {
    return hardenDecision(failureResult(error, versions), profile, versions);
  }
}
