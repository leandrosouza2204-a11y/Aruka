# Cycle 09.6 - Workout Integration Summary

Status: READY_FOR_PR

SUPABASE CHANGE: YES

Implemented the workout editor integration with the Exercise Library. Professionals can open a library picker from a workout day, search/filter official and personal exercises, add one exercise to the day and keep existing manual-entry workflows intact.

The workout payload now preserves nullable `exerciseId` and an immutable `exerciseMediaSnapshot`. YouTube snapshots store canonical public metadata, uploaded-video snapshots store private storage paths only, and no signed URL is persisted.

The Supabase migration adds the snapshot column and updates `salvar_treino_composto` so workout save remains atomic while rejecting cross-owner personal exercise references.

Focused local unit/static checks, full lint/build, regression QA, Supabase local reset/bootstrap/validate, runtime RLS/drift and the dedicated workout integration runtime check are passing.

Remote Supabase promotion is complete. The pre-push dry-run showed only `20260907090000_workout_exercise_library_integration_v1.sql`; `db push` applied it; post-push migration list is aligned and post-push dry-run reports the remote database is up to date.

PR creation, checks, merge and closeout remain pending.
