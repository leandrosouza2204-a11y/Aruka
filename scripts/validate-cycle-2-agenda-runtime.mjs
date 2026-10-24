import { runPsql } from "./supabase-cycle-8-lib.mjs";

const sql = String.raw`
begin;
create extension if not exists pgtap with schema extensions;
select plan(41);

insert into auth.users (id, email) values
  ('20000000-0000-4000-8000-000000000001', 'agenda-prof-a@example.invalid'),
  ('20000000-0000-4000-8000-000000000002', 'agenda-prof-b@example.invalid')
on conflict (id) do nothing;
insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status) values
  ('20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'Agenda A', 'agenda-prof-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', 'Agenda B', 'agenda-prof-b@example.invalid', 'user', 'assinante', 'ativo')
on conflict (user_id) do nothing;
insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano) values
  ('20000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000001', 'Aluno A1', '5511999990001', '2026-01-01', 'Teste'),
  ('20000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000001', 'Aluno A2', '5511999990002', '2026-01-01', 'Teste'),
  ('20000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000002', 'Aluno B', '5511999990003', '2026-01-01', 'Teste')
on conflict (id) do nothing;

select is(
  has_table_privilege('authenticated', format('public.%I', table_name), privilege),
  false,
  format('authenticated cannot %s %s', privilege, table_name)
)
from unnest(array['agenda_series', 'agenda_compromissos', 'agenda_participantes', 'agenda_excecoes']) table_name
cross join unnest(array['TRUNCATE', 'REFERENCES', 'TRIGGER']) privilege;

set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000001', true);

select lives_ok($$select public.agenda_criar_compromisso('Avaliação', 'atendimento', '2026-10-21 10:00+00', '2026-10-21 11:00+00', '', array['20000000-0000-4000-8000-000000000011']::uuid[], null, '20000000-0000-4000-8000-000000000101', 'America/Sao_Paulo')$$, 'creates an appointment');
select is((select count(*)::int from public.agenda_compromissos where titulo = 'Avaliação'), 1, 'appointment is persisted once');
select is((select count(*)::int from public.agenda_participantes where aluno_id = '20000000-0000-4000-8000-000000000011'), 1, 'student is linked');
select lives_ok($$select public.agenda_criar_compromisso('Avaliação duplicada', 'atendimento', '2026-10-21 12:00+00', '2026-10-21 13:00+00', '', array['20000000-0000-4000-8000-000000000011']::uuid[], null, '20000000-0000-4000-8000-000000000101', 'America/Sao_Paulo')$$, 'idempotency replay succeeds');
select is((select count(*)::int from public.agenda_compromissos where client_request_id = '20000000-0000-4000-8000-000000000101'), 1, 'idempotency prevents duplicates');
select throws_ok($$select public.agenda_criar_compromisso('Conflito', 'pessoal', '2026-10-21 10:30+00', '2026-10-21 11:30+00', '', '{}'::uuid[], null, '20000000-0000-4000-8000-000000000102', 'America/Sao_Paulo')$$, '23P01', 'AGENDA_CONFLICT', 'overlap is rejected on the server');
select throws_ok($$select public.agenda_criar_compromisso('Conflito exato', 'pessoal', '2026-10-21 10:00+00', '2026-10-21 11:00+00', '', '{}'::uuid[], null, '20000000-0000-4000-8000-000000000107', 'America/Sao_Paulo')$$, '23P01', 'AGENDA_CONFLICT', 'exact overlap is rejected on the server');
select lives_ok($$select public.agenda_criar_compromisso('Pessoal', 'pessoal', '2026-10-21 12:00+00', '2026-10-21 13:00+00', '', '{}'::uuid[], null, '20000000-0000-4000-8000-000000000103', 'America/Sao_Paulo')$$, 'personal event needs no student');
select lives_ok($$select public.agenda_criar_compromisso('Turma', 'atendimento', '2026-10-21 14:00+00', '2026-10-21 15:00+00', '', array['20000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000012']::uuid[], null, '20000000-0000-4000-8000-000000000104', 'America/Sao_Paulo')$$, 'one event accepts multiple students');
select is((select count(*)::int from public.agenda_participantes p join public.agenda_compromissos c on c.id=p.compromisso_id where c.titulo='Turma'), 2, 'multiple participants are persisted');
select throws_ok($$select public.agenda_criar_compromisso('Aluno externo', 'atendimento', '2026-10-22 10:00+00', '2026-10-22 11:00+00', '', array['20000000-0000-4000-8000-000000000021']::uuid[], null, '20000000-0000-4000-8000-000000000105', 'America/Sao_Paulo')$$, '42501', 'AGENDA_STUDENT_OWNER_MISMATCH', 'cross-owner student is rejected');

select lives_ok($$select public.agenda_criar_compromisso('Série MWF', 'atendimento', '2026-10-26 10:00+00', '2026-10-26 11:00+00', '', array['20000000-0000-4000-8000-000000000011']::uuid[], '{"frequencia":"dias_semana","intervalo":1,"dias_semana":[1,3,5],"quantidade":3}'::jsonb, '20000000-0000-4000-8000-000000000106', 'America/Sao_Paulo')$$, 'creates bounded recurrence');
select is((select count(*)::int from public.agenda_compromissos where serie_id is not null), 3, 'recurrence materializes requested occurrences');
select is((select quantidade_ocorrencias from public.agenda_series where titulo='Série MWF'), 3, 'series records materialized count');

select lives_ok($$
  select public.agenda_atualizar_compromisso(
    (select id from public.agenda_compromissos where serie_id is not null order by ocorrencia_original limit 1),
    'ocorrencia', 'Série exceção', 'atendimento', '2026-10-26 11:00+00', '2026-10-26 12:00+00', '',
    array['20000000-0000-4000-8000-000000000011']::uuid[]
  )
$$, 'edits one occurrence');
select is((select count(*)::int from public.agenda_excecoes where acao='modificada'), 1, 'individual edit records an exception');
select lives_ok($$
  select public.agenda_atualizar_compromisso(
    (select id from public.agenda_compromissos where serie_id is not null and is_exception=false order by ocorrencia_original limit 1),
    'serie', 'Série atualizada', 'atendimento', '2026-10-28 12:00+00', '2026-10-28 13:00+00', '',
    array['20000000-0000-4000-8000-000000000011','20000000-0000-4000-8000-000000000012']::uuid[]
  )
$$, 'updates remaining series occurrences');
select is((select titulo from public.agenda_compromissos where is_exception order by ocorrencia_original limit 1), 'Série exceção', 'series update preserves prior exception');
select is((select count(*)::int from public.agenda_participantes p join public.agenda_compromissos c on c.id=p.compromisso_id where c.titulo='Série atualizada'), 4, 'series update replaces participants for two remaining occurrences');

select lives_ok($$select public.agenda_atualizar_status((select id from public.agenda_compromissos where titulo='Avaliação'), 'concluido')$$, 'marks appointment complete');
select is((select status from public.agenda_compromissos where titulo='Avaliação'), 'concluido', 'completion status persists');
select lives_ok($$select public.agenda_cancelar_compromisso((select id from public.agenda_compromissos where titulo='Pessoal'), 'ocorrencia')$$, 'cancels one standalone commitment');
select is((select status from public.agenda_compromissos where titulo='Pessoal'), 'cancelado', 'standalone cancellation is persisted logically');
select lives_ok($$select public.agenda_cancelar_compromisso((select id from public.agenda_compromissos where titulo='Série atualizada' order by inicio limit 1), 'ocorrencia')$$, 'cancels one recurring occurrence');
select is((select count(*)::int from public.agenda_excecoes where acao='cancelada'), 1, 'cancellation records an exception');
select is((select count(*)::int from public.agenda_compromissos where serie_id is not null and status='cancelado'), 1, 'only the selected recurring occurrence is cancelled');
select is((select count(*)::int from public.agenda_compromissos where serie_id is not null and status<>'cancelado'), 2, 'remaining recurring occurrences are preserved');

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
select is((select count(*)::int from public.agenda_compromissos), 0, 'professional B cannot read professional A agenda');

reset role;
set local role anon;
select throws_ok($$select count(*) from public.agenda_compromissos$$, '42501', null, 'anon cannot read agenda');
reset role;
select * from finish();
rollback;
`;

const result = runPsql(process.cwd(), sql, { timeoutMs: 180000, throwOnError: false });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);
if (result.status !== 0 || /not ok/i.test(result.stdout)) process.exit(1);
console.log("CYCLE_2_AGENDA_RUNTIME=PASS");
