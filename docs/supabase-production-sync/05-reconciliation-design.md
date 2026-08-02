# Reconciliation Design Summary

Decision: `READY_FOR_RECONCILIATION_DESIGN`.

Global decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Production action: `RECONCILIATION_DESIGN_REQUIRED`.

Ready to apply: `false`.

- Phases: 9
- Nullability expected columns: 10
- Nullability missing columns: 0
- Approval required: true
- Rollback required: true

## Nullability Decision

The production profile for public.alunos contains all 10 expected columns, total_rows=26 and null_rows=0 for every exported column. This closes the nullability evidence limitation for design, but it does not authorize immediate NOT NULL changes.

## Execution Boundary

This document is design-only. It contains no executable write SQL and does not authorize direct application.

## Phase 3.2 Function Evidence Review

Decision: `READY_FOR_PHASE32_SECURITY_MIGRATION`.

The production CSV closed the AOE anon EXECUTE evidence gap and supports one isolated Group E migration. It does not authorize AOE body replacement, admin body replacement, financial changes, overload removal, student identity changes, or Group A utility hardening.

## Phase 3.3 Group A Evidence Collection

Decision: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`.

Supabase change: `NO`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

The local analysis for `public.set_workout_templates_updated_at()` is complete, but Group A remains evidence-required because production definition, exact grants and trigger dependencies must be exported with `reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql` before any hardening migration is designed.

## Phase 3.4 Group A Security Migration

Decision: `READY_FOR_PHASE34_GROUP_A_COMMIT`.

Supabase change: `YES`.

Production action required: `PENDING_RECONCILIATION_COMPLETION`.

The Phase 3.3 production evidence confirms an equivalent trigger body and trigger dependency, an absent remote `search_path`, and excessive direct EXECUTE grants for `PUBLIC`, `anon` and `authenticated`. The migration only hardens `public.set_workout_templates_updated_at()` metadata and grants; it does not replace the body or alter the trigger.

## Post-Phase 3.4 Global State

Decision: `READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT`.

Production action required: `NO`.

Migration repair allowed: `NO`.

The global audit separates schema state, remote application state and migration history. Phase 1, Phase 2, Group E and Group A are locally implemented and validated, but the production evidence still represents remote state before those reconciliations are applied. History alignment remains pending and no migration repair is allowed.

Next safe group: `SECURITY_HARDENING`.

## Final Active Security Drift State

Decision: `READY_FOR_FINAL_SECURITY_RECLASSIFICATION_COMMIT`.

Production action required: `NO`.

Migration repair allowed: `NO`.

The only active security item was reclassified as `LOCAL_SECURITY_RECONCILIATION_ALREADY_IMPLEMENTED` plus `REMOTE_APPLICATION_PENDING`. No new SQL is needed. Active local security drift is now `0`; remote pending security count is `1`.

Next safe group: `WORKOUT_DELIVERY_RECONCILIATION`.

## Workout Delivery Final State

Decision: `READY_FOR_WORKOUT_DELIVERY_RECLASSIFICATION_COMMIT`.

Workout Delivery has no active local drift after object-level review of `20260728030000_workout_delivery_integration_v1.sql`. Lifecycle, `treino_eventos`, template origin, idempotency, RPCs, grants, policies and indexes are covered by existing local migrations. Production remains `REMOTE_WORKOUT_DELIVERY_PENDING`; no duplicate migration was created.

Next safe group: `STUDENT_IDENTITY_DEPLOYMENT_DESIGN`.

## Design Matrix

- Phase 0 evidence_freeze: KEEP; risk=NONE; financial=NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED; approval=Owner approval before drafting SQL.; rollback=Rollback requires verified production backup and no repository mutation.
- Phase 1 security_policies: MANUAL_DECISION; risk=SECURITY_DRIFT; financial=FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL; approval=Security and product owner approval.; rollback=Rollback policy must restore the exact previous production policy definitions.
- Phase 2 function_and_table_grants: REVOKE_OR_GRANT_AFTER_APPROVAL; risk=ACCESS_DRIFT; financial=FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL; approval=Security approval for anon/public/authenticated changes.; rollback=Rollback grant map must restore prior grantee/privilege pairs.
- Phase 3 constraints_and_nullability: ALTER_AFTER_CONTRACT_APPROVAL; risk=DATA_CONTRACT_DRIFT; financial=FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL; approval=Product and finance approval for contract columns.; rollback=Rollback requires reversible constraint plan and pre-change data snapshot.
- Phase 4 function_definitions: REPLACE_AFTER_APPROVAL; risk=BUSINESS_LOGIC_DRIFT; financial=FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL; approval=Engineering and security approval.; rollback=Rollback function definitions must be captured from production before replacement.
- Phase 5 workout_delivery_contract: MERGE_AFTER_SCHEMA_CONVERGES; risk=FEATURE_CONTRACT_DRIFT; financial=FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL; approval=Product approval for delivery state changes.; rollback=Rollback restores previous delivery functions, policies and grants together.
- Phase 6 student_identity_contract: APPLY_AFTER_PREREQUISITES; risk=LOCAL_ONLY_EXPECTED; financial=NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED; approval=Engineering approval after phases 1-5 pass.; rollback=Rollback disables student linkage surfaces before reverting database contract.
- Phase 7 post_reconciliation_validation: VALIDATE; risk=QUALITY_GATE; financial=NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED; approval=Technical lead approval.; rollback=Rollback triggered if any validation fails after a controlled change window.
- Phase 8 migration_history_and_baseline: NEW_BASELINE_AFTER_CONVERGENCE; risk=HISTORY_ALIGNMENT; financial=NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED; approval=Technical lead and repository owner approval.; rollback=Rollback concept is to keep the previous repository baseline until convergence is proven.

## Future Migration Plan

- Phase 0 evidence_freeze: KEEP
- Phase 1 security_policies: MANUAL_DECISION
- Phase 2 function_and_table_grants: REVOKE_OR_GRANT_AFTER_APPROVAL
- Phase 3 constraints_and_nullability: ALTER_AFTER_CONTRACT_APPROVAL
- Phase 4 function_definitions: REPLACE_AFTER_APPROVAL
- Phase 5 workout_delivery_contract: MERGE_AFTER_SCHEMA_CONVERGES
- Phase 6 student_identity_contract: APPLY_AFTER_PREREQUISITES
- Phase 7 post_reconciliation_validation: VALIDATE
- Phase 8 migration_history_and_baseline: NEW_BASELINE_AFTER_CONVERGENCE
