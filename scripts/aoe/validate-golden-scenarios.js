#!/usr/bin/env node
import assert from "node:assert/strict";
import { runAOEDecision, activeAplCatalog } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

const results = goldenScenarios.map((scenario) => {
  const result = runAOEDecision({
    profile: scenario.profile,
    catalog: activeAplCatalog,
    options: { requestId: scenario.id, now: "2026-07-15T00:00:00.000Z" },
  });
  if (scenario.expected.selectedModelCode) {
    assert.equal(result.selectedModel?.modelCode, scenario.expected.selectedModelCode, scenario.id);
  }
  if (scenario.expected.status) {
    assert.equal(result.status, scenario.expected.status, scenario.id);
  }
  if (scenario.expected.reasonCode) {
    assert.ok(result.reasonCodes.includes(scenario.expected.reasonCode), scenario.id);
  }
  return { id: scenario.id, status: result.status, selectedModel: result.selectedModel?.modelCode ?? null };
});

console.log(JSON.stringify({ scenarios: results.length, results }, null, 2));
