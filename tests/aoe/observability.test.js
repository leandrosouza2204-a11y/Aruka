import test from "node:test";
import assert from "node:assert/strict";
import { makeRequest, makeService } from "./application-test-helpers.js";

test("logs, metrics and audit are emitted for decision lifecycle", async () => {
  const { service, logger, metrics, auditRecorder } = makeService();
  const response = await service.requestDecision(makeRequest());
  assert.ok(logger.entries().some((entry) => entry.event === "AOE_DECISION_REQUESTED"));
  assert.ok(logger.entries().some((entry) => entry.event === "AOE_DECISION_COMPLETED"));
  assert.ok(metrics.snapshot().counters.some((item) => item.name === "aoe_decision_completed_total"));
  assert.ok(auditRecorder.events().some((event) => event.type === "DECISION_COMPLETED" && event.resourceId === response.decisionId));
});

test("health check emits service event", async () => {
  const { service, logger } = makeService();
  const health = await service.healthCheck();
  assert.match(health.status, /HEALTHY|DEGRADED/);
  assert.ok(logger.entries().some((entry) => entry.event === "AOE_SERVICE_HEALTH_CHECK"));
});
