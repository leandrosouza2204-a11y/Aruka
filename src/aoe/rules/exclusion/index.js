import { AOE_RULES } from "../index.js";

export const exclusionRules = AOE_RULES.filter((rule) => rule.category === "exclusion");
