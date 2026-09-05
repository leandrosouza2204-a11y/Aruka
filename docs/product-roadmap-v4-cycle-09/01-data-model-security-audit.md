# Cycle 09.1 - Data model and security audit

## Current state

- There is no canonical persisted exercise library table before this stage.
- `public.treino_exercicios` stores workout exercise snapshots: name, sets, reps, load, rest, notes, video URL and order.
- Historical workout execution uses copied snapshots, so live catalog changes must not rewrite workout history.
- Workout templates are persisted separately in `public.workout_templates`; template payloads remain JSON snapshots.
- Existing media storage is limited to the private `avaliacoes-fotos` bucket.

## Findings

1. Canonical exercise table: missing.
2. Exercise scope: currently per workout only, through snapshots.
3. Official/personal origin: missing.
4. `treino_exercicios` FK: missing before 09.1; snapshots exist and must stay authoritative for history.
5. Custom exercise support: missing as a reusable entity.
6. Media support: only `video_url` text on prescribed exercises.
7. Exercise bucket: missing.
8. Existing bucket visibility: `avaliacoes-fotos` is private.
9. Ownership: present in other domains, missing for exercise catalog.
10. RLS: present on existing business tables, missing for new catalog because tables did not exist.
11. Archive: missing for exercises.
12. Metadata: missing for exercises.
13. Templates dependency: templates keep JSON snapshots and should not be forced into live FK now.
14. Historical risk: high if snapshots are replaced by mandatory live references.

## Decision

`IMPLEMENTATION_REQUIRED`

The smallest safe model is one canonical `exercise_library` table with `official` and `personal` origins, one `exercise_favorites` join table, nullable `treino_exercicios.exercise_id`, and a private `exercise-media` bucket.

## Environment Policy

- Development and validation run on local Supabase in Docker.
- The retired legacy HML project is `Aruka_HML` (`xrmq...adnf`) and is no longer part of the operational promotion flow.
- Remote promotion target is production `aruka` (`vrize...vdik`) after local reset, drift, RLS runtime, QA, lint and build pass.
- Remote operations require exact linked project-ref comparison; any target other than `vrizeuhuhvtvbrmtvdik` is blocked.

## Authorization Matrix

| Actor | Read official | Read personal | Create personal | Edit personal | Archive personal | Media read | Media upload | Media delete |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| anon | DENY | DENY | DENY | DENY | DENY | DENY | DENY | DENY |
| professional owner | ALLOW | ALLOW own | ALLOW own | ALLOW own | ALLOW via status update | ALLOW own folder | ALLOW own folder | ALLOW own folder |
| other professional | ALLOW | DENY | ALLOW own only | DENY | DENY | DENY | ALLOW own folder | ALLOW own folder |
| student | ALLOW only when prescribed in active/completed delivered workout | ALLOW only when prescribed to own active linked student record | DENY | DENY | DENY | ALLOW prescribed media only | DENY | DENY |
| system/backend | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE | NOT_APPLICABLE |

## Risks and guardrails

- Favorite state is per professional through a unique `(professional_id, exercise_id)` constraint.
- Uploaded media remains private; no signed URL, token or service role is persisted.
- Workout history remains readable because `treino_exercicios.exercise_id` is nullable and `on delete set null`.
- Official exercises are not client-editable because write policies require `origin = 'personal'` and `owner_id = auth.uid()`.
- Student reads use `public.exercise_is_prescribed_to_current_student(uuid)` as a `SECURITY DEFINER` helper so the library policy can verify delivered workout relationships without exposing `alunos` or `treinos` directly through broad student table policies.
