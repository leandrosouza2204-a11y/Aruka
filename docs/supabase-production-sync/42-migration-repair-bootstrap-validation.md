# Migration Repair Bootstrap Validation

## Objective

Validate the Supabase CLI migration repair behavior in a local disposable PostgreSQL lab before any production history alignment authorization.

## Safety Scope

Production was not accessed. No Session Pooler URI, production password, db push, migration up, persistent link, remote SQL, CI/CD, commit, push, or PR was used.

## CLI

- Source: existing local npm cache
- Version: `2.111.0`
- Repair supported: `YES`
- Repair syntax: `supabase migration repair [flags] <version...>`
- Status values: `applied`, `reverted`
- `--db-url`: supported
- Linked project: not required when `--db-url` is used

## Lab Method

A local disposable PostgreSQL container was created with the approved Supabase Postgres image. The test used fictitious migration version `20990101010101` and a migration file inside the external lab directory only.

The lab began with:

- `supabase_migrations` schema: absent
- `supabase_migrations.schema_migrations`: absent
- public schema object count: `0`

## Applied Repair

The command shape validated in the lab was:

`supabase migration repair 20990101010101 --status applied --db-url <local-lab-db-url> --yes`

Result:

- exit code: `0`
- registry schema after: present
- registry table after: present
- test version present: `YES`

## Metadata Created

The CLI created:

- `supabase_migrations.schema_migrations`
- `supabase_migrations.schema_migrations_pkey`

Columns:

- `version text not null`
- `statements ARRAY nullable`
- `name text nullable`

## Metadata-Only Check

- public schema object count before: `0`
- public schema object count after: `0`
- public schema mutation: `NO`

## Reverted Repair

The CLI supports `--status reverted`.

Result:

- reverted exit code: `0`
- test version present after revert: `NO`

No manual `DELETE` was used.

## Cleanup

The lab container `aruka-migration-repair-bootstrap-lab` was removed.

`LAB_CONTAINER_REMOVED=YES`

## Production Implication

The future history alignment can use the official Supabase CLI with `--db-url`, without a persistent production link, if and only if the user explicitly authorizes the production history alignment phase.

This validation does not authorize production repair.
