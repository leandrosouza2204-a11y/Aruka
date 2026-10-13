import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { isAbsolute, join, relative, resolve } from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const output = resolve(required("--output"));
const factsPath = resolve(required("--facts"));
const outputRelative = relative(root, output);

if (!outputRelative.startsWith("..") && !isAbsolute(outputRelative)) throw new Error("OUTPUT_MUST_BE_OUTSIDE_REPOSITORY");
if (!existsSync(output)) throw new Error("OUTPUT_DIRECTORY_MISSING");

const facts = JSON.parse(readFileSync(factsPath, "utf8"));
const requiredFacts = [
  "observed_at_utc", "project_ref", "project_status", "branch", "reference_commit", "inventory_fingerprint",
  "assessment_bucket_objects", "assessment_bucket_bytes", "exercise_media_objects", "referenced_objects",
  "unreferenced_objects", "photo_reference_occurrences", "evaluation_rows", "student_records", "owner_records",
  "migration_history_count", "latest_migration", "pending_migrations", "student_v2_enabled", "database_backup_sha256",
  "database_restore_evidence_sha256", "migration_manifest_sha256", "storage_recovery_decision", "test_data_disposition",
  "storage_backup_required", "database_fresh_snapshot_required"
];
if (Object.keys(facts).some((key) => !requiredFacts.includes(key))) throw new Error("UNEXPECTED_FACT_FIELD");
for (const key of requiredFacts) if (!(key in facts)) throw new Error(`MISSING_FACT_FIELD:${key}`);
if (facts.project_ref !== "vrizeuhuhvtvbrmtvdik") throw new Error("PROJECT_REF_MISMATCH");
if (facts.assessment_bucket_objects !== 8 || facts.assessment_bucket_bytes !== 2113714 || facts.exercise_media_objects !== 0) throw new Error("STORAGE_BASELINE_DRIFT");
if (facts.referenced_objects !== 6 || facts.unreferenced_objects !== 2 || facts.photo_reference_occurrences !== 6) throw new Error("REFERENCE_BASELINE_DRIFT");
if (facts.migration_history_count !== 25 || facts.pending_migrations !== 16 || facts.student_v2_enabled !== false) throw new Error("PRODUCTION_BASELINE_DRIFT");
if (facts.storage_recovery_decision !== "ACCEPT_DATABASE_ONLY" || facts.test_data_disposition !== "DELETION_AUTHORIZED_BUT_DEFERRED" || facts.storage_backup_required !== false) throw new Error("OWNER_DECISION_INVALID");
if (/(service[_-]?role|refresh[_-]?token|access[_-]?token|secret[_-]?access|bearer\s+|eyJ[A-Za-z0-9_-]{10,}\.)/i.test(JSON.stringify(facts))) throw new Error("SENSITIVE_VALUE_PATTERN_DETECTED");

const decision = {
  decision: "READY_FOR_G4_2_AUTHORIZATION",
  mission: "ARUKA_G4_2_PRE_STORAGE_TEST_DATA_RISK_ACCEPTANCE",
  generated_at_utc: new Date().toISOString(),
  owner_decision: {
    storage_recovery_decision: facts.storage_recovery_decision,
    test_objects: facts.assessment_bucket_objects,
    test_data_disposition: facts.test_data_disposition,
    storage_backup_required_for_g4_2: facts.storage_backup_required,
    scope_limit: "Only the eight confirmed test objects present in avaliacoes-fotos at the recorded inventory fingerprint.",
    accepted_loss: "The owner accepts that these object bytes are absent from the PostgreSQL backup and may be lost."
  },
  storage: {
    buckets: { "avaliacoes-fotos": 8, "exercise-media": 0 },
    total_bytes: facts.assessment_bucket_bytes,
    inventory_fingerprint: facts.inventory_fingerprint,
    objects_deleted: 0,
    backup_performed: false,
    recovery_risk: "ACCEPTED_FOR_TEST_DATA"
  },
  dependencies: {
    referenced_objects: facts.referenced_objects,
    unreferenced_objects: facts.unreferenced_objects,
    photo_reference_occurrences: facts.photo_reference_occurrences,
    evaluation_rows: facts.evaluation_rows,
    student_records: facts.student_records,
    owner_records: facts.owner_records,
    deletion_impact: "Deleting the referenced objects without separate database cleanup leaves six broken photo references."
  },
  database: {
    history_count: facts.migration_history_count,
    latest_migration: facts.latest_migration,
    pending_migrations: facts.pending_migrations,
    fresh_snapshot_required: facts.database_fresh_snapshot_required,
    migrations_authorized: false
  },
  rollout: { student_v2_enabled: false, activation_authorized: false },
  production_changes: [],
  preserved_evidence: {
    database_backup_sha256: facts.database_backup_sha256,
    database_restore_evidence_sha256: facts.database_restore_evidence_sha256,
    migration_manifest_sha256: facts.migration_manifest_sha256
  }
};

const evidence = join(output, "evidence");
const operations = join(output, "operations");
const checkpoints = join(output, "checkpoints");
for (const directory of [evidence, operations, checkpoints]) mkdirSync(directory, { recursive: true });
writeExclusive(join(evidence, "storage-risk-acceptance-closeout.json"), `${JSON.stringify(decision, null, 2)}\n`);
writeExclusive(join(evidence, "storage-risk-acceptance-closeout.md"), report(decision));
writeExclusive(join(evidence, "storage-risk-matrix.md"), riskMatrix());
writeExclusive(join(operations, "g4-2-readiness-runbook-v2.md"), readinessRunbook());
writeExclusive(join(operations, "g4-2-operational-checklist.md"), checklist());
writeExclusive(join(operations, "future-test-storage-cleanup-runbook.md"), cleanupRunbook());
writeExclusive(join(checkpoints, "P2-P8-storage-risk-acceptance.json"), `${JSON.stringify({ status: "PASS_WITH_OWNER_RISK_ACCEPTANCE", observed_at_utc: facts.observed_at_utc, decision: decision.decision, resume_gate: "G4_2_AUTHORIZATION" }, null, 2)}\n`);

console.log(JSON.stringify({ decision: decision.decision, files_written: 7, credentials_logged: false, objects_deleted: 0, backup_performed: false }, null, 2));

function writeExclusive(path, content) { writeFileSync(path, content, { encoding: "utf8", flag: "wx" }); }
function required(flag) { const index = args.indexOf(flag); if (index < 0 || !args[index + 1]) throw new Error(`REQUIRED_ARGUMENT_MISSING:${flag}`); return args[index + 1]; }
function report(value) { return `# G4.2-PRE Storage risk acceptance closeout\n\nDECISION: **${value.decision}**\n\n- BACKUP_STORAGE: WAIVED_BY_OWNER\n- STORAGE_RECOVERY_RISK: ACCEPTED_FOR_TEST_DATA\n- STORAGE_RECOVERY_DECISION: ACCEPT_DATABASE_ONLY\n- TEST_OBJECTS: 8\n- TEST_DATA_DISPOSITION: DELETION_AUTHORIZED_BUT_DEFERRED\n- OBJECTS_DELETED: 0\n- STORAGE_BACKUP_PERFORMED: NO\n- DATABASE_BACKUP: FRESH_SNAPSHOT_STILL_REQUIRED\n- PRODUCTION_MIGRATIONS: NOT_AUTHORIZED\n- STUDENT_V2_ROLLOUT: NOT_AUTHORIZED\n\nThe waiver is limited to the eight confirmed test objects represented by the recorded inventory fingerprint. Any new object, real student file, changed fingerprint, or different bucket requires a new decision. Six objects have six database photo references across two evaluation rows; future deletion without separately authorized database cleanup leaves broken references.\n`;
}
function riskMatrix() { return `# Storage risk matrix\n\n| Risk | Classification | Decision / mitigation |\n|---|---|---|\n| Loss of the eight confirmed test object bytes | Accepted | Owner accepts database-only recovery for this exact inventory. |\n| New or real files accidentally included | Critical / not accepted | Re-inventory immediately before cleanup; stop on any drift. |\n| Six dangling database photo references after deletion | High / open | Separate DML authorization is required to clear nullable URL fields or accept broken links. |\n| Two unreferenced objects | Low / accepted test-data loss | Delete only under a future Storage deletion authorization. |\n| Non-atomic Database/Storage cleanup | High | Freeze, exact manifest, stepwise verification, stop on partial failure; never auto-rollback. |\n| Stale PostgreSQL recovery point | Critical | Create and validate a fresh snapshot immediately before G4.2. |\n| Automatic Vercel production deployment | High | No push or merge without specific authorization. |\n`;
}
function readinessRunbook() { return `# G4.2 readiness runbook v2\n\nStatus: READY FOR AUTHORIZATION; NOT AUTHORIZED FOR EXECUTION.\n\n1. Assign operator, reviewer, recovery custodian and monitoring owner; do not invent names.\n2. Confirm maintenance/freeze explicitly; it is not active by default.\n3. Recheck Storage inventory. Any count, size, fingerprint, bucket or data-classification drift is STOP.\n4. Create and validate a fresh PostgreSQL snapshot immediately before the window.\n5. Confirm production history remains 25 and the prepared 16-file package hashes match its manifest.\n6. Confirm Student V2 remains OFF and V1 fallback is healthy.\n7. Confirm Vercel project, prior deployment and automatic deployment risk without changing configuration.\n8. Require explicit migration authorization before executing the exact numbered sequence.\n9. Stop on hash/history drift, SQL error, health/security regression, lost recovery point, unexpected writes, or inability to monitor.\n10. Do not automatically restore, rollback, delete Storage objects or activate Student V2.\n`;
}
function checklist() { return `# G4.2 operational checklist\n\n- [ ] Operator assigned\n- [ ] Reviewer assigned\n- [ ] Recovery custodian assigned\n- [ ] Monitoring owner assigned\n- [ ] Formal migration authorization recorded\n- [ ] Freeze confirmed active\n- [ ] Storage inventory unchanged or new owner decision obtained\n- [ ] Fresh PostgreSQL snapshot created and isolated validation PASS\n- [ ] Migration history exactly 25\n- [ ] All 16 canonical hashes match\n- [ ] Vercel automatic deployment risk reviewed\n- [ ] Student V2 confirmed OFF\n- [ ] V1 fallback precheck PASS\n- [ ] Stop criteria and contingency authority acknowledged\n`;
}
function cleanupRunbook() { return `# Future cleanup of confirmed test Storage objects\n\nThis runbook does not authorize execution.\n\n1. Obtain a separate operational authorization identifying the exact eight test objects and whether database DML is authorized.\n2. Re-inventory both buckets immediately before action. Stop on any new object, size/fingerprint drift, or uncertainty about test classification.\n3. Confirm a fresh validated PostgreSQL snapshot, maintenance/freeze, assigned operators and monitoring.\n4. Produce a private metadata-only manifest in the protected recovery volume; do not copy object bytes unless the owner changes the waiver.\n5. Reconfirm six object references in the three nullable columns of two evaluation rows and two unreferenced objects.\n6. If DML cleanup is authorized, clear only the six exact test URL references with a reviewed transaction and read-back verification. Otherwise record that deletion will leave broken URLs.\n7. Under the separate Storage deletion authorization, delete only the exact manifest set. Stop on a partial failure; do not retry broadly or use wildcards.\n8. Re-inventory Storage and verify zero unexpected deletions. Requery database reference counts and application health.\n9. Preserve sanitized evidence. Never auto-restore or modify policies, Auth, buckets, Vercel or rollout.\n`;
}
