import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runPsql, validateLocalGuard } from './supabase-cycle-8-lib.mjs';

const root = process.cwd();
assert.equal(validateLocalGuard(root).ok, true, 'local-only guard must pass');
const proposedSchema = readFileSync('supabase/migrations/20261109002142_agenda_introduction_confirmation.sql', 'utf8');
const result = runPsql(root, String.raw`
begin;
select (to_regclass('public.agenda_apresentacoes') is null) as create_agenda_041 \gset
\if :create_agenda_041
${proposedSchema}
\endif
insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at) values
 ('00000000-0000-4000-8000-000000041101', 'authenticated', 'authenticated', 'agenda041-a@example.invalid', now(), now(), now()),
 ('00000000-0000-4000-8000-000000041102', 'authenticated', 'authenticated', 'agenda041-b@example.invalid', now(), now(), now());
insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status) values
 ('00000000-0000-4000-8000-000000041111', '00000000-0000-4000-8000-000000041101', 'Aluno A', '11999990001', current_date, 'QA', 0, 'Ativo'),
 ('00000000-0000-4000-8000-000000041113', '00000000-0000-4000-8000-000000041101', 'Aluno C', '11999990003', current_date, 'QA', 0, 'Ativo'),
 ('00000000-0000-4000-8000-000000041112', '00000000-0000-4000-8000-000000041102', 'Aluno B', '11999990002', current_date, 'QA', 0, 'Ativo');
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000041101', true);
do $$ begin
 if exists (select 1 from public.agenda_apresentacoes where aluno_id = '00000000-0000-4000-8000-000000041111') then raise exception 'initial state not pending'; end if;
 insert into public.agenda_apresentacoes (profissional_id, aluno_id) values ('00000000-0000-4000-8000-000000041101', '00000000-0000-4000-8000-000000041111');
 insert into public.agenda_apresentacoes (profissional_id, aluno_id) values ('00000000-0000-4000-8000-000000041101', '00000000-0000-4000-8000-000000041111') on conflict (profissional_id, aluno_id) do nothing;
 if not exists (select 1 from public.agenda_apresentacoes where aluno_id = '00000000-0000-4000-8000-000000041111') then raise exception 'confirmation not persisted'; end if;
 if exists (select 1 from public.agenda_apresentacoes where aluno_id = '00000000-0000-4000-8000-000000041113') then raise exception 'another student must remain pending'; end if;
 begin
  insert into public.agenda_apresentacoes (profissional_id, aluno_id) values ('00000000-0000-4000-8000-000000041101', '00000000-0000-4000-8000-000000041112');
  raise exception 'cross-student insert allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.agenda_apresentacoes (profissional_id, aluno_id) values ('00000000-0000-4000-8000-000000041102', '00000000-0000-4000-8000-000000041112');
  raise exception 'cross-owner insert allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000041102', true);
do $$ begin
 if exists (select 1 from public.agenda_apresentacoes where aluno_id = '00000000-0000-4000-8000-000000041111') then raise exception 'cross-owner read allowed'; end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000041101', true);
do $$ begin
 if not exists (select 1 from public.agenda_apresentacoes where aluno_id = '00000000-0000-4000-8000-000000041111') then raise exception 'confirmation missing after switching principal'; end if;
end $$;
reset role;
set local role anon;
do $$ begin
 begin perform count(*) from public.agenda_apresentacoes; raise exception 'anonymous read allowed';
 exception when insufficient_privilege then null; end;
end $$;
rollback;
`);
assert.equal(result.status, 0, result.stderr || result.stdout);
console.log('AGENDA_04_1_RLS=PASS');
