export function minimizeDecisionTrace(trace) {
  if (!trace) return null;
  return {
    requestId: trace.requestId,
    pipeline: trace.pipeline ?? [],
    selected: trace.selected ?? null,
    ranking: (trace.ranking ?? []).slice(0, 5),
    excludedCount: trace.excluded?.length ?? 0,
    catalogContext: trace.catalogContext,
    confidence: trace.confidence,
    riskAssessment: trace.riskAssessment,
    ambiguityAssessment: trace.ambiguityAssessment,
    conflictAssessment: trace.conflictAssessment,
    humanReviewGate: trace.humanReviewGate,
    validationHardening: trace.validationHardening,
  };
}

export function minimizeRequestForAudit(request) {
  return {
    requestId: request.requestId,
    actor: { actorId: request.actor?.actorId, role: request.actor?.role, organizationId: request.actor?.organizationId ?? null },
    student: {
      studentId: request.student?.studentId,
      goal: request.student?.goal,
      experienceLevel: request.student?.experienceLevel,
      availableDaysPerWeek: request.student?.availableDaysPerWeek,
      availableMinutesPerSession: request.student?.availableMinutesPerSession,
      equipmentProfile: request.student?.equipmentProfile,
    },
    options: {
      maxAlternatives: request.options?.maxAlternatives,
      includeDecisionTrace: request.options?.includeDecisionTrace,
      activeReleases: request.options?.activeReleases ?? [],
    },
  };
}
