import assert from "node:assert/strict";
import { test } from "node:test";
import { canUseStudentExperienceV2, normalizeStudentExperienceRouteDecision } from "./studentExperienceRouteDecision.js";

test("normalizes server decision and active workout pin", () => {
  assert.deepEqual(normalizeStudentExperienceRouteDecision({ experience: "v2", reasonCode: "ACTIVE_V2_WORKOUT", configVersion: 7, activeWorkout: { sessionId: "session-1", experienceOrigin: "v2" } }), {
    experience: "v2", reasonCode: "ACTIVE_V2_WORKOUT", configVersion: 7, activeWorkout: { sessionId: "session-1", experienceOrigin: "v2" },
  });
});

test("invalid or missing decision fails closed", () => {
  assert.equal(normalizeStudentExperienceRouteDecision(null).experience, "v1");
  assert.equal(normalizeStudentExperienceRouteDecision({ experience: "unexpected" }).experience, "v1");
});

test("build capability alone never grants V2", () => {
  assert.equal(canUseStudentExperienceV2({ experience: "v1" }, true), false);
  assert.equal(canUseStudentExperienceV2({ experience: "v2" }, false), false);
  assert.equal(canUseStudentExperienceV2({ experience: "v2" }, true), true);
});
