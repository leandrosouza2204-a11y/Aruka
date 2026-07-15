import { runAOEDecision } from "../engine/aoe-engine.js";
import { createAuditEvent, AuditEventType } from "../audit/index.js";
import { createIdempotencyService } from "../idempotency/index.js";
import { ObservabilityEvent } from "../observability/index.js";
import { PUBLIC_CONTRACT_VERSION } from "../public/public-contract-version.js";
import { createPublicErrorResponse } from "../public/error-response-contract.js";
import { mapPublicRequestToCoreProfile, mapCoreDecisionToPublicResponse, createPersistableDecision } from "../public/public-contract-mapper.js";
import { PublicDecisionStatus } from "../public/public-enums.js";
import { AuthorizationAction, minimizeDecisionTrace, minimizeRequestForAudit, redactForLogs } from "../security/index.js";
import { AOEApplicationError, AOEAuthorizationError, AOEPersistenceError, mapErrorToPublicError } from "./application-errors.js";
import { createReviewRecord } from "./review-orchestrator.js";

export async function orchestrateDecision({ request, context, dependencies, versions }) {
  const { repositories, authorizationPolicy, logger, metrics, auditRecorder, clock, idGenerator, catalogProvider } = dependencies;
  const started = Date.parse(context.startedAt);
  const logBase = { correlationId: context.correlationId, requestId: request.requestId, versions };
  const auth = authorizationPolicy.authorize({ actor: request.actor, action: AuthorizationAction.REQUEST_DECISION, resource: { organizationId: request.actor.organizationId ?? null } });
  if (!auth.allowed) throw new AOEAuthorizationError("Ator não autorizado a solicitar decisão.");
  const idem = createIdempotencyService({ repository: repositories.idempotencyRepository, clock });
  const idemCheck = await idem.check({ request, operation: "REQUEST_DECISION" });
  if (idemCheck.hit) {
    metrics.increment("aoe_idempotency_hit_total");
    logger.info({ event: ObservabilityEvent.AOE_DECISION_IDEMPOTENT_HIT, ...logBase, status: idemCheck.response.status });
    return idemCheck.response;
  }

  await idem.start({ key: idemCheck.key, operation: "REQUEST_DECISION", actorId: request.actor.actorId, requestFingerprint: idemCheck.requestFingerprint });
  auditRecorder.record(createAuditEvent({
    idGenerator,
    type: AuditEventType.DECISION_REQUESTED,
    actor: request.actor,
    resourceType: "AOE_DECISION",
    resourceId: null,
    requestId: request.requestId,
    correlationId: context.correlationId,
    outcome: "STARTED",
    metadata: minimizeRequestForAudit(request),
    occurredAt: context.startedAt,
    versions,
  }));
  logger.info({ event: ObservabilityEvent.AOE_DECISION_REQUESTED, ...logBase, actorRole: request.actor.role });
  metrics.increment("aoe_decision_requests_total");

  try {
    const response = await dependencies.unitOfWork.execute(async () => {
      const now = clock();
      const decisionId = idGenerator("dec");
      const profile = mapPublicRequestToCoreProfile(request);
      const coreDecision = runAOEDecision({
        profile,
        catalogProvider,
        options: {
          requestId: request.requestId,
          now,
          activeReleases: request.options.activeReleases?.length ? request.options.activeReleases : undefined,
        },
      });
      let reviewId = null;
      if (coreDecision.humanReview?.required || request.options.requireHumanReviewBeforeDelivery) reviewId = idGenerator("rev");
      const publicResponse = mapCoreDecisionToPublicResponse({ request, coreDecision, decisionId, reviewId, versions, createdAt: now });
      const decisionRecord = createPersistableDecision({ request, decisionId, reviewId, coreDecision, publicResponse, createdAt: now });
      await repositories.decisionRepository.save(decisionRecord);
      if (request.options.includeDecisionTrace) {
        await repositories.traceRepository.save({ decisionId, trace: minimizeDecisionTrace(coreDecision.decisionTrace), createdAt: now, versions });
      }
      if (reviewId) {
        await repositories.reviewRepository.save(createReviewRecord({ reviewId, decisionId, coreDecision, createdAt: now }));
        logger.info({ event: ObservabilityEvent.AOE_HUMAN_REVIEW_CREATED, ...logBase, decisionId, reviewId, status: PublicDecisionStatus.HUMAN_REVIEW_REQUIRED });
        metrics.increment("aoe_human_review_required_total");
      }
      metrics.increment("aoe_decision_completed_total");
      metrics.increment("aoe_decision_status_total", { status: publicResponse.status });
      if (publicResponse.selectedModel?.modelCode) metrics.increment("aoe_selected_model_total", { modelCode: publicResponse.selectedModel.modelCode });
      metrics.observe("aoe_confidence_score", publicResponse.scores.confidence);
      metrics.observe("aoe_risk_score", publicResponse.scores.risk);
      if (publicResponse.status === PublicDecisionStatus.NO_ELIGIBLE_MODEL) metrics.increment("aoe_no_eligible_model_total");
      if (publicResponse.status === PublicDecisionStatus.ADDITIONAL_DATA_REQUIRED) metrics.increment("aoe_additional_data_required_total");
      auditRecorder.record(createAuditEvent({
        idGenerator,
        type: AuditEventType.DECISION_COMPLETED,
        actor: request.actor,
        resourceType: "AOE_DECISION",
        resourceId: decisionId,
        requestId: request.requestId,
        correlationId: context.correlationId,
        outcome: "SUCCESS",
        metadata: { status: publicResponse.status, selectedModel: publicResponse.selectedModel?.modelCode ?? null },
        occurredAt: now,
        versions,
      }));
      return publicResponse;
    });
    await idem.complete({ key: idemCheck.key, response });
    const durationMs = Date.now() - started;
    metrics.observe("aoe_decision_duration_ms", durationMs);
    logger.info(redactForLogs({ event: ObservabilityEvent.AOE_DECISION_COMPLETED, ...logBase, decisionId: response.decisionId, status: response.status, durationMs, selectedModel: response.selectedModel?.modelCode ?? null }));
    return response;
  } catch (error) {
    await idem.fail({ key: idemCheck.key, error });
    metrics.increment("aoe_decision_failed_total");
    const mapped = error instanceof AOEApplicationError ? error : new AOEPersistenceError();
    const safeError = mapErrorToPublicError(mapped);
    auditRecorder.record(createAuditEvent({
      idGenerator,
      type: AuditEventType.DECISION_FAILED,
      actor: request.actor,
      resourceType: "AOE_DECISION",
      resourceId: null,
      requestId: request.requestId,
      correlationId: context.correlationId,
      outcome: "FAILED",
      metadata: { code: safeError.code },
      occurredAt: clock(),
      versions,
    }));
    logger.error({ event: ObservabilityEvent.AOE_DECISION_FAILED, ...logBase, status: "ERROR", errorCode: safeError.code });
    return createPublicErrorResponse({ requestId: request.requestId, code: safeError.code, message: safeError.message, details: safeError.details, retryable: safeError.retryable, createdAt: clock(), contractVersion: PUBLIC_CONTRACT_VERSION });
  }
}
