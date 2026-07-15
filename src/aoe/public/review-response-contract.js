export function createHumanReviewResponseV1({ requestId, review, contractVersion }) {
  return {
    contractVersion,
    requestId,
    reviewId: review.reviewId,
    decisionId: review.decisionId,
    status: review.status,
    blocking: review.blocking,
    completedAt: review.completedAt ?? null,
    nextActions: review.status === "ADDITIONAL_INFORMATION_REQUIRED" ? ["Solicitar dados adicionais antes da entrega."] : [],
  };
}
