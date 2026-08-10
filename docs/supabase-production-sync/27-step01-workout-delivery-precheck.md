# Step 01 Workout Delivery Precheck

## Objective

Start the supervised production cutover for Aruka only through `PRODUCTION_CUTOVER_STEP_01_WORKOUT_DELIVERY_PRECHECK_AND_GO_NO_GO`.

## Authorization

`SUPERVISED_CUTOVER_START_AUTHORIZED=YES`

`STEP01_PRECHECK_AUTHORIZED=YES`

`STEP01_APPLY_AUTHORIZED=NO`

## Backup Gate

Backup reference: `aruka-pre-cutover-20260803-173701`

The versioned backup evidence confirms `backup_verified=true`, `restore_method_reviewed=true`, `restore_executed=false`, zero checksum mismatches, zero missing or extra storage files, and no detected secret leak.

## Connection Method

Planned method: Session Pooler URI with local secure password entry and read-only transaction wrapper.

Actual method: prepared for secure manual execution through Docker psql using local image `public.ecr.aws/supabase/postgres:17.6.1.156`.

Windows `psql.exe` required: `NO`

Global Supabase CLI required: `NO`

Persistent link required: `NO`

Runner: `C:\Backups\Aruka\run-step01-workout-delivery-precheck.ps1`

Runtime SQL: `C:\Backups\Aruka\step01-workout-delivery-precheck-runtime.sql`

Persistent link created: `NO`

## Project Confirmation

Project: `aruka`

Project ref masked: `vriz...vdik`

Project verification completed from the remote precheck evidence: database `postgres`, user `postgres`, server version containing `PostgreSQL 17.6`.

## Read-Only Gate

Precheck file: `reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-precheck.sql`

The file contains only read-only catalog and metadata queries using `SELECT`, `information_schema`, `pg_catalog`, `pg_constraint`, `pg_indexes`, `pg_proc`, `pg_class`, and `pg_policies`.

## Objects Reviewed

The Step 01 precheck covers `treino_eventos`, Workout Delivery columns on `treinos` and `treino_eventos`, constraints, indexes, RPC hashes for `salvar_treino_composto`, `entregar_treino`, `alterar_estado_treino`, RLS, policies, and grants.

## Divergences

Expected remote drift: `0`

Compatible variations: `0`

Blocking remote drift: `0`

Out-of-scope differences: `0`

## Blockers

None.

## Decision

`GO_FOR_STEP01_APPLY_REVIEW`

## Next Step

User review and explicit Step 01 apply authorization.
