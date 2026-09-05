import { readFileSync } from "node:fs";

const sql = [
  "supabase/migrations/20260905120000_exercise_library_media_v1.sql",
  "supabase/baseline-src/07-rls.sql",
  "supabase/baseline-src/08-policies.sql",
  "supabase/baseline-src/09-grants.sql",
].map((file) => readFileSync(file, "utf8")).join("\n");

const errors = [];

function expect(pattern, message) {
  if (!pattern.test(sql)) errors.push(message);
}

for (const table of ["exercise_library", "exercise_favorites"]) {
  expect(new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`, "i"), `Missing RLS for ${table}`);
  expect(new RegExp(`revoke\\s+all\\s+on\\s+table\\s+public\\.${table}\\s+from\\s+anon`, "i"), `Missing anon revoke for ${table}`);
}

expect(/for\s+insert\s+to\s+authenticated\s+with\s+check\s+\([\s\S]*origin\s+=\s+'personal'[\s\S]*owner_id\s+=\s+auth\.uid\(\)[\s\S]*p\.role\s+=\s+'user'/i, "Personal insert policy must bind owner_id to auth.uid() and professional profile role");
expect(/for\s+update\s+to\s+authenticated\s+using\s+\([\s\S]*origin\s+=\s+'personal'[\s\S]*owner_id\s+=\s+auth\.uid\(\)[\s\S]*p\.role\s+=\s+'user'[\s\S]*with\s+check\s+\([\s\S]*origin\s+=\s+'personal'[\s\S]*owner_id\s+=\s+auth\.uid\(\)[\s\S]*p\.role\s+=\s+'user'/i, "Update policy must deny official, student and cross-owner edits");
expect(/for\s+delete\s+to\s+authenticated\s+using\s+\(false\)/i, "Exercise library hard delete must be denied");
expect(/security\s+definer[\s\S]*function\s+public\.exercise_is_prescribed_to_current_student|function\s+public\.exercise_is_prescribed_to_current_student[\s\S]*security\s+definer/i, "Student prescribed-read helper must be SECURITY DEFINER");
expect(/professional_id\s+=\s+auth\.uid\(\)/i, "Favorites policies must bind professional_id to auth.uid()");
expect(/grant\s+select,\s*insert,\s*update,\s*delete\s+on\s+table\s+public\.exercise_library\s+to\s+authenticated/i, "Missing authenticated table grants for exercise_library");
expect(/grant\s+select,\s*insert,\s*delete\s+on\s+table\s+public\.exercise_favorites\s+to\s+authenticated/i, "Missing authenticated table grants for exercise_favorites");
expect(/revoke\s+all\s+on\s+function\s+public\.set_exercise_library_updated_at\(\)\s+from\s+public/i, "Trigger function execute must be revoked from public");
expect(/revoke\s+all\s+on\s+function\s+public\.exercise_is_prescribed_to_current_student\(uuid\)\s+from\s+public/i, "Student helper execute must be revoked from public");

if (/grant\s+[^;]*(insert|update|delete)[^;]*\s+to\s+anon/i.test(sql) || /create\s+policy\s+[^;]*for\s+(insert|update|delete|all)\s+to\s+anon/i.test(sql)) {
  errors.push("Anon write grant/policy detected");
}

for (const unsafe of [/with\s+check\s*\(\s*true\s*\)/i, /for\s+(insert|update|delete|all)[\s\S]{0,120}using\s*\(\s*true\s*\)/i]) {
  if (unsafe.test(sql)) errors.push(`Unsafe open write policy detected: ${unsafe}`);
}

if (errors.length > 0) {
  console.error("Exercise library security validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Exercise library security validation passed.");
