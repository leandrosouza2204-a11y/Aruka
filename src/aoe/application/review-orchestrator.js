import { PublicErrorCode, PublicReviewStatus } from "../public/public-enums.js";
import { createHumanReviewResponseV1 } from "../public/review-response-contract.js";
import { AuditEventType, createAuditEvent } from "../audit/index.js";
import { AuthorizationAction } from "../security/index.js";
import { AOEAuthorizationError, AOEResourceNotFoundError, AOEReviewTransitionError } from "./application-errors.js";

const ALLOWED_TRANSITIONS = new Map([
  [PublicReviewStatus.PENDING, new Set([PublicReviewStatus.APPROVED, PublicReviewStatus.APPROVED_WITH_ADJUSTMENTS, PublicReviewStatus.REJECTED, PublicReviewStatus.ADDITIONAL_INFORMATION_REQUIRED])],
  [PublicReviewStatus.ADDITIONAL_INFORMATION_REQUIRED, new Set([PublicReviewStatus.PENDING])],
]);

export function createReviewRecord({ reviewId, decisionId, coreDecision, createdAt }) {
  return {
    reviewId,
    decisionId,
    status: PublicReviewStatus.PENDING,
    required: true,
    blocking: coreDecision.humanReview?.blocking ?? false,
    reasonCodes: coreDecision.humanReview?.reasonCodes ?? coreDecision.reasonCodes ?? [],
    checklist: coreDecision.humanReview?.checklist ?? [],
    reviewerId: null,
    reviewerRole: null,
    adjustments: [],
    notes: "",
    createdAt,
    updatedAt: createdAt,
    completedAt: null,
  };
}

export async function submitReview({ request, repositories, authorizationPolicy, auditRecorder, idGenerator, clock, versions, correlationId }) {
  const review = await repositories.reviewRepository.findById(request.reviewId);
  if (!review) throw new AOEResourceNotFoundError("Revisão não encontrada.", PublicErrorCode.REVIEW_NOT_FOUND);
  const decision = await repositories.decisionRepository.findById(review.decisionId);
  const auth = authorizationPolicy.authorize({ actor: request.actor, action: AuthorizationAction.SUBMIT_REVIEW, resource: decision });
  if (!auth.allowed) throw new AOEAuthorizationError("Ator não autorizado a revisar esta decisão.");
  const allowed = ALLOWED_TRANSITIONS.get(review.status);
  if (!allowed?.has(request.decision)) throw new AOEReviewTransitionError();
  if (review.checklist.length > 0 && (!Array.isArray(request.checklist) || request.checklist.length < review.checklist.length)) {
    throw new AOEReviewTransitionError("Checklist obrigatório incompleto.");
  }
  const now = clock();
  const updated = {
    ...review,
    status: request.decision,
    reviewerId: request.actor.actorId,
    reviewerRole: request.actor.role,
    adjustments: request.adjustments ?? [],
    notes: request.notes ?? "",
    updatedAt: now,
    completedAt: request.decision === PublicReviewStatus.PENDING ? null : now,
  };
  await repositories.reviewRepository.update(updated);
  auditRecorder.record(createAuditEvent({
    idGenerator,
    type: AuditEventType.REVIEW_SUBMITTED,
    actor: request.actor,
    resourceType: "HUMAN_REVIEW",
    resourceId: review.reviewId,
    requestId: request.requestId,
    correlationId,
    outcome: "SUCCESS",
    metadata: { status: updated.status },
    occurredAt: now,
    versions,
  }));
  return createHumanReviewResponseV1({ requestId: request.requestId, review: updated, contractVersion: versions.publicContractVersion });
}
