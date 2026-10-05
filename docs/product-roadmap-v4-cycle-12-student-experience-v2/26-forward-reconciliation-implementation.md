# Cycle 12.15.5 — Forward reconciliation implementation

## 1. Decision

`IMPLEMENTATION_COMPLETE_READY_FOR_HUMAN_REVIEW`

The forward-only implementation, clean bootstrap, policy behavior, function ACLs, default ACL, logical pre-12.13 sequence, and Cycles 12.13/12.15.2 compatibility are locally proven. Production remains `NO_GO` because the repository's physical migration order cannot execute the reconciliation before Cycle 12.13 on the observed remote prefix.

## 2. Baseline and safety boundary

| Item | Result |
| --- | --- |
| Branch | `main` |
| HEAD | `388614565052df5f39d811bb07299e4d0a5f22a5` |
| `origin/main` | `388614565052df5f39d811bb07299e4d0a5f22a5` |
| Docker context | `desktop-linux` |
| Local project | `ConsultoriaFitness` |
| Local database/API | `127.0.0.1:54322` / `127.0.0.1:54321` |
| Remote target arguments | absent |
| Rollout | `OFF` |

No remote connection or mutation, deploy, cohort change, rollout activation, migration-history repair, or Git publication occurred.

## 3. Reconciliation artifact

Migration: `supabase/migrations/20261004133801_cycle12_forward_schema_security_reconciliation.sql`.

It is one explicit transaction. Preconditions reject unknown policy state and missing/drifted function metadata before persistent DDL. It accepts the observed legacy `alunos` state or the canonical clean-bootstrap state, canonicalizes only legacy policies, reconciles exact full-signature ACLs for 17 `SECURITY DEFINER` functions, and hardens function default privileges globally and for schema `public`.

The five remote-only administrative overloads remain `DEFERRED_HUMAN_DECISION`; no function is dropped and `CASCADE` is absent.

## 4. Policy reconciliation

| Command | Legacy | Canonical | Final role |
| --- | --- | --- | --- |
| SELECT | `Usuário vê apenas seus alunos` | `Usuarios podem listar seus alunos` | `authenticated` |
| INSERT | `Usuário cadastra seus alunos` | `Usuarios podem cadastrar seus alunos` | `authenticated` |
| UPDATE | `Usuário edita seus alunos` | `Usuarios podem atualizar seus alunos` | `authenticated` |
| DELETE | `Usuário exclui seus alunos` | `Usuarios podem excluir seus alunos` | `authenticated` |

Ownership remains `auth.uid() = user_id`; UPDATE gains an explicit matching `WITH CHECK`. Access is narrowed from `public` to `authenticated`.

## 5. SECURITY DEFINER matrix

All rows deny `anon` and `PUBLIC`; owner is `postgres`; `SECURITY DEFINER` and constrained `search_path` metadata were catalog-verified.

| Signature | authenticated | service_role |
| --- | ---: | ---: |
| `abandon_workout_execution_session(uuid)` | yes | no |
| `admin_listar_usuarios()` | yes | yes |
| `admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)` | yes | yes |
| `admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)` | yes | yes |
| `aoe_user_owns_student(uuid)` | yes | yes |
| `complete_workout_execution_session(uuid)` | yes | no |
| `desvincular_aluno_usuario(uuid)` | yes | no |
| `exercise_is_prescribed_to_current_student(uuid)` | yes | yes |
| `get_my_workout_execution_state(integer)` | yes | no |
| `get_student_access_state(uuid)` | yes | no |
| `get_student_workout_execution_history(uuid,integer)` | yes | no |
| `manage_student_access(uuid,text,text,text)` | yes | no |
| `renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)` | yes | yes |
| `save_workout_execution(uuid,jsonb)` | yes | no |
| `set_workout_execution_updated_at()` | no | no |
| `vincular_aluno_usuario(uuid,uuid)` | yes | no |
| `workout_execution_session_payload(uuid)` | no | no |

The payload helper has no client grants and an empty `search_path`; the trigger helper is likewise owner/internal only.

## 6. Default ACL

The initial implementation revoked client EXECUTE only in schema `public`. The runtime probe correctly failed because PostgreSQL combines schema-specific default ACLs with the global built-in PUBLIC EXECUTE default; a schema-local revoke cannot subtract that global grant.

The final migration therefore:

- revokes default function EXECUTE from global `PUBLIC` for role `postgres`; and
- revokes schema-`public` defaults from `anon`, `authenticated`, and `service_role`.

A rollback-only function creation proved that a future `postgres` function in `public` grants no client EXECUTE unless its own migration explicitly grants it.

## 7. Clean bootstrap

The first full bootstrap found PL/pgSQL variable/alias shadowing in a postcondition (`expected.canonical_name`). The transaction aborted, proving atomicity: no partial policy or ACL reconciliation persisted. SQL aliases were made unambiguous.

The corrected clean bootstrap passed:

```text
REFERENCE_BASELINE_VALIDATED=YES
EXECUTABLE_MIGRATION_COUNT=40
EPHEMERAL_BOOTSTRAP_MIGRATION_COUNT=41
EPHEMERAL_BOOTSTRAP_ORDER=PASS
BASE_SCHEMA_OBJECTS_PRESENT=YES
WORKOUT_DELIVERY_MIGRATION_ON_FRESH_DB=PASS
BOOTSTRAP_TEMP_BASELINE_PRESENT_AFTER_RUN=NO
LOCAL_BOOTSTRAP_OK
```

The 41-entry ephemeral chain is the reference baseline plus 40 executable migrations.

## 8. Policy runtime proof

Inside a rollback-scoped fixture, two synthetic authenticated users and two students proved:

- the owner sees exactly its own student;
- a cross-user update changes zero rows;
- a cross-user delete has no effect;
- owner visibility remains one row; and
- `anon` is denied at the table privilege boundary, which is stronger than an RLS zero-row result.

Result: `CYCLE_12_15_5_RUNTIME_POLICIES=PASS`.

## 9. Canonical 62/62 proof

The logical rehearsal reset the local database exactly through P12, reproduced the four recorded legacy policies and hosted ACL drift, and confirmed 62 direct-Auth policies. Reconciliation produced the four canonical names/roles one-for-one while retaining the exact 62 count.

Cycle 12.13 then accepted its complete allowlist and ran successfully: `CANONICAL_ALLOWLIST_12_13=62/62`.

After Cycle 12.13, the global catalog contains 69 optimized `SELECT auth.uid()` expressions: the 62 allowlisted expressions transformed by Cycle 12.13 plus 7 expressions already optimized by earlier migrations. The number 69 is not the allowlist size.

## 10. Logical pre-12.13 rehearsal

The reproducible validator `scripts/validate-cycle-12-15-5-logical-order.mjs` uses pinned CLI 2.109.1, isolated CLI home, explicit `db reset --local --version 20260921010053`, local guards, and an ephemeral migration workdir.

It passed this sequence:

```text
P01–P12 → recorded drift fixture → reconciliation → Cycle 12.13 → Cycle 12.15.2
```

It asserts 62/62 before and through Cycle 12.13, 73 public policies, zero remaining direct-Auth expressions, 69 globally optimized expressions, 17 anonymous ACL removals, four private rollout tables, default-OFF singleton, zero rollout targets, and `experience_origin='v1'`.

Its `finally` block restored the official physical chain successfully.

## 11. Cycle 12.13 compatibility

PASS:

- static allowlist and 62 altered policies;
- zero unexpected altered policies and zero public direct-Auth policies;
- NULL equivalence, `INITPLAN`, migration history, and definer metadata;
- core ownership and AOE authorization matrices;
- admin wrapper and seven lifecycle actions;
- explicit non-admin and anonymous denial.

## 12. Cycle 12.15.2 compatibility

PASS:

- 24/24 unit tests;
- decision, pinning, private-config access, and admin-audit matrices;
- start race with one session and pinned `origin=v1`;
- coexistence, concurrent resume/set/completion, and cancellation-versus-completion matrices;
- rollout remained `OFF` with zero targets.

## 13. Final regression

| Gate | Result |
| --- | --- |
| Cycle 12.15.5 static/runtime | PASS |
| Supabase CI static | PASS — 459 Node, 8 PowerShell, 31 harness JSON |
| Migration inventory | PASS — 40 executable, one reference baseline |
| JSON validation | PASS |
| Changed-scope secret scan | PASS |
| ESLint | PASS |
| Vite production build | PASS |
| `git diff --check` | PASS |

## 14. Findings

| ID | Severity | Status | Finding / action |
| --- | --- | --- | --- |
| `C12.15.5-MIG-01` | HIGH | OPEN BLOCKER | physical order cannot satisfy the observed production prefix; design separate deterministic procedure |
| `C12.15.5-RLS-01` | HIGH | RESOLVED LOCALLY | four policy reconciliation and 62/62 runtime proof pass |
| `C12.15.5-SEC-01` | HIGH | RESOLVED LOCALLY | exact 17-function runtime matrix passes |
| `C12.15.5-SEC-02` | HIGH | RESOLVED LOCALLY | global PUBLIC plus schema client default ACLs hardened and probed |
| `C12.15.5-QA-01` | MEDIUM | RESOLVED | Docker `desktop-linux` restored; clean bootstrap/runtime pass |
| `C12.15.5-MIG-02` | MEDIUM | DEFERRED | five remote-only overloads require external-consumer and financial review |
| `C12.15.5-OPS-01` | HIGH | OPEN BLOCKER | production execution/recovery runbook not yet authorized or rehearsed |

## 15. Ordering blocker

Physical repository order:

```text
P01–P12 → Cycle 12.13 → Cycle 12.15.2 → reconciliation
```

Required production logical order:

```text
P01–P12 → reconciliation → Cycle 12.13 → Cycle 12.15.2
```

The rehearsal proves SQL-state compatibility only. It does not authorize an out-of-order production application or migration-history registration. Historical files/versions were not renamed or edited; migration repair and `db push` were not run.

## 16. GO/NO-GO

```text
LOCAL_IMPLEMENTATION=PASS
POLICY_RECONCILIATION=PASS
SECURITY_DEFINER_RECONCILIATION=PASS_WITH_DEFERRED_OVERLOADS
LEGACY_OVERLOAD_RECONCILIATION=DEFERRED
CLEAN_BOOTSTRAP=PASS
CYCLE_12_13_COMPATIBILITY=PASS
CYCLE_12_15_2_COMPATIBILITY=PASS
PRODUCTION_UPGRADE_PATH=NO_GO
REMOTE_MIGRATION_READINESS=NO_GO
PRODUCTION_GO=NO_GO
```

## 17. Historical limitation

The first session ended with `RUNTIME_UNAVAILABLE`, `CLEAN_BOOTSTRAP=NOT_EXECUTED_UNAVAILABLE`, and `CYCLE_12_13_COMPATIBILITY=UNKNOWN` because the Docker server/context was unavailable in that environment. Those labels describe only that earlier evidence boundary; after runtime restoration they were replaced by the PASS results above.

## 18. Next stage

Conduct a separate human/DBA-reviewed production upgrade-path design. It must specify deterministic ordering, exact migration-history treatment, preconditions, rollback/recovery, failure interruption points, and a faithful rehearsal. Keep all remote and production gates at `NO_GO` until that work is explicitly approved and completed.
