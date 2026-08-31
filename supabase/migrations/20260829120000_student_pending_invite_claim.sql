create or replace function public.claim_pending_student_invite()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_email text := lower(trim(coalesce(auth.jwt() ->> 'email', '')));
  v_match_count integer := 0;
  v_aluno public.alunos%rowtype;
  v_profile public.perfis%rowtype;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if v_email is null or v_email = '' or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception using errcode = '22023', message = 'STUDENT_INVITE_AUTH_EMAIL_REQUIRED';
  end if;

  select count(*)
    into v_match_count
  from public.alunos
  where student_access_status = 'invited'
    and student_user_id is null
    and lower(trim(coalesce(student_access_email, ''))) = v_email;

  if v_match_count = 0 then
    raise exception using errcode = '02000', message = 'STUDENT_INVITE_NOT_FOUND';
  end if;

  if v_match_count > 1 then
    raise exception using errcode = '21000', message = 'STUDENT_INVITE_AMBIGUOUS';
  end if;

  select *
    into v_aluno
  from public.alunos
  where student_access_status = 'invited'
    and student_user_id is null
    and lower(trim(coalesce(student_access_email, ''))) = v_email
  for update;

  if exists (
    select 1
    from public.alunos
    where student_user_id = v_student_user_id
      and id <> v_aluno.id
  ) then
    raise exception using errcode = '23505', message = 'STUDENT_ACCOUNT_ALREADY_LINKED';
  end if;

  select *
    into v_profile
  from public.perfis
  where user_id = v_student_user_id
  for update;

  if found and (v_profile.role <> 'student' or v_profile.status <> 'ativo') then
    raise exception using errcode = '22023', message = 'STUDENT_INVITE_PROFILE_INCOMPATIBLE';
  end if;

  if not found then
    insert into public.perfis (user_id, email, role, tipo_acesso, status)
    values (v_student_user_id, v_email, 'student', 'pendente', 'ativo');
  end if;

  update public.alunos
  set student_user_id = v_student_user_id,
      student_access_status = 'active',
      student_access_activated_at = now(),
      student_access_reason = ''
  where id = v_aluno.id
    and student_access_status = 'invited'
    and student_user_id is null;

  if not found then
    raise exception using errcode = '40001', message = 'STUDENT_INVITE_STATE_CHANGED';
  end if;

  return public.get_student_access_state(v_aluno.id);
end;
$$;

revoke all on function public.claim_pending_student_invite() from public;
grant execute on function public.claim_pending_student_invite() to authenticated;
