# G4.2 supervised production migration runbook

## Scope and authority

This runbook is executable only after a separate production change authorization. It applies sixteen database migrations. It does not authorize Student V2 activation, Storage changes, Auth changes, Edge Function deployment, Vercel configuration changes, migration repair, `db push`, or manual history editing.

Plain timestamp-ordered `supabase db push` is prohibited because the rehearsed operational order applies `20261004133801` before `20260926174027` and `20261003163830`. Every migration and its history insertion must commit atomically in the approved staged package.

## Roles

- Incident commander: GO/NO-GO and escalation.
- Database operator: freeze confirmation, snapshot, staged execution and catalog checks.
- Recovery operator: isolated restore proof and emergency restore readiness.
- Application/Vercel operator: deployment identity, logs, rollback candidate and V1 smokes.
- Security reviewer: advisor, ACL, RLS and privileged-function checkpoints.
- QA owner: smoke evidence and final sign-off.

No single operator approves and executes a critical checkpoint alone.

## A. Pre-implementation

1. Open the approved change record and record all role names, UTC window and communication channel.
2. Freeze writes, scheduled jobs, deployments and other migrations. Confirm no concurrent operator.
3. Run Git read-only checks:

   ```powershell
   git fetch origin main
   git status --short --branch
   git rev-parse HEAD
   git rev-parse origin/main
   ```

   Require the approved commit on both refs and no unexpected worktree entry.
4. Run `read-only-queries.sql` through the authorized read-only connection. Require project/history/catalog equality with the 25-migration baseline.
5. Recalculate canonical LF hashes for all sixteen inputs and compare them with the approved change attachment. Require the security hash `8673CF...EB21`.
6. In Vercel, record deployment ID/SHA, canonical domains, rollback deployment, relevant variable names and log availability without exporting values. Require no automatic deployment in progress.
7. Confirm current Student V2 capability/rollout is OFF. Before schema, rollout objects must be absent; after step 15 they must be OFF/false/zero.
8. Execute the approved fresh backup workflow from document 39/scripts, preserving the G2 dump. Store the new dump under a new UTC directory on the encrypted recovery volume.
9. Require host/container SHA equality and a clean isolated restore/validation using a new run ID. Record RPO and measured RTO.
10. Record one of: `STORAGE_DATABASE_ONLY_RISK_ACCEPTED` or `STORAGE_BYTES_BACKUP_VERIFIED`. Otherwise stop.
11. Open Supabase PostgreSQL/Auth/PostgREST/Function logs and Vercel runtime/build logs. Record the 30-minute baseline.

## B. Exact execution order

Prepare the offline package into a new, empty directory on the approved encrypted recovery volume. The preparer has no database/network code, refuses repository output and refuses `--execute`:

```powershell
node scripts/prepare-aruka-g4-2-package.mjs --output 'B:\Aruka\Recovery\<window-id>\g4-2-staged'
```

Review `manifest.json` with two operators before using it. Each generated staged file:

- set `ON_ERROR_STOP`;
- begin one transaction unless the source already owns it;
- contain one unmodified migration;
- insert that exact version/name/statements into `supabase_migrations.schema_migrations` inside the same transaction;
- commit once;
- contain no credential, endpoint or unrelated statement.

Execute with the approved `psql` binary and a protected connection variable. The operator must discover/record the binary version before the window; do not print the connection string. Set `$StagedFile` to the next exact `staged_file` from the reviewed manifest; never loop unattended.

```powershell
& $PsqlPath -X $env:ARUKA_PRODUCTION_DATABASE_URL -v ON_ERROR_STOP=1 -f $StagedFile
if ($LASTEXITCODE -ne 0) { throw 'STOP_MIGRATION_FAILED' }
```

Run exactly one staged file at a time in this order:

| Step | Version | Migration | Required checkpoint |
| ---: | --- | --- | --- |
| 1 | 20260914130000 | cycle12_execution_tracking_and_safety | columns/constraints/indexes valid; critical counts stable |
| 2 | 20260914131000 | cycle12_execution_commands | command signatures/grants match |
| 3 | 20260914132000 | cycle12_completion_and_grants | completion grants and policies match |
| 4 | 20260914185833 | cycle12_canonical_execution_reads | invoker view/read RPC contracts pass |
| 5 | 20260915014848 | cycle12_student_home_v2 | Home read contract passes |
| 6 | 20260915140229 | cycle12_student_training_library_v2 | Library read contract passes |
| 7 | 20260915201101 | cycle12_workout_player_v2 | Player payload contract passes |
| 8 | 20260919120000 | cycle12_set_tracking_player_payload | set tracking/zero values pass |
| 9 | 20260919231657 | cycle12_rest_timer_server_clock | server clock/rest contract passes |
| 10 | 20260920104727 | cycle12_workout_completion_feedback | feedback table/RLS/FK pass |
| 11 | 20260920144904 | cycle12_student_evolution_v2 | evolution reads pass |
| 12 | 20260921010053 | cycle12_profile_secondary_flows | contact/profile minimization passes |
| 13 | 20261004133801 | cycle12_forward_schema_security_reconciliation | two-operator approval; reconciliation inventory passes |
| 14 | 20260926174027 | cycle12_schema_rls_hardening | two-operator approval; RLS/ACL allowlist passes |
| 15 | 20261003163830 | cycle12_controlled_rollout_foundation | OFF, emergency false, zero targets; V1 fallback passes |
| 16 | 20261011232512 | harden_privileged_function_execution | anonymous privileged executors = 0; reviewed callers pass |

After each step, query history for that version and run its approved read-only checkpoint. Save stdout/stderr and duration in the restricted evidence directory. Continue only when the transaction state, history and postcheck are unambiguous.

## Stop conditions and partial failure

Stop immediately and keep maintenance/freeze active on:

- project, history, hash, schema, policy, grant or function mismatch;
- unexpected lock duration or service error-rate threshold;
- failed statement, uncertain transaction outcome or migration absent after uncertain connection loss;
- invalid index, FK orphan, critical row-count decrease or cross-user data visibility;
- anonymous privileged execution after step 16;
- rollout enabled, emergency state unexpected or any target present;
- backup/restore evidence unavailable or Storage decision absent.

If the failed transaction is proven rolled back and history is absent, diagnose and seek incident-commander/DBA approval before retrying that same step. If commit state is uncertain, do not retry and do not repair history. Determine schema/history state read-only and escalate. Use a reviewed forward-only compensating migration for a known post-commit defect; restore only under the approved recovery decision.

## C. Post-implementation

1. Require exactly 41 migration versions and no unexpected pending item.
2. Run the complete read-only catalog, RLS, ACL, function/search-path, index, FK and critical-count suite.
3. Run Security Advisor. Require anonymous privileged-function count 0; classify any remaining warning.
4. Require rollout config `global_enabled=false`, `emergency_blocked=false`, zero targets and no unintended event.
5. Run non-mutating Auth, professional and Student V1 smokes. V2 activation/smoke is not part of this gate.
6. Confirm Vercel still serves the approved deployment. A separate deploy is needed only under an independently approved application change; do not deploy automatically from this runbook.
7. Monitor Supabase and Vercel for at least 60 minutes. Suggested stop thresholds:
   - any cross-user, RLS, permission-escalation or anonymous privileged-access event;
   - any PostgreSQL `PANIC`/`FATAL`, repeated migration-related `ERROR`, invalid index or integrity failure;
   - Auth 5xx > 1% over 5 minutes or sustained 4xx at more than 3× the pre-change baseline with confirmed user impact;
   - RPC/PostgREST 5xx > 1% over 5 minutes or 5 consecutive failures on a critical V1 path;
   - Vercel 5xx > 1% over 5 minutes, critical route smoke failure, or approved deployment identity mismatch.
8. Record final GO/NO-GO and only then lift freeze.

## D. Contingency

- Interface defect: keep rollout OFF; promote the recorded previous Vercel deployment only under deployment authorization.
- Known database compatibility defect with intact data: create a new reviewed forward-only compensating migration; never edit an applied file.
- Integrity loss, uncertain commit, unrecoverable partial state or security boundary failure: maintain outage, preserve evidence and invoke the approved fresh-snapshot recovery procedure.
- Storage is not restored by the database dump. Invoke the separately approved byte-recovery procedure only if it exists; otherwise state the accepted limitation.

## E. Activation boundary

Student V2 activation is a later, separately authorized stage. After G4.2, the required state remains master OFF, emergency false and zero targets. A future activation must revalidate a synthetic demo identity, a V1 control identity, isolation, telemetry and kill switch, and must never activate a real cohort automatically.
