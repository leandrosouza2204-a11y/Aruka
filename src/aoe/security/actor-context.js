export function createActorContext(actor) {
  return Object.freeze({
    actorId: actor?.actorId ?? null,
    role: actor?.role ?? null,
    organizationId: actor?.organizationId ?? null,
  });
}
