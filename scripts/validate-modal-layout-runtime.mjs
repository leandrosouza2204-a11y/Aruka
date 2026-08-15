import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildAppUrl, resolveRuntimeConfig } from "./lib/authenticated-runtime.js";
import {
  cleanupAuthenticatedQaPage,
  evaluateExpression,
  prepareAuthenticatedQaPage,
  waitForExpression,
} from "./lib/authenticated-browser-state.js";
import { cleanupBillingRuntimeFixture, prepareBillingRuntimeFixture } from "./lib/billing-runtime-fixture.mjs";

const css = readFileSync("src/index.css", "utf8");
const modalBase = readFileSync("src/features/financeiro/components/modals/ModalBase.jsx", "utf8");
const runtimeConfig = resolveRuntimeConfig(process.env, { legacyBaseUrlAliases: ["QA_BASE_URL"] });
const cdpUrl = runtimeConfig.cdpUrl;
const financeiroReady = "Boolean(document.querySelector('[data-testid=\"financeiro-page\"]')) && !location.pathname.includes('/login')";
const dashboardReady = "Boolean(document.querySelector('.dashboard-stats-grid')) && !location.pathname.includes('/login')";
let client = null;
let fixture = null;

try {
  const staticChecks = [
    ["MODAL_BASE_CHANGED", modalBase.includes("larguraPorTamanho") && modalBase.includes("--financeiro-modal-width")],
    ["MODAL_SIZING_CONTRACT", ["sm", "md", "lg", "xl", "wide", "content"].every((size) => modalBase.includes(`${size}:`))],
    ["RELATORIO_BODY_SCROLL_CONTRACT", css.includes(".financeiro-modal-scroll") && css.includes("overflow-y: auto")],
    ["HISTORICO_WIDE_CONTRACT", css.includes("width: min(1560px, 96vw)") && css.includes("width: max(100%, 1260px)")],
  ];
  for (const [label, ok] of staticChecks) {
    console.log(`${label}=${ok ? "PASS" : "FAIL"}`);
    assert(ok, label);
  }

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
  fixture = await prepareBillingRuntimeFixture({ user: sessionUser });

  const reportResults = [];
  for (const viewport of [
    { width: 320, height: 800, mobile: true },
    { width: 390, height: 844, mobile: true },
    { width: 430, height: 932, mobile: true },
    { width: 768, height: 1024, mobile: false },
    { width: 1024, height: 768, mobile: false },
    { width: 1366, height: 768, mobile: false },
    { width: 1440, height: 900, mobile: false },
    { width: 1920, height: 1080, mobile: false },
  ]) {
    reportResults.push(await validateReport(viewport));
  }

  const historyResults = [];
  for (const width of [1366, 1440, 1920]) {
    historyResults.push(await validateHistory({ width, height: 900, mobile: false }));
  }

  const reportScrollOk = reportResults.every((item) => item.scrollOk);
  const reportReachable = reportResults.every((item) => item.lastReachable);
  const documentSideEffect = reportResults.some((item) => item.documentScrolled);
  const historyWidthOk = historyResults.every((item) => item.modalUsesViewport);
  const tableWidthOk = historyResults.every((item) => item.tableUsesModal);
  const prematureScroll = historyResults.some((item) => item.prematureScroll);

  console.log(`RELATORIO_MODAL_VERTICAL_SCROLL=${reportScrollOk ? "PASS" : "FAIL"}`);
  console.log(`RELATORIO_LAST_ELEMENT_REACHABLE=${reportReachable ? "PASS" : "FAIL"}`);
  console.log(`DOCUMENT_VERTICAL_SCROLL_SIDE_EFFECT=${documentSideEffect ? "YES" : "NO"}`);
  console.log(`HISTORICO_MODAL_USES_AVAILABLE_DESKTOP_WIDTH=${historyWidthOk ? "PASS" : "FAIL"}`);
  console.log(`TABLE_WRAPPER_USES_MODAL_WIDTH=${tableWidthOk ? "PASS" : "FAIL"}`);
  console.log(`HORIZONTAL_SCROLL_PREMATURE=${prematureScroll ? "YES" : "NO"}`);
  for (const item of historyResults) {
    console.log(`HISTORICO_WIDTH viewport=${item.viewportWidth} modal=${item.modalWidth} tableWrapper=${item.tableWrapperWidth} scroll=${item.internalScroll ? "YES" : "NO"}`);
  }

  assert(reportScrollOk, "RELATORIO_MODAL_VERTICAL_SCROLL_FAIL");
  assert(reportReachable, "RELATORIO_LAST_ELEMENT_NOT_REACHABLE");
  assert(!documentSideEffect, "DOCUMENT_VERTICAL_SCROLL_SIDE_EFFECT");
  assert(historyWidthOk, "HISTORICO_MODAL_WIDTH_TOO_SMALL");
  assert(tableWidthOk, "HISTORICO_TABLE_WRAPPER_NOT_USING_MODAL");
  assert(!prematureScroll, "HISTORICO_HORIZONTAL_SCROLL_PREMATURE");

  console.log("MODAL_AUDIT_COUNT=financial-runtime-focused");
  console.log("MODAL_LAYOUT_RUNTIME=PASS");
} catch (error) {
  process.exitCode = 1;
  console.error("MODAL_LAYOUT_RUNTIME=FAIL");
  console.error(`MODAL_LAYOUT_DETAIL=${sanitize(String(error?.message || error))}`);
} finally {
  try {
    if (fixture) await cleanupBillingRuntimeFixture(fixture);
  } catch (error) {
    process.exitCode = 1;
    console.error(`MODAL_LAYOUT_FIXTURE_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  try {
    if (client) {
      await cleanupAuthenticatedQaPage(client, {
        neutralUrl: buildAppUrl(runtimeConfig.baseUrl, "/dashboard"),
        readyExpression: dashboardReady,
      });
    }
  } catch (error) {
    console.error(`MODAL_LAYOUT_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  client?.close?.();
}

async function validateReport(viewport) {
  await openFinanceiro(viewport);
  await openAction("Relatório do aluno");
  await waitForExpression(client, "Boolean(document.querySelector('.financeiro-modal.relatorio-aluno-modal'))", 10000);
  if (viewport.width === 1440) await captureScreenshot("relatorio-top-1440.png");
  const result = await evaluateExpression(client, `(() => {
    const modal = document.querySelector('.financeiro-modal.relatorio-aluno-modal');
    const scroller = modal?.querySelector('.financeiro-modal-scroll');
    const beforeDocY = Math.round(window.scrollY || document.documentElement.scrollTop || 0);
    const before = scroller ? { top: scroller.scrollTop, client: scroller.clientHeight, scroll: scroller.scrollHeight } : null;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
    const last = Array.from(scroller?.children || []).at(-1);
    const scrollRect = scroller?.getBoundingClientRect();
    const lastRect = last?.getBoundingClientRect();
    return {
      scrollOk: Boolean(scroller) && getComputedStyle(scroller).overflowY !== 'visible' && before.scroll >= before.client,
      lastReachable: Boolean(lastRect && scrollRect && lastRect.bottom <= scrollRect.bottom + 2),
      documentScrolled: Math.round(window.scrollY || document.documentElement.scrollTop || 0) !== beforeDocY,
      clientHeight: before?.client || 0,
      scrollHeight: before?.scroll || 0,
    };
  })()`);
  if (viewport.width === 1440) await captureScreenshot("relatorio-bottom-1440.png");
  await closeModal();
  return result;
}

async function validateHistory(viewport) {
  await openFinanceiro(viewport);
  await openAction("Ver histórico");
  await waitForExpression(client, "Boolean(document.querySelector('.financeiro-modal.historico-financeiro-modal'))", 10000);
  if (viewport.width === 1440) await captureScreenshot("historico-1440.png");
  const result = await evaluateExpression(client, `(() => {
    const modal = document.querySelector('.financeiro-modal.historico-financeiro-modal');
    const wrapper = modal?.querySelector('.financeiro-history-table');
    const modalRect = modal?.getBoundingClientRect();
    const wrapperRect = wrapper?.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const expected = Math.min(1560, viewportWidth * 0.96);
    return {
      viewportWidth,
      modalWidth: Math.round(modalRect?.width || 0),
      tableWrapperWidth: Math.round(wrapperRect?.width || 0),
      internalScroll: Boolean(wrapper && wrapper.scrollWidth > wrapper.clientWidth + 1),
      modalUsesViewport: Math.round(modalRect?.width || 0) >= expected - 36,
      tableUsesModal: Math.round(wrapperRect?.width || 0) >= Math.round(modalRect?.width || 0) - 64,
      prematureScroll: Boolean(wrapper && wrapper.scrollWidth > wrapper.clientWidth + 1) && Math.round(modalRect?.width || 0) < expected - 36,
    };
  })()`);
  await closeModal();
  return result;
}

async function openFinanceiro(viewport) {
  await prepareAuthenticatedQaPage(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, "/financeiro"),
    viewport,
    readyExpression: financeiroReady,
    readyTimeout: 20000,
  });
  await waitForExpression(client, "Boolean(document.querySelector('tr .table-actions-trigger, article .table-actions-trigger'))", 20000);
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

async function openAction(label) {
  await evaluateExpression(client, `(() => {
    const trigger = document.querySelector('tr .table-actions-trigger, article .table-actions-trigger');
    trigger?.click();
    return Boolean(trigger);
  })()`);
  await waitForExpression(client, "Boolean(document.querySelector('[role=\"menu\"]'))", 10000);
  await evaluateExpression(client, `(() => {
    const item = Array.from(document.querySelectorAll('[role="menu"] [role="menuitem"], [role="menu"] button'))
      .find((button) => (button.innerText || '').includes(${JSON.stringify(label)}));
    item?.click();
    return Boolean(item);
  })()`);
}

async function closeModal() {
  await evaluateExpression(client, `(() => {
    const button = Array.from(document.querySelectorAll('.financeiro-modal button')).find((item) => /Fechar|Cancelar/i.test(item.innerText || ''));
    button?.click();
    return Boolean(button);
  })()`);
  await waitForExpression(client, "!document.querySelector('.financeiro-modal')", 10000);
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
