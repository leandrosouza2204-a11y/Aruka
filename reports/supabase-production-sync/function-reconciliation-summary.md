# Phase 3 Function/RPC Reconciliation Audit

Decision: READY_FOR_PHASE3_FUNCTION_SCOPE_REVIEW

Migration decision: NO_NEW_MIGRATION

Remote safety: UNLINKED_FOR_SAFETY; no remote database command was executed.

## Findings

- Functions/RPCs reviewed: 14
- Included in new SQL migration: 0
- Deferred or blocked: 14

## Category Counts

- ADMIN: 5
- AOE: 1
- FINANCIAL: 4
- STUDENT_IDENTITY: 3
- UTILITY: 1

## Status Counts

- BODY_DIFFERENT: 6
- LOCAL_OVERLOAD_ONLY: 3
- REMOTE_OVERLOAD_ONLY: 5

## Decision Counts

- DEFER_TO_AOE_RECONCILIATION: 1
- DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT: 3
- MANUAL_PRODUCT_DECISION_REQUIRED: 5
- MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED: 5

## Conclusion

Phase 3 produced inventory, dependency and scope artifacts only. A new migration was intentionally not created because the function differences include remote overloads, body differences and feature-line contracts that are not safe to reconcile automatically.

## Phase 3.1 Manual Review

Decision: `READY_FOR_PHASE31_EVIDENCE_COLLECTION`.

Supabase change: `NO_NEW_MIGRATION`.

Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.

Migration candidates: set_workout_templates_updated_at, aoe_idempotency_get_or_create.

Confirmed security issue: `AOE_ANON_EXECUTE_EXCESS_CONFIRMED`.
