import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildRuntimeCatalog } from "../../../scripts/aoe/infrastructure/build-runtime-catalog.js";

test("runtime catalog bundle is generated with 30 models and checksum", () => {
  const result = buildRuntimeCatalog();
  assert.equal(result.models, 30);
  assert.equal(result.releases, 2);
  assert.equal(result.checksumsValid, 30);
  assert.match(result.aggregateChecksum, /^[a-f0-9]{64}$/);
  assert.equal(fs.existsSync("supabase/functions/aoe/generated/apl-catalog.generated.ts"), true);
});
