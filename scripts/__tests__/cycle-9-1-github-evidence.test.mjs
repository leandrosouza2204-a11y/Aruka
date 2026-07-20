import test from "node:test";
import assert from "node:assert/strict";
import { validateArtifacts, validateRuleset, validateSuccessfulRun } from "../lib/cycle-9-1-github-client.mjs";

test("accepts the expected successful pull_request validation job", () => {
  const run = {
    name: "Supabase Local Quality Gates",
    event: "pull_request",
    conclusion: "success",
    headBranch: "chore/supabase-ci-runtime-validation",
    jobs: [{ name: "validation", conclusion: "success" }],
  };
  assert.equal(validateSuccessfulRun(run, { branch: "chore/supabase-ci-runtime-validation" }).name, "validation");
});

test("rejects wrong workflow or failed run", () => {
  assert.throws(
    () => validateSuccessfulRun({ name: "Other", event: "pull_request", conclusion: "failure", jobs: [] }),
    /workflow name mismatch/,
  );
});

test("finds Supabase quality artifacts", () => {
  const artifacts = validateArtifacts([{ id: 1, name: "supabase-quality-evidence-1", expired: false }]);
  assert.equal(artifacts.length, 1);
});

test("rejects missing evidence artifacts", () => {
  assert.throws(() => validateArtifacts([{ name: "other" }]), /No Supabase quality evidence/);
});

test("validates Protect main ruleset essentials", () => {
  const ruleset = validateRuleset([
    {
      id: 7,
      name: "Protect main",
      enforcement: "active",
      bypass_actors: [],
      rules: [
        { type: "pull_request" },
        { type: "required_status_checks", parameters: { required_status_checks: [{ context: "validation" }] } },
      ],
    },
  ]);
  assert.equal(ruleset.id, 7);
});
