import test from "node:test";
import assert from "node:assert/strict";
import { makeRequest, makeService } from "./application-test-helpers.js";

test("application service returns versioned public response", async () => {
  const { service } = makeService();
  const response = await service.requestDecision(makeRequest());
  assert.equal(response.contractVersion, "1.0.0");
  assert.equal(response.applicationServiceVersion, "1.5.0");
  assert.equal(response.aoeVersion, "1.5.0");
  assert.ok(response.decisionId.startsWith("dec_"));
  assert.equal("decisionTrace" in response, false);
});

test("invalid public request returns safe error response", async () => {
  const { service } = makeService();
  const response = await service.requestDecision({ requestId: "bad" });
  assert.equal(response.status, "ERROR");
  assert.equal(response.error.code, "INVALID_REQUEST");
  assert.equal("stack" in response.error, false);
});

test("can read decision and trace through authorized facade", async () => {
  const { service } = makeService();
  const request = makeRequest("beginner-3d-60-full-gym", { options: { includeDecisionTrace: true } });
  const response = await service.requestDecision(request);
  const decision = await service.getDecision({ decisionId: response.decisionId, actor: request.actor });
  const trace = await service.getDecisionTrace({ decisionId: response.decisionId, actor: request.actor });
  assert.equal(decision.decisionId, response.decisionId);
  assert.equal(trace.decisionId, response.decisionId);
});
