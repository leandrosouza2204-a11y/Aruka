import test from "node:test";
import assert from "node:assert/strict";
import { buildImplementationInventory } from "../../../src/aoe/index.js";

test("release inventory has no documented-only capabilities", () => {
  const inventory = buildImplementationInventory();
  assert.ok(inventory.length >= 19);
  assert.equal(inventory.some((item) => item.status === "DOCUMENTED_ONLY"), false);
});
