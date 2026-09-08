import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260908110000_smart_management_foundation.sql", "utf8");
const docs = readFileSync("docs/product-roadmap-v4-cycle-11-smart-management/01-foundation-data-model.md", "utf8");

for (const table of [
  "smart_management_locations",
  "smart_management_transfer_rules",
  "smart_management_transfer_tiers",
]) {
  assertIncludes(migration, `create table public.${table}`, `Migration creates ${table}.`);
}

for (const type of ["'none'", "'fixed'", "'per_student'", "'tiered'", "'percentage'"]) {
  assertIncludes(migration, type, `Migration supports transfer type ${type}.`);
}

for (const column of [
  "professional_id uuid not null",
  "fixed_amount numeric(10,2)",
  "per_student_amount numeric(10,2)",
  "percentage_rate numeric(5,2)",
  "min_students integer not null",
  "max_students integer",
  "amount numeric(10,2) not null",
]) {
  assertIncludes(migration, column, `Migration includes ${column}.`);
}

assertIncludes(migration, "smart_management_transfer_rules_shape_check", "Rule shape constraint exists.");
assertIncludes(migration, "smart_management_transfer_tiers_students_check", "Tier range constraint exists.");
assertIncludes(docs, "Academia A can be represented", "Reference scenario A is documented.");
assertIncludes(docs, "Academia B can be represented", "Reference scenario B is documented.");
assertIncludes(docs, "Academia C can be represented", "Reference scenario C is documented.");

console.log("PASS smart-management-data-model");

function assertIncludes(source, expected, message) {
  if (!source.includes(expected)) {
    throw new Error(`${message} Missing: ${expected}`);
  }
}
