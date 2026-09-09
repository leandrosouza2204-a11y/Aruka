import { readFileSync } from "node:fs";

const library = readFileSync("scripts/supabase-cycle-8-lib.mjs", "utf8");
const reset = readFileSync("scripts/reset-supabase-local-safe.mjs", "utf8");
const expectations = [
  "waitForSustainedFullStackReadiness",
  "requiredStableReads ?? 5",
  "RestartCount",
  "FULL_STACK_SUSTAINED_READINESS_FAILED",
  "auth/v1/health",
  "storage/v1/version",
  "rest/v1/",
  "waitForSustainedFullStackReadiness(root, { timeoutMs: 90000, requiredStableReads: 5 })",
];

for (const expected of expectations) {
  if (!(library.includes(expected) || reset.includes(expected))) throw new Error(`Missing full-stack readiness contract: ${expected}`);
}

console.log("SUPABASE_FULL_STACK_READINESS=PASS");
