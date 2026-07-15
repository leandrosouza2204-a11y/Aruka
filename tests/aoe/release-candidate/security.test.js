import test from "node:test";
import assert from "node:assert/strict";
import { validateDecisionRequestV1, PUBLIC_CONTRACT_VERSION } from "../../../src/aoe/index.js";

test("public request rejects dangerous keys and invalid enums", () => {
  const request = {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId: "req_security",
    idempotencyKey: "idem_security",
    actor: { actorId: "actor", role: "ROOT" },
    student: { studentId: "student", goal: "HYPERTROPHY", experienceLevel: "BEGINNER", availableDaysPerWeek: 3, availableMinutesPerSession: 60, equipmentProfile: "FULL_GYM", constraints: [], recovery: {}, constructor: "x" },
    options: { maxAlternatives: 2, includeDecisionTrace: false, requireHumanReviewBeforeDelivery: false, activeReleases: [] },
  };
  const result = validateDecisionRequestV1(request);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((item) => item.field.includes("constructor")));
});
