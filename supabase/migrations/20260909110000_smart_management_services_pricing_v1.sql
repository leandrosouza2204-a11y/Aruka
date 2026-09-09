create table public.smart_management_services (
  id uuid default gen_random_uuid() not null,
  professional_id uuid not null,
  name text not null,
  description text default ''::text not null,
  service_type text default 'personal_training'::text not null,
  pricing_model text not null,
  price numeric(10,2) not null,
  sessions_per_week integer,
  sessions_per_month integer,
  sessions_in_package integer,
  session_duration_minutes integer,
  min_students integer default 1 not null,
  max_students integer,
  status text default 'active'::text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  archived_at timestamptz
);

alter table only public.smart_management_services add constraint smart_management_services_pkey primary key (id);
alter table only public.smart_management_services add constraint smart_management_services_professional_id_fkey foreign key (professional_id) references auth.users(id) on delete cascade;
alter table only public.smart_management_services add constraint smart_management_services_name_required check (length(btrim(name)) > 0);
alter table only public.smart_management_services add constraint smart_management_services_service_type_check check (service_type in ('personal_training', 'online_coaching', 'assessment', 'other'));
alter table only public.smart_management_services add constraint smart_management_services_pricing_model_check check (pricing_model in ('PER_SESSION', 'PER_STUDENT_SESSION', 'MONTHLY_PACKAGE', 'FIXED_PACKAGE'));
alter table only public.smart_management_services add constraint smart_management_services_price_check check (price >= 0);
alter table only public.smart_management_services add constraint smart_management_services_frequency_check check (
  (sessions_per_week is null or sessions_per_week > 0)
  and (sessions_per_month is null or sessions_per_month > 0)
  and (sessions_in_package is null or sessions_in_package > 0)
  and (session_duration_minutes is null or session_duration_minutes > 0)
);
alter table only public.smart_management_services add constraint smart_management_services_students_check check (
  min_students > 0
  and (max_students is null or max_students >= min_students)
);
alter table only public.smart_management_services add constraint smart_management_services_package_shape_check check (
  (pricing_model = 'FIXED_PACKAGE' and sessions_in_package is not null)
  or (pricing_model <> 'FIXED_PACKAGE' and sessions_in_package is null)
);
alter table only public.smart_management_services add constraint smart_management_services_archive_shape check (
  (status = 'archived' and archived_at is not null)
  or (status = 'active' and archived_at is null)
);
alter table only public.smart_management_services add constraint smart_management_services_status_check check (status in ('active', 'archived'));

create index smart_management_services_professional_status_idx on public.smart_management_services using btree (professional_id, status, name);
create index smart_management_services_pricing_model_idx on public.smart_management_services using btree (professional_id, pricing_model);

create trigger set_smart_management_services_updated_at before update on public.smart_management_services for each row execute function public.set_smart_management_updated_at();

alter table public.smart_management_services enable row level security;

create policy "Profissionais gerenciam seus servicos inteligentes" on public.smart_management_services for all to authenticated using (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
) with check (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
);

create or replace function public.save_smart_management_service(
  p_service_id uuid default null,
  p_name text default '',
  p_description text default '',
  p_service_type text default 'personal_training',
  p_pricing_model text default 'MONTHLY_PACKAGE',
  p_price numeric default 0,
  p_sessions_per_week integer default null,
  p_sessions_per_month integer default null,
  p_sessions_in_package integer default null,
  p_session_duration_minutes integer default null,
  p_min_students integer default 1,
  p_max_students integer default null
)
returns table (service_id uuid)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_professional_id uuid := auth.uid();
  v_service_id uuid;
begin
  if v_professional_id is null or not public.smart_management_current_user_is_professional() then
    raise exception 'only active professionals can manage smart management services' using errcode = '42501';
  end if;

  if length(btrim(coalesce(p_name, ''))) = 0 then
    raise exception 'service name is required' using errcode = '23514';
  end if;

  if p_service_type not in ('personal_training', 'online_coaching', 'assessment', 'other') then
    raise exception 'invalid service type' using errcode = '23514';
  end if;

  if p_pricing_model not in ('PER_SESSION', 'PER_STUDENT_SESSION', 'MONTHLY_PACKAGE', 'FIXED_PACKAGE') then
    raise exception 'invalid pricing model' using errcode = '23514';
  end if;

  if p_price is null or p_price < 0 then
    raise exception 'invalid service price' using errcode = '23514';
  end if;

  if coalesce(p_min_students, 0) < 1 or (p_max_students is not null and p_max_students < p_min_students) then
    raise exception 'invalid student capacity' using errcode = '23514';
  end if;

  if (p_sessions_per_week is not null and p_sessions_per_week < 1)
    or (p_sessions_per_month is not null and p_sessions_per_month < 1)
    or (p_session_duration_minutes is not null and p_session_duration_minutes < 1) then
    raise exception 'invalid service cadence' using errcode = '23514';
  end if;

  if p_pricing_model = 'FIXED_PACKAGE' and coalesce(p_sessions_in_package, 0) < 1 then
    raise exception 'fixed packages require sessions in package' using errcode = '23514';
  end if;

  if p_pricing_model <> 'FIXED_PACKAGE' and p_sessions_in_package is not null then
    raise exception 'sessions in package only applies to fixed packages' using errcode = '23514';
  end if;

  if p_service_id is null then
    insert into public.smart_management_services (
      professional_id, name, description, service_type, pricing_model, price,
      sessions_per_week, sessions_per_month, sessions_in_package,
      session_duration_minutes, min_students, max_students
    )
    values (
      v_professional_id, btrim(p_name), coalesce(p_description, ''), p_service_type,
      p_pricing_model, p_price::numeric(10,2), p_sessions_per_week, p_sessions_per_month,
      p_sessions_in_package, p_session_duration_minutes, p_min_students, p_max_students
    )
    returning id into v_service_id;
  else
    update public.smart_management_services
    set
      name = btrim(p_name),
      description = coalesce(p_description, ''),
      service_type = p_service_type,
      pricing_model = p_pricing_model,
      price = p_price::numeric(10,2),
      sessions_per_week = p_sessions_per_week,
      sessions_per_month = p_sessions_per_month,
      sessions_in_package = p_sessions_in_package,
      session_duration_minutes = p_session_duration_minutes,
      min_students = p_min_students,
      max_students = p_max_students
    where id = p_service_id and professional_id = v_professional_id
    returning id into v_service_id;

    if v_service_id is null then
      raise exception 'smart management service was not found' using errcode = 'P0002';
    end if;
  end if;

  return query select v_service_id;
end;
$$;

revoke all on table public.smart_management_services from anon;
grant select, insert, update, delete on table public.smart_management_services to authenticated;
revoke all on function public.save_smart_management_service(uuid, text, text, text, text, numeric, integer, integer, integer, integer, integer, integer) from public;
grant execute on function public.save_smart_management_service(uuid, text, text, text, text, numeric, integer, integer, integer, integer, integer, integer) to authenticated;
