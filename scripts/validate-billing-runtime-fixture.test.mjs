import assert from "node:assert/strict";
import test from "node:test";
import {
  assertLocalBillingRuntime,
  cleanupBillingRuntimeFixture,
  countBillingRuntimeFixture,
  prepareBillingRuntimeFixture,
} from "./lib/billing-runtime-fixture.mjs";

test("billing runtime fixture blocks non-local Supabase targets", () => {
  assert.throws(
    () => assertLocalBillingRuntime({ apiUrl: "https://example.supabase.co" }),
    /BILLING_RUNTIME_FIXTURE_LOCAL_GUARD=FAIL/,
  );
});

test("billing runtime fixture prepares idempotently and cleans up reserved rows", async (t) => {
  t.after(async () => {
    await cleanupBillingRuntimeFixture();
  });

  const first = await prepareBillingRuntimeFixture();
  assert.deepEqual(first.counts, { plans: 2, students: 3, payments: 4 });

  const second = await prepareBillingRuntimeFixture();
  assert.deepEqual(second.counts, { plans: 2, students: 3, payments: 4 });

  const cleanupCounts = await cleanupBillingRuntimeFixture();
  assert.deepEqual(cleanupCounts, { plans: 0, students: 0, payments: 0 });

  const finalCounts = await countBillingRuntimeFixture();
  assert.deepEqual(finalCounts, { plans: 0, students: 0, payments: 0 });
});
