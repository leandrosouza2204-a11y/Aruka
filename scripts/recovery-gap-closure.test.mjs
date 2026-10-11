import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { objectRelativePath, sha256File } from "./lib/recovery-gap-closure.mjs";

const root = process.cwd();
const manifestScript = path.join(root, "scripts/build-storage-recovery-manifest.mjs");
const recoveryPointScript = path.join(root, "scripts/verify-consistent-recovery-point.mjs");
const prepareDrillScript = path.join(root, "scripts/prepare-next-recovery-drill.mjs");
const exporterScript = path.join(root, "scripts/export-supabase-storage-backup.ps1");
const snapshotKeeperSql = path.join(root, "scripts/sql/recovery-snapshot-keeper.sql");
const snapshotInventorySql = path.join(root, "scripts/sql/storage-recovery-inventory-at-snapshot.sql");
const preflightPackage = path.join(root, "docs/product-roadmap-v4-cycle-12-student-experience-v2/30-production-recovery-preflight-execution-package.md");
const finalExecutionPackage = path.join(root, "docs/product-roadmap-v4-cycle-12-student-experience-v2/31-final-backup-execution-package.md");
const dumpNormalizer = path.join(root, "scripts/normalize-supabase-snapshot-dump.mjs");

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function storageFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-storage-gap-"));
  const objects = [
    { id: "object-1", bucket_id: "avaliacoes-fotos", name: "student-a/front.jpg", metadata: { size: 5 }, content: "alpha" },
    { id: "object-2", bucket_id: "exercise-media", name: "official/demo.mp4", metadata: { size: 4 }, content: "beta" },
  ];
  const metadataPath = path.join(dir, "storage-objects.jsonl");
  const journalPath = path.join(dir, "storage-download-journal.jsonl");
  const objectRoot = path.join(dir, "download");
  const output = path.join(dir, "evidence");
  write(metadataPath, `${objects.map(({ content: _content, ...row }) => JSON.stringify(row)).join("\n")}\n`);
  const journal = objects.map((row) => {
    const relative = objectRelativePath(row.bucket_id, row.name);
    write(path.join(objectRoot, ...relative.split("/")), row.content);
    const size = Buffer.byteLength(row.content);
    return { bucket_id: row.bucket_id, name: row.name, relative_path: relative, remote_content_length: size, local_size_bytes: size, etag: "synthetic", status: "PASS" };
  });
  write(journalPath, `${journal.map((row) => JSON.stringify(row)).join("\n")}\n`);
  return { dir, objects, metadataPath, journalPath, objectRoot, output };
}

function runManifest(fixture) {
  return execFileSync(process.execPath, [manifestScript,
    "--metadata-jsonl", fixture.metadataPath,
    "--download-journal-jsonl", fixture.journalPath,
    "--object-root", fixture.objectRoot,
    "--output-directory", fixture.output,
  ], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function expectFailure(executable, args, code) {
  assert.throws(
    () => execFileSync(executable, args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }),
    (error) => `${error.stderr || ""}\n${error.message || ""}`.includes(code),
  );
}

test("manifest reconciles synthetic Storage metadata, bytes, size and hashes", () => {
  const fixture = storageFixture();
  const output = JSON.parse(runManifest(fixture));
  assert.equal(output.status, "PASS");
  assert.equal(output.reconciled_objects, 2);
  assert.equal(output.total_bytes, 9);
  const report = JSON.parse(fs.readFileSync(path.join(fixture.output, "storage-reconciliation-report.json"), "utf8"));
  assert.equal(report.object_names_in_report, false);
  assert.match(fs.readFileSync(path.join(fixture.output, "storage-object-manifest.csv"), "utf8"), /student-a\/front\.jpg/u);
});

test("manifest fails closed when an expected object was not downloaded", () => {
  const fixture = storageFixture();
  const journal = fs.readFileSync(fixture.journalPath, "utf8").trim().split(/\r?\n/u);
  write(fixture.journalPath, `${journal[0]}\n`);
  expectFailure(process.execPath, [manifestScript, "--metadata-jsonl", fixture.metadataPath, "--download-journal-jsonl", fixture.journalPath, "--object-root", fixture.objectRoot, "--output-directory", fixture.output], "STORAGE_RECONCILIATION_FAILED");
});

test("manifest fails closed on database metadata size mismatch", () => {
  const fixture = storageFixture();
  const rows = fs.readFileSync(fixture.metadataPath, "utf8").trim().split(/\r?\n/u).map(JSON.parse);
  rows[0].metadata.size = 99;
  write(fixture.metadataPath, `${rows.map(JSON.stringify).join("\n")}\n`);
  expectFailure(process.execPath, [manifestScript, "--metadata-jsonl", fixture.metadataPath, "--download-journal-jsonl", fixture.journalPath, "--object-root", fixture.objectRoot, "--output-directory", fixture.output], "STORAGE_RECONCILIATION_FAILED");
});

test("manifest fails closed when the remote content length differs", () => {
  const fixture = storageFixture();
  const rows = fs.readFileSync(fixture.journalPath, "utf8").trim().split(/\r?\n/u).map(JSON.parse);
  rows[0].remote_content_length = 99;
  write(fixture.journalPath, `${rows.map(JSON.stringify).join("\n")}\n`);
  expectFailure(process.execPath, [manifestScript, "--metadata-jsonl", fixture.metadataPath, "--download-journal-jsonl", fixture.journalPath, "--object-root", fixture.objectRoot, "--output-directory", fixture.output], "STORAGE_RECONCILIATION_FAILED");
});

function recoveryPointFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-recovery-point-"));
  const artifacts = ["roles.sql", "schema.sql", "data.sql", "history_schema.sql", "history_data.sql"].map((name) => {
    const file = path.join(dir, name);
    write(file, `${name}\n`);
    return { path: file, sha256: sha256File(file), snapshot_bound: name !== "roles.sql", snapshot_fingerprint: name === "roles.sql" ? null : "synthetic-snapshot-a" };
  });
  const storageReport = path.join(dir, "storage-reconciliation-report.json");
  write(storageReport, JSON.stringify({ status: "PASS", metadata_objects: 2, reconciled_objects: 2, missing_objects: 0, extra_objects: 0 }));
  const checkpoint = {
    decision: "AUTHORIZED_CONSISTENT_BACKUP_WINDOW",
    production_readiness: "NO_GO",
    freeze: {
      started_at_utc: "2026-10-09T00:00:00Z",
      ended_at_utc: "2026-10-09T00:10:00Z",
      application_writes_frozen: true,
      storage_writes_frozen: true,
      background_jobs_paused: true,
    },
    database: {
      snapshot_started_at_utc: "2026-10-09T00:01:00Z",
      snapshot_completed_at_utc: "2026-10-09T00:04:00Z",
      artifacts,
    },
    storage: {
      inventory_captured_at_utc: "2026-10-09T00:02:00Z",
      export_started_at_utc: "2026-10-09T00:04:00Z",
      export_completed_at_utc: "2026-10-09T00:09:00Z",
      reconciliation_report_path: storageReport,
    },
  };
  const checkpointPath = path.join(dir, "checkpoint.json");
  const outputPath = path.join(dir, "consistent-recovery-point-report.json");
  write(checkpointPath, JSON.stringify(checkpoint));
  return { dir, checkpoint, checkpointPath, outputPath };
}

test("recovery point verifier accepts one snapshot inside a complete write freeze", () => {
  const fixture = recoveryPointFixture();
  const output = JSON.parse(execFileSync(process.execPath, [recoveryPointScript, "--checkpoint", fixture.checkpointPath, "--output", fixture.outputPath], { cwd: root, encoding: "utf8" }));
  assert.equal(output.status, "PASS");
  assert.equal(output.ready_for_next_restore_drill, true);
});

test("next drill preparation remains non-executing and rejects production targets", () => {
  const fixture = recoveryPointFixture();
  execFileSync(process.execPath, [recoveryPointScript, "--checkpoint", fixture.checkpointPath, "--output", fixture.outputPath], { cwd: root, encoding: "utf8" });
  const planPath = path.join(fixture.dir, "next-restore-drill-plan.json");
  const plan = JSON.parse(execFileSync(process.execPath, [prepareDrillScript, "--checkpoint", fixture.checkpointPath, "--consistency-report", fixture.outputPath, "--output", planPath], { cwd: root, encoding: "utf8" }));
  assert.equal(plan.execute_restore, false);
  assert.equal(plan.production_target_allowed, false);
  assert.equal(plan.production_readiness, "NO_GO");
});

test("next drill preparation fails without a proven consistency report", () => {
  const fixture = recoveryPointFixture();
  write(fixture.outputPath, JSON.stringify({ status: "PARTIAL", ready_for_next_restore_drill: false }));
  expectFailure(process.execPath, [prepareDrillScript, "--checkpoint", fixture.checkpointPath, "--consistency-report", fixture.outputPath, "--output", path.join(fixture.dir, "plan.json")], "CONSISTENT_RECOVERY_POINT_NOT_PROVEN");
});

test("recovery point verifier rejects divergent database snapshot fingerprints", () => {
  const fixture = recoveryPointFixture();
  fixture.checkpoint.database.artifacts[2].snapshot_fingerprint = "synthetic-snapshot-b";
  write(fixture.checkpointPath, JSON.stringify(fixture.checkpoint));
  expectFailure(process.execPath, [recoveryPointScript, "--checkpoint", fixture.checkpointPath, "--output", fixture.outputPath], "DATABASE_ARTIFACTS_NOT_BOUND_TO_ONE_SNAPSHOT");
});

test("recovery point verifier rejects Storage export outside the freeze window", () => {
  const fixture = recoveryPointFixture();
  fixture.checkpoint.storage.export_completed_at_utc = "2026-10-09T00:11:00Z";
  write(fixture.checkpointPath, JSON.stringify(fixture.checkpoint));
  expectFailure(process.execPath, [recoveryPointScript, "--checkpoint", fixture.checkpointPath, "--output", fixture.outputPath], "STORAGE_EXPORT_END_OUTSIDE_FREEZE_WINDOW");
});

test("recovery point verifier rejects secret material in checkpoint evidence", () => {
  const fixture = recoveryPointFixture();
  fixture.checkpoint.password = "must-not-be-recorded";
  write(fixture.checkpointPath, JSON.stringify(fixture.checkpoint));
  expectFailure(process.execPath, [recoveryPointScript, "--checkpoint", fixture.checkpointPath, "--output", fixture.outputPath], "CHECKPOINT_CONTAINS_SECRET_MATERIAL");
});

const hasPowerShell = process.platform === "win32";
test("Storage exporter defaults to plan-only and performs no network access", { skip: !hasPowerShell }, () => {
  const fixture = storageFixture();
  const plannedDestination = path.join(fixture.dir, "future-export");
  const output = JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", exporterScript, "-MetadataJsonl", fixture.metadataPath, "-DestinationRoot", plannedDestination], { cwd: root, encoding: "utf8" }));
  assert.equal(output.Status, "PLAN_ONLY");
  assert.equal(output.NetworkAccess, "NO");
  assert.equal(output.ProductionAccess, "NO");
  assert.equal(fs.existsSync(plannedDestination), false);
});

test("Storage exporter supports a pinned Docker AWS CLI in plan-only mode", { skip: !hasPowerShell }, () => {
  const fixture = storageFixture();
  const plannedDestination = path.join(fixture.dir, "future-docker-export");
  const output = JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", exporterScript,
    "-MetadataJsonl", fixture.metadataPath,
    "-DestinationRoot", plannedDestination,
    "-AwsCliMode", "Docker",
  ], { cwd: root, encoding: "utf8" }));
  assert.equal(output.Status, "PLAN_ONLY");
  assert.equal(output.NetworkAccess, "NO");
  assert.equal(output.RequiredExecutable, "docker");
  assert.match(output.AwsCliImage, /@sha256:[a-f0-9]{64}$/u);
  assert.equal(fs.existsSync(plannedDestination), false);
});

test("Storage exporter rejects a mismatched production endpoint before credentials", { skip: !hasPowerShell }, () => {
  const fixture = storageFixture();
  expectFailure("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", exporterScript,
    "-MetadataJsonl", fixture.metadataPath,
    "-DestinationRoot", path.join(fixture.dir, "future-export"),
    "-Endpoint", "https://wrong-project.storage.supabase.co/storage/v1/s3",
    "-Region", "us-east-2",
    "-ExpectedProjectRef", "vrizeuhuhvtvbrmtvdik",
    "-ExecuteRemote",
  ], "REMOTE_ENDPOINT_IDENTITY_MISMATCH");
});

test("hashed local object names do not disclose bucket or object path", () => {
  const relative = objectRelativePath("sensitive-bucket", "person@example.com/private.jpg");
  assert.doesNotMatch(relative, /sensitive|person|private/iu);
  assert.match(relative, /^objects\/[a-f0-9]{2}\/[a-f0-9]{64}\.blob$/u);
});

test("snapshot keeper and Storage inventory share one read-only snapshot", () => {
  const keeper = fs.readFileSync(snapshotKeeperSql, "utf8");
  const inventory = fs.readFileSync(snapshotInventorySql, "utf8");
  assert.match(keeper, /begin transaction isolation level repeatable read read only;/iu);
  assert.match(keeper, /pg_export_snapshot\(\)/u);
  assert.match(keeper, /\\prompt[\s\S]*rollback;/u);
  assert.match(inventory, /begin transaction isolation level repeatable read read only;/iu);
  assert.match(inventory, /set transaction snapshot :'snapshot_id';/u);
  assert.match(inventory, /\\ir storage-recovery-inventory\.sql/u);
});

test("production pre-flight package remains disabled and preserves NO_GO", () => {
  const executionPackage = fs.readFileSync(preflightPackage, "utf8");
  assert.match(executionPackage, /COLLECTION_AUTHORIZED=NO/u);
  assert.match(executionPackage, /WRITE_FREEZE_ACTIVE=NO/u);
  assert.match(executionPackage, /PRODUCTION_READINESS=NO_GO/u);
  assert.match(executionPackage, /<encrypted-volume>/u);
  assert.match(executionPackage, /PLAN_ONLY/u);
});

test("snapshot dump normalizer mirrors Supabase-safe role and schema filtering", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-dump-normalizer-"));
  const rawRoles = path.join(dir, "roles.raw.sql");
  const roles = path.join(dir, "roles.sql");
  write(rawRoles, "\\restrict token\nCREATE ROLE \"postgres\";\nCREATE ROLE \"custom_backup_role\" NOSUPERUSER NOREPLICATION;\n");
  execFileSync(process.execPath, [dumpNormalizer, "--mode", "roles", "--input", rawRoles, "--output", roles], { cwd: root });
  const rolesText = fs.readFileSync(roles, "utf8");
  assert.doesNotMatch(rolesText, /restrict|CREATE ROLE "postgres"/u);
  assert.match(rolesText, /CREATE ROLE "custom_backup_role";/u);
  assert.match(rolesText, /RESET ALL;/u);

  const rawSchema = path.join(dir, "schema.raw.sql");
  const schema = path.join(dir, "schema.sql");
  write(rawSchema, "\\restrict token\nSET transaction_timeout = 0;\nCREATE TABLE \"public\".\"safe\" ();\nCREATE POLICY \"cron_job_owner\" ON \"cron\".\"job\";\n");
  execFileSync(process.execPath, [dumpNormalizer, "--mode", "schema", "--input", rawSchema, "--output", schema], { cwd: root });
  const schemaText = fs.readFileSync(schema, "utf8");
  assert.doesNotMatch(schemaText, /restrict|transaction_timeout|cron_job_owner/u);
  assert.match(schemaText, /CREATE TABLE IF NOT EXISTS "public"\."safe"/u);
});

test("final encrypted execution package pins tools and cannot authorize collection", () => {
  const executionPackage = fs.readFileSync(finalExecutionPackage, "utf8");
  assert.match(executionPackage, /COLLECTION_AUTHORIZED=NO/u);
  assert.match(executionPackage, /BACKUP_STARTED=NO/u);
  assert.match(executionPackage, /B:\\Aruka\\Recovery\\20261008-213100Z/u);
  assert.match(executionPackage, /supabase.*2\.120\.0/iu);
  assert.match(executionPackage, /aws-cli\/aws-cli@sha256:[a-f0-9]{64}/u);
  assert.match(executionPackage, /--snapshot=\$snapshotId/u);
  assert.match(executionPackage, /--exclude-table=\$table/u);
  assert.match(executionPackage, /RLS_SESSION_TOKEN/u);
});
