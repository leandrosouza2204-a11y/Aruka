# Cycle 12.15.3 — Remote preflight & migration readiness

## 1. Executive summary

**Decision:** `DISCOVERY_COMPLETE_READY_FOR_HUMAN_REVIEW`.

**Operational conclusion:** `NO_GO` for applying migrations now.

The production Supabase project was identified and audited through read-only catalog queries. The remote migration history is an exact prefix of the local executable chain, but it stops at `20260909110000_smart_management_services_pricing_v1`: 25 remote migrations versus 39 local migrations. Therefore 14 migrations are pending, not only Cycles 12.13 and 12.15.2.

Two blocking facts were verified:

1. Cycle 12.13 cannot run against the current remote catalog. Its precondition requires exactly 62 direct-`auth.uid()` policies and 62 exact allowlist entries. The remote has 70 direct-Auth policies and only 58/62 compatible allowlist entries. The four expected `alunos` policies are absent and are replaced by legacy policies with different names and role `public`.
2. Cycle 12.15.2 cannot run after Cycle 12.13 alone. The remote lacks the 12 intervening Cycle 12 migrations, including required workout columns, constraints, feedback table, V2 command RPCs and canonical reads. The `private` schema, `experience_origin`, the five-argument start RPC and all rollout functions are absent, as expected for a pending foundation.

The current production catalog also exposes 17 `SECURITY DEFINER` functions to `anon`, including workout payload/mutation helpers and one lifecycle administrative function. This is a real security drift from the canonical local contract and must be reconciled before pilot approval. No cross-user data was queried and no remote write occurred.

`MIGRATION_READINESS` is not `AUTHORIZATION_TO_DEPLOY`. Even after the blockers are resolved, migration, deploy and rollout require separate human approvals.

## 2. Decision

| Decision | Result | Basis |
| --- | --- | --- |
| `LOCAL_ANALYSIS` | `PASS_WITH_LIMITATIONS` | Static inventory, preserved clean-bootstrap evidence, 24/24 unit tests and Supabase CI static checks passed; local database runtime unavailable during this audit. |
| `REMOTE_PREFLIGHT` | `NO_GO` | Read-only audit completed and found blocking history, policy and function/grant drift. |
| `MIGRATION_READINESS` | `NO_GO` | Neither target migration is safe to schedule against the current remote state. |
| `PRODUCTION_GO` | `NO_GO` | Explicitly unauthorized; prerequisites and security reconciliation are incomplete. |

## 3. Baseline

| Item | Verified result | Evidence class |
| --- | --- | --- |
| Branch | `main` | `VERIFIED_LOCAL` |
| HEAD | `91d0de27a9b80442eba1b1eb5069e415e89004e1` | `VERIFIED_LOCAL` |
| `origin/main` | `91d0de27a9b80442eba1b1eb5069e415e89004e1` | `VERIFIED_LOCAL` |
| Initial working tree | clean | `VERIFIED_LOCAL` |
| PR #144 | merge commit is current HEAD | `VERIFIED_LOCAL` |
| Cycle 12.15.2 | complete locally with known limitations | `VERIFIED_LOCAL` |
| Rollout V2 | server-side foundation absent remotely; no real cohort exists; repository baseline remains OFF | `VERIFIED_REMOTE` + `VERIFIED_LOCAL` |

Migration hashes:

- `20260926174027_cycle12_schema_rls_hardening.sql`: `C4E01665FF8E55D0CDF5BD4A7B0692301E9E224E3EFFDBD9E6748AD2625DE770`
- `20261003163830_cycle12_controlled_rollout_foundation.sql`: `9D236465C9A7DBA35E2845CA965DD1E1806A73A1DB0D712D04CBBB068E4E6FDB`

## 4. Execution state

| Gate | Status | Evidence |
| --- | --- | --- |
| Gate 1 — Baseline & local inventory | `COMPLETE` | Exact Git baseline; 39 executable migrations; both target files reviewed. |
| Gate 2 — Safe remote connectivity | `COMPLETE` | Production identity resolved; catalog transaction reported `transaction_read_only=on`. |
| Gate 3 — Remote migration history | `COMPLETE` | 25 remote versions; exact local prefix; 14 pending; no duplicates or unknown remote versions. |
| Gate 4 — Remote schema/security inventory | `COMPLETE` | Target schemas, relations, columns, functions, policies, grants, indexes, constraints and advisors inspected. |
| Gate 5 — Drift & compatibility | `COMPLETE` | Blocking drift classified in the matrix below. |
| Gate 6 — Cycle 12.13 readiness | `COMPLETE_NO_GO` | Current preconditions fail deterministically. |
| Gate 7 — Cycle 12.15.2 readiness | `COMPLETE_NO_GO` | Required predecessor chain and objects are absent. |
| Gate 8 — Execution & recovery plan | `COMPLETE` | Staged future runbook, stop conditions and recovery matrix documented. |
| Gate 9 — Read-only QA & GO/NO-GO | `COMPLETE_WITH_LOCAL_RUNTIME_LIMITATION` | Remote read-only audit and static/local unit checks complete; local DB runtime unavailable. |
| Gate 10 — Documentation | `COMPLETE` | This dossier and sanitized evidence reports created. |

No resume contract is required for this mission. The next stage is a separately approved backlog-chain and drift-reconciliation review.

## 5. Local inventory

The active migration directory contains 39 executable SQL migrations in chronological order. The target migrations are present and unmodified.

### Cycle 12.13

- one explicit transaction (`BEGIN`/`COMMIT`);
- temporary allowlist and catalog snapshots, dropped on commit;
- preconditions for two `admin_upsert_assinatura` overloads, two administrative signatures, exactly 62 policies and exactly 62 direct-Auth policies;
- replacement of two `SECURITY DEFINER` functions while preserving owner, ACL and `search_path` metadata;
- 62 `ALTER POLICY` statements over 24 public tables;
- semantic postconditions, zero direct-Auth public policies and metadata equality checks;
- execution-once behavior: a successful rerun is expected to abort its own precondition.

### Cycle 12.15.2

- one explicit transaction;
- `private` schema with four RLS-enabled, client-denied tables: config, targets, audit and operational events;
- four indexes for audit/event lookup;
- singleton seed with `global_enabled=false`, `emergency_blocked=false`, version 1 and no targets;
- `workout_execution_sessions.experience_origin text not null default 'v1'` plus `v1|v2` check;
- 13 function definitions, including private resolver, public decision/admin/telemetry RPCs and workout function replacements;
- old four-argument `start_workout_execution_session` dropped and a compatible five-argument signature created with default `p_experience_origin='v1'`;
- explicit revokes/grants for every new or replaced RPC;
- no deployment, cohort or rollout activation statement.

Preserved local evidence records a clean bootstrap with 39 executable migrations and 67 public functions including overloads. That count is not used as proof of the remote state.

## 6. Remote access method

| Attribute | Result |
| --- | --- |
| Method | Authorized Supabase connector plus catalog-only SQL |
| SQL transaction | `BEGIN TRANSACTION READ ONLY`; `statement_timeout=15s`; `COMMIT` |
| Effective SQL role | privileged catalog role (`postgres`), constrained by the explicit read-only transaction |
| Operations | project metadata, migration listing, extensions, catalog `SELECT`, advisors |
| Mutating RPCs | not called |
| Result | `REMOTE_ACCESS=VERIFIED_READ_ONLY` |

No access token, database password, API key or row-level business payload was printed or stored.

## 7. Remote environment identity

| Attribute | Verified value |
| --- | --- |
| Project | `aruka` |
| Project ref | `vrizeuhuhvtvbrmtvdik` |
| Environment | production, based on repeated repository contracts and prior production closeouts |
| Region | `us-east-2` |
| Status | `ACTIVE_HEALTHY` |
| PostgreSQL | engine 17, server 17.6 / platform build 17.6.1.127 |
| API endpoint | `https://vrizeuhuhvtvbrmtvdik.supabase.co` |

The only other visible project was `Aruka_HML / xrmqdkpxnfvusmenadnf`, region `us-west-2`, status `INACTIVE`. Repository contracts also identify that ref as HML. Therefore the production target identity was not ambiguous.

## 8. Remote migration history

The remote contains 25 migration records and is an exact prefix of the 39 local executable migrations. There are no duplicate versions, name mismatches or remote-only versions.

Pending in required chronological order:

1. `20260914130000_cycle12_execution_tracking_and_safety`
2. `20260914131000_cycle12_execution_commands`
3. `20260914132000_cycle12_completion_and_grants`
4. `20260914185833_cycle12_canonical_execution_reads`
5. `20260915014848_cycle12_student_home_v2`
6. `20260915140229_cycle12_student_training_library_v2`
7. `20260915201101_cycle12_workout_player_v2`
8. `20260919120000_cycle12_set_tracking_player_payload`
9. `20260919231657_cycle12_rest_timer_server_clock`
10. `20260920104727_cycle12_workout_completion_feedback`
11. `20260920144904_cycle12_student_evolution_v2`
12. `20260921010053_cycle12_profile_secondary_flows`
13. `20260926174027_cycle12_schema_rls_hardening`
14. `20261003163830_cycle12_controlled_rollout_foundation`

Target classification:

- Cycle 12.13: `PENDING`, with incompatible current catalog preconditions.
- Cycle 12.15.2: `PENDING`, with missing predecessor dependencies.

No evidence indicates partial application of either target migration: the private schema, rollout objects and `experience_origin` are absent, and Cycle 12.13 direct-Auth normalization is absent.

## 9. Remote schema inventory

| Inventory | Remote actual |
| --- | --- |
| Public base/partitioned tables | 30 |
| Public views/materialized views | 0 |
| Public functions, overloads included | 49 |
| Public policies | 75 |
| Public RLS-enabled tables | 30/30 |
| Public `FORCE RLS` tables | 0 |
| Installed relevant extensions | `pgcrypto`, `pg_stat_statements`, `pg_cron`, `pg_net`, `uuid-ossp`, `supabase_vault`, `plpgsql` |
| `private` schema | absent |

Workout tables exist, with aggregate row counts of 3 sessions, 14 execution exercises and 0 execution sets at audit time. Session statuses were 2 `abandoned` and 1 `in_progress`. No user identifiers or workout contents were read.

The remote workout baseline has the old four-argument start RPC and lacks:

- `tracking_config_snapshot`;
- `last_activity_at`;
- `cancelled_at` and `cancellation_reason`;
- `short_duration_confirmed`;
- `workout_execution_session_feedback`;
- all four V2 workout command RPC names;
- the five-argument start RPC;
- `experience_origin`;
- all six rollout/telemetry public/private functions.

The existing active-session uniqueness and idempotency indexes are present. Existing target relation sizes are small (approximately 24–172 KiB each in the catalog snapshot), but this does not predict lock wait duration.

## 10. Remote security inventory

- All 30 public tables have RLS enabled.
- The remote has 75 policies: 70 with direct `auth.uid()` calls and one already using a wrapped InitPlan form.
- The Cycle 12.13 allowlist comparison produced 58 compatible entries and four missing expected `alunos` policy names.
- The actual `alunos` policies use legacy names and role `public`; their predicates still compare `auth.uid()` with `user_id`, so no cross-user disclosure was proven by this audit, but the role/name contract is noncanonical and blocks 12.13.
- Security Advisor reports 17 `anon`-executable `SECURITY DEFINER` functions and 31 authenticated-executable `SECURITY DEFINER` functions requiring intent review.
- Relevant `anon`-executable functions include `admin_subscription_lifecycle_action`, `admin_upsert_assinatura` (8 args), `save_workout_execution` and `workout_execution_session_payload`.
- Performance Advisor reports 70 `auth_rls_initplan` warnings, 3 multiple-permissive-policy warnings, 9 unindexed foreign keys (INFO) and 35 unused indexes (INFO).
- The remote also reports leaked-password protection disabled. This is an Auth configuration finding outside the migration-writing scope and was not changed.

Advisor remediation references:

- [Anonymous execution of SECURITY DEFINER functions](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
- [RLS InitPlan optimization](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan)
- [Supabase production checklist](https://supabase.com/docs/guides/deployment/going-into-prod)

## 11. Drift matrix

| Object | Local expected | Remote actual | Classification | Severity | Migration impact | Recommended action |
| --- | --- | --- | --- | --- | --- | --- |
| Migration history | 39 executable versions | exact first 25 | `EXPECTED_PENDING_MIGRATION` | HIGH | 12 predecessor migrations must be handled before the two target migrations | Audit and stage the complete pending chain; do not cherry-pick the two targets. |
| `alunos` policies | four canonical names, role `authenticated` | four legacy names, role `public` | `PREEXISTING_DRIFT` | BLOCKER | Cycle 12.13 aborts before persistent DDL | Determine origin; design reviewed forward reconciliation before 12.13. |
| Direct-Auth policy count | 62 immediately before 12.13 | 70 now | mixed pending-chain + drift | BLOCKER | Cycle 12.13 precondition fails | Apply/audit predecessor chain, reconcile drift, rerun exact preflight. |
| Public functions | 67 after 12.15.2 | 49 | `EXPECTED_PENDING_MIGRATION` plus ACL drift | HIGH | required RPCs/overloads absent | Compare again after predecessor chain; preserve overload signatures. |
| Anonymous `SECURITY DEFINER` execution | minimal explicit grants; local 12.13 evidence expects no anon on its two targets | 17 functions | `SECURITY_RISK` / `PREEXISTING_DRIFT` | HIGH | 12.13 preserves ACL on its replacements; it does not repair this | Create a dedicated least-privilege reconciliation plan and regression matrix. |
| Workout execution schema | Cycle 12 fields, feedback and commands present before 12.15.2 | pre-Cycle 12 baseline | `EXPECTED_PENDING_MIGRATION` | BLOCKER | 12.15.2 references nonexistent objects | Apply all 12 predecessor migrations first, with their own readiness review. |
| Controlled rollout objects | private schema/tables/functions; OFF singleton | absent | `EXPECTED_PENDING_MIGRATION` | INFO | expected until 12.15.2 | Do not classify as problematic drift. |
| `experience_origin` | `NOT NULL`, default `v1`, check `v1|v2` | absent | `EXPECTED_PENDING_MIGRATION` | HIGH | pinning not available remotely | Add only through authorized 12.15.2 after prerequisites. |
| RLS coverage | all exposed public tables protected | 30/30 enabled | `COMPATIBLE` | INFO | no blocker by itself | Retain; validate semantics/grants after each stage. |
| Platform version | PostgreSQL 17 baseline | PostgreSQL 17.6 | `COMPATIBLE` | INFO | no target-migration incompatibility found | Track platform upgrades separately. |

## 12. Migration 12.13 readiness

**Current decision:** `NO_GO`.

Static/local contract:

- 62 policies over 24 tables;
- direct `auth.uid()` converted to `(select auth.uid())` with semantic preservation;
- two administrative functions replaced without signature, owner, `SECURITY DEFINER`, `search_path` or ACL drift;
- entire operation transactional;
- preconditions execute before persistent DDL.

Remote facts:

- required administrative signatures and `admin_upsert_assinatura` overloads exist;
- 58/62 expected policies match the required name/command/role/permissiveness/RLS/direct-Auth contract;
- the four canonical `alunos` policies are missing;
- direct-Auth policy count is 70, not 62;
- `admin_subscription_lifecycle_action(...)` currently grants `anon` execute, while the preserved local contract does not.

An attempted execution now should abort in the precondition block and roll back the transaction. That fail-fast behavior is desirable, but it is not migration readiness.

Readiness requires all of the following:

1. complete audit and approved application plan for the 12 earlier pending migrations;
2. reviewed reconciliation of the four `alunos` policies and function ACL drift;
3. exact preflight showing 62/62 allowlist compatibility and exactly 62 direct-Auth policies;
4. fresh backup/PITR and restore-readiness confirmation;
5. approved lock/statement timeout values and low-traffic window;
6. post-apply assertion and authorization smoke plan.

## 13. Migration 12.15.2 readiness

**Current decision:** `NO_GO`.

The migration is statically fail-closed:

- singleton is inserted OFF;
- no target is inserted;
- private tables deny client roles and have RLS enabled;
- decision derives identity from `auth.uid()`;
- build capability cannot grant V2;
- new start default is V1;
- old clients can omit the fifth start argument because it has a default;
- V1/V2 session mutations are pinned and conflict-checked.

However, the remote is missing all material prerequisites introduced by migrations `20260914130000` through `20260921010053`. Applying 12.15.2 after 12.13 alone would fail when definitions reference absent columns, tables and functions. Applying it out of chronological order is prohibited.

After the full chain is aligned, revalidate:

- 62 public functions before 12.15.2 and 67 after it, including overloads;
- required workout columns and feedback table;
- old four-argument start signature replaced by the five-argument defaulted signature;
- one OFF singleton, zero targets and zero unexpected audit rows immediately after migration;
- no direct table access to private rollout objects;
- exact RPC grants and `search_path=''` on new definer functions;
- existing in-progress sessions receive `experience_origin='v1'` and remain recoverable.

## 14. Migration dependency/order

The safe order is not “12.13 then 12.15.2” against the current production state. The required conceptual order is:

1. human approval for backlog-chain and drift-reconciliation planning;
2. fresh backup/PITR and restore-readiness verification;
3. immediate read-only preflight and deployment freeze;
4. authorized application of migrations `20260914130000` through `20260921010053` in exact order, with per-stage validation;
5. stabilization and new remote catalog snapshot;
6. approved reconciliation of remaining preexisting policy/function-grant drift;
7. exact Cycle 12.13 preconditions;
8. authorized Cycle 12.13 application;
9. Cycle 12.13 validation and stabilization;
10. explicit second approval gate;
11. exact Cycle 12.15.2 preconditions;
12. authorized Cycle 12.15.2 application;
13. OFF-state/security validation and stabilization;
14. separately authorized compatible frontend deploy;
15. remote smoke with rollout OFF;
16. observability and kill-switch rehearsal;
17. separate pilot approval and minimum cohort activation.

Steps 4, 6, 8, 12, 14, 16 and 17 are future write operations and were not authorized or executed here.

## 15. Frontend/PWA compatibility

- New frontend against old backend: the decision RPC is absent; the current client contract must fail closed to V1. This is locally unit-tested but not remotely exercised here.
- New backend against old frontend: old clients keep using V1. The new start RPC retains the old named arguments and defaults `experience_origin` to V1.
- Existing sessions: the current remote has one aggregate `in_progress` session. Cycle 12.15.2's constant default should classify it as V1; post-migration validation must confirm this without exposing session identity.
- PWA: prompt-based service-worker activation means old bundles may persist. Old RPCs and V1 behavior must remain available throughout pilot and rollback windows.
- The backend must be migrated and validated with rollout OFF before deploying a bundle that can request V2.
- A build rollback is not equivalent to a database rollback. Keep additive backend contracts until the old-bundle window and all active sessions have drained.

`PLAYER-02` remains `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`. Physical iOS remains `NOT_EXECUTED_DEVICE_UNAVAILABLE`.

## 16. Lock/performance risks

### Cycle 12.13

`ALTER POLICY` takes relation locks across 24 tables inside one transaction. The two function replacements also require catalog/function locks. There is no table rewrite or backfill, but a lock wait on any table can hold earlier locks until rollback/commit. The observed relations are small; lock contention, not data size, is the dominant unknown.

### Cycle 12.15.2

Creating private objects is low-contention in isolation. `ALTER TABLE workout_execution_sessions ADD COLUMN ... DEFAULT 'v1'` and the check constraint require strong table locks; the constant default is expected to avoid a full rewrite on PostgreSQL 17, but constraint validation and lock acquisition still occur. Function replacement invalidates/replaces RPC definitions and the old start signature is dropped within the transaction.

Audit snapshot:

- no transaction older than 30 seconds;
- no session waiting on a lock;
- no recorded database deadlocks;
- only the audit query's `AccessShareLock` appeared on the target session relation;
- one in-progress workout session existed.

These are point-in-time observations, not a window guarantee.

`DURATION_ESTIMATE=UNAVAILABLE`.

Window start thresholds for lock wait, statement duration, traffic and error rate require human approval: `THRESHOLD_REQUIRES_HUMAN_APPROVAL`.

## 17. Operational runbook

### Preconditions

- production identity reverified by two sources;
- fresh backup/PITR availability and restore path confirmed, not merely an old logical backup;
- approved complete 14-migration plan, including the 12 predecessor migrations;
- no unknown history or object drift;
- policy and function ACL reconciliation approved;
- owner/DBA, application owner, incident commander and rollback approver available;
- low-traffic window and communication channel active;
- monitoring and sanitized catalog queries ready;
- local/ephemeral clean bootstrap and target validators green;
- frontend deployment frozen;
- rollout OFF and zero real targets.

### Per-stage validation

After predecessor chain: verify history, tables, columns, constraints, indexes, 62-function pre-rollout contract, RLS, ACLs and V1 reads/writes.

After 12.13: verify exactly one history record, 0 direct-Auth public policies, 62 wrapped targets, unchanged policy semantics, function owner/ACL/definer/search path and authorization smoke.

After 12.15.2: verify 67 public functions, private schema/table ACLs, OFF singleton, zero targets, decision contract by catalog/static-safe smoke, session origin defaults, old-client function compatibility and telemetry availability.

Stabilize between every write stage. Do not bundle 12.13, 12.15.2, frontend deployment and pilot activation into one change window.

## 18. Stop conditions

Stop before or during a future execution when any of the following occurs:

- environment identity is ambiguous;
- backup/PITR or restore readiness is unverified;
- migration history is not the approved exact prefix;
- any unknown or unclassified object drift appears;
- Cycle 12.13 does not show exactly 62/62 compatible policies and 62 direct-Auth policies before execution;
- expected predecessor columns/functions are absent before Cycle 12.15.2;
- rollout is unexpectedly ON or any real target exists;
- permission/owner differs from the approved executor;
- lock wait or statement duration exceeds an approved threshold;
- migration returns any error or history/object state diverges;
- critical Auth/RLS/grant regression appears;
- workout start/resume/completion or session ownership check regresses;
- observability is unavailable for the authorized stage.

Where no evidence-based threshold exists: `THRESHOLD_REQUIRES_HUMAN_APPROVAL`.

## 19. Recovery/rollback

| Failure | Detection | Immediate action | Recovery option | Data risk | Human approval |
| --- | --- | --- | --- | --- | --- |
| Failure before execution | failed preflight | do not start | correct plan/evidence and reschedule | none | yes to reschedule |
| SQL error inside migration transaction | migration error, no commit | stop; verify rollback and history | fix forward in reviewed migration/plan; do not repair history blindly | low if rollback complete | yes |
| Lock timeout | timeout/error | allow transaction rollback; end window if threshold exceeded | investigate blockers, choose new window | low if uncommitted | yes |
| Unexpected partial history/object state | history/catalog mismatch | freeze all writes/deploys | forensic reconciliation; only then approved repair | medium/high | DBA + owner |
| 12.13 post-commit authorization regression | smoke/advisor/RLS failure | halt next stage; keep rollout OFF | compensating forward migration; PITR only for severe unrecoverable impact | high | incident authority |
| 12.15.2 post-commit product defect | OFF-state or RPC smoke failure | no frontend deploy; rollout remains OFF | forward fix while preserving additive contracts | low/medium | owner |
| Frontend new/backend old | missing RPC and V1 fallback | keep/restore old build if fallback fails | frontend rollback; do not alter DB history | low if fail-closed | release owner |
| Backend new/frontend old | V1 RPC incompatibility | stop rollout/deploy expansion | forward compatibility fix; keep old contracts | medium | DB + app owners |
| Pinning/coexistence defect | origin mismatch or command conflict anomaly | global OFF/emergency when available; preserve sessions | forward fix; session-specific recovery only after review | high | incident authority |
| Catastrophic committed data/schema loss | integrity check failure | stop all rollout/deploy/write stages | verified backup restore or PITR | critical | explicit restore approval |

Transaction rollback, frontend rollback, functional OFF, compensating migration and restore/PITR are distinct mechanisms and must not be treated as interchangeable.

## 20. Observability

Before any future write window, prepare PII-free dashboards/queries for:

- migration errors, lock waits and long transactions;
- decision counts by V1/V2, reason code, config/build version;
- decision RPC/fallback errors and latency;
- start/resume, set confirmed/uncertain/reconciled/conflict;
- completion/cancel and command errors;
- authorization denials and cross-user alarms;
- in-progress sessions by age and experience origin;
- pinning inconsistencies;
- audit/config changes and target counts.

Initial product thresholds documented in Cycle 12.15.2 remain proposals for the pilot, not approved migration-window thresholds. Any suspected data loss or cross-user exposure is an immediate stop/kill-switch signal.

## 21. Read-only QA

| Validation | Result | Evidence |
| --- | --- | --- |
| Git baseline | PASS | branch/HEAD/origin exact; initial tree clean |
| Migration files/order/hash | PASS | both files present; 39 versions; SHA-256 recorded |
| Supabase CI static | PASS | 39 active migrations; repository safety; 457 Node files, 8 PowerShell files, 31 JSON reports |
| Cycle 12.15.2 unit tests | PASS | 24/24 |
| Local DB runtime | `NOT_EXECUTED_UNAVAILABLE` | local container not running; no start/reset attempted |
| Preserved local clean bootstrap | PASS_WITH_HISTORICAL_EVIDENCE | Cycle 12.15.2 report: 39 migrations, 67 public functions |
| Remote identity/read-only mode | PASS | project metadata + repository contract; transaction reported read-only |
| Remote migration history | PASS as inventory / NO_GO as readiness | exact 25-version prefix; 14 pending |
| Remote schema/security catalog | PASS as inventory / NO_GO as readiness | 30 tables, 49 functions, 75 policies, blocking drift |
| Cycle 12.13 remote preconditions | FAIL | 58/62 allowlist; direct count 70; four `alunos` targets absent |
| Cycle 12.15.2 prerequisites | FAIL | required Cycle 12 schema/functions absent |
| Remote write test | NOT EXECUTED | prohibited |

## 22. GO/NO-GO matrix

| Area | Decision |
| --- | --- |
| `LOCAL_ANALYSIS` | `PASS_WITH_LIMITATIONS` |
| `REMOTE_PREFLIGHT` | `NO_GO` |
| `MIGRATION_READINESS` | `NO_GO` |
| `PRODUCTION_GO` | `NO_GO` |

## 23. Findings

| ID | Severity | Evidence | Migration blocker | Pilot blocker | Recommendation | Suggested owner |
| --- | --- | --- | --- | --- | --- | --- |
| C12.15.3-DB-01 | BLOCKER | remote history 25 vs local 39; 14 pending | yes | yes | audit and plan complete pending chain | DBA / platform owner |
| C12.15.3-MIG-01 | BLOCKER | Cycle 12.13 allowlist 58/62; direct count 70 vs 62 | yes | yes | reconcile predecessor chain and `alunos` policies; rerun exact preflight | DBA + security owner |
| C12.15.3-MIG-02 | BLOCKER | required workout columns/table/RPCs absent | yes for 12.15.2 | yes | never apply 12.15.2 after 12.13 alone; preserve chronological chain | DBA + application owner |
| C12.15.3-SEC-01 | HIGH | 17 anon-executable `SECURITY DEFINER` functions | yes pending approved security disposition | yes | least-privilege reconciliation and negative Auth tests | security + DBA |
| C12.15.3-DB-02 | HIGH | four legacy `alunos` policies use role `public` and noncanonical names | yes for 12.13 | yes pending review | determine origin and use reviewed forward reconciliation | security + DBA |
| C12.15.3-OPS-01 | HIGH | backup evidence is old and restore test was not executed | yes | yes | verify fresh backup/PITR and recovery path immediately before window | operations owner |
| C12.15.3-OPS-02 | MEDIUM | one active workout session observed; timeout budgets unapproved | no by itself | yes for unsafe window | low-traffic window; approve thresholds; preserve session | incident/release owner |
| C12.15.3-AUTH-01 | MEDIUM | leaked-password protection advisor warning | no | yes before broader production readiness | review Auth password protection separately | Auth/security owner |
| C12.15.3-QA-01 | LOW | local DB runtime unavailable in this audit | no with preserved evidence | no | rerun clean ephemeral bootstrap before authorized change | QA/platform owner |

## 24. Known limitations

- No remote data mutation or authenticated end-user smoke was allowed.
- Local Supabase runtime was unavailable; no automatic start/reset was attempted.
- Duration cannot be estimated from catalog size alone.
- Advisor results are point-in-time and require recheck after each stage.
- The 12 predecessor migrations were inventoried for dependency, not granted production readiness individually.
- Frontend production build flag and deployed service-worker population were not independently inspected.
- `PLAYER-02` remains `KNOWN_NON_BLOCKING_UX_LIMITATION / DEFERRED`.
- Physical iOS remains `NOT_EXECUTED_DEVICE_UNAVAILABLE`.

## 25. Human approvals required

1. Approve a dedicated audit of all 12 predecessor migrations.
2. Decide how to reconcile the four `alunos` policies without rewriting history unsafely.
3. Approve a least-privilege plan for the 17 anonymous definer functions.
4. Confirm fresh backup/PITR, restore authority and recovery owner.
5. Approve lock and statement timeout thresholds and the execution window.
6. Approve each write stage separately: predecessor chain, drift reconciliation, 12.13, 12.15.2, frontend deploy, kill-switch rehearsal and pilot.
7. Decide Auth leaked-password protection separately.
8. Approve pilot cohort and acceptance criteria only after remote OFF smoke and device QA.

## 26. Explicit non-actions

- no remote migration, DDL or DML;
- no migration repair or history mutation;
- no Auth, RLS, policy or grant change;
- no mutating RPC invocation;
- no fixture, user or cohort creation;
- no deploy or service-worker change;
- no rollout activation;
- no migration or product-code edit;
- no Git add, commit, push, merge, tag or PR;
- no destructive local cleanup or reset.

## 27. Next stage

Proposed next stage: `CYCLE_12_15_4_PENDING_CHAIN_AND_DRIFT_RECONCILIATION_DISCOVERY`.

Its scope should be read-only first: audit all 12 predecessor migrations against production, identify which security findings are resolved by the pending chain, design the minimal forward reconciliation for the remaining `alunos`/ACL drift, and produce a staged authorization package. Only a later, explicitly authorized operation may perform writes.

## 28. Resume contract

Mission complete; no session-boundary continuation is required. If resumed after remote or repository changes, reconstruct:

- branch/HEAD/origin and working tree;
- production project identity;
- full migration history;
- exact 62-policy precondition and direct-Auth count;
- targeted function ACLs and advisor counts;
- workout prerequisite columns/functions;
- active-session aggregate and lock snapshot;
- backup/PITR readiness;
- rollout OFF/target count.

Do not reuse this GO/NO-GO decision after any remote schema, migration history, Auth/grant or deployment change without a fresh preflight.

## 29. Final diff and publication inventory

| Category | Files | Assessment |
| --- | --- | --- |
| A — documentation | `docs/product-roadmap-v4-cycle-12-student-experience-v2/24-remote-preflight-migration-readiness.md` | recommended for publication |
| B — evidence | `reports/cycle-12-15-3-remote-preflight.md`, `reports/cycle-12-15-3-remote-preflight.json` | recommended for publication |
| C — read-only audit scripts | none | no new script required because remote access was available |
| D — supporting tests | none | existing tests reused |
| E — generated/historical churn | none | no existing report regenerated |
| F — temporary/unnecessary | none | no temporary file created |

Files not recommended for publication: none among the three changed files. Raw connector envelopes and terminal output are not publication artifacts and were not written to the repository.
