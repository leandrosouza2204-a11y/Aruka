import test from "node:test";
import assert from "node:assert/strict";
import { buildBranchProtectionEvidence, validateArtifacts, validateRuleset, validateSuccessfulRun } from "../lib/cycle-9-1-github-client.mjs";

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

test("builds branch protection evidence after ruleset becomes available", () => {
  const evidence = buildBranchProtectionEvidence(
    [
      {
        id: 9,
        name: "Protect main",
        enforcement: "active",
        bypass_actors: [],
        rules: [
          { type: "pull_request" },
          { type: "required_status_checks", parameters: { required_status_checks: [{ context: "validation" }] } },
        ],
      },
    ],
    { collectedAt: "2026-07-19T00:00:00.000Z" },
  );

  assert.equal(evidence.result, "BRANCH_PROTECTION_COLLECTED");
  assert.equal(evidence.validation.result, "BRANCH_PROTECTION_VALIDATED");
  assert.equal(evidence.validation.ruleset_id, 9);
  assert.equal(evidence.collected_at, "2026-07-19T00:00:00.000Z");
});
