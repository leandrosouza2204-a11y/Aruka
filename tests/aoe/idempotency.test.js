import test from "node:test";
import assert from "node:assert/strict";
import { createRequestFingerprint } from "../../src/aoe/index.js";
import { makeRequest, makeService } from "./application-test-helpers.js";

test("same key and same payload returns same decision", async () => {
  const { service, metrics } = makeService();
  const request = makeRequest();
  const first = await service.requestDecision(request);
  const second = await service.requestDecision(request);
  assert.equal(second.decisionId, first.decisionId);
  assert.ok(metrics.snapshot().counters.some((item) => item.name === "aoe_idempotency_hit_total"));
});

test("same key and different payload returns idempotency conflict", async () => {
  const { service } = makeService();
  const request = makeRequest();
  await service.requestDecision(request);
  const conflict = makeRequest("beginner-3d-60-full-gym", { student: { availableDaysPerWeek: 4 } });
  const response = await service.requestDecision(conflict);
  assert.equal(response.status, "ERROR");
  assert.equal(response.error.code, "IDEMPOTENCY_CONFLICT");
});

test("fingerprint ignores metadata and key order but changes decision fields", () => {
  const a = makeRequest();
  const b = makeRequest("beginner-3d-60-full-gym", { metadata: { source: "OTHER" } });
  const c = makeRequest("beginner-3d-60-full-gym", { student: { availableDaysPerWeek: 4 } });
  assert.equal(createRequestFingerprint(a), createRequestFingerprint(b));
  assert.notEqual(createRequestFingerprint(a), createRequestFingerprint(c));
});
