import { PublicDecisionStatus } from "./public-enums.js";

const STATUS_MAP = {
  RECOMMENDED: PublicDecisionStatus.RECOMMENDED,
  RECOMMENDED_WITH_WARNINGS: PublicDecisionStatus.RECOMMENDED_WITH_WARNINGS,
  HUMAN_REVIEW_REQUIRED: PublicDecisionStatus.HUMAN_REVIEW_REQUIRED,
  ADDITIONAL_DATA_REQUIRED: PublicDecisionStatus.ADDITIONAL_DATA_REQUIRED,
  NO_ELIGIBLE_MODEL: PublicDecisionStatus.NO_ELIGIBLE_MODEL,
  INVALID_INPUT: PublicDecisionStatus.INVALID_REQUEST,
  CATALOG_UNAVAILABLE: PublicDecisionStatus.SERVICE_UNAVAILABLE,
  INVALID_RECOMMENDATION: PublicDecisionStatus.DECISION_FAILED,
};

export function mapPublicRequestToCoreProfile(request) {
  const student = request.student;
  return {
    studentId: student.studentId,
    sex: student.sex,
    goal: student.goal,
    experienceLevel: student.experienceLevel,
    availableDaysPerWeek: student.availableDaysPerWeek,
    availableMinutesPerSession: student.availableMinutesPerSession,
    equipmentProfile: student.equipmentProfile,
    availableEquipment: student.availableEquipment ?? [],
    constraints: student.constraints ?? [],
    preferences: student.preferences ?? {},
    recovery: student.recovery ?? {},
    adherence: student.adherence ?? {},
    specializationInterest: student.specializationInterest ?? null,
  };
}

export function mapCoreDecisionToPublicResponse({ request, coreDecision, decisionId, reviewId, versions, createdAt }) {
  const includeTrace = request.options?.includeDecisionTrace === true;
  const maxAlternatives = Math.max(0, Math.min(5, request.options?.maxAlternatives ?? 2));
  return {
    contractVersion: versions.publicContractVersion,
    publicContractVersion: versions.publicContractVersion,
    applicationServiceVersion: versions.applicationServiceVersion,
    aoeVersion: versions.aoeVersion,
    requestId: request.requestId,
    decisionId,
    status: STATUS_MAP[coreDecision.status] ?? PublicDecisionStatus.DECISION_FAILED,
    selectedModel: coreDecision.selectedModel ? {
      modelCode: coreDecision.selectedModel.modelCode,
      modelVersion: coreDecision.selectedModel.modelVersion,
      aplRelease: coreDecision.selectedModel.aplRelease,
      split: coreDecision.selectedModel.split,
      strategy: coreDecision.selectedModel.strategy,
      specializationTarget: coreDecision.selectedModel.specializationTarget ?? null,
    } : null,
    alternatives: (coreDecision.alternatives ?? []).slice(0, maxAlternatives).map((item) => ({
      modelCode: item.modelCode,
      modelVersion: item.modelVersion,
      aplRelease: item.aplRelease,
      split: item.split,
      strategy: item.strategy,
    })),
    scores: {
      compatibility: coreDecision.compatibilityScore ?? 0,
      raw: coreDecision.rawScore ?? 0,
      confidence: coreDecision.confidence?.score ?? coreDecision.confidenceScore ?? 0,
      risk: coreDecision.risk?.score ?? 0,
    },
    classification: {
      confidenceLevel: coreDecision.confidence?.level ?? coreDecision.confidenceLevel ?? "LOW",
      riskLevel: coreDecision.risk?.level ?? "LOW",
      ambiguityLevel: coreDecision.ambiguity?.level ?? "NONE",
    },
    explanation: {
      summary: coreDecision.explanation?.summary ?? "Decisão AOE concluída.",
      primaryReasons: coreDecision.explanation?.primaryReasons ?? [],
      warnings: coreDecision.explanation?.warnings ?? [],
      nextActions: coreDecision.explanation?.nextActions ?? [],
    },
    humanReview: {
      required: coreDecision.humanReview?.required ?? coreDecision.humanReview?.status === "REQUIRED",
      blocking: coreDecision.humanReview?.blocking ?? false,
      reviewId,
      status: reviewId ? "PENDING" : null,
      checklist: coreDecision.humanReview?.checklist ?? [],
    },
    versions: { ...coreDecision.versions, ...versions },
    createdAt,
    links: {},
    ...(includeTrace ? { decisionTrace: coreDecision.decisionTrace } : {}),
  };
}

export function createPersistableDecision({ request, decisionId, reviewId, coreDecision, publicResponse, createdAt }) {
  return {
    decisionId,
    requestId: request.requestId,
    actorId: request.actor.actorId,
    studentId: request.student.studentId,
    organizationId: request.actor.organizationId ?? null,
    status: publicResponse.status,
    selectedModel: publicResponse.selectedModel,
    alternatives: publicResponse.alternatives,
    scores: publicResponse.scores,
    confidence: publicResponse.classification.confidenceLevel,
    risk: publicResponse.classification.riskLevel,
    ambiguity: publicResponse.classification.ambiguityLevel,
    warnings: publicResponse.explanation.warnings,
    humanReviewRequired: publicResponse.humanReview.required,
    humanReviewId: reviewId,
    versions: publicResponse.versions,
    createdAt,
    updatedAt: createdAt,
    publicResponse,
    traceReference: request.options?.includeDecisionTrace ? { decisionId } : null,
    internalStatus: coreDecision.status,
  };
}
