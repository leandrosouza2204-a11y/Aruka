# Future Migration Plan

Status: `DESIGN_ONLY_NO_EXECUTION_AUTHORIZATION`.

Strategy: `INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE`.

Production action: `RECONCILIATION_DESIGN_REQUIRED`.

## Phase 0: evidence_freeze

- Future action type: KEEP
- Approval required: Owner approval before drafting SQL.
- Rollback concept: Rollback requires verified production backup and no repository mutation.

## Phase 1: security_policies

- Future action type: MANUAL_DECISION
- Approval required: Security and product owner approval.
- Rollback concept: Rollback policy must restore the exact previous production policy definitions.

## Phase 2: function_and_table_grants

- Future action type: REVOKE_OR_GRANT_AFTER_APPROVAL
- Approval required: Security approval for anon/public/authenticated changes.
- Rollback concept: Rollback grant map must restore prior grantee/privilege pairs.

## Phase 3: constraints_and_nullability

- Future action type: ALTER_AFTER_CONTRACT_APPROVAL
- Approval required: Product and finance approval for contract columns.
- Rollback concept: Rollback requires reversible constraint plan and pre-change data snapshot.

## Phase 4: function_definitions

- Future action type: REPLACE_AFTER_APPROVAL
- Approval required: Engineering and security approval.
- Rollback concept: Rollback function definitions must be captured from production before replacement.
- Latest Phase 3.2 evidence review: `READY_FOR_PHASE32_SECURITY_MIGRATION`; only Group E AOE anon EXECUTE hardening moved to migration, body unchanged.
- Latest Phase 3.3 Group A review: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`; `public.set_workout_templates_updated_at()` needs production read-only evidence before a migration decision.
- Latest Phase 3.4 Group A review: `READY_FOR_PHASE34_GROUP_A_COMMIT`; migration `20260801180000_harden_workout_templates_updated_at.sql` only sets `search_path` and revokes excessive direct EXECUTE grants from `PUBLIC`, `anon` and `authenticated`.
- Post-Phase 3.4 global audit: `READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT`; local state is partially reconciled, remote state is not applied, history alignment is pending, and the next safe group is `SECURITY_HARDENING`.

## Phase 5: workout_delivery_contract

- Future action type: MERGE_AFTER_SCHEMA_CONVERGES
- Approval required: Product approval for delivery state changes.
- Rollback concept: Rollback restores previous delivery functions, policies and grants together.

## Phase 6: student_identity_contract

- Future action type: APPLY_AFTER_PREREQUISITES
- Approval required: Engineering approval after phases 1-5 pass.
- Rollback concept: Rollback disables student linkage surfaces before reverting database contract.

## Phase 7: post_reconciliation_validation

- Future action type: VALIDATE
- Approval required: Technical lead approval.
- Rollback concept: Rollback triggered if any validation fails after a controlled change window.

## Phase 8: migration_history_and_baseline

- Future action type: NEW_BASELINE_AFTER_CONVERGENCE
- Approval required: Technical lead and repository owner approval.
- Rollback concept: Rollback concept is to keep the previous repository baseline until convergence is proven.
