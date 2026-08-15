import { buildAppUrl, resolveRuntimeConfig } from "./lib/authenticated-runtime.js";
import {
  cleanupAuthenticatedQaPage,
  evaluateExpression,
  prepareAuthenticatedQaPage,
  waitForExpression,
} from "./lib/authenticated-browser-state.js";
import { createBillingRuntimeFixtureContext } from "./lib/billing-runtime-fixture.mjs";

const IDS = {
  plan: "00000000-0000-4000-8000-000000000d01",
  zeroPlan: "00000000-0000-4000-8000-000000000d02",
  student: "00000000-0000-4000-8000-000000000d11",
  zeroStudent: "00000000-0000-4000-8000-000000000d12",
  previousContract: "00000000-0000-4000-8000-000000000d21",
  zeroContract: "00000000-0000-4000-8000-000000000d22",
};
const PLAN_NAME = "Parceria";
const STUDENT_NAME = "QA Parceria Renovacao";
const ZERO_STUDENT_NAME = "QA Parceria Valor Zero";
const PARTNERSHIP_VALUE = 0.1;
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
  await createInitialContractViaRpc(context, sessionUser.accessToken, seeded);

  const modal = await openRenewalModal(STUDENT_NAME);
  assert(modal.open && modal.paymentDefault === "sim", "PARTNERSHIP_RENEWAL_MODAL_INVALID");
  console.log("PARTNERSHIP_RENEWAL_MODAL=PASS");

  await submitRenewal();
  await waitForExpression(client, "!document.querySelector('.financeiro-modal')", 20000);
  const state = await readRenewalState(context, sessionUser.accessToken, seeded);
  assert(state.newContractOk, "PARTNERSHIP_NEW_CONTRACT_INVALID");
  assert(state.previousContractRenewed, "PARTNERSHIP_PREVIOUS_CONTRACT_NOT_RENEWED");
  assert(state.studentStartOk, "PARTNERSHIP_CURRENT_CONTRACT_START_INVALID");
  assert(state.studentEndOk, "PARTNERSHIP_CURRENT_CONTRACT_END_INVALID");
  assert(state.consultancyStartPreserved, "PARTNERSHIP_CONSULTANCY_START_NOT_PRESERVED");
  assert(state.paymentCreated, "PARTNERSHIP_PAYMENT_NOT_CREATED");

  console.log("PARTNERSHIP_RENEWAL_SUBMIT=PASS");
  console.log("PARTNERSHIP_RENEWAL_RUNTIME=PASS");
  console.log("PARTNERSHIP_NEW_CONTRACT=PASS");
  console.log("PARTNERSHIP_CONSULTANCY_START_PRESERVED=PASS");
  console.log("PARTNERSHIP_CURRENT_CONTRACT_START=PASS");
  console.log("PARTNERSHIP_CURRENT_CONTRACT_END=PASS");
  console.log("PARTNERSHIP_LEDGER_HISTORY=PASS");
  console.log("PARTNERSHIP_PAYMENT_CREATED=YES_EXPECTED");

  await openRenewalModal(ZERO_STUDENT_NAME);
  await submitRenewal({ expectOpen: true });
  const errorText = await evaluateExpression(client, `(() => document.body.innerText || "")()`);
  const expected = "Não foi possível renovar o plano. Tente novamente em alguns instantes.";
  const mojibake = /Ã|Â|ï¿½/.test(errorText);
  assert(errorText.includes(expected), "RENEWAL_ERROR_TEXT_NOT_RENDERED");
  assert(!mojibake, "MOJIBAKE_VISIBLE");
  console.log(`RENEWAL_ERROR_TEXT_RENDERED=${JSON.stringify(expected)}`);
  console.log("RENEWAL_TOAST_ENCODING=PASS");
  console.log("RENEWAL_BANNER_ENCODING=PASS");
  console.log("MOJIBAKE_VISIBLE=NO");
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
    return {
      open: Boolean(modal),
      paymentDefault: byLabel("Registrar pagamento agora?"),
      text: modal?.innerText || "",
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
  const today = localDate(new Date());
  const previousStart = addMonths(today, -2);
  const nextEnd = addMonths(today, 2);
  const consultancyStart = addMonths(today, -8);

  await upsertOrFail(supabase, "planos", [
    planPayload(IDS.plan, user.id, PLAN_NAME, PARTNERSHIP_VALUE),
    planPayload(IDS.zeroPlan, user.id, "Parceria Zero", 0),
  ]);
  await upsertOrFail(supabase, "alunos", [
    studentPayload(IDS.student, user.id, IDS.plan, STUDENT_NAME, previousStart, today, consultancyStart, PARTNERSHIP_VALUE),
    studentPayload(IDS.zeroStudent, user.id, IDS.zeroPlan, ZERO_STUDENT_NAME, previousStart, today, consultancyStart, 0),
  ]);
  return { today, nextEnd, consultancyStart };
}

async function readRenewalState({ supabase, runtime }, accessToken, seeded) {
  const [{ data: student, error: studentError }, contracts, { data: payments, error: paymentsError }] = await Promise.all([
    supabase.from("alunos").select("*").eq("id", IDS.student).single(),
    fetchRest(runtime, accessToken, `aluno_contratos?aluno_id=eq.${IDS.student}&order=created_at.asc`),
    supabase.from("pagamentos").select("*").eq("aluno_id", IDS.student),
  ]);
  if (studentError) throw studentError;
  if (paymentsError) throw paymentsError;

  return {
    studentStartOk: student.inicio === seeded.today,
    studentEndOk: student.vencimento === seeded.nextEnd,
    consultancyStartPreserved: student.consultoria_inicio === seeded.consultancyStart,
    previousContractRenewed: contracts.some((item) => item.status === "renovado" && item.inicio === addMonths(seeded.today, -2) && item.vencimento === seeded.today),
    newContractOk: contracts.some((item) => item.status === "ativo" && item.inicio === seeded.today && item.vencimento === seeded.nextEnd),
    paymentCreated: payments.some((item) => item.tipo_movimento === "renovacao_plano" && Number(item.valor) === PARTNERSHIP_VALUE),
  };
}

async function cleanupFixture({ supabase }) {
  await deleteByColumnOrIds(supabase, "pagamentos", "aluno_id", [IDS.student, IDS.zeroStudent]);
  await deleteByColumnOrIds(supabase, "acompanhamento_eventos", "aluno_id", [IDS.student, IDS.zeroStudent]);
  await deleteByColumnOrIds(supabase, "alunos", "id", [IDS.student, IDS.zeroStudent]);
  await deleteByColumnOrIds(supabase, "planos", "id", [IDS.plan, IDS.zeroPlan]);
}

async function createInitialContractViaRpc({ runtime }, accessToken, seeded) {
  const response = await fetch(`${runtime.apiUrl}/rest/v1/rpc/renovar_aluno_contrato`, {
    method: "POST",
    headers: {
      apikey: runtime.anonKey,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      p_aluno_id: IDS.student,
      p_novo_plano_id: IDS.plan,
      p_novo_inicio: addMonths(seeded.today, -2),
      p_novo_vencimento: seeded.today,
      p_novo_valor: PARTNERSHIP_VALUE,
      p_registrar_pagamento: false,
      p_forma_pagamento: "Pix",
      p_observacao: "Fixture contrato inicial parceria",
      p_event_key: `qa-parceria-inicial:${IDS.student}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`PARTNERSHIP_INITIAL_CONTRACT_RPC_FAILED=${await response.text()}`);
  }
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
    acompanhamento_motivo: null,
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

function localDate(date) {
  const value = new Date(date);
  value.setHours(12, 0, 0, 0);
  return value.toISOString().slice(0, 10);
}

function dateAdd(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(value, months) {
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`);
  date.setMonth(date.getMonth() + months);
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
    .slice(0, 300);
}
