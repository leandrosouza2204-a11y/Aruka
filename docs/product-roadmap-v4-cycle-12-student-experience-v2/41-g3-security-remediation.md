# G3 security remediation

## Status

`READY_FOR_PRODUCTION_REVIEW`, not production authorization. The remediation was validated only against an isolated restoration of the production backup. Production remained read-only and received no migration, DDL, grant, policy, Auth, Storage or deploy change.

## Verified starting state

- Production read-only catalog check on 2026-10-11: PostgreSQL 17.6, 25 applied migrations, 40 public `SECURITY DEFINER` functions and 17 effectively executable by `anon`.
- The production Supabase Security Advisor independently reported the same 17 `anon_security_definer_function_executable` findings. It also reported leaked-password protection disabled in Auth; that pre-existing platform setting is outside this database-only migration and remains a documented follow-up.
- Isolated production-copy state after the 15 pending migrations: 40 applied migrations, 62 public `SECURITY DEFINER` functions and 22 effectively executable by `anon`.
- Backup: `aruka-production-20261011-143722Z.dump`.
- SHA-256: `7C95D044F7F4A6483B3B9EE0E7CA70E8B1FB35A361D31EB7FD9D3246D9D94E91`.
- Isolation: Docker network `none`, zero published ports and an exclusive labeled volume.

The production history was unchanged from the same-day backup, so a second production dump was unnecessary. The existing immutable G2 backup was restored again in the fresh, mission-exclusive `g3-security-20261011-02` environment. This run used the final migration bytes (`8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21`); no PASS is inherited from run-01.

## S1 privileged-function inventory

All 22 inherited signatures use schema `public`, owner `postgres` and `SECURITY DEFINER`. Before remediation they used `search_path=public` or `search_path=public,auth` and inherited effective `anon` execution. None is a trigger function and no direct PostgreSQL job dependency was found.

| Signatures | Required caller after remediation | Known dependency or caller | Revocation impact |
| --- | --- | --- | --- |
| `admin_atualizar_perfil(uuid,text,text,text,text,text)`; legacy 5-argument overload | `authenticated`, `service_role` | `adminService`; `admin_liberar_assinante` | Anonymous calls denied; authenticated admin contract preserved |
| `admin_bloquear_usuario(uuid,text)`; legacy 1-argument overload | `authenticated`, `service_role` | `adminService` | Anonymous calls denied; admin checks remain authoritative |
| `admin_eh_admin()` | `authenticated`, `service_role` | Admin RPCs and RLS policies | Required authenticated policy/helper execution preserved |
| `admin_liberar_assinante(uuid,text,date,date,text)`; legacy 4-argument overload | `authenticated`, `service_role` | `adminService`; calls profile/subscription helpers | Admin commercial flow preserved |
| `admin_liberar_beta(uuid,text)`; legacy 1-argument overload | `authenticated`, `service_role` | `adminService` | Admin beta flow preserved |
| `admin_listar_logs(text,uuid,date,date,text)` | `authenticated`, `service_role` | Admin observability UI | Admin read preserved |
| `admin_registrar_log(uuid,text,text,uuid,jsonb,jsonb,text)` | `authenticated`, `service_role` | Called by admin mutation functions | Nested and direct authorized audit writes preserved |
| `admin_upsert_assinatura(uuid,text,text,date,date,text)`; legacy 5-argument overload | `authenticated`, `service_role` | Admin subscription functions | Admin subscription flow preserved |
| `admin_validar_acesso()` | `authenticated`, `service_role` | Called by admin functions | Authenticated authorization helper preserved |
| `alterar_estado_treino(uuid,text)` | `authenticated` | `treinosService`; derives professional from `auth.uid()` | Professional lifecycle flow preserved |
| `aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)` | `service_role` only | AOE Edge boundary uses `adminClient` | Direct browser/RPC access removed |
| `claim_pending_student_invite()` | `authenticated` | `studentInviteLinkingService` | Student self-claim preserved |
| `entregar_treino(uuid)` | `authenticated` | `treinosService`; derives professional from `auth.uid()` | Professional delivery flow preserved |
| `get_my_student_exercise_media(uuid)` | `authenticated` | `studentDailyExperienceService` | Student-owned signed-media lookup preserved |
| `get_my_student_workouts()` | `authenticated` | Student V1 daily experience | Student self-read preserved |
| `processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)` | `service_role` only | `processar-encerramentos-automaticos` Edge Function | Background lifecycle processing preserved; browser access removed |
| `salvar_treino_composto(jsonb)` | `authenticated` | `treinosService`; derives professional from `auth.uid()` | Professional workout persistence preserved |

The five legacy overloads have no current application call site. They are optional in a canonical bootstrap but are remediated when present in the production snapshot. Their authenticated admin compatibility is retained because older clients may still resolve them; their internal admin checks remain mandatory.

## S2 and S3 remediation

Migration `20261011232512_harden_privileged_function_execution.sql` is forward-only and does not rewrite any historical migration.

For each exact signature it:

1. verifies the function exists and remains `SECURITY DEFINER`;
2. replaces the unsafe path with an empty `search_path`;
3. revokes all function privileges from `PUBLIC`, `anon`, `authenticated` and `service_role`;
4. reapplies only the reviewed authenticated/service allowlist;
5. fails atomically if any public `SECURITY DEFINER` remains executable by `anon`;
6. preserves restrictive default function privileges.

The two previously exploitable functions are now service-only. This is the trusted internal contract required by their actual Edge Function callers and avoids adding a false `auth.uid()` dependency to background work without an end-user session.

## S4 negative and positive runtime proof

The isolated post-migration transaction proves:

- `anon` cannot execute either privileged mutation;
- `authenticated` cannot use forged actor, organization, professional or student identifiers against either internal mutation;
- `service_role` can still reserve AOE idempotency and process automatic lifecycle closure;
- authenticated admin and student RPCs continue working;
- all legacy overloads deny `anon`;
- all 22 target functions have an empty `search_path`;
- every synthetic row and fixture grant is rolled back.

The pre-remediation exploit proof was rerun first and reproduced both writes before the security migration.

## S5 and S6 restore and migration result

- Restore: PASS, 71/71 data blocks, zero restore errors or warnings.
- PostgreSQL startup log: one exact health-probe race (`database system is starting up`) was recorded and classified separately; zero blocking `ERROR`/`FATAL`/`PANIC` lines remained.
- History: 25 production versions -> 40 after the prior pending chain -> 41 after remediation.
- Remediation migration: PASS, atomic history insertion.
- Public functions: 72 unchanged.
- Public `SECURITY DEFINER`: 62 unchanged.
- Effective anonymous `SECURITY DEFINER`: 22 -> 0.
- Critical rows preserved: Auth users 8, students 30, workouts 8, execution sessions 3.
- Foreign-key orphans: 0.
- Invalid indexes: 0.
- Constraints: PASS.
- RLS and controlled rollout: PASS; rollout remains OFF with zero targets.

## Canonical bootstrap compatibility

- Supabase local preflight: PASS with an exact 41-migration executable chain.
- Clean canonical bootstrap/reset: PASS on CLI `2.109.1`; reference baseline plus 41 executable migrations produced 42 history rows.
- Required canonical signatures: 17/17 present, `SECURITY DEFINER`, and configured with an empty `search_path`.
- Optional production-only legacy overloads: absent without blocking bootstrap, as designed.
- Effective anonymous execution across public `SECURITY DEFINER` functions: 0.
- Migration history contains `20261011232512`; canonical runtime validation: PASS.

## S7 application compatibility

- Student Experience V2: 54/54 PASS.
- Student Experience V1 contract: PASS.
- Auth, login routing and invite linking: 30/30 PASS; logout contract: 3/3 PASS.
- AOE, idempotency, authorization and privacy: 39/39 PASS.
- Workout execution/session/lifecycle utilities: 42/42 PASS.
- Workout delivery contract, authorization, idempotency and lifecycle: PASS.
- Student media authorization: PASS.
- Lint: PASS.
- Vite build: PASS, 2,069 modules.
- Supabase CI static validation: PASS, 482 Node files, 16 PowerShell files and 31 JSON reports.

## S8 risk and recovery

The migration changes function metadata and ACLs only; it performs no table rewrite or data mutation. The main compatibility risk is an undocumented caller relying on `anon` or on an unreviewed overload. Repository, live-catalog and runtime evidence found no legitimate anonymous caller.

The production Security Advisor will continue reporting its current findings until this migration is separately authorized and executed. Leaked-password protection is also still disabled and requires an independent Auth configuration decision; it was not changed in this mission.

Recovery is forward-only: if an authorized caller is missed, add a new reviewed migration granting `EXECUTE` to that exact signature and role. Do not restore `PUBLIC`, do not grant `anon` broadly and do not rewrite this migration. Database recovery continues to use the G2 immutable backup and isolated restore procedure.

## S9 evidence boundary

Production-derived inventories, definitions and runtime output remain in the restricted recovery directory and are excluded from Git. Final run-02 evidence is under `B:\Aruka\Recovery\20261008-213100Z\evidence\aruka-g3-security-remediation-20261011-02` (`restore`, `rehearsal` and `security`). The repository contains only the forward migration, synthetic validators, runner, tests, canonical bootstrap reports and this non-sensitive operational summary.

## S10 production gate

The technical remediation is ready for PR and CI. Production execution remains prohibited until the PR is merged, post-merge CI passes and a separate production change authorization is approved.
