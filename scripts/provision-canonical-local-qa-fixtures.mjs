import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { maskUuid, readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";

const CANONICAL_EMAIL = "qa.local@aruka.test";
const REPORT_DIR = "reports/local-qa";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");
const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const writeResult = runPsql(process.cwd(), `
\\pset tuples_only on
\\pset format unaligned
with auth_match as (
  select id, email
  from auth.users
  where lower(email) = lower('${CANONICAL_EMAIL}')
),
gate as (
  select count(*)::int as match_count, (array_agg(id))[1] as user_id
  from auth_match
),
guard as (
  select case
    when match_count = 0 then 'LOCAL_QA_AUTH_USER_NOT_FOUND'
    when match_count > 1 then 'LOCAL_QA_AUTH_USER_AMBIGUOUS'
    else 'READY'
  end as state,
  match_count,
  user_id
  from gate
),
profile_upsert as (
  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  select user_id, 'QA Local Aruka', '${CANONICAL_EMAIL}', 'user', 'assinante', 'ativo'
  from guard where state = 'READY'
  on conflict (user_id) do update set
    nome = excluded.nome,
    email = excluded.email,
    role = excluded.role,
    tipo_acesso = excluded.tipo_acesso,
    status = excluded.status
  returning user_id
),
subscription_current as (
  select a.id
  from public.assinaturas a
  join guard g on g.user_id = a.user_id
  where g.state = 'READY'
  order by a.created_at desc
  limit 1
),
subscription_update as (
  update public.assinaturas a
  set plano = 'LOCAL_QA',
      status = 'ativo',
      data_inicio = current_date,
      data_vencimento = current_date + interval '1 year',
      pagamento_id = 'canonical-local-qa-fixture'
  from subscription_current c
  where a.id = c.id
  returning a.id
),
subscription_insert as (
  insert into public.assinaturas (user_id, plano, status, data_inicio, data_vencimento, pagamento_id)
  select user_id, 'LOCAL_QA', 'ativo', current_date, current_date + interval '1 year', 'canonical-local-qa-fixture'
  from guard
  where state = 'READY' and not exists (select 1 from subscription_current)
  returning id
),
legal_upsert as (
  insert into public.aceites_legais (user_id, politica_versao, termos_versao, politica_aceita, termos_aceitos, aceito_em, ip, user_agent)
  select user_id, '1.0', '1.0', true, true, now(), null, 'canonical LOCAL_QA setup'
  from guard where state = 'READY'
  on conflict (user_id, politica_versao, termos_versao) do update set
    politica_aceita = excluded.politica_aceita,
    termos_aceitos = excluded.termos_aceitos,
    aceito_em = excluded.aceito_em,
    user_agent = excluded.user_agent
  returning user_id
),
plan_input(nome, descricao, duracao_meses, valor, permite_parcelamento, quantidade_parcelas, valor_parcela, intervalo_parcelas_meses, ativo) as (
  values
    ('QA Local Mensal', 'Canonical local QA fixture', 1, 199.90::numeric, false, 1, 0.00::numeric, 1, true),
    ('QA Local Semestral Parcelado', 'Canonical local QA fixture', 6, 600.00::numeric, true, 6, 100.00::numeric, 1, true),
    ('QA Local Parceria', 'Canonical local QA fixture', 2, 0.00::numeric, false, 1, 0.00::numeric, 1, true)
),
existing_plans as (
  select p.id, p.nome
  from public.planos p
  join guard g on g.user_id = p.user_id
  join plan_input i on i.nome = p.nome
  where g.state = 'READY'
),
updated_plans as (
  update public.planos p
  set descricao = i.descricao,
      duracao_meses = i.duracao_meses,
      valor = i.valor,
      permite_parcelamento = i.permite_parcelamento,
      quantidade_parcelas = i.quantidade_parcelas,
      valor_parcela = i.valor_parcela,
      intervalo_parcelas_meses = i.intervalo_parcelas_meses,
      ativo = i.ativo
  from plan_input i, guard g
  where g.state = 'READY' and p.user_id = g.user_id and p.nome = i.nome
  returning p.id, p.nome
),
inserted_plans as (
  insert into public.planos (user_id, nome, descricao, duracao_meses, valor, permite_parcelamento, quantidade_parcelas, valor_parcela, intervalo_parcelas_meses, ativo)
  select g.user_id, i.nome, i.descricao, i.duracao_meses, i.valor, i.permite_parcelamento, i.quantidade_parcelas, i.valor_parcela, i.intervalo_parcelas_meses, i.ativo
  from plan_input i
  cross join guard g
  where g.state = 'READY' and not exists (select 1 from existing_plans e where e.nome = i.nome)
  returning id, nome
),
plans as (
  select id, nome from updated_plans
  union all
  select id, nome from inserted_plans
),
student_input(nome, plan_name, start_date, due_date, valor, pago) as (
  values
    ('QA Local Student', 'QA Local Mensal', current_date - 10, current_date + 20, 199.90::numeric, true),
    ('QA Local Installment Student', 'QA Local Semestral Parcelado', current_date - 35, current_date + 145, 600.00::numeric, false),
    ('QA Local Partnership Student', 'QA Local Parceria', current_date - 59, current_date + 1, 0.00::numeric, false)
),
student_payload as (
  select
    g.user_id,
    s.nome,
    case s.nome
      when 'QA Local Student' then '11990001000'
      when 'QA Local Installment Student' then '11990001001'
      else '11990001002'
    end as whatsapp,
    '1990-01-01'::date as nascimento,
    s.start_date::date as inicio,
    s.due_date::date as vencimento,
    (s.due_date - 7)::date as aviso7,
    (s.due_date - 1)::date as aviso1,
    p.id::text as plano,
    s.valor,
    'Ativo' as status,
    s.pago as pagamento_recebido,
    case when s.pago then (s.start_date + 1)::date else null::date end as data_pagamento,
    'Canonical local QA fixture' as observacoes,
    'ativo' as acompanhamento_status,
    null::timestamptz as acompanhamento_encerrado_em,
    '' as acompanhamento_motivo,
    '' as acompanhamento_motivo_detalhe,
    s.start_date::date as consultoria_inicio,
    'EXACT' as consultoria_inicio_confianca
  from student_input s
  join plans p on p.nome = s.plan_name
  cross join guard g
  where g.state = 'READY'
),
existing_students as (
  select a.id, a.nome
  from public.alunos a
  join student_payload s on s.user_id = a.user_id and s.nome = a.nome
),
updated_students as (
  update public.alunos a
  set whatsapp = s.whatsapp,
      nascimento = s.nascimento,
      inicio = s.inicio,
      vencimento = s.vencimento,
      aviso7 = s.aviso7,
      aviso1 = s.aviso1,
      plano = s.plano,
      valor = s.valor,
      status = s.status,
      pagamento_recebido = s.pagamento_recebido,
      data_pagamento = s.data_pagamento,
      observacoes = s.observacoes,
      acompanhamento_status = s.acompanhamento_status,
      acompanhamento_encerrado_em = s.acompanhamento_encerrado_em,
      acompanhamento_motivo = s.acompanhamento_motivo,
      acompanhamento_motivo_detalhe = s.acompanhamento_motivo_detalhe,
      consultoria_inicio = s.consultoria_inicio,
      consultoria_inicio_confianca = s.consultoria_inicio_confianca
  from student_payload s
  where a.user_id = s.user_id and a.nome = s.nome
  returning a.id, a.nome, a.user_id, a.inicio, a.vencimento, a.plano, a.valor, a.consultoria_inicio
),
inserted_students as (
  insert into public.alunos (
    user_id, nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1, plano, valor,
    status, pagamento_recebido, data_pagamento, observacoes, acompanhamento_status,
    acompanhamento_encerrado_em, acompanhamento_motivo, acompanhamento_motivo_detalhe,
    consultoria_inicio, consultoria_inicio_confianca
  )
  select user_id, nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1, plano, valor,
    status, pagamento_recebido, data_pagamento, observacoes, acompanhamento_status,
    acompanhamento_encerrado_em, acompanhamento_motivo, acompanhamento_motivo_detalhe,
    consultoria_inicio, consultoria_inicio_confianca
  from student_payload s
  where not exists (select 1 from existing_students e where e.nome = s.nome)
  returning id, nome, user_id, inicio, vencimento, plano, valor, consultoria_inicio
),
students as (
  select * from updated_students
  union all
  select * from inserted_students
),
delete_payments as (
  delete from public.pagamentos p
  using students s
  where p.user_id = s.user_id and p.aluno_id = s.id
  returning p.id
),
delete_events as (
  delete from public.acompanhamento_eventos e
  using students s
  where e.user_id = s.user_id and e.aluno_id = s.id
  returning e.id
),
delete_ledgers as (
  delete from public.aluno_contratos c
  using students s
  where c.user_id = s.user_id and c.aluno_id = s.id
  returning c.id
),
insert_ledgers as (
  insert into public.aluno_contratos (user_id, aluno_id, plano_id, plano_nome_snapshot, inicio, vencimento, valor, status, origem, renovado_de_id, metadata)
  select s.user_id, s.id, p.id, p.nome, s.inicio, s.vencimento, s.valor, 'ativo', 'legacy_current_contract', null, jsonb_build_object('fixture', 'canonical-local-qa')
  from students s
  join plans p on p.id::text = s.plano
  returning id, aluno_id
),
insert_payments as (
  insert into public.pagamentos (
    user_id, aluno_id, plano, valor, data_pagamento, forma_pagamento, parcela, total_parcelas,
    tipo_movimento, vencimento_parcela, vencimento_anterior, vencimento_novo, observacao, observacoes
  )
  select s.user_id, s.id, p.nome,
    case when s.nome = 'QA Local Student' then 199.90::numeric else 100.00::numeric end,
    case when s.nome = 'QA Local Student' then s.inicio + 1 else current_date - 32 end,
    'Pix',
    '1',
    case when s.nome = 'QA Local Student' then 1 else 6 end,
    case when s.nome = 'QA Local Student' then 'pagamento_avulso' else 'pagamento_parcela' end,
    case when s.nome = 'QA Local Student' then null::date else current_date - 32 end,
    null::date,
    s.vencimento,
    'fixture QA',
    'fixture QA'
  from students s
  join plans p on p.id::text = s.plano
  where s.nome in ('QA Local Student', 'QA Local Installment Student')
  returning id, aluno_id
),
insert_events as (
  insert into public.acompanhamento_eventos (
    user_id, aluno_id, tipo, ocorrido_em, motivo, motivo_detalhe, plano_id, plano_nome,
    vencimento_anterior, vencimento_novo, metadata, event_key
  )
  select s.user_id, s.id, 'acompanhamento_iniciado', (s.consultoria_inicio::text || 'T12:00:00Z')::timestamptz,
    null, null, p.id, p.nome, null, s.vencimento, jsonb_build_object('fixture', 'canonical-local-qa'), 'canonical-local-qa:start:' || s.id::text
  from students s
  join plans p on p.id::text = s.plano
  returning id, aluno_id
),
final_plans as (
  select p.*
  from public.planos p
  join guard g on g.user_id = p.user_id
  where p.nome in ('QA Local Mensal', 'QA Local Semestral Parcelado', 'QA Local Parceria')
),
final_students as (
  select a.*
  from public.alunos a
  join guard g on g.user_id = a.user_id
  where a.nome in ('QA Local Student', 'QA Local Installment Student', 'QA Local Partnership Student')
),
final_ledgers as (
  select c.*
  from public.aluno_contratos c
  join final_students s on s.id = c.aluno_id
),
active_by_student as (
  select aluno_id, count(*)::int as active_count
  from final_ledgers
  where status = 'ativo'
  group by aluno_id
),
final_payments as (
  select p.*
  from public.pagamentos p
  join final_students s on s.id = p.aluno_id
),
final_events as (
  select e.*
  from public.acompanhamento_eventos e
  join final_students s on s.id = e.aluno_id
),
write_barrier as (
  select
    (select count(*) from delete_payments) as deleted_payments,
    (select count(*) from delete_events) as deleted_events,
    (select count(*) from delete_ledgers) as deleted_ledgers,
    (select count(*) from insert_ledgers) as inserted_ledgers,
    (select count(*) from insert_payments) as inserted_payments,
    (select count(*) from insert_events) as inserted_events
)
select jsonb_build_object('write_barrier', (select to_jsonb(write_barrier) from write_barrier))::text;
`);

const result = runPsql(process.cwd(), `
\\pset tuples_only on
\\pset format unaligned
with auth_match as (
  select id, email
  from auth.users
  where lower(email) = lower('${CANONICAL_EMAIL}')
),
gate as (
  select count(*)::int as match_count, (array_agg(id))[1] as user_id
  from auth_match
),
guard as (
  select case
    when match_count = 0 then 'LOCAL_QA_AUTH_USER_NOT_FOUND'
    when match_count > 1 then 'LOCAL_QA_AUTH_USER_AMBIGUOUS'
    else 'READY'
  end as state,
  match_count,
  user_id
  from gate
),
final_plans as (
  select p.*
  from public.planos p
  join guard g on g.user_id = p.user_id
  where p.nome in ('QA Local Mensal', 'QA Local Semestral Parcelado', 'QA Local Parceria')
),
final_students as (
  select a.*
  from public.alunos a
  join guard g on g.user_id = a.user_id
  where a.nome in ('QA Local Student', 'QA Local Installment Student', 'QA Local Partnership Student')
),
final_ledgers as (
  select c.*
  from public.aluno_contratos c
  join final_students s on s.id = c.aluno_id
),
active_by_student as (
  select aluno_id, count(*)::int as active_count
  from final_ledgers
  where status = 'ativo'
  group by aluno_id
),
final_payments as (
  select p.*
  from public.pagamentos p
  join final_students s on s.id = p.aluno_id
),
final_events as (
  select e.*
  from public.acompanhamento_eventos e
  join final_students s on s.id = e.aluno_id
)
select jsonb_build_object(
  'decision', case when (select state from guard) = 'READY' then 'CANONICAL_LOCAL_QA_BUSINESS_FIXTURES_READY' else (select state from guard) end,
  'canonical_email', '${CANONICAL_EMAIL}',
  'local_qa_auth_user_found', case when (select match_count from guard) = 1 then 'YES' else 'NO' end,
  'local_qa_auth_user_match_count', (select match_count from guard),
  'resolved_auth_user_id', (select user_id from guard),
  'qa_plan_count', (select count(*) from final_plans),
  'qa_student_count', (select count(*) from final_students),
  'qa_ledger_active_count', (select count(*) from final_ledgers where status = 'ativo'),
  'qa_multi_active_contracts', (select count(*) from active_by_student where active_count > 1),
  'qa_plan_owner_match', (select bool_and(user_id = (select user_id from guard)) from final_plans),
  'qa_student_owner_match', (select bool_and(user_id = (select user_id from guard)) from final_students),
  'qa_installment_student_ready', exists (select 1 from final_students s join active_by_student a on a.aluno_id = s.id join final_payments p on p.aluno_id = s.id where s.nome = 'QA Local Installment Student' and a.active_count = 1 and p.parcela = '1'),
  'qa_partnership_student_ready', exists (select 1 from final_students s join active_by_student a on a.aluno_id = s.id where s.nome = 'QA Local Partnership Student' and a.active_count = 1 and not exists (select 1 from final_payments p where p.aluno_id = s.id)),
  'qa_payment_fixtures_ready', (select count(*) >= 2 from final_payments),
  'qa_event_fixtures_ready', (select count(*) >= 3 from final_events),
  'production_accessed', 'NO',
  'production_mutation', 'NO',
  'db_push', 'NO'
)::text;
`);

const line = result.stdout.trim().split(/\r?\n/).filter((item) => item.startsWith("{")).at(-1);
if (!line) throw new Error(`CANONICAL_LOCAL_QA_RESULT_MISSING: ${result.stdout}\n${result.stderr}`);
const payload = JSON.parse(line);
payload.resolved_auth_user_id_masked = maskUuid(payload.resolved_auth_user_id);
delete payload.resolved_auth_user_id;
payload.qa_payment_fixtures = payload.qa_payment_fixtures_ready ? "PASS" : "FAIL";
payload.qa_partnership_fixture = payload.qa_partnership_student_ready ? "PASS" : "FAIL";
payload.qa_auth_user = payload.local_qa_auth_user_found === "YES" ? "PASS" : "FAIL";
payload.qa_ledger_initialized = payload.qa_ledger_active_count === 3 && payload.qa_multi_active_contracts === 0 ? "YES" : "NO";
payload.production_accessed = "NO";
payload.production_mutation = "NO";
payload.db_push = "NO";

writeReports(payload);

console.log(`QA_AUTH_USER=${payload.qa_auth_user}`);
console.log(`CANONICAL_LOCAL_QA_EMAIL=${CANONICAL_EMAIL}`);
console.log(`LOCAL_QA_AUTH_USER_FOUND=${payload.local_qa_auth_user_found}`);
console.log(`LOCAL_QA_AUTH_USER_MATCH_COUNT=${payload.local_qa_auth_user_match_count}`);
console.log(`LOCAL_QA_USER_ID_RESOLVED=${payload.resolved_auth_user_id_masked}`);
console.log(`QA_PLAN_COUNT=${payload.qa_plan_count}`);
console.log(`QA_STUDENT_COUNT=${payload.qa_student_count}`);
console.log(`QA_LEDGER_ACTIVE_COUNT=${payload.qa_ledger_active_count}`);
console.log(`QA_MULTI_ACTIVE_CONTRACTS=${payload.qa_multi_active_contracts}`);
console.log(`QA_PAYMENT_FIXTURES=${payload.qa_payment_fixtures}`);
console.log(`QA_PARTNERSHIP_FIXTURE=${payload.qa_partnership_fixture}`);
console.log("PRODUCTION_ACCESSED=NO");
console.log("PRODUCTION_MUTATION=NO");
console.log("DB_PUSH=NO");

function writeReports(payload) {
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(join(REPORT_DIR, "canonical-local-qa-fixtures-result.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeFileSync(join(REPORT_DIR, "canonical-local-qa-fixtures-summary.md"), [
    "# Canonical Local QA Fixtures",
    "",
    `Decision=${payload.decision}`,
    `Canonical QA email=${payload.canonical_email}`,
    `Auth user found=${payload.local_qa_auth_user_found}`,
    `Auth user match count=${payload.local_qa_auth_user_match_count}`,
    `Plans=${payload.qa_plan_count ?? 0}`,
    `Students=${payload.qa_student_count ?? 0}`,
    `Active ledgers=${payload.qa_ledger_active_count ?? 0}`,
    `Payment fixtures=${payload.qa_payment_fixtures ?? "UNKNOWN"}`,
    `Partnership fixture=${payload.qa_partnership_fixture ?? "UNKNOWN"}`,
    "",
    "Production accessed=NO",
    "Production mutation=NO",
    "DB push=NO",
  ].join("\n"), "utf8");
}
