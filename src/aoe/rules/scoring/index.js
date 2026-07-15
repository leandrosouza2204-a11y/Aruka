import { AOE_RULES } from "../index.js";

export const scoringRules = AOE_RULES.filter((rule) => rule.category === "scoring");
