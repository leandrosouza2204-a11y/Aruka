-- Cycle 12.2 commands: all resolve ownership from auth.uid(), never client student IDs.
create or replace function public.complete_workout_execution_set(p_session_id uuid, p_execution_exercise_id uuid, p_set_number integer, p_values jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_session public.workout_execution_sessions%rowtype;
  v_exercise public.workout_execution_exercises%rowtype;
  v_existing public.workout_execution_sets%rowtype;
  v_values jsonb := coalesce(p_values, '{}'::jsonb);
  v_normalized jsonb;
begin
  if auth.uid() is null then raise exception 'NOT_AUTHENTICATED'; end if;
  select s.* into v_session from public.workout_execution_sessions s join public.alunos a on a.id=s.aluno_id where s.id=p_session_id and a.student_user_id=auth.uid() and a.student_access_status='active' for update;
  if not found then raise exception 'SESSION_NOT_OWNED'; end if;
  if v_session.status <> 'in_progress' then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  select * into v_exercise from public.workout_execution_exercises where id=p_execution_exercise_id and session_id=p_session_id for update;
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
      'rpe', nullif(v_values->>'rpe','')::numeric));
  exception when invalid_text_representation or numeric_value_out_of_range then
    raise exception 'TRACKING_VALIDATION_ERROR';
  end;
  if (v_normalized->>'reps')::integer < 0
     or (v_normalized ? 'loadValue' and (v_normalized->>'loadValue')::numeric < 0)
     or (v_normalized->>'loadUnit') not in ('kg','lb','bodyweight','machine_level','unknown')
     or (v_normalized ? 'rir' and (v_normalized->>'rir')::integer not between 0 and 10)
     or (v_normalized ? 'rpe' and (v_normalized->>'rpe')::numeric not between 0 and 10)
  then raise exception 'TRACKING_VALIDATION_ERROR'; end if;
  select * into v_existing from public.workout_execution_sets where execution_exercise_id=p_execution_exercise_id and set_number=p_set_number;
  if found and v_existing.completed then
    if jsonb_strip_nulls(jsonb_build_object('reps',v_existing.reps,'loadValue',v_existing.load_value,'loadUnit',v_existing.load_unit,'bodyweight',v_existing.bodyweight,'rir',v_existing.rir,'rpe',v_existing.rpe))
       is distinct from v_normalized then raise exception 'SET_CONFLICT'; end if;
  else
    insert into public.workout_execution_sets(execution_exercise_id,set_number,reps,load_value,load_unit,bodyweight,rir,rpe,completed)
    values(p_execution_exercise_id,p_set_number,(v_normalized->>'reps')::integer,nullif(v_normalized->>'loadValue','')::numeric,v_normalized->>'loadUnit',(v_normalized->>'bodyweight')::boolean,nullif(v_normalized->>'rir','')::integer,nullif(v_normalized->>'rpe','')::numeric,true)
    on conflict (execution_exercise_id,set_number) do update set reps=excluded.reps,load_value=excluded.load_value,load_unit=excluded.load_unit,bodyweight=excluded.bodyweight,rir=excluded.rir,rpe=excluded.rpe,completed=true;
  end if;
  update public.workout_execution_exercises set status='partial' where id=p_execution_exercise_id;
  update public.workout_execution_sessions set last_activity_at=now() where id=p_session_id;
  return public.workout_execution_session_payload(p_session_id);
end; $$;

create or replace function public.skip_workout_execution_exercise(p_session_id uuid, p_execution_exercise_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  perform 1 from public.workout_execution_sessions s join public.alunos a on a.id=s.aluno_id where s.id=p_session_id and s.status='in_progress' and a.student_user_id=auth.uid() and a.student_access_status='active' for update;
  if not found then raise exception 'SESSION_NOT_IN_PROGRESS'; end if;
  if exists(select 1 from public.workout_execution_sets x where x.execution_exercise_id=p_execution_exercise_id and x.completed) then raise exception 'SKIP_AFTER_COMPLETION'; end if;
  update public.workout_execution_exercises set status='skipped' where id=p_execution_exercise_id and session_id=p_session_id;
  if not found then raise exception 'INVALID_EXECUTION_EXERCISE'; end if;
  update public.workout_execution_sessions set last_activity_at=now() where id=p_session_id; return public.workout_execution_session_payload(p_session_id);
end; $$;
