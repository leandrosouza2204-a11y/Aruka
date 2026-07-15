import { AOE_RULES } from "../index.js";

export const eligibilityRules = AOE_RULES.filter((rule) => rule.category === "eligibility");
