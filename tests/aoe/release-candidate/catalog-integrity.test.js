import test from "node:test";
import assert from "node:assert/strict";
import { loadAPLCatalog } from "../../../src/aoe/index.js";

test("real APL catalog remains valid for release candidate", () => {
  const result = loadAPLCatalog({ activeReleases: ["SPRINT_01", "SPRINT_02"], cache: false });
  assert.equal(result.statistics.releasesActive, 2);
  assert.equal(result.statistics.modelsDeclared, 30);
  assert.equal(result.statistics.modelsValid, 30);
  assert.equal(result.statistics.checksumsValid, 30);
  assert.equal(new Set(result.catalog.map((item) => item.modelCode)).size, 30);
  assert.equal(result.errors.length, 0);
});
