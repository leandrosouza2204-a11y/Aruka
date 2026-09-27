import assert from "node:assert/strict";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { atomicWriteJson, beginVisualQaEvidence } from "./visual-qa-evidence.mjs";

function sandbox(name) {
  const dir = join(tmpdir(), `aruka-visual-evidence-${name}-${process.pid}-${Date.now()}`);
  mkdirSync(dir, { recursive: true });
  return { dir, report: join(dir, "report.json"), read: () => JSON.parse(readFileSync(join(dir, "report.json"), "utf8")), cleanup: () => rmSync(dir, { recursive: true, force: true }) };
}

test("successful current execution produces PASS", () => {
  const box = sandbox("pass");
  try {
    const run = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), requiredScenarios: ["render"], setProcessExitCode: false });
    run.scenario("render", "PASS");
    run.executionSucceeded({ result: "ok" });
    run.finalize();
    assert.equal(box.read().decision, "PASS");
    assert.ok(box.read().finished_at);
  } finally { box.cleanup(); }
});

test("authentication failure replaces stale PASS with current FAIL", () => {
  const box = sandbox("auth");
  try {
    writeFileSync(box.report, JSON.stringify({ decision: "PASS", run_id: "stale" }));
    const run = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), setProcessExitCode: false });
    assert.equal(box.read().decision, "PARTIAL");
    run.executionFailed(new Error("invalid_credentials"), "setup");
    run.finalize();
    assert.equal(box.read().decision, "FAIL");
    assert.notEqual(box.read().run_id, "stale");
  } finally { box.cleanup(); }
});

test("navigation failure produces FAIL", () => {
  const box = sandbox("navigation");
  try {
    const run = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), setProcessExitCode: false });
    run.executionFailed(new Error("canonical route mismatch"));
    run.finalize();
    assert.match(box.read().failures[0].message, /canonical route/);
    assert.equal(box.read().decision, "FAIL");
  } finally { box.cleanup(); }
});

test("cleanup failure is recorded and prevents PASS", () => {
  const box = sandbox("cleanup");
  try {
    const run = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), setProcessExitCode: false });
    run.executionSucceeded();
    run.cleanupFailed(new Error("delete fixture failed"));
    run.finalize();
    assert.equal(box.read().cleanup.status, "FAIL");
    assert.equal(box.read().decision, "FAIL");
  } finally { box.cleanup(); }
});

test("missing mandatory scenario prevents integral approval", () => {
  const box = sandbox("partial");
  try {
    const run = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), requiredScenarios: ["required"], setProcessExitCode: false });
    run.executionSucceeded();
    run.finalize();
    assert.equal(box.read().decision, "FAIL");
    assert.equal(box.read().failures[0].code, "QA_REQUIRED_SCENARIO");
  } finally { box.cleanup(); }
});

test("concurrent execution cannot overwrite canonical evidence with false PASS", () => {
  const box = sandbox("concurrent");
  try {
    const first = beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), runId: "first", setProcessExitCode: false });
    assert.throws(() => beginVisualQaEvidence({ gate: "TEST", reportPath: box.report, cwd: process.cwd(), runId: "second", setProcessExitCode: false }), { code: "QA_GATE_CONCURRENT" });
    assert.equal(box.read().run_id, "first");
    assert.equal(box.read().decision, "PARTIAL");
    first.executionSucceeded();
    first.finalize();
  } finally { box.cleanup(); }
});

test("atomic writer recovers only from bounded transient Windows rename locks", () => {
  const box = sandbox("transient-rename");
  try {
    const delays = [];
    let calls = 0;
    const result = atomicWriteJson(box.report, { decision: "PASS" }, {
      platform: "win32",
      delay: (milliseconds) => delays.push(milliseconds),
      retryDelaysMs: [1, 2, 3],
      rename(from, to) {
        calls += 1;
        if (calls < 3) throw Object.assign(new Error("locked"), { code: calls === 1 ? "EPERM" : "EBUSY" });
        renameSync(from, to);
      },
    });
    assert.equal(result.attempts, 3);
    assert.deepEqual(delays, [1, 2]);
    assert.equal(box.read().decision, "PASS");
    assert.equal(readdirSync(box.dir).filter((name) => name.endsWith(".tmp")).length, 0);
  } finally { box.cleanup(); }
});

test("atomic writer fails closed after persistent Windows lock and preserves stale evidence", () => {
  const box = sandbox("persistent-rename");
  try {
    writeFileSync(box.report, JSON.stringify({ decision: "PASS", run_id: "stale" }));
    let calls = 0;
    assert.throws(() => atomicWriteJson(box.report, { decision: "FAIL", run_id: "current" }, {
      platform: "win32",
      delay: () => {},
      retryDelaysMs: [0, 0],
      rename() { calls += 1; throw Object.assign(new Error("still locked"), { code: "EACCES" }); },
    }), (error) => error.code === "EACCES" && error.atomicWrite.attempts === 3);
    assert.equal(calls, 3);
    assert.equal(box.read().run_id, "stale");
    assert.equal(readdirSync(box.dir).filter((name) => name.endsWith(".tmp")).length, 1);
  } finally { box.cleanup(); }
});

test("atomic writer never retries non-transient failures", () => {
  const box = sandbox("non-transient");
  try {
    let calls = 0;
    assert.throws(() => atomicWriteJson(box.report, { decision: "PASS" }, {
      platform: "win32",
      delay: () => assert.fail("non-transient failure must not back off"),
      rename() { calls += 1; throw Object.assign(new Error("invalid target"), { code: "EINVAL" }); },
    }), { code: "EINVAL" });
    assert.equal(calls, 1);
  } finally { box.cleanup(); }
});

test("atomic writer uses isolated temporary files for adjacent runs", () => {
  const box = sandbox("isolated-temp");
  try {
    const temporaries = [];
    for (const runId of ["run-a", "run-b"]) {
      atomicWriteJson(box.report, { run_id: runId }, {
        createId: () => runId,
        rename(from, to) { temporaries.push(from); renameSync(from, to); },
      });
    }
    assert.notEqual(temporaries[0], temporaries[1]);
    assert.equal(box.read().run_id, "run-b");
  } finally { box.cleanup(); }
});

test("evidence initialization write failure releases its run lock", () => {
  const box = sandbox("write-failure");
  try {
    assert.throws(() => beginVisualQaEvidence({
      gate: "TEST",
      reportPath: box.report,
      setProcessExitCode: false,
      writeJson() { throw Object.assign(new Error("disk unavailable"), { code: "EIO" }); },
    }), { code: "EIO" });
    assert.equal(existsSync(`${box.report}.lock`), false);
  } finally { box.cleanup(); }
});
