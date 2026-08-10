# Security Reconciliation Scope

Decision: `READY_FOR_LOCAL_SECURITY_RECONCILIATION_IMPLEMENTATION`.

Production action required: `NO_REMOTE_ACTION_ALLOWED`.

Migration repair allowed: `NO`.

Migration: `supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql`.

## Included

- 48 P0 policies where remote evidence showed a broader `public` role and the local contract requires `authenticated`.
- 19 table grant revoke targets for `anon`.
- 3 P0 function grant targets with confirmed signatures: `salvar_treino_composto(jsonb)`, `entregar_treino(uuid)`, `alterar_estado_treino(uuid, text)`.

## Deferred

- Constraints, nullability, defaults, indexes and table structure.
- Function bodies and function signatures.
- Workout delivery schema changes.
- Student identity migration execution sequencing.
- Legacy `alunos` policy expression/name drift.
- Platform-managed `service_role`, `postgres`, `supabase_admin` grants.
- P1 admin overload grants that still require final overload decision.

## Financial Guard

Financial tables `planos`, `assinaturas` and `pagamentos` are included only for role scope and grant hardening. No financial structure, defaults, values, data, or functions are changed.
