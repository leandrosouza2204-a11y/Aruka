const clone = (value) => value == null ? value : structuredClone(value);

export function createMemoryHumanReviewRepository() {
  const byId = new Map();
  return {
    async save(review) {
      if (byId.has(review.reviewId)) throw new Error("review already exists");
      byId.set(review.reviewId, clone(review));
      return clone(review);
    },
    async findById(reviewId) {
      return clone(byId.get(reviewId) ?? null);
    },
    async findByDecisionId(decisionId) {
      return clone([...byId.values()].find((item) => item.decisionId === decisionId) ?? null);
    },
    async update(review) {
      if (!byId.has(review.reviewId)) throw new Error("review not found");
      byId.set(review.reviewId, clone(review));
      return clone(review);
    },
    snapshot() {
      return clone([...byId.values()]);
    },
    restore(items) {
      byId.clear();
      for (const item of items) byId.set(item.reviewId, clone(item));
    },
  };
}
