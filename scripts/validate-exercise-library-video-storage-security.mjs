import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260906020000_exercise_video_upload_storage_v1.sql", "utf8");
const storage = readFileSync("supabase/baseline-src/10-storage.sql", "utf8");
const rls = readFileSync("supabase/migrations/20260905120000_exercise_library_media_v1.sql", "utf8");
const service = readFileSync("src/services/exerciseLibraryService.js", "utf8");
const util = readFileSync("src/features/exerciseLibrary/utils/uploadedVideoMedia.js", "utf8");
const sql = `${migration}\n${storage}\n${rls}`;
const checks = [];

check("bucket permanece privado", /exercise-media[\s\S]*public\s*=\s*false|false,\s*104857600/.test(sql));
check("bucket restringe upload a mp4 e webm", /allowed_mime_types\s*=\s*array\['video\/mp4', 'video\/webm'\]/.test(sql) && !migration.includes("video/quicktime"));
check("storage insert/update/delete isolados por auth.uid", all(sql, [
  "exercise_media_insert_own_folder",
  "exercise_media_update_own_folder",
  "exercise_media_delete_own_folder",
  "(storage.foldername(name))[1] = auth.uid()::text",
]));
check("student read fica preso ao helper de exercicio prescrito", all(sql, [
  "exercise_media_select_authorized",
  "public.exercise_is_prescribed_to_current_student(e.id)",
]));
check("anon nao recebe policy", !/bucket_id\s*=\s*'exercise-media'[\s\S]{0,120}to\s+anon/i.test(sql));
check("service nao confia em owner digitado no browser", all(service, ["buscarUsuarioAtualId", "ownerId", "buildExerciseVideoPath"]) && !/formulario\.owner|owner_id digitado/i.test(service));
check("path rejeita traversal e prefix collision", all(util, ["isExerciseVideoPath", "^[0-9a-f-]{36}", "/exercises/", "isSafeAssetId"]));
check("signed URL nao e persistida", !/signedUrl\s*:|getPublicUrl|service_role_key/i.test(service + util));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
