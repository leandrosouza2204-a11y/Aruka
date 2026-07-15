import test from "node:test";
import assert from "node:assert/strict";

test("public boundary exposes the minimal application contract", async () => {
  const api = await import("../../../src/aoe/public/index.js");
  for (const key of ["createAOEApplicationService", "createMemoryAOEDependencies", "validateDecisionRequestV1", "validateHumanReviewRequestV1", "PublicDecisionStatus", "PublicReviewStatus", "PublicActorRole", "PublicErrorCode", "PUBLIC_CONTRACT_VERSION"]) {
    assert.ok(key in api, `${key} must be exported`);
  }
  assert.equal("runAOEDecision" in api, false);
});
