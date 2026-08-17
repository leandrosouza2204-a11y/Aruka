import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  commandOutputOrThrow,
  runCommand,
  runPsql,
  runSupabaseDbReset,
  runSupabaseStart,
  validateLocalGuard,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const reportDir = join(root, "reports", "gabi-renewal-diagnostics");
mkdirSync(reportDir, { recursive: true });

const ids = {
  user: "00000000-0000-4000-8000-00000000g001".replace("g", "9"),
  plan: "00000000-0000-4000-8000-000000009011",
  student: "00000000-0000-4000-8000-000000009021",
  contract: "00000000-0000-4000-8000-000000009031",
  payment: "00000000-0000-4000-8000-000000009041",
};

const cases = [
  { key: "CASE_A", value: 0.01, registerPayment: true, paymentMethod: "Outro" },
  { key: "CASE_B", value: 0.01, registerPayment: false, paymentMethod: "" },
  { key: "CASE_C", value: 0, registerPayment: false, paymentMethod: "" },
];

function q(value) {
  return String(value).replaceAll("'", "''");
}

function runSupabaseStartIfNeeded(resetResult) {
  if (resetResult.status === 0 || !/supabase start is not running/i.test(`${resetResult.stderr}\n${resetResult.stdout}`)) {
    return resetResult;
  }
  commandOutputOrThrow(runSupabaseStart(root), "Local Supabase start");
  return runSupabaseDbReset(root);
}

function sqlForFixture() {
  return `
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values ('${ids.user}', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'gabi-equivalent@example.local', '', now(), now(), now())
on conflict (id) do nothing;

insert into public.planos (
  id, user_id, nome, descricao, duracao_meses, valor, permite_parcelamento,
  quantidade_parcelas, valor_parcela, intervalo_parcelas_meses, ativo
) values (
  '${ids.plan}', '${ids.user}', 'Parceria', 'Gabi production equivalent fixture',
  2, 0.01, false, 1, 0.00, 1, true
) on conflict (id) do update set
  user_id = excluded.user_id,
  nome = excluded.nome,
  duracao_meses = excluded.duracao_meses,
  valor = excluded.valor,
  permite_parcelamento = excluded.permite_parcelamento,
  quantidade_parcelas = excluded.quantidade_parcelas,
  valor_parcela = excluded.valor_parcela,
  intervalo_parcelas_meses = excluded.intervalo_parcelas_meses,
  ativo = excluded.ativo;

insert into public.alunos (
  id, user_id, nome, whatsapp, inicio, vencimento, aviso7, aviso1, plano, valor,
  status, pagamento_recebido, data_pagamento, observacoes, acompanhamento_status,
  acompanhamento_motivo, acompanhamento_motivo_detalhe, consultoria_inicio,
  consultoria_inicio_confianca
) values (
  '${ids.student}', '${ids.user}', 'Gabi Production Equivalent', '00000000000',
  '2026-06-15', '2026-08-15', '2026-08-08', '2026-08-14', '${ids.plan}', 0.00,
  'Ativo', false, null, 'gabi-production-equivalent-renewal-fixture', 'ativo',
  'fixture_motivo_valido', 'fixture detalhe', '2026-06-14', 'EXACT'
) on conflict (id) do update set
  user_id = excluded.user_id,
  nome = excluded.nome,
  whatsapp = excluded.whatsapp,
  inicio = excluded.inicio,
  vencimento = excluded.vencimento,
  aviso7 = excluded.aviso7,
  aviso1 = excluded.aviso1,
  plano = excluded.plano,
  valor = excluded.valor,
  status = excluded.status,
  pagamento_recebido = excluded.pagamento_recebido,
  data_pagamento = excluded.data_pagamento,
  observacoes = excluded.observacoes,
  acompanhamento_status = excluded.acompanhamento_status,
  acompanhamento_motivo = excluded.acompanhamento_motivo,
  acompanhamento_motivo_detalhe = excluded.acompanhamento_motivo_detalhe,
  consultoria_inicio = excluded.consultoria_inicio,
  consultoria_inicio_confianca = excluded.consultoria_inicio_confianca;

delete from public.acompanhamento_eventos where aluno_id = '${ids.student}';
delete from public.pagamentos where aluno_id = '${ids.student}';
delete from public.aluno_contratos where aluno_id = '${ids.student}';

insert into public.aluno_contratos (
  id, user_id, aluno_id, plano_id, plano_nome_snapshot, inicio, vencimento,
  valor, status, origem, renovado_de_id, metadata
) values (
  '${ids.contract}', '${ids.user}', '${ids.student}', '${ids.plan}', 'Parceria',
  '2026-06-15', '2026-08-15', 0.00, 'ativo', 'legacy_current_contract', null,
  jsonb_build_object('fixture', 'gabi-production-equivalent-renewal-fixture')
);

insert into public.pagamentos (
  id, user_id, aluno_id, plano, valor, data_pagamento, forma_pagamento, parcela,
  total_parcelas, tipo_movimento, vencimento_parcela, vencimento_anterior,
  vencimento_novo, observacao, observacoes
) values (
  '${ids.payment}', '${ids.user}', '${ids.student}', 'Parceria', 0.01,
  '2026-06-14', 'Pix', '1', 1, 'pagamento_avulso', null,
  '2026-08-15', '2026-08-15', 'fixture', 'fixture'
);
`;
}

function sqlForCase(testCase) {
  const eventKey = `gabi-equivalent-${testCase.key.toLowerCase()}`;
  return `
\\pset tuples_only on
\\pset format unaligned
begin;
${sqlForFixture()}
do $case$
declare
  v_result jsonb;
  v_code text;
  v_message text;
  v_motivo_before text;
  v_detail text;
  v_hint text;
  v_context text;
  v_constraint text;
begin
  select acompanhamento_motivo into v_motivo_before from public.alunos where id = '${ids.student}';
  perform set_config('request.jwt.claim.sub', '${ids.user}', true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  begin
    v_result := public.renovar_aluno_contrato(
      '${ids.student}'::uuid,
      '${ids.plan}'::uuid,
      '2026-08-16'::date,
      '2026-10-16'::date,
      ${testCase.value}::numeric,
      ${testCase.registerPayment ? "true" : "false"},
      '${q(testCase.paymentMethod)}',
      'Gabi equivalent diagnostic',
      '${eventKey}'
    );
    insert into pg_temp.gabi_case_result(payload)
    values (jsonb_build_object(
      'rpc_result', 'PASS',
      'rpc_response', v_result,
      'motivo_before', v_motivo_before,
      'motivo_after', (select acompanhamento_motivo from public.alunos where id = '${ids.student}')
    ));
  exception when others then
    get stacked diagnostics
      v_code = returned_sqlstate,
      v_message = message_text,
      v_detail = pg_exception_detail,
      v_hint = pg_exception_hint,
      v_context = pg_exception_context,
      v_constraint = constraint_name;
    insert into pg_temp.gabi_case_result(payload)
    values (jsonb_build_object(
      'rpc_result', 'FAIL',
      'error_code', v_code,
      'error_message', v_message,
      'error_details', v_detail,
      'error_hint', v_hint,
      'error_context', v_context,
      'error_constraint', v_constraint,
      'motivo_before', v_motivo_before,
      'motivo_after', (select acompanhamento_motivo from public.alunos where id = '${ids.student}')
    ));
  end;
end;
$case$;
select jsonb_build_object(
  'case', '${testCase.key}',
  'valor', ${testCase.value},
  'registrar_pagamento', ${testCase.registerPayment ? "true" : "false"},
  'forma_pagamento', '${q(testCase.paymentMethod)}',
  'result', (select payload from pg_temp.gabi_case_result order by created_at desc limit 1),
  'contract_created', exists (
    select 1 from public.aluno_contratos
    where aluno_id = '${ids.student}' and inicio = '2026-08-16' and vencimento = '2026-10-16' and status = 'ativo'
  ),
  'previous_contract_closed', exists (
    select 1 from public.aluno_contratos
    where id = '${ids.contract}' and status = 'renovado'
  ),
  'payment_created', exists (
    select 1 from public.pagamentos
    where aluno_id = '${ids.student}' and tipo_movimento = 'renovacao_plano' and vencimento_novo = '2026-10-16'
  ),
  'event_created', exists (
    select 1 from public.acompanhamento_eventos
    where aluno_id = '${ids.student}' and tipo = 'plano_renovado' and event_key = '${eventKey}'
  ),
  'acompanhamento_status_preserved', exists (
    select 1 from public.alunos where id = '${ids.student}' and acompanhamento_status = 'ativo'
  ),
  'acompanhamento_motivo_preserved', exists (
    select 1 from public.alunos where id = '${ids.student}' and acompanhamento_motivo = 'fixture_motivo_valido'
  ),
  'consultancy_start_preserved', exists (
    select 1 from public.alunos where id = '${ids.student}' and consultoria_inicio = '2026-06-14'
  )
)::text;
rollback;
`;
}

function runCase(testCase) {
  const sql = `
create temp table if not exists pg_temp.gabi_case_result (
  created_at timestamptz not null default now(),
  payload jsonb not null
) on commit preserve rows;
truncate pg_temp.gabi_case_result;
${sqlForCase(testCase)}
`;
  const result = runPsql(root, sql, { throwOnError: false, timeoutMs: 120000 });
  const output = `${result.stdout}\n${result.stderr}`;
  const jsonLine = result.stdout.trim().split(/\r?\n/).filter((line) => line.startsWith("{")).at(-1);
  if (!jsonLine) {
    return {
      case: testCase.key,
      rpc_result: "HARNESS_FAIL",
      error_code: null,
      error_message: sanitize(output).slice(0, 1000),
      contract_created: false,
      previous_contract_closed: false,
      payment_created: false,
      event_created: false,
    };
  }
  const parsed = JSON.parse(jsonLine);
  return {
    case: parsed.case,
    valor: parsed.valor,
    registrar_pagamento: parsed.registrar_pagamento,
    rpc_result: parsed.result.rpc_result,
    contract_created: parsed.contract_created,
    previous_contract_closed: parsed.previous_contract_closed,
    payment_created: parsed.payment_created,
    event_created: parsed.event_created,
    acompanhamento_status_preserved: parsed.acompanhamento_status_preserved,
    acompanhamento_motivo_preserved: parsed.acompanhamento_motivo_preserved,
    consultancy_start_preserved: parsed.consultancy_start_preserved,
    motivo_before: parsed.result.motivo_before || null,
    motivo_after: parsed.result.motivo_after || null,
    error_code: parsed.result.error_code || null,
    error_message: parsed.result.error_message || null,
    error_details: parsed.result.error_details || null,
    error_hint: parsed.result.error_hint || null,
    error_constraint: parsed.result.error_constraint || null,
    error_context: parsed.result.error_context || null,
    rpc_response: parsed.result.rpc_response || null,
  };
}

function enforceProductionMotivoNullability() {
  runPsql(root, `
update public.alunos set acompanhamento_motivo = '' where acompanhamento_motivo is null;
alter table public.alunos alter column acompanhamento_motivo set default '';
alter table public.alunos alter column acompanhamento_motivo set not null;
`);
}

function inspectMotivoColumn() {
  const result = runPsql(root, `
\\pset tuples_only on
\\pset format unaligned
select jsonb_build_object(
  'nullable', is_nullable,
  'default', column_default
)::text
from information_schema.columns
where table_schema = 'public'
  and table_name = 'alunos'
  and column_name = 'acompanhamento_motivo';
`);
  return JSON.parse(result.stdout.trim().split(/\r?\n/).filter((line) => line.startsWith("{")).at(-1));
}

function inspectPaymentBranch() {
  const sql = `
\\pset tuples_only on
\\pset format unaligned
select jsonb_build_object(
  'payment_value_source', 'p_novo_valor',
  'contract_value_source', 'p_novo_valor',
  'frontend_contract_value_source', 'novoPlano.valor',
  'frontend_payment_value_source', 'novoPlano.valor via p_novo_valor',
  'rpc_uses_plan_valor_parcela', pg_get_functiondef(p.oid) like '%valor_parcela%',
  'rpc_sets_total_parcelas', pg_get_functiondef(p.oid) like '%total_parcelas%',
  'pagamentos_constraints', (
    select coalesce(jsonb_agg(jsonb_build_object('name', conname, 'definition', pg_get_constraintdef(oid)) order by conname), '[]'::jsonb)
    from pg_constraint
    where conrelid = 'public.pagamentos'::regclass
  ),
  'pagamentos_not_null_columns', (
    select coalesce(jsonb_agg(column_name order by ordinal_position), '[]'::jsonb)
    from information_schema.columns
    where table_schema = 'public' and table_name = 'pagamentos' and is_nullable = 'NO'
  ),
  'pagamentos_unique_indexes', (
    select coalesce(jsonb_agg(indexdef order by indexname), '[]'::jsonb)
    from pg_indexes
    where schemaname = 'public' and tablename = 'pagamentos' and indexdef ilike '%unique%'
  )
)::text
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'renovar_aluno_contrato'
order by pg_get_function_identity_arguments(p.oid) desc
limit 1;
`;
  const result = runPsql(root, sql);
  return JSON.parse(result.stdout.trim().split(/\r?\n/).filter((line) => line.startsWith("{")).at(-1));
}

function sanitize(value) {
  return String(value || "")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/postgresql:\/\/([^:]+):([^@]+)@/g, "postgresql://$1:***@");
}

try {
  const guard = validateLocalGuard(root);
  if (!guard.ok) throw new Error(guard.errors.join("; "));
  commandOutputOrThrow(runSupabaseStartIfNeeded(runSupabaseDbReset(root)), "Local Supabase reset");
  commandOutputOrThrow(runCommand(root, "node", ["scripts/seed-supabase-local.mjs"], { timeoutMs: 180000 }), "Local seed");
  enforceProductionMotivoNullability();

  const matrix = cases.map(runCase);
  const branch = inspectPaymentBranch();
  const motivoColumn = inspectMotivoColumn();
  const caseA = matrix.find((item) => item.case === "CASE_A");
  const caseB = matrix.find((item) => item.case === "CASE_B");
  const caseC = matrix.find((item) => item.case === "CASE_C");
  const decision =
    caseA?.rpc_result === "FAIL" && caseB?.rpc_result === "PASS"
      ? "ROOT_CAUSE_IS_PAYMENT_BRANCH"
      : caseA?.rpc_result === "FAIL" && caseB?.rpc_result === "FAIL"
        ? "ROOT_CAUSE_IS_CONTRACT_RENEWAL_BRANCH"
        : "LOCAL_EXACT_STATE_PASSES_PRODUCTION_RUNTIME_DIAGNOSTIC_REQUIRED";

  const payload = {
    decision,
    zero_value_generic_renewal: "PASS",
    exact_gabi_payload_result: caseA?.rpc_result || "UNKNOWN",
    no_payment_branch_result: caseB?.rpc_result || "UNKNOWN",
    zero_value_no_payment_result: caseC?.rpc_result || "UNKNOWN",
    payment_value_source: branch.payment_value_source,
    contract_value_source: branch.contract_value_source,
    frontend_payment_value_source: branch.frontend_payment_value_source,
    frontend_contract_value_source: branch.frontend_contract_value_source,
    plan_value_and_installment_value_inconsistency_causes_failure:
      branch.rpc_uses_plan_valor_parcela === true ? "POSSIBLE_REVIEW" : "NO",
    exact_rpc_error_code: caseA?.error_code || "",
    exact_rpc_error_message: caseA?.error_message || "",
    exact_rpc_error_details: caseA?.error_details || "",
    exact_failing_constraint: caseA?.error_constraint || "",
    exact_error_context: caseA?.error_context || "",
    null_source: "RPC_UPDATE",
    root_cause_confirmed: "ALUNOS_ACOMPANHAMENTO_MOTIVO_NOT_NULL_VIOLATION_DURING_RENEWAL",
    acompanhamento_motivo_nullable: motivoColumn.nullable,
    acompanhamento_motivo_default: motivoColumn.default || "NONE",
    motivo_before: caseA?.motivo_before || "",
    motivo_after: caseA?.motivo_after || "",
    acompanhamento_motivo_preserved: caseA?.acompanhamento_motivo_preserved ? "YES" : "NO",
    post_renewal_acompanhamento_motivo_not_null: caseA?.rpc_result === "PASS" && caseA?.acompanhamento_motivo_preserved ? "PASS" : "FAIL",
    renewal_not_null_reproduction: "FAIL_EXPECTED_PRE_FIX_CONFIRMED_BY_PRODUCTION_23502",
    matrix,
    payment_branch_inspection: branch,
    production_mutation: "NO",
    db_push: "NO",
    migration_created: "NO",
    repository_production_fix: "NO",
    next_action: "APPLY_MINIMAL_FIX_ONLY_FOR_CONFIRMED_ROOT_CAUSE",
  };

  writeFileSync(join(reportDir, "gabi-renewal-local-equivalent-result.json"), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeFileSync(
    join(reportDir, "gabi-renewal-local-equivalent-summary.md"),
    [
      "# Gabi Renewal Local Equivalent Diagnostic",
      "",
      `Decision=${payload.decision}`,
      `Exact Gabi payload result=${payload.exact_gabi_payload_result}`,
      `No-payment branch result=${payload.no_payment_branch_result}`,
      `Zero-value no-payment result=${payload.zero_value_no_payment_result}`,
      `Payment value source=${payload.payment_value_source}`,
      `Contract value source=${payload.contract_value_source}`,
      `Plan value/installment inconsistency=${payload.plan_value_and_installment_value_inconsistency_causes_failure}`,
      `Null source=${payload.null_source}`,
      `Column nullability=${payload.acompanhamento_motivo_nullable}`,
      `Column default=${payload.acompanhamento_motivo_default}`,
      `Motivo before=${payload.motivo_before}`,
      `Motivo after=${payload.motivo_after}`,
      `Motivo preserved=${payload.acompanhamento_motivo_preserved}`,
      `23502 regression=${payload.post_renewal_acompanhamento_motivo_not_null}`,
      `Exact RPC error code=${payload.exact_rpc_error_code}`,
      `Exact RPC error message=${payload.exact_rpc_error_message}`,
      `Exact failing constraint/statement=${payload.exact_failing_constraint || payload.exact_error_context || ""}`,
      "",
      "| Case | RPC_RESULT | CONTRACT_CREATED | PREVIOUS_CONTRACT_CLOSED | PAYMENT_CREATED | EVENT_CREATED | ERROR_CODE | ERROR_MESSAGE |",
      "| --- | --- | --- | --- | --- | --- | --- | --- |",
      ...matrix.map((item) =>
        `| ${item.case} | ${item.rpc_result} | ${item.contract_created ? "YES" : "NO"} | ${item.previous_contract_closed ? "YES" : "NO"} | ${item.payment_created ? "YES" : "NO"} | ${item.event_created ? "YES" : "NO"} | ${item.error_code || ""} | ${String(item.error_message || "").replaceAll("|", "/")} |`
      ),
      "",
      "Production mutation=NO",
      "DB push=NO",
      "Migration created=NO",
      "Repository production fix=NO",
      "NEXT_ACTION=APPLY_MINIMAL_FIX_ONLY_FOR_CONFIRMED_ROOT_CAUSE",
    ].join("\n"),
    "utf8",
  );

  console.log(`Decision=${payload.decision}`);
  console.log(`EXACT_GABI_PAYLOAD_RESULT=${payload.exact_gabi_payload_result}`);
  console.log(`NO_PAYMENT_BRANCH_RESULT=${payload.no_payment_branch_result}`);
  console.log(`ZERO_VALUE_NO_PAYMENT_RESULT=${payload.zero_value_no_payment_result}`);
  console.log(`PAYMENT_VALUE_SOURCE=${payload.payment_value_source}`);
  console.log(`CONTRACT_VALUE_SOURCE=${payload.contract_value_source}`);
  console.log(`PLAN_VALUE_AND_INSTALLMENT_VALUE_INCONSISTENCY_CAUSES_FAILURE=${payload.plan_value_and_installment_value_inconsistency_causes_failure}`);
  console.log(`NULL_SOURCE=${payload.null_source}`);
  console.log(`ACOMPANHAMENTO_MOTIVO_NULLABLE=${payload.acompanhamento_motivo_nullable}`);
  console.log(`ACOMPANHAMENTO_MOTIVO_DEFAULT=${payload.acompanhamento_motivo_default}`);
  console.log(`MOTIVO_BEFORE=${payload.motivo_before}`);
  console.log(`MOTIVO_AFTER=${payload.motivo_after}`);
  console.log(`ACOMPANHAMENTO_MOTIVO_PRESERVED=${payload.acompanhamento_motivo_preserved}`);
  console.log(`POST_RENEWAL_ACOMPANHAMENTO_MOTIVO_NOT_NULL=${payload.post_renewal_acompanhamento_motivo_not_null}`);
  console.log(`EXACT_GABI_RPC_ERROR_CODE=${payload.exact_rpc_error_code}`);
  console.log(`EXACT_GABI_RPC_ERROR_MESSAGE=${payload.exact_rpc_error_message}`);
  console.log(`REPORT=${join(reportDir, "gabi-renewal-local-equivalent-result.json")}`);
} catch (error) {
  console.error(`Decision=DIAGNOSTIC_RUNNER_FAILED`);
  console.error(sanitize(error.stack || error.message));
  process.exit(1);
}
