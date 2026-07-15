import test from "node:test";
import assert from "node:assert/strict";
import { validateContractFreeze, PUBLIC_CONTRACT_VERSION } from "../../../src/aoe/index.js";

test("public contracts are frozen and parseable", () => {
  const result = validateContractFreeze();
  assert.equal(PUBLIC_CONTRACT_VERSION, "1.0.0-rc.1");
  assert.equal(result.valid, true);
});
