# Aruka G4.1 — production go-live readiness

## Decision

`READY_FOR_AUTHORIZATION`

Production was inspected read-only on 2026-10-12. No migration, DDL, DML, Auth, Storage, feature flag, environment variable, deployment, rollback, push or merge was executed. G4.2 remains a separately authorized change.

Readiness is conditional on the runbook preconditions being satisfied inside the future maintenance window: a fresh database snapshot plus isolated validation, an explicit Storage `DATABASE_ONLY` risk decision (or separately approved byte backup), verification of Vercel settings/log access by an authorized operator, and formal change authorization. Failure of any precondition is `ABORT_BEFORE_FIRST_WRITE`.

## Resumable checkpoints

| Gate | State | Evidence |
| --- | --- | --- |
| G4.1.1 REPOSITORY | PASS | `main`; HEAD and tracked `origin/main` `58980add1a520f31f8b1dac68f801d344ee68704`; GitHub confirms PR #155 merged to that SHA; only pre-existing untracked document 37 before this mission. |
| G4.1.2 SUPABASE | PASS | Project `aruka` / `vrizeuhuhvtvbrmtvdik`, `ACTIVE_HEALTHY`, PostgreSQL 17.6.1.127; 25 migrations through `20260909110000`; no later production migration. |
| G4.1.3 VERCEL | PASS_WITH_OPERATOR_PRECHECK | Production deployment for `58980ad` succeeded at 2026-10-12 11:15:50Z; deployment URL and canonical assets match. Authenticated Vercel environment/log inspection requires an operator session and is a G4.2 precondition. |
| G4.1.4 ROLLOUT | PASS | Rollout tables/RPCs do not exist in the 25-migration schema. Published bundle omits `VITE_STUDENT_EXPERIENCE_V2_ENABLED`, resolves capability to false, and catches the absent decision RPC with V1 fallback. |
| G4.1.5 BACKUP | PASS_WITH_FRESH_SNAPSHOT_REQUIRED | Immutable G2 dump exists, hash matches, isolated restore passed. A new snapshot immediately before G4.2 is mandatory. |
| G4.1.6 STORAGE | DECISION_REQUIRED | Both buckets remain private; `exercise-media` 0 objects; `avaliacoes-fotos` 8 objects / 2,113,714 metadata bytes. Database dump does not contain object bytes. |
| G4.1.7 SECURITY | READY_AFTER_PENDING_CHAIN | Current production has 40 public `SECURITY DEFINER` functions and 17 anonymously executable; advisor confirms 17 warnings. Pending remediation was rehearsed to 0. Leaked-password protection remains disabled and needs explicit owner decision. |
| G4.1.8 OBSERVABILITY | PASS_WITH_OPERATOR_PRECHECK | Supabase log sources and thresholds defined. Vercel authenticated logs must be opened by the operator before first write. |
| G4.1.9 DEPLOYMENT_PLAN | PASS | See `g4-2-runbook.md`; activation is explicitly separated from migrations and deploy. |
| G4.1.10 QA_EVIDENCE | PASS | G2/G3 static tests 13/13; rollout unit 28/28; Auth/V1/V2 122/122; lint PASS; build PASS, 2,069 modules. Runtime rerun requiring local Supabase was not repeated because the local stack was stopped; canonical G3 isolated runtime evidence remains authoritative. |
| G4.1.11 GIT_CLOSEOUT | PENDING_PUBLICATION_AUTHORIZATION | Automatic Vercel production deployment from `main` is proven. Artifacts may be committed locally, but push/merge is prohibited without publication authorization. |

## Production snapshot

- Observation: 2026-10-12 13:53Z.
- Database: `postgres`, server 17.6; hosted project reports 17.6.1.127 and `ACTIVE_HEALTHY`.
- Schemas: auth, cron, extensions, graphql, graphql_public, net, public, realtime, storage, supabase_migrations, vault.
- Public tables: 30/30 with RLS; 75 public policies.
- Installed extensions: `pg_cron` 1.6.4, `pg_net` 0.20.3, `pg_stat_statements` 1.11, `pgcrypto` 1.3, `supabase_vault` 0.3.1, `uuid-ossp` 1.1, `plpgsql` 1.0.
- Edge Functions: `processar-encerramentos-automaticos` v14 ACTIVE and `student-access-invite` v14 ACTIVE. Their `verify_jwt=false` settings are pre-existing and their in-function authorization contracts must remain under review; no function was changed.
- Last-24-hour Supabase log inventory: edge 89, Auth 39, PostgreSQL 19, Supavisor 9, Auth audit 4, PostgREST 2, Function 2, Function edge 1. Auth aggregates include 30 GET 200, 2 GET 403, 1 POST 400, and no observed critical aggregate. Raw payloads were not copied into Git.

## Deployment and compatibility

- GitHub deployment `7012700485`, environment `Production`, state `success`.
- Vercel deployment ID `dpl_GKsbjo6GCPeNDR2Qch2Dp2ATqYug` and URL `https://aruka-4p100o89t-leandrosouzafitness.vercel.app`.
- Canonical domain `https://www.aruka.com.br`; `/`, `/login`, `/minha-area`, `/minha-area/inicio`, and `/dashboard` returned HTTP 200 without authenticated mutation.
- Canonical and deployment HTML referenced the same asset set, including `index-CjL4ZvCg.js` and `studentExperienceRouteService-BF7oFvWR.js`.
- The public bundle identifies commit `58980add1a520f31f8b1dac68f801d344ee68704`, branch `main`, Vercel production environment and canonical domain. Secret/private environment values were neither available nor requested.
- `VITE_STUDENT_EXPERIENCE_V2_ENABLED` is absent from the published environment object. The build therefore denies V2 even if a server response were to allow it.
- The current 25-migration database has no rollout tables or `get_my_student_experience_route()`. The deployed code catches that RPC failure and returns `DECISION_UNAVAILABLE` / V1. This makes the published application compatible with the current schema while V2 remains unavailable.

## Migration inventory

Production has 25 applied migrations. Sixteen files are pending; expected final history is 41. The validated operational order is not the physical timestamp order for steps 13–15:

1. `20260914130000_cycle12_execution_tracking_and_safety.sql`
2. `20260914131000_cycle12_execution_commands.sql`
3. `20260914132000_cycle12_completion_and_grants.sql`
4. `20260914185833_cycle12_canonical_execution_reads.sql`
5. `20260915014848_cycle12_student_home_v2.sql`
6. `20260915140229_cycle12_student_training_library_v2.sql`
7. `20260915201101_cycle12_workout_player_v2.sql`
8. `20260919120000_cycle12_set_tracking_player_payload.sql`
9. `20260919231657_cycle12_rest_timer_server_clock.sql`
10. `20260920104727_cycle12_workout_completion_feedback.sql`
11. `20260920144904_cycle12_student_evolution_v2.sql`
12. `20260921010053_cycle12_profile_secondary_flows.sql`
13. `20261004133801_cycle12_forward_schema_security_reconciliation.sql`
14. `20260926174027_cycle12_schema_rls_hardening.sql`
15. `20261003163830_cycle12_controlled_rollout_foundation.sql`
16. `20261011232512_harden_privileged_function_execution.sql`

The canonical LF SHA-256 of the security migration is `8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21`, exactly matching approval. The Windows working tree has CRLF line endings and therefore a different raw byte hash; `git diff` is empty and the Git blob/canonical LF hash matches. Do not modify the migration.

## Backup and Storage

- G2 dump: `B:\Aruka\Recovery\20261008-213100Z\backups\aruka-production-20261011-143722Z.dump`.
- Size: 632,622 bytes; modified 2026-10-11 14:38:11Z.
- Recalculated SHA-256: `7C95D044F7F4A6483B3B9EE0E7CA70E8B1FB35A361D31EB7FD9D3246D9D94E91`.
- G2 isolated restore: PASS against PostgreSQL 17.6, with catalog, data, RLS, FK, index and log checks.
- Because production can change after the 11 October snapshot and deployment has changed since capture, a new database snapshot and isolated validation are mandatory immediately before G4.2.
- The database dump is not full DR: it preserves Storage metadata, not object bytes. Before authorization, the change owner must either accept `DATABASE_ONLY` explicitly because G4.2 does not modify Storage, or authorize and verify a separate encrypted byte backup. No object was copied in G4.1.

## Security classification

- Current/pre-existing: 17 anonymous `SECURITY DEFINER` exposures; leaked-password protection disabled; two active Edge Functions configured with `verify_jwt=false`; these facts are not considered resolved merely because remediation exists locally.
- Pending-chain outcome proven in isolation: history 25 → 40 → 41; anonymous privileged execution 17/22 → 0; empty `search_path`; RLS/integrity/positive and negative authorization tests PASS.
- Post-migration residual: undocumented legacy caller risk, Auth leaked-password setting, `verify_jwt=false` function-boundary review, Storage bytes outside database DR, and Vercel operator-only log/config validation.
- Go-live stop conditions: any anonymous privileged execution after step 16, any unexpected grant/policy/function/hash/history, RLS failure, cross-user visibility, rollout not OFF, nonzero target, invalid index, FK orphan, data-count loss, or uncertain commit state.

## Evidence boundary

Public/sanitized artifacts are in this directory. Production-derived detailed restore and rehearsal output remains under:

- `B:\Aruka\Recovery\20261008-213100Z\evidence\aruka-g3-readiness-20261011-01-report`
- `B:\Aruka\Recovery\20261008-213100Z\evidence\aruka-g3-security-remediation-20261011-02`

No credentials, tokens, raw log messages, user records, object paths or private environment values are included here.

The offline-only package preparer is `scripts/prepare-aruka-g4-2-package.mjs`; it refuses execution mode and repository output. Its test is `scripts/__tests__/prepare-aruka-g4-2-package.test.mjs`.
