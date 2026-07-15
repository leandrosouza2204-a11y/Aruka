import test from "node:test";
import assert from "node:assert/strict";
import { runAdversarialSuite } from "../../src/aoe/validation/adversarial/adversarial-runner.js";

test("adversarial suite blocks critical recommendations", () => {
  const result = runAdversarialSuite();
  assert.equal(result.total, 30);
  assert.equal(result.failed.length, 0);
});
