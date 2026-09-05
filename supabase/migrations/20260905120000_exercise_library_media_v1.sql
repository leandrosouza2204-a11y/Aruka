create table public.exercise_library (
  id uuid default gen_random_uuid() not null,
  owner_id uuid,
  origin text not null,
  name text not null,
  description text default ''::text not null,
  muscle_group text default ''::text not null,
  category text default ''::text not null,
  instructions text default ''::text not null,
  youtube_url text default ''::text not null,
  media_type text,
  media_path text,
  thumbnail_path text,
  media_mime_type text,
  status text default 'active'::text not null,
  metadata jsonb default '{}'::jsonb not null,
  archived_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.exercise_favorites (
  id uuid default gen_random_uuid() not null,
  professional_id uuid not null,
  exercise_id uuid not null,
  created_at timestamptz default now() not null
);

alter table public.treino_exercicios
  add column exercise_id uuid;

alter table only public.exercise_library add constraint exercise_library_pkey primary key (id);
alter table only public.exercise_library add constraint exercise_library_owner_id_fkey foreign key (owner_id) references auth.users(id) on delete cascade;
alter table only public.exercise_library add constraint exercise_library_origin_check check (origin in ('official', 'personal'));
alter table only public.exercise_library add constraint exercise_library_owner_origin_check check (
  (origin = 'official' and owner_id is null)
  or (origin = 'personal' and owner_id is not null)
);
alter table only public.exercise_library add constraint exercise_library_name_required check (length(btrim(name)) > 0);
alter table only public.exercise_library add constraint exercise_library_status_check check (status in ('active', 'archived'));
alter table only public.exercise_library add constraint exercise_library_media_type_check check (media_type is null or media_type in ('youtube', 'uploaded_video'));
alter table only public.exercise_library add constraint exercise_library_media_shape_check check (
  (media_type is null and media_path is null and media_mime_type is null)
  or (media_type = 'youtube' and length(btrim(youtube_url)) > 0 and media_path is null and media_mime_type is null)
  or (media_type = 'uploaded_video' and youtube_url = '' and media_path is not null and media_mime_type in ('video/mp4', 'video/webm', 'video/quicktime'))
);
alter table only public.exercise_library add constraint exercise_library_metadata_object check (jsonb_typeof(metadata) = 'object');

alter table only public.exercise_favorites add constraint exercise_favorites_pkey primary key (id);
alter table only public.exercise_favorites add constraint exercise_favorites_professional_id_fkey foreign key (professional_id) references auth.users(id) on delete cascade;
alter table only public.exercise_favorites add constraint exercise_favorites_exercise_id_fkey foreign key (exercise_id) references public.exercise_library(id) on delete cascade;
alter table only public.exercise_favorites add constraint exercise_favorites_unique unique (professional_id, exercise_id);

alter table only public.treino_exercicios add constraint treino_exercicios_exercise_id_fkey foreign key (exercise_id) references public.exercise_library(id) on delete set null;

create index exercise_library_origin_status_name_idx on public.exercise_library using btree (origin, status, name);
create index exercise_library_owner_status_name_idx on public.exercise_library using btree (owner_id, status, name) where owner_id is not null;
create index exercise_library_muscle_category_idx on public.exercise_library using btree (muscle_group, category) where status = 'active';
create index exercise_favorites_professional_idx on public.exercise_favorites using btree (professional_id, created_at desc);
create index treino_exercicios_exercise_id_idx on public.treino_exercicios using btree (exercise_id) where exercise_id is not null;

create or replace function public.set_exercise_library_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.exercise_is_prescribed_to_current_student(p_exercise_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.treino_exercicios te
    join public.treino_dias td on td.id = te.treino_dia_id
    join public.treinos t on t.id = td.treino_id
    join public.alunos a on a.id = t.aluno_id
    where te.exercise_id = p_exercise_id
      and t.lifecycle_status in ('active', 'completed')
      and a.student_user_id = auth.uid()
      and a.student_access_status = 'active'
  );
$$;

create trigger set_exercise_library_updated_at before update on public.exercise_library for each row execute function public.set_exercise_library_updated_at();

alter table public.exercise_library enable row level security;
alter table public.exercise_favorites enable row level security;

create policy "Profissionais leem biblioteca oficial e propria" on public.exercise_library for select to authenticated using (
  (origin = 'official' and status = 'active')
  or owner_id = auth.uid()
  or public.exercise_is_prescribed_to_current_student(id)
);
create policy "Profissionais criam exercicios pessoais" on public.exercise_library for insert to authenticated with check (
  origin = 'personal'
  and owner_id = auth.uid()
  and status = 'active'
  and exists (select 1 from public.perfis p where p.user_id = auth.uid() and p.role = 'user' and p.status = 'ativo')
);
create policy "Profissionais atualizam exercicios pessoais" on public.exercise_library for update to authenticated using (
  origin = 'personal'
  and owner_id = auth.uid()
  and exists (select 1 from public.perfis p where p.user_id = auth.uid() and p.role = 'user' and p.status = 'ativo')
) with check (
  origin = 'personal'
  and owner_id = auth.uid()
  and exists (select 1 from public.perfis p where p.user_id = auth.uid() and p.role = 'user' and p.status = 'ativo')
);
create policy "Profissionais arquivam exercicios pessoais" on public.exercise_library for delete to authenticated using (false);

create policy "Profissionais leem seus favoritos" on public.exercise_favorites for select to authenticated using (professional_id = auth.uid());
create policy "Profissionais favoritam exercicios visiveis" on public.exercise_favorites for insert to authenticated with check (
  professional_id = auth.uid()
  and exists (
    select 1
    from public.exercise_library e
    where e.id = exercise_favorites.exercise_id
      and e.status = 'active'
      and (e.origin = 'official' or e.owner_id = auth.uid())
  )
);
create policy "Profissionais removem seus favoritos" on public.exercise_favorites for delete to authenticated using (professional_id = auth.uid());

revoke all on table public.exercise_library from anon;
revoke all on table public.exercise_favorites from anon;
grant select, insert, update, delete on table public.exercise_library to authenticated;
grant select, insert, delete on table public.exercise_favorites to authenticated;

revoke all on function public.set_exercise_library_updated_at() from public;
revoke all on function public.exercise_is_prescribed_to_current_student(uuid) from public;
grant execute on function public.set_exercise_library_updated_at() to service_role;
grant execute on function public.exercise_is_prescribed_to_current_student(uuid) to authenticated, service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'exercise-media',
  'exercise-media',
  false,
  104857600,
  array['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy exercise_media_select_authorized
on storage.objects
for select
to authenticated
using (
  bucket_id = 'exercise-media'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.exercise_library e
      where (e.media_path = storage.objects.name or e.thumbnail_path = storage.objects.name)
        and public.exercise_is_prescribed_to_current_student(e.id)
    )
  )
);

create policy exercise_media_insert_own_folder
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'exercise-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy exercise_media_update_own_folder
on storage.objects
for update
to authenticated
using (
  bucket_id = 'exercise-media'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'exercise-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy exercise_media_delete_own_folder
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'exercise-media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
