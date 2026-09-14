import assert from "node:assert/strict";
import test from "node:test";
import { isStudentExperienceV2Enabled } from "./config/studentExperienceV2Config.js";
import { isValidMetricSession, SHORT_WORKOUT_THRESHOLD_SECONDS } from "./domain/studentExperienceV2Contracts.js";
import { resolveStudentExperienceV2Access, STUDENT_V2_ACCESS } from "./guards/studentExperienceV2Access.js";

test("rollout defaults off and only accepts explicit true", () => {
  assert.equal(isStudentExperienceV2Enabled(), false);
  assert.equal(isStudentExperienceV2Enabled("true"), true);
  assert.equal(isStudentExperienceV2Enabled("false"), false);
});

test("student guard contract accepts only linked active students", () => {
  assert.equal(resolveStudentExperienceV2Access({ student: { id: "a" }, studentAccess: { status: "active" } }).state, STUDENT_V2_ACCESS.ALLOWED);
  assert.equal(resolveStudentExperienceV2Access({ student: { id: "a" }, studentAccess: { status: "suspended" } }).state, STUDENT_V2_ACCESS.INACTIVE);
  assert.equal(resolveStudentExperienceV2Access({ student: null, studentAccess: { status: "active" } }).state, STUDENT_V2_ACCESS.UNLINKED);
});

test("only completed sessions are valid metrics and threshold is authoritative", () => {
  assert.equal(isValidMetricSession({ status: "completed", shortDurationConfirmed: true }), true);
  assert.equal(isValidMetricSession({ status: "abandoned" }), false);
  assert.equal(isValidMetricSession({ status: "cancelled" }), false);
  assert.equal(SHORT_WORKOUT_THRESHOLD_SECONDS, 300);
});
