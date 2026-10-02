import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FIXTURE_IDS, FIXTURE_NAMESPACE, STUDENT_EMAIL } from "./lib/cycle-12-14-manual-student-qa.mjs";

const provisioner = readFileSync(new URL("./provision-cycle-12-14-manual-student-qa.mjs", import.meta.url), "utf8");
const cleanup = readFileSync(new URL("./cleanup-cycle-12-14-manual-student-qa.mjs", import.meta.url), "utf8");
const smoke = readFileSync(new URL("./validate-cycle-12-14-manual-student-qa-smoke.mjs", import.meta.url), "utf8");
const docs = readFileSync(new URL("../docs/product-roadmap-v4-cycle-12-student-experience-v2/16-manual-qa-fixture.md", import.meta.url), "utf8");

test("manual fixture has an isolated deterministic namespace", () => {
  assert.equal(FIXTURE_NAMESPACE, "cycle-12-14-manual-qa");
  assert.equal(STUDENT_EMAIL, "student.qa.local@aruka.test");
  assert.equal(new Set(Object.values(FIXTURE_IDS).flat()).size, 16);
  assert.match(provisioner, /application_idempotency_key/);
  assert.match(provisioner, /MANUAL_QA_COLLISION/);
});

test("provisioner requires configured password and validates as the student", () => {
  assert.match(provisioner, /QA_USER_PASSWORD/);
  assert.match(provisioner, /signInWithPassword/);
  assert.match(provisioner, /get_my_student_home_v2/);
  assert.match(provisioner, /get_my_student_profile_v2/);
  assert.doesNotMatch(provisioner, /const\s+\w*PASSWORD\s*=\s*["'][^"']+["']/i);
});

test("cleanup preserves base by default and requires explicit full-destroy confirmation", () => {
  assert.match(cleanup, /id<>\$\{sqlLiteral\(FIXTURE_IDS\.historicalSession\)\}/);
  assert.match(cleanup, /--destroy-base/);
  assert.match(cleanup, /--confirm=/);
  assert.match(docs, /SKIPPED_TO_PRESERVE_MANUAL_QA_FIXTURE/);
});

test("browser smoke covers every manual V2 surface without starting a workout", () => {
  assert.match(smoke, /student-home-v2/);
  assert.match(smoke, /student-training-library-v2/);
  assert.match(smoke, /student-workout-detail-v2/);
  assert.match(smoke, /student-evolution-v2/);
  assert.match(smoke, /student-profile-v2/);
  assert.match(smoke, /workout-completion-result/);
  assert.doesNotMatch(smoke, /start_workout_execution_session/);
});
