import assert from "node:assert/strict";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");

const result = runPsql(root, String.raw`
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-4000-8000-000000131311', 'authenticated', 'authenticated', 'cycle-12-13-owner-a@example.invalid', now(), now(), now()),
  ('00000000-0000-4000-8000-000000131312', 'authenticated', 'authenticated', 'cycle-12-13-owner-b@example.invalid', now(), now(), now()),
  ('00000000-0000-4000-8000-000000131313', 'authenticated', 'authenticated', 'cycle-12-13-aoe-admin@example.invalid', now(), now(), now());

insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
values
  ('00000000-0000-4000-8000-000000131311', 'Cycle 12.13 Owner A', 'cycle-12-13-owner-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000131312', 'Cycle 12.13 Owner B', 'cycle-12-13-owner-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000131313', 'Cycle 12.13 AOE Admin', 'cycle-12-13-aoe-admin@example.invalid', 'admin', 'admin', 'ativo');

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status)
values
  ('00000000-0000-4000-8000-000000131321', '00000000-0000-4000-8000-000000131311', 'Aluno A', '+5511999991311', current_date, 'QA', 0, 'Ativo'),
  ('00000000-0000-4000-8000-000000131322', '00000000-0000-4000-8000-000000131312', 'Aluno B', '+5511999991312', current_date, 'QA', 0, 'Ativo');

insert into public.aoe_decisions
  (id, request_id, actor_id, student_id, organization_id, status, public_response)
values
  ('cycle-12-13-decision-a', 'cycle-12-13-request-a', '00000000-0000-4000-8000-000000131311', '00000000-0000-4000-8000-000000131321', '00000000-0000-4000-8000-000000131311', 'completed', '{}'),
  ('cycle-12-13-decision-b', 'cycle-12-13-request-b', '00000000-0000-4000-8000-000000131312', '00000000-0000-4000-8000-000000131322', '00000000-0000-4000-8000-000000131312', 'completed', '{}');

insert into public.aoe_decision_traces (id, decision_id, organization_id, trace_version, trace_payload)
values
  ('cycle-12-13-trace-a', 'cycle-12-13-decision-a', '00000000-0000-4000-8000-000000131311', '1', '{}'),
  ('cycle-12-13-trace-b', 'cycle-12-13-decision-b', '00000000-0000-4000-8000-000000131312', '1', '{}');

insert into public.aoe_human_reviews (id, decision_id, organization_id, status)
values
  ('cycle-12-13-review-a', 'cycle-12-13-decision-a', '00000000-0000-4000-8000-000000131311', 'pending'),
  ('cycle-12-13-review-b', 'cycle-12-13-decision-b', '00000000-0000-4000-8000-000000131312', 'pending');

insert into public.aoe_idempotency_keys
  (id, actor_id, organization_id, operation, idempotency_key, request_fingerprint, status)
values
  ('cycle-12-13-key-a', '00000000-0000-4000-8000-000000131311', '00000000-0000-4000-8000-000000131311', 'qa', 'key-a', 'fingerprint-a', 'pending'),
  ('cycle-12-13-key-b', '00000000-0000-4000-8000-000000131312', '00000000-0000-4000-8000-000000131312', 'qa', 'key-b', 'fingerprint-b', 'pending');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000131311', true);

do $$
begin
  if (select count(*) from public.alunos) <> 1 then raise exception 'CORE_OWN_READ_FAILED'; end if;
  update public.alunos set observacoes = 'own update' where id = '00000000-0000-4000-8000-000000131321';
  if not found then raise exception 'CORE_OWN_UPDATE_FAILED'; end if;
  update public.alunos set observacoes = 'cross update' where id = '00000000-0000-4000-8000-000000131322';
  if found then raise exception 'CORE_CROSS_UPDATE_ALLOWED'; end if;
  begin
    insert into public.alunos (user_id, nome, whatsapp, inicio, plano, valor, status)
    values ('00000000-0000-4000-8000-000000131312', 'Cross insert', '+5511999991319', current_date, 'QA', 0, 'Ativo');
    raise exception 'CORE_CROSS_INSERT_ALLOWED';
  exception when insufficient_privilege then null;
  end;

  if (select count(*) from public.aoe_decisions) <> 1 then raise exception 'AOE_ACTOR_READ_FAILED'; end if;
  if (select count(*) from public.aoe_decision_traces) <> 1 then raise exception 'AOE_TRACE_OWNERSHIP_FAILED'; end if;
  if (select count(*) from public.aoe_human_reviews) <> 1 then raise exception 'AOE_REVIEW_OWNERSHIP_FAILED'; end if;
  if (select count(*) from public.aoe_idempotency_keys) <> 1 then raise exception 'AOE_IDEMPOTENCY_OWNERSHIP_FAILED'; end if;

  update public.aoe_human_reviews set notes = 'owner update' where id = 'cycle-12-13-review-a';
  if not found then raise exception 'AOE_OWN_REVIEW_UPDATE_FAILED'; end if;
  update public.aoe_human_reviews set notes = 'cross update' where id = 'cycle-12-13-review-b';
  if found then raise exception 'AOE_CROSS_REVIEW_UPDATE_ALLOWED'; end if;

  begin
    insert into public.aoe_decisions (id, request_id, actor_id, student_id, status, public_response)
    values ('cycle-12-13-cross-student', 'cycle-12-13-cross-request', '00000000-0000-4000-8000-000000131311', '00000000-0000-4000-8000-000000131322', 'completed', '{}');
    raise exception 'AOE_CROSS_STUDENT_INSERT_ALLOWED';
  exception when insufficient_privilege then null;
  end;

  begin
    insert into public.aoe_idempotency_keys
      (id, actor_id, operation, idempotency_key, request_fingerprint, status)
    values ('cycle-12-13-cross-key', '00000000-0000-4000-8000-000000131312', 'qa', 'cross-key', 'cross-fingerprint', 'pending');
    raise exception 'AOE_CROSS_ACTOR_INSERT_ALLOWED';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000131313', true);
do $$
begin
  if (select count(*) from public.aoe_decisions where id in ('cycle-12-13-decision-a', 'cycle-12-13-decision-b')) <> 2 then
    raise exception 'AOE_ADMIN_READ_FAILED';
  end if;
end $$;

reset role;
set local role anon;
do $$
begin
  begin
    perform count(*) from public.aoe_decisions;
    raise exception 'AOE_ANON_READ_ALLOWED';
  exception when insufficient_privilege then null;
  end;
end $$;

rollback;

select 'CYCLE_12_13_AUTHORIZATION_RUNTIME=PASS';
select 'CYCLE_12_13_CORE_OWNERSHIP_MATRIX=PASS';
select 'CYCLE_12_13_AOE_AUTHORIZATION_MATRIX=PASS';
`, { timeoutMs: 120000 });

assert.match(result.stdout, /CYCLE_12_13_AUTHORIZATION_RUNTIME=PASS/);
console.log(result.stdout.trim());
