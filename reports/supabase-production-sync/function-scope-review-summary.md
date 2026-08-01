# Phase 3.1 Function Scope Manual Review

Decision: `READY_FOR_PHASE31_EVIDENCE_COLLECTION`.

Supabase change: `NO_NEW_MIGRATION`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

Remote link state: `UNLINKED_FOR_SAFETY`.

## Outcome

- Reviewed rows: 15
- Migration candidates: 2
- Evidence gaps: 10

## Decisions

- DEPRECATE_REMOTE_OVERLOAD_LATER: 5
- EVIDENCE_REQUIRED: 4
- DEFER_TO_AOE_RECONCILIATION: 1
- DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT: 3
- SECURITY_HARDENING_REQUIRED: 1
- AOE_ANON_EXECUTE_EXCESS_CONFIRMED: 1

## Migration Candidate Groups

- GROUP_A_UTILITY_SECURITY_HARDENING: set_workout_templates_updated_at; risk=LOW; approval=Engineering/security approval
- GROUP_B_ADMIN_BODY_RECONCILIATION: none; risk=HIGH; approval=Admin/product/security approval
- GROUP_C_ADMIN_LEGACY_OVERLOADS: none; risk=MEDIUM; approval=Admin/product approval
- GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION: none; risk=P0/P1; approval=FINANCIAL_OWNER_REVIEW_COMPLETED
- GROUP_E_AOE_SECURITY: aoe_idempotency_get_or_create; risk=P0; approval=AOE/security approval

## Evidence Gap

Full remote function definitions are still required for admin/financial body diffs and legacy overload removal decisions. The generated SQL is SELECT-only and was not executed remotely.
