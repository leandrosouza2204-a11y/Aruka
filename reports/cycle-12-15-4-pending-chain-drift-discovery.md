# Cycle 12.15.4 — Pending chain and drift discovery evidence

## Result

- Decision: `DISCOVERY_COMPLETE_WITH_FINDINGS`
- Remote snapshot: `2026-10-04T11:11:32.120401Z`
- Advisor snapshot: `2026-10-04T11:18:50.262Z`
- Remote access: `VERIFIED_READ_ONLY`
- Chain understanding: `PASS`
- Policy reconciliation: `MIXED`
- Security definer review: `PASS_WITH_FINDINGS`
- Chain static readiness: `NO_GO` for the full chain
- Remote migration readiness: `NO_GO`
- Production GO: `NO_GO`

## Baseline and remote facts

| Item | Value |
| --- | --- |
| Branch / HEAD / origin | `main` / `3c51a0a16d08ffc3231f146c5e39892a623ca4c6` / same |
| Initial worktree | clean |
| Project | `aruka / vrizeuhuhvtvbrmtvdik`, production, `ACTIVE_HEALTHY` |
| PostgreSQL | 17.6; explicit transaction read-only |
| Migrations | 25 remote / 39 local / 14 pending; exact prefix |
| Catalog | 30 tables, 30 RLS, 49 functions, 75 policies |
| Policy state | 70 direct-Auth; 58/62 canonical allowlist matches |
| Security state | 17 anon-executable definers |
| Workout aggregate | 3 sessions: 2 abandoned, 1 in progress |

No PII, session identifier, secret or business payload is stored here.

## Exact reconciliation findings

1. Eight direct-Auth workout policies are expected pending state. P03 drops all eight and creates three wrapped read policies, yielding 62 direct-Auth policies.
2. Four legacy `alunos` policies are real drift. Their ownership predicates are equivalent, but names and role `public` differ from the canonical `authenticated` contract; UPDATE relies on implicit reuse of `USING` as `WITH CHECK`.
3. The hosted default ACL explicitly grants EXECUTE to `anon`, `authenticated` and `service_role` on new `postgres` functions in `public`. Historical `REVOKE ... FROM PUBLIC` statements did not remove explicit anon grants.
4. Of 17 current anon definer grants, P03 fixes `workout_execution_session_payload(uuid)` and Cycle 12.15.2 fixes `save_workout_execution(uuid,jsonb)`. Fifteen remain.
5. The payload helper has no caller Auth/ownership predicate and returns a full session by UUID; it is HIGH risk but was not invoked or exploit-tested.
6. Five shorter admin overloads are remote-only, service-role-only drift. They survive the pending chain and explain why applying the chain without reconciliation would produce 72 public functions instead of the clean-bootstrap 67.

## Decision

```text
CHAIN_CAN_APPLY_AS_AUTHORED=NO
RECONCILIATION_MIGRATION_REQUIRED_BEFORE_CHAIN=NO
RECONCILIATION_REQUIRED_BEFORE_12_13=YES
POLICY_RECONCILIATION=MIXED
SECURITY_DEFINER_PENDING_CHAIN_EFFECT=PARTIALLY_RESOLVED_BY_PENDING_CHAIN
```

The 12 predecessors are statically `READY_WITH_PRECONDITIONS` in order, but are not authorized. P01–P03 must be one operational unit so newly created definers are not left with temporary anon execute.

## Proposed future windows

| Window | Scope | Risk |
| --- | --- | --- |
| A | P01–P03 execution foundation/security closure | HIGH |
| B | P04–P06 canonical/Home/Library reads | MEDIUM |
| C | P07–P10 Player/sets/timer/feedback | MEDIUM |
| D | P11–P12 Evolution/profile/contact | MEDIUM |
| E | future policy/ACL reconciliation | MEDIUM |
| F | Cycle 12.13 | HIGH |
| G | Cycle 12.15.2, OFF | HIGH |

Every window has `DURATION_ESTIMATE=UNAVAILABLE` and requires separate human approval, backup/PITR, timeout budgets, validation and stop authority.

## Safety

```text
REMOTE_WRITES=0
MIGRATIONS_APPLIED=0
MIGRATION_REPAIR=0
AUTH_CHANGES=0
RLS_CHANGES=0
GRANT_CHANGES=0
FUNCTION_CHANGES=0
DEPLOYMENTS=0
REAL_COHORT_CHANGES=0
ROLLOUT_ACTIVATION=0
GIT_PUBLISHING=0
DESTRUCTIVE_CLEANUP=0
ROLLOUT=OFF
```

Primary dossier: `docs/product-roadmap-v4-cycle-12-student-experience-v2/25-pending-chain-drift-reconciliation-discovery.md`.
