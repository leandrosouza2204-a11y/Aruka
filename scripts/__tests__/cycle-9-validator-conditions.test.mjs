import { strict as assert } from "node:assert";
import test from "node:test";
import {
  conditionRequiresSupabaseRelevance,
  conditionUsesAlways,
  validateWorkflowStructure,
} from "../validate-supabase-cycle-9.mjs";
import { WORKFLOW_PATH, readYaml } from "../supabase-cycle-9-lib.mjs";

const root = process.cwd();
const workflow = readYaml(root, WORKFLOW_PATH);

function cloneWorkflow() {
  return structuredClone(workflow);
}

function cleanupStep(candidate) {
  return candidate.jobs.validation.steps.find((step) => /supabase:ci:cleanup/.test(step.run ?? ""));
}

function uploadStep(candidate) {
  return candidate.jobs.validation.steps.find((step) => step.uses === "actions/upload-artifact@v4");
}

function errorsFor(mutator) {
  const candidate = cloneWorkflow();
  mutator(candidate);
  return validateWorkflowStructure(candidate);
}

function assertAccepted(mutator) {
  assert.deepEqual(errorsFor(mutator), []);
}

function assertRejected(mutator, expected) {
  assert.match(errorsFor(mutator).join("\n"), expected);
}

test("accepts the real workflow with composed cleanup and upload conditions", () => {
  assert.deepEqual(validateWorkflowStructure(workflow), []);
  assert.equal(cleanupStep(workflow).if, "${{ always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}");
  assert.equal(uploadStep(workflow).if, "${{ always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}");
});

test("detects always() and Supabase relevance semantically", () => {
  const validConditions = [
    "${{ always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}",
    "${{ steps.detect_changes.outputs.supabase_relevant == 'true' && always() }}",
    "${{  always ( )  &&  steps.detect_changes.outputs.supabase_relevant == 'true'  }}",
    "${{ always() && steps.detect_changes.outputs.supabase_relevant == \"true\" }}",
  ];

  for (const condition of validConditions) {
    assert.equal(conditionUsesAlways(condition), true, condition);
    assert.equal(conditionRequiresSupabaseRelevance(condition), true, condition);
    assertAccepted((candidate) => {
      cleanupStep(candidate).if = condition;
      uploadStep(candidate).if = condition;
    });
  }
});

test("keeps always() detection compatible with the historical expression", () => {
  assert.equal(conditionUsesAlways("${{ always() }}"), true);
});

test("rejects unsafe cleanup and upload conditions", () => {
  const invalidConditions = [
    ["missing if", undefined, /condition is missing/],
    ["relevance only", "${{ steps.detect_changes.outputs.supabase_relevant == 'true' }}", /must include always\(\)/],
    ["success", "${{ success() && steps.detect_changes.outputs.supabase_relevant == 'true' }}", /must include always\(\)/],
    ["failure", "${{ failure() && steps.detect_changes.outputs.supabase_relevant == 'true' }}", /must include always\(\)/],
    ["not cancelled", "${{ !cancelled() && steps.detect_changes.outputs.supabase_relevant == 'true' }}", /must include always\(\)/],
    ["not always", "${{ not_always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}", /must include always\(\)/],
    ["always without call", "${{ always }}", /must include always\(\)/],
    ["plain true", "true", /must include always\(\)/],
    ["always without relevance", "${{ always() }}", /must require steps\.detect_changes\.outputs\.supabase_relevant == 'true'/],
    ["wrong step output", "${{ always() && steps.other.outputs.supabase_relevant == 'true' }}", /must require steps\.detect_changes\.outputs\.supabase_relevant == 'true'/],
    ["false relevance", "${{ always() && steps.detect_changes.outputs.supabase_relevant == 'false' }}", /must require steps\.detect_changes\.outputs\.supabase_relevant == 'true'/],
  ];

  for (const [name, condition, expected] of invalidConditions) {
    assertRejected((candidate) => {
      if (condition === undefined) delete cleanupStep(candidate).if;
      else cleanupStep(candidate).if = condition;
    }, new RegExp(`Cleanup step .*${expected.source}`));

    assertRejected((candidate) => {
      if (condition === undefined) delete uploadStep(candidate).if;
      else uploadStep(candidate).if = condition;
    }, new RegExp(`Artifact upload .*${expected.source}`));
  }
});

test("rejects workflow regressions around required validation architecture", () => {
  assertRejected((candidate) => {
    cleanupStep(candidate)["continue-on-error"] = true;
  }, /continue-on-error must not be used/);

  assertRejected((candidate) => {
    candidate.jobs.required_validation = candidate.jobs.validation;
    delete candidate.jobs.validation;
  }, /validation job missing/);

  assertRejected((candidate) => {
    candidate.on.pull_request.paths = ["docs/**"];
  }, /pull_request must not use paths or paths-ignore/);
});
