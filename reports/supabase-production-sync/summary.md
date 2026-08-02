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

## Function/RPC Phase 3.2

Decision: `READY_FOR_PHASE32_SECURITY_MIGRATION`.

Supabase change: `YES`.

Production action required: `PENDING_RECONCILIATION_COMPLETION`.

The production CSV in `remote-phase31-input` was parsed locally and kept ignored from Git. It confirms an excessive `anon.execute` grant on `public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)`. A single isolated migration was created to revoke that grant without changing the function body.

Migration: `supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql`.

Admin overload cleanup, admin body reconciliation, financial function changes, AOE body reconciliation, Group A utility hardening and student identity remain outside this migration.

## Function/RPC Phase 3.3

Decision: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`.

Supabase change: `NO`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

Target: `public.set_workout_templates_updated_at()`.

The local baseline shows a `plpgsql` trigger function, invoker security, `VOLATILE`, `search_path = public`, grants to `postgres` and `service_role`, and one trigger on `public.workout_templates`.

Read-only evidence package:

- `reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql`
- `reports/supabase-production-sync/phase33-group-a-evidence-request.json`
- `reports/supabase-production-sync/phase33-group-a-evidence-request.md`
- `reports/supabase-production-sync/phase33-group-a-local-analysis.json`
- `reports/supabase-production-sync/phase33-group-a-local-analysis.md`
- `reports/supabase-production-sync/phase33-group-a-local-trigger-map.json`
- `reports/supabase-production-sync/phase33-group-a-local-trigger-map.md`
- `docs/supabase-production-sync/15-group-a-function-evidence-collection.md`

Expected CSV exports are ignored under `reports/supabase-production-sync/remote-phase33-input/`. No migration or remote schema change is authorized by this phase.

## Function/RPC Phase 3.4

Decision: `READY_FOR_PHASE34_GROUP_A_COMMIT`.

Supabase change: `YES`.

Production action required: `PENDING_RECONCILIATION_COMPLETION`.

Target: `public.set_workout_templates_updated_at()`.

The Phase 3.3 CSVs confirm remote body equivalence, trigger equivalence, no explicit remote `search_path`, and excessive direct EXECUTE grants for `PUBLIC`, `anon` and `authenticated`. Migration `supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql` sets `search_path = public` and revokes only those excessive grants. No function body replacement or trigger change is included.

## Post-Phase 3.4 Global Audit

Decision: `READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT`.

Production action required: `NO`.

Migration repair allowed: `NO`.

Local reconciliation state: `PARTIALLY_RECONCILED`.

Remote reconciliation state: `NOT_APPLIED`.

History alignment state: `PENDING`.

Resolved locally: Phase 1 security policies/grants, Phase 2 required `alunos` nullability, Phase 3.2 Group E AOE anon EXECUTE, and Phase 3.4 Group A utility hardening.

Deferred or manual: AOE body, admin body decisions, financial behavior decisions, student identity deployment, workout delivery reconciliation, and migration history alignment.

Next safe group: `SECURITY_HARDENING`.

## Final Active Security Drift Reconciliation

Decision: `READY_FOR_FINAL_SECURITY_RECLASSIFICATION_COMMIT`.

Production action required: `NO`.

Migration repair allowed: `NO`.

The only item previously counted as active security drift is already implemented locally by `supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql`. It remains a remote pending application item, not a local drift item.

Final local security drift count: `0`.

Remote pending security count: `1`.

Migration created: `NO`.

Next safe group: `WORKOUT_DELIVERY_RECONCILIATION`.

## Workout Delivery Final Reconciliation

Decision: `READY_FOR_WORKOUT_DELIVERY_RECLASSIFICATION_COMMIT`.

WORKOUT_DELIVERY_LOCAL_STATE: `LOCAL_COMPLETE_BY_EXISTING_MIGRATION`.

ACTIVE_LOCAL_WORKOUT_DELIVERY_DRIFT: `0`.

REMOTE_WORKOUT_DELIVERY_PENDING: `50`.

NEW_MIGRATION_REQUIRED: `NO`.

Next safe group: `STUDENT_IDENTITY_DEPLOYMENT_DESIGN`.

## Student Identity Deployment Design

Decision: `READY_FOR_STUDENT_IDENTITY_DEPLOYMENT_DESIGN_COMMIT`.

STUDENT_IDENTITY_LOCAL_STATE: `LOCAL_COMPLETE_BY_EXISTING_MIGRATION`.

ACTIVE_LOCAL_STUDENT_IDENTITY_DRIFT: `0`.

REMOTE_STUDENT_IDENTITY_PENDING: `13`.

NEW_MIGRATION_REQUIRED: `NO`.

MIGRATION_ORDER_VALID: `YES`.

Next safe group: `PRODUCTION_RECONCILIATION_PACKAGE_DESIGN`.

## Production Reconciliation Package Design

Decision: `READY_FOR_PRODUCTION_RECONCILIATION_PACKAGE_REVIEW`.

PRODUCTION_RECONCILIATION_PACKAGE_STATE: `CUTOVER_PACKAGE_READY_FOR_MANUAL_REVIEW`.

LOCAL_SCHEMA_READY: `YES`.

CUTOVER_SEQUENCE_READY: `YES`.

PRECHECKS_READY: `YES`.

POSTCHECKS_READY: `YES`.

RECOVERY_PLAN_READY: `YES`.

PRODUCTION_EXECUTION_AUTHORIZED: `NO`.

DB_PUSH_ALLOWED_NOW: `NO`.

HISTORY_ALIGNMENT_REQUIRED: `YES`.

HISTORY_ALIGNMENT_ALLOWED_NOW: `NO`.

Next safe group: `PRODUCTION_RECONCILIATION_CUTOVER_REVIEW`.
