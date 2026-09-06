import { existsSync, readFileSync } from "node:fs";

const files = {
  service: "src/services/exerciseLibraryService.js",
  form: "src/services/exerciseLibraryForm.js",
  mapper: "src/services/exerciseLibraryMapper.js",
  component: "src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx",
  hook: "src/features/exerciseLibrary/hooks/useExerciseLibraryPage.js",
  util: "src/features/exerciseLibrary/utils/uploadedVideoMedia.js",
  utilTest: "src/features/exerciseLibrary/utils/uploadedVideoMedia.test.js",
  migration: "supabase/migrations/20260906020000_exercise_video_upload_storage_v1.sql",
  report: "reports/product-roadmap-v4/cycle-09-5-result.json",
};
const source = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""]));
const checks = [];

check("arquivos de upload existem", Object.values(files).every((path) => existsSync(path)));
check("bucket privado, limite e allowlist canonicos", all(source.util + source.migration, [
  "exercise-media",
  "100 * 1024 * 1024",
  "video/mp4",
  "video/webm",
  "public = false",
  "allowed_mime_types = array['video/mp4', 'video/webm']",
]));
check("path usa auth.uid primeiro e UUID gerado", all(source.util + source.service, [
  "${userId}/exercises/${exerciseId}/${assetId}",
  "crypto.randomUUID()",
  "buildExerciseVideoPath",
]));
check("service cobre upload, signed URL, replacement, removal e cleanup", all(source.service, [
  ".storage",
  ".upload(path",
  "createSignedUrl",
  "limparUploadOrfao",
  "limparMidiaAntiga",
  ".remove([oldPath])",
]) && !/getPublicUrl|service_role|signedUrl\s*:/.test(source.service));
check("form preserva exclusividade de midia", all(source.form, [
  "mediaMode",
  "media_type: \"uploaded_video\"",
  "youtube_url: \"\"",
  "criarPayloadSemMidia",
]));
check("UI tem selecao, input file, preview video e remover", all(source.component, [
  "exercise-library-media-options",
  "accept=\"video/mp4,video/webm\"",
  "<video",
  "controls",
  "preload=\"metadata\"",
  "Remover vídeo",
]));
check("hook controla object URL e estados", all(source.hook, [
  "URL.createObjectURL",
  "URL.revokeObjectURL",
  "uploadStatus",
  "uploading",
  "selected",
  "error",
]));
check("testes cobrem mime, limite, path e payload", all(source.utilTest, [
  "video/quicktime",
  "application/octet-stream",
  "EXERCISE_VIDEO_MAX_SIZE_BYTES + 1",
  "../malicioso",
  "signedUrl",
]));
check("sem bucket publico ou URL publica", !/getPublicUrl|public:\s*true|public\s*=\s*true/.test(source.service + source.component + source.util + source.migration));
check("report 09.5 valido", parseResult(source.report));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}

function parseResult(text) {
  try {
    const parsed = JSON.parse(text);
    return parsed.stage === "09.5" && parsed.bucket === "exercise-media";
  } catch {
    return false;
  }
}
