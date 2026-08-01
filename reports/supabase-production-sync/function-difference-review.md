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
