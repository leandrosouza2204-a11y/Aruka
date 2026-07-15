import { redactForAudit } from "../../security/index.js";
import { assertNoSupabaseError } from "./persistence-errors.js";

export function createSupabaseAuditRecorder(supabase) {
  return {
    async record(event) {
      const row = {
        id: event.auditEventId,
        event_type: event.type,
        actor_id: event.actorId,
        actor_role: event.actorRole,
        organization_id: event.organizationId,
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        request_id: event.requestId,
        correlation_id: event.correlationId,
        outcome: event.outcome,
        metadata: redactForAudit(event.metadata ?? {}),
        versions: event.versions ?? {},
        occurred_at: event.occurredAt,
      };
      const result = await supabase.from("aoe_audit_events").insert(row).select("*").maybeSingle();
      assertNoSupabaseError(result, "Failed to record AOE audit event.");
      return result.data;
    },
  };
}
