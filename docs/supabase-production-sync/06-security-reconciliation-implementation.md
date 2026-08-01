# Security Reconciliation Implementation

Decision: `READY_FOR_LOCAL_SECURITY_RECONCILIATION_IMPLEMENTATION`.

This phase implements only security policies and grants locally. It does not authorize production, remote SQL, migration repair, db push, db pull, or linking.

## Migration

`supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql`

## Included

- P0 policy role hardening from `public` to `authenticated`, using the canonical local policy definitions.
- `anon` table grant revokes for protected application tables.
- P0 function EXECUTE revokes from `public` and `anon` for confirmed workout delivery signatures.
- Minimal authenticated EXECUTE grants for those confirmed functions.

## Deferred

- Constraints and nullability.
- Function bodies and signatures.
- Workout delivery schema convergence.
- Student identity application sequencing.
- Platform-managed grants.
- Admin overload decisions that require manual security review.

## Baseline Source

`supabase/baseline-src/08-policies.sql` and `supabase/baseline-src/09-grants.sql` already express the desired final local contract for this phase. No baseline-src edit was required.

## Financial Guard

Financial tables are touched only by policy/grant statements. No financial data, defaults, columns, constraints, or functions are changed.
