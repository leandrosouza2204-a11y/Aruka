alter table public.alunos
  add column if not exists student_access_status text not null default 'not_invited',
  add column if not exists student_access_email text,
  add column if not exists student_access_invited_at timestamptz,
  add column if not exists student_access_activated_at timestamptz,
  add column if not exists student_access_suspended_at timestamptz,
  add column if not exists student_access_revoked_at timestamptz,
  add column if not exists student_access_reason text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'alunos_student_access_status_check'
      and conrelid = 'public.alunos'::regclass
  ) then
    alter table public.alunos
      add constraint alunos_student_access_status_check
      check (student_access_status in ('not_invited', 'invited', 'active', 'suspended', 'revoked'));
  end if;
end;
$$;

create index if not exists alunos_user_student_access_status_idx
  on public.alunos using btree (user_id, student_access_status);

create index if not exists alunos_student_user_access_status_idx
  on public.alunos using btree (student_user_id, student_access_status)
  where student_user_id is not null;

update public.alunos
set student_access_status = 'active',
    student_access_activated_at = coalesce(student_access_activated_at, now()),
    student_access_email = coalesce(student_access_email, auth_users.email::text)
from auth.users auth_users
where public.alunos.student_user_id = auth_users.id
  and public.alunos.student_access_status = 'not_invited';

create or replace function public.get_student_access_state(p_aluno_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_professional_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
begin
  if v_professional_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select *
    into v_aluno
  from public.alunos
  where id = p_aluno_id
    and user_id = v_professional_user_id;

  if v_aluno.id is null then
    raise exception using errcode = '42501', message = 'STUDENT_ACCESS_OWNER_REQUIRED';
  end if;

  return jsonb_build_object(
    'alunoId', v_aluno.id,
    'status', v_aluno.student_access_status,
    'email', coalesce(v_aluno.student_access_email, ''),
    'hasStudentUser', v_aluno.student_user_id is not null,
    'invitedAt', v_aluno.student_access_invited_at,
    'activatedAt', v_aluno.student_access_activated_at,
    'suspendedAt', v_aluno.student_access_suspended_at,
    'revokedAt', v_aluno.student_access_revoked_at,
    'reason', coalesce(v_aluno.student_access_reason, '')
  );
end;
$$;

create or replace function public.manage_student_access(
  p_aluno_id uuid,
  p_action text,
  p_email text default null,
  p_reason text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_professional_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_action text := lower(trim(coalesce(p_action, '')));
  v_email text := nullif(lower(trim(coalesce(p_email, ''))), '');
  v_reason text := left(trim(coalesce(p_reason, '')), 500);
begin
  if v_professional_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select *
    into v_aluno
  from public.alunos
  where id = p_aluno_id
    and user_id = v_professional_user_id
  for update;

  if v_aluno.id is null then
    raise exception using errcode = '42501', message = 'STUDENT_ACCESS_OWNER_REQUIRED';
  end if;

  if v_action not in ('invite', 'activate', 'suspend', 'reactivate', 'revoke') then
    raise exception using errcode = '22023', message = 'STUDENT_ACCESS_ACTION_INVALID';
  end if;

  if v_action in ('invite', 'activate') then
    v_email := coalesce(v_email, nullif(lower(trim(coalesce(v_aluno.student_access_email, ''))), ''));
    if v_email is null or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_EMAIL_REQUIRED';
    end if;
  end if;

  if v_action = 'invite' then
    if v_aluno.student_access_status not in ('not_invited', 'revoked') then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_TRANSITION_INVALID';
    end if;

    update public.alunos
    set student_access_status = 'invited',
        student_access_email = v_email,
        student_access_invited_at = now(),
        student_access_reason = ''
    where id = p_aluno_id;
  elsif v_action = 'activate' then
    if v_aluno.student_access_status not in ('invited', 'active') then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_TRANSITION_INVALID';
    end if;

    if v_aluno.student_user_id is null then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_AUTH_LINK_REQUIRED';
    end if;

    update public.alunos
    set student_access_status = 'active',
        student_access_email = coalesce(v_email, student_access_email),
        student_access_activated_at = now(),
        student_access_reason = ''
    where id = p_aluno_id;
  elsif v_action = 'reactivate' then
    if v_aluno.student_access_status not in ('suspended', 'active') then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_TRANSITION_INVALID';
    end if;

    if v_aluno.student_user_id is null then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_AUTH_LINK_REQUIRED';
    end if;

    update public.alunos
    set student_access_status = 'active',
        student_access_activated_at = now(),
        student_access_reason = ''
    where id = p_aluno_id;
  elsif v_action = 'suspend' then
    if v_aluno.student_access_status not in ('active', 'suspended') then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_TRANSITION_INVALID';
    end if;

    update public.alunos
    set student_access_status = 'suspended',
        student_access_suspended_at = now(),
        student_access_reason = v_reason
    where id = p_aluno_id;
  elsif v_action = 'revoke' then
    if v_aluno.student_access_status not in ('active', 'suspended', 'revoked') then
      raise exception using errcode = '22023', message = 'STUDENT_ACCESS_TRANSITION_INVALID';
    end if;

    update public.alunos
    set student_access_status = 'revoked',
        student_access_revoked_at = now(),
        student_access_reason = v_reason
    where id = p_aluno_id;
  end if;

  return public.get_student_access_state(p_aluno_id);
end;
$$;

create or replace function public.get_my_student_workouts()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno_id uuid;
  v_access_status text;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select id, student_access_status
    into v_aluno_id, v_access_status
  from public.alunos
  where student_user_id = v_student_user_id;

  if v_aluno_id is null then
    return jsonb_build_object(
      'student', null,
      'studentAccess', jsonb_build_object('status', 'not_invited'),
      'activeWorkouts', '[]'::jsonb,
      'completedWorkouts', '[]'::jsonb
    );
  end if;

  if v_access_status <> 'active' then
    return jsonb_build_object(
      'student', (
        select jsonb_build_object(
          'id', a.id,
          'name', a.nome,
          'status', a.status
        )
        from public.alunos a
        where a.id = v_aluno_id
      ),
      'studentAccess', jsonb_build_object('status', v_access_status),
      'activeWorkouts', '[]'::jsonb,
      'completedWorkouts', '[]'::jsonb
    );
  end if;

  return (
    with allowed_workouts as (
      select
        t.id,
        t.nome_rotina,
        t.objetivo,
        t.nivel,
        t.dias_semana,
        t.observacoes,
        t.lifecycle_status,
        t.delivered_at,
        t.completed_at,
        t.created_at
      from public.treinos t
      where t.aluno_id = v_aluno_id
        and t.lifecycle_status in ('active', 'completed')
    ),
    workout_payloads as (
      select
        w.id,
        w.lifecycle_status,
        w.delivered_at,
        w.completed_at,
        w.created_at,
        jsonb_build_object(
          'id', w.id,
          'name', w.nome_rotina,
          'objective', w.objetivo,
          'level', w.nivel,
          'daysPerWeek', w.dias_semana,
          'notes', w.observacoes,
          'lifecycleStatus', w.lifecycle_status,
          'deliveredAt', w.delivered_at,
          'completedAt', w.completed_at,
          'days', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', d.id,
                'name', d.nome,
                'notes', d.grupo_muscular,
                'order', d.ordem,
                'exercises', coalesce((
                  select jsonb_agg(
                    jsonb_build_object(
                      'id', e.id,
                      'name', e.nome,
                      'order', e.ordem,
                      'series', e.series,
                      'repetitions', e.repeticoes,
                      'rest', e.descanso,
                      'prescribedLoad', e.carga,
                      'notes', e.observacoes,
                      'videoUrl', e.video_url
                    )
                    order by e.ordem, e.created_at, e.id
                  )
                  from public.treino_exercicios e
                  where e.treino_dia_id = d.id
                ), '[]'::jsonb)
              )
              order by d.ordem, d.created_at, d.id
            )
            from public.treino_dias d
            where d.treino_id = w.id
          ), '[]'::jsonb)
        ) as payload
      from allowed_workouts w
    )
    select jsonb_build_object(
      'student', (
        select jsonb_build_object(
          'id', a.id,
          'name', a.nome,
          'status', a.status
        )
        from public.alunos a
        where a.id = v_aluno_id
      ),
      'studentAccess', jsonb_build_object('status', 'active'),
      'activeWorkouts', coalesce((
        select jsonb_agg(payload order by delivered_at desc nulls last, created_at desc)
        from workout_payloads
        where lifecycle_status = 'active'
      ), '[]'::jsonb),
      'completedWorkouts', coalesce((
        select jsonb_agg(payload order by completed_at desc nulls last, delivered_at desc nulls last, created_at desc)
        from workout_payloads
        where lifecycle_status = 'completed'
      ), '[]'::jsonb)
    )
  );
end;
$$;

revoke all on function public.get_student_access_state(uuid) from public;
revoke all on function public.manage_student_access(uuid, text, text, text) from public;
revoke all on function public.get_my_student_workouts() from public;
grant execute on function public.get_student_access_state(uuid) to authenticated;
grant execute on function public.manage_student_access(uuid, text, text, text) to authenticated;
grant execute on function public.get_my_student_workouts() to authenticated;
