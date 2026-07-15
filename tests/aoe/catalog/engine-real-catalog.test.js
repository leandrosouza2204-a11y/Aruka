import test from "node:test";
import assert from "node:assert/strict";
import { runAOEDecision } from "../../../src/aoe/index.js";
import { CatalogSource } from "../../../src/aoe/catalog/index.js";
import { goldenScenarios } from "../../../src/aoe/fixtures/profiles/golden-scenarios.js";

function scenario(id) {
  return goldenScenarios.find((item) => item.id === id).profile;
}

test("engine runs with real APL catalog adapter", () => {
  const result = runAOEDecision({
    profile: scenario("beginner-3d-60-full-gym"),
    options: { catalogSource: CatalogSource.APL_RELEASES, projectRoot: process.cwd() },
  });
  assert.ok(result.selectedModel);
  assert.equal(result.decisionTrace.catalogSource, "APL_RELEASES");
  assert.equal(result.decisionTrace.catalogChecksumSummary.valid, 30);
});

test("real catalog supports key decision scenarios", () => {
  for (const id of ["beginner-3d-60-full-gym", "intermediate-3d-performance", "intermediate-5d-delts-specialization", "no-eligible-model"]) {
    const result = runAOEDecision({
      profile: scenario(id),
      options: { catalogSource: CatalogSource.APL_RELEASES, projectRoot: process.cwd() },
    });
    assert.ok(result.status);
    assert.equal(result.decisionTrace.activeAPLReleases.length, 2);
  }
});
