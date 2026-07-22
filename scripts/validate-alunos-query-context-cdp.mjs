import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cdpPort = process.env.CDP_PORT || "9222";
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const appUrl = `${baseUrl}/alunos`;
const screenshotDir = join("reports", "product-audit", "alunos-cycle-1", "screenshots");

validateQaCredentials();

async function getWebSocketUrl() {
  const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (created.ok) {
    const target = await created.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const version = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!version.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  return (await version.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const listeners = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method && listeners.has(message.method)) {
      for (const listener of listeners.get(message.method)) listener(message.params || {});
    }
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(`${method}: ${message.error.message}`));
    else resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    on(method, listener) {
      if (!listeners.has(method)) listeners.set(method, []);
      listeners.get(method).push(listener);
    },
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Erro ao avaliar expressao.");
  }
  return result.result.value;
}

async function waitFor(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return true;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function loginIfNeeded(client) {
  const state = await authState(client);
  if (!state.path.includes("/login") && !state.hasLoginForm) return "reused";
  const filled = await evaluate(client, `(() => {
    const email = document.querySelector('input[type="email"], input[name="email"], #email');
    const password = document.querySelector('input[type="password"], input[name="password"], #password');
    if (!email || !password) return false;
    const setValue = (input, value) => {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL)});
    setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD)});
    document.querySelector('button[type="submit"], button')?.click();
    return true;
  })()`);
  if (!filled) throw new Error("Falha no login QA: campos nao encontrados.");
  await waitFor(client, "!location.pathname.includes('/login')", 15000);
  return "logged-in";
}

function authState(client) {
  return evaluate(client, `(() => ({ path: location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function openAlunos(client, query = "") {
  await client.send("Page.navigate", { url: `${appUrl}${query}` });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) {
    await loginIfNeeded(client);
    await client.send("Page.navigate", { url: `${appUrl}${query}` });
  }
  await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"]')");
  await waitFor(client, "document.querySelector('[data-testid=\"alunos-search\"]') && document.querySelector('[data-testid=\"alunos-status-filter\"]') && document.querySelector('[data-testid=\"alunos-plan-filter\"]')");
  await waitFor(client, "!document.body.textContent.includes('Carregando alunos')", 25000);
  await sleep(500);
}

async function getFilterState(client) {
  return evaluate(client, `(() => ({
    url: location.pathname + location.search,
    busca: document.querySelector('[data-testid="alunos-search"]')?.value || "",
    status: document.querySelector('[data-testid="alunos-status-filter"]')?.value || "",
    plano: document.querySelector('[data-testid="alunos-plan-filter"]')?.value || "",
    rows: document.querySelectorAll('[data-testid="aluno-mobile-card"], .desktop-table tbody tr').length,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }))()`);
}

async function setFieldValue(client, selector, value) {
  await evaluate(client, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    const setter = Object.getOwnPropertyDescriptor(input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  await sleep(500);
}

async function click(client, selector) {
  const clicked = await evaluate(client, `(() => {
    const item = document.querySelector(${JSON.stringify(selector)});
    item?.click();
    return Boolean(item);
  })()`);
  if (!clicked) throw new Error(`Elemento nao encontrado: ${selector}`);
  await sleep(400);
}

async function capture(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  const audit = { console: [], network: [], scenarios: [] };
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    await client.send("Storage.clearDataForOrigin", {
      origin: baseUrl,
      storageTypes: "all",
    });
    client.on("Runtime.exceptionThrown", (params) => audit.console.push(params.exceptionDetails?.text || "exception"));
    client.on("Network.responseReceived", ({ response }) => {
      const parsedUrl = new URL(response.url);
      if (["data:", "blob:"].includes(parsedUrl.protocol)) return;
      const host = parsedUrl.hostname;
      if (response.status >= 400 || !["127.0.0.1", "localhost"].includes(host)) {
        audit.network.push({ status: response.status, url: response.url });
      }
    });

    await client.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await openAlunos(client);

    for (const status of ["Vencido", "Vencendo"]) {
      await openAlunos(client, `?status=${encodeURIComponent(status)}`);
      const state = await getFilterState(client);
      assertScenario(audit, `dashboard-${status}`, state.status === status && state.overflowX === 0, state);
    }

    await openAlunos(client);
    const firstPlan = await evaluate(client, `document.querySelector('[data-testid="alunos-plan-filter"] option[value]:not([value="todos"])')?.value || ""`);
    if (!firstPlan) {
      const state = await getFilterState(client);
      throw new Error(`Nenhum plano disponivel para teste de query. Estado: ${JSON.stringify(state)}`);
    }

    await openAlunos(client, `?origem=qa&busca=Ana&status=Ativo&plano=${encodeURIComponent(firstPlan)}`);
    let state = await getFilterState(client);
    assertScenario(audit, "query-combinada", state.busca === "Ana" && state.status === "Ativo" && state.plano === firstPlan && state.url.includes("origem=qa"), state);
    await capture(client, "mobile-390-query-combinada.png");

    await client.send("Page.reload");
    await waitFor(client, "document.querySelector('[data-testid=\"alunos-page\"]') && !document.body.textContent.includes('Carregando alunos')");
    state = await getFilterState(client);
    assertScenario(audit, "refresh-preserva", state.busca === "Ana" && state.status === "Ativo" && state.plano === firstPlan, state);

    await click(client, '[data-testid="aluno-action-details"]');
    state = await getFilterState(client);
    assertScenario(audit, "detalhes-preserva", state.busca === "Ana" && state.status === "Ativo" && state.plano === firstPlan, state);
    await click(client, '[data-testid="aluno-details-close"]');

    await click(client, '[data-testid="aluno-actions-trigger"]');
    await click(client, '[data-testid="aluno-action-edit"]');
    state = await getFilterState(client);
    assertScenario(audit, "edicao-preserva", state.busca === "Ana" && state.status === "Ativo" && state.plano === firstPlan, state);
    await click(client, '[data-testid="aluno-form-cancel"]');

    await setFieldValue(client, '[data-testid="alunos-search"]', "Bruno");
    state = await getFilterState(client);
    assertScenario(audit, "busca-atualiza-url", state.busca === "Bruno" && state.url.includes("busca=Bruno") && state.url.includes("origem=qa"), state);

    await setFieldValue(client, '[data-testid="alunos-status-filter"]', "Vencido");
    state = await getFilterState(client);
    assertScenario(audit, "status-atualiza-url", state.status === "Vencido" && state.url.includes("status=Vencido") && state.url.includes("busca=Bruno"), state);

    await setFieldValue(client, '[data-testid="alunos-plan-filter"]', "todos");
    state = await getFilterState(client);
    assertScenario(audit, "plano-remove-url", state.plano === "todos" && !state.url.includes("plano=") && state.url.includes("origem=qa"), state);

    await click(client, '.alunos-filtros button');
    state = await getFilterState(client);
    assertScenario(audit, "limpar-preserva-desconhecido", state.busca === "" && state.status === "todos" && state.plano === "todos" && state.url === "/alunos?origem=qa", state);
    await capture(client, "mobile-390-filtros-limpos.png");

    await openAlunos(client, "?status=Invalido&plano=desconhecido");
    state = await getFilterState(client);
    assertScenario(audit, "invalidos-seguros", state.status === "todos" && state.plano === "todos", state);

    await openAlunos(client, "?busca=Ana");
    await setFieldValue(client, '[data-testid="alunos-status-filter"]', "Ativo");
    await evaluate(client, "history.back(); true");
    await sleep(700);
    state = await getFilterState(client);
    assertScenario(audit, "historico-voltar", state.busca === "Ana" && state.status === "todos", state);
    await evaluate(client, "history.forward(); true");
    await sleep(700);
    state = await getFilterState(client);
    assertScenario(audit, "historico-avancar", state.busca === "Ana" && state.status === "Ativo", state);

    await client.send("Emulation.setDeviceMetricsOverride", { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await openAlunos(client, `?busca=Ana&status=Ativo&plano=${encodeURIComponent(firstPlan)}`);
    state = await getFilterState(client);
    assertScenario(audit, "desktop-query", state.busca === "Ana" && state.status === "Ativo" && state.plano === firstPlan && state.overflowX === 0, state);
    await capture(client, "desktop-1366-query-combinada.png");

    console.log(JSON.stringify({ status: "ALUNOS_QUERY_CONTEXT_READY", ...audit }, null, 2));
    if (audit.scenarios.some((scenario) => scenario.status !== "PASS")) process.exitCode = 1;
  } finally {
    client.close();
  }
}

function assertScenario(audit, name, passed, detail) {
  audit.scenarios.push({ name, status: passed ? "PASS" : "FAIL", detail });
}

function validateQaCredentials() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    console.error("Credenciais QA ausentes. Configure QA_USER_EMAIL e QA_USER_PASSWORD em .env.qa.local.");
    process.exit(2);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
