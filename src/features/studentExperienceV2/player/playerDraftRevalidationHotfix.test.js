import assert from "node:assert/strict";
import test from "node:test";
import { createLatestRequestGuard } from "../profile/latestRequestGuard.js";
import { createVolatilePlayerDraftStore, getVolatilePlayerDraftStore } from "./playerContinuity.js";

const moduleUrl = new URL("./playerContinuity.js", import.meta.url);
const draft = { reps: "10", loadValue: "22", loadUnit: "kg", rir: "2", rpe: "8" };

async function reconstructedBoundary(instance) {
  const imported = await import(`${moduleUrl.href}?hotfix-boundary=${instance}`);
  return typeof imported.getVolatilePlayerDraftStore === "function"
    ? imported.getVolatilePlayerDraftStore()
    : imported.createVolatilePlayerDraftStore();
}

test("DRAFT-01/02/03: foreground keeps draft before and after module-boundary reconstruction", async () => {
  const beforeForeground = await reconstructedBoundary("before-foreground");
  beforeForeground.selectSet("session-s", "exercise-e", 2);
  beforeForeground.write("session-s", "exercise-e", 2, draft);

  assert.equal(beforeForeground.readSelectedSet("session-s", "exercise-e"), 2);
  assert.deepEqual(beforeForeground.read("session-s", "exercise-e", 2), draft);

  const afterSkeleton = await reconstructedBoundary("after-skeleton");
  await Promise.resolve();
  await new Promise((resolve) => globalThis.setTimeout(resolve, 0));

  assert.equal(afterSkeleton.readSelectedSet("session-s", "exercise-e"), 2);
  assert.deepEqual(afterSkeleton.read("session-s", "exercise-e", 2), draft);
  afterSkeleton.clearSession("session-s");
});

test("DRAFT-04: partial exercise keeps the current set draft", () => {
  const store = createVolatilePlayerDraftStore();
  store.selectSet("partial-session", "squat", 2);
  store.write("partial-session", "squat", 2, draft);
  const snapshot = { sets: [{ setNumber: 1, completed: true }, { setNumber: 2, completed: false }] };

  assert.equal(snapshot.sets[0].completed, true);
  assert.equal(store.readSelectedSet("partial-session", "squat"), 2);
  assert.deepEqual(store.read("partial-session", "squat", 2), draft);
});

test("DRAFT-05/06/07: draft is isolated by set, exercise, and session", () => {
  const store = createVolatilePlayerDraftStore();
  store.write("session-a", "squat", 2, draft);

  assert.deepEqual(store.read("session-a", "squat", 3, {}), {});
  assert.deepEqual(store.read("session-a", "lunge", 2, {}), {});
  assert.deepEqual(store.read("session-b", "squat", 2, {}), {});
});

test("DRAFT-08: confirmed submission clears only the matching draft", () => {
  const store = createVolatilePlayerDraftStore();
  store.write("session-a", "squat", 2, draft);
  store.write("session-a", "squat", 3, { reps: "12" });

  store.clear("session-a", "squat", 2);

  assert.deepEqual(store.read("session-a", "squat", 2, {}), {});
  assert.deepEqual(store.read("session-a", "squat", 3, {}), { reps: "12" });
});

test("DRAFT-09: stale response cannot replace the current draft or exercise", async () => {
  for (let run = 0; run < 100; run += 1) {
    const store = createVolatilePlayerDraftStore();
    const guard = createLatestRequestGuard();
    let exerciseId = "squat";
    store.write("race-session", exerciseId, 2, draft);
    const stale = guard.start();
    const current = guard.start();

    await Promise.resolve();
    if (guard.isCurrent(current)) exerciseId = "squat";
    if (guard.isCurrent(stale)) {
      exerciseId = "lunge";
      store.write("race-session", "squat", 2, { reps: "" });
    }

    assert.equal(exerciseId, "squat");
    assert.deepEqual(store.read("race-session", "squat", 2), draft);
    assert.deepEqual(store.read("race-session", "lunge", 2, {}), {});
  }
});

test("DRAFT-10: a new document realm still starts without drafts", () => {
  const firstDocument = {};
  const reloadedDocument = {};
  getVolatilePlayerDraftStore(firstDocument).write("session-a", "squat", 2, draft);

  assert.deepEqual(getVolatilePlayerDraftStore(reloadedDocument).read("session-a", "squat", 2, {}), {});
});

test("critical module-boundary reconstruction is repeatable 100/100", async () => {
  for (let run = 0; run < 100; run += 1) {
    const sessionId = `repeat-session-${run}`;
    const exerciseId = `repeat-exercise-${run}`;
    const before = await reconstructedBoundary(`repeat-before-${run}`);
    before.selectSet(sessionId, exerciseId, 2);
    before.write(sessionId, exerciseId, 2, draft);

    const after = await reconstructedBoundary(`repeat-after-${run}`);
    assert.equal(after.readSelectedSet(sessionId, exerciseId), 2);
    assert.deepEqual(after.read(sessionId, exerciseId, 2), draft);
    assert.deepEqual(after.read(sessionId, `${exerciseId}-other`, 2, {}), {});
    assert.deepEqual(after.read(`${sessionId}-other`, exerciseId, 2, {}), {});
    after.clearSession(sessionId);
  }
});

test("document-lifetime store remains bounded to the newest 100 drafts", () => {
  const store = createVolatilePlayerDraftStore();
  for (let setNumber = 1; setNumber <= 101; setNumber += 1) {
    store.write("bounded-session", "bounded-exercise", setNumber, { reps: String(setNumber) });
  }

  assert.deepEqual(store.read("bounded-session", "bounded-exercise", 1, {}), {});
  assert.deepEqual(store.read("bounded-session", "bounded-exercise", 101, {}), { reps: "101" });
});
