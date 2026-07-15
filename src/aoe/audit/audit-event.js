import { redactForAudit } from "../security/redaction.js";

export function createAuditEvent({ idGenerator, type, actor, resourceType, resourceId, requestId, correlationId, outcome, metadata = {}, occurredAt, versions }) {
  return Object.freeze({
    auditEventId: idGenerator("aud"),
    type,
    actorId: actor?.actorId ?? null,
    actorRole: actor?.role ?? null,
    organizationId: actor?.organizationId ?? null,
    resourceType,
    resourceId,
    requestId,
    correlationId,
    outcome,
    metadata: redactForAudit(metadata),
    occurredAt,
    versions,
  });
}
