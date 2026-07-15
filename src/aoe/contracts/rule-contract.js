import { AOERuleContractError } from "../domain/errors.js";

export function validateRule(rule) {
  for (const key of ["id", "version", "name", "category", "phase", "severity", "enabled", "appliesTo", "evaluate"]) {
    if (rule[key] === undefined) throw new AOERuleContractError(`Rule ${rule.id || "unknown"} missing ${key}.`);
  }
  if (typeof rule.evaluate !== "function") throw new AOERuleContractError(`Rule ${rule.id} evaluate must be a function.`);
  return true;
}

export function validateRuleRegistry(rules) {
  const ids = new Set();
  for (const rule of rules) {
    validateRule(rule);
    if (ids.has(rule.id)) throw new AOERuleContractError(`Duplicate rule id: ${rule.id}`);
    ids.add(rule.id);
  }
  return true;
}
