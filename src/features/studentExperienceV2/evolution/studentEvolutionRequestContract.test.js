import assert from "node:assert/strict";
import test from "node:test";
import { createLatestRequestGuard } from "../profile/latestRequestGuard.js";

test("legacy unguarded retry order reproduces stale A overwriting newer B", async () => {
  const applied = [];
  let releaseA;
  const slowA = new Promise((resolve) => { releaseA = resolve; });
  const legacyApply = async (promise) => { applied.push(await promise); };
  const requestA = legacyApply(slowA);
  await legacyApply(Promise.resolve("B-newer"));
  releaseA("A-stale");
  await requestA;
  assert.deepEqual(applied, ["B-newer", "A-stale"]);
  assert.equal(applied.at(-1), "A-stale");
});

test("Evolution request guard prevents a slow response A from replacing newer response B", async () => {
  const guard = createLatestRequestGuard();
  const applied = [];
  let releaseA;
  const slowA = new Promise((resolve) => { releaseA = resolve; });

  async function request(promise) {
    const version = guard.start();
    const value = await promise;
    if (guard.isCurrent(version)) applied.push(value);
  }

  const requestA = request(slowA);
  await request(Promise.resolve("B-newer"));
  releaseA("A-stale");
  await requestA;

  assert.deepEqual(applied, ["B-newer"]);
});

test("Evolution accepts the current legitimate response", async () => {
  const guard = createLatestRequestGuard();
  const applied = [];

  async function request(promise) {
    const version = guard.start();
    const value = await promise;
    if (guard.isCurrent(version)) applied.push({ status: "success", value });
  }

  await request(Promise.resolve("current-response"));
  assert.deepEqual(applied, [{ status: "success", value: "current-response" }]);
});

test("Evolution accepts a legitimate current request error", async () => {
  const guard = createLatestRequestGuard();
  const applied = [];
  const currentError = new Error("current-error");

  async function request(promise) {
    const version = guard.start();
    try {
      await promise;
    } catch (error) {
      if (guard.isCurrent(version)) applied.push({ status: "error", error });
    }
  }

  await request(Promise.reject(currentError));
  assert.deepEqual(applied, [{ status: "error", error: currentError }]);
});

test("Evolution ignores an old request error after a newer request succeeds", async () => {
  const guard = createLatestRequestGuard();
  const applied = [];
  let rejectA;
  const slowA = new Promise((resolve, reject) => { rejectA = reject; });

  async function request(promise) {
    const version = guard.start();
    try {
      const value = await promise;
      if (guard.isCurrent(version)) applied.push({ status: "success", value });
    } catch (error) {
      if (guard.isCurrent(version)) applied.push({ status: "error", error });
    }
  }

  const requestA = request(slowA);
  await request(Promise.resolve("B-newer"));
  rejectA(new Error("A-stale-error"));
  await requestA;

  assert.deepEqual(applied, [{ status: "success", value: "B-newer" }]);
});

test("Evolution isolates frequency, history, and assessments request versions", () => {
  const frequency = createLatestRequestGuard();
  const history = createLatestRequestGuard();
  const assessments = createLatestRequestGuard();
  const frequencyVersion = frequency.start();
  const historyVersion = history.start();
  const assessmentsVersion = assessments.start();
  frequency.start();
  assert.equal(frequency.isCurrent(frequencyVersion), false);
  assert.equal(history.isCurrent(historyVersion), true);
  assert.equal(assessments.isCurrent(assessmentsVersion), true);
});

test("Evolution request guard invalidates pending work on unmount", () => {
  const guard = createLatestRequestGuard();
  const version = guard.start();
  guard.invalidate();
  assert.equal(guard.isCurrent(version), false);
});
