-- Cycle 12.10: professional-owned support channels and a minimized student profile read.
create table if not exists public.professional_contact_settings (
  professional_user_id uuid primary key references auth.users(id) on delete cascade,
  whatsapp_enabled boolean not null default false,
  whatsapp_number text,
  email_enabled boolean not null default false,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_contact_whatsapp_format check (
    whatsapp_number is null or whatsapp_number ~ '^[1-9][0-9]{9,14}$'
  ),
  constraint professional_contact_email_length check (
    contact_email is null or char_length(contact_email) <= 254
  ),
  constraint professional_contact_email_format check (
    contact_email is null or contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint professional_contact_enabled_whatsapp_valid check (
    not whatsapp_enabled or whatsapp_number is not null
  ),
  constraint professional_contact_enabled_email_valid check (
    not email_enabled or contact_email is not null
  )
);

comment on table public.professional_contact_settings is
  'Explicit student-support channels configured by each professional; authentication contacts are never copied here.';

alter table public.professional_contact_settings enable row level security;

revoke all on table public.professional_contact_settings from public, anon, authenticated;

create policy "Professionals can read own contact settings"
on public.professional_contact_settings for select
to authenticated
using ((select auth.uid()) = professional_user_id);

create policy "Professionals can insert own contact settings"
on public.professional_contact_settings for insert
to authenticated
with check ((select auth.uid()) = professional_user_id);

create policy "Professionals can update own contact settings"
on public.professional_contact_settings for update
to authenticated
using ((select auth.uid()) = professional_user_id)
with check ((select auth.uid()) = professional_user_id);

create or replace function public.get_my_professional_contact_settings()
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_settings public.professional_contact_settings%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1 from public.perfis p
    where p.user_id = v_user_id
      and p.status = 'ativo'
      and (
        p.role = 'admin' or p.tipo_acesso = 'admin'
        or (p.role = 'user' and p.tipo_acesso in ('beta', 'assinante'))
      )
  ) then
    raise exception using errcode = '42501', message = 'PROFESSIONAL_ACCESS_REQUIRED';
  end if;

  select s.* into v_settings
  from public.professional_contact_settings s
  where s.professional_user_id = v_user_id;

  return jsonb_build_object(
    'whatsappEnabled', coalesce(v_settings.whatsapp_enabled, false),
    'whatsappNumber', coalesce(v_settings.whatsapp_number, ''),
    'emailEnabled', coalesce(v_settings.email_enabled, false),
    'contactEmail', coalesce(v_settings.contact_email, '')
  );
end;
$$;

create or replace function public.save_my_professional_contact_settings(
  p_whatsapp_enabled boolean,
  p_whatsapp_number text,
  p_email_enabled boolean,
  p_contact_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_whatsapp text := nullif(btrim(coalesce(p_whatsapp_number, '')), '');
  v_email text := nullif(lower(btrim(coalesce(p_contact_email, ''))), '');
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if not exists (
    select 1 from public.perfis p
    where p.user_id = v_user_id
      and p.status = 'ativo'
      and (
        p.role = 'admin' or p.tipo_acesso = 'admin'
        or (p.role = 'user' and p.tipo_acesso in ('beta', 'assinante'))
      )
  ) then
    raise exception using errcode = '42501', message = 'PROFESSIONAL_ACCESS_REQUIRED';
  end if;

  if v_whatsapp is not null and v_whatsapp !~ '^[1-9][0-9]{9,14}$' then
    raise exception using errcode = '22023', message = 'CONTACT_WHATSAPP_INVALID';
  end if;
  if coalesce(p_whatsapp_enabled, false) and v_whatsapp is null then
    raise exception using errcode = '22023', message = 'CONTACT_WHATSAPP_REQUIRED';
  end if;
  if v_email is not null and (char_length(v_email) > 254 or v_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$') then
    raise exception using errcode = '22023', message = 'CONTACT_EMAIL_INVALID';
  end if;
  if coalesce(p_email_enabled, false) and v_email is null then
    raise exception using errcode = '22023', message = 'CONTACT_EMAIL_REQUIRED';
  end if;

  insert into public.professional_contact_settings (
    professional_user_id, whatsapp_enabled, whatsapp_number, email_enabled, contact_email, updated_at
  ) values (
    v_user_id, coalesce(p_whatsapp_enabled, false), v_whatsapp,
    coalesce(p_email_enabled, false), v_email, now()
  )
  on conflict (professional_user_id) do update set
    whatsapp_enabled = excluded.whatsapp_enabled,
    whatsapp_number = excluded.whatsapp_number,
    email_enabled = excluded.email_enabled,
    contact_email = excluded.contact_email,
    updated_at = now();

  return public.get_my_professional_contact_settings();
end;
$$;

create or replace function public.get_my_student_profile_v2()
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_professional_name text;
  v_settings public.professional_contact_settings%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select a.* into v_aluno
  from public.alunos a
  where a.student_user_id = v_user_id;

  if not found then
    raise exception using errcode = '42501', message = 'STUDENT_PROFILE_ACCESS_REQUIRED';
  end if;
  if v_aluno.student_access_status <> 'active' then
    raise exception using errcode = '42501', message = 'STUDENT_PROFILE_ACCESS_REQUIRED';
  end if;

  select nullif(btrim(p.nome), '') into v_professional_name
  from public.perfis p
  where p.user_id = v_aluno.user_id
    and p.status = 'ativo';

  select s.* into v_settings
  from public.professional_contact_settings s
  join public.perfis p
    on p.user_id = s.professional_user_id
   and p.status = 'ativo'
  where s.professional_user_id = v_aluno.user_id;

  return jsonb_build_object(
    'student', jsonb_build_object('name', v_aluno.nome),
    'professional', jsonb_build_object(
      'name', v_professional_name,
      'whatsappNumber', case
        when v_settings.whatsapp_enabled and v_settings.whatsapp_number ~ '^[1-9][0-9]{9,14}$'
          then v_settings.whatsapp_number
        else null
      end,
      'contactEmail', case
        when v_settings.email_enabled
          and char_length(v_settings.contact_email) <= 254
          and v_settings.contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
          then v_settings.contact_email
        else null
      end
    )
  );
end;
$$;

revoke all on function public.get_my_professional_contact_settings() from public, anon;
revoke all on function public.save_my_professional_contact_settings(boolean, text, boolean, text) from public, anon;
revoke all on function public.get_my_student_profile_v2() from public, anon;
grant execute on function public.get_my_professional_contact_settings() to authenticated;
grant execute on function public.save_my_professional_contact_settings(boolean, text, boolean, text) to authenticated;
grant execute on function public.get_my_student_profile_v2() to authenticated;
