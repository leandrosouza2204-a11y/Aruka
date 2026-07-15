import { RuleOutcome } from "../domain/enums.js";
import { validateRuleRegistry } from "../contracts/rule-contract.js";
import { deepFreeze } from "../utils/deep-freeze.js";

function rule(id, category, title) {
  return {
    id,
    version: "1.0.0",
    name: title,
    category,
    phase: category,
    title,
    severity: category === "validation" ? "error" : "decision",
    enabled: true,
    appliesTo: ["APL_MODEL_RECOMMENDATION"],
    evaluate() {
      return { outcome: RuleOutcome.NOT_APPLICABLE, reasonCodes: [], details: title };
    },
  };
}

const eligibility = [
  ["AOE-ELG-001", "Goal compatibility"],
  ["AOE-ELG-002", "Experience level ceiling"],
  ["AOE-ELG-003", "Weekly frequency minimum"],
  ["AOE-ELG-004", "Session duration minimum"],
  ["AOE-ELG-005", "Equipment compatibility"],
  ["AOE-ELG-006", "Recovery demand compatibility"],
  ["AOE-ELG-007", "Release active"],
  ["AOE-ELG-008", "Homologation required"],
  ["AOE-ELG-009", "Sex scope compatibility"],
  ["AOE-ELG-010", "Specialization prerequisite"],
].map(([id, title]) => rule(id, "eligibility", title));

const exclusion = [
  ["AOE-EXC-001", "Critical goal mismatch"],
  ["AOE-EXC-002", "Model above student level"],
  ["AOE-EXC-003", "Insufficient frequency"],
  ["AOE-EXC-004", "Insufficient duration"],
  ["AOE-EXC-005", "Missing essential equipment"],
  ["AOE-EXC-006", "Inactive release"],
  ["AOE-EXC-007", "Non homologated model"],
  ["AOE-EXC-008", "Insufficient recovery"],
  ["AOE-EXC-009", "Missing specialization readiness"],
  ["AOE-EXC-010", "Critical constraint conflict"],
].map(([id, title]) => rule(id, "exclusion", title));

const scoring = [
  ["AOE-SCR-001", "Goal fit score"],
  ["AOE-SCR-002", "Level fit score"],
  ["AOE-SCR-003", "Frequency fit score"],
  ["AOE-SCR-004", "Duration fit score"],
  ["AOE-SCR-005", "Equipment fit score"],
  ["AOE-SCR-006", "Recovery fit score"],
  ["AOE-SCR-007", "Adherence fit score"],
  ["AOE-SCR-008", "Split preference score"],
  ["AOE-SCR-009", "Strategy preference score"],
  ["AOE-SCR-010", "Specialization fit score"],
  ["AOE-SCR-011", "Operational simplicity score"],
  ["AOE-SCR-012", "Penalty application"],
].map(([id, title]) => rule(id, "scoring", title));

const validation = [
  ["AOE-VAL-001", "Input contract validation"],
  ["AOE-VAL-002", "Catalog contract validation"],
  ["AOE-VAL-003", "Version registry validation"],
  ["AOE-VAL-004", "Selected model presence"],
  ["AOE-VAL-005", "Score bounds validation"],
  ["AOE-VAL-006", "Ranking consistency"],
  ["AOE-VAL-007", "Trace completeness"],
  ["AOE-VAL-008", "Alternative uniqueness"],
  ["AOE-VAL-009", "Reason code centralization"],
  ["AOE-VAL-010", "Human review consistency"],
].map(([id, title]) => rule(id, "validation", title));

const confidence = [
  ["AOE-CON-001", "Input completeness confidence"],
  ["AOE-CON-002", "Constraint clarity confidence"],
  ["AOE-CON-003", "Catalog confidence"],
  ["AOE-CON-004", "Score separation confidence"],
  ["AOE-CON-005", "Conflict absence confidence"],
  ["AOE-CON-006", "Input consistency confidence"],
].map(([id, title]) => rule(id, "confidence", title));

const review = [
  ["AOE-REV-001", "Low confidence review"],
  ["AOE-REV-002", "Technical tie review"],
  ["AOE-REV-003", "Critical constraint review"],
  ["AOE-REV-004", "Specialization review"],
  ["AOE-REV-005", "Low recovery review"],
  ["AOE-REV-006", "Missing data review"],
  ["AOE-REV-007", "No eligible model review"],
  ["AOE-REV-008", "Warning accumulation review"],
].map(([id, title]) => rule(id, "review", title));

export const AOE_RULES = deepFreeze([
  ...eligibility,
  ...exclusion,
  ...scoring,
  ...validation,
  ...confidence,
  ...review,
]);

validateRuleRegistry(AOE_RULES);

export function listRules() {
  return AOE_RULES.map(({ id, category, title, severity }) => ({ id, category, title, severity }));
}
