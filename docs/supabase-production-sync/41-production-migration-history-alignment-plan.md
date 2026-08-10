# Production Migration History Alignment Plan

## Objective

Define the exact future migration history alignment plan after discovery concluded with `READY_FOR_MIGRATION_HISTORY_ALIGNMENT_REVIEW`.

This is a review and plan only. No migration repair, db push, migration up, mutable remote SQL, persistent Supabase link, CI/CD, commit, push, or PR was executed.

## Current State

The canonical project migration registry is absent:

- `SUPABASE_MIGRATIONS_SCHEMA_PRESENT=NO`
- `MIGRATION_HISTORY_TABLE_PRESENT=NO`
- `REMOTE_HISTORY_COUNT=0`
- `REMOTE_HISTORY_QUERY_SKIPPED=TABLE_ABSENT`

Manual cutover is complete: `6/6`.

## Local Inventory

Seven local migrations were reviewed:

- `20260716090000_baseline_aruka_v1.sql`
- `20260728030000_workout_delivery_integration_v1.sql`
- `20260730090000_student_identity_contract.sql`
- `20260731190000_reconcile_security_policies_and_grants.sql`
- `20260801143335_reconcile_alunos_required_fields.sql`
- `20260801173000_revoke_aoe_idempotency_anon_execute.sql`
- `20260801180000_harden_workout_templates_updated_at.sql`

## Baseline

`20260716090000_baseline_aruka_v1.sql` is classified as `REFERENCE_ONLY_BASELINE`.

For history repair purposes:

- production effect status: `REFERENCE_ONLY`
- fully reconciled: `false`
- repair candidate: `false`
- recommended action: `DO_NOT_MARK_APPLIED_AUTOMATICALLY`

The baseline must not be inserted between the six future candidates.

## Candidate Review

The six incremental migrations remain future candidates because each file exists, each hash is stable, each mapped Step passed apply/postcheck evidence, no statement remains pending in that migration, and none contains deferred body/overload scope.

Deferred decisions remain outside these candidates:

- AOE function body: `DEFERRED`
- Admin functions: `KEEP_REMOTE_FOR_NOW`
- Financial functions/contracts: `KEEP_REMOTE_FOR_NOW`
- Remote overload compatibility: `PRESERVE_FOR_COMPATIBILITY`

## Ordered Targets

Future alignment targets must run strictly in ascending version order:

1. `20260728030000_workout_delivery_integration_v1.sql`
2. `20260730090000_student_identity_contract.sql`
3. `20260731190000_reconcile_security_policies_and_grants.sql`
4. `20260801143335_reconcile_alunos_required_fields.sql`
5. `20260801173000_revoke_aoe_idempotency_anon_execute.sql`
6. `20260801180000_harden_workout_templates_updated_at.sql`

The target matrix is recorded in `reports/supabase-production-sync/migration-history-alignment-repair-plan.csv`.

## CLI Review

Local non-mutating CLI checks were attempted:

- `npx.cmd supabase --version`
- `npx.cmd supabase migration repair --help`
- `npx.cmd supabase migration list --help`

Initial `npx.cmd` invocations did not return before timeout, but the CLI was then located in the existing local npm cache and validated without installing new tooling.

Validated CLI:

- source: local npm cache
- version: `2.111.0`
- repair syntax: `supabase migration repair [flags] <version...>`
- status values: `applied`, `reverted`
- connection flags: `--db-url`, `--linked`, `--local`, `--password`
- connection mode selected for future production review: `DB_URL_NO_LINK`
- link requirement: `NOT_IF_DB_URL`
- bootstrap behavior: `CLI_CREATES_REGISTRY_WHEN_ABSENT`

## Future Command

The future command must use the official Supabase CLI `migration repair` mechanism. The exact command shape is:

`supabase migration repair <version> --status applied --db-url <percent-encoded-db-url> --yes`

Every command remains:

`FUTURE_COMMAND_NOT_EXECUTED`

No manual SQL plan using `CREATE SCHEMA supabase_migrations`, `CREATE TABLE schema_migrations`, or direct `INSERT` into a registry is approved as the primary path.

## Bootstrap Lab

A local disposable PostgreSQL lab was created outside the repository using Docker and the project-approved Supabase Postgres image. Production credentials, production URI, persistent link, remote SQL, db push, and migration up were not used.

Lab result:

- database ready: `YES`
- registry schema before: `NO`
- registry table before: `NO`
- repair applied exit code: `0`
- registry schema after: `YES`
- registry table after: `YES`
- fictitious test version present: `YES`
- created objects: `supabase_migrations.schema_migrations`, `supabase_migrations.schema_migrations_pkey`
- columns: `version text not null`, `statements ARRAY nullable`, `name text nullable`
- public schema object count before: `0`
- public schema object count after: `0`
- public schema mutation: `NO`
- reverted supported: `YES`
- test version present after revert: `NO`
- lab container removed: `YES`

## Production Implications

The CLI can bootstrap an absent canonical migration registry through `migration repair --db-url` without a persistent project link. Future production execution still requires explicit human authorization and must run one version at a time with read-only postchecks after each version.

## Prechecks

Before any future repair authorization:

- working tree clean
- local migration count remains `7`
- hashes for the six candidates match this plan
- manual cutover remains `6/6` reconciled
- baseline remains excluded
- canonical registry state is rechecked read-only
- no new remote history entry appeared
- candidate count remains exactly `6`
- Supabase CLI version and `migration repair --help` are captured
- repair connection mode is `DB_URL_NO_LINK`
- registry bootstrap behavior is `CLI_CREATES_REGISTRY_WHEN_ABSENT`

If the canonical registry becomes present before repair, stop and compare entries before any mutation.

## Execution Model

If a future authorization is granted, execute one migration version at a time:

1. run the official repair command for exactly one version
2. verify exit code
3. query canonical history read-only
4. confirm exactly one expected version was added
5. continue only if the postcheck matches

Do not run all six blindly in a batch.

## Postchecks

After all future repairs:

- canonical registry is `PRESENT`
- history contains exactly the six repaired versions
- baseline remains absent unless separately authorized
- no extra unexpected version exists
- `PUBLIC_SCHEMA_MUTATION=NO`
- `APP_DATA_MUTATION=NO`
- `CUTOVER_OBJECT_MUTATION=NO`
- db push remains blocked pending a separate dry-run/review phase

## Recovery

Recovery must use the official Supabase CLI-supported mechanism when available. Direct manual deletion from history registry is not the primary recovery path and would require a separate explicit review.

## Stop Conditions

Stop immediately if:

- candidate hash changed
- working tree is dirty
- migration count changed
- remote registry appeared unexpectedly
- remote version is unexpected
- a candidate is no longer fully reconciled
- Supabase CLI changed or is unavailable
- repair syntax is incompatible
- repair requires an unreviewed operation
- baseline would be included
- schema or data mutation is detected

## Decision

`READY_FOR_MIGRATION_HISTORY_ALIGNMENT_AUTHORIZATION_REVIEW`

## Next Action

`USER_EXPLICIT_HISTORY_ALIGNMENT_AUTHORIZATION`

This does not authorize migration repair.
