# Cycle 09.1 - Data model and security implementation

## Implementation

- Migration: `supabase/migrations/20260905120000_exercise_library_media_v1.sql`.
- Added `public.exercise_library`.
- Added `public.exercise_favorites`.
- Added nullable `public.treino_exercicios.exercise_id`.
- Added private `exercise-media` Storage bucket and scoped Storage policies.
- Updated baseline source modules and baseline validator table inventory.
- Added static QA scripts for data model, RLS/grants and media security.

## Security

- RLS enabled on all new public tables.
- `anon` has no write access and no exercise table grants.
- Official exercises are read-only to client users.
- Personal exercise writes require `owner_id = auth.uid()`.
- Favorites are isolated by `professional_id = auth.uid()`.
- Storage upload/update/delete is restricted to paths whose first segment is `auth.uid()`.
- Student media read is limited to exercises referenced from the student's own active/completed workout.

## Local and remote validation log

- `npm.cmd run qa:exercise-library-data-model`: PASS.
- `npm.cmd run qa:exercise-library-security`: PASS.
- `npm.cmd run qa:exercise-library-media-security`: PASS.
- `npm.cmd run qa:supabase-baseline-src`: PASS.
- `npm.cmd run supabase:reset:safe`: PASS.
- Local introspection: PASS for `exercise_library`, `exercise_favorites`, RLS, policies and private `exercise-media` bucket.
- Canonical local drift gate: PASS via `npm.cmd run qa:exercise-library-local-drift`.
- RLS runtime gate: PASS via `npm.cmd run qa:exercise-library-rls-runtime`.
- Legacy workout template QAs with Supabase diff guard: PASS after strict allowlist for the 09.1 migration/baseline files.
- Unit `workoutLifecyclePresentation.test.js`: PREEXISTING_TEST_FAILURE; `origin/main` has the same active-state `edit` action while the test expects it absent.
- Direct `npx.cmd supabase db diff --local --schema public`: not canonical for this repo because the direct shadow DB does not include the reference-only baseline.
- `npm.cmd run supabase:preflight`: PASS after production target guard update.
- Remote migration list before push: PASS, only `20260905120000` pending.
- Remote dry-run before push: PASS, only `20260905120000_exercise_library_media_v1.sql`.
- Remote `db push`: PASS.
- Remote migration list after push: PASS, `20260905120000` aligned.
- Remote dry-run after push: PASS, remote database up to date.

## Remote target policy

- Development and validation: local Supabase in Docker.
- Legacy HML: `Aruka_HML` (`xrmq...adnf`), inactive and retired from the current operational flow.
- Production target: `aruka` (`vrize...vdik`).
- `scripts/supabase-local-preflight.ps1` was updated to validate the exact production project ref `vrizeuhuhvtvbrmtvdik` when a remote link is present.
- Remote promotion remains blocked if any other linked project ref is detected.
