import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const runner = readFileSync("scripts/run-aruka-g3-migration-rehearsal.mjs", "utf8");

test("G3 runner is pinned to an isolated mission-owned container", () => {
  assert.match(runner, /NetworkMode, "none"/u);
  assert.match(runner, /PortBindings/u);
  assert.match(runner, /aruka\.g2-restore/u);
  assert.doesNotMatch(runner, /supabase\s+(?:db push|migration repair|db reset|link)/iu);
  assert.doesNotMatch(runner, /postgres(?:ql)?:\/\//iu);
});

test("G3 runner preserves the drift-safe operational order", () => {
  const reconciliation = runner.indexOf("physicalPending[14]");
  const hardening = runner.indexOf("physicalPending[12]", reconciliation);
  const rollout = runner.indexOf("physicalPending[13]", hardening);
  assert.ok(reconciliation > 0 && reconciliation < hardening && hardening < rollout);
  assert.match(runner, /final_history_count/u);
});

test("G3 runtime evidence uses synthetic identities and rollback", () => {
  for (const file of ["validate-aruka-g3-security-runtime.sql", "validate-aruka-g3-rollout-runtime.sql", "audit-aruka-g3-legacy-definer-runtime.sql"]) {
    const sql = readFileSync(`scripts/sql/${file}`, "utf8");
    assert.match(sql, /example\.invalid/u);
    assert.match(sql, /begin;/iu);
    assert.match(sql, /rollback;/iu);
  }
});
