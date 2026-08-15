# Student Tenure Production Apply Runbook

## Decision

`DEPLOYMENT_COMPATIBILITY=DATABASE_FIRST`

Production apply is not authorized by this document alone. Use it as the supervised checklist for the future dry-run and apply windows.

## Locked Inputs

- Baseline commit: `e7f9497`
- Migration: `supabase/migrations/20260811090000_student_tenure_contract_model.sql`
- Migration SHA-256: `b768dbb73b1e97e50a5c85cd6b124df4d8ca23c83ab0f7c1855707aa2def10f6`
- Expected pending production migrations: `1`
- Expected pending migration: `20260811090000_student_tenure_contract_model`
- Manifest path: `C:\Backups\Aruka\real-student-tenure-reconciliation-manifest.csv`
- Manifest SHA-256: `aa958678d4c270f7e46c0b778d5513b21db363e5d410dc1c0078e7f5732de6ee`
- Manifest rows: `7`
- Production students in scope: `7` real students
- Production students out of scope: `20` demo/fake records

The manifest must not be edited during apply. If its hash changes, stop.

## External Artifacts

- `C:\Backups\Aruka\dry-run-production-student-tenure-plan.ps1`
- `C:\Backups\Aruka\apply-production-student-tenure-migration.ps1`
- `C:\Backups\Aruka\apply-production-student-tenure-reconciliation.ps1`
- `C:\Backups\Aruka\validate-student-tenure-production-reconciliation.ps1`
- `C:\Backups\Aruka\student-tenure-production-reconciliation.sql`

The reconciliation SQL is sanitized. It contains only `student_id`, confirmed date, and source metadata. It must not contain names, email, phone, notes, or financial data.

## Deployment Order

1. Verify production backup/snapshot.
2. Run read-only production dry-run.
3. Apply exactly the locked migration.
4. Reconcile exactly the 7 real student IDs from the locked manifest.
5. Run SQL post-migration smoke tests.
6. Run backend/RPC smoke tests.
7. Deploy frontend.
8. Run frontend smoke tests.
9. Monitor.

Frontend deploy is blocked until:

- `DATABASE_MIGRATION=PASS`
- `REAL_STUDENT_RECONCILIATION=PASS`
- `DATABASE_SMOKE_TEST=PASS`

## Backup Gate

Before apply, record:

- `PRE_MIGRATION_SNAPSHOT_REQUIRED=YES`
- `BACKUP_VERIFIED=YES`

Do not proceed without a verified production backup/snapshot.

## Migration Scope

The locked migration:

- adds `public.alunos.consultoria_inicio`;
- adds `public.alunos.consultoria_inicio_confianca`;
- constrains confidence to `EXACT`, `DERIVED_HIGH_CONFIDENCE`, `DERIVED_LOW_CONFIDENCE`, `UNKNOWN`;
- creates `public.aluno_contratos`;
- creates constraints, indexes, RLS, grants, and select policy for `public.aluno_contratos`;
- backfills legacy `consultoria_inicio`;
- creates current legacy contract ledger rows;
- creates `public.renovar_aluno_contrato`;
- preserves `consultoria_inicio` during future renewals.

The migration does not reconstruct fictional historical contract chains.

## Reconciliation Scope

Reconciliation updates only:

- `public.alunos.consultoria_inicio`
- `public.alunos.consultoria_inicio_confianca`

It must not update:

- `public.alunos.inicio`
- `public.alunos.vencimento`
- `public.pagamentos`
- `public.aluno_contratos`

The update must target each manifest `student_id` directly. Broad filters such as `user_id` are prohibited.

## Human Confirmation

Apply runners must require the exact text:

`APPLY_STUDENT_TENURE_PRODUCTION`

Do not accept `Y`, `YES`, or similar shortcuts.

## Rollback Strategy

Code rollback is possible by redeploying the previous frontend.

Database rollback after new writes is not automatic. Prefer:

- snapshot restore, if the blast radius requires it;
- supervised forward-fix, if the migration applied cleanly and only data correction is needed.

Do not run an unreviewed reverse migration.
