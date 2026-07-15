import test from "node:test";
import assert from "node:assert/strict";
import { activeAplCatalog, runAOEDecision } from "../../../src/aoe/index.js";
import { goldenScenarios } from "../../../src/aoe/fixtures/profiles/golden-scenarios.js";

function stable(result) {
  return {
    status: result.status,
    selected: result.selectedModel?.modelCode ?? null,
    alternatives: result.alternatives.map((item) => item.modelCode),
    score: result.compatibilityScore,
    confidence: result.confidenceScore,
    risk: result.risk?.score,
    ambiguity: result.ambiguity?.level,
    reasonCodes: result.reasonCodes,
    review: result.humanReview?.required ?? result.humanReview?.status,
  };
}

test("golden scenarios are deterministic across 20 release passes", () => {
  for (const scenario of goldenScenarios) {
    const baseline = stable(runAOEDecision({ profile: scenario.profile, catalog: activeAplCatalog, options: { requestId: `${scenario.id}-0`, now: "2026-07-15T00:00:00.000Z" } }));
    for (let index = 1; index <= 20; index += 1) {
      const shuffled = [...activeAplCatalog].reverse();
      const current = stable(runAOEDecision({ profile: { ...scenario.profile }, catalog: index % 2 ? shuffled : activeAplCatalog, options: { requestId: `${scenario.id}-${index}`, now: `2026-07-15T00:00:${String(index).padStart(2, "0")}.000Z` } }));
      assert.deepEqual(current, baseline);
    }
  }
});
