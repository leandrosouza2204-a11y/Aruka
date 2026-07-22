import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = "reports/product-audit/alunos-cycle-2";
const appUrl = "http://127.0.0.1:5173/alunos?busca=Ana&status=Ativo";
const cdpPort = process.env.CDP_PORT || "9222";
const events = { console: [], exceptions: [], requests: [] };
const assertions = [];

validateQaCredentials();
mkdirSync(join(reportDir, "screenshots"), { recursive: true });

const client = createCdpClient(await getWebSocketUrl());
await client.ready;

try {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  client.on("Runtime.consoleAPICalled", (event) => {
    events.console.push({ type: event.type, args: event.args?.map((arg) => sanitize(arg.value || arg.description || "")) });
  });
  client.on("Runtime.exceptionThrown", (event) => {
    events.exceptions.push({ text: sanitize(event.exceptionDetails?.text || ""), url: event.exceptionDetails?.url || "" });
  });
  client.on("Network.requestWillBeSent", (event) => {
    if (/\/rest\/v1\/alunos/.test(event.request.url)) {
      events.requests.push({
        method: event.request.method,
        url: sanitizeUrl(event.request.url),
        kind: event.request.method === "POST" ? "criacao" : event.request.method === "PATCH" ? "edicao" : "leitura",
      });
    }
  });

  await navigate(appUrl);
  await loginIfNeeded();
  await evaluate(`localStorage.setItem('ARUKA_QA_ALUNOS_FAIL', 'load'); true`);
  await navigate(appUrl);
  await waitFor("document.querySelector('.app-error') && !document.body.textContent.includes('Carregando alunos')", 15000);
  assertions.push(assertOk("erro controlado de carregamento exibe mensagem", /Erro ao buscar dados/.test(await text(".app-error"))));
  await evaluate(`localStorage.removeItem('ARUKA_QA_ALUNOS_FAIL'); true`);
  await navigate(appUrl);
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"]') && !document.body.textContent.includes('Carregando alunos')", 25000);

  await openCadastro();
  const beforeInvalid = mutationRequests();
  await click('[data-testid="aluno-form-submit"]');
  await sleep(400);
  const emptyValidation = await evaluate(`(() => ({
    open: Boolean(document.querySelector('[data-testid="aluno-form-modal"]')),
    active: document.activeElement?.getAttribute('data-testid') || '',
    nameError: document.querySelector('#aluno-name-error')?.textContent.trim() || '',
    phoneError: document.querySelector('#aluno-phone-error')?.textContent.trim() || '',
    startError: document.querySelector('#aluno-plan-start-error')?.textContent.trim() || '',
    planError: document.querySelector('#aluno-plan-error')?.textContent.trim() || '',
    invalidFields: [...document.querySelectorAll('[aria-invalid="true"]')].map((item) => item.getAttribute('data-testid')),
    described: [...document.querySelectorAll('[aria-invalid="true"]')].every((item) => Boolean(item.getAttribute('aria-describedby')))
  }))()`);
  assertions.push(assertOk("salvar vazio mantem modal aberto", emptyValidation.open));
  assertions.push(assertOk("foco vai para nome", emptyValidation.active === "aluno-name"));
  assertions.push(assertOk("erros inline associados", emptyValidation.described && emptyValidation.invalidFields.length >= 4));
  assertions.push(assertOk("salvar invalido nao dispara rede", mutationRequests() === beforeInvalid));

  await setInput('[data-testid="aluno-name"]', "Aluno Valido Cycle 2");
  await setInput('[data-testid="aluno-phone"]', "11999");
  await setInput('[data-testid="aluno-plan-start"]', "2026-07-22");
  await setFirstPlan();
  await click('[data-testid="aluno-form-submit"]');
  await sleep(300);
  assertions.push(assertOk("telefone incompleto bloqueado", /DDD/.test(await text("#aluno-phone-error"))));

  await setInput('[data-testid="aluno-phone"]', "11990000000");
  await click('[data-testid="aluno-form-submit"]');
  await sleep(300);
  assertions.push(assertOk("telefone duplicado bloqueado", /WhatsApp/.test(await text("#aluno-phone-error"))));

  await setInput('[data-testid="aluno-name"]', "ana teste");
  await setInput('[data-testid="aluno-phone"]', "11997776666");
  await click('[data-testid="aluno-form-submit"]');
  await sleep(300);
  assertions.push(assertOk("nome duplicado bloqueado", /nome/.test(await text("#aluno-name-error"))));

  const uniqueName = `Ana Cycle 2 QA ${Date.now()}`;
  await setInput('[data-testid="aluno-name"]', uniqueName);
  await setInput('[data-testid="aluno-phone"]', "11997776666");
  await click('[data-testid="aluno-form-submit"]');
  await waitFor("!document.querySelector('[data-testid=\"aluno-form-modal\"]')", 15000);
  assertions.push(assertOk("aluno valido cadastrado", await documentTextContains(uniqueName)));

  await openEditForName(uniqueName);
  await click('[data-testid="aluno-form-submit"]');
  await waitFor("!document.querySelector('[data-testid=\"aluno-form-modal\"]')", 15000);
  assertions.push(assertOk("edicao sem falso positivo contra proprio registro", true));

  await openEditForName(uniqueName);
  await setInput('[data-testid="aluno-phone"]', "11990000001");
  await click('[data-testid="aluno-form-submit"]');
  await sleep(400);
  assertions.push(assertOk("edicao detecta telefone de outro aluno", /WhatsApp/.test(await text("#aluno-phone-error"))));

  await capture("cadastro-validacoes-final.png");
  writeEvidence();
  if (assertions.some((item) => !item.ok) || events.exceptions.length) process.exitCode = 1;
} finally {
  client.close();
}

function writeEvidence() {
  const raw = { assertions, events };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  const lines = ["# Validation Results", "", ...assertions.map((item) => `- ${item.ok ? "PASS" : "FAIL"}: ${item.name}`), ""];
  writeFileSync(join(reportDir, "validation-results.md"), lines.join("\n"));
  writeFileSync(join(reportDir, "console-results.md"), `# Console Results\n\nEventos: ${events.console.length}\nExcecoes: ${events.exceptions.length}\n`);
  writeFileSync(join(reportDir, "network-results.md"), `# Network Results\n\nRequisicoes de alunos capturadas: ${events.requests.length}\n`);
}

function assertOk(name, ok) {
  return { name, ok: Boolean(ok) };
}

function mutationRequests() {
  return events.requests.filter((request) => ["POST", "PATCH"].includes(request.method)).length;
}

async function getWebSocketUrl() {
  const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (created.ok) return (await created.json()).webSocketDebuggerUrl;
  return (await (await fetch(`http://127.0.0.1:${cdpPort}/json/version`)).json()).webSocketDebuggerUrl;
}

function createCdpClient(url) {
  const socket = new WebSocket(url);
  let nextId = 1;
  const pending = new Map();
  const handlers = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method) handlers.get(message.method)?.forEach((handler) => handler(message.params || {}));
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject, method } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(`${method}: ${message.error.message}`)) : resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    on(method, handler) {
      handlers.set(method, [...(handlers.get(method) || []), handler]);
    },
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject, method }));
    },
    close() {
      socket.close();
    },
  };
}

async function evaluate(expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function navigate(url) {
  await client.send("Page.navigate", { url });
  await waitFor("document.readyState === 'complete'");
  await sleep(800);
}

async function loginIfNeeded() {
  const needsLogin = await evaluate(`location.pathname.includes('/login') || Boolean(document.querySelector('input[type="email"]'))`);
  if (!needsLogin) return;
  await setInput('input[type="email"]', process.env.QA_USER_EMAIL);
  await setInput('input[type="password"]', process.env.QA_USER_PASSWORD);
  await click('button[type="submit"]');
  await sleep(5500);
}

function openCadastro() {
  return click('[data-testid="aluno-new-button"]').then(() => waitFor("document.querySelector('[data-testid=\"aluno-form-modal\"]')"));
}

async function openEditForName(name) {
  await evaluate(`(() => {
    const row = [...document.querySelectorAll('tr, [data-testid="aluno-mobile-card"]')].find((item) => item.textContent.includes(${JSON.stringify(name)}));
    row?.querySelector('[data-testid="aluno-actions-trigger"]')?.click();
  })()`);
  await sleep(300);
  await click('[data-testid="aluno-action-edit"]');
  await waitFor("document.querySelector('[data-testid=\"aluno-form-modal\"]')");
}

function click(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`);
}

function setInput(selector, value) {
  return evaluate(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const proto = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

function setFirstPlan() {
  return evaluate(`(() => {
    const select = document.querySelector('[data-testid="aluno-plan"]');
    if (!select || select.options.length < 2) return false;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

function text(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.trim() || ""`);
}

function documentTextContains(value) {
  return evaluate(`document.body.textContent.includes(${JSON.stringify(value)})`);
}

async function capture(filename) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(reportDir, "screenshots", filename), Buffer.from(screenshot.data, "base64"));
}

function sanitize(value) {
  return String(value).replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]").slice(0, 500);
}

function sanitizeUrl(value) {
  const url = new URL(value);
  url.searchParams.delete("apikey");
  return url.toString();
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
