import { assertNoSupabaseError } from "./persistence-errors.js";
import { rowToTrace, traceToRow } from "./persistence-mappers.js";

export function createSupabaseDecisionTraceRepository(supabase) {
  return {
    async save(trace) {
      const result = await supabase.from("aoe_decision_traces").insert(traceToRow(trace)).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to save AOE trace.");
      return rowToTrace(result.data);
    },
    async findByDecisionId(decisionId) {
      const result = await supabase.from("aoe_decision_traces").select("*").eq("decision_id", decisionId).maybeSingle();
      assertNoSupabaseError(result, "Failed to find AOE trace.");
      return rowToTrace(result.data);
    },
    async deleteByDecisionId(decisionId) {
      const result = await supabase.from("aoe_decision_traces").delete().eq("decision_id", decisionId);
      assertNoSupabaseError(result, "Failed to delete AOE trace.");
      return true;
    },
  };
}
