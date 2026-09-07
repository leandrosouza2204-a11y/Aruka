# Student media experience - Validation

## Status

Validation passed.

## Local

- `npm.cmd run supabase:reset:safe` - PASS
- `npm.cmd run supabase:bootstrap` - PASS
- `npm.cmd run supabase:validate` - PASS
- `npm.cmd run qa:exercise-library-local-drift` - PASS
- `npm.cmd run qa:exercise-library-rls-runtime` - PASS
- `npm.cmd run qa:exercise-library-student-media-runtime` - PASS, 18 pgtap checks

## Focused QA

- `node --test src/features/workoutExecution/utils/exerciseVideoProvider.test.js` - PASS, 6 tests
- `npm.cmd run qa:exercise-library-student-media-experience` - PASS
- `npm.cmd run qa:exercise-library-student-media-authorization` - PASS
- `npm.cmd run qa:exercise-library-student-media-responsive` - PASS
- `npm.cmd run qa:exercise-library-student-media-accessibility` - PASS

## Regression QA

- 09.6 workout integration, snapshot, responsive and accessibility - PASS
- 09.5 video upload and storage security - PASS
- 09.4 YouTube media - PASS
- 09.3 custom exercises - PASS
- 09.2 read experience - PASS
- 09.1 data model, security and media security - PASS
- Workout delivery contract, data, authorization, service integration and lifecycle - PASS

## Known Preexisting Test

`node --test src/features/treinos/utils/*.test.js` reproduced the known preexisting lifecycle assertion: active workout actions currently include `edit`, while the legacy test expects no `edit`.

PREEXISTING_TEST_FAILURE_CONFIRMED.

## Remote Supabase

- Project: `aruka / vrizeuhuhvtvbrmtvdik`
- HML: inactive and not linked
- Migration list before push: only `20260907120000` pending
- Dry-run before push: only `20260907120000_student_exercise_media_experience_v1.sql`
- DB push: PASS
- Migration list after push: local and remote aligned through `20260907120000`
- Dry-run after push: remote database is up to date

## Limitations

AUTHENTICATED_UI_RUNTIME = NOT_EXECUTED.

MANUAL_VISUAL_QA_REQUIRED for real mobile/PWA devices. Static responsive and accessibility validators passed.
