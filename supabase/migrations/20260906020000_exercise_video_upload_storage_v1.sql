alter table public.exercise_library drop constraint if exists exercise_library_media_shape_check;

alter table only public.exercise_library add constraint exercise_library_media_shape_check check (
  (media_type is null and media_path is null and media_mime_type is null)
  or (media_type = 'youtube' and length(btrim(youtube_url)) > 0 and media_path is null and media_mime_type is null)
  or (media_type = 'uploaded_video' and youtube_url = '' and media_path is not null and media_mime_type in ('video/mp4', 'video/webm'))
);

update storage.buckets
set public = false,
    file_size_limit = 104857600,
    allowed_mime_types = array['video/mp4', 'video/webm']
where id = 'exercise-media';
