import assert from "node:assert/strict";
import test from "node:test";
import { buildNetworkCoverage, NETWORK_FAULT_SCENARIOS, NETWORK_SURFACES } from "./cycle-12-14-network-matrix.mjs";

test("network matrix declares all required fault classes and product surfaces", () => {
  for (const scenario of ["offline-before-open", "offline-after-shell", "timeout", "http-400", "http-401", "http-403", "http-404", "http-500", "http-502", "http-503", "request-abort", "disconnect-reconnect", "retry", "ambiguous-write", "refresh-reentry", "stale-response"]) assert(NETWORK_FAULT_SCENARIOS.includes(scenario));
  assert.deepEqual(NETWORK_SURFACES, ["home", "library", "player", "tracking", "completion-feedback", "evolution", "profile"]);
});

test("network matrix fails closed when a surface has no runtime result", () => {
  const coverage = buildNetworkCoverage({ home: { status: "PASS", reads: "PROTECTED" } });
  assert.equal(coverage.find(({ surface }) => surface === "home").status, "PASS");
  assert.equal(coverage.find(({ surface }) => surface === "profile").status, "FAIL");
});
