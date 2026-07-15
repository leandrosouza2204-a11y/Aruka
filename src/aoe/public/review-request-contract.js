import { PUBLIC_CONTRACT_VERSION } from "./public-contract-version.js";
import { PublicActorRole, PublicReviewStatus } from "./public-enums.js";

const REVIEW_DECISIONS = new Set([
  PublicReviewStatus.APPROVED,
  PublicReviewStatus.APPROVED_WITH_ADJUSTMENTS,
  PublicReviewStatus.REJECTED,
  PublicReviewStatus.ADDITIONAL_INFORMATION_REQUIRED,
  PublicReviewStatus.PENDING,
]);

export function validateHumanReviewRequestV1(request) {
  const errors = [];
  if (!request || typeof request !== "object" || Array.isArray(request)) return { valid: false, errors: [{ field: "$", message: "request must be an object" }] };
  if (request.contractVersion !== PUBLIC_CONTRACT_VERSION) errors.push({ field: "contractVersion", message: "unsupported contract version" });
  if (typeof request.requestId !== "string" || request.requestId.length < 1 || request.requestId.length > 100) errors.push({ field: "requestId", message: "invalid requestId" });
  if (typeof request.idempotencyKey !== "string" || request.idempotencyKey.length < 8 || request.idempotencyKey.length > 200) errors.push({ field: "idempotencyKey", message: "invalid idempotencyKey" });
  if (!request.actor || ![PublicActorRole.PROFESSIONAL, PublicActorRole.ADMIN].includes(request.actor.role)) errors.push({ field: "actor.role", message: "only PROFESSIONAL or ADMIN can submit review" });
  if (typeof request.reviewId !== "string" || !request.reviewId.startsWith("rev_")) errors.push({ field: "reviewId", message: "invalid reviewId" });
  if (!REVIEW_DECISIONS.has(request.decision)) errors.push({ field: "decision", message: "invalid review decision" });
  if (request.notes && request.notes.length > 500) errors.push({ field: "notes", message: "notes exceeds maximum length" });
  if (request.notes && /(diagnóstico|diagnostico|doença|doenca|cid|laudo)/i.test(request.notes)) errors.push({ field: "notes", message: "contains unsupported free medical content" });
  return { valid: errors.length === 0, errors };
}
