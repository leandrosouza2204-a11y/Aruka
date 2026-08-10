# Production Reconciliation Package Design

## Objective

Prepare a finite supervised cutover plan from the approved local schema to production without executing remote SQL.

## Current State

Local schema is ready with seven validated migrations. Production remains unreconciled and remote schema equivalence remains blocked until the package is applied.

## Migrations

Seven SQL migrations are in scope. `README.md` and `cutover-manifest.json` are not migrations.

## Baseline Strategy

`20260716090000_baseline_aruka_v1.sql` is `BASELINE_REFERENCE_ONLY`. It must not be replayed against existing production.

## Cutover Target

The target is canonical product/security behavior while preserving remote legacy compatibility objects that do not block the package.

## Sequence

Use the sequence in `reports/supabase-production-sync/production-cutover-sequence.md`.

## Workout Delivery

Object-level reconciliation is required; do not blindly replay the full migration.

## Student Identity

Controlled SQL file candidate after Workout Delivery dependencies are present.

## Security

Controlled SQL file candidate after referenced objects exist; high authorization risk.

## Required Fields

Controlled SQL file candidate with immediate null-count precheck.

## AOE

Grant hardening only. AOE body remains deferred.

## Group A

Controlled hardening candidate if function/trigger/body hash still match evidence.

## Admin/Financial Exclusions

Admin and financial divergences remain `KEEP_REMOTE_FOR_NOW`.

## Prechecks

`reports/supabase-production-sync/production-cutover-prechecks.sql` contains read-only checks.

## Apply Strategy

Manual supervised SQL or controlled SQL files per step. `DB_PUSH_ALLOWED_NOW=NO`.

## Postchecks

`reports/supabase-production-sync/production-cutover-postchecks.sql` contains read-only checks.

## Rollback

Use `reports/supabase-production-sync/production-cutover-recovery-plan.md`.

## Stop Conditions

Stop on unexpected precheck, incompatible existing object, null rows before NOT NULL, changed function body, missing signature, or failed smoke test.

## Production Execution

`PRODUCTION_EXECUTION_AUTHORIZED=NO`.

## History Alignment

`HISTORY_ALIGNMENT_REQUIRED=YES`; `HISTORY_ALIGNMENT_ALLOWED_NOW=NO`.

## CI/CD Next Stage

`NEXT_AFTER_HISTORY_ALIGNMENT=CI_CD_PIPELINE`.
