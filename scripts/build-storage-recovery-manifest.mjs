import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertOutsideRepository,
  buildStorageManifest,
  readJsonLines,
  sha256File,
  toCsv,
} from "./lib/recovery-gap-closure.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const metadataPath = argument("--metadata-jsonl");
const journalPath = argument("--download-journal-jsonl");
const objectRoot = argument("--object-root");
const outputDirectory = argument("--output-directory");
if (!metadataPath || !journalPath || !objectRoot || !outputDirectory) {
  throw new Error("USAGE: --metadata-jsonl <file> --download-journal-jsonl <file> --object-root <dir> --output-directory <dir>");
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
assertOutsideRepository(objectRoot, repositoryRoot);
assertOutsideRepository(outputDirectory, repositoryRoot);
if (fs.existsSync(outputDirectory) && fs.readdirSync(outputDirectory).length > 0) {
  throw new Error("OUTPUT_DIRECTORY_MUST_BE_EMPTY");
}

const metadataRows = readJsonLines(metadataPath);
const journalRows = readJsonLines(journalPath);
const entries = buildStorageManifest({ metadataRows, journalRows, objectRoot });
fs.mkdirSync(outputDirectory, { recursive: true });

const manifestPath = path.join(outputDirectory, "storage-object-manifest.csv");
const hashesPath = path.join(outputDirectory, "storage-object-sha256s.txt");
const reportPath = path.join(outputDirectory, "storage-reconciliation-report.json");
const columns = ["object_id", "bucket_id", "object_name", "relative_path", "size_bytes", "sha256", "etag", "status"];
fs.writeFileSync(manifestPath, toCsv(entries, columns), { encoding: "utf8", flag: "wx" });
fs.writeFileSync(hashesPath, entries.map((entry) => `${entry.sha256}  ${entry.relative_path}`).join("\n") + "\n", { encoding: "utf8", flag: "wx" });

const report = {
  status: "PASS",
  metadata_objects: metadataRows.length,
  downloaded_objects: journalRows.filter((row) => row.status === "PASS").length,
  reconciled_objects: entries.length,
  missing_objects: 0,
  extra_objects: 0,
  total_bytes: entries.reduce((total, entry) => total + entry.size_bytes, 0),
  manifest_sha256: sha256File(manifestPath),
  hashes_sha256: sha256File(hashesPath),
  object_names_in_report: false,
};
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify(report));
