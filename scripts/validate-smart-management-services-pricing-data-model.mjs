import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260909110000_smart_management_services_pricing_v1.sql", "utf8");

for (const expected of [
  "create table public.smart_management_services",
  "professional_id uuid not null",
  "price numeric(10,2) not null",
  "sessions_per_week integer",
  "sessions_per_month integer",
  "sessions_in_package integer",
  "session_duration_minutes integer",
  "min_students integer default 1 not null",
  "max_students integer",
  "archived_at timestamptz",
  "smart_management_services_pricing_model_check",
  "smart_management_services_price_check",
  "smart_management_services_frequency_check",
  "smart_management_services_students_check",
  "smart_management_services_package_shape_check",
  "smart_management_services_archive_shape",
]) assertIncludes(migration, expected);

for (const expected of ["PER_SESSION", "PER_STUDENT_SESSION", "MONTHLY_PACKAGE", "FIXED_PACKAGE", "personal_training", "online_coaching", "assessment", "other"]) assertIncludes(migration, expected);

console.log("SMART_MANAGEMENT_SERVICES_PRICING_DATA_MODEL=PASS");

function assertIncludes(source, expected) {
  if (!source.includes(expected)) throw new Error(`Missing expected data-model contract: ${expected}`);
}
