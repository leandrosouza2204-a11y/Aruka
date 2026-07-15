import test from "node:test";
import assert from "node:assert/strict";
import { createInfrastructureConfig, isPilotAllowed, validateInfrastructureEnvironment } from "../../../src/aoe/index.js";

test("pilot flags default to safe disabled and allow explicit pilot", () => {
  const disabled = createInfrastructureConfig({});
  assert.equal(isPilotAllowed(disabled, { actorId: "u1" }), false);
  const enabled = createInfrastructureConfig({ AOE_ENABLED: "true", AOE_PILOT_ENABLED: "true", AOE_ALLOWED_USER_IDS: "u1" });
  assert.equal(isPilotAllowed(enabled, { actorId: "u1" }), true);
  assert.equal(isPilotAllowed(enabled, { actorId: "u2" }), false);
  assert.equal(validateInfrastructureEnvironment(enabled).valid, true);
});
