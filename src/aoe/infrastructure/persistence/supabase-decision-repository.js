import { assertNoSupabaseError } from "./persistence-errors.js";
import { decisionToRow, rowToDecision } from "./persistence-mappers.js";

export function createSupabaseDecisionRepository(supabase) {
  return {
    async save(decision) {
      const result = await supabase.from("aoe_decisions").insert(decisionToRow(decision)).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to save AOE decision.");
      return rowToDecision(result.data);
    },
    async findById(decisionId) {
      const result = await supabase.from("aoe_decisions").select("*").eq("id", decisionId).maybeSingle();
      assertNoSupabaseError(result, "Failed to find AOE decision.");
      return rowToDecision(result.data);
    },
    async findByRequestId(requestId) {
      const result = await supabase.from("aoe_decisions").select("*").eq("request_id", requestId).maybeSingle();
      assertNoSupabaseError(result, "Failed to find AOE decision by request.");
      return rowToDecision(result.data);
    },
    async listByStudentId(studentId, options = {}) {
      const result = await supabase.from("aoe_decisions").select("*").eq("student_id", studentId).limit(options.limit ?? 50);
      assertNoSupabaseError(result, "Failed to list AOE decisions.");
      return (result.data ?? []).map(rowToDecision);
    },
  };
}
