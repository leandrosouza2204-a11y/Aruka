import { readFileSync } from "node:fs";

const files = [
  "supabase/migrations/20260905120000_exercise_library_media_v1.sql",
  "supabase/baseline-src/02-tables.sql",
  "supabase/baseline-src/03-constraints.sql",
  "supabase/baseline-src/04-indexes.sql",
];

const sql = files.map((file) => readFileSync(file, "utf8")).join("\n");
const errors = [];

function expect(pattern, message) {
  if (!pattern.test(sql)) errors.push(message);
}

expect(/create\s+table\s+public\.exercise_library/i, "Missing public.exercise_library table");
expect(/create\s+table\s+public\.exercise_favorites/i, "Missing public.exercise_favorites table");
expect(/alter\s+table\s+public\.treino_exercicios\s+[\s\S]*add\s+column\s+exercise_id\s+uuid/i, "Missing nullable treino_exercicios.exercise_id");
expect(/treino_exercicios_exercise_id_fkey[\s\S]*references\s+public\.exercise_library\(id\)\s+on\s+delete\s+set\s+null/i, "treino_exercicios.exercise_id must preserve snapshots with ON DELETE SET NULL");
expect(/exercise_library_origin_check[\s\S]*origin\s+in\s+\('official',\s*'personal'\)/i, "Missing official/personal origin constraint");
expect(/exercise_library_owner_origin_check[\s\S]*origin\s+=\s+'official'\s+and\s+owner_id\s+is\s+null[\s\S]*origin\s+=\s+'personal'\s+and\s+owner_id\s+is\s+not\s+null/i, "Missing owner/origin consistency");
expect(/exercise_library_status_check[\s\S]*status\s+in\s+\('active',\s*'archived'\)/i, "Missing active/archived status constraint");
expect(/exercise_library_media_shape_check[\s\S]*video\/mp4[\s\S]*video\/webm[\s\S]*video\/quicktime/i, "Missing media contract constraint");
expect(/exercise_favorites_unique\s+unique\s+\(professional_id,\s*exercise_id\)/i, "Favorites must be per professional and exercise");
expect(/exercise_library_owner_status_name_idx/i, "Missing owner/status/name index");
expect(/exercise_library_origin_status_name_idx/i, "Missing origin/status/name index");

if (/\bon\s+delete\s+cascade\b/i.test(sql.match(/treino_exercicios_exercise_id_fkey[\s\S]*?;/i)?.[0] ?? "")) {
  errors.push("treino_exercicios.exercise_id must not cascade delete historical workout exercises");
}

if (errors.length > 0) {
  console.error("Exercise library data model validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Exercise library data model validation passed.");
