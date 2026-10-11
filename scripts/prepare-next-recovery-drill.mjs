import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { assertOutsideRepository, containsSecretMaterial, sha256File } from "./lib/recovery-gap-closure.mjs";

function argument(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const checkpointPath = argument("--checkpoint");
const consistencyReportPath = argument("--consistency-report");
const outputPath = argument("--output");
if (!checkpointPath || !consistencyReportPath || !outputPath) {
  throw new Error("USAGE: --checkpoint <json> --consistency-report <json> --output <json>");
}
const repositoryRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
assertOutsideRepository(outputPath, repositoryRoot);
if (fs.existsSync(outputPath)) throw new Error("OUTPUT_ALREADY_EXISTS");

const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, "utf8"));
const consistency = JSON.parse(fs.readFileSync(consistencyReportPath, "utf8"));
if (containsSecretMaterial(checkpoint) || containsSecretMaterial(consistency)) throw new Error("INPUT_CONTAINS_SECRET_MATERIAL");
if (consistency.status !== "PASS" || consistency.ready_for_next_restore_drill !== true) {
  throw new Error("CONSISTENT_RECOVERY_POINT_NOT_PROVEN");
}

const artifacts = checkpoint.database?.artifacts;
if (!Array.isArray(artifacts) || artifacts.length < 5) throw new Error("DATABASE_ARTIFACTS_INCOMPLETE");
for (const artifact of artifacts) {
  if (!fs.existsSync(artifact.path) || sha256File(artifact.path) !== String(artifact.sha256).toLowerCase()) {
    throw new Error("DATABASE_ARTIFACT_NOT_READY");
  }
}
const storageReportPath = checkpoint.storage?.reconciliation_report_path;
if (!storageReportPath || !fs.existsSync(storageReportPath)) throw new Error("STORAGE_EVIDENCE_NOT_READY");

const plan = {
  decision: "READY_FOR_AUTHORIZED_ISOLATED_RESTORE_DRILL",
  execute_restore: false,
  production_target_allowed: false,
  production_readiness: "NO_GO",
  prerequisites: {
    consistent_recovery_point: "PASS",
    database_artifacts: artifacts.length,
    storage_reconciliation: "PASS",
    new_disposable_resources_required: true,
    original_artifacts_read_only: true,
  },
  order: [
    "verify_hashes",
    "bootstrap_compatible_supabase_postgres_auth_storage",
    "restore_roles_schema_history_data",
    "restore_storage_bytes",
    "validate_database_and_storage_manifests",
    "record_rto_and_preserve_evidence",
  ],
  stop_conditions: [
    "target_identity_ambiguous",
    "production_route_detected",
    "hash_mismatch",
    "managed_schema_version_mismatch",
    "storage_object_missing_or_extra",
    "write_attempt_outside_disposable_target",
  ],
};
fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(plan, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
console.log(JSON.stringify(plan));
