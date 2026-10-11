import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  assertOutsideRepository,
  containsSecretMaterial,
  parseTimestamp,
  sha256File,
} from "./lib/recovery-gap-closure.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const checkpointPath = argument("--checkpoint");
const outputPath = argument("--output");
if (!checkpointPath || !outputPath) throw new Error("USAGE: --checkpoint <json> --output <json>");
const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
assertOutsideRepository(outputPath, repositoryRoot);
if (fs.existsSync(outputPath)) throw new Error("OUTPUT_ALREADY_EXISTS");

const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
if (containsSecretMaterial(checkpoint)) throw new Error("CHECKPOINT_CONTAINS_SECRET_MATERIAL");
if (checkpoint.decision !== "AUTHORIZED_CONSISTENT_BACKUP_WINDOW") throw new Error("HUMAN_AUTHORIZATION_MISSING");
if (checkpoint.production_readiness !== "NO_GO") throw new Error("PRODUCTION_READINESS_MUST_REMAIN_NO_GO");

const freezeStart = parseTimestamp(checkpoint.freeze?.started_at_utc, "INVALID_FREEZE_START");
const freezeEnd = parseTimestamp(checkpoint.freeze?.ended_at_utc, "INVALID_FREEZE_END");
if (freezeEnd <= freezeStart) throw new Error("INVALID_FREEZE_WINDOW");
for (const flag of ["application_writes_frozen", "storage_writes_frozen", "background_jobs_paused"]) {
  if (checkpoint.freeze?.[flag] !== true) throw new Error("INCOMPLETE_WRITE_FREEZE");
}

const boundedEvents = [
  [checkpoint.database?.snapshot_started_at_utc, "DATABASE_SNAPSHOT_START"],
  [checkpoint.database?.snapshot_completed_at_utc, "DATABASE_SNAPSHOT_END"],
  [checkpoint.storage?.inventory_captured_at_utc, "STORAGE_INVENTORY"],
  [checkpoint.storage?.export_started_at_utc, "STORAGE_EXPORT_START"],
  [checkpoint.storage?.export_completed_at_utc, "STORAGE_EXPORT_END"],
];
for (const [value, label] of boundedEvents) {
  const timestamp = parseTimestamp(value, `INVALID_${label}`);
  if (timestamp < freezeStart || timestamp > freezeEnd) throw new Error(`${label}_OUTSIDE_FREEZE_WINDOW`);
}

const artifacts = checkpoint.database?.artifacts;
if (!Array.isArray(artifacts) || artifacts.length < 5) throw new Error("DATABASE_ARTIFACTS_INCOMPLETE");
const snapshotFingerprints = new Set();
for (const artifact of artifacts) {
  if (!artifact.path || !artifact.sha256 || !fs.existsSync(artifact.path)) throw new Error("DATABASE_ARTIFACT_MISSING");
  if (sha256File(artifact.path) !== String(artifact.sha256).toLowerCase()) throw new Error("DATABASE_ARTIFACT_HASH_MISMATCH");
  if (artifact.snapshot_bound === true) snapshotFingerprints.add(artifact.snapshot_fingerprint);
}
if (snapshotFingerprints.size !== 1 || [...snapshotFingerprints][0] === undefined) {
  throw new Error("DATABASE_ARTIFACTS_NOT_BOUND_TO_ONE_SNAPSHOT");
}

const storageReportPath = checkpoint.storage?.reconciliation_report_path;
if (!storageReportPath || !fs.existsSync(storageReportPath)) throw new Error("STORAGE_RECONCILIATION_REPORT_MISSING");
const storageReport = JSON.parse(fs.readFileSync(storageReportPath, "utf8"));
if (
  storageReport.status !== "PASS" ||
  storageReport.metadata_objects !== storageReport.reconciled_objects ||
  storageReport.missing_objects !== 0 ||
  storageReport.extra_objects !== 0
) {
  throw new Error("STORAGE_RECONCILIATION_NOT_CLEAN");
}

const result = {
  status: "PASS",
  recovery_point_consistency: "PROVEN_WITHIN_AUTHORIZED_WRITE_FREEZE_WINDOW",
  database_snapshot_fingerprints: snapshotFingerprints.size,
  database_artifacts: artifacts.length,
  storage_objects: storageReport.reconciled_objects,
  freeze_duration_seconds: (freezeEnd - freezeStart) / 1000,
  storage_missing: 0,
  storage_extra: 0,
  production_readiness: "NO_GO",
  ready_for_next_restore_drill: true,
};
fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify(result));
