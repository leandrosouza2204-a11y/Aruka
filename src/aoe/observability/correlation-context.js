export function createCorrelationContext({ requestId, idGenerator }) {
  return Object.freeze({ requestId, correlationId: idGenerator("cor") });
}
