# Cycle 12.15.7 — production readiness final gate

## 1. Objetivo

Determinar, com evidência reproduzível e sem escrita remota, se produção e o caminho staged de upgrade estão prontos. Resultado: `PRODUCTION_READINESS=NO_GO`; autorização continua independente e ausente: `PRODUCTION_EXECUTION_AUTHORIZED=NO`.

## 2. Escopo

Inclui baseline Git/local, novo snapshot remoto read-only, inventário de migrations, schema/RLS/policies/functions/ACL, cinco overloads legados, recovery, freeze, rehearsal local production-equivalent, manifests, abort matrix, checklist e QA. Exclui qualquer migration, repair, deploy, mudança de configuração, backup/restore ou rollout remoto.

## 3. Baseline

```text
BRANCH=main
HEAD=55849cb281532efa8c549970f2af1130d2aa3717
ORIGIN_MAIN=55849cb281532efa8c549970f2af1130d2aa3717
DIVERGENCE=0/0
WORKTREE_INITIAL=clean
WORKTREES=1
EXECUTABLE_MIGRATIONS=40
MIGRATION_HISTORY_COUNT_WITH_REFERENCE_BASELINE=41
LATEST_MIGRATION=20261004133801_cycle12_forward_schema_security_reconciliation.sql
LOCAL_SUPABASE_STATE=RUNNING_HEALTHY
GATE_0=PASS
```

Não havia worktree adicional nem artefato temporário da 12.15.6. O secret scan inicial encontrou apenas dois JWTs públicos de demonstração da stack local e um placeholder `...` de documentação; nenhum secret de produção foi encontrado.

## 4. Remote read-only snapshot

Capturado em `2026-10-05T23:10:54.342572Z` pelo conector Supabase com operações `get/list` e consultas exclusivamente `SELECT`.

```text
REMOTE_PROJECT=aruka
REMOTE_PROJECT_REF=vrizeuhuhvtvbrmtvdik
REMOTE_REGION=us-east-2
REMOTE_STATUS=ACTIVE_HEALTHY
REMOTE_POSTGRES_VERSION=17.6.1.127
REMOTE_MIGRATION_COUNT=25
REMOTE_LAST_MIGRATION=20260909110000_smart_management_services_pricing_v1
LOCAL_EXECUTABLE_COUNT=40
PENDING_COUNT=15
UNEXPECTED_REMOTE=0
MISSING_LOCAL=0
REMOTE_DRIFT_CHANGED=NO
GATE_1=PASS
```

`transaction_read_only=off`, logo a credencial não é tecnicamente restrita a leitura; a segurança foi operacional: nenhum método de mutation foi chamado e toda SQL enviada começou por `SELECT`/`WITH ... SELECT`.

## 5. Migration inventory

As primeiras 25 versões locais, de `20260728030000` a `20260909110000`, estão `APPLIED` e formam prefixo exato. Não existe `UNEXPECTED_REMOTE`, `MISSING_LOCAL` ou `DIVERGENT`.

| Logical order | Version/name | Status |
| ---: | --- | --- |
| 1 | `20260914130000_cycle12_execution_tracking_and_safety` | PENDING |
| 2 | `20260914131000_cycle12_execution_commands` | PENDING |
| 3 | `20260914132000_cycle12_completion_and_grants` | PENDING |
| 4 | `20260914185833_cycle12_canonical_execution_reads` | PENDING |
| 5 | `20260915014848_cycle12_student_home_v2` | PENDING |
| 6 | `20260915140229_cycle12_student_training_library_v2` | PENDING |
| 7 | `20260915201101_cycle12_workout_player_v2` | PENDING |
| 8 | `20260919120000_cycle12_set_tracking_player_payload` | PENDING |
| 9 | `20260919231657_cycle12_rest_timer_server_clock` | PENDING |
| 10 | `20260920104727_cycle12_workout_completion_feedback` | PENDING |
| 11 | `20260920144904_cycle12_student_evolution_v2` | PENDING |
| 12 | `20260921010053_cycle12_profile_secondary_flows` | PENDING |
| 13 | `20261004133801_cycle12_forward_schema_security_reconciliation` | PENDING, staged before 12.13 |
| 14 | `20260926174027_cycle12_schema_rls_hardening` | PENDING |
| 15 | `20261003163830_cycle12_controlled_rollout_foundation` | PENDING |

Ordem física permanece P01–P12 → 12.13 → 12.15.2 → reconciliation; ordem lógica necessária permanece P01–P12 → reconciliation → 12.13 → 12.15.2.

## 6. Schema/security snapshot

```text
PUBLIC_TABLES=30
PUBLIC_TABLES_WITH_RLS=30
PUBLIC_FUNCTION_SIGNATURES=49
PUBLIC_POLICIES=75
DIRECT_AUTH_UID_POLICIES=70
OPTIMIZED_AUTH_UID_POLICIES=1
SECURITY_DEFINER_FUNCTIONS=40
ANON_EXECUTABLE_SECURITY_DEFINER=17
PRIVATE_SCHEMA_PRESENT=NO
ROLLOUT_OBJECTS_PRESENT=NO
LEGACY_ALUNOS_POLICIES=4
GATE_2=PASS
```

O advisor oficial confirmou as mesmas 17 exposições anônimas de `SECURITY DEFINER` conhecidas. Esse é o baseline pré-reconciliation esperado, não uma aceitação permanente: a reconciliation provou localmente a revogação `17/17`. Há também warning independente de leaked-password protection desabilitada; não altera o ordering, mas deve entrar em hardening futuro.

## 7. Cinco legacy overloads

Todos pertencem a `postgres`, são `SECURITY DEFINER`, usam `search_path=public, auth`, têm `EXECUTE` somente para `postgres` e `service_role`, e negam `PUBLIC`, `anon` e `authenticated`. `pg_depend` não registra chamadas PL/pgSQL internas; dependências abaixo vieram dos bodies obtidos read-only. O app atual envia `p_user_agent` (e campos adicionais no upsert), portanto chama overloads modernos, não estes legados.

| Signature | Dependencies/body summary | Repo usage | Risk | Recommendation |
| --- | --- | --- | --- | --- |
| `admin_atualizar_perfil(uuid,text,text,text,text)` | validates admin; reads `auth.users`; upserts `perfis` | no legacy-signature caller | privileged compatibility; external caller unknown | `REMOVE_IN_FUTURE_CONTROLLED_CHANGE` |
| `admin_bloquear_usuario(uuid)` | validates admin/self-block; reads `auth.users`; upserts `perfis` | no legacy-signature caller | privileged compatibility; external caller unknown | `REMOVE_IN_FUTURE_CONTROLLED_CHANGE` |
| `admin_liberar_assinante(uuid,text,date,date)` | validates admin; calls two legacy overloads | no legacy-signature caller | privileged financial chain | `NEEDS_HUMAN_DECISION` |
| `admin_liberar_beta(uuid)` | validates admin; reads `auth.users`; upserts `perfis` | no legacy-signature caller | privileged compatibility; external caller unknown | `REMOVE_IN_FUTURE_CONTROLLED_CHANGE` |
| `admin_upsert_assinatura(uuid,text,text,date,date)` | validates admin; reads `auth.users`; inserts/updates `assinaturas` | no legacy-signature caller | privileged financial mutation | `NEEDS_HUMAN_DECISION` |

Para cada item: `REMOTE_EXISTS=YES`, `LOCAL_EQUIVALENT=MODERN_OVERLOAD`, `OWNER=postgres`, `SECURITY_MODE=DEFINER`, `PUBLIC_EXECUTE=NO`, `ANON_EXECUTE=NO`, `AUTHENTICATED_EXECUTE=NO`, `SERVICE_ROLE_EXECUTE=YES`, `APPARENT_USAGE=NONE_IN_CURRENT_REPO`. Manter não interfere na cadeia, reconciliation, rollback ou invariants; remover sem inventário externo pode quebrar automação privada. `OVERLOAD_DECISION=DEFERRED_NON_BLOCKING`; `GATE_3=PASS_WITH_HUMAN_DECISION_REQUIRED`.

## 8. Backup, PITR e recovery readiness

Evidência específica: a organização `ztjgxtihdeeajbpfxlra` retornou `plan=free`, `tier=tier_free`. A documentação oficial consultada nesta data informa backups diários gerenciados para Pro/Team/Enterprise e PITR como add-on de planos pagos. O conector não expõe listagem de backups, e não há PAT/credencial local de Management API. Não existe artefato de backup lógico atual nem restore drill.

```text
BACKUP_CAPABILITY=MANUAL_LOGICAL_EXPORT_ONLY_NOT_PROVEN
BACKUP_STATUS=UNKNOWN_NOT_OBSERVABLE
PITR_CAPABILITY=NOT_AVAILABLE_ON_CURRENT_PLAN
PITR_ENABLED=NO_EVIDENCE_AND_NOT_AVAILABLE_ON_CURRENT_PLAN
RETENTION_WINDOW=UNKNOWN_NOT_OBSERVABLE
LATEST_RECOVERY_POINT=UNKNOWN_NOT_OBSERVABLE
RESTORE_CAPABILITY=NOT_PROVEN
RESTORE_PROCEDURE_DOCUMENTED=YES
RESTORE_DRILL_EVIDENCE=NO
RPO=UNVERIFIED
RTO=UNVERIFIED
BACKUP_RECOVERY_READINESS=UNVERIFIED
GATE_4=NO_GO
```

Para mudar o gate: fornecer evidência datada e específica de backup utilizável/restore point, retenção e integridade; executar restore em ambiente isolado; registrar duração, validações de history/schema/dados críticos e RTO/RPO aprovado. Capacidade de produto, por si, não basta.

## 9. Maintenance e write freeze

```text
APPLICATION_WRITE_FREEZE=YES
LOGIN_FREEZE=YES
BACKGROUND_JOB_FREEZE=YES
DEPLOY_FREEZE=YES
MIGRATION_FREEZE=YES
FREEZE_PLAN=PASS
GATE_5=PASS
```

O freeze cobre do fingerprint pré-A até validação pós-C: bloquear writers/login; pausar jobs administrativos, cron e integrações; bloquear deploys e migrations manuais/CI; nomear incident commander, DBA/operator e reviewer; registrar início/fim UTC e change ticket. Abortar se houver write, deploy, migration concorrente, perda de operador/recovery, drift, timeout da janela ou fingerprint diferente. Reabrir somente após history 40, dry-run 0, segurança final, health/smoke e rollout OFF. Nenhum freeze foi ativado nesta missão.

## 10. Production-equivalent rehearsal

Executado localmente sem dados pessoais e com cinco bodies remotos representados por stubs apenas no baseline descartável. O gap não afeta ordering porque as migrations pendentes não removem esses overloads.

```text
REMOTE_EQUIVALENT=PASS_WITH_DOCUMENTED_BODY_STUB_GAP
WINDOW_A=P01_P03_PASS
WINDOW_B=P04_P06_PASS
WINDOW_C=P07_P10_PASS
WINDOW_D=P11_P12_PASS
WINDOW_E_RECONCILIATION=PASS
CANONICAL_ALUNOS_POLICIES=4/4
CANONICAL_POLICY_ALLOWLIST=62/62
DIRECT_AUTH_UID_POLICIES_BEFORE_12_13=62
SECURITY_DEFINER_ACL_MATRIX=17/17
ANON_PUBLIC_DENIED=17/17
DEFAULT_ACL_RUNTIME_PROOF=PASS
WINDOW_F_12_13=PASS
DIRECT_AUTH_UID_POLICIES_AFTER_12_13=0
CANONICAL_ALLOWLIST_TRANSFORMED=62/62
GLOBAL_OPTIMIZED_POLICY_EXPRESSIONS=69
WINDOW_G_12_15_2=PASS
ROLLOUT_ENABLED=false
EMERGENCY_BLOCK=false
REAL_TARGETS=0
HAPPY_PATH_REHEARSAL=PASS
RECOVERY_REHEARSAL=PASS
GATE_6=PASS
```

## 11. Manifest A/B/C

Hash: SHA-256 sobre linhas ordenadas `filename:file_sha256`, terminadas por newline. Arquivos são cópias byte-for-byte; nenhum histórico foi renomeado/editado.

| Manifest | Contents | Count | SHA-256 | Result |
| --- | --- | ---: | --- | --- |
| A | remote 25 + P01–P12 | 37 | `434fbe1f82b28bdcf080f532784ec084e53127570cd7587f2be937fa639d4e3a` | PASS |
| B | A + reconciliation, sem 12.13/12.15.2 | 38 | `de81dd3dc03540ecf84104a6240d2e5041556f82c8852a41d0ede3af35a4b8ed` | PASS |
| C | cadeia física completa | 40 | `2ad052c30f1b9bae8e10fd3c33ad4ba62df95e45e1ffc601654ce142b5dc0150` | PASS |

Reconciliation SHA-256: `d15b85c13b9b72e67e10df7a3a40a20d7cdd14dba27937181820a0daca4e1708`. A não incluiu 12.13/12.15.2; B adicionou só reconciliation; C com `--include-all` reconheceu 12.13 e 12.15.2 e convergiu a history 40. `EXPECTED_NEXT_DRY_RUN_AFTER_SUCCESS=0`; `GATE_7=PASS`.

## 12. Failure matrix

| ID | Detection / abort | Safe state | Recovery / retry / escalation |
| --- | --- | --- | --- |
| F1 before A | preflight/freeze incomplete | production unchanged | abort; retry after all gates; incident commander |
| F2 during P01–P03 | error/history missing version | transactional rollback for failing migration | validate fingerprint; retry missing atomic version; DBA if uncertain |
| F3 after P03/before P04 | checkpoint history/ACL | history through P03, exposure closed | maintain freeze; resume P04 after sign-off |
| F4 P12→reconciliation | history 37/direct-auth 62 | known pre-reconciliation fingerprint | maintain freeze; resume reconciliation only |
| F5 reconciliation fails | pre/postcondition or absent history | transaction rolled back | do not repair; diagnose known drift; retry only after review |
| F6 12.13 fails | absent history/direct-auth unchanged | reconciliation remains applied | maintain freeze; resolve exact precondition; retry; restore if atomicity uncertain |
| F7 12.15.2 fails | absent history/private absent | 12.13 remains applied | retry atomic migration after validation; restore if unknown |
| F8 history/schema divergence | dry-run/schema mismatch | freeze, no normalization | stop; repair only future DBA-approved recovery after schema proof |
| F9 recovery unavailable | backup/restore preflight fails | before first write if checked correctly | abort window; human recovery owner |
| F10 freeze unavailable | observed writes/login/jobs | no migration starts | abort; reschedule with owners |
| F11 concurrent migration | lock/history/log evidence | freeze and preserve evidence | abort; identify owner; re-snapshot |
| F12 rollout not OFF | config/emergency/targets mismatch | no upgrade begins | abort; separate authorized remediation |

All scenarios have explicit detection, abort, safe state, recovery, retry and human escalation. `GATE_8=PASS`. Nenhum recovery remoto foi executado.

## 13. Pre-execution checklist

FUTURE_EXECUTION_ONLY — DO NOT RUN IN THIS MISSION

- [ ] exact production project ref is `vrizeuhuhvtvbrmtvdik`
- [ ] exact expected remote history is 25 through `20260909110000`
- [ ] unexpected remote migrations = 0
- [ ] missing local migrations = 0
- [ ] schema/security snapshot matches approved baseline
- [ ] backup/recovery evidence is project-specific and approved
- [ ] latest recovery point and retention are acceptable
- [ ] restore drill establishes acceptable RTO/RPO
- [ ] maintenance window is active with start/end UTC
- [ ] migration and deploy freezes are active
- [ ] background jobs and manual DB changes are frozen
- [ ] application writes and login are frozen
- [ ] incident commander, operator/DBA and reviewer are available
- [ ] Manifest A hash equals `434fbe1f…d4e3a`
- [ ] Manifest B hash equals `de81dd3d…4b8ed`
- [ ] Manifest C hash equals `2ad052c3…c0150`
- [ ] reconciliation SHA-256 equals `d15b85c1…e1708`
- [ ] rollout OFF, emergency false, real targets 0
- [ ] no concurrent migration/deploy/write
- [ ] F1–F12 abort criteria understood by two humans
- [ ] post-window history/security/health validation prepared
- [ ] explicit human execution authorization recorded

Safe read-only commands: `git rev-parse HEAD`, `git status --short`, `git diff --check`, `npm run qa:cycle12:15:7`. Any future production push belongs to a separately authorized mission. `GATE_9=PASS`.

## 14. QA

Required suites were executed from the exact baseline plus these unstaged 12.15.7 artifacts. Passed: CI bootstrap ports, preflight/bootstrap/validate, local reproducibility, clean-worktree wrapper, Cycle 8, all three existing direct 12.13 validators, 12.15.2 (24 unit + runtime + race), all three 12.15.5 suites, 12.15.6 rehearsal, CI static, 12.15.7 validator, lint and build. The literal `qa:cycle12:13` package script is not defined and was replaced by the existing schema, admin-runtime and authorization-runtime scripts. No test expectation or migration was weakened. Checks also cover Node syntax, JSON parse, secret scan and `git diff --check`. `GLOBAL_QA=PASS`; `GATE_10=PASS`.

## 15. Limitações

- The connected interface could not list project backups/PITR and no Management API PAT was locally available.
- Organization tier proves lack of managed/PITR capability on the current plan, but cannot prove absence/presence of an external manual backup.
- No restore was authorized; RTO therefore cannot be measured here.
- Repository search cannot prove absence of external `service_role` consumers for legacy overloads.
- Production connection default is not technically read-only; zero-side-effect depends on strict operation selection.

## 16. Pendências humanas

1. Provide a usable project-specific backup/recovery mechanism and dated evidence.
2. Run a non-production restore drill, record RPO/RTO and approve them against the maintenance window.
3. Inventory external `service_role` callers and decide a later controlled removal/retention of five legacy overloads.

Only items 1–2 block production readiness; overload disposition is deferred non-blocking for this upgrade.

## 17. Decisão final

```text
CYCLE_12_15_7_STATUS=COMPLETE
PRODUCTION_READINESS=NO_GO
PRODUCTION_EXECUTION_AUTHORIZED=NO
ROLLOUT=OFF
NEXT_STAGE=CYCLE_12_15_7_REMEDIATION
```

Reason: every migration and operational-design gate passed, but `BACKUP_RECOVERY_READINESS` is unverified. The GO rule forbids converting this unknown into pass.

## 18. Segurança

```text
REMOTE_READS=8
REMOTE_WRITES=0
REMOTE_MIGRATIONS_APPLIED=0
REMOTE_MIGRATION_REPAIRS=0
REMOTE_HISTORY_MUTATIONS=0
REMOTE_AUTH_MUTATIONS=0
REMOTE_RLS_MUTATIONS=0
REMOTE_GRANT_MUTATIONS=0
REMOTE_FUNCTION_MUTATIONS=0
REMOTE_DEPLOYS=0
REMOTE_COHORT_MUTATIONS=0
REMOTE_ROLLOUT_MUTATIONS=0
REMOTE_USER_DATA_MUTATIONS=0
BACKUP_MUTATIONS=0
RESTORE_OPERATIONS=0
ROLLOUT_ACTIVATION=0
```

## 19. Próximo passo

Executar `CYCLE_12_15_7_REMEDIATION` somente para fechar recovery: obter backup verificável, restore point/retenção, realizar restore drill e registrar RPO/RTO. Depois repetir o snapshot read-only e QA final. Não iniciar 12.15.8 e não executar migrations até `PRODUCTION_READINESS=GO` e autorização humana futura independente.
