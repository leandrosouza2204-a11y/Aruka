# Cycle 12.15.3 — Remote preflight evidence

## Result

- Decision: `DISCOVERY_COMPLETE_READY_FOR_HUMAN_REVIEW`
- Audit timestamp: `2026-10-03T22:59:13-03:00`
- Remote access: `VERIFIED_READ_ONLY`
- Local analysis: `PASS_WITH_LIMITATIONS`
- Remote preflight: `NO_GO`
- Migration readiness: `NO_GO`
- Production GO: `NO_GO`

## Scope and safety

This report contains sanitized catalog facts and aggregate counts only. No secret, token, email, phone, person name, individualized workout content or clinical data is included.

Remote SQL used explicit `BEGIN TRANSACTION READ ONLY` and a local `statement_timeout` for catalog queries. No user-defined function was invoked. Supabase metadata/listing and advisor endpoints were read-only.

## Baseline evidence

| Item | Value |
| --- | --- |
| Branch | `main` |
| HEAD | `91d0de27a9b80442eba1b1eb5069e415e89004e1` |
| `origin/main` | same SHA |
| Initial worktree | clean |
| Local executable migrations | 39 |
| Target 12.13 SHA-256 | `C4E01665FF8E55D0CDF5BD4A7B0692301E9E224E3EFFDBD9E6748AD2625DE770` |
| Target 12.15.2 SHA-256 | `9D236465C9A7DBA35E2845CA965DD1E1806A73A1DB0D712D04CBBB068E4E6FDB` |

## Remote identity

| Item | Value |
| --- | --- |
| Project | `aruka / vrizeuhuhvtvbrmtvdik` |
| Environment | production |
| Region | `us-east-2` |
| Status | `ACTIVE_HEALTHY` |
| PostgreSQL | 17.6 / platform 17.6.1.127 |
| SQL read-only proof | `transaction_read_only=on` |

HML was separately visible as `Aruka_HML / xrmqdkpxnfvusmenadnf`, `INACTIVE`, and was not queried.

## Read-only command/query categories

Local commands:

- Git status, branch, revisions and log;
- file inventory, hashes and static searches;
- `npm.cmd run qa:supabase-ci-static` / final static validator;
- `npm.cmd run qa:cycle12:15:2:unit`;
- local runtime validator attempt, which stopped because the local container was not running;
- final Git diff/status checks.

Remote categories:

- project listing/details/URL;
- migration history listing;
- extension and table inventory;
- catalog counts for schemas, relations, functions and policies;
- exact Cycle 12.13 policy allowlist comparison;
- function signatures, owners, volatility, security mode, `search_path` and ACL;
- workout columns, constraints, indexes and triggers;
- aggregate session statuses, relation sizes, transactions, locks and deadlocks;
- Security and Performance Advisor summaries.

Prohibited commands such as `db push`, migration repair, deploy and mutating RPCs were not called.

## Remote migration evidence

- Remote count: 25.
- Local count: 39.
- Remote history is the exact local prefix: yes.
- Pending count: 14.
- Unknown remote versions: 0.
- Duplicate remote versions: 0.
- Name mismatches: 0.
- Cycle 12.13: pending.
- Cycle 12.15.2: pending.

The 12 versions between the remote head and Cycle 12.13 are listed in the primary dossier. This is the principal dependency blocker.

## Remote catalog evidence

| Metric | Value |
| --- | --- |
| Public tables | 30 |
| Public tables with RLS | 30 |
| Public FORCE RLS tables | 0 |
| Public views/materialized views | 0 |
| Public functions | 49 |
| Public policies | 75 |
| Direct-Auth policies | 70 |
| Wrapped-Auth policies | 1 |
| Cycle 12.13 allowlist compatible | 58/62 |
| Anonymous executable definer functions | 17 |

Missing Cycle 12.13 policies:

- `alunos.Usuarios podem atualizar seus alunos`
- `alunos.Usuarios podem cadastrar seus alunos`
- `alunos.Usuarios podem excluir seus alunos`
- `alunos.Usuarios podem listar seus alunos`

Actual replacements use legacy accented names and role `public`.

## Workout and rollout evidence

| Object/contract | Remote result |
| --- | --- |
| `private` schema | absent |
| `experience_origin` | absent |
| `tracking_config_snapshot` | absent |
| `last_activity_at` | absent |
| cancellation fields | absent |
| `short_duration_confirmed` | absent |
| feedback table | absent |
| old 4-argument start RPC | present |
| new 5-argument start RPC | absent |
| V2 command RPC count | 0 |
| rollout/telemetry function count | 0 |
| session aggregate | 3 total: 2 abandoned, 1 in progress |

No session ID or user-related field was retrieved.

## Advisor evidence

Security:

- `anon_security_definer_function_executable`: WARN, 17;
- `authenticated_security_definer_function_executable`: WARN, 31;
- `auth_leaked_password_protection`: WARN, 1.

Performance:

- `auth_rls_initplan`: WARN, 70;
- `multiple_permissive_policies`: WARN, 3;
- `unindexed_foreign_keys`: INFO, 9;
- `unused_index`: INFO, 35.

## Lock/performance snapshot

- target relations approximately 24–172 KiB each;
- no transaction older than 30 seconds;
- no lock waiter;
- 0 recorded deadlocks;
- audit-time target locks were granted `AccessShareLock` from the audit itself;
- duration estimate unavailable.

This snapshot cannot replace an immediate pre-window check.

## Local QA evidence

| Validation | Result |
| --- | --- |
| Supabase baseline line endings | PASS |
| Repository safety | PASS |
| Active executable migrations | 39 |
| Supabase CI static | PASS |
| Node files checked | 457 |
| PowerShell files checked | 8 |
| JSON reports checked | 31 |
| Cycle 12.15.2 unit tests | 24/24 PASS |
| Local runtime 12.13 validator | NOT EXECUTED — container unavailable |
| Preserved clean bootstrap | PASS historical evidence — 39 migrations / 67 public functions |

## Findings summary

| ID | Severity | Summary |
| --- | --- | --- |
| C12.15.3-DB-01 | BLOCKER | 14 migrations pending, not 2 |
| C12.15.3-MIG-01 | BLOCKER | Cycle 12.13 preconditions fail |
| C12.15.3-MIG-02 | BLOCKER | Cycle 12.15.2 prerequisites absent |
| C12.15.3-SEC-01 | HIGH | 17 anon-executable definer functions |
| C12.15.3-DB-02 | HIGH | four noncanonical `alunos` policies |
| C12.15.3-OPS-01 | HIGH | fresh recovery evidence still required |
| C12.15.3-OPS-02 | MEDIUM | one active session and unapproved timeout budgets |
| C12.15.3-AUTH-01 | MEDIUM | leaked-password protection warning |
| C12.15.3-QA-01 | LOW | local runtime unavailable during this audit |

## Explicit non-actions

No remote write, migration, repair, Auth/RLS/grant change, deploy, cohort activation, secret change, Git publication or destructive cleanup occurred.

## Publication recommendation

Publish after human review:

- `docs/product-roadmap-v4-cycle-12-student-experience-v2/24-remote-preflight-migration-readiness.md`
- `reports/cycle-12-15-3-remote-preflight.md`
- `reports/cycle-12-15-3-remote-preflight.json`

Do not publish temporary command output or any connector response containing raw envelopes. No such file was created.
