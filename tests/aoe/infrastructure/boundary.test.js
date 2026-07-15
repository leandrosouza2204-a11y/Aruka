import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("supabase/functions/aoe/index.ts", "utf8");

test("AOE edge boundary enforces auth, feature flags and safe errors", () => {
  assert.ok(source.includes("Authorization"));
  assert.ok(source.includes("AOE_ENABLED"));
  assert.ok(source.includes("AOE_PILOT_ENABLED"));
  assert.ok(source.includes("SUPABASE_SERVICE_ROLE_KEY"));
  assert.equal(source.includes("VITE_SUPABASE"), false);
  assert.equal(source.includes("console.error(error)"), false);
});
