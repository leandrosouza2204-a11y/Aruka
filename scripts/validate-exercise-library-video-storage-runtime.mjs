import { queryJson, runPsql } from "./supabase-cycle-8-lib.mjs";

const bucket = one(`
  select public, file_size_limit, allowed_mime_types
  from storage.buckets
  where id = 'exercise-media'
`);
const policies = queryJson(process.cwd(), `
  select policyname, cmd
  from pg_policies
  where schemaname = 'storage'
    and tablename = 'objects'
    and policyname like 'exercise_media_%'
  order by policyname
`);

expect(bucket.public === false, "bucket private");
expect(bucket.file_size_limit === 104857600, "bucket max size 100 MB");
expect(JSON.stringify(bucket.allowed_mime_types) === JSON.stringify(["video/mp4", "video/webm"]), "bucket MIME allowlist mp4/webm");
expect(policies.some((policy) => policy.policyname === "exercise_media_insert_own_folder"), "insert policy exists");
expect(policies.some((policy) => policy.policyname === "exercise_media_select_authorized"), "select policy exists");
expect(policies.some((policy) => policy.policyname === "exercise_media_update_own_folder"), "update policy exists");
expect(policies.some((policy) => policy.policyname === "exercise_media_delete_own_folder"), "delete policy exists");

const shape = runPsql(process.cwd(), `
  insert into public.exercise_library (id, origin, owner_id, name, muscle_group, category, media_type, media_path, media_mime_type, youtube_url)
  values ('00000000-0000-4000-8000-000000009505', 'personal', '00000000-0000-4000-8000-000000009101', 'Mime invalid', 'Peitoral', 'Musculacao', 'uploaded_video', '00000000-0000-4000-8000-000000009101/exercises/00000000-0000-4000-8000-000000009505/bad.mov', 'video/quicktime', '');
`, { throwOnError: false });
expect(shape.status !== 0, "table rejects quicktime uploaded_video");

console.log("EXERCISE_VIDEO_STORAGE_RUNTIME=PASS");

function one(sql) {
  const rows = queryJson(process.cwd(), sql);
  if (rows.length !== 1) throw new Error("Expected one row");
  return rows[0];
}

function expect(ok, label) {
  if (!ok) throw new Error(`FAIL ${label}`);
  console.log(`OK ${label}`);
}
