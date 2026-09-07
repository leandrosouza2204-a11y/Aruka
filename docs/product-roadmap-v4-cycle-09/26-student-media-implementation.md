# Student media experience - Implementation

## Status

Implemented in branch `feat/product-roadmap-v4-cycle-09-7-student-media-experience`.

## Supabase

Migration: `20260907120000_student_exercise_media_experience_v1.sql`.

- Evolves `public.get_my_student_workouts()` to return only active/completed workouts for the authenticated linked student.
- Projects minimized exercise media from `exercise_media_snapshot`.
- Keeps uploaded storage paths out of the workout-list payload.
- Adds `public.get_my_student_exercise_media(uuid)` for on-demand authorized media lookup by `treino_exercicio_id`.
- Uses `auth.uid()` and `alunos.student_user_id` as the trusted identity chain.
- Denies draft, archived, cross-student, cross-professional and anonymous access.
- Returns TTL `600` seconds for uploaded-video signed URL generation.

## Frontend

- `ExerciseVideoPlayer` now supports YouTube and uploaded videos.
- YouTube uses `youtube-nocookie` embed URLs derived from validated IDs.
- Uploaded videos use native `<video controls preload="metadata">`.
- Signed URLs are created only when the student opens an uploaded-video demonstration.
- Loading, error, retry and no-media states are handled per exercise without blocking the workout.
- Signed URLs are kept in component state only and are not persisted.

## Data Minimization

The student workout payload includes exercise prescription, safe YouTube metadata and an uploaded-video marker. It does not expose owner IDs, generic library data, internal audit fields or persistent signed URLs.
