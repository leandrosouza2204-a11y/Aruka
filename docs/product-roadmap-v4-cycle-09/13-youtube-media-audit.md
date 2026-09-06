# Product Roadmap v4 - Cycle 09.4 YouTube Media Audit

Stage: 09.4 - YouTube media validation and preview
Base SHA: d74db1689a934a6acc1ac42d930c134b9f281313
Status: READY_FOR_IMPLEMENTATION

## Scope

- Add safe YouTube URL/ID validation for personal exercise media.
- Normalize accepted YouTube inputs to a canonical watch URL.
- Generate no-cookie embed and thumbnail URLs internally from a validated video ID.
- Show preview in the personal exercise create/edit modal.
- Preserve 09.1 schema/RLS, 09.2 read experience and 09.3 personal exercise create/edit/archive.

## Existing Model

The `exercise_library` table already has `youtube_url`, `media_type`, `media_path`, `thumbnail_path` and `media_mime_type` from 09.1. The media constraint supports `media_type = 'youtube'` when `youtube_url` is present and storage fields are null.

SUPABASE CHANGE: NO

## Security Findings

- YouTube media must be parsed through an allowlist, not passed from arbitrary iframe or URL input.
- The UI must build `https://www.youtube-nocookie.com/embed/{videoId}` from a validated ID.
- Thumbnail URLs may be derived for display, but remote thumbnail URLs should not be persisted in storage columns.
- Update flows need to intentionally write media fields so the professional can add, replace or remove YouTube media.

## Decision

Implement 09.4 in application code only.
