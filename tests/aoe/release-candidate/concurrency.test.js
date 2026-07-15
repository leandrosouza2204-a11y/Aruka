import test from "node:test";
import assert from "node:assert/strict";
import { runConcurrencyValidation } from "../../../src/aoe/index.js";

test("concurrency validation passes local process checks", async () => {
  const result = await runConcurrencyValidation();
  assert.equal(result.failed, 0);
});
