# Step01 Workout Delivery Executable Smoke

## 1. Blocker Original

`STOP_AND_INVESTIGATE_STEP01_SMOKE_PLAN_NOT_EXECUTABLE`.

The prior smoke plan only stated: `01 Workout: professional A/B isolation, create/deliver/lifecycle.` It did not define fixtures, assertions, cleanup, or an executable path.

## 2. Escopo

This round prepared an executable Step01 Workout Delivery smoke only. Production was not accessed. Step01 apply, postcheck, remote smoke, Step02, `db push`, `db pull`, migration repair, history alignment, CI/CD, commit, push and PR were not executed.

## 3. Contrato Validado

`public.salvar_treino_composto(jsonb)` creates a workout for `auth.uid()` and validates student ownership through `public.alunos.user_id = auth.uid()`. New workouts always start with `lifecycle_status = 'draft'`. If `templateOriginType` is supplied, an `applied` event is inserted in `public.treino_eventos`.

`public.entregar_treino(uuid)` requires authenticated ownership of the workout and student, accepts only `draft -> active`, sets delivery metadata, inserts a `delivered` event, and is idempotent when the workout is already `active`.

`public.alterar_estado_treino(uuid,text)` requires authenticated ownership, accepts `active -> completed` and archive transitions, sets lifecycle timestamps, and inserts `completed` or `archived` events according to the requested state.

`application_idempotency_key` is protected by a partial unique index on `(user_id, application_idempotency_key)`. Repeating a create with the same key returns the original workout id with `idempotent=true`.

## 4. Fixtures

The smoke creates temporary fixtures only:

- two `auth.users` professional identities;
- two `public.perfis` rows;
- two `public.alunos` rows;
- one workout plus generated days, exercises and events through the real RPCs.

No real student, professional, workout, financial, admin or AOE data is required.

## 5. Auth Strategy

The smoke uses the existing local runtime pattern for authenticated database behavior: `set local role authenticated` plus `request.jwt.claim.sub`. Service role is not used to prove the Workout Delivery behavior. The script resets role before cleanup.

## 6. Smoke Asserts

The executable smoke validates:

- `SMOKE_01_CREATE_OR_APPLY`;
- `SMOKE_02_DELIVER`;
- `SMOKE_03_LIFECYCLE_TRANSITION`;
- `SMOKE_04_EVENT_AUDIT`;
- `SMOKE_05_IDEMPOTENCY`;
- `SMOKE_06_OWNERSHIP_PROTECTION`;
- `SMOKE_07_CLEANUP`.

Each failure raises an exception under `\set ON_ERROR_STOP on`.

## 7. Cleanup

Cleanup is explicit: delete the temporary workout, students, profiles and users. Workout events are removed through the workout foreign key cascade. The smoke asserts `SMOKE_RESIDUAL_ROWS=0` before final rollback.

## 8. Local Validation

The smoke was executed locally with Docker psql against Supabase local on port `54322`.

Run 1: `PASS`.

Run 2: `PASS`.

Both runs emitted `SMOKE_RESULT=PASS` and `SMOKE_RESIDUAL_ROWS=0`.

## 9. Repeatability

The smoke generates fresh UUIDs and a unique `smoke-step01-...` key on every run. Two consecutive local runs passed, proving repeatability and cleanup behavior.

## 10. Runner Integration

External runner updated:

`C:\Backups\Aruka\run-step01-workout-delivery-apply.ps1`

The runner now executes fresh precheck, apply, postcheck and the executable smoke. It stops before apply on precheck failure, before postcheck/smoke on apply failure, before smoke on postcheck failure, and emits `STOP_AND_INVESTIGATE_STEP01_SMOKE_FAILURE` if smoke fails. It never runs recovery automatically.

## 11. Production State Unchanged

`PRODUCTION_ACCESS_ALLOWED=NO`.

`STEP01_APPLY_EXECUTED=NO`.

`STEP01_POSTCHECK_EXECUTED=NO`.

`STEP01_SMOKE_EXECUTED=NO`.

`STEP02_AUTHORIZED=NO`.

## 12. Decision

`READY_FOR_STEP01_EXECUTION_WITH_EXECUTABLE_SMOKE`.

## 13. Next Action

`EXECUTE_ALREADY_AUTHORIZED_STEP01_RUNNER`.
