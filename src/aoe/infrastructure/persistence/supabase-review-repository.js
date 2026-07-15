import { assertNoSupabaseError } from "./persistence-errors.js";
import { reviewToRow, rowToReview } from "./persistence-mappers.js";

export function createSupabaseHumanReviewRepository(supabase) {
  return {
    async save(review) {
      const result = await supabase.from("aoe_human_reviews").insert(reviewToRow(review)).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to save AOE review.");
      return rowToReview(result.data);
    },
    async findById(reviewId) {
      const result = await supabase.from("aoe_human_reviews").select("*").eq("id", reviewId).maybeSingle();
      assertNoSupabaseError(result, "Failed to find AOE review.");
      return rowToReview(result.data);
    },
    async findByDecisionId(decisionId) {
      const result = await supabase.from("aoe_human_reviews").select("*").eq("decision_id", decisionId).maybeSingle();
      assertNoSupabaseError(result, "Failed to find AOE review by decision.");
      return rowToReview(result.data);
    },
    async update(review) {
      const result = await supabase.from("aoe_human_reviews").update(reviewToRow(review)).eq("id", review.reviewId).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to update AOE review.");
      return rowToReview(result.data);
    },
  };
}
