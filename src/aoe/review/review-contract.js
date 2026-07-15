export function validateReview(review) {
  const valid = typeof review?.required === "boolean" && typeof review?.blocking === "boolean" && Array.isArray(review.checklist);
  return { valid, errors: valid ? [] : ["Invalid review gate output"] };
}
