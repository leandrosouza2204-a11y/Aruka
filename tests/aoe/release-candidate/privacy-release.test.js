import test from "node:test";
import assert from "node:assert/strict";
import { createAOEApplicationService, PUBLIC_CONTRACT_VERSION } from "../../../src/aoe/index.js";

test("release public error is serializable and does not expose stack", async () => {
  const service = createAOEApplicationService();
  const response = await service.requestDecision({ contractVersion: PUBLIC_CONTRACT_VERSION, requestId: "bad", idempotencyKey: "short", actor: { actorId: "x", role: "PROFESSIONAL" }, student: {}, options: {} });
  const parsed = JSON.parse(JSON.stringify(response));
  assert.equal(parsed.status, "ERROR");
  assert.equal(JSON.stringify(parsed).includes("stack"), false);
});
