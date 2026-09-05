# Product Roadmap v4 - Cycle 09.1 Closeout

## Status

COMPLETE.

Stage 09.1 - Data model and security was merged to `main` through PR #61 on 2026-09-05.

## Delivered

- Added `public.exercise_library` for official and professional-owned exercises.
- Added `public.exercise_favorites` with per-professional favorite isolation.
- Added nullable `public.treino_exercicios.exercise_id` with legacy row compatibility.
- Added private Supabase Storage bucket `exercise-media`.
- Added RLS, Storage policies, grants, triggers and helper functions for professional, student and anonymous boundaries.
- Added focused validators for data model, security, media security, local drift and runtime RLS.

## Production

- Canonical target: `aruka / vrize...vdik`.
- Migration applied: `20260905120000_exercise_library_media_v1.sql`.
- Post-push migration list: aligned.
- Post-push dry-run: remote database up to date.
- Production action required: no.

## Validation

- PASS: `npm.cmd run supabase:reset:safe`.
- PASS: `npm.cmd run qa:exercise-library-data-model`.
- PASS: `npm.cmd run qa:exercise-library-security`.
- PASS: `npm.cmd run qa:exercise-library-media-security`.
- PASS: `npm.cmd run qa:exercise-library-local-drift`.
- PASS: `npm.cmd run qa:exercise-library-rls-runtime`.
- PASS: `npm.cmd run qa:supabase-baseline-src`.
- PASS: workout template and delivery regression gates.
- PASS: `npm.cmd run lint`.
- PASS: `npm.cmd run build`.
- PASS: PR #61 required checks.
- Known pre-existing local unit failure: `src/features/treinos/utils/workoutLifecyclePresentation.test.js` expects active actions without `edit`, while `origin/main` already exposes `edit`.

## Next Stage

09.2 - Exercise library read experience.

The next stage should add the professional-facing read/query experience for the exercise library without custom creation/editing, upload workflows or workout insertion. It should consume the 09.1 model and preserve the security boundaries already validated.
