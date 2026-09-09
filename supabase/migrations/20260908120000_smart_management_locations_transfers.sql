create or replace function public.save_smart_management_location(
  p_location_id uuid default null,
  p_name text default '',
  p_description text default '',
  p_rule_type text default 'none',
  p_amount numeric default null,
  p_tiers jsonb default '[]'::jsonb
)
returns table (location_id uuid)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_professional_id uuid := auth.uid();
  v_location_id uuid;
  v_rule_id uuid;
  v_tier jsonb;
  v_min_students integer;
  v_max_students integer;
  v_amount numeric(10,2);
begin
  if v_professional_id is null or not public.smart_management_current_user_is_professional() then
    raise exception 'only active professionals can manage smart management locations' using errcode = '42501';
  end if;

  if length(btrim(coalesce(p_name, ''))) = 0 then
    raise exception 'location name is required' using errcode = '23514';
  end if;

  if p_rule_type not in ('none', 'fixed', 'per_student', 'tiered', 'percentage') then
    raise exception 'invalid transfer rule type' using errcode = '23514';
  end if;

  if jsonb_typeof(p_tiers) <> 'array' then
    raise exception 'tiers must be an array' using errcode = '23514';
  end if;

  if p_rule_type = 'tiered' and jsonb_array_length(p_tiers) = 0 then
    raise exception 'tiered rules require at least one tier' using errcode = '23514';
  end if;

  if p_rule_type <> 'tiered' and jsonb_array_length(p_tiers) > 0 then
    raise exception 'only tiered rules can include tiers' using errcode = '23514';
  end if;

  if (p_rule_type in ('fixed', 'per_student', 'percentage') and (p_amount is null or p_amount < 0))
    or (p_rule_type = 'percentage' and p_amount > 100)
    or (p_rule_type in ('none', 'tiered') and p_amount is not null) then
    raise exception 'invalid transfer rule amount' using errcode = '23514';
  end if;

  if p_location_id is null then
    insert into public.smart_management_locations (professional_id, name, description)
    values (v_professional_id, btrim(p_name), coalesce(p_description, ''))
    returning id into v_location_id;
  else
    update public.smart_management_locations
    set name = btrim(p_name), description = coalesce(p_description, '')
    where id = p_location_id and professional_id = v_professional_id
    returning id into v_location_id;

    if v_location_id is null then
      raise exception 'smart management location was not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.smart_management_transfer_rules (
    location_id, professional_id, rule_type, fixed_amount, per_student_amount, percentage_rate
  )
  values (
    v_location_id,
    v_professional_id,
    p_rule_type,
    case when p_rule_type = 'fixed' then p_amount else null end,
    case when p_rule_type = 'per_student' then p_amount else null end,
    case when p_rule_type = 'percentage' then p_amount else null end
  )
  on conflict on constraint smart_management_transfer_rules_location_owner_unique do update set
    rule_type = excluded.rule_type,
    fixed_amount = excluded.fixed_amount,
    per_student_amount = excluded.per_student_amount,
    percentage_rate = excluded.percentage_rate,
    status = 'active'
  returning id into v_rule_id;

  delete from public.smart_management_transfer_tiers where transfer_rule_id = v_rule_id;

  for v_tier in select value from jsonb_array_elements(p_tiers)
  loop
    v_min_students := (v_tier ->> 'minStudents')::integer;
    v_max_students := nullif(v_tier ->> 'maxStudents', '')::integer;
    v_amount := (v_tier ->> 'amount')::numeric(10,2);

    if v_min_students < 1 or (v_max_students is not null and v_max_students < v_min_students) or v_amount < 0 then
      raise exception 'invalid transfer tier' using errcode = '23514';
    end if;

    if exists (
      select 1
      from public.smart_management_transfer_tiers t
      where t.transfer_rule_id = v_rule_id
        and not (
          (t.max_students is not null and v_min_students > t.max_students)
          or (v_max_students is not null and v_max_students < t.min_students)
        )
    ) then
      raise exception 'transfer tiers cannot overlap' using errcode = '23514';
    end if;

    insert into public.smart_management_transfer_tiers (
      transfer_rule_id, professional_id, min_students, max_students, amount
    ) values (v_rule_id, v_professional_id, v_min_students, v_max_students, v_amount);
  end loop;

  return query select v_location_id;
end;
$$;

revoke all on function public.save_smart_management_location(uuid, text, text, text, numeric, jsonb) from public;
grant execute on function public.save_smart_management_location(uuid, text, text, text, numeric, jsonb) to authenticated;
