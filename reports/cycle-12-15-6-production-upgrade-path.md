# Cycle 12.15.6 — production upgrade path

## Outcome

`CYCLE_12_15_6_DESIGN_COMPLETE_READY_FOR_HUMAN_REVIEW`

Recommended path: staged official Supabase CLI pushes, with no repair in the happy path:

```text
manifest A: remote 25 + P01–P12          → db push
manifest B: A + reconciliation           → db push
manifest C: all 40 physical migrations   → db push --include-all
```

This produced the required logical order and a normal 40-version final history. A normal physical push was explicitly rejected in rehearsal. Production execution remains unauthorized and `NO_GO`.

## Evidence summary

| Gate | Result |
| --- | --- |
| Baseline | exact expected commit, clean |
| Remote read-only revalidation | unchanged, 25 applied / 15 pending |
| Critical hashes | PASS |
| Remote-equivalent | PASS with documented overload-body gap |
| Happy path | PASS |
| F1/F3/F5/F7 atomicity | PASS |
| F2/F4/F6 pause/resume fingerprints | PASS |
| F8 divergence detection/recovery | PASS |
| Final history | 40/40, dry-run empty |
| 12.13 | direct auth 0, optimized 69 |
| 12.15.2 | OFF, emergency false, targets 0 |
| Physical local chain restored | PASS |

## Remote snapshot

`aruka` / `vrizeuhuhvtvbrmtvdik`, `us-east-2`, PostgreSQL 17.6, last migration `20260909110000`. Four legacy `alunos` policies, 17 relevant anonymous-executable definers, five legacy overloads, no `private` schema, no rollout objects. `REMOTE_DRIFT_CHANGED=NO`.

The connection default reported `transaction_read_only=off`; all four successful remote operations were nevertheless strictly read-only by query/tool selection. No remote mutation tool was called.

## Operational decision

- `PREFERRED`: staged CLI / `--include-all` final phase.
- `VIABLE_FALLBACK`: controlled SQL plus official history repair, only after a new exact rehearsal and DBA approval.
- `migration repair`: recovery-only for proven schema/history divergence.
- `REJECTED`: later forward bridge; its timestamp cannot solve ordering.

Maintenance, write freeze and deploy freeze are all required. PITR is `UNVERIFIED` and is a hard precondition for production authorization. RPO is not asserted until PITR is confirmed; Supabase documents a worst-case PITR RPO of two minutes. RTO must come from a restore drill.

## Findings

| ID | Severity | Status | Finding |
| --- | --- | --- | --- |
| C12.15.6-OPS-01 | HIGH | RESOLVED LOCALLY | deterministic out-of-order path proven with official CLI |
| C12.15.6-OPS-02 | HIGH | RESOLVED LOCALLY | recovery and atomicity proven at critical boundaries |
| C12.15.6-BKP-01 | HIGH | OPEN PRECONDITION | PITR/backup availability not verified |
| C12.15.6-REM-01 | MEDIUM | OPEN PRECONDITION | remote must be revalidated immediately before execution |
| C12.15.6-EQV-01 | LOW | DOCUMENTED | legacy overload bodies represented by safe local stubs |
| C12.15.6-LEG-01 | MEDIUM | DEFERRED | five overloads remain a human decision |

## Safety

```text
REMOTE_READS=4
REMOTE_WRITES=0
REMOTE_MIGRATIONS_APPLIED=0
REMOTE_MIGRATION_REPAIR=0
REMOTE_HISTORY_MUTATIONS=0
REMOTE_AUTH_CHANGES=0
REMOTE_RLS_CHANGES=0
REMOTE_GRANT_CHANGES=0
REMOTE_FUNCTION_CHANGES=0
DEPLOYMENTS=0
REAL_COHORT_CHANGES=0
ROLLOUT_ACTIVATION=0
REAL_USER_DATA_MUTATIONS=0
DESTRUCTIVE_REMOTE_ACTIONS=0
GIT_PUBLISHING=0
ROLLOUT=OFF
REAL_TARGETS=0
```

## QA

| Check | Result |
| --- | --- |
| Cycle 12.15.6 rehearsal | PASS |
| Migration inventory / Supabase CI static | PASS — 460 Node, 8 PowerShell, 31 JSON |
| Cycle 12.15.5 static/runtime/logical-order | PASS |
| Cycle 12.13 schema/RLS, authorization, admin | PASS |
| Cycle 12.15.2 unit | 24/24 PASS |
| Cycle 12.15.2 runtime/race | PASS |
| ESLint | PASS |
| Vite build | PASS |
| JSON parse | PASS |
| Secret scan / `git diff --check` | PASS |

The detailed runbook, stop conditions, hashes and recovery matrix are in `docs/product-roadmap-v4-cycle-12-student-experience-v2/27-production-upgrade-path-and-recovery-rehearsal.md`.
