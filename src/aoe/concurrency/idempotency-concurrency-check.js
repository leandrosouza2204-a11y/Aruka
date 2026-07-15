import { createAOEApplicationService, PUBLIC_CONTRACT_VERSION } from "../public/index.js";
import { goldenScenarios } from "../fixtures/profiles/golden-scenarios.js";

function request(key, mutation = {}) {
  const scenario = goldenScenarios[0];
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: `conc_${key}`,
    idempotencyKey: key,
    actor: { actorId: "conc_professional", role: "PROFESSIONAL", organizationId: "conc_org" },
    student: { studentId: scenario.profile.studentId, ...scenario.profile, ...mutation },
    options: { maxAlternatives: 2, includeDecisionTrace: false, requireHumanReviewBeforeDelivery: false, activeReleases: [] },
    metadata: { source: "AOE_RC", locale: "pt-BR" },
  };
}

export async function checkIdempotencyConcurrency() {
  const service = createAOEApplicationService();
  const same = await Promise.all(Array.from({ length: 20 }, () => service.requestDecision(request("same_key"))));
  const success = same.filter((item) => item.status !== "ERROR");
  const decisionIds = new Set(success.map((item) => item.decisionId));
  const different = await Promise.all(Array.from({ length: 20 }, (_, index) => service.requestDecision(request("conflict_key", { availableDaysPerWeek: index % 7 + 1 }))));
  return {
    passed: decisionIds.size === 1 && different.some((item) => item.error?.code === "IDEMPOTENCY_CONFLICT"),
    sameKeyDecisionIds: [...decisionIds],
    conflictCount: different.filter((item) => item.error?.code === "IDEMPOTENCY_CONFLICT").length,
  };
}
