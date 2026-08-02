# Student Identity Deployment Design

## Context

This restricted round reviewed only the backend/Supabase Student Identity contract. It did not create UI, routes, hooks, admin/financial changes, AOE changes, remote SQL, migration repair, commit, push or PR.

## Identity Model

`OWNER_IDENTITY_MODEL=VALID`. `public.alunos.user_id` remains `PROFESSIONAL_OWNER`; `public.alunos.student_user_id` is `AUTHENTICATED_STUDENT_IDENTITY`.

## Migration Coverage

The approved local contract is fully covered by `supabase/migrations/20260730090000_student_identity_contract.sql`.

## Objects

Reviewed `13` objects: column/comments, FK, unique/search indexes, `perfis_role_check`, three RPCs and their grants.

## Column/FK/Indexes

`student_user_id` is nullable `uuid`, references `auth.users(id)` with `ON DELETE SET NULL`, has a partial unique index for 1:1 identity and a partial lookup index.

## Role Student

`perfis_role_check` preserves `admin` and `user` and adds `student`.

## RPCs

`vincular_aluno_usuario(uuid,uuid)`, `desvincular_aluno_usuario(uuid)` and `get_my_student_workouts()` are `SECURITY DEFINER` with `search_path=public`.

## Grants

`PUBLIC` and `anon` do not receive direct EXECUTE. `authenticated` receives the contract-required EXECUTE grants.

## RLS

The student reader does not require broad direct SELECT policies on base workout tables; minimized access is encapsulated by RPC.

## Payload Minimization

The student payload contains prescription fields for the linked student, active workouts, completed workouts, days and exercises. Internal ownership, idempotency, template snapshots, technical metadata and financial fields are excluded.

## Runtime Isolation

Runtime QA covers professional A/B isolation, student A/B isolation, anon denial, duplicate account rejection and auth user deletion preservation.

## Workout Delivery Dependency

`get_my_student_workouts()` depends on local Workout Delivery lifecycle objects that are already complete locally.

## Local State

`ACTIVE_LOCAL_STUDENT_IDENTITY_DRIFT=0`.

## Remote State

`REMOTE_STUDENT_IDENTITY_PENDING=13`; production evidence still shows the contract absent or older.

## Migration Decision

No new migration was created. Duplicate Student Identity migration is forbidden.

## Deployment Order

Future package order: baseline, Workout Delivery, security reconciliation, required fields, Student Identity migration, validation. `MIGRATION_ORDER_VALID=YES`.

## Production Action

`PRODUCTION_ACTION_REQUIRED=NO`; package design only.

## Next Step

`PRODUCTION_RECONCILIATION_PACKAGE_DESIGN`
