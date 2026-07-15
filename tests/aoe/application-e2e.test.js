import test from "node:test";
import assert from "node:assert/strict";
import { PUBLIC_CONTRACT_VERSION, createMemoryDecisionRepository } from "../../src/aoe/index.js";
import { makeRequest, makeService } from "./application-test-helpers.js";

const cases = [
  ["automatic decision", () => makeRequest("beginner-3d-60-full-gym")],
  ["decision with warnings", () => makeRequest("beginner-5d-low-adherence", { idempotencyKey: "idem_warn_001" })],
  ["human review required", () => makeRequest("intermediate-5d-delts-specialization", { idempotencyKey: "idem_review_001" })],
  ["additional data required", () => makeRequest("missing-critical-data", { idempotencyKey: "idem_missing_001", student: { availableMinutesPerSession: 60, experienceLevel: undefined } })],
  ["no eligible model", () => makeRequest("no-eligible-model", { idempotencyKey: "idem_none_001" })],
];

test("end-to-end application scenarios cover domain outcomes", async () => {
  const { service } = makeService();
  for (const [, build] of cases) {
    const response = await service.requestDecision(build());
    assert.notEqual(response.status, "ERROR");
  }
});

test("review workflow supports approval and rejects invalid final transition", async () => {
  const { service } = makeService();
  const request = makeRequest("intermediate-5d-delts-specialization");
  const decision = await service.requestDecision(request);
  assert.ok(decision.humanReview.reviewId);
  const review = await service.submitHumanReview({
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: "req_review_approve",
    idempotencyKey: "idem_review_approve",
    actor: request.actor,
    reviewId: decision.humanReview.reviewId,
    decision: "APPROVED",
    checklist: decision.humanReview.checklist,
    adjustments: [],
    notes: "",
  });
  assert.equal(review.status, "APPROVED");
  const invalid = await service.submitHumanReview({ ...review, contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "req_review_invalid", idempotencyKey: "idem_review_invalid", actor: request.actor, decision: "REJECTED", checklist: [] });
  assert.equal(invalid.status, "ERROR");
});

test("persistence failure produces safe error and rollback", async () => {
  const failingRepo = createMemoryDecisionRepository({ failOnSave: true });
  const { service } = makeService({ decisionRepository: failingRepo });
  const response = await service.requestDecision(makeRequest());
  assert.equal(response.status, "ERROR");
  assert.equal(await failingRepo.findByRequestId("req_beginner-3d-60-full-gym"), null);
});
