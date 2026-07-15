import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision, activeAplCatalog, listRules } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

test("active fixture catalog exposes exactly 30 APL models", () => {
  assert.equal(activeAplCatalog.length, 30);
  assert.equal(new Set(activeAplCatalog.map((model) => model.modelCode)).size, 30);
});

test("rule registry exposes all v1.2 rule families", () => {
  const rules = listRules();
  assert.equal(rules.length, 56);
  assert.ok(rules.some((rule) => rule.id === "AOE-ELG-001"));
  assert.ok(rules.some((rule) => rule.id === "AOE-REV-008"));
});

test("golden scenarios produce deterministic expected outcomes", () => {
  for (const scenario of goldenScenarios) {
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
    assert.equal(result.versions.aoe, "1.2.0");
  }
});

test("decision trace includes ordered pipeline and ranking", () => {
  const result = runAOEDecision({
    profile: goldenScenarios[0].profile,
    catalog: activeAplCatalog,
    options: { requestId: "trace-test", now: "2026-07-15T00:00:00.000Z" },
  });
  assert.equal(result.decisionTrace.requestId, "trace-test");
  assert.ok(result.decisionTrace.pipeline.includes("scoring"));
  assert.ok(result.decisionTrace.ranking.length > 0);
});

test("limited equipment remains eligible with explicit adaptation warning", () => {
  const scenario = goldenScenarios.find((item) => item.id === "limited-equipment");
  const result = runAOEDecision({ profile: scenario.profile, catalog: activeAplCatalog });
  assert.ok(result.reasonCodes.includes("EQUIPMENT_ADAPTATION_REQUIRED"));
});
