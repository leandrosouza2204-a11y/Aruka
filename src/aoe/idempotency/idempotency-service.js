import { AOEIdempotencyConflictError } from "../application/application-errors.js";
import { buildIdempotencyStorageKey } from "./idempotency-key.js";
import { createRequestFingerprint } from "./request-fingerprint.js";
import { IdempotencyStatus } from "./idempotency-status.js";

export function createIdempotencyService({ repository, clock }) {
  return {
    async check({ request, operation }) {
      const key = buildIdempotencyStorageKey({ actorId: request.actor.actorId, idempotencyKey: request.idempotencyKey, operation });
      const requestFingerprint = createRequestFingerprint(request);
      const existing = await repository.get(key);
      if (!existing) return { key, requestFingerprint, hit: false };
      if (existing.requestFingerprint !== requestFingerprint) throw new AOEIdempotencyConflictError("Idempotency key was already used with a different request.");
      if (existing.status === IdempotencyStatus.COMPLETED) return { key, requestFingerprint, hit: true, response: existing.response };
      if (existing.status === IdempotencyStatus.PROCESSING) throw new AOEIdempotencyConflictError("Idempotency key is already processing.");
      return { key, requestFingerprint, hit: false, previousFailed: true };
    },
    async reserve({ request, operation }) {
      const key = buildIdempotencyStorageKey({ actorId: request.actor.actorId, idempotencyKey: request.idempotencyKey, operation });
      const requestFingerprint = createRequestFingerprint(request);
      const now = clock();
      if (typeof repository.getOrCreateProcessingRecord === "function") {
        const result = await repository.getOrCreateProcessingRecord({ key, operation, actorId: request.actor.actorId, requestFingerprint, status: IdempotencyStatus.PROCESSING, response: null, createdAt: now, expiresAt: null });
        const existing = result.record;
        if (result.created) return { key, requestFingerprint, hit: false, created: true };
        if (existing.requestFingerprint !== requestFingerprint) throw new AOEIdempotencyConflictError("Idempotency key was already used with a different request.");
        if (existing.status === IdempotencyStatus.COMPLETED) return { key, requestFingerprint, hit: true, response: existing.response };
        if (existing.status === IdempotencyStatus.PROCESSING) throw new AOEIdempotencyConflictError("Idempotency key is already processing.");
        return { key, requestFingerprint, hit: false, previousFailed: true };
      }
      return this.check({ request, operation });
    },
    async start({ key, operation, actorId, requestFingerprint }) {
      const now = clock();
      await repository.create({ key, operation, actorId, requestFingerprint, status: IdempotencyStatus.PROCESSING, response: null, createdAt: now, expiresAt: null });
    },
    async complete({ key, response }) {
      const record = await repository.get(key);
      await repository.update({ ...record, status: IdempotencyStatus.COMPLETED, response });
    },
    async fail({ key, error }) {
      const record = await repository.get(key);
      if (record) await repository.update({ ...record, status: IdempotencyStatus.FAILED, response: { error: error.code ?? "INTERNAL_ERROR" } });
    },
  };
}
