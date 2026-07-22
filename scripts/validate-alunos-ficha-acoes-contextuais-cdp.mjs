import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = "reports/product-audit/alunos-cycle-3";
const cdpPort = process.env.CDP_PORT || "9222";
const baseUrl = "http://127.0.0.1:5173";
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
    if (/\/rest\/v1\/(alunos|treinos|avaliacoes|pagamentos)/.test(event.request.url)) {
      events.requests.push({ method: event.request.method, url: sanitizeUrl(event.request.url) });
    }
  });

  await navigate(`${baseUrl}/alunos?busca=Ana&status=Ativo`);
  await loginIfNeeded();
  await evaluate("localStorage.removeItem('ARUKA_QA_ALUNOS_SUMMARY_FAIL'); true");
  await navigate(`${baseUrl}/alunos?busca=Ana&status=Ativo`);
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"]') && !document.body.textContent.includes('Carregando alunos')");
  await openDetailsIfNeeded();
  await waitFor("document.querySelector('[data-testid=\"student-summary\"]')");
  await sleep(1500);

  const details = await evaluate(`(() => {
    const link = (selector) => document.querySelector(selector)?.getAttribute('href') || '';
    return {
      title: document.querySelector('[data-testid="aluno-details"] h2')?.textContent.trim() || '',
      summary: Boolean(document.querySelector('[data-testid="student-summary"]')),
      trainingText: document.querySelector('[data-testid="student-summary-training"]')?.textContent || '',
      assessmentText: document.querySelector('[data-testid="student-summary-assessment"]')?.textContent || '',
      financialText: document.querySelector('[data-testid="student-summary-financial"]')?.textContent || '',
      trainingHref: link('[data-testid="student-action-training"]'),
      assessmentHref: link('[data-testid="student-action-assessment"]'),
      financialHref: link('[data-testid="student-action-financial"]')
    };
  })()`);
  assertions.push(ok("ficha renderiza identificacao", Boolean(details.title)));
  assertions.push(ok("resumo operacional visivel", details.summary));
  assertions.push(ok("indicador de treino visivel", Boolean(details.trainingText)));
  assertions.push(ok("indicador de avaliacao visivel", Boolean(details.assessmentText)));
  assertions.push(ok("indicador financeiro visivel", Boolean(details.financialText)));
  assertions.push(ok("links incluem alunoId", [details.trainingHref, details.assessmentHref, details.financialHref].every((href) => /alunoId=/.test(href))));
  assertions.push(ok("links incluem returnTo", [details.trainingHref, details.assessmentHref, details.financialHref].every((href) => /returnTo=/.test(href))));
  await capture("ficha-desktop.png");

  await validarDestino(details.trainingHref, "treinos-context-aluno", "treinos");
  await validarDestino(details.assessmentHref, "avaliacoes-context-aluno", "avaliacoes");
  await validarDestino(details.financialHref, "financeiro-context-aluno", "financeiro");

  await evaluate("localStorage.setItem('ARUKA_QA_ALUNOS_SUMMARY_FAIL', 'treinos'); true");
  await navigate(`${baseUrl}/dashboard`);
  await navigate(`${baseUrl}/alunos?busca=Ana&status=Ativo&cycle3Error=1`);
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"]')");
  await openDetailsIfNeeded();
  await waitFor("document.querySelector('[data-testid=\"student-summary-training\"]')");
  await waitFor("document.querySelector('[data-testid=\"student-summary-training\"]')?.textContent.includes('Erro ao carregar')");
  const erroControlado = await text('[data-testid="student-summary-training"]');
  assertions.push(ok("erro controlado parcial aparece na ficha", /Erro ao carregar/.test(erroControlado)));
  await evaluate("localStorage.removeItem('ARUKA_QA_ALUNOS_SUMMARY_FAIL'); true");

  await client.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate(`${baseUrl}/alunos?busca=Ana&status=Ativo`);
  await waitFor("document.querySelector('[data-testid=\"alunos-page\"]')");
  await openDetailsIfNeeded();
  await waitFor("document.querySelector('[data-testid=\"student-context-actions\"]')");
  const overflow = await evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth");
  assertions.push(ok("mobile sem overflow horizontal", Math.abs(Number(overflow)) <= 1));
  await capture("ficha-mobile.png");

  writeEvidence();
  if (assertions.some((item) => !item.ok) || events.exceptions.length) process.exitCode = 1;
} finally {
  client.close();
}

async function validarDestino(href, testId, nome) {
  await navigate(`${baseUrl}${href}`);
  await waitFor(`document.querySelector('[data-testid="${testId}"]')`);
  assertions.push(ok(`${nome} abre contextualizado`, await text(`[data-testid="${testId}"]`)));
  await client.send("Page.reload");
  await waitFor(`document.querySelector('[data-testid="${testId}"]')`);
  assertions.push(ok(`${nome} preserva contexto apos refresh`, await text(`[data-testid="${testId}"]`)));
  await capture(`${nome}-contextualizado.png`);
}

function writeEvidence() {
  const raw = { assertions, events };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), md("Scenario Results", assertions));
  writeFileSync(join(reportDir, "navigation-results.md"), md("Navigation Results", assertions.filter((item) => /treinos|avaliacoes|financeiro|links/.test(item.name))));
  writeFileSync(join(reportDir, "console-results.md"), `# Console Results\n\nConsole events: ${events.console.length}\nExceptions: ${events.exceptions.length}\n`);
  writeFileSync(join(reportDir, "network-results.md"), `# Network Results\n\nCaptured requests: ${events.requests.length}\n`);
}

function md(title, items) {
  return [`# ${title}`, "", ...items.map((item) => `- ${item.ok ? "PASS" : "FAIL"}: ${item.name}`), ""].join("\n");
}

function ok(name, value) {
  return { name, ok: Boolean(value) };
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

async function waitFor(expression, timeout = 20000) {
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
  await sleep(700);
}

async function loginIfNeeded() {
  const needsLogin = await evaluate("location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))");
  if (!needsLogin) return;
  await setInput('input[type="email"]', process.env.QA_USER_EMAIL);
  await setInput('input[type="password"]', process.env.QA_USER_PASSWORD);
  await click('button[type="submit"]');
  await sleep(5500);
}

function click(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.click(); true`);
}

function clickVisible(selector) {
  return evaluate(`(() => {
    const visible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const element = [...document.querySelectorAll(${JSON.stringify(selector)})].find(visible);
    element?.scrollIntoView({ block: 'center', inline: 'nearest' });
    element?.click();
    return Boolean(element);
  })()`);
}

async function openDetailsIfNeeded() {
  const alreadyOpen = await evaluate("Boolean(document.querySelector('[data-testid=\"student-summary\"]'))");
  if (alreadyOpen) return;
  await waitFor(`(() => {
    const visible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    return [...document.querySelectorAll('[data-testid="aluno-action-details"]')].some(visible);
  })()`);
  await clickVisible('[data-testid="aluno-action-details"]');
}

function setInput(selector, value) {
  return evaluate(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

function text(selector) {
  return evaluate(`document.querySelector(${JSON.stringify(selector)})?.textContent.trim() || ""`);
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
