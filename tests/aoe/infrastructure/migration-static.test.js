import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const sql = fs.readFileSync("supabase/migrations/20260715_aoe_infrastructure_pilot.sql", "utf8");

test("AOE migration creates required tables, indexes, RLS and idempotency RPC", () => {
  for (const table of ["aoe_decisions", "aoe_decision_traces", "aoe_human_reviews", "aoe_idempotency_keys", "aoe_audit_events"]) {
    assert.ok(sql.includes(`public.${table}`), table);
  }
  assert.ok(sql.includes("aoe_idempotency_unique_key"));
  assert.ok(sql.includes("aoe_idempotency_get_or_create"));
  assert.ok((sql.match(/enable row level security/g) ?? []).length >= 5);
  assert.equal(/using\s*\(\s*true\s*\)/i.test(sql), false);
  assert.equal(/with check\s*\(\s*true\s*\)/i.test(sql), false);
});
