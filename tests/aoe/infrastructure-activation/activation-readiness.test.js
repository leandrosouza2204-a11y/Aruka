import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

test("activation CLI reports not ready when runtime environment is indeterminate", () => {
  const result = spawnSync("node", ["scripts/aoe/activation-cli.js", "--all-runtime", "--environment=local", "--json"], { encoding: "utf8" });
  assert.equal(result.status, 0);
  const jsonStart = result.stdout.indexOf("{");
  const parsed = JSON.parse(result.stdout.slice(jsonStart));
  assert.equal(parsed.status, "NOT_READY");
  assert.equal(parsed.productionChanged, false);
});
