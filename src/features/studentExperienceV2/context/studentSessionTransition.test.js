import assert from "node:assert/strict";
import test from "node:test";
import { refreshAfterConfirmedSessionTransition } from "./studentSessionTransition.js";

test("confirmed completion replaces stale active Home state with the server refresh", async () => {
  let home = { activeSession: { id: "session-a", completedSetCount: 1, totalSetCount: 14 } };
  let refreshCalls = 0;
  const result = await refreshAfterConfirmedSessionTransition(
    { id: "session-a", status: "completed" },
    async () => {
      refreshCalls += 1;
      home = { activeSession: null, weeklyProgress: { completedCount: 2 } };
      return home;
    },
  );

  assert.equal(result.status, "refreshed");
  assert.equal(refreshCalls, 1);
  assert.equal(home.activeSession, null);
  assert.equal(result.home.weeklyProgress.completedCount, 2);
});

test("unconfirmed transitions never clear or refresh Home optimistically", async () => {
  let refreshCalls = 0;
  const result = await refreshAfterConfirmedSessionTransition(
    { id: "session-a", status: "in_progress" },
    async () => { refreshCalls += 1; },
  );
  assert.equal(result.status, "ignored");
  assert.equal(refreshCalls, 0);
});

test("confirmed cancellation refreshes shared state and refresh failure fabricates no Home", async () => {
  const cancelled = await refreshAfterConfirmedSessionTransition(
    { id: "session-a", status: "cancelled" },
    async () => ({ activeSession: null }),
  );
  const failed = await refreshAfterConfirmedSessionTransition(
    { id: "session-b", status: "completed" },
    async () => { throw new Error("offline"); },
  );

  assert.equal(cancelled.status, "refreshed");
  assert.equal(cancelled.home.activeSession, null);
  assert.equal(failed.status, "failed");
  assert.equal(failed.home, null);
});
