# Cycle 09.6 - Workout Integration Implementation

## Status

COMPLETE

## UI

- Added a "Biblioteca" action inside each workout-day exercise form.
- Added a dialog picker with search, origin, muscle group, category and media filters.
- Added loading, empty, error, retry, select and cancel states.
- Added responsive rules for tablet/mobile picker layout.
- Added accessible dialog semantics and labelled controls.

## Data Contract

- Added workout exercise reference helpers in `workoutExerciseLibraryIntegration.js`.
- Library selection creates a workout exercise with:
  - nullable-safe `exerciseId`
  - current exercise name copied into the workout row
  - immutable `exerciseMediaSnapshot`
  - YouTube canonical URL copied to the legacy video field when applicable
  - uploaded-video storage paths copied only into the JSON snapshot
- Manual exercise save clears library reference fields.
- Workout template canonicalization, duplication and persistence payloads preserve `exerciseId` and `exerciseMediaSnapshot`.

## Rendering

- Existing workout exercise cards render stored workout fields.
- Library-derived rows show source/media badges from the stored snapshot.
- Uploaded-video snapshots render as stored media references without creating or persisting signed URLs.

## Supabase

- Added migration `20260907090000_workout_exercise_library_integration_v1.sql`.
- Added `treino_exercicios.exercise_media_snapshot jsonb default '{}' not null`.
- Added a JSON-object check constraint for the snapshot.
- Updated `salvar_treino_composto` to validate and persist `exercise_id`.
- Updated `salvar_treino_composto` to validate and persist `exercise_media_snapshot`.
- Updated `baseline-src` and local Supabase migration manifests to include the new canonical state.

## Security

- Manual exercises persist with null/empty library reference.
- Official library references require active official rows.
- Personal library references require `owner_id = auth.uid()`.
- Cross-owner personal exercises are rejected by the save RPC.
- No frontend privileged client or service-role path was introduced.
