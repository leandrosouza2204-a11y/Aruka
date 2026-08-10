# Group A Function Evidence Collection

Decision: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`.

Supabase change: `NO`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

Remote link state: `UNLINKED_FOR_SAFETY`.

Group A: `EVIDENCE_REQUIRED`.

Migration created: `NO`.

## Scope

Only `public.set_workout_templates_updated_at()` is in scope for Phase 3.3.

This round collects production evidence for the local utility trigger function before any possible hardening decision. It does not authorize SQL changes in production or a repository migration.

## Local Baseline

- Return: `trigger`
- Language: `plpgsql`
- Volatility: `VOLATILE`
- Security definer: `false`
- Search path: `public`
- Local grants: `postgres EXECUTE`, `service_role EXECUTE`
- Local trigger: `public.workout_templates.set_workout_templates_updated_at`, before update, for each row

The function body only sets `new.updated_at = now()` and returns `new`.

## Required Manual Evidence

Run `reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql` in the production project `aruka` SQL Editor and export each result grid to `reports/supabase-production-sync/remote-phase33-input/`.

Expected CSV names:

- `phase33-group-a-function-definition.csv`
- `phase33-group-a-trigger-dependencies.csv`
- `phase33-group-a-function-grants.csv`
- `phase33-group-a-dependency-metadata.csv`

Do not stage the exported CSV files. The directory is intentionally ignored.

## Next Step

Phase 3.4 can compare the exported production evidence with the local baseline and decide whether a narrow Group A hardening migration is safe.
