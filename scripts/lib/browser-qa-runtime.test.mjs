import assert from "node:assert/strict";
import test from "node:test";
import { removeQaProfileDir, waitForBrowserReadiness } from "./browser-qa-runtime.mjs";

test("browser readiness retries one transient empty React mount and records attempts", async () => {
  let cycle = 0;
  let retries = 0;
  const result = await waitForBrowserReadiness({
    timeoutMs: 1,
    pollMs: 0,
    maxTransientRetries: 1,
    probe: async () => cycle === 0 ? { ready: false, phase: "react-mount-empty" } : { ready: true, phase: "react-ready" },
    retryTransient: async () => { retries += 1; cycle += 1; },
  });
  assert.equal(retries, 1);
  assert.deepEqual(result.attempts.map(({ status }) => status), ["TRANSIENT_FAIL", "PASS"]);
});

test("browser readiness does not retry a functional assertion failure", async () => {
  let retries = 0;
  await assert.rejects(() => waitForBrowserReadiness({
    timeoutMs: 1,
    pollMs: 0,
    probe: async () => ({ ready: false, phase: "functional-readiness-pending" }),
    retryTransient: async () => { retries += 1; },
  }), { code: "QA_BROWSER_READINESS_FAILED" });
  assert.equal(retries, 0);
});

test("browser readiness fails immediately on a product/runtime fatal", async () => {
  let retries = 0;
  await assert.rejects(() => waitForBrowserReadiness({
    timeoutMs: 50,
    pollMs: 0,
    probe: async () => ({ fatal: true, phase: "runtime-exception", message: "render crashed" }),
    retryTransient: async () => { retries += 1; },
  }), { code: "QA_BROWSER_FATAL" });
  assert.equal(retries, 0);
});

test("profile cleanup retries only transient Windows-style locks", async () => {
  let calls = 0;
  const result = await removeQaProfileDir("synthetic", {
    retryDelaysMs: [0, 0],
    pathExists: () => false,
    remove() { calls += 1; if (calls < 3) throw Object.assign(new Error("locked"), { code: "EPERM" }); },
  });
  assert.equal(result.attempts, 3);
  await assert.rejects(() => removeQaProfileDir("synthetic", { remove() { throw Object.assign(new Error("bad"), { code: "EINVAL" }); } }), { code: "EINVAL" });
});
