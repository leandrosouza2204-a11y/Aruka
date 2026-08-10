# Security Reconciliation Validation

Decision: `READY_WITH_LOCAL_STORAGE_LIMITATION`.

## Static Validation

`qa:supabase-security-reconciliation` validates that the migration contains only policy, grant, revoke, transaction and comment statements.

It blocks table creation, column changes, constraint changes, function replacement, data writes, financial mutations, permissive `true` policies, anon write grants, and public/anon execute grants.

## Local Runtime Validation

Executed:

- `npx.cmd supabase status`: local services reported stopped.
- `npx.cmd supabase start`: returned code 0 but still reported stopped auxiliary services.
- `npx.cmd supabase db reset`: PostgreSQL applied migrations and seed, then exited 1 because Storage was unhealthy before the CLI timeout.
- `npx.cmd supabase migration list --local`: passed with four local migrations.
- `npx.cmd supabase db diff --local --schema public`: passed with no schema changes found.
- `node scripts/validate-supabase-security-reconciliation-runtime.mjs`: passed.
- `npm.cmd run qa:supabase-schema-equivalence`: executed and returned expected global `BLOCKED_REMOTE_SCHEMA_DRIFT`.
- `npm.cmd run qa:student-identity-runtime`: passed.

Recovered:

- Storage health became `healthy` after the CLI timeout.
- DB health remained `healthy`; the DB did not crash.
- Root cause classification: Storage bootstrap healthcheck lag, not SQL migration failure.

## Remote Boundary

Remote projects remain unlinked for safety. No production action is authorized.
