import { AOE_RULES } from "../index.js";

export const validationRules = AOE_RULES.filter((rule) => rule.category === "validation");
