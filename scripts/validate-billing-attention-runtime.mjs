import { buildAppUrl, resolveRuntimeConfig, RUNTIME_MARKERS } from "./lib/authenticated-runtime.js";
import {
  cleanupAuthenticatedQaPage,
  evaluateExpression,
  prepareAuthenticatedQaPage,
  waitForExpression,
} from "./lib/authenticated-browser-state.js";
import { cleanupBillingRuntimeFixture, prepareBillingRuntimeFixture } from "./lib/billing-runtime-fixture.mjs";

const runtimeConfig = resolveRuntimeConfig(process.env, {
  legacyBaseUrlAliases: ["BILLING_QA_BASE_URL", "QA_BASE_URL"],
});
const dashboardUrl = buildAppUrl(runtimeConfig.baseUrl, "/dashboard");
const cdpUrl = runtimeConfig.cdpUrl;
const dashboardReadyExpression =
  "Boolean(document.querySelector('.dashboard-stats-grid')) && !location.pathname.includes('/login') && Array.from(document.querySelectorAll('.dashboard-stats-grid .dashboard-metric-card')).some((item) => /Parcelas vencendo/i.test(item.innerText) && !item.innerText.includes('...'))";
const dashboardShellReadyExpression =
  "Boolean(document.querySelector('.dashboard-stats-grid')) && !location.pathname.includes('/login')";
const alunosReadyExpression =
  "Boolean(document.querySelector('[data-testid=\"alunos-page\"]')) && !location.pathname.includes('/login')";
const financeiroDesktopReadyExpression =
  "Boolean(document.querySelector('.financeiro-desktop-table')) && !location.pathname.includes('/login')";
const financeiroMobileReadyExpression =
  "Boolean(document.querySelector('.financeiro-mobile-cards')) && !location.pathname.includes('/login')";

let client = null;
let fixture = null;

try {
  client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  await client.send("Page.enable");
  await client.send("Runtime.enable");

  await preparePageOrExplain(client, {
    url: dashboardUrl,
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: dashboardShellReadyExpression,
    label: "dashboard-session-discovery",
  });
  const sessionUser = await readAuthenticatedUserFromBrowser(client);
  assertRuntime(sessionUser?.id, "AUTH_SESSION_USER_ID_NOT_FOUND");

  fixture = await prepareBillingRuntimeFixture({ user: sessionUser });
  console.log("BILLING_RUNTIME_FIXTURE_LOCAL_GUARD=PASS");
  console.log("BILLING_RUNTIME_FIXTURE_SETUP=PASS");
  console.log(`BILLING_RUNTIME_FIXTURE_USER_ID=${maskIdentifier(sessionUser.id)}`);
  console.log(`BILLING_RUNTIME_FIXTURE_DATE_CONVENTION=${fixture.dateConvention}`);
  console.log(`BILLING_RUNTIME_FIXTURE_CONTRACT_STUDENT_ID=${fixture.ids.contractStudent}`);
  console.log(`BILLING_RUNTIME_FIXTURE_INSTALLMENT_STUDENT_ID=${fixture.ids.installmentStudent}`);
  console.log(`BILLING_RUNTIME_FIXTURE_COUNTS=plans:${fixture.counts.plans}|students:${fixture.counts.students}|payments:${fixture.counts.payments}`);

  await preparePageOrExplain(client, {
    url: dashboardUrl,
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: dashboardReadyExpression,
    label: "dashboard",
  });
  await waitForExpression(client, dashboardReadyExpression, 20000);

  const dashboard = await evaluateExpression(client, `(() => {
    const stats = Array.from(document.querySelectorAll(".dashboard-stats-grid .dashboard-metric-card"));
    const installmentCard = stats.find((item) => /Parcelas vencendo/i.test(item.innerText));
    const contractCard = stats.find((item) => /Contratos vencendo/i.test(item.innerText));
    const installmentCountText = installmentCard?.querySelector(".dashboard-stat-value")?.innerText || "";
    const contractCountText = contractCard?.querySelector(".dashboard-stat-value")?.innerText || "";
    const installmentAction = Array.from(document.querySelectorAll(".dashboard-alerts-section a"))
      .find((item) => /Ver parcelas/i.test(item.innerText));

    return {
      installmentCount: Number(installmentCountText.replace(/\\D/g, "")),
      contractCount: Number(contractCountText.replace(/\\D/g, "")),
      installmentCardHref: installmentCard?.querySelector("a")?.getAttribute("href") || "",
      contractCardHref: contractCard?.querySelector("a")?.getAttribute("href") || "",
      installmentActionHref: installmentAction?.getAttribute("href") || "",
    };
  })()`);

  assertRuntime(dashboard.installmentCount >= 1, "DASHBOARD_INSTALLMENT_DUE_UNIQUE_COUNT_ZERO");
  assertRuntime(dashboard.contractCount >= 1, "DASHBOARD_CONTRACT_DUE_UNIQUE_COUNT_ZERO");
  assertRuntime(
    dashboard.installmentCardHref === "/alunos?status=Vencendo%20parcela&origem=dashboard",
    `DASHBOARD_INSTALLMENT_CARD_HREF_INVALID=${dashboard.installmentCardHref}`,
  );
  assertRuntime(
    dashboard.installmentActionHref === "/alunos?status=Vencendo%20parcela&origem=dashboard",
    `DASHBOARD_INSTALLMENT_ACTION_HREF_INVALID=${dashboard.installmentActionHref}`,
  );
  assertRuntime(
    dashboard.contractCardHref === "/alunos?status=Vencendo&origem=dashboard",
    `DASHBOARD_CONTRACT_CARD_HREF_INVALID=${dashboard.contractCardHref}`,
  );

  await preparePageOrExplain(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, dashboard.contractCardHref),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: alunosReadyExpression,
    label: "alunos-contract-card",
  });
  await waitForFixtureText(client, fixture.names.contractDue, 20000);
  const alunosContract = await readAlunosFilterState(client, fixture.names.contractDue);
  if (!alunosContract.fixtureVisible) {
    console.error(`ALUNOS_CONTRACT_DEBUG=${sanitize(JSON.stringify(alunosContract))}`);
  }
  assertRuntime(alunosContract.fixtureVisible, "CONTRACT_FIXTURE_NOT_VISIBLE_FROM_CARD");

  await preparePageOrExplain(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, dashboard.installmentCardHref),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: alunosReadyExpression,
    label: "alunos-installment-card",
  });
  await waitForFixtureText(client, fixture.names.installmentDue, 20000);
  const alunosCard = await readAlunosFilterState(client, fixture.names.installmentDue);
  if (alunosCard.zeroResults || !alunosCard.fixtureVisible) {
    console.error(`ALUNOS_CARD_DEBUG=${sanitize(JSON.stringify(alunosCard))}`);
  }
  assertRuntime(!alunosCard.zeroResults, "INSTALLMENT_FILTER_CARD_RETURNED_ZERO");
  assertRuntime(alunosCard.fixtureVisible, "INSTALLMENT_FIXTURE_NOT_VISIBLE_FROM_CARD");
  assertRuntime(alunosCard.fixtureActive, "INSTALLMENT_FIXTURE_NOT_ACTIVE_IN_ALUNOS");
  assertRuntime(alunosCard.fixtureBillingAttention, "INSTALLMENT_FIXTURE_BILLING_ATTENTION_MISSING_IN_ALUNOS");

  await preparePageOrExplain(client, {
    url: buildAppUrl(runtimeConfig.baseUrl, dashboard.installmentActionHref),
    viewport: { width: 1366, height: 768, mobile: false },
    readyExpression: alunosReadyExpression,
    label: "alunos-installment-action",
  });
  await waitForFixtureText(client, fixture.names.installmentDue, 20000);
  const alunosAction = await readAlunosFilterState(client, fixture.names.installmentDue);
  assertRuntime(!alunosAction.zeroResults, "INSTALLMENT_FILTER_ACTION_RETURNED_ZERO");
  assertRuntime(alunosAction.fixtureVisible, "INSTALLMENT_FIXTURE_NOT_VISIBLE_FROM_ACTION");

  const financeResults = [];
  const financeiroFixtureUrl = buildAppUrl(runtimeConfig.baseUrl, `/financeiro?alunoId=${fixture.ids.installmentStudent}`);
  for (const width of [1024, 1280, 1366, 1440, 1920]) {
    await preparePageOrExplain(client, {
      url: financeiroFixtureUrl,
      viewport: { width, height: 900, mobile: false },
      readyExpression: financeiroDesktopReadyExpression,
      label: `financeiro-${width}`,
    });
    await waitForFixtureText(client, fixture.names.installmentDue, 20000);
    financeResults.push({ width, ...(await readFinanceLayout(client, fixture.names.installmentDue)) });
  }

  const mobileResults = [];
  for (const width of [320, 360, 390, 414]) {
    await preparePageOrExplain(client, {
      url: financeiroFixtureUrl,
      viewport: { width, height: 900, mobile: true },
      readyExpression: financeiroMobileReadyExpression,
      label: `financeiro-mobile-${width}`,
    });
    await waitForFixtureText(client, fixture.names.installmentDue, 20000);
    mobileResults.push({ width, ...(await readFinanceLayout(client, fixture.names.installmentDue)) });
  }

  const headerOk = financeResults.every((item) => !item.headerOverlap);
  const readable = financeResults.every((item) => item.hasTable && item.billingWidth >= 120);
  const documentOverflow = [...financeResults, ...mobileResults].some((item) => item.docOverflow);
  const mobileOk = mobileResults.every((item) => item.fixtureVisible && item.fixtureBillingAttention && !item.docOverflow);
  const financeFixtureVisible = financeResults.every((item) => item.fixtureVisible);
  const financeFixtureAttention = financeResults.every((item) => item.fixtureBillingAttention);
  const financeFixtureActive = financeResults.every((item) => item.fixtureActive);

  console.log("NEW_RUNTIME_QA_USES_CANONICAL_AUTH_HARNESS=YES");
  console.log(`RUNTIME_BASE_ORIGIN=${new URL(runtimeConfig.baseUrl).origin}`);
  console.log(`CDP_ORIGIN=${new URL(cdpUrl).origin}`);
  console.log(`DASHBOARD_CONTRACT_DUE_UNIQUE_COUNT=${dashboard.contractCount}`);
  console.log(`DASHBOARD_INSTALLMENT_DUE_UNIQUE_COUNT=${dashboard.installmentCount}`);
  console.log(`DASHBOARD_CONTRACT_FIXTURE_VISIBLE=${alunosContract.fixtureVisible ? "PASS" : "FAIL"}`);
  console.log(`DASHBOARD_INSTALLMENT_FIXTURE_VISIBLE=${alunosCard.fixtureVisible ? "PASS" : "FAIL"}`);
  console.log(`CONTRACT_CTA_CARD_RESULT=${alunosContract.fixtureVisible ? "PASS" : "FAIL"}`);
  console.log(`INSTALLMENT_CTA_CARD_RESULT=${alunosCard.zeroResults ? "FAIL" : "PASS"}`);
  console.log(`INSTALLMENT_CTA_ACTION_RESULT=${alunosAction.zeroResults ? "FAIL" : "PASS"}`);
  console.log(`ALUNOS_INSTALLMENT_FILTER_UNIQUE_COUNT=${alunosCard.visibleCount}`);
  console.log(`ALUNOS_INSTALLMENT_FIXTURE_ACTIVE=${alunosCard.fixtureActive ? "PASS" : "FAIL"}`);
  console.log(`ALUNOS_INSTALLMENT_BILLING_ATTENTION=${alunosCard.fixtureBillingAttention ? "PASS" : "FAIL"}`);
  console.log(`INSTALLMENT_FILTER_REAL_MATCH=${alunosCard.zeroResults ? "FAIL" : "PASS"}`);
  console.log(`FINANCE_FIXTURE_VISIBLE=${financeFixtureVisible ? "PASS" : "FAIL"}`);
  console.log(`FINANCE_FIXTURE_ACTIVE=${financeFixtureActive ? "PASS" : "FAIL"}`);
  console.log(`FINANCE_FIXTURE_BILLING_ATTENTION=${financeFixtureAttention ? "PASS" : "FAIL"}`);
  console.log(`FINANCE_BILLING_COLUMN_READABLE=${readable ? "PASS" : "FAIL"}`);
  console.log(`FINANCE_HEADERS_NOT_OVERLAPPING=${headerOk ? "PASS" : "FAIL"}`);
  console.log(`FINANCE_TABLE_INTERNAL_HORIZONTAL_SCROLL=${financeResults.some((item) => item.internalScroll) ? "YES" : "NO"}`);
  console.log(`DOCUMENT_HORIZONTAL_OVERFLOW=${documentOverflow ? "YES" : "NO"}`);
  console.log(`MOBILE_BILLING_ATTENTION_LAYOUT=${mobileOk ? "PASS" : "FAIL"}`);

  for (const item of financeResults) {
    console.log(
      `FINANCE_LAYOUT_WIDTH=${item.width} BILLING_WIDTH=${item.billingWidth} TRACKING_WIDTH=${item.trackingWidth} HEADER_OVERLAP=${item.headerOverlap ? "YES" : "NO"} INTERNAL_SCROLL=${item.internalScroll ? "YES" : "NO"} DOC_OVERFLOW=${item.docOverflow ? "YES" : "NO"}`,
    );
  }

  for (const item of mobileResults) {
    console.log(
      `FINANCE_MOBILE_WIDTH=${item.width} COBRANCA_VISIBLE=${item.mobileText ? "YES" : "NO"} DOC_OVERFLOW=${item.docOverflow ? "YES" : "NO"}`,
    );
  }

  assertRuntime(headerOk, "FINANCE_HEADERS_OVERLAPPING");
  assertRuntime(readable, "FINANCE_BILLING_COLUMN_NOT_READABLE");
  assertRuntime(financeFixtureVisible, "FINANCE_FIXTURE_NOT_VISIBLE");
  assertRuntime(financeFixtureActive, "FINANCE_FIXTURE_NOT_ACTIVE");
  assertRuntime(financeFixtureAttention, "FINANCE_FIXTURE_BILLING_ATTENTION_MISSING");
  assertRuntime(!documentOverflow, "DOCUMENT_HORIZONTAL_OVERFLOW");
  assertRuntime(mobileOk, "MOBILE_BILLING_ATTENTION_LAYOUT_FAIL");

  console.log("BILLING_ATTENTION_RUNTIME=PASS");
} catch (error) {
  process.exitCode = 1;
  console.error("BILLING_ATTENTION_RUNTIME=FAIL");
  console.error(`RUNTIME_QA_DETAIL=${sanitize(String(error?.message || error))}`);
} finally {
  try {
    if (client) {
      await cleanupAuthenticatedQaPage(client, {
        neutralUrl: dashboardUrl,
        readyExpression: dashboardReadyExpression,
      });
    }
  } catch (error) {
    console.error(`RUNTIME_BROWSER_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  try {
    if (fixture) {
      const counts = await cleanupBillingRuntimeFixture(fixture);
      console.log("BILLING_RUNTIME_FIXTURE_CLEANUP=PASS");
      console.log(`BILLING_RUNTIME_FIXTURE_FINAL_COUNTS=plans:${counts.plans}|students:${counts.students}|payments:${counts.payments}`);
    }
  } catch (error) {
    process.exitCode = 1;
    console.error("BILLING_RUNTIME_FIXTURE_CLEANUP_FAILED");
    console.error(`RUNTIME_QA_CLEANUP_DETAIL=${sanitize(String(error?.message || error))}`);
  }
  client?.close?.();
}

async function getWebSocketUrl() {
  const targetResponse = await fetch(`${cdpUrl}/json/new?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });

  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }

  const versionResponse = await fetch(`${cdpUrl}/json/version`);
  if (!versionResponse.ok) throw new Error(RUNTIME_MARKERS.cdpUnavailable);

  const version = await versionResponse.json();
  if (!version.webSocketDebuggerUrl) throw new Error(RUNTIME_MARKERS.cdpUnavailable);

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

    if (message.error) {
      reject(new Error(`${method}: ${message.error.message}`));
      return;
    }

    resolve(message.result);
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
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

async function preparePageOrExplain(client, options) {
  try {
    return await prepareAuthenticatedQaPage(client, {
      ...options,
      readyTimeout: 20000,
    });
  } catch (error) {
    const state = await captureFailureState(client, options.label);
    printFailureState(state);
    if (state.loginVisible || state.pathname.includes("/login")) {
      throw new Error("AUTH_SESSION_REQUIRED");
    }
    if (!state.dashboardIdentifiable && options.label === "dashboard") {
      throw new Error("STALE_DASHBOARD_SELECTOR_OR_ROUTE_NOT_READY");
    }
    throw error;
  }
}

async function captureFailureState(client, label) {
  return evaluateExpression(
    client,
    `(() => {
      const selectors = [
        "[data-page='dashboard']",
        "[data-testid='dashboard-page']",
        ".dashboard-page",
        ".dashboard-stats-grid",
        ".dashboard-alerts-section"
      ];
      return {
        label: ${JSON.stringify(label)},
        href: location.href,
        pathname: location.pathname,
        title: document.title,
        readyState: document.readyState,
        loginVisible: Boolean(document.querySelector('input[type="email"], input[type="password"]')) || location.pathname.includes('/login'),
        dashboardIdentifiable: selectors.some((selector) => Boolean(document.querySelector(selector))),
        selectors: selectors.filter((selector) => Boolean(document.querySelector(selector))),
        text: (document.body.innerText || "").replace(/\\s+/g, " ").slice(0, 220)
      };
    })()`,
  );
}

function printFailureState(state) {
  console.error(`RUNTIME_FAILURE_LABEL=${state.label}`);
  console.error(`RUNTIME_FAILURE_HREF=${sanitize(state.href)}`);
  console.error(`RUNTIME_FAILURE_PATH=${state.pathname}`);
  console.error(`RUNTIME_FAILURE_TITLE=${sanitize(state.title)}`);
  console.error(`RUNTIME_FAILURE_READY_STATE=${state.readyState}`);
  console.error(`LOGIN_VISIBLE=${state.loginVisible ? "YES" : "NO"}`);
  console.error(`DASHBOARD_IDENTIFIABLE=${state.dashboardIdentifiable ? "YES" : "NO"}`);
  console.error(`AVAILABLE_DASHBOARD_SELECTORS=${state.selectors.join("|") || "NONE"}`);
  console.error(`BODY_TEXT_EXCERPT=${sanitize(state.text)}`);
}

async function readAlunosFilterState(client, fixtureName) {
  return evaluateExpression(client, `(() => {
    const text = document.body.innerText || "";
    const totalMatch = text.match(/(\\d+)\\s+de\\s+(\\d+)\\s+alunos/i);
    const fixtureName = ${JSON.stringify(fixtureName)};
    const fixtureIndex = text.indexOf(fixtureName);
    const fixtureWindow = fixtureIndex >= 0 ? text.slice(fixtureIndex, fixtureIndex + 800) : "";
    return {
      path: location.pathname,
      search: location.search,
      filter: document.querySelector("[data-testid='alunos-status-filter']")?.value || "",
      zeroResults: /0\\s+de\\s+\\d+\\s+alunos/i.test(text) || /Nenhum aluno encontrado/i.test(text),
      visibleCount: totalMatch ? Number(totalMatch[1]) : null,
      fixtureVisible: fixtureIndex >= 0,
      fixtureActive: /Ativo/i.test(fixtureWindow),
      fixtureBillingAttention: /Parcela vence/i.test(fixtureWindow),
    };
  })()`);
}

async function readFinanceLayout(client, fixtureName) {
  return evaluateExpression(client, `(() => {
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const table = document.querySelector(".financeiro-desktop-table");
    const scroll = document.querySelector(".financeiro-table .app-table-scroll, .app-table-scroll.financeiro-table");
    const text = document.body.innerText || "";
    const fixtureName = ${JSON.stringify(fixtureName)};
    const fixtureIndex = text.indexOf(fixtureName);
    const fixtureWindow = fixtureIndex >= 0 ? text.slice(fixtureIndex, fixtureIndex + 900) : "";
    const mobileText = /Cobranca|Cobran/i.test(text);
    if (!table) {
      return {
        docOverflow: docWidth > innerWidth + 1,
        mobileText,
        hasTable: false,
        fixtureVisible: fixtureIndex >= 0,
        fixtureActive: /Ativo/i.test(fixtureWindow),
        fixtureBillingAttention: /Parcela vence/i.test(fixtureWindow),
      };
    }

    const headers = Array.from(table.querySelectorAll("th"));
    const billing = headers.find((item) => /Cobran/i.test(item.innerText));
    const tracking = headers.find((item) => /Acompanhamento/i.test(item.innerText));
    const billingRect = billing?.getBoundingClientRect();
    const trackingRect = tracking?.getBoundingClientRect();
    const fixtureRow = Array.from(table.querySelectorAll("tr")).find((row) => row.innerText.includes(fixtureName));
    const fixtureRowText = fixtureRow?.innerText || fixtureWindow;

    return {
      hasTable: true,
      docOverflow: docWidth > innerWidth + 1,
      internalScroll: Boolean(scroll && scroll.scrollWidth > scroll.clientWidth + 1),
      tableMinWidth: Math.round(table.getBoundingClientRect().width),
      billingWidth: Math.round(billingRect?.width || 0),
      trackingWidth: Math.round(trackingRect?.width || 0),
      billingRight: Math.round(billingRect?.right || 0),
      trackingLeft: Math.round(trackingRect?.left || 0),
      headerOverlap: billingRect && trackingRect ? billingRect.right > trackingRect.left + 1 : true,
      mobileText,
      fixtureVisible: Boolean(fixtureRow) || fixtureIndex >= 0,
      fixtureActive: /Ativo/i.test(fixtureRowText),
      fixtureBillingAttention: /Parcela vence/i.test(fixtureRowText),
    };
  })()`);
}

async function readAuthenticatedUserFromBrowser(client) {
  return evaluateExpression(client, `(() => {
    const candidates = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      const value = localStorage.getItem(key);
      if (!value || !/supabase|auth/i.test(key)) continue;
      candidates.push(value);
    }

    for (const value of candidates) {
      try {
        const parsed = JSON.parse(value);
        const accessToken = parsed?.access_token || parsed?.currentSession?.access_token || parsed?.session?.access_token;
        const userId = decodeJwtSub(accessToken);
        if (userId) return { id: userId, email: parsed?.user?.email || parsed?.currentSession?.user?.email || "" };
      } catch {
        const userId = decodeJwtSub(value);
        if (userId) return { id: userId, email: "" };
      }
    }

    return null;

    function decodeJwtSub(token) {
      if (!token || typeof token !== "string" || token.split(".").length < 2) return "";
      try {
        const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(payload)).sub || "";
      } catch {
        return "";
      }
    }
  })()`);
}

async function waitForFixtureText(client, fixtureName, timeout = 20000) {
  await waitForExpression(
    client,
    `(() => (document.body.innerText || "").includes(${JSON.stringify(fixtureName)}))()`,
    timeout,
  );
}

function assertRuntime(condition, message) {
  if (!condition) throw new Error(message);
}

function maskIdentifier(value) {
  const text = String(value || "");
  return text.length > 12 ? `${text.slice(0, 8)}...${text.slice(-4)}` : "***";
}

function sanitize(value) {
  return String(value || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/access_token[=:][^&\s]+/gi, "access_token=[redacted]")
    .replace(/refresh_token[=:][^&\s]+/gi, "refresh_token=[redacted]")
    .slice(0, 300);
}
