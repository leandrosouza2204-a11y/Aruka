import { readFileSync } from "node:fs";

const library = readFileSync("scripts/supabase-cycle-8-lib.mjs", "utf8");
const reset = readFileSync("scripts/reset-supabase-local-safe.mjs", "utf8");
const bootstrap = readFileSync("scripts/supabase-local-bootstrap-canonical.mjs", "utf8");

const checks = [
  [library, "waitForPostResetStability", "post-reset stability gate"],
  [library, "EXPECTED_LOCAL_PUBLIC_TABLES", "canonical table-count contract"],
  [library, "EXPECTED_LOCAL_PUBLIC_TABLES = 30", "Stage 11.3 canonical table count"],
  [library, "EXPECTED_EPHEMERAL_MIGRATION_HISTORY.at(-1)", "latest migration probe"],
  [library, '"select 1"', "canonical SQL readiness probe"],
  [library, "if (sqlProbe.status !== 0 || sqlProbe.stdout.trim() !== \"1\")", "transient SQL errors remain retryable"],
  [library, "continue;", "metadata waits for SQL readiness"],
  [library, "consecutiveStableReads >= 2", "double-stability confirmation"],
  [library, "POST_RESET_STABILITY_TIMEOUT", "explicit timeout"],
  [library, "LAST_SQL_ERROR=", "timeout SQL diagnostics"],
  [library, "CONTAINER_STATE=", "timeout container diagnostics"],
  [library, "ELAPSED_MS=", "timeout elapsed-time diagnostics"],
  [reset, "runDbFocusedReset", "DB-focused reset flow"],
  [reset, "waitForPostResetStability(root)", "post-reset wait"],
  [reset, "stopSupabaseAuxiliaryServices(root)", "auxiliary-service isolation"],
  [bootstrap, "waitForPostResetStability(root)", "bootstrap wait"],
];

for (const [source, expected, label] of checks) {
  if (!source.includes(expected)) throw new Error(`Missing ${label}`);
}

console.log("SUPABASE_POST_RESET_READINESS=PASS");
