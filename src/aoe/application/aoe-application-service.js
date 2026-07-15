import { getVersionRegistry } from "../config/versions.js";
import { loadAPLCatalog } from "../catalog/index.js";
import { createMemoryDecisionRepository, createMemoryDecisionTraceRepository, createMemoryHumanReviewRepository, createMemoryIdempotencyRepository, createMemoryUnitOfWork } from "../persistence/index.js";
import { createMemoryAuditRecorder } from "../audit/index.js";
import { createAuthorizationPolicy, AuthorizationAction } from "../security/index.js";
import { createNoOpLogger, createNoOpMetrics, ObservabilityEvent } from "../observability/index.js";
import { validateDecisionRequestV1, validateHumanReviewRequestV1, createPublicErrorResponse, getPublicVersionRegistry, PublicErrorCode } from "../public/index.js";
import { createApplicationContext } from "./application-context.js";
import { AOEAuthorizationError, AOEResourceNotFoundError, mapErrorToPublicError } from "./application-errors.js";
import { orchestrateDecision } from "./decision-orchestrator.js";
import { submitReview } from "./review-orchestrator.js";

function defaultClock() {
  return new Date().toISOString();
}

function createDefaultIdGenerator() {
  let counter = 0;
  return (prefix) => `${prefix}_${String(++counter).padStart(6, "0")}`;
}

function buildDependencies(input) {
  const decisionRepository = input.decisionRepository ?? createMemoryDecisionRepository();
  const traceRepository = input.traceRepository ?? createMemoryDecisionTraceRepository();
  const reviewRepository = input.reviewRepository ?? createMemoryHumanReviewRepository();
  const idempotencyRepository = input.idempotencyRepository ?? createMemoryIdempotencyRepository();
  return {
    repositories: { decisionRepository, traceRepository, reviewRepository, idempotencyRepository },
    decisionRepository,
    traceRepository,
    reviewRepository,
    idempotencyRepository,
    unitOfWork: input.unitOfWork ?? createMemoryUnitOfWork([decisionRepository, traceRepository, reviewRepository, idempotencyRepository]),
    authorizationPolicy: input.authorizationPolicy ?? createAuthorizationPolicy(),
    logger: input.logger ?? createNoOpLogger(),
    metrics: input.metrics ?? createNoOpMetrics(),
    auditRecorder: input.auditRecorder ?? createMemoryAuditRecorder(),
    clock: input.clock ?? defaultClock,
    idGenerator: input.idGenerator ?? createDefaultIdGenerator(),
    catalogProvider: input.catalogProvider,
  };
}

export function createAOEApplicationService(options = {}) {
  const deps = buildDependencies(options);
  const versions = getPublicVersionRegistry(getVersionRegistry().aoe);

  async function requestDecision(request) {
    const validation = validateDecisionRequestV1(request);
    if (!validation.valid) {
      deps.metrics.increment("aoe_decision_failed_total", { reason: "invalid_request" });
      deps.logger.warn({ event: ObservabilityEvent.AOE_INVALID_REQUEST, requestId: request?.requestId ?? null, status: "ERROR", versions });
      return createPublicErrorResponse({ requestId: request?.requestId ?? null, code: PublicErrorCode.INVALID_REQUEST, message: "Solicitação inválida.", details: validation.errors, createdAt: deps.clock() });
    }
    const context = createApplicationContext({ request, idGenerator: deps.idGenerator, clock: deps.clock });
    try {
      return await orchestrateDecision({ request, context, dependencies: deps, versions });
    } catch (error) {
      const mapped = mapErrorToPublicError(error);
      return createPublicErrorResponse({ requestId: request.requestId, code: mapped.code, message: mapped.message, details: mapped.details, retryable: mapped.retryable, createdAt: deps.clock() });
    }
  }

  async function getDecision({ decisionId, actor }) {
    const decision = await deps.decisionRepository.findById(decisionId);
    if (!decision) throw new AOEResourceNotFoundError();
    const auth = deps.authorizationPolicy.authorize({ actor, action: AuthorizationAction.READ_DECISION, resource: decision });
    if (!auth.allowed) throw new AOEAuthorizationError();
    return decision.publicResponse;
  }

  async function getDecisionTrace({ decisionId, actor }) {
    const decision = await deps.decisionRepository.findById(decisionId);
    if (!decision) throw new AOEResourceNotFoundError();
    const auth = deps.authorizationPolicy.authorize({ actor, action: AuthorizationAction.READ_TRACE, resource: decision });
    if (!auth.allowed) throw new AOEAuthorizationError();
    return deps.traceRepository.findByDecisionId(decisionId);
  }

  async function submitHumanReview(request) {
    const validation = validateHumanReviewRequestV1(request);
    if (!validation.valid) return createPublicErrorResponse({ requestId: request?.requestId ?? null, code: PublicErrorCode.INVALID_REQUEST, message: "Revisão inválida.", details: validation.errors, createdAt: deps.clock() });
    try {
      return await submitReview({ request, repositories: deps.repositories, authorizationPolicy: deps.authorizationPolicy, auditRecorder: deps.auditRecorder, idGenerator: deps.idGenerator, clock: deps.clock, versions, correlationId: deps.idGenerator("cor") });
    } catch (error) {
      const mapped = mapErrorToPublicError(error);
      return createPublicErrorResponse({ requestId: request.requestId, code: mapped.code, message: mapped.message, details: mapped.details, retryable: mapped.retryable, createdAt: deps.clock() });
    }
  }

  async function getHumanReview({ reviewId, actor }) {
    const review = await deps.reviewRepository.findById(reviewId);
    if (!review) throw new AOEResourceNotFoundError("Revisão não encontrada.", PublicErrorCode.REVIEW_NOT_FOUND);
    const decision = await deps.decisionRepository.findById(review.decisionId);
    const auth = deps.authorizationPolicy.authorize({ actor, action: AuthorizationAction.READ_REVIEW, resource: decision });
    if (!auth.allowed) throw new AOEAuthorizationError();
    return review;
  }

  async function healthCheck() {
    let catalogStatus = "AVAILABLE";
    let activeReleases = [];
    try {
      const catalog = deps.catalogProvider ? deps.catalogProvider() : loadAPLCatalog({ activeReleases: ["SPRINT_01", "SPRINT_02"] });
      activeReleases = catalog.releases?.map((release) => release.releaseId) ?? [];
    } catch {
      catalogStatus = "UNAVAILABLE";
    }
    const status = catalogStatus === "AVAILABLE" ? "HEALTHY" : "DEGRADED";
    deps.logger.info({ event: ObservabilityEvent.AOE_SERVICE_HEALTH_CHECK, status, versions });
    return {
      status,
      aoeVersion: versions.aoeVersion,
      applicationServiceVersion: versions.applicationServiceVersion,
      catalogStatus,
      activeReleases,
      repositories: { decision: "READY", trace: "READY", review: "READY", idempotency: "READY" },
      timestamp: deps.clock(),
    };
  }

  return Object.freeze({ requestDecision, getDecision, getDecisionTrace, submitHumanReview, getHumanReview, healthCheck, dependencies: deps });
}
