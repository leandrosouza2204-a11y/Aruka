create table public.smart_management_locations (
  id uuid default gen_random_uuid() not null,
  professional_id uuid not null,
  name text not null,
  description text default ''::text not null,
  status text default 'active'::text not null,
  archived_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.smart_management_transfer_rules (
  id uuid default gen_random_uuid() not null,
  location_id uuid not null,
  professional_id uuid not null,
  rule_type text not null,
  fixed_amount numeric(10,2),
  per_student_amount numeric(10,2),
  percentage_rate numeric(5,2),
  status text default 'active'::text not null,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table public.smart_management_transfer_tiers (
  id uuid default gen_random_uuid() not null,
  transfer_rule_id uuid not null,
  professional_id uuid not null,
  min_students integer not null,
  max_students integer,
  amount numeric(10,2) not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table only public.smart_management_locations add constraint smart_management_locations_pkey primary key (id);
alter table only public.smart_management_locations add constraint smart_management_locations_professional_id_fkey foreign key (professional_id) references auth.users(id) on delete cascade;
alter table only public.smart_management_locations add constraint smart_management_locations_name_required check (length(btrim(name)) > 0);
alter table only public.smart_management_locations add constraint smart_management_locations_status_check check (status in ('active', 'archived'));
alter table only public.smart_management_locations add constraint smart_management_locations_archive_shape check (
  (status = 'archived' and archived_at is not null)
  or (status = 'active' and archived_at is null)
);

alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_pkey primary key (id);
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_location_id_fkey foreign key (location_id) references public.smart_management_locations(id) on delete cascade;
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_professional_id_fkey foreign key (professional_id) references auth.users(id) on delete cascade;
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_type_check check (rule_type in ('none', 'fixed', 'per_student', 'tiered', 'percentage'));
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_status_check check (status in ('active', 'archived'));
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_metadata_object check (jsonb_typeof(metadata) = 'object');
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_amounts_non_negative check (
  coalesce(fixed_amount, 0) >= 0
  and coalesce(per_student_amount, 0) >= 0
  and coalesce(percentage_rate, 0) >= 0
);
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_shape_check check (
  (rule_type = 'none' and fixed_amount is null and per_student_amount is null and percentage_rate is null)
  or (rule_type = 'fixed' and fixed_amount is not null and per_student_amount is null and percentage_rate is null)
  or (rule_type = 'per_student' and fixed_amount is null and per_student_amount is not null and percentage_rate is null)
  or (rule_type = 'tiered' and fixed_amount is null and per_student_amount is null and percentage_rate is null)
  or (rule_type = 'percentage' and fixed_amount is null and per_student_amount is null and percentage_rate is not null and percentage_rate <= 100)
);
alter table only public.smart_management_transfer_rules add constraint smart_management_transfer_rules_location_owner_unique unique (location_id);

alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_pkey primary key (id);
alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_transfer_rule_id_fkey foreign key (transfer_rule_id) references public.smart_management_transfer_rules(id) on delete cascade;
alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_professional_id_fkey foreign key (professional_id) references auth.users(id) on delete cascade;
alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_students_check check (
  min_students > 0
  and (max_students is null or max_students >= min_students)
);
alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_amount_check check (amount >= 0);
alter table only public.smart_management_transfer_tiers add constraint smart_management_transfer_tiers_unique_min unique (transfer_rule_id, min_students);

create index smart_management_locations_professional_status_idx on public.smart_management_locations using btree (professional_id, status, name);
create index smart_management_transfer_rules_professional_idx on public.smart_management_transfer_rules using btree (professional_id, status);
create index smart_management_transfer_rules_location_idx on public.smart_management_transfer_rules using btree (location_id);
create index smart_management_transfer_tiers_rule_idx on public.smart_management_transfer_tiers using btree (transfer_rule_id, min_students);
create index smart_management_transfer_tiers_professional_idx on public.smart_management_transfer_tiers using btree (professional_id);

create or replace function public.set_smart_management_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.smart_management_current_user_is_professional()
returns boolean
language sql
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.perfis p
    where p.user_id = auth.uid()
      and p.role = 'user'
      and p.status = 'ativo'
  );
$$;

create or replace function public.smart_management_transfer_rule_matches_location_owner()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.smart_management_locations l
    where l.id = new.location_id
      and l.professional_id = new.professional_id
  ) then
    raise exception 'smart management transfer rule must belong to the same professional as its location';
  end if;

  return new;
end;
$$;

create or replace function public.smart_management_transfer_tier_matches_rule_owner()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.smart_management_transfer_rules r
    where r.id = new.transfer_rule_id
      and r.professional_id = new.professional_id
      and r.rule_type = 'tiered'
  ) then
    raise exception 'smart management transfer tier must belong to a tiered rule owned by the same professional';
  end if;

  return new;
end;
$$;

create trigger set_smart_management_locations_updated_at before update on public.smart_management_locations for each row execute function public.set_smart_management_updated_at();
create trigger set_smart_management_transfer_rules_updated_at before update on public.smart_management_transfer_rules for each row execute function public.set_smart_management_updated_at();
create trigger set_smart_management_transfer_tiers_updated_at before update on public.smart_management_transfer_tiers for each row execute function public.set_smart_management_updated_at();
create trigger smart_management_transfer_rule_owner before insert or update on public.smart_management_transfer_rules for each row execute function public.smart_management_transfer_rule_matches_location_owner();
create trigger smart_management_transfer_tier_owner before insert or update on public.smart_management_transfer_tiers for each row execute function public.smart_management_transfer_tier_matches_rule_owner();

alter table public.smart_management_locations enable row level security;
alter table public.smart_management_transfer_rules enable row level security;
alter table public.smart_management_transfer_tiers enable row level security;

create policy "Profissionais gerenciam seus locais inteligentes" on public.smart_management_locations for all to authenticated using (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
) with check (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
);

create policy "Profissionais gerenciam suas regras inteligentes" on public.smart_management_transfer_rules for all to authenticated using (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
) with check (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
);

create policy "Profissionais gerenciam suas faixas inteligentes" on public.smart_management_transfer_tiers for all to authenticated using (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
) with check (
  professional_id = auth.uid()
  and public.smart_management_current_user_is_professional()
);

revoke all on table public.smart_management_locations from anon;
revoke all on table public.smart_management_transfer_rules from anon;
revoke all on table public.smart_management_transfer_tiers from anon;
grant select, insert, update, delete on table public.smart_management_locations to authenticated;
grant select, insert, update, delete on table public.smart_management_transfer_rules to authenticated;
grant select, insert, update, delete on table public.smart_management_transfer_tiers to authenticated;

revoke all on function public.set_smart_management_updated_at() from public;
revoke all on function public.smart_management_current_user_is_professional() from public;
revoke all on function public.smart_management_transfer_rule_matches_location_owner() from public;
revoke all on function public.smart_management_transfer_tier_matches_rule_owner() from public;
grant execute on function public.smart_management_current_user_is_professional() to authenticated, service_role;
grant execute on function public.set_smart_management_updated_at() to service_role;
grant execute on function public.smart_management_transfer_rule_matches_location_owner() to service_role;
grant execute on function public.smart_management_transfer_tier_matches_rule_owner() to service_role;
