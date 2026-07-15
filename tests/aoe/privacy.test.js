import test from "node:test";
import assert from "node:assert/strict";
import { redactForLogs } from "../../src/aoe/index.js";
import { makeRequest, makeService } from "./application-test-helpers.js";

test("redaction removes sensitive free fields from logs and audit", async () => {
  const { service, logger, auditRecorder } = makeService();
  await service.requestDecision(makeRequest("beginner-3d-60-full-gym", { student: { name: "Pessoa Teste", email: "pessoa@example.com", observations: "observacao sensivel completa" } }));
  const joinedLogs = JSON.stringify(logger.entries());
  const joinedAudit = JSON.stringify(auditRecorder.events());
  assert.equal(joinedLogs.includes("pessoa@example.com"), false);
  assert.equal(joinedAudit.includes("observacao sensivel completa"), false);
  assert.equal(redactForLogs({ email: "x@y.com" }).email, "[REDACTED]");
});

test("public response does not expose full trace by default", async () => {
  const { service } = makeService();
  const response = await service.requestDecision(makeRequest());
  assert.equal("decisionTrace" in response, false);
});
