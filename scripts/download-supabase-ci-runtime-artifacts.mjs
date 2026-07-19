import { createWriteStream, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { pipeline } from "node:stream/promises";
import { createHash } from "node:crypto";
import { DECISION_PREPARE, fileSha256, gh, ghAvailable, readJson, safeOutputPath, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const runId = process.argv.find((arg) => arg.startsWith("--run-id="))?.slice("--run-id=".length) ?? readJson(root, "reports/supabase-ci-runtime/github-actions-run-result.json", {})?.run_id;
const outputDir = process.argv.find((arg) => arg.startsWith("--output-dir="))?.slice("--output-dir=".length) ?? "reports/supabase-ci-runtime/downloaded-artifacts";
const ghState = ghAvailable(root);
const errors = [];
const files = [];

function list(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...list(full));
    else out.push(full);
  }
  return out;
}

if (!runId || !ghState.available || !ghState.authenticated) {
  errors.push("Artifact download requires gh authentication and a real run id.");
} else if (existsSync(join(root, outputDir))) {
  errors.push(`Output directory already exists: ${outputDir}`);
} else {
  mkdirSync(join(root, outputDir), { recursive: true });
  const download = gh(root, ["run", "download", String(runId), "--dir", outputDir]);
  if (download.status !== 0) errors.push(download.stderr || download.stdout);
  for (const file of list(join(root, outputDir))) {
    const rel = relative(join(root, outputDir), file).replaceAll("\\", "/");
    safeOutputPath(root, outputDir, rel);
    files.push({ path: rel, sha256: fileSha256(file), size_bytes: statSync(file).size });
  }
}

const payload = {
  cycle: "9.1",
  result: errors.length ? "MANUAL_COLLECTION_REQUIRED" : "GITHUB_ACTIONS_ARTIFACTS_DOWNLOADED",
  decision: DECISION_PREPARE,
  run_id: runId ?? null,
  output_dir: outputDir,
  archive_downloaded: errors.length === 0,
  extracted: errors.length === 0,
  files,
  validation_status: errors.length ? "PENDING_RUNTIME_EVIDENCE" : "DOWNLOADED_UNTRUSTED_DATA",
  primary_error: errors[0] ?? null,
};

writeJson(root, "artifacts-manifest.json", payload);
writeJson(root, "github-actions-artifacts-result.json", payload);
writeMarkdown(root, "github-actions-artifacts-summary.md", [
  "# GitHub Actions Artifacts",
  "",
  `- Result: ${payload.result}`,
  `- Run ID: ${payload.run_id ?? "pending"}`,
  `- Files: ${files.length}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

console.log(payload.result);
