# Product Roadmap v4 - Cycle 09.5 Video Upload Storage Audit

Stage: 09.5 - Video upload/storage
Base SHA: 33900910bfafb44f552f20afca95c9175875428e
Status: READY_FOR_IMPLEMENTATION

## Scope

- Add private professional-owned uploaded video support to personal exercises.
- Use existing `exercise_library` media columns.
- Use private Supabase Storage bucket `exercise-media`.
- Validate MIME and size before upload and keep Storage as final authority.
- Support upload, replacement, removal, preview and cleanup behavior.

## 09.1 Foundation

- Bucket: `exercise-media`.
- Private: yes.
- Size limit: 104857600 bytes.
- Existing path policy: first folder segment must equal `auth.uid()`.
- Existing student read policy: bounded by `exercise_is_prescribed_to_current_student`.
- Existing table media type: `uploaded_video`.

## Gap

The 09.1 bucket and table constraint allowed `video/quicktime` and image MIME values. 09.5 only needs uploaded professional videos and the canonical product choice is MP4/WEBM. A small incremental migration is required to narrow both the bucket allowlist and the table constraint.

SUPABASE CHANGE: YES

Migration: `supabase/migrations/20260906020000_exercise_video_upload_storage_v1.sql`
