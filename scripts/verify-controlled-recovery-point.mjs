import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertOutsideRepository, containsSecretMaterial, parseTimestamp, sha256File } from "./lib/recovery-gap-closure.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const checkpointPath = argument("--checkpoint");
const outputPath = argument("--output");
if (!checkpointPath || !outputPath) throw new Error("USAGE: --checkpoint <json> --output <json>");
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
assertOutsideRepository(outputPath, repositoryRoot);
if (fs.existsSync(outputPath)) throw new Error("OUTPUT_ALREADY_EXISTS");

const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
if (containsSecretMaterial(checkpoint)) throw new Error("CHECKPOINT_CONTAINS_SECRET_MATERIAL");
if (checkpoint.decision !== "AUTHORIZED_CONTROLLED_BACKUP_WINDOW") throw new Error("HUMAN_AUTHORIZATION_MISSING");
if (checkpoint.production_readiness !== "NO_GO") throw new Error("PRODUCTION_READINESS_MUST_REMAIN_NO_GO");
if (checkpoint.consistency_mode !== "CONTROLLED_NO_FULL_WRITE_FREEZE" || checkpoint.window?.full_write_freeze_proven !== false) {
  throw new Error("CONTROLLED_CONSISTENCY_MODE_INVALID");
}

const windowStart = parseTimestamp(checkpoint.window?.started_at_utc, "INVALID_WINDOW_START");
const windowEnd = parseTimestamp(checkpoint.window?.ended_at_utc, "INVALID_WINDOW_END");
if (windowEnd <= windowStart) throw new Error("INVALID_COLLECTION_WINDOW");
for (const [value, label] of [
  [checkpoint.database?.snapshot_started_at_utc, "DATABASE_SNAPSHOT_START"],
  [checkpoint.database?.snapshot_completed_at_utc, "DATABASE_SNAPSHOT_END"],
  [checkpoint.storage?.export_started_at_utc, "STORAGE_EXPORT_START"],
  [checkpoint.storage?.export_completed_at_utc, "STORAGE_EXPORT_END"],
]) {
  const timestamp = parseTimestamp(value, `INVALID_${label}`);
  if (timestamp < windowStart || timestamp > windowEnd) throw new Error(`${label}_OUTSIDE_COLLECTION_WINDOW`);
}

const artifacts = checkpoint.database?.artifacts;
if (!Array.isArray(artifacts) || artifacts.length < 5) throw new Error("DATABASE_ARTIFACTS_INCOMPLETE");
const snapshotFingerprints = new Set();
for (const artifact of artifacts) {
  if (!artifact.path || !artifact.sha256 || !fs.existsSync(artifact.path)) throw new Error("DATABASE_ARTIFACT_MISSING");
  if (sha256File(artifact.path) !== String(artifact.sha256).toLowerCase()) throw new Error("DATABASE_ARTIFACT_HASH_MISMATCH");
  if (artifact.snapshot_bound === true) snapshotFingerprints.add(artifact.snapshot_fingerprint);
}
if (snapshotFingerprints.size !== 1 || [...snapshotFingerprints][0] == null) throw new Error("DATABASE_ARTIFACTS_NOT_BOUND_TO_ONE_SNAPSHOT");

const storageReportPath = checkpoint.storage?.reconciliation_report_path;
if (!storageReportPath || !fs.existsSync(storageReportPath)) throw new Error("STORAGE_RECONCILIATION_REPORT_MISSING");
const storage = JSON.parse(fs.readFileSync(storageReportPath, "utf8"));
if (storage.status !== "PASS" || storage.metadata_objects !== 8 || storage.reconciled_objects !== 8 || storage.missing_objects !== 0 || storage.extra_objects !== 0) {
  throw new Error("STORAGE_RECONCILIATION_NOT_CLEAN");
}
for (const inventoryPath of [checkpoint.storage?.inventory_before_path, checkpoint.storage?.inventory_after_path]) {
  if (!inventoryPath || !fs.existsSync(inventoryPath)) throw new Error("STORAGE_BEFORE_AFTER_INVENTORY_MISSING");
}
if (sha256File(checkpoint.storage.inventory_before_path) !== sha256File(checkpoint.storage.inventory_after_path)) {
  throw new Error("STORAGE_INVENTORY_CHANGED_DURING_COLLECTION");
}

const result = {
  status: "PASS_WITH_LIMITATION",
  database_snapshot_consistency: "PASS",
  storage_byte_integrity: "PASS",
  cross_service_point_in_time_consistency: "NOT_PROVEN",
  database_artifacts: artifacts.length,
  storage_objects: 8,
  inventory_before_after: "MATCH",
  cron_restored: checkpoint.window?.cron_restored === true,
  credentials_revoked: checkpoint.credentials_revoked === true,
  production_readiness: "NO_GO",
};
if (!result.cron_restored || !result.credentials_revoked) throw new Error("CLOSEOUT_INCOMPLETE");
fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify(result));
