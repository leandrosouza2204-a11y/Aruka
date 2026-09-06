# Product Roadmap v4 - Cycle 09.5 Video Upload Storage Implementation

Stage: 09.5 - Video upload/storage
Status: IMPLEMENTED

## Delivered

- Added uploaded-video utility with MIME, size, extension, path and payload helpers.
- Added incremental Supabase migration to restrict uploaded exercise video media to MP4/WEBM.
- Added upload mode to the personal exercise form contract.
- Added service upload, replacement, removal, signed URL preview and orphan cleanup behavior.
- Added media selector and upload preview to the existing exercise library modal.
- Kept cards lightweight; uploaded videos do not render players in the list.

## Storage Contract

- Bucket: `exercise-media`.
- Private: true.
- MIME allowlist: `video/mp4`, `video/webm`.
- Max size: 104857600 bytes.
- Path: `<auth.uid()>/exercises/<exercise_id>/<asset_uuid>.<mp4|webm>`.
- Filename strategy: generated UUID plus MIME-derived extension; original filename is not authoritative.

## Mutation Flow

Upload or replace:

1. Validate file in the client.
2. Generate owner-scoped path from authenticated user id.
3. Upload new object.
4. Update `exercise_library`.
5. Remove old object only after the DB mutation succeeds.

Orphan cleanup:

- If upload succeeds and DB mutation fails, the newly uploaded object is removed when possible.

Removal:

- DB reference is cleared first.
- Existing Storage object is removed after a successful DB mutation.

## Preview

- Local selection uses `URL.createObjectURL(file)`.
- Object URLs are revoked when file/modal changes or component unmounts.
- Existing private uploaded media uses a temporary signed URL.
- Signed URLs are never persisted.
