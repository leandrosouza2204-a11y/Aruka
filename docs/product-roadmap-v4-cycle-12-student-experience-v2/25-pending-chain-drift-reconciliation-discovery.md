# Cycle 12.15.4 — Pending chain & drift reconciliation discovery

## 1. Executive summary

**Decision:** `DISCOVERY_COMPLETE_WITH_FINDINGS`.

The production database is mostly an older coherent prefix of the repository migration chain, but it is not only an old version of the canonical schema. Three pre-existing drift classes remain:

1. four legacy `alunos` policies have noncanonical names and role `public` instead of the canonical names and role `authenticated`;
2. 17 `SECURITY DEFINER` functions are executable by `anon` because hosted `public` function default ACLs explicitly grant `anon`; only two of those grants are removed by the pending chain;
3. five legacy administrative overloads exist only remotely and survive all 14 pending migrations.

The `70` versus `62` direct-Auth difference is otherwise fully explained by the pending chain: eight workout policies are deliberately removed by `20260914132000`, which reduces the direct-Auth count from 70 to 62. Three replacement workout policies and three later contact policies already use `(select auth.uid())`, so they do not increase that count.

The 12 predecessor migrations are statically coherent in chronological order and the current catalog satisfies their observed entry conditions when their deltas are simulated sequentially. They are not authorized for execution. The complete 14-migration chain cannot be applied as authored because Cycle 12.13 will still abort on the four `alunos` policies and will preserve the unwanted ACL on `admin_subscription_lifecycle_action(...)`.

A forward reconciliation migration is required **after the 12 predecessors and before Cycle 12.13**. It must minimally canonicalize the four `alunos` policies and repair function EXECUTE privileges. Disposition of the five legacy overloads requires separate external-consumer review; they do not make the 12 predecessors fail, but they prevent the remote function inventory from converging to the clean-bootstrap count.

No remote write, migration, repair, Auth/RLS/grant change, deploy, cohort change, rollout activation or Git publication occurred.

## 2. Decision

| Decision | Result |
| --- | --- |
| `CHAIN_UNDERSTANDING` | `PASS` |
| `POLICY_RECONCILIATION` | `MIXED` |
| `SECURITY_DEFINER_REVIEW` | `PASS_WITH_FINDINGS` |
| `CHAIN_STATIC_READINESS` | `NO_GO` for the complete 14-migration chain; 12 predecessors are `READY_WITH_PRECONDITIONS` |
| `REMOTE_MIGRATION_READINESS` | `NO_GO` |
| `PRODUCTION_GO` | `NO_GO` |
| Mission | `DISCOVERY_COMPLETE_WITH_FINDINGS` |

`MIGRATION_READINESS` is not authorization. Every future write window requires separate human approval.

## 3. Baseline

| Item | Verified result |
| --- | --- |
| Branch | `main` |
| Initial HEAD | `3c51a0a16d08ffc3231f146c5e39892a623ca4c6` |
| Initial `origin/main` | same SHA |
| Initial working tree | clean |
| PR #145 | merged at current HEAD |
| Cycle 12.15.3 | complete |
| Local executable migrations | 39 |
| Remote migrations | 25 |
| Pending migrations | 14 |
| Rollout | `OFF` |

All 39 active migration files were read by the static inventory. All 14 pending migrations were read in full. The 12.15.3 evidence remains the baseline; current remote facts below were revalidated rather than inferred.

## 4. Remote snapshot

Captured at `2026-10-04T11:11:32.120401Z` (`2026-10-04 08:11:32 -03:00`), with advisor observations at `2026-10-04T11:18:50.262Z`.

| Attribute | Current result |
| --- | --- |
| Project | `aruka / vrizeuhuhvtvbrmtvdik` |
| Environment | production |
| Region/status | `us-east-2 / ACTIVE_HEALTHY` |
| PostgreSQL | engine 17, server 17.6, platform 17.6.1.127 |
| Effective SQL role | `postgres` inside explicit read-only transaction |
| `transaction_read_only` | `on` |
| Migration history | exact 25-version local prefix; 14 pending; zero duplicate/unknown/name mismatch |
| Public tables/RLS | 30 / 30 |
| Public functions | 49 |
| Public policies | 75 |
| Direct-Auth public policies | 70 |
| `private` schema | absent |
| `anon`-executable definers | 17 |
| Workout sessions, aggregate only | 3: 2 `abandoned`, 1 `in_progress` |
| Active non-audit DB sessions / waiting locks | 0 / 0 at snapshot time |

The central metrics are unchanged from Cycle 12.15.3. No PII, session identifier or workout content was queried.

## 5. Pending migration inventory

`Tx` means an explicit transaction in the SQL file, not an assumption about runner behavior. `DML` describes migration-time data effects, not DML inside function bodies.

| # | Version / migration | Purpose | Tx | Schema/data/security impact | Lock risk | Expected remote delta |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | `20260914130000_cycle12_execution_tracking_and_safety` | Cycle 12.2 tracking/safety foundation | none explicit | columns/defaults, 4 constraints, trigger, 2 indexes, 3 functions | HIGH | tracking snapshots, cancellation/activity fields, payload v2 foundation |
| 2 | `20260914131000_cycle12_execution_commands` | atomic set/skip commands | none explicit | 2 write definers; no migration-time DML | LOW | two authenticated workout command RPCs |
| 3 | `20260914132000_cycle12_completion_and_grants` | completion/cancel + command-only writes | none explicit | 2 functions, table DML revokes, 8 policy drops, 3 policy creates, helper revokes | MEDIUM | direct-Auth 70→62; public policies 75→70 |
| 4 | `20260914185833_cycle12_canonical_execution_reads` | canonical completed-session reads | none explicit | invoker view, index, 2 read definers | MEDIUM | canonical history/performance reads |
| 5 | `20260915014848_cycle12_student_home_v2` | Student Home V2 read | none explicit | partial index + one read definer | MEDIUM | Home V2 RPC |
| 6 | `20260915140229_cycle12_student_training_library_v2` | library/detail reads | none explicit | 2 read definers | LOW | Library V2 RPCs |
| 7 | `20260915201101_cycle12_workout_player_v2` | bounded Player read | none explicit | one read definer | LOW | Player V2 RPC |
| 8 | `20260919120000_cycle12_set_tracking_player_payload` | full set values in Player | none explicit | replaces Player function | LOW | canonical set tracking payload |
| 9 | `20260919231657_cycle12_rest_timer_server_clock` | server clock anchor | none explicit | replaces Player function | LOW | `serverNow` in Player payload |
| 10 | `20260920104727_cycle12_workout_completion_feedback` | atomic completion feedback | none explicit | new RLS table, 3-arg completion overload, Player replacement, grants | MEDIUM | feedback contract/table; no initial rows |
| 11 | `20260920144904_cycle12_student_evolution_v2` | frequency/assessment reads | none explicit | 2 read definers | LOW | Evolution V2 RPCs |
| 12 | `20260921010053_cycle12_profile_secondary_flows` | profile/contact flows | none explicit | new RLS table, 3 wrapped policies, 3 functions | MEDIUM | contact settings; public policies 70→73 |
| 13 | `20260926174027_cycle12_schema_rls_hardening` | Cycle 12.13 RLS InitPlan/admin fix | `BEGIN/COMMIT` | 62 `ALTER POLICY`, 2 function replacements, fail-fast assertions | HIGH | direct-Auth 62→0; no policy-count change |
| 14 | `20261003163830_cycle12_controlled_rollout_foundation` | Cycle 12.15.2 rollout foundation | `BEGIN/COMMIT` | private schema/4 tables, OFF singleton, `experience_origin`, 14 definitions, exact grants | HIGH | rollout remains OFF; existing sessions become V1; public functions +5 net |

Approximate file sizes range from 3.8 KiB to 41.4 KiB. No pending predecessor performs a bulk business-data backfill. Migrations 1 and 14 add constant defaults to existing session rows; migration 1 also adds defaults to exercise rows. Migrations 10 and 12 create empty tables. Migration 14 inserts only the OFF configuration singleton.

## 6. Dependency graph

```text
REMOTE_CURRENT (25 migrations, pre-Cycle-12 workout schema)
  -> P01 tracking columns/constraints/trigger/payload
  -> P02 set + skip commands
  -> P03 cancel/completion/grants/policy consolidation
  -> P04 canonical history/performance reads
       -> P05 Home V2
       -> P06 Library/detail V2
       -> P07 Player V2 -> P08 set payload -> P09 server clock
                         -> P10 feedback + 3-arg completion
       -> P11 Evolution V2
       -> P12 Profile/contact settings
  -> RECONCILIATION GATE (required; not implemented here)
       -> Cycle 12.13 RLS hardening
       -> stabilization/second approval
       -> Cycle 12.15.2 rollout foundation (OFF)
```

P01–P03 must not be separated operationally: P01/P02 create definers under a hosted default ACL that grants `anon`, and P03 is the first file that revokes the new command/helper privileges. P07–P10 are an ordered replacement chain for the same Player function. Cycle 12.13 and Cycle 12.15.2 require separate windows.

## 7. Migration-by-migration predecessor analysis

| # | Explicit/implicit prerequisite and observed entry condition | Expected post-state / next dependency | Static readiness | Remote precondition | Risk / idempotency |
| ---: | --- | --- | --- | --- | --- |
| 1 | workout tables/columns from 12.15.3 prefix exist; current statuses and terminal dates have zero aggregate constraint violations; six new columns are absent | tracking defaults/snapshot trigger, valid status/date constraints, expanded payload; P02 can compile | `READY_WITH_CONDITIONS` | `SATISFIED` | HIGH; mostly rerunnable, but strong locks/constraint validation/index build |
| 2 | P01 snapshot column, validator and payload | set completion and skip RPCs | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P01` | LOW DDL; replace-idempotent; temporary anon exposure until P03 |
| 3 | P01/P02 functions and columns; eight named legacy workout policies exist remotely | command-only mutations, 3 wrapped read policies, helpers non-callable; P04 reads safe payload | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P01_P02` | MEDIUM; drop/create policies make execution-once semantics; old clients retain legacy RPCs |
| 4 | P03 read policies/payload and completed statuses | invoker view + bounded history/performance RPCs | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P03` | MEDIUM due non-concurrent index; otherwise additive |
| 5 | P01 activity field, P04 valid-session view, active workout model | Home V2 read | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P04` | MEDIUM index build; function replace-idempotent |
| 6 | P01 tracking config, exercise media schema, P04 valid view | library/detail reads | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P04` | LOW; functions only |
| 7 | P01 cancellation/activity/tracking fields and exercise media | initial Player read | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P01` | LOW; function only |
| 8 | P07 signature plus existing set timestamps/values | complete set values and completion timestamp in Player | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P07` | LOW; ordered function replacement |
| 9 | P08 Player body | server clock anchor | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P08` | LOW; ordered function replacement |
| 10 | P03 2-arg completion, P09 Player, session table; feedback table confirmed absent | RLS feedback table, 3-arg overload, Player feedback | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P09` | MEDIUM; `CREATE TABLE` is not rerunnable after success |
| 11 | completed sessions and assessments schema | two bounded evolution reads | `READY_WITH_CONDITIONS` | `SATISFIED_AFTER_P04` | LOW; functions only |
| 12 | `auth.users`, profiles/alunos; contact table confirmed absent | contact table, 3 wrapped policies, profile/contact RPCs | `READY_WITH_CONDITIONS` | `SATISFIED` after prior chain | MEDIUM; `IF NOT EXISTS` table but non-idempotent policy creation |

No predecessor is authorized. `DURATION_ESTIMATE=UNAVAILABLE` for every row. Preconditions were proven by catalog state, aggregate integrity checks and static sequential simulation; they were not proven by executing migrations.

## 8. Expected schema evolution and checkpoints

| Checkpoint | Expected material state |
| --- | --- |
| `REMOTE_CURRENT` | 30 public tables, 49 functions, 75 policies, 70 direct-Auth, old workout execution contract |
| `CHAIN_CP_01` after P01–P03 | tracking/cancellation/activity fields; 4 new commands; 70 policies; 62 direct-Auth; command-only V2 writes; payload helper no longer client-callable |
| `CHAIN_CP_02` after P04–P06 | canonical history, Home and Library reads; 3 new indexes across P04/P05; V1 compatibility retained |
| `CHAIN_CP_03` after P07–P10 | final pre-rollout Player payload and feedback table; both 2-arg and 3-arg completion overloads |
| `PRE_12_13` after P11–P12 | 32 public tables; 73 public policies; 62 direct-Auth; 67 remote functions because five legacy remote-only overloads remain (canonical clean state expects 62) |
| `RECONCILED_PRE_12_13` | canonical four `alunos` policies, no unintended anon grants, reviewed disposition of legacy overloads; exact 62/62 allowlist and 62 direct-Auth |
| `POST_12_13` | 73 public policies; zero direct-Auth; semantics/roles preserved; two admin bodies fixed |
| `PRE_12_15_2` | stabilized post-12.13 catalog, rollout still absent/OFF by definition |
| `POST_12_15_2` | private rollout schema, four private tables, OFF singleton, zero targets, `experience_origin='v1'`, canonical clean count 67 public functions (72 if five legacy overloads are retained) |

## 9. Expected delta matrix

| Object | Remote current | Introducing migration | Expected pre-12.13 | Classification |
| --- | --- | --- | --- | --- |
| workout tracking/cancellation fields | absent | P01 | present | `EXPECTED_PENDING_MIGRATION` |
| V2 workout commands | absent | P02/P03 | present, authenticated only | `EXPECTED_PENDING_MIGRATION` |
| eight direct-Auth workout policies | present | P03 removes/replaces | absent; replaced by 3 wrapped reads | `EXPECTED_PENDING_MIGRATION` |
| canonical read/Home/Library/Player/Evolution/Profile RPCs | absent | P04–P12 | present | `EXPECTED_PENDING_MIGRATION` |
| feedback/contact tables | absent | P10/P12 | present, RLS enabled | `EXPECTED_PENDING_MIGRATION` |
| four canonical `alunos` policies | absent | baseline reference, not pending chain | still absent | `PREEXISTING_DRIFT` |
| 17 current anon definer grants | present | not introduced by pending chain | 15 remain after full chain | `SECURITY_RISK / PREEXISTING_DRIFT` |
| five legacy admin overloads | present | legacy production history | still present | `PREEXISTING_DRIFT` |
| rollout schema and origin pin | absent | Cycle 12.15.2 | not present before 12.15.2 | `EXPECTED_PENDING_MIGRATION` |

## 10. Policies reconciliation

`POLICY_RECONCILIATION=MIXED`.

### 10.1 Four missing `alunos` policies

| Command | Canonical policy required by 12.13 | Remote legacy policy | Role difference | Predicate comparison | Classification |
| --- | --- | --- | --- | --- | --- |
| SELECT | `Usuarios podem listar seus alunos` | `Usuário vê apenas seus alunos` | `authenticated` vs `public` | both `auth.uid() = user_id` | `PREEXISTING_DRIFT` |
| INSERT | `Usuarios podem cadastrar seus alunos` | `Usuário cadastra seus alunos` | `authenticated` vs `public` | both check `auth.uid() = user_id` | `PREEXISTING_DRIFT` |
| UPDATE | `Usuarios podem atualizar seus alunos` | `Usuário edita seus alunos` | `authenticated` vs `public` | same ownership predicate; remote omits explicit `WITH CHECK`, so PostgreSQL reuses `USING` | `PREEXISTING_DRIFT` |
| DELETE | `Usuarios podem excluir seus alunos` | `Usuário exclui seus alunos` | `authenticated` vs `public` | both `auth.uid() = user_id` | `PREEXISTING_DRIFT` |

The canonical names and roles originate in the reference baseline `20260716090000_baseline_aruka_v1.sql`. None of P01–P12 touches `alunos` policies. `auth.uid()` is NULL for unauthenticated requests, so no anonymous row disclosure was demonstrated; nevertheless role `public` is broader than the intended contract and the names/roles deterministically fail Cycle 12.13.

### 10.2 Why 70 versus 62

The eight additional direct-Auth policies are exactly:

| Table | Policy | Pending-chain result |
| --- | --- | --- |
| `workout_execution_sessions` | `Students insert own active workout execution sessions` | dropped by P03 |
| `workout_execution_sessions` | `Students update own in progress workout execution sessions` | dropped by P03 |
| `workout_execution_exercises` | `Students write in progress workout execution exercises` | dropped by P03 |
| `workout_execution_sets` | `Students write in progress workout execution sets` | dropped by P03 |
| `workout_execution_sessions` | `Students read own workout execution sessions` | dropped by P03 |
| `workout_execution_sessions` | `Professionals read own student workout execution sessions` | dropped by P03 |
| `workout_execution_exercises` | `Authorized read workout execution exercises` | dropped and recreated wrapped by P03 |
| `workout_execution_sets` | `Authorized read workout execution sets` | dropped and recreated wrapped by P03 |

Arithmetic: `70 current direct` − `8 removed by P03` = `62 pre-12.13 direct`. P03 creates three wrapped policies; P12 creates three more wrapped policies. Therefore the 70/62 difference is `RESOLVED_BY_PENDING_CHAIN`, while the four canonical-name/role mismatches are not.

Cycle 12.13 changes only constant `auth.uid()` calls to scalar subqueries. Its postcondition normalizes the generated expression and proves authorization semantics unchanged; row-dependent helpers remain row-dependent.

## 11. SECURITY DEFINER inventory

All 17 are owned by `postgres`. Current ACL for 16 is explicit `postgres, anon, authenticated, service_role`; `renovar_aluno_contrato` additionally grants `PUBLIC`. All use `search_path=public`, except the three admin functions which use `public, auth`. API roles have USAGE but not CREATE on `public`, so no search-path privilege escalation was proven.

| # | Signature | Operation / authorization | Intended role | Risk | Pending-chain effect |
| ---: | --- | --- | --- | --- | --- |
| 1 | `public.abandon_workout_execution_session(uuid)` | write; `auth.uid()` + active student ownership | authenticated | MEDIUM | none |
| 2 | `public.admin_listar_usuarios()` | PII read; `admin_validar_acesso()` | authenticated admin/service | MEDIUM | none |
| 3 | `public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)` | subscription writes; admin guard | authenticated admin/service | MEDIUM | 12.13 replaces body but preserves anon ACL |
| 4 | `public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)` | subscription write; admin guard | authenticated admin/service | MEDIUM | none |
| 5 | `public.aoe_user_owns_student(uuid)` | boolean ownership read; NULL Auth returns false | authenticated/service helper | LOW | none |
| 6 | `public.complete_workout_execution_session(uuid)` | write; active student ownership | authenticated | MEDIUM | none |
| 7 | `public.desvincular_aluno_usuario(uuid)` | identity unlink; explicit Auth and professional ownership | authenticated | MEDIUM | none |
| 8 | `public.exercise_is_prescribed_to_current_student(uuid)` | boolean read; active student ownership | authenticated/service helper | LOW | none |
| 9 | `public.get_my_workout_execution_state(integer)` | own workout read; NULL Auth returns empty | authenticated | LOW | none |
| 10 | `public.get_student_access_state(uuid)` | student access read; explicit Auth/owner | authenticated | LOW | none |
| 11 | `public.get_student_workout_execution_history(uuid,integer)` | workout read; professional ownership | authenticated | MEDIUM | none |
| 12 | `public.manage_student_access(uuid,text,text,text)` | lifecycle write; explicit Auth/owner | authenticated | MEDIUM | none |
| 13 | `public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)` | multi-table financial write; explicit Auth/ownership | authenticated/service | MEDIUM | none; `PUBLIC` also remains |
| 14 | `public.save_workout_execution(uuid,jsonb)` | workout write; explicit Auth/active ownership | authenticated | MEDIUM | anon revoked only by Cycle 12.15.2 |
| 15 | `public.set_workout_execution_updated_at()` | trigger-only timestamp mutation | owner/internal only | LOW | none |
| 16 | `public.vincular_aluno_usuario(uuid,uuid)` | identity link; explicit Auth/ownership/role checks | authenticated | MEDIUM | none |
| 17 | `public.workout_execution_session_payload(uuid)` | reads full session/exercises/sets by caller-supplied UUID; no Auth/ownership check | owner/internal only | HIGH | anon/authenticated revoked by P03 |

No function was invoked. The HIGH rating on the payload helper is potential unauthorized disclosure when a session UUID is known; exploitability or cross-user disclosure was not tested or claimed.

Detailed metadata and repository consumer evidence:

| Signature | Return / volatility / path | Principal relations or effect | Repository caller / origin |
| --- | --- | --- | --- |
| `abandon_workout_execution_session(uuid)` | `jsonb` / VOLATILE / `public` | updates sessions; reads alunos; calls payload | `workoutExecutionService.js`; `20260822120000` |
| `admin_listar_usuarios()` | table / VOLATILE / `public, auth` | reads `auth.users`, profiles, subscriptions | `adminService.js`; `20260821120000` |
| `admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)` | `void` / VOLATILE / `public, auth` | writes subscriptions/admin log | `adminService.js`; `20260821120000` |
| `admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)` | `void` / VOLATILE / `public, auth` | writes subscriptions/admin log | `adminService.js`; `20260821120000` |
| `aoe_user_owns_student(uuid)` | `boolean` / VOLATILE / `public` | reads alunos for RLS helper | policy/internal; baseline reference |
| `complete_workout_execution_session(uuid)` | `jsonb` / VOLATILE / `public` | locks/updates session; reads sets/exercises/alunos | `workoutExecutionService.js`; `20260822120000` |
| `desvincular_aluno_usuario(uuid)` | `jsonb` / VOLATILE / `public` | clears `alunos.student_user_id` | no current `src` RPC reference; `20260730090000` |
| `exercise_is_prescribed_to_current_student(uuid)` | `boolean` / STABLE / `public` | reads prescription/workout/aluno chain | Storage/RLS helper; `20260905120000` |
| `get_my_workout_execution_state(integer)` | `jsonb` / VOLATILE / `public` | reads own aluno/session payload | `workoutExecutionService.js`; `20260822120000` |
| `get_student_access_state(uuid)` | `jsonb` / VOLATILE / `public` | reads owned aluno access fields | `studentAccessService.js`; `20260819090000` |
| `get_student_workout_execution_history(uuid,integer)` | `jsonb` / VOLATILE / `public` | reads owned student's session payloads | `workoutExecutionService.js`; `20260822120000` |
| `manage_student_access(uuid,text,text,text)` | `jsonb` / VOLATILE / `public` | updates aluno access lifecycle | service + invite Edge Function; `20260819090000` |
| `renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)` | `jsonb` / VOLATILE / `public` | writes contracts, aluno, payments, events | `alunoContratosService.js`; `20260811090000`, replaced `20260815120000` |
| `save_workout_execution(uuid,jsonb)` | `jsonb` / VOLATILE / `public` | writes execution exercises/sets/session | `workoutExecutionService.js`; `20260822120000` |
| `set_workout_execution_updated_at()` | `trigger` / VOLATILE / `public` | sets `NEW.updated_at`; no direct table query | trigger only; `20260822120000` |
| `vincular_aluno_usuario(uuid,uuid)` | `jsonb` / VOLATILE / `public` | validates profile and writes aluno identity link | no current `src` RPC reference; `20260730090000` |
| `workout_execution_session_payload(uuid)` | `jsonb` / VOLATILE / `public` | reads session, exercises and sets without caller check | internal helper; `20260822120000` |

`owner=postgres`, `SECURITY DEFINER=true`, `anon_execute=true`, `authenticated_execute=true` and `service_role_execute=true` apply to every row. `PUBLIC execute=true` applies only to `renovar_aluno_contrato(...)`; it is false for the other 16. This separates the definer property from the independently observed EXECUTE grants.

## 12. Grant origin and pending-chain effect

The remote `pg_default_acl` for `postgres` functions in `public` is:

```text
postgres=EXECUTE, anon=EXECUTE, authenticated=EXECUTE, service_role=EXECUTE
```

Therefore these are explicit grants created by hosted default ACLs, not role-membership inheritance from `PUBLIC`. Historical migrations commonly revoked only `PUBLIC`, which leaves explicit `anon` intact. `renovar_aluno_contrato` did not revoke `PUBLIC`, so it has both default PUBLIC execute and the explicit role grants.

`PENDING_CHAIN_EFFECT=PARTIALLY_RESOLVED_BY_PENDING_CHAIN`:

- P03 revokes clients from `workout_execution_session_payload(uuid)`;
- Cycle 12.15.2 revokes `anon` from `save_workout_execution(uuid,jsonb)`;
- the other 15 current exposures remain;
- 12.13 deliberately preserves the ACL of `admin_subscription_lifecycle_action(...)` and will preserve its unwanted anon grant unless reconciliation happens first;
- new pending functions generally revoke `PUBLIC/anon` in the same file, but P01/P02 rely on P03 for several revokes, which is why P01–P03 form one operational unit.

## 13. Least-privilege plan

This is planning only; no SQL is supplied for execution.

| Functions | Current client roles | Expected roles | Separate hardening | Compatibility risk |
| --- | --- | --- | --- | --- |
| admin list/lifecycle/upsert | anon, authenticated, service | authenticated + service, with admin guard | yes, before 12.13 for lifecycle ACL preservation | LOW if exact signatures retained |
| workout abandon/complete/save/state/history | anon, authenticated, service | authenticated; service only if operationally required | yes; save naturally fixed by 12.15.2 | MEDIUM; frontend RPC regression tests required |
| access/link/unlink/renewal | anon, authenticated, service; renewal also PUBLIC | authenticated; service only where documented | yes | MEDIUM; Edge Function and financial flows require regression |
| AOE/exercise helpers | anon, authenticated, service | authenticated + service | yes | LOW; RLS/storage helper tests required |
| payload/trigger helpers | anon, authenticated, service | no client execute; owner/internal only | payload fixed by P03; trigger remains | LOW for trigger, MEDIUM for indirect callers |

Future SQL must revoke both `PUBLIC` and explicit `anon`, then grant only exact intended signatures. It must not rely on `REVOKE ... FROM PUBLIC` alone in this hosted project.

## 14. Drift ledger

| ID | Object | Remote state | Would chain resolve? | Classification | Severity | Blocks chain / pilot | Treatment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DR-01 | 12 predecessor objects | absent | yes | `EXPECTED_PENDING_MIGRATION` | HIGH | chronological prerequisite / yes | stage P01–P12 |
| DR-02 | 8 workout direct-Auth policies | present | yes, P03 | `EXPECTED_PENDING_MIGRATION` | INFO | no / no after P03 | no reconciliation work |
| DR-03 | four `alunos` policies | legacy names/role public | no | `PREEXISTING_DRIFT` | HIGH | 12.13 yes / yes | forward canonical policy reconciliation |
| DR-04 | 17 anon-executable definers | present | only 2; 15 remain | `SECURITY_RISK / PREEXISTING_DRIFT` | HIGH | approved disposition / yes | signature-specific least privilege |
| DR-05 | payload helper anon/authenticated | no caller auth check | yes, P03 | `SECURITY_RISK` | HIGH | P01–P03 inseparable / yes until P03 | validate revocation immediately after P03 |
| DR-06 | five legacy admin overloads | remote-only, service-role ACL | no | `PREEXISTING_DRIFT` | MEDIUM | no SQL blocker / blocks exact canonical count | external-consumer review; later deprecation or documented retention |
| DR-07 | rollout objects | absent | yes, 12.15.2 | `EXPECTED_PENDING_MIGRATION` | INFO | expected / yes until applied | do not reconcile early |
| DR-08 | leaked-password protection | disabled advisor finding | no | `SECURITY_RISK` | MEDIUM | no / yes before broader GO | separate Auth decision |

The five remote-only overloads are the shorter signatures of `admin_atualizar_perfil`, `admin_bloquear_usuario`, `admin_liberar_assinante`, `admin_liberar_beta` and `admin_upsert_assinatura`. They are service-role-only in the current snapshot and are not among the 17 anon findings.

## 15. Reconciliation decision

| Question | Decision |
| --- | --- |
| `CHAIN_CAN_APPLY_AS_AUTHORED` | `NO` |
| `RECONCILIATION_MIGRATION_REQUIRED_BEFORE_CHAIN` | `NO` — P01–P12 can precede it |
| `RECONCILIATION_REQUIRED_BEFORE_12_13` | `YES` |

Minimum future reconciliation scope:

1. replace/rename the four legacy `alunos` policies with the canonical name, command, role and equivalent ownership predicates;
2. revoke unintended `anon` and `PUBLIC` EXECUTE by full signature, restoring documented authenticated/service roles;
3. decide whether the five legacy overloads are retained with explicit compatibility documentation or removed after consumer evidence;
4. assert exactly 62/62 Cycle 12.13 policies, 62 direct-Auth policies, expected function ACLs and the approved function count before scheduling 12.13.

No reconciliation migration was created in this mission.

## 16. Execution segmentation

| Window | Migrations | Preconditions | Lock / active-session requirement | Validation / stop condition | Recovery |
| --- | --- | --- | --- | --- | --- |
| A | P01–P03 | exact history prefix; integrity aggregates zero; backup/PITR; low traffic | HIGH/MEDIUM; pause new starts preferred; existing V1 session may remain; do not stop after P01/P02 | columns/constraints, 4 commands, grants, 70 policies and 62 direct; stop on any partial state | transactional rollback if runner guarantees it; otherwise forensic stop/forward repair |
| B | P04–P06 | Window A stable | MEDIUM from indexes; active session tolerated | canonical read signatures and auth grants; V1 reads/writes smoke | forward fix; keep V1 |
| C | P07–P10 | B stable; Player function chain exact | MEDIUM; active V1 session tolerated; V2 not remotely active | final Player payload, feedback table, 2 completion overloads | forward function restore/fix |
| D | P11–P12 | C stable | MEDIUM for new table/policies; active session tolerated | evolution/profile/contact contracts; 73 public policies, 62 direct | forward fix |
| E | future reconciliation | P01–P12 stable; consumer review; approved exact ACL matrix | MEDIUM; no zero-session requirement from policy/ACL work, but low traffic | 62/62 allowlist; 62 direct; zero unintended anon; approved function count | reviewed compensating migration |
| F | Cycle 12.13 | E exact preconditions; separate approval | HIGH across 24 tables; low traffic; no long transactions | zero direct Auth; 62 semantic equivalents; ACL metadata preserved | transaction rollback or reviewed compensation |
| G | Cycle 12.15.2 | F stable; second approval; rollout OFF/zero targets | HIGH on session table; existing session allowed and must become V1 | private ACLs, OFF singleton, zero targets, `experience_origin`, function count | no frontend deploy; forward fix with rollout OFF |

`Expected duration=UNAVAILABLE` for all windows. Human approval, backup/PITR evidence, timeout budgets, monitoring and stop authority are mandatory for every window.

## 17. Active-session safety

One aggregate `in_progress` session still exists.

- P01 changes session constraints/columns but the current rows have zero observed status/date violations.
- P02/P03 retain legacy V1 RPCs; P03 removes direct table mutation paths but the frontend uses RPCs.
- P04–P12 are additive reads/tables/function replacements and do not rewrite an active session.
- Cycle 12.15.2 assigns the constant default `experience_origin='v1'`, which is the intended classification for pre-existing sessions.
- None of this proves lock-free execution. A low-traffic window and pause on new starts is recommended for Window A and required operationally for F/G.
- Zero active sessions is not a demonstrated technical prerequisite for P01–P12. It remains the safest optional gate for Cycle 12.15.2 if operations chooses it.

## 18. Lock and performance analysis

- P01: strong relation locks for column/constraint changes; check validation; two non-concurrent indexes. `HIGH`.
- P03: table privilege changes and policy replacement on three workout tables. `MEDIUM`.
- P04/P05: non-concurrent partial indexes. `MEDIUM`.
- P10/P12: new table/catalog/policy operations with little existing-row contention. `MEDIUM`.
- Function-only migrations: catalog/function locks. `LOW`.
- Cycle 12.13: 62 policy alterations across 24 tables in one transaction. `HIGH`; waiting on one relation can retain earlier locks.
- Cycle 12.15.2: strong lock for `experience_origin` and check validation, plus function signature replacement. `HIGH`.

PostgreSQL 17 can optimize constant-default column addition without a table rewrite, but lock acquisition and constraint validation still occur. Relation sizes do not predict wait time. No duration is inferred.

## 19. QA and evidence

| Validation | Result | Evidence |
| --- | --- | --- |
| Git baseline | PASS | branch/HEAD/origin exact; initial tree clean |
| All active migrations scanned | PASS | 39 SQL files; statement/object/security inventory |
| Pending files read in full | PASS | 14/14 |
| Remote identity/read-only | PASS | project metadata; `transaction_read_only=on` |
| Remote history | PASS as inventory | exact 25-version prefix; 14 pending |
| Remote snapshot freshness | PASS | 2026-10-04 timestamps; central counts unchanged |
| P01 data preconditions | PASS as aggregate check | 3 sessions; zero invalid status/date combinations |
| Four `alunos` policies | PASS as discovery / NO_GO as readiness | exact legacy definitions captured |
| 70 versus 62 | PASS | exact eight P03 policies enumerated |
| 17 definer functions | PASS as inventory / findings remain | full signatures, definitions, ACLs and default ACL captured |
| Function chain count | PASS as analysis | +18 predecessor functions, +5 rollout net, five remote-only overloads explain 72 vs clean 67 |
| Supabase CI static | PASS | 39 active migrations; 457 Node files; 8 PowerShell files; 31 JSON reports |
| Cycle 12.15.2 unit regression | PASS | 24/24 |
| Cycle 12.15.4 evidence JSON | PASS | parsed successfully |
| Local Supabase runtime | `NOT_EXECUTED_UNAVAILABLE` | status command exited nonzero; no start/reset attempted |
| Remote mutations | NOT EXECUTED | prohibited |

Local runtime migration replay was unavailable and was not used as proof of production state. Preserved clean-bootstrap evidence remains 39 executable migrations, 32 public tables, 73 public policies and 67 public functions.

## 20. Findings

| ID | Severity | Classification | Chain blocker | 12.13 / 12.15.2 / pilot | Recommendation | Owner |
| --- | --- | --- | --- | --- | --- | --- |
| C12.15.4-CHAIN-01 | HIGH | `EXPECTED_PENDING_MIGRATION` | chronological | prerequisite / prerequisite / yes | stage P01–P12 in four windows | DBA + app |
| C12.15.4-RLS-01 | HIGH | `PREEXISTING_DRIFT` | full chain yes | yes / indirect / yes | canonicalize four `alunos` policies before 12.13 | DBA + security |
| C12.15.4-RLS-02 | INFO | `EXPECTED_PENDING_MIGRATION` | no | no after P03 / no / no | no artificial reconciliation for eight workout policies | DBA |
| C12.15.4-SEC-01 | HIGH | `SECURITY_RISK` | approved disposition | ACL preserved / no / yes | signature-specific grant reconciliation | security + DBA |
| C12.15.4-SEC-02 | HIGH | `SECURITY_RISK` | Window A coupling | before P03 / no / yes | keep P01–P03 inseparable; validate payload ACL | security + DBA |
| C12.15.4-DRIFT-01 | MEDIUM | `PREEXISTING_DRIFT` | no SQL failure | no / exact count / yes pending decision | review five legacy overload consumers | app + DBA |
| C12.15.4-OPS-01 | MEDIUM | operational | no | no / yes / yes | approve windows/timeouts/PITR and observe active session | operations |
| C12.15.4-QA-01 | LOW | limitation | no | no / no / no | rerun ephemeral clean bootstrap immediately before writes | QA/platform |

## 21. Human decisions required

1. Approve a separate implementation mission for the minimal forward reconciliation.
2. Approve the exact intended roles for every one of the 17 signatures.
3. Decide retention or deprecation of five service-role-only legacy overloads after external-consumer review.
4. Approve backup/PITR evidence, lock/statement timeouts, window owners and stop authority.
5. Approve Windows A–G separately; do not treat this discovery as deployment authorization.
6. Decide leaked-password protection in a separate Auth/security change.

## 22. Known limitations

- No migration was executed remotely or locally against production data.
- No authenticated end-user smoke or mutable RPC test was permitted.
- Remote lock/session facts are point-in-time only.
- Function exploitability was not tested; risk ratings combine callable surface, body authorization and potential impact.
- External consumers of legacy overloads are not observable from repository references alone.
- Duration and traffic thresholds remain unavailable and require human approval.

## 23. Explicit non-actions and safety confirmation

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

## 24. Next stage

Proposed next stage: a separately authorized `CYCLE_12_15_5_FORWARD_RECONCILIATION_IMPLEMENTATION` limited to repository changes and ephemeral/local verification. It should create, but not remotely apply, the minimum reconciliation migration described in section 15 and its catalog/authorization regression tests. Remote execution planning remains a later mission.

## 25. Resume contract

If resumed after any repository or remote change, recheck branch/HEAD/worktree, project identity, migration history, the four policy definitions, direct-Auth count, all 17 ACLs/default ACLs, five legacy overloads, aggregate session/lock state and rollout OFF state. Do not reuse this readiness decision after a schema, grant, Auth or deployment change.
