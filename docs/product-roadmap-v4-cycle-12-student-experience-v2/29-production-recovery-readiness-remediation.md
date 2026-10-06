# Cycle 12.15.7 — production recovery readiness remediation

## 1. Purpose and current decision

This runbook separates backup creation, backup verification, restore, restore validation, and any future production recovery. The 2026-10-05/06 remediation ended safely with:

```text
BACKUP_CREATION=BLOCKED_EXTERNAL_REQUIREMENT
RECOVERY_TECHNICAL_PROOF=BLOCKED
PRODUCTION_READINESS=NO_GO
PRODUCTION_EXECUTION_AUTHORIZED=NO
```

No production migration or mutation is part of this runbook execution without a separate future human authorization.

## 2. Preconditions

- Confirm `main`, expected commit, zero divergence, clean worktree, 40 executable migrations, and rollout `OFF`.
- Confirm source project `aruka` / `vrizeuhuhvtvbrmtvdik`; it is read-only for this operation.
- Use Supabase CLI compatible with PostgreSQL 17, Docker Desktop, `psql`, and SHA-256 tooling. Record exact versions.
- Obtain the Session Pooler connection string and database password interactively from an authorized operator. Never place either in Git, reports, shell history, process output, or chat.
- Create the backup directory outside the repository with access restricted to the operator.
- Create a new, empty, disposable PostgreSQL 17 target. Verify its host/project reference is not `vrizeuhuhvtvbrmtvdik`.
- Define a human retention policy before creating the artifact.

Abort if any identity check fails, the target is production, a secret would be logged, the worktree contains unrelated human changes that would be overwritten, or a command implies a remote schema/history/data write.

## 3. Backup creation

Follow the official [Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) procedure. Use an environment variable or secure prompt for the source URL; examples below deliberately contain placeholders.

Create these files in the external directory:

```text
roles.sql
schema.sql
data.sql
history_schema.sql
history_data.sql
backup-metadata.json
SHA256SUMS.txt
```

Run the official logical dump sequence for roles, schema, and data. Also dump `supabase_migrations` schema and data separately, as required by the official migration-history preservation guidance. Exclude `storage.buckets_vectors` and `storage.vector_indexes` from data if required by the target version.

Record only safe metadata:

```text
BACKUP_TYPE=LOGICAL_SUPABASE_CLI
BACKUP_STARTED_AT=<UTC>
BACKUP_COMPLETED_AT=<UTC>
BACKUP_SIZE_BYTES=<integer>
BACKUP_SHA256=<sha256 of an immutable archive or manifest>
SOURCE_PROJECT_REF=vrizeuhuhvtvbrmtvdik
SOURCE_REMOTE_HISTORY_COUNT=25
CLI_VERSION=<version>
POSTGRES_VERSION=17.6
```

Database backups do not cover Storage object bytes. If Storage recovery is in scope, export objects separately with an approved secret-key workflow and a per-object manifest; do not mix object names or contents into versioned evidence.

## 4. Backup verification

1. Verify every expected file exists, is non-empty, and is outside the repository.
2. Recalculate SHA-256 and compare it to `SHA256SUMS.txt`.
3. Check that the schema dump contains tables, functions, indexes, constraints, policies, RLS, grants, and triggers.
4. Check that the data dump uses `COPY` or `INSERT` statements and that migration history contains exactly 25 entries ending at `20260909110000`.
5. Scan logs and metadata for URLs with passwords, tokens, secret keys, JWTs, emails, and phone numbers. Raw dumps are sensitive by definition and must not be scanned into console output.
6. Do not accept a successful exit code without non-empty files and matching hashes.

Abort on a missing file, hash mismatch, unexpected project reference, secret in logs, incomplete migration history, or backup completion after any production migration has begun.

## 5. Isolated restore

The destination must be a newly created disposable local PostgreSQL/Supabase environment or an explicitly non-production temporary project. Never restore onto `vrizeuhuhvtvbrmtvdik`.

1. Record `RESTORE_STARTED_AT` in UTC.
2. Verify the target database is empty/disposable and PostgreSQL-major compatible.
3. Restore roles, schema, and data in one transaction with error-stop enabled, following the official `psql` procedure and setting `session_replication_role = replica` only for the data load.
4. Restore `history_schema.sql` and `history_data.sql` to preserve migration history.
5. Record exit status, completion UTC, and duration.
6. Keep the target network-isolated from application traffic; disable jobs, webhooks, cron, replication, and outbound integrations before validation.

Abort immediately on target identity ambiguity, any route to production, restore error, extension incompatibility, unexpected outbound action, or evidence that PII could be printed.

## 6. Restore validation

Run metadata and aggregate-only checks. Never print user rows.

- Migration history: `25`; last version `20260909110000`.
- Public tables/RLS: `30/30`.
- Public function signatures: `49`.
- Public policies: `75`; direct `auth.uid()` `70`.
- Anonymous-executable `SECURITY DEFINER`: `17`.
- Private schema and rollout objects: absent.
- Legacy `alunos` policies: `4`.
- Compare column, index, constraint, function/ACL, policy/RLS, and relevant grant fingerprints to the source snapshot.
- Confirm all 52 public foreign keys are validated and no constraint is unvalidated.
- Compare aggregate counts for critical tables without returning row contents.
- Validate sequences where present and verify referential integrity with `NOT EXISTS` checks generated from catalog metadata.

Set `RESTORE_INTEGRITY=PASS` only if every comparison matches or an investigated, documented exception is accepted by a human owner.

## 7. RPO and RTO

- Recovery point is the backup's consistent snapshot/completion point evidenced by the dump process; document the exact semantics used.
- Measured RPO is the difference between the declared incident/cutover reference time and that recovery point. Do not substitute file modification time without proving it represents the snapshot.
- Measured RTO starts when restore work begins and ends only after critical validation declares the database usable.
- Record restore duration and validation duration separately.
- If no business thresholds exist, set `RPO_RTO_ACCEPTANCE=HUMAN_DECISION_REQUIRED`; technical proof alone does not promote production readiness to `GO`.

## 8. Cleanup and artifact handling

- Destroy only the disposable target after validation evidence is captured. Reconfirm its resolved identity before deletion.
- Preserve the original backup until the human retention owner authorizes disposal. Do not delete the only valid recovery artifact automatically.
- Store the backup encrypted at rest with restricted access. Keep hashes and safe metadata in the report, never raw content.
- Remove temporary connection environment variables and credential-bearing shell history.

## 9. Escalation and future production recovery

Escalate to the database owner on credential, hash, restore, integrity, or identity failure. Escalate to the privacy/security owner on possible PII or credential exposure. Escalate to the product owner for RPO/RTO acceptance.

Production recovery is a separate incident procedure. It requires explicit human authorization, a selected recovery point, maintenance communication, write freeze, verified backup, rollback criteria, and a dedicated production change record. This remediation never authorizes a restore, migration, repair, or reset on production.

## 10. Evidence from this attempt

- Free plan confirmed; managed daily backups and PITR are unavailable for this project tier.
- A historical external artifact from 2026-08-03 remains preserved, but it is stale and has no restore-drill evidence.
- Current source history is 25 migrations; the remote schema/security baseline and aggregate counts were captured read-only on 2026-10-06 UTC.
- Required current production database connection secret was absent, so no new dump or restore target was created.
- Repository safeguards now ignore `*.sql.gz`, `backups/`, and `restore-drill/`; real artifacts must still be created outside the repository.
- Measured RPO and RTO remain unavailable; Gate 4 remains `NO_GO`.
