alter table public.treinos
  add column if not exists lifecycle_status text default 'draft',
  add column if not exists template_origin_id text,
  add column if not exists template_origin_type text,
  add column if not exists template_origin_name text,
  add column if not exists template_origin_snapshot jsonb,
  add column if not exists applied_by uuid,
  add column if not exists applied_at timestamptz,
  add column if not exists delivered_by uuid,
  add column if not exists delivered_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists data_fim date,
  add column if not exists application_idempotency_key text;

update public.treinos
set lifecycle_status = case
    when lower(coalesce(status, '')) = 'finalizado' then 'completed'
    when lower(coalesce(status, '')) = 'ativo' then 'active'
    when lower(coalesce(status, '')) in ('em revisao', 'em revisão') then 'draft'
    else 'draft'
  end
where lifecycle_status is null
   or lifecycle_status not in ('draft', 'active', 'completed', 'archived');

update public.treinos
set delivered_at = coalesce(delivered_at, created_at, now())
where lifecycle_status = 'active'
  and delivered_at is null;

update public.treinos
set completed_at = coalesce(completed_at, data_revisao::timestamptz, created_at, now())
where lifecycle_status = 'completed'
  and completed_at is null;

alter table public.treinos
  alter column lifecycle_status set default 'draft',
  alter column lifecycle_status set not null;

alter table public.treinos
  drop constraint if exists treinos_lifecycle_status_check,
  add constraint treinos_lifecycle_status_check check (lifecycle_status in ('draft', 'active', 'completed', 'archived'));

alter table public.treinos
  drop constraint if exists treinos_template_origin_type_check,
  add constraint treinos_template_origin_type_check check (template_origin_type is null or template_origin_type in ('official', 'personal'));

alter table public.treinos
  drop constraint if exists treinos_template_origin_snapshot_object_check,
  add constraint treinos_template_origin_snapshot_object_check check (template_origin_snapshot is null or jsonb_typeof(template_origin_snapshot) = 'object');

alter table public.treinos
  drop constraint if exists treinos_lifecycle_dates_check,
  add constraint treinos_lifecycle_dates_check check (
    (lifecycle_status <> 'active' or delivered_at is not null)
    and (lifecycle_status <> 'completed' or completed_at is not null)
    and (lifecycle_status <> 'archived' or archived_at is not null)
  );

create index if not exists treinos_user_aluno_lifecycle_idx on public.treinos using btree (user_id, aluno_id, lifecycle_status);
create index if not exists treinos_user_delivered_at_idx on public.treinos using btree (user_id, delivered_at desc);
create index if not exists treinos_user_template_origin_idx on public.treinos using btree (user_id, template_origin_type, template_origin_id);
create unique index if not exists treinos_user_application_idempotency_uidx on public.treinos using btree (user_id, application_idempotency_key) where application_idempotency_key is not null;

create table if not exists public.treino_eventos (
  id uuid default gen_random_uuid() not null,
  treino_id uuid not null,
  user_id uuid not null,
  aluno_id uuid not null,
  event_type text not null,
  from_status text,
  to_status text,
  actor_id uuid,
  metadata jsonb default '{}'::jsonb not null,
  occurred_at timestamptz default now() not null,
  created_at timestamptz default now() not null
);

alter table only public.treino_eventos drop constraint if exists treino_eventos_pkey;
alter table only public.treino_eventos add constraint treino_eventos_pkey primary key (id);

alter table only public.treino_eventos drop constraint if exists treino_eventos_treino_id_fkey;
alter table only public.treino_eventos add constraint treino_eventos_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete cascade;

alter table only public.treino_eventos drop constraint if exists treino_eventos_aluno_id_fkey;
alter table only public.treino_eventos add constraint treino_eventos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;

alter table only public.treino_eventos drop constraint if exists treino_eventos_event_type_check;
alter table only public.treino_eventos add constraint treino_eventos_event_type_check check (event_type in ('applied', 'delivered', 'status_changed', 'completed', 'archived'));

alter table only public.treino_eventos drop constraint if exists treino_eventos_metadata_object_check;
alter table only public.treino_eventos add constraint treino_eventos_metadata_object_check check (metadata is null or jsonb_typeof(metadata) = 'object');

create index if not exists treino_eventos_user_treino_occurred_idx on public.treino_eventos using btree (user_id, treino_id, occurred_at desc);
create index if not exists treino_eventos_user_aluno_occurred_idx on public.treino_eventos using btree (user_id, aluno_id, occurred_at desc);
create index if not exists treino_eventos_treino_event_type_idx on public.treino_eventos using btree (treino_id, event_type);

alter table public.treino_eventos enable row level security;

drop policy if exists "Usuarios podem listar eventos dos seus treinos" on public.treino_eventos;
create policy "Usuarios podem listar eventos dos seus treinos"
on public.treino_eventos
for select
to authenticated
using (
  auth.uid() = user_id
  and exists (select 1 from public.treinos where treinos.id = treino_eventos.treino_id and treinos.user_id = auth.uid())
);

revoke all on table public.treino_eventos from anon;
revoke all on table public.treino_eventos from authenticated;
grant select on table public.treino_eventos to authenticated;

create or replace function public.salvar_treino_composto(p_treino jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_treino_id uuid := nullif(p_treino->>'id', '')::uuid;
  v_aluno_id uuid := nullif(p_treino->>'alunoId', '')::uuid;
  v_rotina text := btrim(coalesce(p_treino->>'rotina', ''));
  v_status text := coalesce(nullif(btrim(p_treino->>'status'), ''), 'Ativo');
  v_lifecycle_status text := nullif(btrim(coalesce(p_treino->>'lifecycleStatus', p_treino->>'lifecycle_status')), '');
  v_template_origin_id text := nullif(btrim(coalesce(p_treino->>'templateOriginId', p_treino->>'template_origin_id')), '');
  v_template_origin_type text := nullif(btrim(coalesce(p_treino->>'templateOriginType', p_treino->>'template_origin_type')), '');
  v_template_origin_name text := nullif(btrim(coalesce(p_treino->>'templateOriginName', p_treino->>'template_origin_name')), '');
  v_template_origin_snapshot jsonb := coalesce(p_treino->'templateOriginSnapshot', p_treino->'template_origin_snapshot');
  v_application_idempotency_key text := nullif(btrim(coalesce(p_treino->>'applicationIdempotencyKey', p_treino->>'application_idempotency_key')), '');
  v_days jsonb := coalesce(p_treino->'dias', '[]'::jsonb);
  v_day jsonb;
  v_exercise jsonb;
  v_day_id uuid;
  v_day_index integer;
  v_exercise_index integer;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if v_aluno_id is null then
    raise exception using errcode = '22023', message = 'WORKOUT_STUDENT_REQUIRED';
  end if;

  if v_rotina = '' then
    raise exception using errcode = '22023', message = 'WORKOUT_NAME_REQUIRED';
  end if;

  if v_status not in ('Ativo', 'Em revisao', 'Finalizado') then
    raise exception using errcode = '22023', message = 'WORKOUT_STATUS_INVALID';
  end if;

  if v_treino_id is null and v_lifecycle_status is null then
    v_lifecycle_status := 'draft';
  end if;

  if v_treino_id is null then
    v_lifecycle_status := 'draft';
  elsif v_lifecycle_status not in ('draft', 'active', 'completed', 'archived') then
    raise exception using errcode = '22023', message = 'WORKOUT_LIFECYCLE_STATUS_INVALID';
  end if;

  if v_template_origin_type is not null and v_template_origin_type not in ('official', 'personal') then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_INVALID';
  end if;

  if v_template_origin_type is not null and v_template_origin_name is null then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_NAME_REQUIRED';
  end if;

  if v_template_origin_snapshot is not null and jsonb_typeof(v_template_origin_snapshot) <> 'object' then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_SNAPSHOT_INVALID';
  end if;

  if jsonb_typeof(v_days) <> 'array' or jsonb_array_length(v_days) = 0 then
    raise exception using errcode = '22023', message = 'WORKOUT_DAYS_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.alunos
    where id = v_aluno_id
      and user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_STUDENT_FORBIDDEN';
  end if;

  if v_treino_id is not null and not exists (
    select 1
    from public.treinos
    where id = v_treino_id
      and user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_FORBIDDEN';
  end if;

  if v_template_origin_type = 'personal' and v_template_origin_id is not null and not exists (
    select 1
    from public.workout_templates
    where id::text = v_template_origin_id
      and owner_id = v_user_id
      and is_system = false
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_TEMPLATE_FORBIDDEN';
  end if;

  if v_treino_id is null and v_application_idempotency_key is not null then
    select id into v_treino_id
    from public.treinos
    where user_id = v_user_id
      and application_idempotency_key = v_application_idempotency_key
    limit 1;

    if v_treino_id is not null then
      return jsonb_build_object('id', v_treino_id, 'idempotent', true);
    end if;
  end if;

  for v_day, v_day_index in
    select value, ordinality::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    if btrim(coalesce(v_day->>'nome', '')) = '' then
      raise exception using errcode = '22023', message = 'WORKOUT_DAY_NAME_REQUIRED';
    end if;

    if jsonb_typeof(coalesce(v_day->'exercicios', '[]'::jsonb)) <> 'array'
      or jsonb_array_length(coalesce(v_day->'exercicios', '[]'::jsonb)) = 0 then
      raise exception using errcode = '22023', message = 'WORKOUT_EXERCISES_REQUIRED';
    end if;

    for v_exercise, v_exercise_index in
      select value, ordinality::integer
      from jsonb_array_elements(coalesce(v_day->'exercicios', '[]'::jsonb)) with ordinality
    loop
      if btrim(coalesce(v_exercise->>'nome', '')) = '' then
        raise exception using errcode = '22023', message = 'WORKOUT_EXERCISE_NAME_REQUIRED';
      end if;
    end loop;
  end loop;

  if v_treino_id is null then
    insert into public.treinos (
      user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status,
      lifecycle_status, template_origin_id, template_origin_type, template_origin_name,
      template_origin_snapshot, applied_by, applied_at, data_inicio, data_fim, data_revisao,
      application_idempotency_key
    )
    values (
      v_user_id, v_aluno_id, v_rotina, coalesce(p_treino->>'objetivo', ''), coalesce(p_treino->>'nivel', ''),
      coalesce(nullif(p_treino->>'diasPorSemana', '')::integer, jsonb_array_length(v_days)),
      coalesce(p_treino->>'observacoes', ''), v_status, v_lifecycle_status,
      v_template_origin_id, v_template_origin_type, v_template_origin_name, v_template_origin_snapshot,
      case when v_template_origin_type is not null then v_user_id else null end,
      case when v_template_origin_type is not null then now() else null end,
      nullif(p_treino->>'dataInicio', '')::date,
      nullif(coalesce(p_treino->>'dataFim', p_treino->>'data_fim'), '')::date,
      nullif(p_treino->>'dataRevisao', '')::date,
      v_application_idempotency_key
    )
    returning id into v_treino_id;

    if v_template_origin_type is not null then
      insert into public.treino_eventos (
        treino_id, user_id, aluno_id, event_type, from_status, to_status, actor_id, metadata
      )
      values (
        v_treino_id, v_user_id, v_aluno_id, 'applied', null, v_lifecycle_status, v_user_id,
        jsonb_build_object(
          'template_origin_id', v_template_origin_id,
          'template_origin_type', v_template_origin_type,
          'template_origin_name', v_template_origin_name,
          'application_idempotency_key', v_application_idempotency_key
        )
      );
    end if;
  else
    update public.treinos
    set aluno_id = v_aluno_id,
        nome_rotina = v_rotina,
        objetivo = coalesce(p_treino->>'objetivo', ''),
        nivel = coalesce(p_treino->>'nivel', ''),
        dias_semana = coalesce(nullif(p_treino->>'diasPorSemana', '')::integer, jsonb_array_length(v_days)),
        observacoes = coalesce(p_treino->>'observacoes', ''),
        status = v_status,
        lifecycle_status = coalesce(nullif(v_lifecycle_status, ''), lifecycle_status),
        data_inicio = nullif(p_treino->>'dataInicio', '')::date,
        data_fim = nullif(coalesce(p_treino->>'dataFim', p_treino->>'data_fim'), '')::date,
        data_revisao = nullif(p_treino->>'dataRevisao', '')::date
    where id = v_treino_id
      and user_id = v_user_id;
  end if;

  delete from public.treino_dias
  where treino_id = v_treino_id;

  for v_day, v_day_index in
    select value, ordinality::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    insert into public.treino_dias (treino_id, nome, grupo_muscular, ordem)
    values (
      v_treino_id,
      btrim(coalesce(v_day->>'nome', '')),
      coalesce(v_day->>'descricao', ''),
      v_day_index
    )
    returning id into v_day_id;

    for v_exercise, v_exercise_index in
      select value, ordinality::integer
      from jsonb_array_elements(coalesce(v_day->'exercicios', '[]'::jsonb)) with ordinality
    loop
      insert into public.treino_exercicios (
        treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, video_url, ordem
      )
      values (
        v_day_id,
        btrim(coalesce(v_exercise->>'nome', '')),
        coalesce(v_exercise->>'series', ''),
        coalesce(v_exercise->>'repeticoes', ''),
        coalesce(v_exercise->>'carga', ''),
        coalesce(v_exercise->>'descanso', ''),
        coalesce(v_exercise->>'observacoes', ''),
        coalesce(v_exercise->>'video', ''),
        v_exercise_index
      );
    end loop;
  end loop;

  return jsonb_build_object('id', v_treino_id);
end;
$$;

create or replace function public.entregar_treino(p_treino_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_treino public.treinos%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select * into v_treino from public.treinos where id = p_treino_id and user_id = v_user_id for update;
  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_NOT_FOUND';
  end if;

  if not exists (select 1 from public.alunos where id = v_treino.aluno_id and user_id = v_user_id) then
    raise exception using errcode = '42501', message = 'WORKOUT_STUDENT_FORBIDDEN';
  end if;

  if v_treino.lifecycle_status = 'active' then
    return jsonb_build_object('id', v_treino.id, 'lifecycle_status', v_treino.lifecycle_status, 'idempotent', true);
  end if;

  if v_treino.lifecycle_status <> 'draft' then
    raise exception using errcode = '22023', message = 'WORKOUT_INVALID_TRANSITION';
  end if;

  if not exists (select 1 from public.treino_dias where treino_id = v_treino.id)
    or exists (
      select 1 from public.treino_dias d
      where d.treino_id = v_treino.id
        and not exists (select 1 from public.treino_exercicios e where e.treino_dia_id = d.id)
    ) then
    raise exception using errcode = '22023', message = 'WORKOUT_INCOMPLETE';
  end if;

  update public.treinos
  set lifecycle_status = 'active',
      delivered_by = coalesce(delivered_by, v_user_id),
      delivered_at = coalesce(delivered_at, now()),
      completed_at = null,
      archived_at = null
  where id = v_treino.id and user_id = v_user_id
  returning * into v_treino;

  insert into public.treino_eventos (treino_id, user_id, aluno_id, event_type, from_status, to_status, actor_id, metadata)
  values (v_treino.id, v_user_id, v_treino.aluno_id, 'delivered', 'draft', 'active', v_user_id, '{}'::jsonb);

  return jsonb_build_object('id', v_treino.id, 'lifecycle_status', v_treino.lifecycle_status);
end;
$$;

create or replace function public.alterar_estado_treino(p_treino_id uuid, p_lifecycle_status text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_treino public.treinos%rowtype;
  v_next_status text := btrim(coalesce(p_lifecycle_status, ''));
  v_event_type text := 'status_changed';
  v_from_status text;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if v_next_status not in ('completed', 'archived') then
    raise exception using errcode = '22023', message = 'WORKOUT_LIFECYCLE_STATUS_INVALID';
  end if;

  select * into v_treino from public.treinos where id = p_treino_id and user_id = v_user_id for update;
  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_NOT_FOUND';
  end if;

  if not exists (select 1 from public.alunos where id = v_treino.aluno_id and user_id = v_user_id) then
    raise exception using errcode = '42501', message = 'WORKOUT_STUDENT_FORBIDDEN';
  end if;

  if v_treino.lifecycle_status = v_next_status then
    return jsonb_build_object('id', v_treino.id, 'lifecycle_status', v_treino.lifecycle_status, 'idempotent', true);
  end if;

  if not (
    (v_treino.lifecycle_status = 'active' and v_next_status = 'completed')
    or (v_treino.lifecycle_status in ('draft', 'active', 'completed') and v_next_status = 'archived')
  ) then
    raise exception using errcode = '22023', message = 'WORKOUT_INVALID_TRANSITION';
  end if;

  if v_next_status = 'completed' then
    v_event_type := 'completed';
  elsif v_next_status = 'archived' then
    v_event_type := 'archived';
  end if;

  v_from_status := v_treino.lifecycle_status;

  update public.treinos
  set lifecycle_status = v_next_status,
      completed_at = case when v_next_status = 'completed' then coalesce(completed_at, now()) else completed_at end,
      archived_at = case when v_next_status = 'archived' then coalesce(archived_at, now()) else archived_at end
  where id = v_treino.id and user_id = v_user_id
  returning * into v_treino;

  insert into public.treino_eventos (treino_id, user_id, aluno_id, event_type, from_status, to_status, actor_id, metadata)
  values (v_treino.id, v_user_id, v_treino.aluno_id, v_event_type, v_from_status, v_next_status, v_user_id, '{}'::jsonb);

  return jsonb_build_object('id', v_treino.id, 'lifecycle_status', v_treino.lifecycle_status);
end;
$$;

revoke all on function public.salvar_treino_composto(jsonb) from public;
revoke all on function public.entregar_treino(uuid) from public;
revoke all on function public.alterar_estado_treino(uuid, text) from public;
grant execute on function public.salvar_treino_composto(jsonb) to authenticated;
grant execute on function public.entregar_treino(uuid) to authenticated;
grant execute on function public.alterar_estado_treino(uuid, text) to authenticated;
