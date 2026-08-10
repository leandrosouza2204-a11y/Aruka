-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 01 WORKOUT DELIVERY SMOKE
-- EXECUTABLE_SMOKE=YES
-- PRODUCTION_ACCESS_ALLOWED=NO_DURING_PREPARATION
-- RUN_ONLY_AFTER_STEP01_APPLY_AND_POSTCHECK
\set ON_ERROR_STOP on

begin;

set local statement_timeout = '60s';

select gen_random_uuid() as smoke_professional_a_id \gset
select gen_random_uuid() as smoke_professional_b_id \gset
select gen_random_uuid() as smoke_aluno_a_id \gset
select gen_random_uuid() as smoke_aluno_b_id \gset
select 'smoke-step01-' || replace(gen_random_uuid()::text, '-', '') as smoke_key \gset
select set_config('app.step01_smoke.professional_a_id', :'smoke_professional_a_id', true);
select set_config('app.step01_smoke.professional_b_id', :'smoke_professional_b_id', true);
select set_config('app.step01_smoke.aluno_a_id', :'smoke_aluno_a_id', true);
select set_config('app.step01_smoke.aluno_b_id', :'smoke_aluno_b_id', true);
select set_config('app.step01_smoke.key', :'smoke_key', true);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  (:'smoke_professional_a_id', :'smoke_key' || '-a@example.invalid', crypt(:'smoke_key', gen_salt('bf')), now(), now(), now()),
  (:'smoke_professional_b_id', :'smoke_key' || '-b@example.invalid', crypt(:'smoke_key', gen_salt('bf')), now(), now(), now());

insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
values
  (:'smoke_professional_a_id', :'smoke_key' || '-prof-a', :'smoke_key' || '-a@example.invalid', 'user', 'assinante', 'ativo'),
  (:'smoke_professional_b_id', :'smoke_key' || '-prof-b', :'smoke_key' || '-b@example.invalid', 'user', 'assinante', 'ativo');

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status, observacoes)
values
  (:'smoke_aluno_a_id', :'smoke_professional_a_id', :'smoke_key' || '-aluno-a', '00000000000', current_date, 'Smoke Step01', 0, 'Ativo', 'temporary step01 smoke fixture'),
  (:'smoke_aluno_b_id', :'smoke_professional_b_id', :'smoke_key' || '-aluno-b', '00000000001', current_date, 'Smoke Step01', 0, 'Ativo', 'temporary step01 smoke fixture');

set local role authenticated;
select set_config('request.jwt.claim.sub', :'smoke_professional_a_id', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select (public.salvar_treino_composto(
  jsonb_build_object(
    'alunoId', :'smoke_aluno_a_id',
    'rotina', :'smoke_key' || '-rotina',
    'status', 'Ativo',
    'templateOriginType', 'official',
    'templateOriginId', :'smoke_key' || '-template',
    'templateOriginName', 'Smoke Step01 Template',
    'templateOriginSnapshot', jsonb_build_object('source', 'step01-smoke', 'key', :'smoke_key'),
    'applicationIdempotencyKey', :'smoke_key' || '-apply',
    'dias', jsonb_build_array(
      jsonb_build_object(
        'nome', 'Dia A',
        'descricao', 'Full body',
        'exercicios', jsonb_build_array(
          jsonb_build_object('nome', 'Agachamento livre', 'series', '3', 'repeticoes', '8', 'carga', 'leve', 'descanso', '60s')
        )
      )
    )
  )
)->>'id')::uuid as smoke_treino_id \gset
select set_config('app.step01_smoke.treino_id', :'smoke_treino_id', true);

do $$
begin
  if not exists (
    select 1
    from public.treinos
    where id = current_setting('app.step01_smoke.treino_id')::uuid
      and user_id = current_setting('app.step01_smoke.professional_a_id')::uuid
      and aluno_id = current_setting('app.step01_smoke.aluno_a_id')::uuid
      and lifecycle_status = 'draft'
      and application_idempotency_key = current_setting('app.step01_smoke.key') || '-apply'
  ) then
    raise exception 'SMOKE_01_CREATE_OR_APPLY_FAIL';
  end if;
end $$;
select 'PASS:SMOKE_01_CREATE_OR_APPLY' as smoke_check;

select public.salvar_treino_composto(
  jsonb_build_object(
    'alunoId', :'smoke_aluno_a_id',
    'rotina', :'smoke_key' || '-rotina',
    'status', 'Ativo',
    'templateOriginType', 'official',
    'templateOriginId', :'smoke_key' || '-template',
    'templateOriginName', 'Smoke Step01 Template',
    'templateOriginSnapshot', jsonb_build_object('source', 'step01-smoke', 'key', :'smoke_key'),
    'applicationIdempotencyKey', :'smoke_key' || '-apply',
    'dias', jsonb_build_array(jsonb_build_object('nome', 'Dia A', 'exercicios', jsonb_build_array(jsonb_build_object('nome', 'Agachamento livre'))))
  )
) as smoke_idempotent_create_result \gset
select set_config('app.step01_smoke.idempotent_create_result', :'smoke_idempotent_create_result', true);

do $$
begin
  if current_setting('app.step01_smoke.idempotent_create_result')::jsonb->>'id' <> current_setting('app.step01_smoke.treino_id') then
    raise exception 'SMOKE_05_IDEMPOTENCY_FAIL: returned different workout id';
  end if;

  if coalesce((current_setting('app.step01_smoke.idempotent_create_result')::jsonb->>'idempotent')::boolean, false) is not true then
    raise exception 'SMOKE_05_IDEMPOTENCY_FAIL: idempotent flag missing';
  end if;

  if (select count(*) from public.treinos where user_id = current_setting('app.step01_smoke.professional_a_id')::uuid and application_idempotency_key = current_setting('app.step01_smoke.key') || '-apply') <> 1 then
    raise exception 'SMOKE_05_IDEMPOTENCY_FAIL: duplicate workout created';
  end if;
end $$;
select 'PASS:SMOKE_05_IDEMPOTENCY' as smoke_check;

do $$
declare
  v_denied boolean := false;
begin
  perform set_config('request.jwt.claim.sub', current_setting('app.step01_smoke.professional_b_id'), true);
  begin
    perform public.entregar_treino(current_setting('app.step01_smoke.treino_id')::uuid);
  exception
    when insufficient_privilege then
      v_denied := true;
    when others then
      if sqlerrm in ('WORKOUT_NOT_FOUND', 'WORKOUT_STUDENT_FORBIDDEN', 'WORKOUT_FORBIDDEN') then
        v_denied := true;
      else
        raise;
      end if;
  end;

  perform set_config('request.jwt.claim.sub', current_setting('app.step01_smoke.professional_a_id'), true);

  if v_denied is not true then
    raise exception 'SMOKE_06_OWNERSHIP_PROTECTION_FAIL';
  end if;
end $$;
select 'PASS:SMOKE_06_OWNERSHIP_PROTECTION' as smoke_check;

select public.entregar_treino(:'smoke_treino_id') as smoke_deliver_result \gset
select set_config('app.step01_smoke.deliver_result', :'smoke_deliver_result', true);

do $$
begin
  if current_setting('app.step01_smoke.deliver_result')::jsonb->>'lifecycle_status' <> 'active' then
    raise exception 'SMOKE_02_DELIVER_FAIL';
  end if;

  if not exists (
    select 1
    from public.treinos
    where id = current_setting('app.step01_smoke.treino_id')::uuid
      and lifecycle_status = 'active'
      and delivered_by = current_setting('app.step01_smoke.professional_a_id')::uuid
      and delivered_at is not null
  ) then
    raise exception 'SMOKE_02_DELIVER_FAIL: persisted active state not found';
  end if;
end $$;
select 'PASS:SMOKE_02_DELIVER' as smoke_check;

select public.alterar_estado_treino(:'smoke_treino_id', 'completed') as smoke_completed_result \gset
select set_config('app.step01_smoke.completed_result', :'smoke_completed_result', true);

do $$
begin
  if current_setting('app.step01_smoke.completed_result')::jsonb->>'lifecycle_status' <> 'completed' then
    raise exception 'SMOKE_03_LIFECYCLE_TRANSITION_FAIL';
  end if;

  if not exists (
    select 1
    from public.treinos
    where id = current_setting('app.step01_smoke.treino_id')::uuid
      and lifecycle_status = 'completed'
      and completed_at is not null
  ) then
    raise exception 'SMOKE_03_LIFECYCLE_TRANSITION_FAIL: completed state not found';
  end if;
end $$;
select 'PASS:SMOKE_03_LIFECYCLE_TRANSITION' as smoke_check;

do $$
begin
  if not exists (select 1 from public.treino_eventos where treino_id = current_setting('app.step01_smoke.treino_id')::uuid and event_type = 'applied' and to_status = 'draft') then
    raise exception 'SMOKE_04_EVENT_AUDIT_FAIL: applied event missing';
  end if;

  if not exists (select 1 from public.treino_eventos where treino_id = current_setting('app.step01_smoke.treino_id')::uuid and event_type = 'delivered' and from_status = 'draft' and to_status = 'active') then
    raise exception 'SMOKE_04_EVENT_AUDIT_FAIL: delivered event missing';
  end if;

  if not exists (select 1 from public.treino_eventos where treino_id = current_setting('app.step01_smoke.treino_id')::uuid and event_type = 'completed' and from_status = 'active' and to_status = 'completed') then
    raise exception 'SMOKE_04_EVENT_AUDIT_FAIL: completed event missing';
  end if;
end $$;
select 'PASS:SMOKE_04_EVENT_AUDIT' as smoke_check;

reset role;

delete from public.treinos where id = :'smoke_treino_id';
delete from public.alunos where id in (:'smoke_aluno_a_id', :'smoke_aluno_b_id');
delete from public.perfis where user_id in (:'smoke_professional_a_id', :'smoke_professional_b_id');
delete from auth.users where id in (:'smoke_professional_a_id', :'smoke_professional_b_id');

do $$
declare
  v_residual_rows integer;
begin
  select
    (select count(*) from public.treinos where id = current_setting('app.step01_smoke.treino_id')::uuid)
    + (select count(*) from public.treino_eventos where treino_id = current_setting('app.step01_smoke.treino_id')::uuid)
    + (select count(*) from public.alunos where id in (current_setting('app.step01_smoke.aluno_a_id')::uuid, current_setting('app.step01_smoke.aluno_b_id')::uuid))
    + (select count(*) from public.perfis where user_id in (current_setting('app.step01_smoke.professional_a_id')::uuid, current_setting('app.step01_smoke.professional_b_id')::uuid))
    + (select count(*) from auth.users where id in (current_setting('app.step01_smoke.professional_a_id')::uuid, current_setting('app.step01_smoke.professional_b_id')::uuid))
  into v_residual_rows;

  if v_residual_rows <> 0 then
    raise exception 'SMOKE_07_CLEANUP_FAIL: residual rows=%', v_residual_rows;
  end if;
end $$;
select 'PASS:SMOKE_07_CLEANUP' as smoke_check;
select 'SMOKE_RESIDUAL_ROWS=0' as smoke_check;
select 'SMOKE_RESULT=PASS' as smoke_result;

rollback;
