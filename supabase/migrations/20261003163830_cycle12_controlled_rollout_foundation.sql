begin;

-- Cycle 12.15.2: controlled rollout foundation. The inserted singleton is
-- intentionally OFF and no rollout target is seeded by this migration.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.student_experience_rollout_config (
  singleton boolean primary key default true check (singleton),
  config_version bigint not null default 1 check (config_version > 0),
  global_enabled boolean not null default false,
  emergency_blocked boolean not null default false,
  reason text not null default 'DEFAULT_OFF' check (char_length(reason) between 1 and 500),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table private.student_experience_rollout_targets (
  target_type text not null check (target_type in ('student', 'professional')),
  target_id uuid not null,
  enabled boolean not null,
  reason text not null check (char_length(reason) between 1 and 500),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null,
  primary key (target_type, target_id)
);

create table private.student_experience_rollout_audit (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action_type text not null check (action_type in ('config_updated', 'target_upserted', 'target_removed')),
  target_type text check (target_type is null or target_type in ('config', 'student', 'professional')),
  target_id uuid,
  previous_value jsonb,
  new_value jsonb,
  reason text not null check (char_length(reason) between 1 and 500),
  occurred_at timestamptz not null default now()
);

create table private.student_experience_operational_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_name text not null check (event_name in (
    'rollout_decision', 'route_fallback', 'rpc_error', 'v2_error_boundary',
    'player_start_attempt', 'player_start_confirmed', 'player_resume',
    'player_set_attempt', 'player_set_confirmed', 'player_set_uncertain',
    'player_set_reconciled', 'player_set_conflict',
    'player_completion_attempt', 'player_completion_confirmed',
    'player_cancel', 'player_command_error'
  )),
  experience text check (experience is null or experience in ('v1', 'v2', 'professional')),
  reason_code text check (reason_code is null or char_length(reason_code) <= 80),
  config_version bigint check (config_version is null or config_version >= 0),
  route text check (route is null or char_length(route) <= 300),
  build_version text check (build_version is null or char_length(build_version) <= 120),
  latency_ms integer check (latency_ms is null or latency_ms between 0 and 600000),
  error_category text check (error_category is null or char_length(error_category) <= 80),
  session_id uuid references public.workout_execution_sessions(id) on delete set null,
  occurred_at timestamptz not null default now()
);

alter table private.student_experience_rollout_config enable row level security;
alter table private.student_experience_rollout_targets enable row level security;
alter table private.student_experience_rollout_audit enable row level security;
alter table private.student_experience_operational_events enable row level security;

revoke all on all tables in schema private from public, anon, authenticated;
revoke all on all sequences in schema private from public, anon, authenticated;

create index student_experience_rollout_audit_occurred_idx
  on private.student_experience_rollout_audit (occurred_at desc);
create index student_experience_events_occurred_idx
  on private.student_experience_operational_events (occurred_at desc);
create index student_experience_events_name_occurred_idx
  on private.student_experience_operational_events (event_name, occurred_at desc);
create index student_experience_events_session_idx
  on private.student_experience_operational_events (session_id, occurred_at desc)
  where session_id is not null;

insert into private.student_experience_rollout_config (
  singleton, config_version, global_enabled, emergency_blocked, reason
)
values (true, 1, false, false, 'DEFAULT_OFF');

alter table public.workout_execution_sessions
  add column experience_origin text not null default 'v1';

alter table public.workout_execution_sessions
  add constraint workout_execution_sessions_experience_origin_check
  check (experience_origin in ('v1', 'v2'));

comment on column public.workout_execution_sessions.experience_origin is
  'Server-authoritative immutable UI origin for an in-progress workout session.';

create or replace function private.resolve_student_experience_route(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_profile public.perfis%rowtype;
  v_student public.alunos%rowtype;
  v_config private.student_experience_rollout_config%rowtype;
  v_active record;
  v_student_override boolean;
  v_professional_override boolean;
  v_allowed boolean := false;
  v_reason text := 'UNKNOWN';
begin
  if p_user_id is null then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'AUTH_REQUIRED', 'configVersion', 0
    );
  end if;

  select p.* into v_profile
  from public.perfis p
  where p.user_id = p_user_id;

  if found
     and v_profile.status = 'ativo'
     and (
       v_profile.role = 'admin'
       or v_profile.tipo_acesso = 'admin'
       or (v_profile.role = 'user' and v_profile.tipo_acesso in ('beta', 'assinante'))
     ) then
    return jsonb_build_object(
      'experience', 'professional', 'reasonCode', 'PROFESSIONAL', 'configVersion', 0
    );
  end if;

  select a.* into v_student
  from public.alunos a
  where a.student_user_id = p_user_id;

  if not found then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'STUDENT_NOT_FOUND', 'configVersion', 0
    );
  end if;

  if v_student.student_access_status <> 'active' then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'STUDENT_ACCESS_INACTIVE', 'configVersion', 0
    );
  end if;

  select s.id, s.experience_origin into v_active
  from public.workout_execution_sessions s
  where s.aluno_id = v_student.id
    and s.status = 'in_progress'
  order by s.last_activity_at desc, s.started_at desc, s.id
  limit 1;

  select c.* into v_config
  from private.student_experience_rollout_config c
  where c.singleton;

  if v_active.id is not null then
    return jsonb_build_object(
      'experience', v_active.experience_origin,
      'reasonCode', case when v_active.experience_origin = 'v2' then 'ACTIVE_V2_WORKOUT' else 'ACTIVE_V1_WORKOUT' end,
      'configVersion', coalesce(v_config.config_version, 0),
      'activeWorkout', jsonb_build_object(
        'sessionId', v_active.id,
        'experienceOrigin', v_active.experience_origin
      )
    );
  end if;

  if v_config.singleton is null then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'CONFIG_UNAVAILABLE', 'configVersion', 0
    );
  end if;

  if v_config.emergency_blocked then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'EMERGENCY_BLOCKED', 'configVersion', v_config.config_version
    );
  end if;

  if not v_config.global_enabled then
    return jsonb_build_object(
      'experience', 'v1', 'reasonCode', 'GLOBAL_DISABLED', 'configVersion', v_config.config_version
    );
  end if;

  select t.enabled into v_student_override
  from private.student_experience_rollout_targets t
  where t.target_type = 'student' and t.target_id = v_student.id;

  if v_student_override is not null then
    v_allowed := v_student_override;
    v_reason := case when v_student_override then 'STUDENT_ELIGIBLE' else 'STUDENT_EXPLICIT_DENY' end;
  else
    select t.enabled into v_professional_override
    from private.student_experience_rollout_targets t
    where t.target_type = 'professional' and t.target_id = v_student.user_id;

    v_allowed := coalesce(v_professional_override, false);
    v_reason := case
      when v_professional_override is true then 'PROFESSIONAL_COHORT_ELIGIBLE'
      when v_professional_override is false then 'PROFESSIONAL_EXPLICIT_DENY'
      else 'NOT_IN_COHORT'
    end;
  end if;

  return jsonb_build_object(
    'experience', case when v_allowed then 'v2' else 'v1' end,
    'reasonCode', v_reason,
    'configVersion', v_config.config_version
  );
end;
$$;

revoke all on function private.resolve_student_experience_route(uuid) from public, anon, authenticated;

create or replace function public.get_my_student_experience_route()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_decision jsonb;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  v_decision := private.resolve_student_experience_route(v_user_id);

  begin
    insert into private.student_experience_operational_events (
      actor_user_id, event_name, experience, reason_code, config_version
    ) values (
      v_user_id,
      'rollout_decision',
      v_decision->>'experience',
      v_decision->>'reasonCode',
      coalesce((v_decision->>'configVersion')::bigint, 0)
    );
  exception when others then
    null;
  end;

  return v_decision;
end;
$$;

create or replace function public.admin_set_student_experience_rollout_config(
  p_global_enabled boolean,
  p_emergency_blocked boolean,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
  v_previous jsonb;
  v_next jsonb;
begin
  perform public.admin_validar_acesso();
  if p_global_enabled is null or p_emergency_blocked is null or v_reason is null or char_length(v_reason) > 500 then
    raise exception using errcode = '22023', message = 'ROLLOUT_CONFIG_INVALID';
  end if;

  select to_jsonb(c.*) into v_previous
  from private.student_experience_rollout_config c
  where c.singleton
  for update;

  insert into private.student_experience_rollout_config (
    singleton, config_version, global_enabled, emergency_blocked, reason, updated_at, updated_by
  ) values (
    true, 1, p_global_enabled, p_emergency_blocked, v_reason, now(), v_actor
  )
  on conflict (singleton) do update set
    config_version = private.student_experience_rollout_config.config_version + 1,
    global_enabled = excluded.global_enabled,
    emergency_blocked = excluded.emergency_blocked,
    reason = excluded.reason,
    updated_at = excluded.updated_at,
    updated_by = excluded.updated_by
  returning jsonb_build_object(
    'configVersion', config_version,
    'globalEnabled', global_enabled,
    'emergencyBlocked', emergency_blocked,
    'reason', reason,
    'updatedAt', updated_at
  ) into v_next;

  insert into private.student_experience_rollout_audit (
    actor_user_id, action_type, target_type, previous_value, new_value, reason
  ) values (v_actor, 'config_updated', 'config', v_previous, v_next, v_reason);

  return v_next;
end;
$$;

create or replace function public.admin_set_student_experience_rollout_target(
  p_target_type text,
  p_target_id uuid,
  p_enabled boolean,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_type text := lower(btrim(coalesce(p_target_type, '')));
  v_reason text := nullif(btrim(coalesce(p_reason, '')), '');
  v_previous jsonb;
  v_next jsonb;
  v_version bigint;
begin
  perform public.admin_validar_acesso();
  if v_type not in ('student', 'professional') or p_target_id is null or v_reason is null or char_length(v_reason) > 500 then
    raise exception using errcode = '22023', message = 'ROLLOUT_TARGET_INVALID';
  end if;

  if v_type = 'student' and not exists (select 1 from public.alunos a where a.id = p_target_id) then
    raise exception using errcode = '22023', message = 'ROLLOUT_STUDENT_NOT_FOUND';
  end if;

  if v_type = 'professional' and not exists (
    select 1 from public.perfis p
    where p.user_id = p_target_id
      and p.status = 'ativo'
      and (p.role = 'admin' or p.tipo_acesso = 'admin' or (p.role = 'user' and p.tipo_acesso in ('beta', 'assinante')))
  ) then
    raise exception using errcode = '22023', message = 'ROLLOUT_PROFESSIONAL_NOT_FOUND';
  end if;

  select to_jsonb(t.*) into v_previous
  from private.student_experience_rollout_targets t
  where t.target_type = v_type and t.target_id = p_target_id
  for update;

  if p_enabled is null then
    delete from private.student_experience_rollout_targets t
    where t.target_type = v_type and t.target_id = p_target_id;
    v_next := null;
  else
    insert into private.student_experience_rollout_targets (
      target_type, target_id, enabled, reason, updated_at, updated_by
    ) values (v_type, p_target_id, p_enabled, v_reason, now(), v_actor)
    on conflict (target_type, target_id) do update set
      enabled = excluded.enabled,
      reason = excluded.reason,
      updated_at = excluded.updated_at,
      updated_by = excluded.updated_by
    returning jsonb_build_object(
      'targetType', target_type,
      'targetId', target_id,
      'enabled', enabled,
      'reason', reason,
      'updatedAt', updated_at
    ) into v_next;
  end if;

  insert into private.student_experience_rollout_config (
    singleton, config_version, global_enabled, emergency_blocked, reason, updated_at, updated_by
  ) values (true, 1, false, false, 'DEFAULT_OFF', now(), v_actor)
  on conflict (singleton) do update set
    config_version = private.student_experience_rollout_config.config_version + 1,
    updated_at = now(),
    updated_by = v_actor
  returning config_version into v_version;

  insert into private.student_experience_rollout_audit (
    actor_user_id, action_type, target_type, target_id, previous_value, new_value, reason
  ) values (
    v_actor,
    case when p_enabled is null then 'target_removed' else 'target_upserted' end,
    v_type,
    p_target_id,
    v_previous,
    v_next,
    v_reason
  );

  return jsonb_build_object('configVersion', v_version, 'target', v_next);
end;
$$;

create or replace function public.record_student_experience_event(
  p_event_name text,
  p_experience text default null,
  p_reason_code text default null,
  p_config_version bigint default null,
  p_route text default null,
  p_build_version text default null,
  p_latency_ms integer default null,
  p_error_category text default null,
  p_session_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_event text := lower(btrim(coalesce(p_event_name, '')));
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if v_event not in (
    'rollout_decision', 'route_fallback', 'rpc_error', 'v2_error_boundary',
    'player_start_attempt', 'player_start_confirmed', 'player_resume',
    'player_set_attempt', 'player_set_confirmed', 'player_set_uncertain',
    'player_set_reconciled', 'player_set_conflict',
    'player_completion_attempt', 'player_completion_confirmed',
    'player_cancel', 'player_command_error'
  ) then
    raise exception using errcode = '22023', message = 'TELEMETRY_EVENT_INVALID';
  end if;

  if p_session_id is not null and not exists (
    select 1
    from public.workout_execution_sessions s
    join public.alunos a on a.id = s.aluno_id
    where s.id = p_session_id and a.student_user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'TELEMETRY_SESSION_NOT_OWNED';
  end if;

  insert into private.student_experience_operational_events (
    actor_user_id, event_name, experience, reason_code, config_version,
    route, build_version, latency_ms, error_category, session_id
  ) values (
    v_user_id,
    v_event,
    case when p_experience in ('v1', 'v2', 'professional') then p_experience else null end,
    left(nullif(btrim(coalesce(p_reason_code, '')), ''), 80),
    case when p_config_version >= 0 then p_config_version else null end,
    left(nullif(btrim(coalesce(p_route, '')), ''), 300),
    left(nullif(btrim(coalesce(p_build_version, '')), ''), 120),
    case when p_latency_ms between 0 and 600000 then p_latency_ms else null end,
    left(nullif(btrim(coalesce(p_error_category, '')), ''), 80),
    p_session_id
  );
end;
$$;

create or replace function public.admin_list_student_experience_events(
  p_since timestamptz default (now() - interval '24 hours'),
  p_limit integer default 200
)
returns setof jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
begin
  perform public.admin_validar_acesso();
  return query
  select jsonb_build_object(
    'eventName', e.event_name,
    'experience', e.experience,
    'reasonCode', e.reason_code,
    'configVersion', e.config_version,
    'route', e.route,
    'buildVersion', e.build_version,
    'latencyMs', e.latency_ms,
    'errorCategory', e.error_category,
    'sessionId', e.session_id,
    'occurredAt', e.occurred_at
  )
  from private.student_experience_operational_events e
  where e.occurred_at >= coalesce(p_since, now() - interval '24 hours')
  order by e.occurred_at desc, e.id desc
  limit least(greatest(coalesce(p_limit, 200), 1), 1000);
end;
$$;

-- Include the pin in every legacy/canonical session payload.
create or replace function public.workout_execution_session_payload(p_session_id uuid)
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'id', s.id,
    'alunoId', s.aluno_id,
    'treinoId', s.treino_id,
    'treinoDiaId', s.treino_dia_id,
    'experienceOrigin', s.experience_origin,
    'status', s.status,
    'sessionDate', s.session_date,
    'startedAt', s.started_at,
    'completedAt', s.completed_at,
    'abandonedAt', s.abandoned_at,
    'cancelledAt', s.cancelled_at,
    'cancellationReason', s.cancellation_reason,
    'shortDurationConfirmed', s.short_duration_confirmed,
    'lastActivityAt', s.last_activity_at,
    'durationSeconds', case
      when coalesce(s.completed_at, s.cancelled_at, s.abandoned_at) is null then null
      else floor(extract(epoch from coalesce(s.completed_at, s.cancelled_at, s.abandoned_at) - s.started_at))::integer
    end,
    'notes', s.notes,
    'exercises', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'treinoExercicioId', e.treino_exercicio_id,
        'treinoDiaId', e.treino_dia_id,
        'name', e.exercise_name_snapshot,
        'prescribedSeries', e.prescribed_series_snapshot,
        'prescribedReps', e.prescribed_reps_snapshot,
        'prescribedLoad', e.prescribed_load_snapshot,
        'prescribedRest', e.prescribed_rest_snapshot,
        'prescribedNotes', e.prescribed_notes_snapshot,
        'dayName', e.day_name_snapshot,
        'group', e.group_snapshot,
        'exerciseOrder', e.exercise_order_snapshot,
        'dayOrder', e.day_order_snapshot,
        'workoutTitle', e.workout_title_snapshot,
        'trackingConfig', e.tracking_config_snapshot,
        'status', e.status,
        'notes', e.notes,
        'sets', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', ws.id,
            'setNumber', ws.set_number,
            'reps', ws.reps,
            'loadValue', ws.load_value,
            'loadUnit', ws.load_unit,
            'bodyweight', ws.bodyweight,
            'rir', ws.rir,
            'rpe', ws.rpe,
            'completed', ws.completed
          ) order by ws.set_number)
          from public.workout_execution_sets ws
          where ws.execution_exercise_id = e.id
        ), '[]'::jsonb)
      ) order by e.day_order_snapshot, e.exercise_order_snapshot)
      from public.workout_execution_exercises e
      where e.session_id = s.id
    ), '[]'::jsonb)
  )
  from public.workout_execution_sessions s
  where s.id = p_session_id;
$$;

drop function public.start_workout_execution_session(uuid, uuid, text, date);

create function public.start_workout_execution_session(
  p_treino_id uuid,
  p_treino_dia_id uuid default null,
  p_idempotency_key text default null,
  p_session_date date default null,
  p_experience_origin text default 'v1'
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_treino public.treinos%rowtype;
  v_session_id uuid;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
  v_origin text := lower(btrim(coalesce(p_experience_origin, 'v1')));
  v_decision jsonb;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  if v_origin not in ('v1', 'v2') then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_EXPERIENCE_INVALID';
  end if;

  select * into v_aluno from public.alunos where student_user_id = v_student_user_id;
  if not found or v_aluno.student_access_status <> 'active' then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED';
  end if;

  select * into v_treino from public.treinos where id = p_treino_id and aluno_id = v_aluno.id and lifecycle_status = 'active';
  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_WORKOUT_NOT_AVAILABLE';
  end if;

  if p_treino_dia_id is not null and not exists (
    select 1 from public.treino_dias where id = p_treino_dia_id and treino_id = p_treino_id
  ) then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_DAY_INVALID';
  end if;

  if v_key is not null then
    select id into v_session_id
    from public.workout_execution_sessions
    where aluno_id = v_aluno.id and idempotency_key = v_key
    limit 1;
    if v_session_id is not null then
      return public.workout_execution_session_payload(v_session_id);
    end if;
  end if;

  select id into v_session_id
  from public.workout_execution_sessions
  where aluno_id = v_aluno.id
    and treino_id = p_treino_id
    and coalesce(treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and status = 'in_progress'
  limit 1;
  if v_session_id is not null then
    return public.workout_execution_session_payload(v_session_id);
  end if;

  if p_session_date is null then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_SESSION_DATE_REQUIRED';
  end if;
  if p_session_date < current_date - 31 or p_session_date > current_date + 1 then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_SESSION_DATE_OUT_OF_RANGE';
  end if;

  if v_origin = 'v2' then
    v_decision := private.resolve_student_experience_route(v_student_user_id);
    if v_decision->>'experience' <> 'v2' or v_decision->>'reasonCode' = 'ACTIVE_V1_WORKOUT' then
      raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_V2_NOT_ELIGIBLE';
    end if;
  end if;

  begin
    insert into public.workout_execution_sessions (
      aluno_id, treino_id, treino_dia_id, idempotency_key, session_date, experience_origin
    ) values (
      v_aluno.id, p_treino_id, p_treino_dia_id, v_key, p_session_date, v_origin
    ) returning id into v_session_id;
  exception when unique_violation then
    select id into v_session_id
    from public.workout_execution_sessions
    where aluno_id = v_aluno.id
      and (
        (v_key is not null and idempotency_key = v_key)
        or (
          treino_id = p_treino_id
          and coalesce(treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid)
          and status = 'in_progress'
        )
      )
    order by started_at desc, id
    limit 1;
    if v_session_id is null then
      raise;
    end if;
    return public.workout_execution_session_payload(v_session_id);
  end;

  insert into public.workout_execution_exercises (
    session_id, treino_exercicio_id, treino_dia_id, exercise_name_snapshot,
    prescribed_series_snapshot, prescribed_reps_snapshot, prescribed_load_snapshot,
    prescribed_rest_snapshot, prescribed_notes_snapshot, day_name_snapshot, group_snapshot,
    exercise_order_snapshot, day_order_snapshot, workout_title_snapshot
  )
  select
    v_session_id, e.id, d.id, e.nome,
    coalesce(e.series, ''), coalesce(e.repeticoes, ''), coalesce(e.carga, ''),
    coalesce(e.descanso, ''), coalesce(e.observacoes, ''), coalesce(d.nome, ''),
    coalesce(d.grupo_muscular, ''), coalesce(e.ordem, 0), coalesce(d.ordem, 0),
    coalesce(v_treino.nome_rotina, '')
  from public.treino_dias d
  join public.treino_exercicios e on e.treino_dia_id = d.id
  where d.treino_id = p_treino_id
    and (p_treino_dia_id is null or d.id = p_treino_dia_id)
  order by d.ordem, e.ordem;

  if not exists (select 1 from public.workout_execution_exercises where session_id = v_session_id) then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_EXERCISES_REQUIRED';
  end if;

  return public.workout_execution_session_payload(v_session_id);
end;
$$;

-- Legacy bulk save cannot mutate a V2-pinned session.
create or replace function public.save_workout_execution(p_session_id uuid, p_exercises jsonb default '[]'::jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_session public.workout_execution_sessions%rowtype;
  v_exercise jsonb;
  v_set jsonb;
  v_exercise_id uuid;
  v_status text;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select s.* into v_session
  from public.workout_execution_sessions s
  join public.alunos a on a.id = s.aluno_id
  where s.id = p_session_id
    and a.student_user_id = v_student_user_id
    and a.student_access_status = 'active'
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_SESSION_FORBIDDEN';
  end if;
  if v_session.status <> 'in_progress' then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_SESSION_IMMUTABLE';
  end if;
  if v_session.experience_origin <> 'v1' then
    raise exception using errcode = '55000', message = 'SESSION_EXPERIENCE_CONFLICT';
  end if;
  if jsonb_typeof(coalesce(p_exercises, '[]'::jsonb)) <> 'array' then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_PAYLOAD_INVALID';
  end if;

  for v_exercise in select value from jsonb_array_elements(coalesce(p_exercises, '[]'::jsonb)) loop
    v_exercise_id := nullif(v_exercise->>'id', '')::uuid;
    v_status := coalesce(nullif(v_exercise->>'status', ''), 'partial');
    if v_status not in ('not_started', 'partial', 'completed', 'skipped') then
      raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_EXERCISE_STATUS_INVALID';
    end if;
    if not exists (
      select 1 from public.workout_execution_exercises where id = v_exercise_id and session_id = p_session_id
    ) then
      raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_EXERCISE_FORBIDDEN';
    end if;

    update public.workout_execution_exercises
    set status = v_status, notes = left(coalesce(v_exercise->>'notes', notes), 1000)
    where id = v_exercise_id and session_id = p_session_id;

    if jsonb_typeof(coalesce(v_exercise->'sets', '[]'::jsonb)) = 'array' then
      for v_set in select value from jsonb_array_elements(coalesce(v_exercise->'sets', '[]'::jsonb)) loop
        insert into public.workout_execution_sets (
          execution_exercise_id, set_number, reps, load_value, load_unit, bodyweight, rir, rpe, completed
        ) values (
          v_exercise_id,
          greatest(coalesce((v_set->>'setNumber')::integer, 1), 1),
          greatest(coalesce((v_set->>'reps')::integer, 0), 0),
          nullif(v_set->>'loadValue', '')::numeric,
          coalesce(nullif(v_set->>'loadUnit', ''), 'kg'),
          coalesce((v_set->>'bodyweight')::boolean, false),
          nullif(v_set->>'rir', '')::integer,
          nullif(v_set->>'rpe', '')::numeric,
          coalesce((v_set->>'completed')::boolean, true)
        )
        on conflict (execution_exercise_id, set_number) do update set
          reps = excluded.reps,
          load_value = excluded.load_value,
          load_unit = excluded.load_unit,
          bodyweight = excluded.bodyweight,
          rir = excluded.rir,
          rpe = excluded.rpe,
          completed = excluded.completed;
      end loop;
    end if;
  end loop;

  update public.workout_execution_exercises e
  set status = case
    when e.status = 'skipped' then 'skipped'
    when exists (
      select 1 from public.workout_execution_sets s where s.execution_exercise_id = e.id and s.completed = true
    ) then case when e.status = 'completed' then 'completed' else 'partial' end
    else e.status
  end
  where e.session_id = p_session_id;

  update public.workout_execution_sessions set last_activity_at = now() where id = p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end;
$$;

-- V2 commands cannot mutate a V1-pinned session.
create or replace function public.complete_workout_execution_set(
  p_session_id uuid,
  p_execution_exercise_id uuid,
  p_set_number integer,
  p_values jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_session public.workout_execution_sessions%rowtype;
  v_exercise public.workout_execution_exercises%rowtype;
  v_existing public.workout_execution_sets%rowtype;
  v_values jsonb := coalesce(p_values, '{}'::jsonb);
  v_normalized jsonb;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;
  select s.* into v_session
  from public.workout_execution_sessions s
  join public.alunos a on a.id = s.aluno_id
  where s.id = p_session_id and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  for update;
  if not found then raise exception 'SESSION_NOT_OWNED'; end if;
  if v_session.status <> 'in_progress' then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  if v_session.experience_origin <> 'v2' then raise exception 'SESSION_EXPERIENCE_CONFLICT'; end if;

  select * into v_exercise
  from public.workout_execution_exercises
  where id = p_execution_exercise_id and session_id = p_session_id
  for update;
  if not found or p_set_number < 1 then raise exception 'INVALID_SET'; end if;
  if jsonb_typeof(v_values) <> 'object'
     or exists (select 1 from jsonb_object_keys(v_values) as keys(key) where key not in ('reps','loadValue','loadUnit','bodyweight','rir','rpe'))
     or ((v_values ? 'reps') and not coalesce((v_exercise.tracking_config_snapshot->>'reps')::boolean, false))
     or ((v_values ?| array['loadValue','loadUnit','bodyweight']) and not coalesce((v_exercise.tracking_config_snapshot->>'load')::boolean, false))
     or ((v_values ? 'rir') and not coalesce((v_exercise.tracking_config_snapshot->>'rir')::boolean, false))
     or ((v_values ? 'rpe') and not coalesce((v_exercise.tracking_config_snapshot->>'rpe')::boolean, false))
  then raise exception 'TRACKING_VALIDATION_ERROR'; end if;
  begin
    v_normalized := jsonb_strip_nulls(jsonb_build_object(
      'reps', coalesce((v_values->>'reps')::integer,0),
      'loadValue', nullif(v_values->>'loadValue','')::numeric,
      'loadUnit', coalesce(nullif(v_values->>'loadUnit',''),'kg'),
      'bodyweight', coalesce((v_values->>'bodyweight')::boolean,false),
      'rir', nullif(v_values->>'rir','')::integer,
      'rpe', nullif(v_values->>'rpe','')::numeric
    ));
  exception when invalid_text_representation or numeric_value_out_of_range then
    raise exception 'TRACKING_VALIDATION_ERROR';
  end;
  if (v_normalized->>'reps')::integer < 0
     or (v_normalized ? 'loadValue' and (v_normalized->>'loadValue')::numeric < 0)
     or (v_normalized->>'loadUnit') not in ('kg','lb','bodyweight','machine_level','unknown')
     or (v_normalized ? 'rir' and (v_normalized->>'rir')::integer not between 0 and 10)
     or (v_normalized ? 'rpe' and (v_normalized->>'rpe')::numeric not between 0 and 10)
  then raise exception 'TRACKING_VALIDATION_ERROR'; end if;

  select * into v_existing
  from public.workout_execution_sets
  where execution_exercise_id = p_execution_exercise_id and set_number = p_set_number;
  if found and v_existing.completed then
    if jsonb_strip_nulls(jsonb_build_object(
      'reps',v_existing.reps,'loadValue',v_existing.load_value,'loadUnit',v_existing.load_unit,
      'bodyweight',v_existing.bodyweight,'rir',v_existing.rir,'rpe',v_existing.rpe
    )) is distinct from v_normalized then
      raise exception 'SET_CONFLICT';
    end if;
  else
    insert into public.workout_execution_sets (
      execution_exercise_id,set_number,reps,load_value,load_unit,bodyweight,rir,rpe,completed
    ) values (
      p_execution_exercise_id,p_set_number,(v_normalized->>'reps')::integer,
      nullif(v_normalized->>'loadValue','')::numeric,v_normalized->>'loadUnit',
      (v_normalized->>'bodyweight')::boolean,nullif(v_normalized->>'rir','')::integer,
      nullif(v_normalized->>'rpe','')::numeric,true
    )
    on conflict (execution_exercise_id,set_number) do update set
      reps=excluded.reps,load_value=excluded.load_value,load_unit=excluded.load_unit,
      bodyweight=excluded.bodyweight,rir=excluded.rir,rpe=excluded.rpe,completed=true;
  end if;
  update public.workout_execution_exercises set status='partial' where id=p_execution_exercise_id;
  update public.workout_execution_sessions set last_activity_at=now() where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.skip_workout_execution_exercise(p_session_id uuid, p_execution_exercise_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_origin text;
begin
  select s.experience_origin into v_origin
  from public.workout_execution_sessions s
  join public.alunos a on a.id=s.aluno_id
  where s.id=p_session_id and s.status='in_progress'
    and a.student_user_id=auth.uid() and a.student_access_status='active'
  for update of s;
  if not found then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  if v_origin <> 'v2' then raise exception 'SESSION_EXPERIENCE_CONFLICT'; end if;
  if exists(select 1 from public.workout_execution_sets x where x.execution_exercise_id=p_execution_exercise_id and x.completed) then
    raise exception 'SKIP_AFTER_COMPLETION';
  end if;
  update public.workout_execution_exercises set status='skipped'
  where id=p_execution_exercise_id and session_id=p_session_id;
  if not found then raise exception 'INVALID_EXECUTION_EXERCISE'; end if;
  update public.workout_execution_sessions set last_activity_at=now() where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.cancel_workout_execution_session(p_session_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_origin text;
begin
  select s.status, s.experience_origin into v_status, v_origin
  from public.workout_execution_sessions s
  join public.alunos a on a.id=s.aluno_id
  where s.id=p_session_id and a.student_user_id=auth.uid() and a.student_access_status='active'
  for update of s;
  if not found then raise exception 'SESSION_NOT_OWNED'; end if;
  if v_origin <> 'v2' then raise exception 'SESSION_EXPERIENCE_CONFLICT'; end if;
  if v_status='cancelled' then return public.workout_execution_session_payload(p_session_id); end if;
  if v_status <> 'in_progress' then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  update public.workout_execution_sessions
  set status='cancelled',cancelled_at=now(),cancellation_reason=nullif(left(coalesce(p_reason,''),500),''),last_activity_at=now()
  where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.complete_workout_execution_session_v2(
  p_session_id uuid,
  p_short_duration_confirmed boolean,
  p_feedback_text text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_started timestamptz;
  v_status text;
  v_origin text;
  v_count integer;
  v_feedback text := nullif(btrim(coalesce(p_feedback_text, '')), '');
  v_existing_feedback text;
begin
  if v_feedback is not null and char_length(v_feedback) > 1000 then
    raise exception using errcode = '22023', message = 'FEEDBACK_TOO_LONG';
  end if;
  select s.status, s.started_at, s.experience_origin into v_status, v_started, v_origin
  from public.workout_execution_sessions s
  join public.alunos a on a.id = s.aluno_id
  where s.id = p_session_id and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  for update of s;
  if not found then raise exception using errcode = '42501', message = 'SESSION_NOT_OWNED'; end if;
  if v_origin <> 'v2' then raise exception using errcode = '55000', message = 'SESSION_EXPERIENCE_CONFLICT'; end if;
  if v_status = 'completed' then
    select f.feedback_text into v_existing_feedback
    from public.workout_execution_session_feedback f where f.session_id = p_session_id;
    if v_feedback is distinct from v_existing_feedback then
      raise exception using errcode = '23505', message = 'FEEDBACK_CONFLICT';
    end if;
    return public.workout_execution_session_payload(p_session_id)
      || jsonb_build_object('feedback', v_existing_feedback);
  end if;
  if v_status <> 'in_progress' then raise exception using errcode = '55000', message = 'SESSION_NOT_IN_PROGRESS'; end if;
  select count(*) into v_count
  from public.workout_execution_sets ws
  join public.workout_execution_exercises e on e.id = ws.execution_exercise_id
  where e.session_id = p_session_id and ws.completed;
  if v_count = 0 then raise exception using errcode = '22023', message = 'ZERO_COMPLETED_SETS'; end if;
  if floor(extract(epoch from clock_timestamp() - v_started)) <= 300 and not p_short_duration_confirmed then
    raise exception using errcode = '22023', message = 'SHORT_WORKOUT_CONFIRMATION_REQUIRED';
  end if;
  update public.workout_execution_sessions
  set status='completed',completed_at=now(),short_duration_confirmed=p_short_duration_confirmed,last_activity_at=now()
  where id=p_session_id;
  if v_feedback is not null then
    insert into public.workout_execution_session_feedback (session_id, feedback_text)
    values (p_session_id, v_feedback);
  end if;
  return public.workout_execution_session_payload(p_session_id) || jsonb_build_object('feedback', v_feedback);
end;
$$;

revoke all on function public.get_my_student_experience_route() from public, anon;
grant execute on function public.get_my_student_experience_route() to authenticated;

revoke all on function public.admin_set_student_experience_rollout_config(boolean, boolean, text) from public, anon;
revoke all on function public.admin_set_student_experience_rollout_target(text, uuid, boolean, text) from public, anon;
revoke all on function public.admin_list_student_experience_events(timestamptz, integer) from public, anon;
grant execute on function public.admin_set_student_experience_rollout_config(boolean, boolean, text) to authenticated, service_role;
grant execute on function public.admin_set_student_experience_rollout_target(text, uuid, boolean, text) to authenticated, service_role;
grant execute on function public.admin_list_student_experience_events(timestamptz, integer) to authenticated, service_role;

revoke all on function public.record_student_experience_event(text, text, text, bigint, text, text, integer, text, uuid) from public, anon;
grant execute on function public.record_student_experience_event(text, text, text, bigint, text, text, integer, text, uuid) to authenticated;

revoke all on function public.start_workout_execution_session(uuid, uuid, text, date, text) from public, anon;
grant execute on function public.start_workout_execution_session(uuid, uuid, text, date, text) to authenticated;

-- Preserve the existing command grants after CREATE OR REPLACE.
revoke all on function public.save_workout_execution(uuid, jsonb) from public, anon;
grant execute on function public.save_workout_execution(uuid, jsonb) to authenticated;
revoke all on function public.complete_workout_execution_set(uuid, uuid, integer, jsonb) from public, anon;
revoke all on function public.skip_workout_execution_exercise(uuid, uuid) from public, anon;
revoke all on function public.cancel_workout_execution_session(uuid, text) from public, anon;
revoke all on function public.complete_workout_execution_session_v2(uuid, boolean, text) from public, anon;
grant execute on function public.complete_workout_execution_set(uuid, uuid, integer, jsonb) to authenticated;
grant execute on function public.skip_workout_execution_exercise(uuid, uuid) to authenticated;
grant execute on function public.cancel_workout_execution_session(uuid, text) to authenticated;
grant execute on function public.complete_workout_execution_session_v2(uuid, boolean, text) to authenticated;

commit;
