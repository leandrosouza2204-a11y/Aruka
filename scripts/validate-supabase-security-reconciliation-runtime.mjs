import { runPsql } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();

const sql = String.raw`
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values
  ('20000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'sec-prof-a@example.invalid', now(), now(), now()),
  ('20000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'sec-prof-b@example.invalid', now(), now(), now()),
  ('20000000-0000-4000-8000-000000000011', 'authenticated', 'authenticated', 'sec-student-a@example.invalid', now(), now(), now()),
  ('20000000-0000-4000-8000-000000000099', 'authenticated', 'authenticated', 'sec-unlinked@example.invalid', now(), now(), now());

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('20000000-0000-4000-8000-000000000101', '20000000-0000-4000-8000-000000000001', 'Sec Prof A', 'sec-prof-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('20000000-0000-4000-8000-000000000102', '20000000-0000-4000-8000-000000000002', 'Sec Prof B', 'sec-prof-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('20000000-0000-4000-8000-000000000111', '20000000-0000-4000-8000-000000000011', 'Sec Student A', 'sec-student-a@example.invalid', 'student', 'pendente', 'ativo'),
  ('20000000-0000-4000-8000-000000000199', '20000000-0000-4000-8000-000000000099', 'Sec Unlinked', 'sec-unlinked@example.invalid', 'student', 'pendente', 'ativo');

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status, student_user_id)
values
  ('20000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000001', 'Sec Aluno A', '+5500000000201', current_date, 'Mensal', 100, 'Ativo', '20000000-0000-4000-8000-000000000011'),
  ('20000000-0000-4000-8000-000000000202', '20000000-0000-4000-8000-000000000002', 'Sec Aluno B', '+5500000000202', current_date, 'Mensal', 120, 'Ativo', null);

insert into public.planos (id, user_id, nome, valor, ativo)
values ('20000000-0000-4000-8000-000000000301', '20000000-0000-4000-8000-000000000001', 'Plano A', 100, true);

insert into public.assinaturas (id, user_id, plano, status, data_inicio, data_vencimento)
values ('20000000-0000-4000-8000-000000000401', '20000000-0000-4000-8000-000000000001', 'Mensal', 'pendente', current_date, current_date + 30);

insert into public.pagamentos (id, user_id, aluno_id, plano, valor, data_pagamento)
values ('20000000-0000-4000-8000-000000000501', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 'Plano A', 100, current_date);

insert into public.avaliacoes (id, user_id, aluno_id, data_avaliacao, peso, altura)
values ('20000000-0000-4000-8000-000000000601', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', current_date, 80, 180);

insert into public.anamneses (id, user_id, aluno_id, objetivo_principal)
values ('20000000-0000-4000-8000-000000000701', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 'Forca');

insert into public.treinos (id, user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, status, lifecycle_status, delivered_at)
values
  ('20000000-0000-4000-8000-000000000801', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 'Treino A', 'Forca', 'Inicial', 1, 'Ativo', 'active', now()),
  ('20000000-0000-4000-8000-000000000802', '20000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000202', 'Treino B', 'Forca', 'Inicial', 1, 'Ativo', 'active', now());

insert into public.treino_dias (id, treino_id, nome, ordem)
values ('20000000-0000-4000-8000-000000000811', '20000000-0000-4000-8000-000000000801', 'Dia A', 1);

insert into public.treino_exercicios (id, treino_dia_id, nome, series, repeticoes, ordem)
values ('20000000-0000-4000-8000-000000000821', '20000000-0000-4000-8000-000000000811', 'Agachamento', '3', '10', 1);

insert into public.treino_eventos (id, treino_id, aluno_id, user_id, event_type)
values ('20000000-0000-4000-8000-000000000831', '20000000-0000-4000-8000-000000000801', '20000000-0000-4000-8000-000000000201', '20000000-0000-4000-8000-000000000001', 'delivered');

insert into public.acompanhamento_eventos (id, user_id, aluno_id, tipo)
values ('20000000-0000-4000-8000-000000000901', '20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000201', 'acompanhamento_iniciado');

insert into public.workout_templates (id, owner_id, name, objective, split_type, template_data, is_system, is_active)
values ('20000000-0000-4000-8000-000000000911', '20000000-0000-4000-8000-000000000001', 'Modelo A', 'Forca', 'Outro', '{}'::jsonb, false, true);

insert into public.admin_logs (id, admin_user_id, acao)
values ('20000000-0000-4000-8000-000000000921', '20000000-0000-4000-8000-000000000001', 'teste');

set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000001', true);

do $$
begin
  if (select count(*) from public.alunos) <> 1 then raise exception 'professional A aluno isolation failed'; end if;
  if (select count(*) from public.planos) <> 1 then raise exception 'professional A plano access failed'; end if;
  if (select count(*) from public.assinaturas) <> 1 then raise exception 'professional A assinatura access failed'; end if;
  if (select count(*) from public.pagamentos) <> 1 then raise exception 'professional A pagamento access failed'; end if;
  if (select count(*) from public.avaliacoes) <> 1 then raise exception 'professional A avaliacao access failed'; end if;
  if (select count(*) from public.anamneses) <> 1 then raise exception 'professional A anamnese access failed'; end if;
  if (select count(*) from public.treinos) <> 1 then raise exception 'professional A treino access failed'; end if;
  if (select count(*) from public.treino_dias) <> 1 then raise exception 'professional A treino_dias access failed'; end if;
  if (select count(*) from public.treino_exercicios) <> 1 then raise exception 'professional A treino_exercicios access failed'; end if;
  if (select count(*) from public.treino_eventos) <> 1 then raise exception 'professional A treino_eventos access failed'; end if;
  if (select count(*) from public.acompanhamento_eventos) <> 1 then raise exception 'professional A acompanhamento_eventos access failed'; end if;
  if (select count(*) from public.workout_templates) <> 1 then raise exception 'professional A workout_templates access failed'; end if;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000002', true);
do $$
begin
  if (select count(*) from public.alunos where id = '20000000-0000-4000-8000-000000000201') <> 0 then raise exception 'professional B read professional A aluno'; end if;
  if (select count(*) from public.treinos where id = '20000000-0000-4000-8000-000000000801') <> 0 then raise exception 'professional B read professional A treino'; end if;
end $$;

select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000099', true);
do $$
begin
  if (select count(*) from public.alunos) <> 0 then raise exception 'unlinked authenticated user received aluno access'; end if;
  if (select count(*) from public.treinos) <> 0 then raise exception 'unlinked authenticated user received treino access'; end if;
end $$;

reset role;
set local role anon;
do $$
begin
  begin
    perform count(*) from public.alunos;
    raise exception 'anon table select unexpectedly succeeded';
  exception when insufficient_privilege then
    null;
  end;
  begin
    perform public.salvar_treino_composto('{}'::jsonb);
    raise exception 'anon RPC unexpectedly succeeded';
  exception when insufficient_privilege then
    null;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '20000000-0000-4000-8000-000000000011', true);
do $$
begin
  if (select count(*) from public.get_my_student_workouts()) <> 1 then raise exception 'student read contract failed'; end if;
  begin
    insert into public.admin_logs (admin_user_id, acao) values ('20000000-0000-4000-8000-000000000011', 'student-write');
    raise exception 'student administrative write unexpectedly succeeded';
  exception when insufficient_privilege then
    null;
  end;
end $$;

reset role;
do $$
declare
  contract jsonb := '{
    "perfis": ["SELECT", "INSERT"],
    "alunos": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "planos": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "assinaturas": ["SELECT", "INSERT"],
    "pagamentos": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "admin_logs": ["SELECT"],
    "aceites_legais": ["SELECT", "INSERT"],
    "avaliacoes": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "anamneses": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "treinos": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "treino_dias": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "treino_exercicios": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "acompanhamento_eventos": ["SELECT", "INSERT"],
    "workout_templates": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "aoe_decisions": ["SELECT", "INSERT"],
    "aoe_decision_traces": ["SELECT"],
    "aoe_human_reviews": ["SELECT", "INSERT", "UPDATE"],
    "aoe_idempotency_keys": ["SELECT", "INSERT", "UPDATE", "DELETE"],
    "aoe_audit_events": ["SELECT"]
  }'::jsonb;
  table_name text;
  privilege text;
begin
  for table_name in select jsonb_object_keys(contract)
  loop
    foreach privilege in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE']
    loop
      if has_table_privilege('authenticated', format('public.%I', table_name), privilege) <> (contract -> table_name ? privilege) then
        raise exception 'authenticated privilege mismatch on %.%', table_name, privilege;
      end if;
    end loop;
  end loop;

  if exists (
    select 1
    from information_schema.routine_privileges
    where routine_schema = 'public'
      and routine_name in ('salvar_treino_composto', 'entregar_treino', 'alterar_estado_treino')
      and grantee in ('PUBLIC', 'anon')
      and privilege_type = 'EXECUTE'
  ) then
    raise exception 'PUBLIC or anon still has EXECUTE on protected workout RPCs';
  end if;
end $$;

rollback;
`;

runPsql(root, sql, { timeoutMs: 120000 });
console.log("SUPABASE_SECURITY_RECONCILIATION_RUNTIME_VALIDATED");
