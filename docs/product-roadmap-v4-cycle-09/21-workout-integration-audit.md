# Cycle 09.6 - Workout Integration Audit

## Status

COMPLETE

## Decision

SUPABASE CHANGE: YES

## Findings

- `treino_exercicios.exercise_id` already existed from 09.1 and is nullable with `on delete set null`.
- `salvar_treino_composto` did not persist `exercise_id`, so a workout created from the library would lose the canonical reference.
- `treino_exercicios` did not have a stable media snapshot column for uploaded videos.
- The current editor supported manual exercise entry, edit, remove, reorder, save and reload, so the integration could be additive.
- The Exercise Library service already returns active official exercises plus personal owner-scoped rows under RLS.
- Archived exercises are excluded from the picker by the existing active-library query, while existing workout rows can still render from stored workout data.

## Scope Boundaries

- No student media experience was started.
- No seed/catalog expansion was performed.
- No multiselect or large editor rewrite was introduced.
- No signed URL is persisted in workout rows.

## Required Change

Add a picker entry point in the workout editor, persist `exercise_id`, persist immutable workout exercise media snapshot data and keep manual/legacy exercise rows valid.
