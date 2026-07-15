import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision, activeAplCatalog } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

test("all golden scenarios are named and deterministic", () => {
  assert.equal(goldenScenarios.length, 15);
  const firstPass = goldenScenarios.map((scenario) => runAOEDecision({
    profile: scenario.profile,
    catalog: activeAplCatalog,
    options: { requestId: scenario.id, now: "2026-07-15T00:00:00.000Z" },
  }));
  const secondPass = goldenScenarios.map((scenario) => runAOEDecision({
    profile: scenario.profile,
    catalog: activeAplCatalog,
    options: { requestId: scenario.id, now: "2026-07-15T00:00:00.000Z" },
  }));
  assert.deepEqual(firstPass, secondPass);
});
