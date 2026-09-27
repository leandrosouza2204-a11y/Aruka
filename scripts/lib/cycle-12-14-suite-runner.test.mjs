import assert from "node:assert/strict";
import test from "node:test";
import { validateFreshEvidence } from "./cycle-12-14-suite-runner.mjs";

const now = Date.now();
const valid = { decision: "PASS", current_run: true, run_id: "run-current", head: "abc", started_at: new Date(now).toISOString(), finished_at: new Date(now + 1).toISOString() };

test("suite runner accepts only fresh current PASS for the expected HEAD", () => {
  assert.equal(validateFreshEvidence(valid, { startedAt: now, head: "abc", gate: "gate" }).run_id, "run-current");
});

test("suite runner rejects stale PASS and non-PASS child evidence", () => {
  assert.throws(() => validateFreshEvidence({ ...valid, started_at: new Date(now - 10_000).toISOString() }, { startedAt: now, head: "abc", gate: "gate" }), { code: "QA_CHILD_EVIDENCE_STALE" });
  assert.throws(() => validateFreshEvidence({ ...valid, decision: "FAIL" }, { startedAt: now, head: "abc", gate: "gate" }), { code: "QA_CHILD_EVIDENCE_NOT_PASS" });
});

test("suite runner rejects evidence from another HEAD", () => {
  assert.throws(() => validateFreshEvidence(valid, { startedAt: now, head: "def", gate: "gate" }), { code: "QA_CHILD_EVIDENCE_WRONG_HEAD" });
});
