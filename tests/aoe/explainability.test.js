import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";
import { validateReasonCatalog, listReasonCodes } from "../../src/aoe/explainability/index.js";

test("reason catalog is valid and covers required codes", () => {
  const validation = validateReasonCatalog();
  assert.equal(validation.valid, true, validation.errors.join(", "));
  assert.ok(listReasonCodes().length >= 30);
});

test("explanation is deterministic and complete", () => {
  const profile = goldenScenarios[0].profile;
  const first = runAOEDecision({ profile });
  const second = runAOEDecision({ profile });
  assert.deepEqual(first.explanation, second.explanation);
  assert.ok(first.explanation.summary.includes(first.selectedModel.modelCode));
  assert.ok(first.explanation.scoreBreakdown.length > 0);
  assert.ok(!/garante|diagn[oó]stic/i.test(first.explanation.summary));
});
