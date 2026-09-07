import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const files = {
  parser: "src/features/exerciseLibrary/utils/youtubeMedia.js",
  parserTests: "src/features/exerciseLibrary/utils/youtubeMedia.test.js",
  component: "src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx",
  hook: "src/features/exerciseLibrary/hooks/useExerciseLibraryPage.js",
  service: "src/services/exerciseLibraryService.js",
  form: "src/services/exerciseLibraryForm.js",
  mapper: "src/services/exerciseLibraryMapper.js",
  serviceTests: "src/services/exerciseLibraryService.test.js",
  css: "src/index.css",
  audit: "docs/product-roadmap-v4-cycle-09/13-youtube-media-audit.md",
  implementation: "docs/product-roadmap-v4-cycle-09/14-youtube-media-implementation.md",
  validation: "docs/product-roadmap-v4-cycle-09/15-youtube-media-validation.md",
  result: "reports/product-roadmap-v4/cycle-09-4-result.json",
  summary: "reports/product-roadmap-v4/cycle-09-4-summary.md",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const checks = [];

check("arquivos 09.4 existem", Object.values(files).every((path) => existsSync(path)));
check("parser aceita formatos canônicos sem API externa", all(source.parser, [
  "youtube.com",
  "youtu.be",
  "shorts",
  "embed",
  "YOUTUBE_ID_PATTERN",
  "https://www.youtube.com/watch?v=",
]) && !/youtube data api|googleapis|fetch\(|api_key|service_role/i.test(source.parser));
check("parser gera embed no-cookie e thumbnail controlado", all(source.parser, [
  "https://www.youtube-nocookie.com/embed/",
  "https://i.ytimg.com/vi/",
]));
check("parser bloqueia hosts e esquemas inseguros", all(source.parserTests, [
  "youtube.com.evil.com",
  "javascript:alert(1)",
  "data:text/html,evil",
  "file:///tmp/video",
  "<iframe",
]));
check("formulario valida youtube opcional", all(source.form, [
  "youtubeInput",
  "parseYouTubeMediaInput",
  "getYouTubeMediaErrorMessage",
  "youtube_url: youtube.media.canonicalUrl",
  "media_type: \"youtube\"",
]));
check("payload não persiste embed/thumbnail remoto", !/embedUrl\s*:|thumbnailUrl\s*:/.test(source.form));
check("servico permite atualizar/remover mídia pessoal", all(source.service, [
  "atualizarExercicioPessoalSupabase",
  ".eq(\"origin\", \"personal\")",
  ".update(payload)",
]) && !source.service.includes("delete payload.youtube_url") && !source.service.includes("delete payload.media_type"));
check("mapper deriva preview sem expor storage interno", all(source.mapper, [
  "parseYouTubeMediaInput",
  "embedUrl",
  "thumbnailUrl",
  "thumbnailPath: \"\"",
]));
check("modal mostra preview seguro e acessível", all(source.component, [
  "Vídeo do YouTube",
  "exercise-library-youtube-preview",
  "<iframe",
  "src={youtubeMedia.embedUrl}",
  "loading=\"lazy\"",
  "referrerPolicy=\"strict-origin-when-cross-origin\"",
  "allowFullScreen",
  "aria-describedby",
]) && !source.component.includes("dangerouslySetInnerHTML"));
check("responsividade do preview presente", source.component.includes("aspectRatio: \"16 / 9\"") && source.css.includes(".exercise-library-youtube-preview"));
check("testes cobrem parser e payload", all(source.parserTests + source.serviceTests, [
  "normaliza formatos aceitos",
  "rejeita hosts",
  "cria payload pessoal com YouTube canonico",
  "bloqueia YouTube inseguro",
]));
check("docs e reports 09.4 existem", ["audit", "implementation", "validation", "result", "summary"].every((key) => source[key]));
check("result.json valido e sem Supabase change", parseResult(source.result));
check("sem alteracoes Supabase", supabaseChanged().length === 0, supabaseChanged().join(", "));

for (const item of checks) {
  console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}${item.detail ? ` - ${item.detail}` : ""}`);
}

if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok, detail = "") {
  checks.push({ name, ok: Boolean(ok), detail });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}

function parseResult(text) {
  if (!text) return false;
  try {
    const parsed = JSON.parse(text);
    return parsed.stage === "09.4" && parsed.supabaseChanged === false && parsed.nextStage.includes("09.5");
  } catch {
    return false;
  }
}

function supabaseChanged() {
  return [
    git(["diff", "--name-only", "--", "supabase/**"]),
    git(["diff", "--cached", "--name-only", "--", "supabase/**"]),
    git(["ls-files", "--others", "--exclude-standard", "--", "supabase"]),
  ].flat().filter((path) => !isExpectedLaterCycleSupabaseChange(path));
}

function isExpectedLaterCycleSupabaseChange(path) {
  return [
    "supabase/baseline-src/03-constraints.sql",
    "supabase/baseline-src/02-tables.sql",
    "supabase/baseline-src/05-functions.sql",
    "supabase/baseline-src/10-storage.sql",
    "supabase/migrations/20260906020000_exercise_video_upload_storage_v1.sql",
    "supabase/migrations/20260907090000_workout_exercise_library_integration_v1.sql",
  ].includes(path.replaceAll("\\", "/"));
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
