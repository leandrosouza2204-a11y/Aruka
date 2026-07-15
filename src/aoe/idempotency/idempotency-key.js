export function buildIdempotencyStorageKey({ actorId, idempotencyKey, operation }) {
  if (!actorId || !idempotencyKey || !operation) throw new Error("actorId, idempotencyKey and operation are required");
  return `${actorId}:${operation}:${idempotencyKey}`;
}
