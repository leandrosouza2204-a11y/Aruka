import assert from "node:assert/strict";
import {
  createFinding,
  normalizeSeverity,
  RULE_SCOPES,
  SEVERITIES,
  sortFindings,
  validateFinding,
  validateRuleDefinition,
} from "./rule-contract.mjs";

const validRule = {
  id: "valid-rule",
  name: "Valid rule",
  description: "Validates the contract.",
  severity: SEVERITIES.INFO,
  scope: RULE_SCOPES.DOCUMENT,
  enabled: true,
  tags: ["contract"],
  async run() {
    return [];
  },
};

assert.equal(validateRuleDefinition(validRule, "memory"), true);
assert.throws(() => validateRuleDefinition({ ...validRule, id: "" }), /id obrigatorio/);
assert.throws(() => validateRuleDefinition({ ...validRule, severity: "major" }), /severity invalida/);
assert.throws(() => validateRuleDefinition({ ...validRule, scope: "unknown" }), /scope invalido/);
assert.throws(() => validateRuleDefinition({ ...validRule, run: undefined }), /run assincrono/);

const runResult = await validRule.run({});
assert.equal(Array.isArray(runResult), true);

const invalidRunRule = {
  ...validRule,
  id: "invalid-return-rule",
  async run() {
    return "not-array";
  },
};
assert.equal(Array.isArray(await invalidRunRule.run({})), false);

assert.throws(() => createFinding({ ruleId: "x", severity: "info" }), /message/);
assert.throws(
  () => createFinding({ ruleId: "x", severity: "info", message: "Bad line", line: 0 }),
  /line invalido/,
);

assert.equal(normalizeSeverity("WARNING"), SEVERITIES.WARNING);
assert.equal(validateFinding(createFinding({ ruleId: "x", severity: "info", message: "Ok" })), true);

const sorted = sortFindings([
  createFinding({ ruleId: "a", severity: "info", message: "Info" }),
  createFinding({ ruleId: "b", severity: "error", message: "Error" }),
]);
assert.equal(sorted[0].severity, SEVERITIES.ERROR);

const duplicateIds = [validRule, { ...validRule }];
assert.equal(new Set(duplicateIds.map((rule) => rule.id)).size, 1);

console.log("AQA rule contract tests passed.");
