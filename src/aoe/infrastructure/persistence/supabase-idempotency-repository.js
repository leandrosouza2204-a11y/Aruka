import { assertNoSupabaseError } from "./persistence-errors.js";
import { idempotencyToRow, rowToIdempotency } from "./persistence-mappers.js";

export function createSupabaseIdempotencyRepository(supabase) {
  return {
    async get(key) {
      const result = await supabase.from("aoe_idempotency_keys").select("*").eq("id", key).maybeSingle();
      assertNoSupabaseError(result, "Failed to get AOE idempotency key.");
      return rowToIdempotency(result.data);
    },
    async create(record) {
      const result = await supabase.from("aoe_idempotency_keys").insert(idempotencyToRow(record)).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to create AOE idempotency key.");
      return rowToIdempotency(result.data);
    },
    async update(record) {
      const row = idempotencyToRow({ ...record, updatedAt: new Date().toISOString() });
      const result = await supabase.from("aoe_idempotency_keys").update(row).eq("id", row.id).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to update AOE idempotency key.");
      return rowToIdempotency(result.data);
    },
    async getOrCreateProcessingRecord(record) {
      const result = await supabase.rpc("aoe_idempotency_get_or_create", {
        p_id: record.key,
        p_actor_id: record.actorId,
        p_organization_id: record.organizationId ?? null,
        p_operation: record.operation,
        p_idempotency_key: record.key.split(":").at(-1),
        p_request_fingerprint: record.requestFingerprint,
      });
      assertNoSupabaseError(result, "Failed to reserve AOE idempotency key.");
      return { created: Boolean(result.data?.created), record: rowToIdempotency(result.data?.record) };
    },
    async deleteExpired(now) {
      const result = await supabase.from("aoe_idempotency_keys").delete().lt("expires_at", now).select("id");
      assertNoSupabaseError(result, "Failed to delete expired AOE idempotency keys.");
      return result.data?.length ?? 0;
    },
  };
}
