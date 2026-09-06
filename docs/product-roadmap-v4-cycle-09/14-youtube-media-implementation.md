# Product Roadmap v4 - Cycle 09.4 YouTube Media Implementation

Stage: 09.4 - YouTube media validation and preview
Status: IMPLEMENTED

## Delivered

- Added a pure YouTube parser for the exercise library.
- Accepted watch, mobile, short, embed, short-link and raw ID inputs.
- Rejected unsupported hosts, unsafe schemes, HTML/iframe content and invalid video IDs.
- Normalized valid media to canonical watch URL for persistence.
- Generated `youtube-nocookie` embed and `i.ytimg.com` thumbnail URLs only from the validated ID.
- Added optional YouTube media field to the personal exercise modal.
- Added responsive iframe preview with lazy loading and accessible title/description wiring.
- Updated personal exercise mutations so editing can add, replace or remove YouTube media.
- Kept list cards lightweight by using thumbnail imagery only, never video players.

## Data Contract

Persisted fields:

- `youtube_url`: canonical `https://www.youtube.com/watch?v={videoId}` or empty string.
- `media_type`: `youtube` when a valid video is present, otherwise null.
- `media_path`, `thumbnail_path`, `media_mime_type`: null for YouTube media.

Derived-only fields:

- `videoId`
- `embedUrl`
- `thumbnailUrl`

## Supabase

SUPABASE CHANGE: NO

No migration, RLS policy, storage bucket or production database action is required for this stage.
