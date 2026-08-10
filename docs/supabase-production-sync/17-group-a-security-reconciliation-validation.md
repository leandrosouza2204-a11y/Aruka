# Group A Security Reconciliation Validation

Decision target: `READY_FOR_PHASE34_GROUP_A_COMMIT`.

## Static Validation

Static QA validates that the migration is allowlisted to:

- `ALTER FUNCTION public.set_workout_templates_updated_at() SET search_path = public`
- `REVOKE EXECUTE` from `PUBLIC`
- `REVOKE EXECUTE` from `anon`
- `REVOKE EXECUTE` from `authenticated`

It rejects body replacement, grants, platform-role revokes, trigger changes, table changes, data writes, AOE changes and student identity changes.

## Runtime Validation

Runtime QA checks the local PostgreSQL catalog after `supabase db reset`:

- Function exists.
- `security_definer=false`.
- `search_path=public`.
- Body remains equivalent.
- Trigger exists, is enabled, before update and row-level.
- `PUBLIC`, `anon` and `authenticated` do not have direct EXECUTE.
- `postgres` and `service_role` keep EXECUTE.
- Updating a local `workout_templates` fixture advances `updated_at`.

## Regression Validation

Required regression commands:

- `npm.cmd run qa:supabase-phase32-security-runtime`
- `npm.cmd run qa:supabase-security-reconciliation`
- `npm.cmd run qa:supabase-security-reconciliation-runtime`
- `npm.cmd run qa:supabase-constraint-nullability-reconciliation`
- `npm.cmd run qa:supabase-constraint-nullability-runtime`
- `npm.cmd run qa:supabase-function-scope-review`
- `npm.cmd run qa:supabase-phase32-function-evidence`
- `npm.cmd run qa:student-identity-runtime`
- `node --test src\features\treinos\utils\*.test.js`
- `npm.cmd run lint`
- `npm.cmd run build`

No production action is authorized by this validation document.
