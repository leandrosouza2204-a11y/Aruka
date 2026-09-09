import { readFileSync } from "node:fs";

const runtime = readFileSync("scripts/supabase-cycle-8-lib.mjs", "utf8");
const bootstrap = readFileSync("scripts/supabase-local-bootstrap-canonical.mjs", "utf8");
const reset = readFileSync("scripts/reset-supabase-local-safe.mjs", "utf8");

for (const required of ["waitForLocalSupabaseHealth", "timeoutMs", "last state", "running|healthy"]) {
  if (!runtime.includes(required)) throw new Error(`Health gate implementation is missing: ${required}`);
}
if (!bootstrap.includes("waitForLocalSupabaseHealth(root)") || bootstrap.indexOf("waitForLocalSupabaseHealth(root)") > bootstrap.indexOf('"db", "reset"')) {
  throw new Error("Bootstrap must wait for health before reset.");
}
if (!reset.includes("waitForLocalSupabaseHealth(root)")) throw new Error("Safe reset must wait after starting Supabase.");
console.log("SUPABASE_LOCAL_HEALTH_GATE=PASS");
