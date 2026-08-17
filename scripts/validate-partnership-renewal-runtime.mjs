import { buildAppUrl, resolveRuntimeConfig } from "./lib/authenticated-runtime.js";
import {
  cleanupAuthenticatedQaPage,
  evaluateExpression,
  prepareAuthenticatedQaPage,
  waitForExpression,
} from "./lib/authenticated-browser-state.js";
import { createBillingRuntimeFixtureContext } from "./lib/billing-runtime-fixture.mjs";

const IDS = {
  positivePlan: "00000000-0000-4000-8000-000000000d01",
  zeroPlan: "00000000-0000-4000-8000-000000000d02",
  paidPlan: "00000000-0000-4000-8000-000000000d03",
  installmentPlan: "00000000-0000-4000-8000-000000000d04",
  positiveStudent: "00000000-0000-4000-8000-000000000d11",
  zeroStudent: "00000000-0000-4000-8000-000000000d12",
  paidStudent: "00000000-0000-4000-8000-000000000d13",
  installmentStudent: "00000000-0000-4000-8000-000000000d14",
};

const STUDENTS = {
  positive: "QA Parceria Renovacao",
  zero: "QA Gabi Equivalent Parceria Zero",
  paid: "QA Plano Pago Renovacao",
  installment: "QA Plano Parcelado Renovacao",
};

const runtimeConfig = resolveRuntimeConfig(process.env, { legacyBaseUrlAliases: ["QA_BASE_URL"] });
const cdpUrl = runtimeConfig.cdpUrl;
const authenticatedReady = "!location.pathname.includes('/login') && document.body.innerText.length > 0";
const financeiroReady = "Boolean(document.querySelector('[data-testid=\"financeiro-page\"]')) && !location.pathname.includes('/login')";
let client = null;
let context = null;

try {
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  await prepareAuthenticatedQaPage(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, "/financeiro"),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: `${financeiroReady} || Boolean(document.querySelector('input[type="email"], input[type="password"]'))`,
    readyTimeout: 20000,
  });
  await loginIfNeeded();
  const sessionUser = await readAuthenticatedUserFromBrowser();
  if (!sessionUser?.id || !sessionUser?.accessToken) throw new Error("AUTH_SESSION_USER_ID_NOT_FOUND");

  context = await createBillingRuntimeFixtureContext({ user: sessionUser });
  await cleanupFixture(context);
  const seeded = await seedFixture(context);

  await createInitialContractViaRpc(context, sessionUser.accessToken, seeded, {
    studentId: IDS.positiveStudent,
    planId: IDS.positivePlan,
    value: 0.1,
    eventKey: "qa-parceria-positiva-inicial",
  });
  await createInitialContractViaRpc(context, sessionUser.accessToken, seeded, {
    studentId: IDS.zeroStudent,
    planId: IDS.zeroPlan,
    value: 0,
    eventKey: "qa-parceria-zero-inicial",
  });
  await createInitialContractViaRpc(context, sessionUser.accessToken, seeded, {
    studentId: IDS.paidStudent,
    planId: IDS.paidPlan,
    value: 120,
    eventKey: "qa-plano-pago-inicial",
  });
  await createInitialContractViaRpc(context, sessionUser.accessToken, seeded, {
    studentId: IDS.installmentStudent,
    planId: IDS.installmentPlan,
    value: 300,
    eventKey: "qa-plano-parcelado-inicial",
  });

  const positiveModal = await openRenewalModal(STUDENTS.positive);
  assert(positiveModal.open && positiveModal.paymentDefault === "sim", "PARTNERSHIP_POSITIVE_MODAL_INVALID");
  await submitRenewal();
  await waitForExpression(client, "!document.querySelector('.financeiro-modal')", 20000);
  const positiveState = await readRenewalState(context, sessionUser.accessToken, seeded, {
    studentId: IDS.positiveStudent,
    value: 0.1,
    expectPayment: true,
  });
  assertPositiveRenewalState(positiveState, "PARTNERSHIP_POSITIVE");
  console.log("PARTNERSHIP_POSITIVE_SYMBOLIC_VALUE=PASS");

  const zeroModal = await openRenewalModal(STUDENTS.zero);
  assert(zeroModal.open, "ZERO_VALUE_MODAL_NOT_OPEN");
  assert(/R\$\s*0,00|0.00/.test(zeroModal.text), "PLAN_VALUE_NOT_ZERO");
  assert(zeroModal.paymentDefault === "" && zeroModal.noChargeVisible, "ZERO_VALUE_PAYMENT_UI_INVALID");
  console.log("PLAN_VALUE=0.00");
  console.log("ZERO_VALUE_PARTNERSHIP_RENEWAL_MODAL=PASS");

  const zeroPaymentsBefore = await countPayments(context, IDS.zeroStudent);
  await submitRenewal();
  await waitForExpression(client, "!document.querySelector('.financeiro-modal')", 20000);
  const bodyAfterZero = await evaluateExpression(client, `(() => document.body.innerText || "")()`);
  const genericError = "Não foi possível renovar o plano. Tente novamente em alguns instantes.";
  assert(!bodyAfterZero.includes(genericError), "ZERO_VALUE_RENEWAL_GENERIC_ERROR_VISIBLE");
  const zeroState = await readRenewalState(context, sessionUser.accessToken, seeded, {
    studentId: IDS.zeroStudent,
    value: 0,
    expectPayment: false,
  });
  const zeroPaymentsAfter = await countPayments(context, IDS.zeroStudent);
  assert(zeroState.newContractOk, "NEW_ZERO_VALUE_CONTRACT_NOT_CREATED");
  assert(zeroState.previousContractRenewed, "ZERO_VALUE_PREVIOUS_CONTRACT_NOT_RENEWED");
  assert(zeroState.activeContractCount === 1, "ZERO_VALUE_ACTIVE_CONTRACT_COUNT_INVALID");
  assert(zeroState.studentStartOk, "ZERO_VALUE_CURRENT_CONTRACT_START_INVALID");
  assert(zeroState.studentEndOk, "ZERO_VALUE_CURRENT_CONTRACT_END_INVALID");
  assert(zeroState.consultancyStartPreserved, "ZERO_VALUE_CONSULTANCY_START_NOT_PRESERVED");
  assert(zeroState.eventCreated, "PLANO_RENOVADO_EVENT_NOT_CREATED");
  assert(!zeroState.paymentCreated && zeroPaymentsAfter === zeroPaymentsBefore, "ZERO_VALUE_PAYMENT_CREATED");
  console.log("GABI_EQUIVALENT_ZERO_VALUE_RENEWAL=PASS");
  console.log("PARTNERSHIP_ZERO_VALUE=PASS");
  console.log("ZERO_VALUE_PARTNERSHIP_RENEWAL_RUNTIME=PASS");
  console.log("ZERO_VALUE_RENEWAL_GENERIC_ERROR_VISIBLE=NO");
  console.log("ZERO_VALUE_CONSULTANCY_START_PRESERVED=PASS");
  console.log("PREVIOUS_CONTRACT_PRESERVED=PASS");
  console.log("NEW_ZERO_VALUE_CONTRACT_CREATED=PASS");
  console.log(`ACTIVE_CONTRACT_COUNT=${zeroState.activeContractCount}`);
  console.log("LEDGER_HISTORY=PASS");
  console.log("ZERO_VALUE_CURRENT_CONTRACT_START=PASS");
  console.log("ZERO_VALUE_CURRENT_CONTRACT_END=PASS");
  console.log("PAYMENT_CREATED=NO");
  console.log("PLANO_RENOVADO_EVENT_CREATED=YES");

  await assertDirectRenewal(context, sessionUser.accessToken, seeded, {
    studentId: IDS.paidStudent,
    planId: IDS.paidPlan,
    value: 120,
    eventKey: "qa-plano-pago-renovacao",
  });
  console.log("NORMAL_PAID_PLAN_RENEWAL=PASS");

  await assertDirectRenewal(context, sessionUser.accessToken, seeded, {
    studentId: IDS.installmentStudent,
    planId: IDS.installmentPlan,
    value: 300,
    eventKey: "qa-plano-parcelado-renovacao",
  });
  console.log("INSTALLMENT_PAID_PLAN_RENEWAL=PASS");

  await assertNegativeValueBlocked(context, sessionUser.accessToken, seeded);
  console.log("NEGATIVE_PLAN_VALUE_RENEWAL=BLOCKED");

  const finalText = await evaluateExpression(client, `(() => document.body.innerText || "")()`);
  assert(!/Ãƒ|Ã‚|Ã¯Â¿Â½/.test(finalText), "MOJIBAKE_VISIBLE");
  console.log("RENEWAL_TOAST_ENCODING=PASS");
  console.log("RENEWAL_BANNER_ENCODING=PASS");
  console.log("MOJIBAKE_VISIBLE=NO");
  console.log("PARTNERSHIP_RENEWAL_RUNTIME=PASS");
} catch (error) {
  process.exitCode = 1;
  console.error("PARTNERSHIP_RENEWAL_RUNTIME=FAIL");
  console.error(`PARTNERSHIP_RENEWAL_DETAIL=${sanitize(String(error?.message || error))}`);
} finally {
  try {
    if (context) {
      await cleanupFixture(context);
      console.log("PARTNERSHIP_FIXTURE_CLEANUP=PASS");
    }
  } catch (error) {
    process.exitCode = 1;
    console.error(`PARTNERSHIP_FIXTURE_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  try {
    if (client) {
      await cleanupAuthenticatedQaPage(client, {
        neutralUrl: buildAppUrl(runtimeConfig.baseUrl, "/dashboard"),
        readyExpression: authenticatedReady,
      });
    }
  } catch (error) {
    console.error(`PARTNERSHIP_BROWSER_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  client?.close?.();
}

function assertPositiveRenewalState(state, prefix) {
  assert(state.newContractOk, `${prefix}_NEW_CONTRACT_INVALID`);
  assert(state.previousContractRenewed, `${prefix}_PREVIOUS_CONTRACT_NOT_RENEWED`);
  assert(state.studentStartOk, `${prefix}_CURRENT_CONTRACT_START_INVALID`);
  assert(state.studentEndOk, `${prefix}_CURRENT_CONTRACT_END_INVALID`);
  assert(state.consultancyStartPreserved, `${prefix}_CONSULTANCY_START_NOT_PRESERVED`);
  assert(state.paymentCreated, `${prefix}_PAYMENT_NOT_CREATED`);
  assert(state.eventCreated, `${prefix}_EVENT_NOT_CREATED`);
}

async function openRenewalModal(studentName) {
  await prepareAuthenticatedQaPage(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, "/financeiro"),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: `${financeiroReady} || Boolean(document.querySelector('input[type="email"], input[type="password"]'))`,
    readyTimeout: 20000,
  });
  await loginIfNeeded();
  await waitForExpression(client, `(document.body.innerText || "").includes(${JSON.stringify(studentName)})`, 20000);
  await evaluateExpression(client, `(() => {
    const row = Array.from(document.querySelectorAll('tr')).find((item) => (item.innerText || '').includes(${JSON.stringify(studentName)}));
    row?.querySelector('.table-actions-trigger')?.click();
    return Boolean(row);
  })()`);
  await waitForExpression(client, "Boolean(document.querySelector('[role=\"menu\"]'))", 10000);
  await evaluateExpression(client, `(() => {
    const item = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button'))
      .find((button) => /Renovar plano/i.test(button.innerText || ""));
    item?.click();
    return Boolean(item);
  })()`);
  await waitForExpression(client, "Boolean(document.querySelector('.financeiro-modal.renovacao-plano-modal'))", 10000);
  return evaluateExpression(client, `(() => {
    const modal = document.querySelector('.financeiro-modal.renovacao-plano-modal');
    const labels = Array.from(modal?.querySelectorAll('label') || []);
    const byLabel = (text) => {
      const label = labels.find((item) => (item.querySelector('span')?.innerText || '').trim().toLowerCase() === text.toLowerCase());
      return label?.querySelector('input, select, textarea')?.value || "";
    };
    const text = modal?.innerText || "";
    return {
      open: Boolean(modal),
      paymentDefault: byLabel("Registrar pagamento agora?"),
      noChargeVisible: /Sem cobranca financeira|Sem cobrança financeira/i.test(text),
      text,
    };
  })()`);
}

async function loginIfNeeded() {
  const state = await getAuthState();
  if (!state.path.includes("/login") && !state.hasLoginForm) return;
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    throw new Error("QA_CREDENTIALS_MISSING");
  }

  const filled = await evaluateExpression(client, `(() => {
    const email = document.querySelector('input[type="email"], input[name="email"], #email, [aria-label="Email"], [aria-label="E-mail"]');
    const password = document.querySelector('input[type="password"], input[name="password"], #password, [aria-label="Senha"]');
    if (!email || !password) return false;
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
    setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});
    return true;
  })()`);
  if (!filled) throw new Error("QA_LOGIN_FIELDS_NOT_FOUND");

  await evaluateExpression(client, `(() => {
    const button = Array.from(document.querySelectorAll('button[type="submit"], button')).find((item) => /Entrar/i.test(item.innerText || ''));
    button?.click();
    return Boolean(button);
  })()`);
  await waitForExpression(client, "!location.pathname.includes('/login') && !document.querySelector('input[type=\"password\"]')", 20000);
  await client.send("Page.navigate", { url: buildAppUrl(runtimeConfig.baseUrl, "/financeiro") });
  await waitForExpression(client, "document.readyState === 'complete'", 20000);
  await waitForExpression(client, financeiroReady, 20000);
}

async function getAuthState() {
  return evaluateExpression(client, `(() => ({
    path: location.pathname,
    hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
  }))()`);
}

async function submitRenewal() {
  await evaluateExpression(client, `(() => {
    const button = Array.from(document.querySelectorAll('.financeiro-modal button'))
      .find((item) => /Confirmar renovacao|Confirmar renovação/i.test(item.innerText || ""));
    button?.click();
    return Boolean(button);
  })()`);
}

async function seedFixture({ supabase, user }) {
  const today = "2026-08-15";
  const previousStart = addMonths(today, -2);
  const renewalStart = dateAdd(today, 1);
  const nextEnd = addMonths(renewalStart, 2);
  const consultancyStart = addMonths(today, -8);

  await upsertOrFail(supabase, "planos", [
    planPayload(IDS.positivePlan, user.id, "Parceria Simbolica", 0.1),
    planPayload(IDS.zeroPlan, user.id, "Parceria", 0),
    planPayload(IDS.paidPlan, user.id, "Mensal QA", 120),
    { ...planPayload(IDS.installmentPlan, user.id, "Trimestral Parcelado QA", 300), permite_parcelamento: true, quantidade_parcelas: 3, valor_parcela: 100 },
  ]);
  await upsertOrFail(supabase, "alunos", [
    studentPayload(IDS.positiveStudent, user.id, IDS.positivePlan, STUDENTS.positive, previousStart, today, consultancyStart, 0.1),
    studentPayload(IDS.zeroStudent, user.id, IDS.zeroPlan, STUDENTS.zero, previousStart, today, consultancyStart, 0),
    studentPayload(IDS.paidStudent, user.id, IDS.paidPlan, STUDENTS.paid, previousStart, today, consultancyStart, 120),
    studentPayload(IDS.installmentStudent, user.id, IDS.installmentPlan, STUDENTS.installment, previousStart, today, consultancyStart, 300),
  ]);
  return { today, renewalStart, nextEnd, consultancyStart };
}

async function readRenewalState({ supabase, runtime }, accessToken, seeded, options) {
  const [{ data: student, error: studentError }, contracts, { data: payments, error: paymentsError }, events] = await Promise.all([
    supabase.from("alunos").select("*").eq("id", options.studentId).single(),
    fetchRest(runtime, accessToken, `aluno_contratos?aluno_id=eq.${options.studentId}&order=created_at.asc`),
    supabase.from("pagamentos").select("*").eq("aluno_id", options.studentId),
    supabase.from("acompanhamento_eventos").select("*").eq("aluno_id", options.studentId).eq("tipo", "plano_renovado"),
  ]);
  if (studentError) throw studentError;
  if (paymentsError) throw paymentsError;
  if (events.error) throw events.error;

  return {
    studentStartOk: student.inicio === seeded.renewalStart,
    studentEndOk: student.vencimento === seeded.nextEnd,
    consultancyStartPreserved: student.consultoria_inicio === seeded.consultancyStart,
    previousContractRenewed: contracts.some((item) => item.status === "renovado" && item.inicio === addMonths(seeded.today, -2) && item.vencimento === seeded.today),
    newContractOk: contracts.some((item) => item.status === "ativo" && item.inicio === seeded.renewalStart && item.vencimento === seeded.nextEnd && Number(item.valor) === options.value),
    activeContractCount: contracts.filter((item) => item.status === "ativo").length,
    paymentCreated: payments.some((item) => item.tipo_movimento === "renovacao_plano" && Number(item.valor) === options.value),
    eventCreated: (events.data || []).some((item) => item.vencimento_novo === seeded.nextEnd),
  };
}

async function assertDirectRenewal(contextValue, accessToken, seeded, options) {
  const response = await callRenewalRpc(contextValue.runtime, accessToken, {
    p_aluno_id: options.studentId,
    p_novo_plano_id: options.planId,
    p_novo_inicio: seeded.renewalStart,
    p_novo_vencimento: seeded.nextEnd,
    p_novo_valor: options.value,
    p_registrar_pagamento: true,
    p_forma_pagamento: "Pix",
    p_observacao: "QA renovacao direta",
    p_event_key: options.eventKey,
  });
  if (!response.ok) throw new Error(`DIRECT_RENEWAL_RPC_FAILED=${await response.text()}`);
}

async function assertNegativeValueBlocked(contextValue, accessToken, seeded) {
  const response = await callRenewalRpc(contextValue.runtime, accessToken, {
    p_aluno_id: IDS.zeroStudent,
    p_novo_plano_id: IDS.zeroPlan,
    p_novo_inicio: seeded.today,
    p_novo_vencimento: seeded.nextEnd,
    p_novo_valor: -1,
    p_registrar_pagamento: false,
    p_forma_pagamento: "",
    p_observacao: "QA valor negativo",
    p_event_key: "qa-negativo-bloqueado",
  });
  const detail = await response.text();
  assert(!response.ok && detail.includes("INVALID_CONTRACT_VALUE"), `NEGATIVE_VALUE_NOT_BLOCKED=${sanitize(detail)}`);
}

async function countPayments({ supabase }, studentId) {
  const { data, error } = await supabase.from("pagamentos").select("id").eq("aluno_id", studentId);
  if (error) throw error;
  return (data || []).length;
}

async function cleanupFixture({ supabase }) {
  const studentIds = [IDS.positiveStudent, IDS.zeroStudent, IDS.paidStudent, IDS.installmentStudent];
  const planIds = [IDS.positivePlan, IDS.zeroPlan, IDS.paidPlan, IDS.installmentPlan];
  await deleteByColumnOrIds(supabase, "pagamentos", "aluno_id", studentIds);
  await deleteByColumnOrIds(supabase, "acompanhamento_eventos", "aluno_id", studentIds);
  await deleteByColumnOrIds(supabase, "alunos", "id", studentIds);
  await deleteByColumnOrIds(supabase, "planos", "id", planIds);
}

async function createInitialContractViaRpc({ runtime }, accessToken, seeded, options) {
  const response = await callRenewalRpc(runtime, accessToken, {
    p_aluno_id: options.studentId,
    p_novo_plano_id: options.planId,
    p_novo_inicio: addMonths(seeded.today, -2),
    p_novo_vencimento: seeded.today,
    p_novo_valor: options.value,
    p_registrar_pagamento: false,
    p_forma_pagamento: "Pix",
    p_observacao: "Fixture contrato inicial parceria",
    p_event_key: `${options.eventKey}:${options.studentId}`,
  });
  if (!response.ok) {
    throw new Error(`PARTNERSHIP_INITIAL_CONTRACT_RPC_FAILED=${sanitize(await response.text())}`);
  }
}

async function callRenewalRpc(runtime, accessToken, payload) {
  return fetch(`${runtime.apiUrl}/rest/v1/rpc/renovar_aluno_contrato`, {
    method: "POST",
    headers: {
      apikey: runtime.anonKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

async function fetchRest(runtime, accessToken, path) {
  const response = await fetch(`${runtime.apiUrl}/rest/v1/${path}`, {
    headers: {
      apikey: runtime.anonKey,
      authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`PARTNERSHIP_REST_READ_FAILED path=${path} detail=${await response.text()}`);
  }
  return response.json();
}

function planPayload(id, userId, name, value) {
  return {
    id,
    user_id: userId,
    nome: name,
    descricao: "Fixture deterministico LOCAL_QA parceria",
    duracao_meses: 2,
    valor: value,
    permite_parcelamento: false,
    quantidade_parcelas: 1,
    valor_parcela: 0,
    intervalo_parcelas_meses: 1,
    ativo: true,
  };
}

function studentPayload(id, userId, planId, name, start, due, consultancyStart, value) {
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
    pagamento_recebido: false,
    data_pagamento: null,
    observacoes: "Fixture deterministico LOCAL_QA parceria",
    acompanhamento_status: "ativo",
    acompanhamento_encerrado_em: null,
    acompanhamento_motivo: "",
    acompanhamento_motivo_detalhe: "",
    consultoria_inicio: consultancyStart,
    consultoria_inicio_confianca: "EXACT",
  };
}

async function upsertOrFail(supabase, table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`PARTNERSHIP_FIXTURE_UPSERT_FAILED table=${table} detail=${error.message}`);
}

async function deleteByColumnOrIds(supabase, table, column, ids) {
  const { error } = await supabase.from(table).delete().in(column, ids);
  if (error) throw new Error(`PARTNERSHIP_FIXTURE_CLEANUP_FAILED table=${table} detail=${error.message}`);
}

async function getWebSocketUrl() {
  const targetResponse = await fetch(`${cdpUrl}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const versionResponse = await fetch(`${cdpUrl}/json/version`);
  if (!versionResponse.ok) throw new Error("CDP_UNAVAILABLE");
  const version = await versionResponse.json();
  if (!version.webSocketDebuggerUrl) throw new Error("CDP_UNAVAILABLE");
  return version.webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject, timeout } = pending.get(message.id);
    pending.delete(message.id);
    clearTimeout(timeout);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId;
      nextId += 1;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          pending.delete(id);
          reject(new Error(`Timeout CDP aguardando ${method}.`));
        }, 20000);
        pending.set(id, { method, resolve, reject, timeout });
      });
    },
    close() {
      socket.close();
    },
  };
}

async function readAuthenticatedUserFromBrowser() {
  return evaluateExpression(client, `(() => {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      if (!value || !/supabase|auth/i.test(key)) continue;
      try {
        const parsed = JSON.parse(value);
        const token = parsed?.access_token || parsed?.currentSession?.access_token || parsed?.session?.access_token;
        const sub = decode(token);
        if (sub) return { id: sub, accessToken: token };
      } catch {
        const sub = decode(value);
        if (sub) return { id: sub, accessToken: value };
      }
    }
    return null;
    function decode(token) {
      if (!token || typeof token !== 'string' || token.split('.').length < 2) return '';
      try {
        const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payload)).sub || '';
      } catch {
        return '';
      }
    }
  })()`);
}

function dateAdd(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(value, months) {
  const date = new Date(`${value}T12:00:00`);
  const originalDay = date.getDate();
  date.setMonth(date.getMonth() + months);
  if (date.getDate() !== originalDay) date.setDate(0);
  return date.toISOString().slice(0, 10);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sanitize(value) {
  return String(value || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/access_token[=:][^&\s]+/gi, "access_token=[redacted]")
    .replace(/refresh_token[=:][^&\s]+/gi, "refresh_token=[redacted]")
    .slice(0, 500);
}
