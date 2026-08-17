import { mkdirSync, writeFileSync } from "node:fs";
import { buildAppUrl, resolveRuntimeConfig } from "./lib/authenticated-runtime.js";
import {
  cleanupAuthenticatedQaPage,
  evaluateExpression,
  prepareAuthenticatedQaPage,
  waitForExpression,
} from "./lib/authenticated-browser-state.js";
import { createBillingRuntimeFixtureContext } from "./lib/billing-runtime-fixture.mjs";

const IDS = {
  plan: "00000000-0000-4000-8000-000000000c01",
  student: "00000000-0000-4000-8000-000000000c11",
  firstPayment: "00000000-0000-4000-8000-000000000c21",
};
const STUDENT_NAME = "QA Payment Amabile Equivalent";
const PLAN_NAME = "QA Semestral Parcelado";
const runtimeConfig = resolveRuntimeConfig(process.env, {
  legacyBaseUrlAliases: ["BILLING_QA_BASE_URL", "QA_BASE_URL"],
});
const cdpUrl = runtimeConfig.cdpUrl;
const dashboardReady = "Boolean(document.querySelector('.dashboard-stats-grid')) && !location.pathname.includes('/login')";
const financeiroReady = "Boolean(document.querySelector('[data-testid=\"financeiro-page\"]')) && !location.pathname.includes('/login')";
let client = null;
let context = null;

try {
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  await prepareAuthenticatedQaPage(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, "/dashboard"),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: dashboardReady,
    readyTimeout: 20000,
  });
  const sessionUser = await readAuthenticatedUserFromBrowser(client);
  if (!sessionUser?.id) throw new Error("AUTH_SESSION_USER_ID_NOT_FOUND");

  context = await createBillingRuntimeFixtureContext({ user: sessionUser });
  await cleanupFixture(context);
  await seedFixture(context);

  const desktop = await validateMenuAndModal({
    viewport: { width: 1366, height: 768, mobile: false },
    mode: "desktop",
  });
  const mobile = await validateMenuAndModal({
    viewport: { width: 390, height: 844, mobile: true },
    mode: "mobile",
  });

  console.log(`PAYMENT_ACTION_DESKTOP=${desktop.actionVisible ? "PASS" : "FAIL"}`);
  console.log(`PAYMENT_ACTION_MOBILE=${mobile.actionVisible ? "PASS" : "FAIL"}`);
  console.log(`PAYMENT_ACTION_VISIBLE_IN_RENDERED_MENU=${desktop.actionVisible && mobile.actionVisible ? "YES" : "NO"}`);
  console.log(`PAYMENT_MODAL_RENDERED=${desktop.modalRendered && mobile.modalRendered ? "YES" : "NO"}`);
  console.log(`PAYMENT_MODAL_INSTALLMENT_NUMBER=${desktop.installment}/${desktop.totalInstallments}`);
  console.log(`PAYMENT_MODAL_AMOUNT=${Number(desktop.amount).toFixed(2)}`);
  console.log(`AMABILE_PODE_RECEBER=${desktop.debug?.podeReceber ? "true" : "false"}`);
  console.log(`AMABILE_PAYMENT_ELIGIBILITY_REASON=${desktop.debug?.eligibilityReason || "unknown"}`);

  assert(desktop.actionVisible && mobile.actionVisible, "PAYMENT_ACTION_NOT_VISIBLE_IN_RENDERED_MENU");
  assert(desktop.modalRendered && mobile.modalRendered, "PAYMENT_MODAL_NOT_RENDERED");
  assert(String(desktop.installment) === "2" && String(desktop.totalInstallments) === "6", "PAYMENT_MODAL_INSTALLMENT_INVALID");
  assert(Number(desktop.amount).toFixed(2) === "109.90", "PAYMENT_MODAL_AMOUNT_INVALID");
  assert(desktop.debug?.podeReceber, "AMABILE_EQUIVALENT_PODE_RECEBER_FALSE");
  assert(!desktop.modalText.includes("Renovar plano"), "PAYMENT_MODAL_OPENED_RENEWAL_FLOW");

  console.log("PAYMENT_REGISTRATION_RUNTIME=PASS");
} catch (error) {
  process.exitCode = 1;
  console.error("PAYMENT_REGISTRATION_RUNTIME=FAIL");
  console.error(`PAYMENT_RUNTIME_DETAIL=${sanitize(String(error?.message || error))}`);
} finally {
  try {
    if (context) await cleanupFixture(context);
  } catch (error) {
    process.exitCode = 1;
    console.error(`PAYMENT_FIXTURE_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  try {
    if (client) {
      await cleanupAuthenticatedQaPage(client, {
        neutralUrl: buildAppUrl(runtimeConfig.baseUrl, "/dashboard"),
        readyExpression: dashboardReady,
      });
    }
  } catch (error) {
    console.error(`PAYMENT_BROWSER_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  client?.close?.();
}

async function validateMenuAndModal({ viewport, mode }) {
  await prepareAuthenticatedQaPage(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, `/financeiro?alunoId=${IDS.student}`),
    viewport,
    readyExpression: financeiroReady,
    readyTimeout: 20000,
  });
  await waitForExpression(client, `(document.body.innerText || "").includes(${JSON.stringify(STUDENT_NAME)})`, 20000);

  const debug = await evaluateExpression(client, buildDebugExpression());
  await evaluateExpression(client, buildOpenMenuExpression(mode));
  await waitForExpression(client, "Boolean(document.querySelector('[role=\"menu\"]'))", 10000);
  const menuText = await evaluateExpression(client, `document.querySelector('[role="menu"]')?.innerText || ""`);
  const actionVisible = /Registrar pagamento/i.test(menuText);
  await captureScreenshot(`payment-menu-${mode}.png`);

  await evaluateExpression(client, `(() => {
    const item = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button'))
      .find((button) => /Registrar pagamento/i.test(button.innerText || ""));
    item?.click();
    return Boolean(item);
  })()`);
  await waitForExpression(client, "Boolean(document.querySelector('.financeiro-modal')) && /Registrar pagamento/i.test(document.body.innerText || '')", 10000);
  await captureScreenshot(`payment-modal-${mode}.png`);

  const modal = await evaluateExpression(client, `(() => {
    const dialog = document.querySelector('.financeiro-modal');
    const labels = Array.from(dialog?.querySelectorAll('label') || []);
    const byLabel = (text) => {
      const label = labels.find((item) => {
        const labelText = item.querySelector('span')?.innerText || item.innerText || '';
        return labelText.trim().toLowerCase() === text.toLowerCase();
      });
      return label?.querySelector('input, select, textarea')?.value || "";
    };
    return {
      rendered: Boolean(dialog),
      text: dialog?.innerText || "",
      amount: byLabel("Valor recebido"),
      installment: byLabel("Parcela"),
      title: dialog?.querySelector('h2')?.innerText || "",
    };
  })()`);

  return {
    actionVisible,
    modalRendered: modal.rendered && /Registrar pagamento/i.test(modal.title),
    modalText: modal.text,
    amount: modal.amount,
    installment: modal.installment,
    totalInstallments: modal.text.match(/parcela\s+\d+\/(\d+)/i)?.[1] || "",
    debug,
  };
}

function buildDebugExpression() {
  return `(() => {
    const row = Array.from(document.querySelectorAll('tr, article')).find((item) => (item.innerText || '').includes(${JSON.stringify(STUDENT_NAME)}));
    const text = row?.innerText || "";
    const hasNext = /Pr[oó]xima\\s+2\\/6/i.test(text);
    const amount = /109,90|109\\.90/.test(text);
    return {
      rowText: text.replace(/\\s+/g, ' ').slice(0, 900),
      podeReceber: hasNext && amount && /Ativo/i.test(text),
      eligibilityReason: hasNext && amount ? "parcelado_com_proxima_parcela_pendente" : "fixture_row_did_not_expose_expected_installment_state",
    };
  })()`;
}

function buildOpenMenuExpression(mode) {
  const selector = mode === "mobile" ? "article" : "tr";
  return `(() => {
    const root = Array.from(document.querySelectorAll(${JSON.stringify(selector)}))
      .find((item) => (item.innerText || '').includes(${JSON.stringify(STUDENT_NAME)}));
    const trigger = root?.querySelector('[data-testid="aluno-actions-trigger"], .table-actions-trigger');
    trigger?.click();
    return Boolean(trigger);
  })()`;
}

async function seedFixture({ supabase, user }) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const secondDue = dateAdd(today, -3);
  const start = addMonths(secondDue, -1);
  const contractDue = addMonths(start, 6);
  await upsertOrFail(supabase, "planos", [{
    id: IDS.plan,
    user_id: user.id,
    nome: PLAN_NAME,
    descricao: "Fixture deterministico LOCAL_QA pagamento parcelado",
    duracao_meses: 6,
    valor: 659.4,
    permite_parcelamento: true,
    quantidade_parcelas: 6,
    valor_parcela: 109.9,
    intervalo_parcelas_meses: 1,
    ativo: true,
  }]);
  await upsertOrFail(supabase, "alunos", [{
    id: IDS.student,
    user_id: user.id,
    nome: STUDENT_NAME,
    whatsapp: "11990009999",
    nascimento: "1995-01-01",
    inicio: start,
    vencimento: contractDue,
    aviso7: dateAdd(contractDue, -7),
    aviso1: dateAdd(contractDue, -1),
    plano: IDS.plan,
    valor: 659.4,
    status: "Ativo",
    pagamento_recebido: false,
    data_pagamento: null,
    observacoes: "Fixture deterministico LOCAL_QA pagamento parcelado",
    acompanhamento_status: "ativo",
    acompanhamento_encerrado_em: null,
    acompanhamento_motivo: "",
    acompanhamento_motivo_detalhe: "",
  }]);
  await upsertOrFail(supabase, "pagamentos", [{
    id: IDS.firstPayment,
    user_id: user.id,
    aluno_id: IDS.student,
    plano: PLAN_NAME,
    valor: 109.9,
    data_pagamento: start,
    forma_pagamento: "Pix",
    parcela: "1",
    total_parcelas: 6,
    tipo_movimento: "pagamento_parcela",
    vencimento_parcela: start,
    observacao: "Fixture deterministico LOCAL_QA pagamento parcelado",
    observacoes: "Fixture deterministico LOCAL_QA pagamento parcelado",
  }]);
}

async function cleanupFixture({ supabase }) {
  await deleteByIdsOrFail(supabase, "pagamentos", [IDS.firstPayment]);
  await deleteByIdsOrFail(supabase, "alunos", [IDS.student]);
  await deleteByIdsOrFail(supabase, "planos", [IDS.plan]);
}

async function upsertOrFail(supabase, table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`PAYMENT_FIXTURE_UPSERT_FAILED table=${table} detail=${error.message}`);
}

async function deleteByIdsOrFail(supabase, table, ids) {
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) throw new Error(`PAYMENT_FIXTURE_CLEANUP_FAILED table=${table} detail=${error.message}`);
}

async function captureScreenshot(name) {
  const result = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  mkdirSync("tmp-responsive-screenshots", { recursive: true });
  writeFileSync(`tmp-responsive-screenshots/${name}`, Buffer.from(result.data, "base64"));
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

async function readAuthenticatedUserFromBrowser(clientInstance) {
  return evaluateExpression(clientInstance, `(() => {
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      if (!value || !/supabase|auth/i.test(key)) continue;
      try {
        const parsed = JSON.parse(value);
        const token = parsed?.access_token || parsed?.currentSession?.access_token || parsed?.session?.access_token;
        const sub = decode(token);
        if (sub) return { id: sub };
      } catch {
        const sub = decode(value);
        if (sub) return { id: sub };
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
  const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`);
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
