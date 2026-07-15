import { validatePublicContracts } from "./public-contract-validator.js";
import { validateContractFreeze } from "../../release/index.js";

export function runIntegrationValidators() {
  const publicContracts = validatePublicContracts();
  const contractFreeze = validateContractFreeze();
  const checks = [...publicContracts.checks, { name: "contract freeze parseable", passed: contractFreeze.valid, blocking: true }];
  return { valid: checks.every((item) => item.passed), checks, contractFreeze };
}
