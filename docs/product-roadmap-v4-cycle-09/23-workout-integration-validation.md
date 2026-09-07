# Cycle 09.6 - Workout Integration Validation

## Status

COMPLETE

## Focused Checks

- `node --test src/features/treinos/utils/workoutExerciseLibraryIntegration.test.js src/features/treinos/utils/workoutDataContract.test.js` - PASS
- `npm.cmd run qa:exercise-library-workout-integration` - PASS
- `npm.cmd run qa:exercise-library-workout-snapshot` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-responsive` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-accessibility` - PASS

## Repository Checks

- `npm.cmd exec -- eslint src/components/TreinoModal.jsx src/services/exerciseLibraryMapper.js src/features/treinos/utils/workoutExerciseLibraryIntegration.js scripts/validate-exercise-library-workout-integration.mjs scripts/validate-exercise-library-workout-snapshot.mjs scripts/validate-exercise-library-workout-integration-responsive.mjs scripts/validate-exercise-library-workout-integration-accessibility.mjs` - PASS
- `npm.cmd run qa:supabase-baseline-src` - PASS
- `npm.cmd run qa:supabase-ci-static` - PASS
- `npm.cmd run lint` - PASS
- `npm.cmd run build` - PASS
- `git diff --check` - PASS

## Regression Checks

- `npm.cmd run qa:exercise-library-video-upload` - PASS
- `npm.cmd run qa:exercise-library-video-storage-security` - PASS
- `npm.cmd run qa:exercise-library-youtube-media` - PASS
- `npm.cmd run qa:exercise-library-custom-exercises` - PASS
- `npm.cmd run qa:exercise-library-read-experience` - PASS
- `npm.cmd run qa:exercise-library-data-model` - PASS
- `npm.cmd run qa:exercise-library-security` - PASS
- `npm.cmd run qa:exercise-library-media-security` - PASS
- `npm.cmd run qa:exercise-library-video-upload-responsive` - PASS
- `npm.cmd run qa:exercise-library-video-upload-accessibility` - PASS
- `npm.cmd run qa:workout-template-sanitization` - PASS
- `npm.cmd run qa:workout-templates-data` - PASS
- `npm.cmd run qa:workout-template-discovery` - PASS
- `npm.cmd run qa:workout-template-guided-application` - PASS
- `npm.cmd run qa:personal-workout-template-management` - PASS
- `npm.cmd run qa:workout-delivery-contract` - PASS
- `npm.cmd run qa:workout-delivery-data` - PASS
- `npm.cmd run qa:workout-delivery-authorization` - PASS
- `npm.cmd run qa:workout-delivery-service-integration` - PASS
- `npm.cmd run qa:workout-delivery-idempotency` - PASS
- `npm.cmd run qa:workout-delivery-lifecycle` - PASS

## Supabase Local

- `npm.cmd run supabase:reset:safe` - PASS
- `npm.cmd run supabase:bootstrap` - PASS
- `npm.cmd run supabase:validate` - PASS
- `npm.cmd run qa:exercise-library-local-drift` - PASS
- `npm.cmd run qa:exercise-library-rls-runtime` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-runtime` - PASS

## Supabase Remote

- Pre-push migration list: only `20260907090000_workout_exercise_library_integration_v1.sql` pending.
- `npx.cmd supabase db push --dry-run` - PASS, one migration only.
- `npx.cmd supabase db push` - PASS.
- Post-push migration list: aligned through `20260907090000`.
- Post-push dry-run: PASS, remote database up to date.

## Known Preexisting Issue

- `node --test src/features/treinos/utils/*.test.js` reproduces the preexisting `workoutLifecyclePresentation.test.js` mismatch already documented in 09.5: `ACTIVE` actions include `edit`, while the legacy expectation omits it.
