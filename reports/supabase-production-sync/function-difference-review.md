# Function Difference Review

- OVERLOAD_REMOTE_ONLY: 5
- BUSINESS_LOGIC_DIFFERENT: 6
- OVERLOAD_LOCAL_ONLY: 3

## Phase 3 Scope Decision

Decision: `READY_FOR_PHASE3_FUNCTION_SCOPE_REVIEW`.

Migration decision: `NO_NEW_MIGRATION`.

All 14 function/RPC differences remain deferred or require manual review. No body replacement, overload drop/create, grant change or remote SQL action was selected automatically.

- Manual product decisions: remote admin/financial overloads.
- Manual security/business logic review: admin/financial/utility body differences.
- Deferred: AOE and student identity function contracts.

## Phase 3.1 Assisted Manual Review

Decision: `READY_FOR_PHASE31_EVIDENCE_COLLECTION`.

- Legacy overloads: `DEPRECATE_REMOTE_OVERLOAD_LATER`.
- Admin/financial body diffs: `EVIDENCE_REQUIRED`.
- Utility body diff: `set_workout_templates_updated_at()` is `SECURITY_HARDENING_REQUIRED`.
- AOE anon grant: `AOE_ANON_EXECUTE_EXCESS_CONFIRMED`; AOE body remains deferred.
