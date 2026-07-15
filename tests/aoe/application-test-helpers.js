import { createAOEApplicationService, createMemoryLogger, createMemoryMetrics, createMemoryAuditRecorder, PUBLIC_CONTRACT_VERSION } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

export function makeRequest(id = "beginner-3d-60-full-gym", overrides = {}) {
  const scenario = goldenScenarios.find((item) => item.id === id) ?? goldenScenarios[0];
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: overrides.requestId ?? `req_${id}`,
    idempotencyKey: overrides.idempotencyKey ?? `idem_${id}`,
    actor: { actorId: "pro_001", role: "PROFESSIONAL", organizationId: "org_001", ...(overrides.actor ?? {}) },
    student: { studentId: scenario.profile.studentId ?? "student_001", ...scenario.profile, ...(overrides.student ?? {}) },
    options: { maxAlternatives: 2, includeDecisionTrace: false, requireHumanReviewBeforeDelivery: false, activeReleases: [], ...(overrides.options ?? {}) },
    metadata: { source: "ARUKA_APP", locale: "pt-BR", ...(overrides.metadata ?? {}) },
  };
}

export function makeService(options = {}) {
  const logger = createMemoryLogger();
  const metrics = createMemoryMetrics();
  const auditRecorder = createMemoryAuditRecorder();
  let counter = 0;
  const service = createAOEApplicationService({
    logger,
    metrics,
    auditRecorder,
    clock: () => "2026-07-15T12:00:00.000Z",
    idGenerator: (prefix) => `${prefix}_${String(++counter).padStart(4, "0")}`,
    ...options,
  });
  return { service, logger, metrics, auditRecorder };
}
