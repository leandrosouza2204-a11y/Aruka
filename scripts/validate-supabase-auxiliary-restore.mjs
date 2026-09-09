import { readFileSync } from "node:fs";

const library = readFileSync("scripts/supabase-cycle-8-lib.mjs", "utf8");
const reset = readFileSync("scripts/reset-supabase-local-safe.mjs", "utf8");
const checks = [
  [library, '"call", command, ...args', "Windows cmd lifecycle wait"],
  [library, "stopSupabaseAuxiliaryServices", "auxiliary isolation"],
  [library, "startSupabaseAuxiliaryServices", "auxiliary restoration"],
  [library, "waitForSustainedFullStackReadiness", "sustained restore gate"],
  [reset, "runDbFocusedReset", "DB-focused reset orchestration"],
  [reset, "startSupabaseAuxiliaryServices(root)", "restore command"],
];

for (const [source, expected, label] of checks) {
  if (!source.includes(expected)) throw new Error(`Missing ${label}`);
}

console.log("SUPABASE_AUXILIARY_RESTORE=PASS");
