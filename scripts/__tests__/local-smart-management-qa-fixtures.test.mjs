import assert from "node:assert/strict";
import test from "node:test";
import { FIXTURE_COUNTS, FIXTURE_IDS, isLocalSmartManagementQaEndpoint, validateFixtureRows } from "../lib/local-smart-management-qa-fixtures.mjs";

test("fixture IDs are unique and the dataset covers each required model", () => {
  assert.equal(new Set(Object.values(FIXTURE_IDS)).size, Object.keys(FIXTURE_IDS).length);
  const rows = [
    ...["PER_SESSION", "PER_STUDENT_SESSION", "MONTHLY_PACKAGE", "FIXED_PACKAGE"].map((model) => ({ kind: "services", model, status: "active", owned: true })),
    ...Array.from({ length: 5 }, () => ({ kind: "locations", status: "active", owned: true })),
    ...["none", "fixed", "per_student", "percentage", "tiered"].map((model) => ({ kind: "rules", model, status: "active", owned: true })),
    ...Array.from({ length: 3 }, () => ({ kind: "tiers", status: "active", owned: true })),
  ];
  assert.deepEqual(validateFixtureRows(rows), { ok: true, errors: [] });
  assert.deepEqual(FIXTURE_COUNTS, { services: 4, locations: 5, rules: 5, tiers: 3 });
});

test("validator rejects duplicate-prone or cross-owner fixture state", () => {
  const invalid = validateFixtureRows([{ kind: "services", model: "PER_SESSION", status: "active", owned: false }]);
  assert.equal(invalid.ok, false);
  assert.ok(invalid.errors.includes("ownership or active status failed"));
});

test("local guard only accepts loopback Supabase endpoints", () => {
  assert.equal(isLocalSmartManagementQaEndpoint("http://127.0.0.1:54321"), true);
  assert.equal(isLocalSmartManagementQaEndpoint("http://localhost:54321"), true);
  assert.equal(isLocalSmartManagementQaEndpoint("https://project.supabase.co"), false);
  assert.equal(isLocalSmartManagementQaEndpoint("not-a-url"), false);
});
