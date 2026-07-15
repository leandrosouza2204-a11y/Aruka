import test from "node:test";
import assert from "node:assert/strict";
import { runPerformanceBenchmarks } from "../../../src/aoe/index.js";

test("performance benchmark completes without errors", async () => {
  const result = await runPerformanceBenchmarks({ sequential1000: 100 });
  assert.equal(result.errors, 0);
  assert.ok(["PASS", "PASS_WITH_OBSERVATION"].includes(result.classification));
});
