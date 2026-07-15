import test from "node:test";
import assert from "node:assert/strict";
import { decisionToRow, rowToDecision, idempotencyToRow, rowToIdempotency } from "../../../src/aoe/index.js";

test("Supabase persistence mappers preserve decision contract without raw profile", () => {
  const decision = {
    decisionId: "dec_1",
    requestId: "req_1",
    actorId: "00000000-0000-0000-0000-000000000001",
    studentId: "00000000-0000-0000-0000-000000000002",
    organizationId: null,
    status: "RECOMMENDED",
    selectedModel: { modelCode: "APL-X", modelVersion: "1.0.0", aplRelease: "SPRINT_01" },
    alternatives: [],
    scores: { compatibility: 99, raw: 99, confidence: 90, risk: 0 },
    confidence: "HIGH",
    risk: "LOW",
    ambiguity: "NONE",
    warnings: [],
    reasonCodes: [],
    humanReviewRequired: false,
    humanReviewId: null,
    versions: { aoe: "1.7.0" },
    publicResponse: { status: "RECOMMENDED" },
    traceReference: null,
    createdAt: "2026-07-15T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z",
  };
  const row = decisionToRow(decision);
  assert.equal("profile" in row, false);
  assert.equal(row.selected_model_code, "APL-X");
  assert.equal(rowToDecision(row).decisionId, "dec_1");
});

test("idempotency mapper does not store raw request", () => {
  const row = idempotencyToRow({ key: "actor:REQUEST_DECISION:idem", actorId: "actor", operation: "REQUEST_DECISION", requestFingerprint: "hash", status: "PROCESSING", response: null, createdAt: "now" });
  assert.equal("request" in row, false);
  assert.equal(row.idempotency_key, "idem");
  assert.equal(rowToIdempotency(row).requestFingerprint, "hash");
});
