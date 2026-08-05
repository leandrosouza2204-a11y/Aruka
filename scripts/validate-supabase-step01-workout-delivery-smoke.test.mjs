import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { DEFAULT_SMOKE_PATH, validateSmoke } from "./validate-supabase-step01-workout-delivery-smoke.mjs";

const validSmoke = readFileSync(DEFAULT_SMOKE_PATH, "utf8");

function failedNames(sql) {
  return validateSmoke(sql)
    .filter((check) => !check.passed)
    .map((check) => check.name);
}

test("missing smoke -> FAIL", () => {
  assert.ok(failedNames("").includes("smoke file exists"));
});

test("missing cleanup -> FAIL", () => {
  const sql = validSmoke
    .replace(/select 'PASS:SMOKE_07_CLEANUP' as smoke_check;/, "")
    .replace(/select 'SMOKE_RESIDUAL_ROWS=0' as smoke_check;/, "")
    .replace(/\bdelete\s+from\s+public\.treinos\b/i, "select from public.treinos");
  assert.ok(failedNames(sql).includes("cleanup assert"));
});

test("missing ownership negative test -> FAIL", () => {
  const sql = validSmoke.replace(/SMOKE_06_OWNERSHIP_PROTECTION/g, "SMOKE_06_REMOVED");
  assert.ok(failedNames(sql).includes("ownership negative assert"));
});

test("missing lifecycle test -> FAIL", () => {
  const sql = validSmoke.replace(/SMOKE_03_LIFECYCLE_TRANSITION/g, "SMOKE_03_REMOVED");
  assert.ok(failedNames(sql).includes("lifecycle assert"));
});

test("missing event test -> FAIL", () => {
  const sql = validSmoke.replace(/SMOKE_04_EVENT_AUDIT/g, "SMOKE_04_REMOVED");
  assert.ok(failedNames(sql).includes("event assert"));
});

test("missing idempotency -> FAIL", () => {
  const sql = validSmoke.replace(/SMOKE_05_IDEMPOTENCY/g, "SMOKE_05_REMOVED");
  assert.ok(failedNames(sql).includes("idempotency assert"));
});

test("structural DDL in smoke -> FAIL", () => {
  assert.ok(failedNames(`${validSmoke}\ncreate table public.bad_smoke(id uuid);`).includes("no structural DDL"));
});

test("Step02 reference -> FAIL", () => {
  assert.ok(failedNames(`${validSmoke}\nselect 'student_user_id';`).includes("no Step02 references"));
});

test("financial reference -> FAIL", () => {
  assert.ok(failedNames(`${validSmoke}\nselect * from public.pagamentos;`).includes("no financial references"));
});

test("admin reference -> FAIL", () => {
  assert.ok(failedNames(`${validSmoke}\nselect public.admin_eh_admin();`).includes("no admin references"));
});

test("AOE reference -> FAIL", () => {
  assert.ok(failedNames(`${validSmoke}\nselect * from public.aoe_decisions;`).includes("no AOE references"));
});

test("valid smoke -> PASS", () => {
  assert.deepEqual(failedNames(validSmoke), []);
});
