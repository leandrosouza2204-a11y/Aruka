import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260908110000_smart_management_foundation.sql", "utf8");
const docs = readFileSync("docs/product-roadmap-v4-cycle-11-smart-management/00-cycle-definition.md", "utf8");

for (const table of [
  "smart_management_locations",
  "smart_management_transfer_rules",
  "smart_management_transfer_tiers",
]) {
  assertIncludes(migration, `alter table public.${table} enable row level security`, `${table} enables RLS.`);
  assertIncludes(migration, `revoke all on table public.${table} from anon`, `${table} revokes anon access.`);
}

assertIncludes(migration, "professional_id = auth.uid()", "Policies are owner-scoped.");
assertIncludes(migration, "smart_management_current_user_is_professional", "Professional predicate exists.");
assertIncludes(migration, "p.role = 'user'", "Student/admin bypass is not used for professional policies.");
assertIncludes(migration, "smart_management_transfer_rule_matches_location_owner", "Rule/location owner trigger exists.");
assertIncludes(migration, "smart_management_transfer_tier_matches_rule_owner", "Tier/rule owner trigger exists.");
assertIncludes(docs, "FINANCE_INTEGRATION=NO", "Finance integration guardrail is documented.");

console.log("PASS smart-management-security");

function assertIncludes(source, expected, message) {
  if (!source.includes(expected)) {
    throw new Error(`${message} Missing: ${expected}`);
  }
}
