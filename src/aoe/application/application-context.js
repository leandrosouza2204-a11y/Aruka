export function createApplicationContext({ request, idGenerator, clock }) {
  return Object.freeze({
    requestId: request.requestId,
    correlationId: idGenerator("cor"),
    idempotencyKey: request.idempotencyKey,
    actor: Object.freeze({ ...request.actor }),
    organizationId: request.actor.organizationId ?? null,
    startedAt: clock(),
    contractVersion: request.contractVersion,
  });
}
