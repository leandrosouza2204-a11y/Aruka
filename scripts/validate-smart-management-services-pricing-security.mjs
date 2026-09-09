import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260909110000_smart_management_services_pricing_v1.sql", "utf8");

for (const expected of [
  "alter table public.smart_management_services enable row level security",
  "professional_id = auth.uid()",
  "smart_management_current_user_is_professional()",
  "revoke all on table public.smart_management_services from anon",
  "grant select, insert, update, delete on table public.smart_management_services to authenticated",
  "security invoker",
  "save_smart_management_service",
]) assertIncludes(migration, expected);

console.log("SMART_MANAGEMENT_SERVICES_PRICING_SECURITY=PASS");

function assertIncludes(source, expected) {
  if (!source.includes(expected)) throw new Error(`Missing expected security contract: ${expected}`);
}
