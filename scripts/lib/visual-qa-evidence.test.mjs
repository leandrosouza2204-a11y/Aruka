import assert from "node:assert/strict";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { beginVisualQaEvidence } from "./visual-qa-evidence.mjs";

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
