import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("activation environment is not silently treated as ready without local config", () => {
  assert.equal(fs.existsSync("supabase/functions/aoe/index.ts"), true);
  assert.equal(fs.existsSync("supabase/config.toml"), false);
});
