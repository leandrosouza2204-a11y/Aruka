import { createClient } from "@supabase/supabase-js";
import { loadQaEnvFile, validateQaEnvironment } from "./qa-environment-guard.mjs";
import { readLocalSupabaseRuntime } from "./local-supabase-runtime.mjs";

export const BILLING_RUNTIME_FIXTURE_NAMES = {
  contractDue: "QA Billing Contract Due",
  installmentDue: "QA Billing Installment Due",
  control: "QA Billing Control Paid",
};

export const BILLING_RUNTIME_FIXTURE_IDS = {
  monthlyPlan: "00000000-0000-4000-8000-000000000b01",
  installmentPlan: "00000000-0000-4000-8000-000000000b02",
  contractStudent: "00000000-0000-4000-8000-000000000b11",
  installmentStudent: "00000000-0000-4000-8000-000000000b12",
  controlStudent: "00000000-0000-4000-8000-000000000b13",
  installmentFirstPayment: "00000000-0000-4000-8000-000000000b21",
  controlFirstPayment: "00000000-0000-4000-8000-000000000b22",
  controlSecondPayment: "00000000-0000-4000-8000-000000000b23",
  controlThirdPayment: "00000000-0000-4000-8000-000000000b24",
};

const FIXTURE_DESCRIPTION = "Fixture deterministico LOCAL_QA billing runtime";
const PLAN_IDS = [BILLING_RUNTIME_FIXTURE_IDS.monthlyPlan, BILLING_RUNTIME_FIXTURE_IDS.installmentPlan];
const STUDENT_IDS = [
  BILLING_RUNTIME_FIXTURE_IDS.contractStudent,
  BILLING_RUNTIME_FIXTURE_IDS.installmentStudent,
  BILLING_RUNTIME_FIXTURE_IDS.controlStudent,
];
const PAYMENT_IDS = [
  BILLING_RUNTIME_FIXTURE_IDS.installmentFirstPayment,
  BILLING_RUNTIME_FIXTURE_IDS.controlFirstPayment,
  BILLING_RUNTIME_FIXTURE_IDS.controlSecondPayment,
  BILLING_RUNTIME_FIXTURE_IDS.controlThirdPayment,
];

export function assertLocalBillingRuntime(runtime) {
  const apiUrl = String(runtime?.apiUrl || "");
  let host = "";
  try {
    host = new URL(apiUrl).hostname.toLowerCase();
  } catch {
    host = "";
  }

  if (!["localhost", "127.0.0.1"].includes(host)) {
    const error = new Error("BILLING_RUNTIME_FIXTURE_LOCAL_GUARD=FAIL");
    error.code = "BILLING_RUNTIME_FIXTURE_LOCAL_GUARD";
    error.host = host || "invalid";
    throw error;
  }

  return { host };
}

export async function prepareBillingRuntimeFixture(options = {}) {
  const context = await createBillingRuntimeFixtureContext(options);
  const { supabase, user } = context;
  const dates = buildFixtureDates();

  await cleanupBillingRuntimeFixture(context);

  await upsertOrFail(supabase, "planos", [
    {
      id: BILLING_RUNTIME_FIXTURE_IDS.monthlyPlan,
      user_id: user.id,
      nome: "QA Billing Monthly Due Plan",
      descricao: FIXTURE_DESCRIPTION,
      duracao_meses: 1,
      valor: 200,
      permite_parcelamento: false,
      quantidade_parcelas: 1,
      valor_parcela: 0,
      intervalo_parcelas_meses: 1,
      ativo: true,
    },
    {
      id: BILLING_RUNTIME_FIXTURE_IDS.installmentPlan,
      user_id: user.id,
      nome: "QA Billing Installment Due Plan",
      descricao: FIXTURE_DESCRIPTION,
      duracao_meses: 3,
      valor: 600,
      permite_parcelamento: true,
      quantidade_parcelas: 3,
      valor_parcela: 200,
      intervalo_parcelas_meses: 1,
      ativo: true,
    },
  ]);

  await upsertOrFail(supabase, "alunos", [
    buildStudent({
      id: BILLING_RUNTIME_FIXTURE_IDS.contractStudent,
      userId: user.id,
      name: BILLING_RUNTIME_FIXTURE_NAMES.contractDue,
      planId: BILLING_RUNTIME_FIXTURE_IDS.monthlyPlan,
      start: dates.contractStart,
      due: dates.contractDue,
      value: 200,
      paid: false,
      notes: "Fixture: contrato vencendo sem alerta de parcela.",
    }),
    buildStudent({
      id: BILLING_RUNTIME_FIXTURE_IDS.installmentStudent,
      userId: user.id,
      name: BILLING_RUNTIME_FIXTURE_NAMES.installmentDue,
      planId: BILLING_RUNTIME_FIXTURE_IDS.installmentPlan,
      start: dates.installmentStart,
      due: dates.installmentContractDue,
      value: 600,
      paid: false,
      notes: "Fixture: parcela atual vencendo com contrato distante.",
    }),
    buildStudent({
      id: BILLING_RUNTIME_FIXTURE_IDS.controlStudent,
      userId: user.id,
      name: BILLING_RUNTIME_FIXTURE_NAMES.control,
      planId: BILLING_RUNTIME_FIXTURE_IDS.installmentPlan,
      start: dates.controlStart,
      due: dates.controlContractDue,
      value: 600,
      paid: true,
      notes: "Fixture controle quitado.",
    }),
  ]);

  await upsertOrFail(supabase, "pagamentos", [
    buildPayment({
      id: BILLING_RUNTIME_FIXTURE_IDS.installmentFirstPayment,
      userId: user.id,
      studentId: BILLING_RUNTIME_FIXTURE_IDS.installmentStudent,
      plan: "QA Billing Installment Due Plan",
      value: 200,
      paymentDate: dates.installmentStart,
      installment: "1",
      due: dates.installmentStart,
    }),
    buildPayment({
      id: BILLING_RUNTIME_FIXTURE_IDS.controlFirstPayment,
      userId: user.id,
      studentId: BILLING_RUNTIME_FIXTURE_IDS.controlStudent,
      plan: "QA Billing Installment Due Plan",
      value: 200,
      paymentDate: dates.controlStart,
      installment: "1",
      due: dates.controlStart,
    }),
    buildPayment({
      id: BILLING_RUNTIME_FIXTURE_IDS.controlSecondPayment,
      userId: user.id,
      studentId: BILLING_RUNTIME_FIXTURE_IDS.controlStudent,
      plan: "QA Billing Installment Due Plan",
      value: 200,
      paymentDate: dates.controlSecondPayment,
      installment: "2",
      due: dates.controlSecondPayment,
    }),
    buildPayment({
      id: BILLING_RUNTIME_FIXTURE_IDS.controlThirdPayment,
      userId: user.id,
      studentId: BILLING_RUNTIME_FIXTURE_IDS.controlStudent,
      plan: "QA Billing Installment Due Plan",
      value: 200,
      paymentDate: dates.controlThirdPayment,
      installment: "3",
      due: dates.controlThirdPayment,
    }),
  ]);

  const counts = await countBillingRuntimeFixture(context);

  return {
    ...context,
    dates,
    names: BILLING_RUNTIME_FIXTURE_NAMES,
    ids: BILLING_RUNTIME_FIXTURE_IDS,
    counts,
    dateConvention: "local-noon-relative-date-to-YYYY-MM-DD",
  };
}

export async function cleanupBillingRuntimeFixture(options = {}) {
  const context = options.supabase ? options : await createBillingRuntimeFixtureContext(options);
  const { supabase } = context;

  await deleteByIdsOrFail(supabase, "pagamentos", PAYMENT_IDS);
  await deleteByIdsOrFail(supabase, "alunos", STUDENT_IDS);
  await deleteByIdsOrFail(supabase, "planos", PLAN_IDS);

  return countBillingRuntimeFixture(context);
}

export async function countBillingRuntimeFixture(options = {}) {
  const context = options.supabase ? options : await createBillingRuntimeFixtureContext(options);
  const { supabase } = context;
  const [plans, students, payments] = await Promise.all([
    countByIds(supabase, "planos", PLAN_IDS),
    countByIds(supabase, "alunos", STUDENT_IDS),
    countByIds(supabase, "pagamentos", PAYMENT_IDS),
  ]);

  return { plans, students, payments };
}

export async function createBillingRuntimeFixtureContext(options = {}) {
  loadQaEnvFile(".env.local");
  loadQaEnvFile(".env.qa.local");

  const runtime = options.runtime || readLocalSupabaseRuntime();
  assertLocalBillingRuntime(runtime);
  validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

  const supabase =
    options.supabase ||
    createClient(runtime.apiUrl, runtime.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

  const email = options.email || process.env.QA_BILLING_RUNTIME_USER_EMAIL || "personal.cycle8@example.invalid";
  const user = options.user || (await findUserByEmail(supabase, email));
  if (!user) throw new Error(`BILLING_RUNTIME_FIXTURE_QA_USER_NOT_FOUND=${email}`);

  return { supabase, runtime, user, email, localGuard: "PASS" };
}

async function findUserByEmail(supabase, targetEmail) {
  let page = 1;
  while (page < 20) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((item) => item.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
  return null;
}

function buildFixtureDates() {
  const installmentDue = dateOffset(2);
  const installmentStart = addMonths(installmentDue, -1);
  const controlStart = dateOffset(-90);

  return {
    contractStart: dateOffset(-25),
    contractDue: dateOffset(5),
    installmentStart,
    installmentContractDue: dateOffset(95),
    installmentDue,
    controlStart,
    controlSecondPayment: addMonths(controlStart, 1),
    controlThirdPayment: addMonths(controlStart, 2),
    controlContractDue: dateOffset(120),
  };
}

function buildStudent({ id, userId, name, planId, start, due, value, paid, notes }) {
  return {
    id,
    user_id: userId,
    nome: name,
    whatsapp: "11990009999",
    nascimento: "1995-01-01",
    inicio: start,
    vencimento: due,
    aviso7: dateAdd(due, -7),
    aviso1: dateAdd(due, -1),
    plano: planId,
    valor: value,
    status: "Ativo",
    pagamento_recebido: paid,
    data_pagamento: paid ? start : null,
    observacoes: `${FIXTURE_DESCRIPTION}. ${notes}`,
    acompanhamento_status: "ativo",
    acompanhamento_encerrado_em: null,
    acompanhamento_motivo: null,
    acompanhamento_motivo_detalhe: "",
  };
}

function buildPayment({ id, userId, studentId, plan, value, paymentDate, installment, due }) {
  return {
    id,
    user_id: userId,
    aluno_id: studentId,
    plano: plan,
    valor: value,
    data_pagamento: paymentDate,
    forma_pagamento: "pix",
    parcela: installment,
    total_parcelas: 3,
    tipo_movimento: "pagamento_parcela",
    vencimento_parcela: due,
    observacao: FIXTURE_DESCRIPTION,
    observacoes: FIXTURE_DESCRIPTION,
  };
}

async function upsertOrFail(supabase, table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`BILLING_RUNTIME_FIXTURE_UPSERT_FAILED table=${table} detail=${error.message}`);
}

async function deleteByIdsOrFail(supabase, table, ids) {
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) throw new Error(`BILLING_RUNTIME_FIXTURE_CLEANUP_FAILED table=${table} detail=${error.message}`);
}

async function countByIds(supabase, table, ids) {
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true }).in("id", ids);
  if (error) throw new Error(`BILLING_RUNTIME_FIXTURE_COUNT_FAILED table=${table} detail=${error.message}`);
  return count || 0;
}

function dateOffset(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function dateAdd(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(value, months) {
  const date = new Date(`${value}T12:00:00`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}
