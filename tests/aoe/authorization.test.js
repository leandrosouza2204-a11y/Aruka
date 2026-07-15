import test from "node:test";
import assert from "node:assert/strict";
import { makeRequest, makeService } from "./application-test-helpers.js";

test("professional and admin can request decisions, student read-only cannot", async () => {
  const { service } = makeService();
  assert.notEqual((await service.requestDecision(makeRequest("beginner-3d-60-full-gym", { actor: { role: "PROFESSIONAL" } }))).status, "ERROR");
  assert.notEqual((await service.requestDecision(makeRequest("beginner-4d-high-adherence", { actor: { role: "ADMIN" }, idempotencyKey: "idem_admin_001" }))).status, "ERROR");
  const denied = await service.requestDecision(makeRequest("beginner-5d-low-adherence", { actor: { actorId: "golden-003", role: "STUDENT_READ_ONLY" }, idempotencyKey: "idem_student_001" }));
  assert.equal(denied.status, "ERROR");
});

test("organization isolation blocks cross-organization trace access", async () => {
  const { service } = makeService();
  const request = makeRequest("beginner-3d-60-full-gym", { options: { includeDecisionTrace: true } });
  const response = await service.requestDecision(request);
  await assert.rejects(() => service.getDecisionTrace({ decisionId: response.decisionId, actor: { actorId: "pro_002", role: "PROFESSIONAL", organizationId: "org_002" } }));
});
