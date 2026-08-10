alter table public.alunos
  add column if not exists student_user_id uuid;

comment on column public.alunos.user_id is 'Professional owner user id. This value remains the tenant boundary for professional operations.';
comment on column public.alunos.student_user_id is 'Authenticated student account allowed to read its own minimized workout prescription contract.';

alter table only public.alunos drop constraint if exists alunos_student_user_id_fkey;
alter table only public.alunos
  add constraint alunos_student_user_id_fkey
  foreign key (student_user_id) references auth.users(id) on delete set null;

create unique index if not exists alunos_student_user_id_uidx
  on public.alunos using btree (student_user_id)
  where student_user_id is not null;

create index if not exists alunos_student_user_id_idx
  on public.alunos using btree (student_user_id)
  where student_user_id is not null;

alter table only public.perfis drop constraint if exists perfis_role_check;
alter table only public.perfis
  add constraint perfis_role_check check (role in ('admin', 'user', 'student'));

create or replace function public.vincular_aluno_usuario(p_aluno_id uuid, p_student_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_professional_user_id uuid := auth.uid();
  v_existing_student_user_id uuid;
  v_student_profile public.perfis%rowtype;
begin
  if v_professional_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if p_aluno_id is null or p_student_user_id is null then
    raise exception using errcode = '22023', message = 'STUDENT_LINK_REQUIRED';
  end if;

  select student_user_id
    into v_existing_student_user_id
  from public.alunos
  where id = p_aluno_id
    and user_id = v_professional_user_id
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'STUDENT_LINK_NOT_AUTHORIZED';
  end if;

  select *
    into v_student_profile
  from public.perfis
  where user_id = p_student_user_id;

  if not found or v_student_profile.role <> 'student' or v_student_profile.status <> 'ativo' then
    raise exception using errcode = '22023', message = 'STUDENT_LINK_INVALID_ROLE';
  end if;

  if p_student_user_id = v_professional_user_id then
    raise exception using errcode = '22023', message = 'STUDENT_LINK_PROFESSIONAL_ACCOUNT_FORBIDDEN';
  end if;

  if v_existing_student_user_id is not null and v_existing_student_user_id <> p_student_user_id then
    raise exception using errcode = '23505', message = 'STUDENT_ALREADY_LINKED';
  end if;

  if exists (
    select 1
    from public.alunos
    where student_user_id = p_student_user_id
      and id <> p_aluno_id
  ) then
    raise exception using errcode = '23505', message = 'STUDENT_ACCOUNT_ALREADY_LINKED';
  end if;

  update public.alunos
  set student_user_id = p_student_user_id
  where id = p_aluno_id
    and user_id = v_professional_user_id;

  return jsonb_build_object(
    'aluno_id', p_aluno_id,
    'student_user_id', p_student_user_id,
    'linked', true
  );
end;
$$;

create or replace function public.desvincular_aluno_usuario(p_aluno_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_professional_user_id uuid := auth.uid();
  v_previous_student_user_id uuid;
begin
  if v_professional_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if p_aluno_id is null then
    raise exception using errcode = '22023', message = 'STUDENT_UNLINK_REQUIRED';
  end if;

  select student_user_id
    into v_previous_student_user_id
  from public.alunos
  where id = p_aluno_id
    and user_id = v_professional_user_id
  for update;

  if not found then
    raise exception using errcode = '42501', message = 'STUDENT_UNLINK_NOT_AUTHORIZED';
  end if;

  update public.alunos
  set student_user_id = null
  where id = p_aluno_id
    and user_id = v_professional_user_id;

  return jsonb_build_object(
    'aluno_id', p_aluno_id,
    'previous_student_user_id', v_previous_student_user_id,
    'linked', false
  );
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
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select id
    into v_aluno_id
  from public.alunos
  where student_user_id = v_student_user_id;

  if v_aluno_id is null then
    return jsonb_build_object(
      'student', null,
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

revoke all on function public.vincular_aluno_usuario(uuid, uuid) from public;
revoke all on function public.desvincular_aluno_usuario(uuid) from public;
revoke all on function public.get_my_student_workouts() from public;
grant execute on function public.vincular_aluno_usuario(uuid, uuid) to authenticated;
grant execute on function public.desvincular_aluno_usuario(uuid) to authenticated;
grant execute on function public.get_my_student_workouts() to authenticated;
