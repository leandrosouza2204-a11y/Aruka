# Phase 3.3 Group A Evidence Request

Decision: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`.

Supabase change: `NO`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

Remote link state: `UNLINKED_FOR_SAFETY`.

Migration created: `NO`.

## Target

- Function: `public.set_workout_templates_updated_at()`
- Identity arguments: empty
- Scope: Group A utility security hardening evidence only

## Manual Production Collection

Run `reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql` manually in the SQL Editor for production project `aruka`.

Export the result grids as CSV files under `reports/supabase-production-sync/remote-phase33-input/`:

- `phase33-group-a-function-definition.csv`
- `phase33-group-a-trigger-dependencies.csv`
- `phase33-group-a-function-grants.csv`
- `phase33-group-a-dependency-metadata.csv`

The CSV directory is ignored by git. Do not stage or commit the exported CSV files.

No migration, `db push`, `db pull`, link, unlink, repair, grant, revoke, alter, create or drop action is authorized by this request.
