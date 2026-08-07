# Production Migration History Alignment Discovery

## Objective

Complete read-only discovery for production migration history alignment after the six-step manual cutover.

## Post-Cutover State

Manual cutover is complete: `6/6` steps reconciled.

- Step01 Workout Delivery: `RECONCILED`
- Step02 Student Identity: `RECONCILED`
- Step03 Security Reconciliation: `RECONCILED`
- Step04 Required Fields: `RECONCILED`
- Step05 AOE Security: `RECONCILED`
- Step06 Group A Security: `RECONCILED`

Migration repair, db push, mutable SQL, persistent Supabase link, CI/CD, commit, push, and PR were not executed.

## Method

The remote discovery used Docker with `public.ecr.aws/supabase/postgres:17.6.1.156` and Session Pooler credentials supplied outside the repository. The SQL ran inside `BEGIN; SET TRANSACTION READ ONLY; ... ROLLBACK;`.

Raw outputs remain outside Git under `C:\Backups\Aruka`.

## Remote Registry

Confirmed markers:

- `SUPABASE_MIGRATIONS_SCHEMA_PRESENT=NO`
- `MIGRATION_HISTORY_TABLE_PRESENT=NO`
- `REMOTE_HISTORY_REGISTRY_STATE=ABSENT`
- `REMOTE_HISTORY_COUNT=0`
- `REMOTE_HISTORY_QUERY_SKIPPED=TABLE_ABSENT`
- `ROLLBACK_CONFIRMED=YES`

The absent canonical registry is a valid discovery result. It does not prove no schema work was ever applied; it means the canonical CLI history table is absent.

## Alternate Registries

Potential registry metadata was found:

- `auth.schema_migrations` (`r`)
- `auth.schema_migrations_pkey` (`i`)
- `realtime.schema_migrations` (`r`)
- `realtime.schema_migrations_pkey` (`i`)
- `storage.migrations` (`r`)
- `storage.migrations_name_key` (`i`)
- `storage.migrations_pkey` (`i`)

These are classified only as `POTENTIAL_REMOTE_HISTORY_REGISTRY`. Their contents were not queried and they are not treated as the official application migration registry.

## Local Inventory

`LOCAL_MIGRATION_COUNT=7`

The local inventory is recorded in `reports/supabase-production-sync/migration-history-alignment-matrix.csv` with version, filename, hash, production effect status, cutover mapping, and repair candidate classification.

## Seven-Migration Analysis

- `20260716090000_baseline_aruka_v1.sql`: baseline schema reference covering tables, functions, policies, grants, triggers, and historical runtime shape. Classified `REFERENCE_ONLY_BASELINE`.
- `20260728030000_workout_delivery_integration_v1.sql`: workout lifecycle columns, backfills, constraints, indexes, event table, policies, grants, and workout delivery RPCs. Covered by Step01.
- `20260730090000_student_identity_contract.sql`: student account link column, constraints, indexes, role expansion, student-link RPCs, and minimized workout read RPC. Covered by Step02.
- `20260731190000_reconcile_security_policies_and_grants.sql`: policy and grant reconciliation across public tables and functions. Covered by Step03. It did not replace deferred admin, financial, or AOE function bodies.
- `20260801143335_reconcile_alunos_required_fields.sql`: required `alunos` fields. Covered by Step04.
- `20260801173000_revoke_aoe_idempotency_anon_execute.sql`: isolated AOE anon execute revoke with body intentionally unchanged. Covered by Step05.
- `20260801180000_harden_workout_templates_updated_at.sql`: search path and execute privilege hardening for the Group A trigger function. Covered by Step06.

## Fully Reconciled

The six incremental migrations for Steps 01-06 are `FULLY_APPLIED` in production evidence and missing from the absent canonical remote history registry.

## Partial Or Deferred

No incremental migration is classified as partially reconciled in this discovery. Deferred decisions remain preserved outside the six applied increments:

- AOE body: `DEFERRED`
- Admin: `KEEP_REMOTE_FOR_NOW`
- Financial: `KEEP_REMOTE_FOR_NOW`
- Remote overloads: `PRESERVE_FOR_COMPATIBILITY`

## Baseline

The baseline is `REFERENCE_ONLY_BASELINE`, production effect status `REFERENCE_ONLY`, and is not a repair candidate.

## Repair Candidates

Six local incremental migrations are candidates for future `repair applied` review because their production effects are fully applied, the canonical registry is absent, and they do not contain deferred scope.

This does not authorize migration repair.

## Not Safe

The baseline is `NOT_SAFE_FOR_REPAIR` because it is reference-only and must not be automatically marked applied.

## Blockers

No blocking conflict was found in the canonical registry because it is absent. Alternate registry metadata remains review-only.

## Decision

`READY_FOR_MIGRATION_HISTORY_ALIGNMENT_REVIEW`

## Next Step

`REVIEW_EXACT_MIGRATION_REPAIR_PLAN`

Migration repair remains unauthorized. Db push remains disallowed.
