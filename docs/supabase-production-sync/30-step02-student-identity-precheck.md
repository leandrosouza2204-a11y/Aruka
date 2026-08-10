# Step02 Student Identity Precheck

## Objective

Prepare the short supervised production precheck for Step02 Student Identity without executing mutable production SQL.

## Scope

Step02 covers `public.alunos.student_user_id`, its foreign key, indexes, `student` role allowance, and the RPCs `vincular_aluno_usuario(uuid, uuid)`, `desvincular_aluno_usuario(uuid)` and `get_my_student_workouts()`.

## Canonical Contract

The approved source is `supabase/migrations/20260730090000_student_identity_contract.sql`.

`public.alunos.user_id` remains the professional owner. `public.alunos.student_user_id` represents the authenticated student identity.

## Cutover Files

- Precheck: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/02-student-identity.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-recovery.md`

## Apply Hash

`93C0AD41BD51551BF0F0A6516AC1FD5B3915C724DD1109E2E1CEBBD1AB04D170`

## Static Gates

- Precheck read-only: `PASS`.
- Apply traceability: `UNTRACEABLE_STATEMENT_COUNT=0`.
- Recovery available: `YES`.
- Postcheck available: `YES`.
- Runtime QA reusable: `EXISTING_RUNTIME_QA_REUSABLE`.

## Runner

External runner:

`C:\Backups\Aruka\run-step02-student-identity-precheck.ps1`

Command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File C:\Backups\Aruka\run-step02-student-identity-precheck.ps1
```

The runner uses Docker with `public.ecr.aws/supabase/postgres:17.6.1.156`, Session Pooler credentials collected locally, a temporary process-scoped database credential environment variable, and native exit-code based handling for PostgreSQL NOTICE/WARNING output.

## Precheck Result

Decision is `GO_FOR_STEP02_APPLY_AUTHORIZATION`.

Remote read-only precheck completed with exit code `0`. The observed absence of `student_user_id`, FK, indexes, Student Identity RPCs and RPC grants is expected remote drift covered by the Step02 apply. `perfis_role_check` is present and still lacks `student`, also covered by the Step02 apply.

Data gates passed: duplicate identities `0`, orphan identities `0`, blocking remote drift `0`.

Step02 apply remains unauthorized and was not executed.

Next action: `USER_EXPLICIT_STEP02_APPLY_AUTHORIZATION`.
