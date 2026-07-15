import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

test("risk score stays in range and separates levels", () => {
  const low = runAOEDecision({ profile: goldenScenarios[0].profile });
  const critical = runAOEDecision({ profile: goldenScenarios.find((item) => item.id === "missing-critical-data").profile });
  assert.ok(low.risk.score >= 0 && low.risk.score <= 100);
  assert.ok(critical.risk.score >= 0 && critical.risk.score <= 100);
  assert.notEqual(critical.risk.level, "LOW");
});

test("high or critical risk requires review", () => {
  const decision = runAOEDecision({ profile: goldenScenarios.find((item) => item.id === "no-eligible-model").profile });
  assert.ok(decision.humanReview.required);
  assert.notEqual(decision.status, "RECOMMENDED");
});
