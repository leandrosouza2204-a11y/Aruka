\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

begin;

-- Managed Supabase grants this role USAGE globally; pg_dump omits that role
-- bootstrap state. The grant is fixture-only and rolls back below.
grant usage on schema auth to supabase_auth_admin;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at)
values('00000000-0000-4000-8000-000000003501','authenticated','authenticated','g3-legacy@example.invalid',now(),now(),now());
insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,vencimento,acompanhamento_status)
values('00000000-0000-4000-8000-000000003511','00000000-0000-4000-8000-000000003501','G3 Legacy Fixture','1',current_date,'QA',current_date-100,'ativo');

set local role anon;
select public.processar_encerramento_automatico_aluno(
  '00000000-0000-4000-8000-000000003501',
  '00000000-0000-4000-8000-000000003511',
  current_date-100,
  current_date,
  'g3-legacy-definer-proof'
)->>'status' as anonymous_closure_status;
select public.aoe_idempotency_get_or_create(
  'g3-legacy-anon-key',
  '00000000-0000-4000-8000-000000003501',
  '00000000-0000-4000-8000-000000003501',
  'g3-audit',
  'g3-key',
  'g3-fingerprint'
)->>'created' as anonymous_idempotency_created;
reset role;

do $$ begin
  if not exists(select 1 from public.alunos
    where id='00000000-0000-4000-8000-000000003511' and acompanhamento_status='encerrado') then
    raise exception 'anonymous automatic closure proof did not mutate fixture';
  end if;
  if not exists(select 1 from public.aoe_idempotency_keys where id='g3-legacy-anon-key') then
    raise exception 'anonymous AOE idempotency proof did not mutate fixture';
  end if;
end $$;

select 'legacy_security','anon_automatic_closure','VULNERABLE';
select 'legacy_security','anon_aoe_idempotency_write','VULNERABLE';
select 'legacy_security','fixture_persistence','ROLLBACK';

rollback;
