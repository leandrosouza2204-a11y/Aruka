import test from "node:test";
import assert from "node:assert/strict";
import { evaluateReleaseReadiness } from "../../../src/aoe/index.js";

test("release readiness evaluator blocks on blocker failures", () => {
  assert.equal(evaluateReleaseReadiness([{ name: "ok", passed: true, blocking: true }]).status, "READY_FOR_RC");
  assert.equal(evaluateReleaseReadiness([{ name: "blocker", passed: false, blocking: true }]).status, "NOT_READY");
});
