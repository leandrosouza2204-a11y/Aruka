insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avaliacoes-fotos',
  'avaliacoes-fotos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy avaliacoes_fotos_select_own_folder
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_insert_own_folder
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_update_own_folder
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_delete_own_folder
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
