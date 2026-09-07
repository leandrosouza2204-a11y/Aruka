# Student media experience - Audit

## Status

Stage 09.7 audit complete.

## Scope

Students must see demonstration media only inside their own delivered workout experience. The canonical student-visible workout states are `active` and `completed`; `draft` and `archived` are not student-visible.

## Current State

- `get_my_student_workouts()` already gates by `auth.uid()` through `alunos.student_user_id`.
- Before 09.7 it returned legacy `videoUrl` only and did not project the 09.6 `exercise_media_snapshot`.
- `ExerciseVideoPlayer` supported YouTube no-cookie embeds but not private uploaded videos.
- The private `exercise-media` bucket and storage RLS existed from 09.5.
- The 09.6 workout integration persists `exercise_id` and `exercise_media_snapshot`.

## Security Decision

SUPABASE CHANGE: YES.

09.7 requires an incremental migration because the student RPC needed minimized snapshot media projection and an on-demand media RPC keyed by `treino_exercicio_id`.

No real student backfill is required. Current student accounts and workout assignments are synthetic/test data. The delivered authorization contract is production-ready for future real student accounts.
