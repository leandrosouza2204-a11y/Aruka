import { readFileSync } from "node:fs";

const library = readFileSync("scripts/supabase-cycle-8-lib.mjs", "utf8");
const reset = readFileSync("scripts/reset-supabase-local-safe.mjs", "utf8");
const bootstrap = readFileSync("scripts/supabase-local-bootstrap-canonical.mjs", "utf8");

const checks = [
  [library, "waitForPostResetStability", "post-reset stability gate"],
  [library, "EXPECTED_LOCAL_PUBLIC_TABLES", "canonical table-count contract"],
  [library, "EXPECTED_EPHEMERAL_MIGRATION_HISTORY.at(-1)", "latest migration probe"],
  [library, "consecutiveStableReads >= 2", "double-stability confirmation"],
  [library, "POST_RESET_STABILITY_TIMEOUT", "explicit timeout"],
  [reset, "runDbFocusedReset", "DB-focused reset flow"],
  [reset, "waitForPostResetStability(root)", "post-reset wait"],
  [reset, "stopSupabaseAuxiliaryServices(root)", "auxiliary-service isolation"],
  [bootstrap, "waitForPostResetStability(root)", "bootstrap wait"],
];

for (const [source, expected, label] of checks) {
  if (!source.includes(expected)) throw new Error(`Missing ${label}`);
}

console.log("SUPABASE_POST_RESET_READINESS=PASS");
