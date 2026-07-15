import { createAuthorizationPolicy } from "../../security/index.js";
import { createSupabaseAuditRecorder, createSupabaseDecisionRepository, createSupabaseDecisionTraceRepository, createSupabaseHumanReviewRepository, createSupabaseIdempotencyRepository, createSupabaseUnitOfWork } from "../persistence/index.js";

export function createInfrastructureDependencies({ supabaseClient, logger, metrics, auditRecorder }) {
  return {
    decisionRepository: createSupabaseDecisionRepository(supabaseClient),
    traceRepository: createSupabaseDecisionTraceRepository(supabaseClient),
    reviewRepository: createSupabaseHumanReviewRepository(supabaseClient),
    idempotencyRepository: createSupabaseIdempotencyRepository(supabaseClient),
    unitOfWork: createSupabaseUnitOfWork(),
    authorizationPolicy: createAuthorizationPolicy(),
    logger,
    metrics,
    auditRecorder: auditRecorder ?? createSupabaseAuditRecorder(supabaseClient),
  };
}
