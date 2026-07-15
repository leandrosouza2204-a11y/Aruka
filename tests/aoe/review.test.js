import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

test("specialization requires human review", () => {
  const decision = runAOEDecision({ profile: goldenScenarios.find((item) => item.id === "intermediate-5d-delts-specialization").profile });
  assert.equal(decision.humanReview.required, true);
  assert.notEqual(decision.status, "RECOMMENDED");
  assert.ok(decision.humanReview.checklist.length > 0);
});

test("automatic recommendation has no blocking review", () => {
  const decision = runAOEDecision({ profile: goldenScenarios[0].profile });
  assert.equal(decision.humanReview.blocking, false);
  assert.equal(decision.validation.valid, true);
});
