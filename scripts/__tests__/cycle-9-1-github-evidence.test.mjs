import test from "node:test";
import assert from "node:assert/strict";
import {
  buildBranchProtectionEvidence,
  collectProtectMainRuleset,
  validateArtifacts,
  validateRuleset,
  validateSuccessfulRun,
  validateSuccessfulValidationCheckRun,
} from "../lib/cycle-9-1-github-client.mjs";

function protectMainRuleset(overrides = {}) {
  return {
    conditions: {
      ref_name: {
        exclude: [],
        include: ["refs/heads/main"],
      },
    },
    enforcement: "active",
    id: 19182738,
    name: "Protect main",
    rules: [
      {
        type: "pull_request",
        parameters: {
          required_approving_review_count: 0,
        },
      },
      {
        type: "required_status_checks",
        parameters: {
          do_not_enforce_on_create: false,
          required_status_checks: [
            {
              context: "validation",
              integration_id: 15368,
            },
            {
              context: "Supabase Local Quality Gates / validation",
            },
          ],
          strict_required_status_checks_policy: false,
        },
      },
    ],
    target: "branch",
    ...overrides,
  };
}

function validationCheckRun(overrides = {}) {
  return {
    app: { name: "GitHub Actions" },
    name: "validation",
    conclusion: "success",
    status: "completed",
    ...overrides,
  };
}

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
  const ruleset = validateRuleset([protectMainRuleset({ id: 7 })]);
  assert.equal(ruleset.ruleset.id, 7);
  assert.equal(ruleset.validation_context.context, "validation");
});

test("builds branch protection evidence after ruleset becomes available", () => {
  const evidence = buildBranchProtectionEvidence(
    [protectMainRuleset({ id: 9 })],
    { collectedAt: "2026-07-19T00:00:00.000Z", checkRun: validationCheckRun() },
  );

  assert.equal(evidence.result, "BRANCH_PROTECTION_COLLECTED");
  assert.equal(evidence.validation.result, "BRANCH_PROTECTION_VALIDATED");
  assert.equal(evidence.validation.ruleset_id, 9);
  assert.equal(evidence.validation.validated_context, "validation");
  assert.equal(evidence.validation.integration_id, 15368);
  assert.equal(evidence.validation.check_run.name, "validation");
  assert.equal(evidence.collected_at, "2026-07-19T00:00:00.000Z");
});

test("approves the real Protect main ruleset shape", () => {
  const evidence = buildBranchProtectionEvidence([protectMainRuleset()], { checkRun: validationCheckRun() });
  assert.equal(evidence.validation.target, "branch");
  assert.deepEqual(evidence.validation.target_branches, ["refs/heads/main"]);
  assert.equal(evidence.validation.required_status_checks_found.length, 2);
  assert.equal(evidence.validation.redundant_required_status_checks.length, 1);
});

test("approves validation context with GitHub Actions integration id", () => {
  const ruleset = protectMainRuleset({
    rules: [
      { type: "pull_request" },
      { type: "required_status_checks", parameters: { required_status_checks: [{ context: "validation", integration_id: 15368 }] } },
    ],
  });

  assert.equal(validateRuleset([ruleset]).validation_context.integration_id, 15368);
});

test("approves validation context plus redundant workflow context", () => {
  const result = validateRuleset([protectMainRuleset()]);
  assert.equal(result.validation_context.context, "validation");
  assert.equal(result.redundant_required_status_checks[0].context, "Supabase Local Quality Gates / validation");
});

test("rejects legacy workflow context without validation context", () => {
  const ruleset = protectMainRuleset({
    rules: [
      { type: "pull_request" },
      { type: "required_status_checks", parameters: { required_status_checks: [{ context: "Supabase Local Quality Gates / validation" }] } },
    ],
  });

  assert.throws(() => validateRuleset([ruleset]), /missing required pull request\/status check/);
});

test("rejects Protect main without pull request rule", () => {
  const ruleset = protectMainRuleset({
    rules: [{ type: "required_status_checks", parameters: { required_status_checks: [{ context: "validation", integration_id: 15368 }] } }],
  });

  assert.throws(() => validateRuleset([ruleset]), /missing required pull request\/status check/);
});

test("rejects Protect main without required status checks rule", () => {
  const ruleset = protectMainRuleset({ rules: [{ type: "pull_request" }] });

  assert.throws(() => validateRuleset([ruleset]), /missing required pull request\/status check/);
});

test("rejects disabled Protect main ruleset", () => {
  assert.throws(() => validateRuleset([protectMainRuleset({ enforcement: "disabled" })]), /Active Protect main ruleset/);
});

test("rejects Protect main ruleset scoped away from main", () => {
  const ruleset = protectMainRuleset({ conditions: { ref_name: { exclude: [], include: ["refs/heads/develop"] } } });

  assert.throws(() => validateRuleset([ruleset]), /refs\/heads\/main/);
});

test("accepts successful GitHub Actions validation check run", () => {
  assert.equal(validateSuccessfulValidationCheckRun(validationCheckRun()).name, "validation");
});

test("rejects string app but includes safe diagnostic", () => {
  assert.throws(
    () => validateSuccessfulValidationCheckRun(validationCheckRun({ app: "GitHub Actions" })),
    /app mismatch\. Received check run: .*"app":"GitHub Actions".*"app_type":"string"/,
  );
});

test("diagnoses null check run app", () => {
  assert.throws(
    () => validateSuccessfulValidationCheckRun(validationCheckRun({ app: null })),
    /"app":null.*"app_type":"object"/,
  );
});

test("diagnoses object app name mismatch", () => {
  assert.throws(
    () => validateSuccessfulValidationCheckRun(validationCheckRun({ app: { name: "Other App", slug: "other", id: 42 } })),
    /"app_name":"Other App"/,
  );
});

test("diagnoses missing check run without secondary serialization errors", () => {
  assert.throws(
    () => validateSuccessfulValidationCheckRun(null),
    /validation check run missing\. Received check run: .*"keys":\[\]/,
  );
});

test("does not dump secret-like fields from check run or app objects", () => {
  assert.throws(
    () => validateSuccessfulValidationCheckRun({
      name: "validation",
      status: "completed",
      conclusion: "success",
      token: "github_pat_should_not_appear",
      app: {
        name: "Other App",
        slug: "other",
        id: 42,
        private_key: "-----BEGIN PRIVATE KEY-----",
      },
    }),
    (error) => {
      assert.match(error.message, /"app_name":"Other App"/);
      assert.doesNotMatch(error.message, /github_pat_should_not_appear/);
      assert.doesNotMatch(error.message, /PRIVATE KEY/);
      return true;
    },
  );
});

test("rejects failed validation check run for success collection", () => {
  assert.throws(() => validateSuccessfulValidationCheckRun(validationCheckRun({ conclusion: "failure" })), /conclusion is not success/);
});

test("rejects lookalike validation check run name", () => {
  assert.throws(() => validateSuccessfulValidationCheckRun(validationCheckRun({ name: "validations" })), /name mismatch/);
});

test("does not reject unknown extra required status checks", () => {
  const ruleset = protectMainRuleset({
    rules: [
      { type: "pull_request" },
      {
        type: "required_status_checks",
        parameters: {
          required_status_checks: [
            { context: "validation", integration_id: 15368 },
            { context: "some-other-check" },
          ],
        },
      },
    ],
  });

  assert.equal(validateRuleset([ruleset]).validation_context.context, "validation");
});

test("collects detailed Protect main ruleset after list endpoint returns summary", () => {
  const calls = [];
  const detail = protectMainRuleset();
  const ruleset = collectProtectMainRuleset({
    ghJson(args) {
      calls.push(args);
      if (args[1] === "repos/leandrosouza2204-a11y/Aruka/rulesets") {
        return [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
      }
      if (args[1] === "repos/leandrosouza2204-a11y/Aruka/rulesets/19182738") return detail;
      throw new Error(`unexpected gh api call: ${args.join(" ")}`);
    },
  });

  assert.equal(ruleset.conditions.ref_name.include[0], "refs/heads/main");
  assert.deepEqual(calls, [
    ["api", "repos/leandrosouza2204-a11y/Aruka/rulesets"],
    ["api", "repos/leandrosouza2204-a11y/Aruka/rulesets/19182738"],
  ]);
});

test("builds validated branch protection evidence from detailed ruleset", () => {
  const summary = [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
  const detail = protectMainRuleset();
  const ruleset = collectProtectMainRuleset({
    ghJson(args) {
      return args[1].endsWith("/19182738") ? detail : summary;
    },
  });
  const evidence = buildBranchProtectionEvidence([ruleset], { checkRun: validationCheckRun() });

  assert.equal(evidence.result, "BRANCH_PROTECTION_COLLECTED");
  assert.equal(evidence.validation.result, "BRANCH_PROTECTION_VALIDATED");
});

test("does not validate list endpoint summary as a complete ruleset", () => {
  const summaryOnly = [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
  assert.throws(() => buildBranchProtectionEvidence(summaryOnly, { checkRun: validationCheckRun() }), /refs\/heads\/main/);

  const ruleset = collectProtectMainRuleset({
    ghJson(args) {
      return args[1].endsWith("/19182738") ? protectMainRuleset() : summaryOnly;
    },
  });
  assert.equal(buildBranchProtectionEvidence([ruleset], { checkRun: validationCheckRun() }).validation.result, "BRANCH_PROTECTION_VALIDATED");
});

test("rejects Protect main summary without id clearly", () => {
  assert.throws(
    () => collectProtectMainRuleset({
      ghJson() {
        return [{ name: "Protect main", target: "branch", enforcement: "active" }];
      },
    }),
    /summary is missing id/,
  );
});

test("reports detailed Protect main ruleset retrieval failure clearly", () => {
  assert.throws(
    () => collectProtectMainRuleset({
      ghJson(args) {
        if (args[1].endsWith("/rulesets")) return [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
        throw new Error("HTTP 404");
      },
    }),
    /Unable to retrieve detailed Protect main ruleset: HTTP 404/,
  );
});

test("rejects detailed Protect main ruleset scoped away from main", () => {
  const detail = protectMainRuleset({ conditions: { ref_name: { exclude: [], include: ["refs/heads/develop"] } } });
  const ruleset = collectProtectMainRuleset({
    ghJson(args) {
      return args[1].endsWith("/19182738") ? detail : [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
    },
  });

  assert.throws(() => buildBranchProtectionEvidence([ruleset], { checkRun: validationCheckRun() }), /refs\/heads\/main/);
});

test("approves detailed real Protect main ruleset returned by ruleset detail endpoint", () => {
  const ruleset = collectProtectMainRuleset({
    ghJson(args) {
      return args[1].endsWith("/19182738")
        ? protectMainRuleset({
            rules: [
              { type: "deletion" },
              { type: "non_fast_forward" },
              { type: "pull_request" },
              {
                type: "required_status_checks",
                parameters: {
                  required_status_checks: [
                    { context: "validation", integration_id: 15368 },
                    { context: "Supabase Local Quality Gates / validation" },
                  ],
                },
              },
            ],
          })
        : [{ id: 19182738, name: "Protect main", target: "branch", enforcement: "active" }];
    },
  });
  const evidence = buildBranchProtectionEvidence([ruleset], { checkRun: validationCheckRun() });

  assert.equal(evidence.result, "BRANCH_PROTECTION_COLLECTED");
  assert.equal(evidence.validation.result, "BRANCH_PROTECTION_VALIDATED");
});
