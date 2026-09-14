create or replace function public.cancel_workout_execution_session(p_session_id uuid, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_status text; begin
  select s.status into v_status from public.workout_execution_sessions s join public.alunos a on a.id=s.aluno_id where s.id=p_session_id and a.student_user_id=auth.uid() and a.student_access_status='active' for update;
  if not found then raise exception 'SESSION_NOT_OWNED'; end if;
  if v_status='cancelled' then return public.workout_execution_session_payload(p_session_id); end if;
  if v_status <> 'in_progress' then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  update public.workout_execution_sessions set status='cancelled',cancelled_at=now(),cancellation_reason=nullif(left(coalesce(p_reason,''),500),''),last_activity_at=now() where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end; $$;

create or replace function public.complete_workout_execution_session_v2(p_session_id uuid, p_short_duration_confirmed boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_started timestamptz; v_status text; v_count integer; begin
  select s.status,s.started_at into v_status,v_started from public.workout_execution_sessions s join public.alunos a on a.id=s.aluno_id where s.id=p_session_id and a.student_user_id=auth.uid() and a.student_access_status='active' for update;
  if not found then raise exception 'SESSION_NOT_OWNED'; end if;
  if v_status='completed' then return public.workout_execution_session_payload(p_session_id); end if;
  if v_status <> 'in_progress' then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  select count(*) into v_count from public.workout_execution_sets x join public.workout_execution_exercises e on e.id=x.execution_exercise_id where e.session_id=p_session_id and x.completed;
  if v_count=0 then raise exception 'ZERO_COMPLETED_SETS'; end if;
  if floor(extract(epoch from clock_timestamp()-v_started)) <= 300 and not p_short_duration_confirmed then raise exception 'SHORT_WORKOUT_CONFIRMATION_REQUIRED'; end if;
  update public.workout_execution_sessions set status='completed',completed_at=now(),short_duration_confirmed=p_short_duration_confirmed,last_activity_at=now() where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end; $$;
revoke all on function public.complete_workout_execution_set(uuid,uuid,integer,jsonb), public.skip_workout_execution_exercise(uuid,uuid), public.cancel_workout_execution_session(uuid,text), public.complete_workout_execution_session_v2(uuid,boolean) from public, anon;
grant execute on function public.complete_workout_execution_set(uuid,uuid,integer,jsonb), public.skip_workout_execution_exercise(uuid,uuid), public.cancel_workout_execution_session(uuid,text), public.complete_workout_execution_session_v2(uuid,boolean) to authenticated;

-- V2 mutations are command-only. Legacy RPCs are SECURITY DEFINER and remain compatible.
revoke insert, update, delete on table public.workout_execution_sessions from authenticated;
revoke insert, update, delete on table public.workout_execution_exercises from authenticated;
revoke insert, update, delete on table public.workout_execution_sets from authenticated;

drop policy if exists "Students insert own active workout execution sessions" on public.workout_execution_sessions;
drop policy if exists "Students update own in progress workout execution sessions" on public.workout_execution_sessions;
drop policy if exists "Students write in progress workout execution exercises" on public.workout_execution_exercises;
drop policy if exists "Students write in progress workout execution sets" on public.workout_execution_sets;

drop policy if exists "Students read own workout execution sessions" on public.workout_execution_sessions;
drop policy if exists "Professionals read own student workout execution sessions" on public.workout_execution_sessions;
create policy "Authorized read workout execution sessions"
on public.workout_execution_sessions for select to authenticated
using (
  exists (
    select 1 from public.alunos a
    where a.id = aluno_id
      and (a.student_user_id = (select auth.uid()) or a.user_id = (select auth.uid()))
  )
);

drop policy if exists "Authorized read workout execution exercises" on public.workout_execution_exercises;
create policy "Authorized read workout execution exercises"
on public.workout_execution_exercises for select to authenticated
using (
  exists (
    select 1 from public.workout_execution_sessions s
    join public.alunos a on a.id = s.aluno_id
    where s.id = session_id
      and (a.student_user_id = (select auth.uid()) or a.user_id = (select auth.uid()))
  )
);

drop policy if exists "Authorized read workout execution sets" on public.workout_execution_sets;
create policy "Authorized read workout execution sets"
on public.workout_execution_sets for select to authenticated
using (
  exists (
    select 1 from public.workout_execution_exercises e
    join public.workout_execution_sessions s on s.id = e.session_id
    join public.alunos a on a.id = s.aluno_id
    where e.id = execution_exercise_id
      and (a.student_user_id = (select auth.uid()) or a.user_id = (select auth.uid()))
  )
);

revoke all on function public.is_valid_workout_tracking_config(jsonb), public.snapshot_workout_execution_tracking() from public, anon, authenticated;
revoke all on function public.workout_execution_session_payload(uuid) from public, anon, authenticated;
