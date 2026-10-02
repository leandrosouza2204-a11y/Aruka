import assert from "node:assert/strict";
import test from "node:test";
import { createLatestRequestGuard } from "../profile/latestRequestGuard.js";
import { createVolatilePlayerDraftStore, resolveActiveExerciseId } from "./playerContinuity.js";

test("a resposta concorrente antiga não substitui a seleção ativa mais nova", async () => {
  for (let run = 0; run < 100; run += 1) {
    const guard = createLatestRequestGuard();
    let activeExerciseId = "exercise-b";
    const older = guard.start();
    const olderResponse = deferred();
    const olderApplication = olderResponse.promise.then((exercises) => {
      if (guard.isCurrent(older)) activeExerciseId = resolveActiveExerciseId(exercises, activeExerciseId);
    });
    const newer = guard.start();
    const newerResponse = deferred();
    const newerApplication = newerResponse.promise.then((exercises) => {
      if (guard.isCurrent(newer)) activeExerciseId = resolveActiveExerciseId(exercises, activeExerciseId);
    });

    newerResponse.resolve([{ id: "exercise-a" }, { id: "exercise-b" }]);
    await newerApplication;
    olderResponse.resolve([{ id: "exercise-a" }]);
    await olderApplication;

    assert.equal(activeExerciseId, "exercise-b");
  }
});

test("draft volátil sobrevive a remount/revalidation da mesma identidade", () => {
  const store = createVolatilePlayerDraftStore();
  const draft = { reps: "10", loadValue: "22", loadUnit: "kg", rir: "2", rpe: "8" };
  store.selectSet("session-a", "exercise-a", 1);
  store.write("session-a", "exercise-a", 1, draft);

  assert.equal(store.readSelectedSet("session-a", "exercise-a"), 1);
  assert.deepEqual(store.read("session-a", "exercise-a", 1, {}), draft);
  assert.notEqual(store.read("session-a", "exercise-a", 1, {}), draft);
});

test("draft não vaza entre série exercício ou sessão e é removido após confirmação", () => {
  const store = createVolatilePlayerDraftStore();
  store.write("session-a", "exercise-a", 1, { reps: "10" });

  assert.deepEqual(store.read("session-a", "exercise-a", 2, { reps: "" }), { reps: "" });
  assert.deepEqual(store.read("session-a", "exercise-b", 1, { reps: "" }), { reps: "" });
  assert.deepEqual(store.read("session-b", "exercise-a", 1, { reps: "" }), { reps: "" });

  store.clear("session-a", "exercise-a", 1);
  assert.deepEqual(store.read("session-a", "exercise-a", 1, { reps: "" }), { reps: "" });
});

test("novo store simula hard reload sem ampliar persistência do draft", () => {
  const liveStore = createVolatilePlayerDraftStore();
  liveStore.write("session-a", "exercise-a", 1, { reps: "10" });

  const afterDocumentReload = createVolatilePlayerDraftStore();
  assert.deepEqual(afterDocumentReload.read("session-a", "exercise-a", 1, { reps: "" }), { reps: "" });
});

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}
