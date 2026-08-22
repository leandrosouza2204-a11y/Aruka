create table if not exists public.workout_execution_sessions (
  id uuid default gen_random_uuid() not null,
  aluno_id uuid not null,
  treino_id uuid,
  treino_dia_id uuid,
  status text not null default 'in_progress',
  session_date date not null default current_date,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  abandoned_at timestamptz,
  notes text not null default '',
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_pkey;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_pkey primary key (id);
alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_aluno_id_fkey;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;
alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_treino_id_fkey;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete set null;
alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_treino_dia_id_fkey;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_treino_dia_id_fkey foreign key (treino_dia_id) references public.treino_dias(id) on delete set null;
alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_status_check;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_status_check check (status in ('in_progress', 'completed', 'abandoned'));
alter table only public.workout_execution_sessions drop constraint if exists workout_execution_sessions_dates_check;
alter table only public.workout_execution_sessions add constraint workout_execution_sessions_dates_check check (
  (status <> 'completed' or completed_at is not null)
  and (status <> 'abandoned' or abandoned_at is not null)
  and (completed_at is null or abandoned_at is null)
);

create unique index if not exists workout_execution_sessions_active_uidx
  on public.workout_execution_sessions using btree (aluno_id, treino_id, coalesce(treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid))
  where status = 'in_progress';
create unique index if not exists workout_execution_sessions_idempotency_uidx
  on public.workout_execution_sessions using btree (aluno_id, idempotency_key)
  where idempotency_key is not null;
create index if not exists workout_execution_sessions_aluno_recent_idx on public.workout_execution_sessions using btree (aluno_id, session_date desc, started_at desc);
create index if not exists workout_execution_sessions_treino_recent_idx on public.workout_execution_sessions using btree (treino_id, session_date desc) where treino_id is not null;

create table if not exists public.workout_execution_exercises (
  id uuid default gen_random_uuid() not null,
  session_id uuid not null,
  treino_exercicio_id uuid,
  treino_dia_id uuid,
  exercise_name_snapshot text not null,
  prescribed_series_snapshot text not null default '',
  prescribed_reps_snapshot text not null default '',
  prescribed_load_snapshot text not null default '',
  prescribed_rest_snapshot text not null default '',
  prescribed_notes_snapshot text not null default '',
  day_name_snapshot text not null default '',
  group_snapshot text not null default '',
  exercise_order_snapshot integer not null default 0,
  day_order_snapshot integer not null default 0,
  workout_title_snapshot text not null default '',
  status text not null default 'not_started',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table only public.workout_execution_exercises drop constraint if exists workout_execution_exercises_pkey;
alter table only public.workout_execution_exercises add constraint workout_execution_exercises_pkey primary key (id);
alter table only public.workout_execution_exercises drop constraint if exists workout_execution_exercises_session_id_fkey;
alter table only public.workout_execution_exercises add constraint workout_execution_exercises_session_id_fkey foreign key (session_id) references public.workout_execution_sessions(id) on delete cascade;
alter table only public.workout_execution_exercises drop constraint if exists workout_execution_exercises_treino_exercicio_id_fkey;
alter table only public.workout_execution_exercises add constraint workout_execution_exercises_treino_exercicio_id_fkey foreign key (treino_exercicio_id) references public.treino_exercicios(id) on delete set null;
alter table only public.workout_execution_exercises drop constraint if exists workout_execution_exercises_treino_dia_id_fkey;
alter table only public.workout_execution_exercises add constraint workout_execution_exercises_treino_dia_id_fkey foreign key (treino_dia_id) references public.treino_dias(id) on delete set null;
alter table only public.workout_execution_exercises drop constraint if exists workout_execution_exercises_status_check;
alter table only public.workout_execution_exercises add constraint workout_execution_exercises_status_check check (status in ('not_started', 'partial', 'completed', 'skipped'));
create index if not exists workout_execution_exercises_session_order_idx on public.workout_execution_exercises using btree (session_id, day_order_snapshot, exercise_order_snapshot);

create table if not exists public.workout_execution_sets (
  id uuid default gen_random_uuid() not null,
  execution_exercise_id uuid not null,
  set_number integer not null,
  reps integer not null default 0,
  load_value numeric,
  load_unit text not null default 'kg',
  bodyweight boolean not null default false,
  rir integer,
  rpe numeric,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table only public.workout_execution_sets drop constraint if exists workout_execution_sets_pkey;
alter table only public.workout_execution_sets add constraint workout_execution_sets_pkey primary key (id);
alter table only public.workout_execution_sets drop constraint if exists workout_execution_sets_execution_exercise_id_fkey;
alter table only public.workout_execution_sets add constraint workout_execution_sets_execution_exercise_id_fkey foreign key (execution_exercise_id) references public.workout_execution_exercises(id) on delete cascade;
alter table only public.workout_execution_sets drop constraint if exists workout_execution_sets_number_uidx;
alter table only public.workout_execution_sets add constraint workout_execution_sets_number_uidx unique (execution_exercise_id, set_number);
alter table only public.workout_execution_sets drop constraint if exists workout_execution_sets_values_check;
alter table only public.workout_execution_sets add constraint workout_execution_sets_values_check check (
  set_number > 0
  and reps >= 0
  and (load_value is null or load_value >= 0)
  and load_unit in ('kg', 'lb', 'bodyweight', 'machine_level', 'unknown')
  and (rir is null or (rir >= 0 and rir <= 10))
  and (rpe is null or (rpe >= 0 and rpe <= 10))
);
create index if not exists workout_execution_sets_exercise_order_idx on public.workout_execution_sets using btree (execution_exercise_id, set_number);

create or replace function public.set_workout_execution_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_workout_execution_sessions_updated_at on public.workout_execution_sessions;
create trigger set_workout_execution_sessions_updated_at before update on public.workout_execution_sessions for each row execute function public.set_workout_execution_updated_at();
drop trigger if exists set_workout_execution_exercises_updated_at on public.workout_execution_exercises;
create trigger set_workout_execution_exercises_updated_at before update on public.workout_execution_exercises for each row execute function public.set_workout_execution_updated_at();
drop trigger if exists set_workout_execution_sets_updated_at on public.workout_execution_sets;
create trigger set_workout_execution_sets_updated_at before update on public.workout_execution_sets for each row execute function public.set_workout_execution_updated_at();

alter table public.workout_execution_sessions enable row level security;
alter table public.workout_execution_exercises enable row level security;
alter table public.workout_execution_sets enable row level security;

drop policy if exists "Students read own workout execution sessions" on public.workout_execution_sessions;
create policy "Students read own workout execution sessions" on public.workout_execution_sessions for select to authenticated using (
  exists (select 1 from public.alunos a where a.id = aluno_id and a.student_user_id = auth.uid())
);
drop policy if exists "Professionals read own student workout execution sessions" on public.workout_execution_sessions;
create policy "Professionals read own student workout execution sessions" on public.workout_execution_sessions for select to authenticated using (
  exists (select 1 from public.alunos a where a.id = aluno_id and a.user_id = auth.uid())
);
drop policy if exists "Students insert own active workout execution sessions" on public.workout_execution_sessions;
create policy "Students insert own active workout execution sessions" on public.workout_execution_sessions for insert to authenticated with check (
  exists (select 1 from public.alunos a where a.id = aluno_id and a.student_user_id = auth.uid() and a.student_access_status = 'active')
);
drop policy if exists "Students update own in progress workout execution sessions" on public.workout_execution_sessions;
create policy "Students update own in progress workout execution sessions" on public.workout_execution_sessions for update to authenticated using (
  status = 'in_progress'
  and exists (select 1 from public.alunos a where a.id = aluno_id and a.student_user_id = auth.uid() and a.student_access_status = 'active')
) with check (
  exists (select 1 from public.alunos a where a.id = aluno_id and a.student_user_id = auth.uid() and a.student_access_status = 'active')
);

drop policy if exists "Authorized read workout execution exercises" on public.workout_execution_exercises;
create policy "Authorized read workout execution exercises" on public.workout_execution_exercises for select to authenticated using (
  exists (
    select 1 from public.workout_execution_sessions s
    join public.alunos a on a.id = s.aluno_id
    where s.id = session_id and (a.student_user_id = auth.uid() or a.user_id = auth.uid())
  )
);
drop policy if exists "Students write in progress workout execution exercises" on public.workout_execution_exercises;
create policy "Students write in progress workout execution exercises" on public.workout_execution_exercises for all to authenticated using (
  exists (
    select 1 from public.workout_execution_sessions s
    join public.alunos a on a.id = s.aluno_id
    where s.id = session_id and s.status = 'in_progress' and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  )
) with check (
  exists (
    select 1 from public.workout_execution_sessions s
    join public.alunos a on a.id = s.aluno_id
    where s.id = session_id and s.status = 'in_progress' and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  )
);

drop policy if exists "Authorized read workout execution sets" on public.workout_execution_sets;
create policy "Authorized read workout execution sets" on public.workout_execution_sets for select to authenticated using (
  exists (
    select 1 from public.workout_execution_exercises e
    join public.workout_execution_sessions s on s.id = e.session_id
    join public.alunos a on a.id = s.aluno_id
    where e.id = execution_exercise_id and (a.student_user_id = auth.uid() or a.user_id = auth.uid())
  )
);
drop policy if exists "Students write in progress workout execution sets" on public.workout_execution_sets;
create policy "Students write in progress workout execution sets" on public.workout_execution_sets for all to authenticated using (
  exists (
    select 1 from public.workout_execution_exercises e
    join public.workout_execution_sessions s on s.id = e.session_id
    join public.alunos a on a.id = s.aluno_id
    where e.id = execution_exercise_id and s.status = 'in_progress' and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  )
) with check (
  exists (
    select 1 from public.workout_execution_exercises e
    join public.workout_execution_sessions s on s.id = e.session_id
    join public.alunos a on a.id = s.aluno_id
    where e.id = execution_exercise_id and s.status = 'in_progress' and a.student_user_id = auth.uid() and a.student_access_status = 'active'
  )
);

revoke all on table public.workout_execution_sessions from anon;
revoke all on table public.workout_execution_exercises from anon;
revoke all on table public.workout_execution_sets from anon;
grant select, insert, update on table public.workout_execution_sessions to authenticated;
grant select, insert, update on table public.workout_execution_exercises to authenticated;
grant select, insert, update on table public.workout_execution_sets to authenticated;

create or replace function public.workout_execution_session_payload(p_session_id uuid)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'id', s.id,
    'alunoId', s.aluno_id,
    'treinoId', s.treino_id,
    'treinoDiaId', s.treino_dia_id,
    'status', s.status,
    'sessionDate', s.session_date,
    'startedAt', s.started_at,
    'completedAt', s.completed_at,
    'abandonedAt', s.abandoned_at,
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
        'status', e.status,
        'notes', e.notes,
        'sets', coalesce((
          select jsonb_agg(jsonb_build_object(
            'id', sets.id,
            'setNumber', sets.set_number,
            'reps', sets.reps,
            'loadValue', sets.load_value,
            'loadUnit', sets.load_unit,
            'bodyweight', sets.bodyweight,
            'rir', sets.rir,
            'rpe', sets.rpe,
            'completed', sets.completed
          ) order by sets.set_number)
          from public.workout_execution_sets sets
          where sets.execution_exercise_id = e.id
        ), '[]'::jsonb)
      ) order by e.day_order_snapshot, e.exercise_order_snapshot)
      from public.workout_execution_exercises e
      where e.session_id = s.id
    ), '[]'::jsonb)
  )
  from public.workout_execution_sessions s
  where s.id = p_session_id;
$$;

create or replace function public.start_workout_execution_session(
  p_treino_id uuid,
  p_treino_dia_id uuid default null,
  p_idempotency_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_treino public.treinos%rowtype;
  v_session_id uuid;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select * into v_aluno from public.alunos where student_user_id = v_student_user_id;
  if not found or v_aluno.student_access_status <> 'active' then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED';
  end if;

  select * into v_treino from public.treinos where id = p_treino_id and aluno_id = v_aluno.id and lifecycle_status = 'active';
  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_WORKOUT_NOT_AVAILABLE';
  end if;

  if p_treino_dia_id is not null and not exists (select 1 from public.treino_dias where id = p_treino_dia_id and treino_id = p_treino_id) then
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

  insert into public.workout_execution_sessions (aluno_id, treino_id, treino_dia_id, idempotency_key)
  values (v_aluno.id, p_treino_id, p_treino_dia_id, v_key)
  returning id into v_session_id;

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

create or replace function public.save_workout_execution(
  p_session_id uuid,
  p_exercises jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
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
  if jsonb_typeof(coalesce(p_exercises, '[]'::jsonb)) <> 'array' then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_PAYLOAD_INVALID';
  end if;

  for v_exercise in select value from jsonb_array_elements(coalesce(p_exercises, '[]'::jsonb))
  loop
    v_exercise_id := nullif(v_exercise->>'id', '')::uuid;
    v_status := coalesce(nullif(v_exercise->>'status', ''), 'partial');
    if v_status not in ('not_started', 'partial', 'completed', 'skipped') then
      raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_EXERCISE_STATUS_INVALID';
    end if;
    if not exists (select 1 from public.workout_execution_exercises where id = v_exercise_id and session_id = p_session_id) then
      raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_EXERCISE_FORBIDDEN';
    end if;

    update public.workout_execution_exercises
    set status = v_status,
        notes = left(coalesce(v_exercise->>'notes', notes), 1000)
    where id = v_exercise_id and session_id = p_session_id;

    if jsonb_typeof(coalesce(v_exercise->'sets', '[]'::jsonb)) = 'array' then
      for v_set in select value from jsonb_array_elements(coalesce(v_exercise->'sets', '[]'::jsonb))
      loop
        insert into public.workout_execution_sets (
          execution_exercise_id, set_number, reps, load_value, load_unit, bodyweight, rir, rpe, completed
        )
        values (
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
        on conflict (execution_exercise_id, set_number) do update
        set reps = excluded.reps,
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
    when exists (select 1 from public.workout_execution_sets s where s.execution_exercise_id = e.id and s.completed = true) then
      case when e.status = 'completed' then 'completed' else 'partial' end
    else e.status
  end
  where e.session_id = p_session_id;

  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.complete_workout_execution_session(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_session_id uuid;
begin
  select s.id into v_session_id
  from public.workout_execution_sessions s
  join public.alunos a on a.id = s.aluno_id
  where s.id = p_session_id
    and s.status = 'in_progress'
    and a.student_user_id = v_student_user_id
    and a.student_access_status = 'active'
  for update of s;

  if v_session_id is null then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_COMPLETE_INVALID';
  end if;

  if not exists (
    select 1
    from public.workout_execution_exercises e
    left join public.workout_execution_sets sets on sets.execution_exercise_id = e.id
    where e.session_id = p_session_id
      and (e.status in ('completed', 'partial', 'skipped') or sets.completed = true)
  ) then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_COMPLETE_REQUIRES_DATA';
  end if;

  update public.workout_execution_sessions
  set status = 'completed',
      completed_at = coalesce(completed_at, now())
  where id = p_session_id and status = 'in_progress';

  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.abandon_workout_execution_session(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
begin
  update public.workout_execution_sessions s
  set status = 'abandoned',
      abandoned_at = coalesce(abandoned_at, now())
  from public.alunos a
  where s.id = p_session_id
    and s.aluno_id = a.id
    and s.status = 'in_progress'
    and a.student_user_id = v_student_user_id
    and a.student_access_status = 'active';

  if not found then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_ABANDON_INVALID';
  end if;

  return public.workout_execution_session_payload(p_session_id);
end;
$$;

create or replace function public.get_my_workout_execution_state(p_limit integer default 5)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno_id uuid;
begin
  select id into v_aluno_id from public.alunos where student_user_id = v_student_user_id;
  if v_aluno_id is null then
    return jsonb_build_object('currentSession', null, 'recentSessions', '[]'::jsonb);
  end if;

  return jsonb_build_object(
    'currentSession', (
      select public.workout_execution_session_payload(s.id)
      from public.workout_execution_sessions s
      where s.aluno_id = v_aluno_id and s.status = 'in_progress'
      order by s.started_at desc
      limit 1
    ),
    'recentSessions', coalesce((
      select jsonb_agg(public.workout_execution_session_payload(s.id) order by s.started_at desc)
      from (
        select id, started_at
        from public.workout_execution_sessions
        where aluno_id = v_aluno_id and status in ('completed', 'abandoned')
        order by started_at desc
        limit least(greatest(coalesce(p_limit, 5), 1), 10)
      ) s
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.get_student_workout_execution_history(p_aluno_id uuid, p_limit integer default 5)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_professional_user_id uuid := auth.uid();
begin
  if not exists (select 1 from public.alunos where id = p_aluno_id and user_id = v_professional_user_id) then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_HISTORY_FORBIDDEN';
  end if;

  return coalesce((
    select jsonb_agg(public.workout_execution_session_payload(s.id) order by s.started_at desc)
    from (
      select id, started_at
      from public.workout_execution_sessions
      where aluno_id = p_aluno_id
      order by started_at desc
      limit least(greatest(coalesce(p_limit, 5), 1), 10)
    ) s
  ), '[]'::jsonb);
end;
$$;

revoke all on function public.set_workout_execution_updated_at() from public;
revoke all on function public.workout_execution_session_payload(uuid) from public;
revoke all on function public.start_workout_execution_session(uuid, uuid, text) from public;
revoke all on function public.save_workout_execution(uuid, jsonb) from public;
revoke all on function public.complete_workout_execution_session(uuid) from public;
revoke all on function public.abandon_workout_execution_session(uuid) from public;
revoke all on function public.get_my_workout_execution_state(integer) from public;
revoke all on function public.get_student_workout_execution_history(uuid, integer) from public;
grant execute on function public.start_workout_execution_session(uuid, uuid, text) to authenticated;
grant execute on function public.save_workout_execution(uuid, jsonb) to authenticated;
grant execute on function public.complete_workout_execution_session(uuid) to authenticated;
grant execute on function public.abandon_workout_execution_session(uuid) to authenticated;
grant execute on function public.get_my_workout_execution_state(integer) to authenticated;
grant execute on function public.get_student_workout_execution_history(uuid, integer) to authenticated;

comment on table public.workout_execution_sessions is 'Cycle 06 workout execution history foundation. Sessions survive workout archive/edit through snapshots on child rows.';
