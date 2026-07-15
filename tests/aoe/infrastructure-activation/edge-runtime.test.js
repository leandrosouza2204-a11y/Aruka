import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("edge runtime source is present but runtime execution is gated by environment", () => {
  const source = fs.readFileSync("supabase/functions/aoe/index.ts", "utf8");
  assert.ok(source.includes("AOE_ENABLED"));
  assert.ok(source.includes("SUPABASE_SERVICE_ROLE_KEY"));
  assert.equal(fs.existsSync("supabase/config.toml"), false);
});
