import test from "node:test";
import assert from "node:assert/strict";
import { checkIdempotencyConcurrency } from "../../../src/aoe/index.js";

test("idempotency lock prevents duplicate logical decisions in local concurrency", async () => {
  const result = await checkIdempotencyConcurrency();
  assert.equal(result.passed, true);
});
