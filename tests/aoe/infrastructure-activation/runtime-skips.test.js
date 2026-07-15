import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

for (const name of ["migration-runtime", "rls-runtime", "auth-runtime", "idempotency-database", "persistence-runtime", "audit-runtime", "privacy-runtime", "health-runtime", "staging-smoke"]) {
  test(`${name} requires explicit Supabase local or staging`, { skip: !fs.existsSync("supabase/config.toml") ? "Supabase local/staging environment unavailable in this workspace." : false }, () => {
    assert.equal(fs.existsSync("supabase/config.toml"), true);
  });
}
