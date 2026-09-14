-- Cycle 12.2 / additive schema only. Legacy RPCs remain supported.
alter table public.treino_exercicios
  add column if not exists tracking_config jsonb not null default '{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'::jsonb;
alter table public.workout_execution_exercises
  add column if not exists tracking_config_snapshot jsonb not null default '{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'::jsonb;
alter table public.workout_execution_sessions
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text,
  add column if not exists short_duration_confirmed boolean not null default false,
  add column if not exists last_activity_at timestamptz;

create or replace function public.is_valid_workout_tracking_config(p_config jsonb)
returns boolean language sql immutable set search_path = '' as $$
  select jsonb_typeof(p_config) = 'object'
    and p_config <> '{}'::jsonb
    and not exists (
      select 1 from jsonb_each(p_config) e(key, value)
      where e.key not in ('load','reps','rir','rpe','duration','distance')
         or jsonb_typeof(e.value) <> 'boolean'
    );
$$;
alter table public.treino_exercicios drop constraint if exists treino_exercicios_tracking_config_check;
alter table public.treino_exercicios add constraint treino_exercicios_tracking_config_check check (public.is_valid_workout_tracking_config(tracking_config));
alter table public.workout_execution_exercises drop constraint if exists workout_execution_exercises_tracking_snapshot_check;
alter table public.workout_execution_exercises add constraint workout_execution_exercises_tracking_snapshot_check check (public.is_valid_workout_tracking_config(tracking_config_snapshot));
alter table public.workout_execution_sessions drop constraint if exists workout_execution_sessions_status_check;
alter table public.workout_execution_sessions add constraint workout_execution_sessions_status_check check (status in ('in_progress','completed','abandoned','cancelled'));
alter table public.workout_execution_sessions drop constraint if exists workout_execution_sessions_dates_check;
alter table public.workout_execution_sessions add constraint workout_execution_sessions_dates_check check (
  (status <> 'completed' or completed_at is not null) and (status <> 'abandoned' or abandoned_at is not null)
  and (status <> 'cancelled' or cancelled_at is not null)
  and (completed_at is null or abandoned_at is null) and (completed_at is null or cancelled_at is null)
  and (abandoned_at is null or cancelled_at is null)
  and (cancellation_reason is null or char_length(cancellation_reason) <= 500)
);

create or replace function public.snapshot_workout_execution_tracking()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  select coalesce(te.tracking_config, '{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'::jsonb)
    into new.tracking_config_snapshot from public.treino_exercicios te where te.id = new.treino_exercicio_id;
  return new;
end; $$;
drop trigger if exists snapshot_workout_execution_tracking on public.workout_execution_exercises;
create trigger snapshot_workout_execution_tracking before insert on public.workout_execution_exercises for each row execute function public.snapshot_workout_execution_tracking();

create index if not exists workout_execution_sessions_valid_history_idx on public.workout_execution_sessions (aluno_id, completed_at desc) where status = 'completed';
create index if not exists workout_execution_exercises_session_id_idx on public.workout_execution_exercises (session_id, id);

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
