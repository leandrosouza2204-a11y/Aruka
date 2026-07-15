import { createAOEApplicationService } from "../application/index.js";
import { createMemoryDecisionRepository, createMemoryDecisionTraceRepository, createMemoryHumanReviewRepository, createMemoryIdempotencyRepository, createMemoryUnitOfWork } from "../persistence/index.js";
import { createAuthorizationPolicy } from "../security/index.js";
import { createMemoryAuditRecorder } from "../audit/index.js";
import { createMemoryLogger, createMemoryMetrics } from "../observability/index.js";

export { createAOEApplicationService };

export function createMemoryAOEDependencies(options = {}) {
  const decisionRepository = createMemoryDecisionRepository(options.decisionRepository);
  const traceRepository = createMemoryDecisionTraceRepository();
  const reviewRepository = createMemoryHumanReviewRepository();
  const idempotencyRepository = createMemoryIdempotencyRepository();
  return {
    decisionRepository,
    traceRepository,
    reviewRepository,
    idempotencyRepository,
    unitOfWork: createMemoryUnitOfWork([decisionRepository, traceRepository, reviewRepository, idempotencyRepository]),
    authorizationPolicy: createAuthorizationPolicy(),
    logger: createMemoryLogger(),
    metrics: createMemoryMetrics(),
    auditRecorder: createMemoryAuditRecorder(),
  };
}
