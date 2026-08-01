# Supabase Production Sync Audit

Decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Additional blockers: `BLOCKED_LOCAL_STORAGE_BOOTSTRAP`, `REMOTE_DIFF_SECRET_FORMAT_ERROR`, `HML_LINK_NOT_RESTORED`.

Schema equivalence audit from the manual read-only CSV evidence is complete. The result is not equivalent: the local schema reconstructed from migrations diverges from the production `aruka` catalog evidence.

Auditor hardening decision: `AUDITOR_FALSE_POSITIVES_CORRECTED`.

Equivalence summary after hardening:

- Tables: 20 equivalent, no local-only or remote-only tables.
- Columns: 255 equivalent, 1 local-only, 70 different, 60 informational column-order differences.
- Constraints: 65 equivalent, 1 local-only, 5 material differences.
- Indexes: 85 equivalent, 2 local-only, 0 material differences.
- RLS enablement: 20 equivalent.
- Policies: 3 equivalent, 4 local-only, 4 remote-only, 48 remote-more-permissive/material differences.
- Functions: 11 equivalent, 3 local-only overloads, 5 remote-only overloads, 6 body differences.
- Table grants: 467 equivalent, 80 remote-only grants.
- Function grants: 43 partially verified by routine_name only, 9 local-only grants, 11 remote-only grants.

Auditor normalization impact:

- Critical differences: 480 -> 242.
- Defaults different: 169 -> 0.
- Constraints different: 70 -> 5.
- Policies different: 51 -> 48.
- Functions different: 17 -> 6.
- Equivalent objects: 737 -> 926.

Production action required: `RECONCILIATION_REQUIRED`.

Migration repair assessment: `REPAIR_NOT_SAFE`.

Evidence artifacts:

- `reports/supabase-production-sync/schema-equivalence-result.json`
- `reports/supabase-production-sync/schema-equivalence-matrix.csv`
- `reports/supabase-production-sync/schema-equivalence-summary.md`
- `docs/supabase-production-sync/02-schema-equivalence-audit.md`
- `reports/supabase-production-sync/local-schema-catalog/*.json`

Production project confirmed by user: `aruka` (`vriz...vdik`), Dashboard status Healthy, CLI status `ACTIVE_HEALTHY`.

Original linked project: `Aruka_HML` (`xrmq...adnf`), latest observed CLI status `ACTIVE_HEALTHY`, but the repository remains unlinked for safety.

The CLI was temporarily linked to `aruka`. Remote `migration list` and `db push --dry-run` both reported the three local SQL migrations as absent remotely. However, `db diff --linked --schema public` failed inside pg-delta with `unsupported or invalid secret format`, so baseline/schema conflict could not be ruled out.

Local replay applied all three SQL migrations and seed, but `supabase db reset` exited non-zero because Storage did not become ready before the CLI timeout. Storage later reported healthy; this is classified as Storage bootstrap timing, not SQL migration failure.

Local migration list: `20260716090000`, `20260728030000`, `20260730090000`.

Local public schema diff: no schema changes found.

Runtime student identity QA passed, including multiuser isolation, minimized student payload, blocked writes, duplicate link protection, and auth deletion `ON DELETE SET NULL`.

This audit round kept the immediate production-link risk neutralized with the official `supabase unlink` state. The latest `projects list` check reports no project linked.

No remote schema change was executed. No `db push`, `db pull`, `db dump`, `migration repair`, SQL Editor action, commit, push, or PR was executed.

Because the previous `db diff --linked --schema public` failed with `unsupported or invalid secret format`, the audit provided `reports/supabase-production-sync/remote-schema-readonly-inspection.sql`, a SELECT-only catalog inspection script. The returned CSV exports were audited locally without linking or mutating production.

Important final state: production link risk is neutralized. The repository/CLI is safely unlinked, not linked to `aruka` and not linked to `Aruka_HML`.

## Manual Review Round

Specific decision: `BLOCKED_SECURITY_POLICY_DRIFT`.

Recommended strategy: `STRATEGY_MORE_EVIDENCE_REQUIRED`.

- P0 rows: 146
- P1 rows: 23
- Policies reviewed: 56
- REMOTE_MORE_PERMISSIVE confirmed: 48
- Remote-only table grants: 80
- Function differences/overloads reviewed: 14
- Nullability rows requiring profile: 10

Read-only evidence package created; no remote SQL was executed.

## Reconciliation Evidence Review

# Reconciliation Evidence Summary

Decision: `READY_FOR_RECONCILIATION_DESIGN`.

Global decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Recommended strategy: `INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE`.

## Evidence Completeness

- Overall: RECONCILIATION_EVIDENCE_COMPLETE
- Function grants: COMPLETE_BY_SIGNATURE_FOR_RECEIVED_GRID
- Function configuration: RECONCILIATION_INSPECTION_PARTIAL
- Reconciliation CSV: RECONCILIATION_INSPECTION_PARTIAL
- Nullability: REMOTE_NULLABILITY_PROFILE_COMPLETE

## Function Grants

- Received rows: 89
- Unique canonical grants: 69
- PUBLIC grants: 1
- anon grants: 6
- authenticated grants: 18
- service_role grants: 22
- SECURITY DEFINER grants: 64

## Nullability

- Expected columns: 10
- Received rows: 10
- Missing columns: 0

## Policies

- REMOTE_MORE_PERMISSIVE confirmed: 48

## Student Identity

- STUDENT_IDENTITY_ABSENT_REMOTE_CONFIRMED

## Constraint and Nullability Phase 2

Decision: `READY_FOR_PHASE2_COMMIT`.

Supabase change: `YES`.

Manual product decision: `APPROVED`.

The ten `public.alunos` nullability differences were reviewed with complete remote nullability evidence: 26 rows, 0 nulls in every profiled column. `created_at`, `user_id` and `whatsapp` are included in `supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql`. `acompanhamento_motivo`, `observacoes`, `inicio`, `pagamento_recebido`, `plano`, `status` and `valor` are preserved in this phase.

The five remaining constraints were not included. `perfis_role_check` belongs to student identity, `treinos_lifecycle_dates_check` belongs to workout delivery, and the three object/type CHECK differences are semantic representation false positives.

## Function/RPC Phase 3

Decision: `READY_FOR_PHASE3_FUNCTION_SCOPE_REVIEW`.

Migration decision: `NO_NEW_MIGRATION`.

The function/RPC reconciliation audit reviewed 14 divergent function entries: 5 `REMOTE_OVERLOAD_ONLY`, 6 `BODY_DIFFERENT` and 3 `LOCAL_OVERLOAD_ONLY`. No function was selected for automatic SQL generation because the remaining differences are business-logic, grant, overload or feature-line sensitive.

- Admin/manual product decisions: 5.
- Admin/financial/utility body reviews: 5.
- AOE deferred: 1.
- Student identity deferred: 3.

Artifacts:

- `reports/supabase-production-sync/phase3-function-inventory.json`
- `reports/supabase-production-sync/phase3-function-inventory.csv`
- `reports/supabase-production-sync/phase3-function-dependency-graph.json`
- `reports/supabase-production-sync/function-reconciliation-scope.json`
- `reports/supabase-production-sync/function-reconciliation-scope.md`
- `reports/supabase-production-sync/function-phase3-scope.csv`
- `reports/supabase-production-sync/function-reconciliation-result.json`
- `reports/supabase-production-sync/function-reconciliation-summary.md`
- `docs/supabase-production-sync/11-function-reconciliation-audit.md`

No remote DB command, `supabase link`, migration repair, SQL Editor action, commit, push or PR was executed.

## Function/RPC Phase 3.1

Decision: `READY_FOR_PHASE31_EVIDENCE_COLLECTION`.

Supabase change: `NO_NEW_MIGRATION`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

The assisted manual review produced explicit decisions for 15 rows: 5 legacy overloads are `DEPRECATE_REMOTE_OVERLOAD_LATER`, 4 admin/financial body diffs remain `EVIDENCE_REQUIRED`, 1 utility function is `SECURITY_HARDENING_REQUIRED`, 1 AOE grant issue is `AOE_ANON_EXECUTE_EXCESS_CONFIRMED`, 1 AOE body diff remains deferred, and 3 student identity functions remain deferred.

Only `set_workout_templates_updated_at()` is a current future migration candidate, in `GROUP_A_UTILITY_SECURITY_HARDENING`. A SELECT-only SQL file was generated for missing remote function definitions; it was not executed remotely.
