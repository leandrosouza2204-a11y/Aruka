import { readFileSync } from "node:fs";

const sql = [
  "supabase/migrations/20260905120000_exercise_library_media_v1.sql",
  "supabase/baseline-src/10-storage.sql",
].map((file) => readFileSync(file, "utf8")).join("\n");

const errors = [];

function expect(pattern, message) {
  if (!pattern.test(sql)) errors.push(message);
}

expect(/'exercise-media'[\s\S]*false[\s\S]*104857600[\s\S]*video\/mp4[\s\S]*video\/webm/i, "exercise-media bucket must be private with size and video MIME restrictions");
expect(/create\s+policy\s+exercise_media_select_authorized[\s\S]*bucket_id\s+=\s+'exercise-media'[\s\S]*public\.exercise_is_prescribed_to_current_student\(e\.id\)/i, "Storage select must support authorized student reads only through the prescribed exercise helper");
expect(/create\s+policy\s+exercise_media_insert_own_folder[\s\S]*with\s+check[\s\S]*storage\.foldername\(name\)\)\[1\]\s+=\s+auth\.uid\(\)::text/i, "Upload must be scoped to auth.uid() folder");
expect(/create\s+policy\s+exercise_media_delete_own_folder[\s\S]*storage\.foldername\(name\)\)\[1\]\s+=\s+auth\.uid\(\)::text/i, "Delete must be scoped to auth.uid() folder");

if (/bucket_id\s*=\s*'exercise-media'[\s\S]{0,120}to\s+anon/i.test(sql)) {
  errors.push("exercise-media must not grant anon policies");
}

if (/persistir\s+signed|signed_url|service_role_key|token/i.test(sql)) {
  errors.push("Storage contract must not persist signed URLs, tokens, or service role material");
}

if (errors.length > 0) {
  console.error("Exercise library media security validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Exercise library media security validation passed.");
