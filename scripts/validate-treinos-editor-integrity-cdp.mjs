import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const cdpPort = Number(process.env.CDP_PORT || 9222);
const reportDir = "reports/product-audit/treinos-cycle-2";
const screenshotsDir = join(reportDir, "screenshots");
const results = [];
const consoleEvents = [];
const networkEvents = [];
const started = [];

validateEnv();
mkdirSync(screenshotsDir, { recursive: true });

async function run() {
  await ensureLocalData();
  await ensureVite();
  await ensureChrome();

  const client = createCdpClient(await newTab());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    client.on("Runtime.consoleAPICalled", (event) => consoleEvents.push({ type: event.type, text: event.args?.map((arg) => arg.value || arg.description).join(" ") }));
    client.on("Runtime.exceptionThrown", (event) => consoleEvents.push({ type: "exception", text: event.exceptionDetails?.text || "" }));
    client.on("Network.responseReceived", (event) => networkEvents.push({ url: sanitizeUrl(event.response.url), status: event.response.status }));

    await setViewport(client, 1366, 768, false);
    await openTreinos(client);
    await scenario("cancelar novo treino limpo fecha sem confirmacao", async () => {
      await openNew(client);
      await click(client, "[data-testid='treino-editor-cancel']");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')");
      await assertNo(client, "[data-testid='treino-discard-dialog']");
    });

    await scenario("salvar sem dias mostra validacao e nao fecha", async () => {
      await openNew(client);
      await fillRequiredHeader(client);
      await click(client, "[data-testid='treino-editor-save']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-validation-summary\"]')");
      await assertText(client, "Adicione pelo menos um dia ao treino.");
      await shot(client, "erro-sem-dias.png");
      await discard(client);
    });

    await scenario("salvar com dia sem exercicio mostra validacao", async () => {
      await openNew(client);
      await fillRequiredHeader(client);
      await addDay(client);
      await click(client, "[data-testid='treino-editor-save']");
      await assertText(client, "Adicione pelo menos um exercicio antes de salvar.");
      await shot(client, "erro-sem-exercicios.png");
      await discard(client);
    });

    await scenario("dirty pede descarte e continuar preserva conteudo", async () => {
      await openNew(client);
      await setValue(client, "[data-testid='treino-editor-name']", "Treino QA Dirty");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-dirty-indicator\"]')");
      await click(client, "[data-testid='treino-editor-cancel']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-discard-dialog\"]')");
      await shot(client, "aviso-alteracoes-nao-salvas.png");
      await click(client, "[data-testid='treino-discard-continue']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
      await assertValue(client, "[data-testid='treino-editor-name']", "Treino QA Dirty");
      await click(client, "[data-testid='treino-editor-cancel']");
      await click(client, "[data-testid='treino-discard-confirm']");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')");
    });

    await scenario("salvar treino valido preserva contexto", async () => {
      const alunoId = await firstStudentId(client);
      await navigate(client, `${baseUrl}/treinos?alunoId=${alunoId}&returnTo=%2Falunos%3Fbusca%3DAna`);
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-context-banner\"]')");
      await click(client, "[data-testid='treinos-context-create']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
      await setValue(client, "[data-testid='treino-editor-name']", `Treino QA Integridade ${Date.now()}`);
      await addDay(client);
      await addExercise(client);
      await shot(client, "editor-valido.png");
      await click(client, "[data-testid='treino-editor-save']");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')", 30000);
      await waitFor(client, "window.location.search.includes('alunoId=')");
      await shot(client, "treino-salvo-com-sucesso.png");
    });

    await setViewport(client, 390, 844, true);
    await scenario("mobile mostra validacao e descarte sem overflow", async () => {
      await openTreinos(client);
      await openNew(client);
      await setValue(client, "[data-testid='treino-editor-name']", "Treino QA Mobile Longo Sem Overflow");
      await click(client, "[data-testid='treino-editor-save']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-validation-summary\"]')");
      await shot(client, "validacao-mobile.png");
      await click(client, "[data-testid='treino-editor-cancel']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-discard-dialog\"]')");
      await shot(client, "confirmacao-mobile.png");
      const overflow = await evalValue(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
      if (Math.abs(Number(overflow)) > 1) throw new Error(`overflow horizontal ${overflow}px`);
      await click(client, "[data-testid='treino-discard-confirm']");
    });
  } finally {
    client.close();
    await ensureLocalData();
    stopStarted();
    writeReports();
  }

  if (results.some((item) => item.status !== "PASS")) process.exitCode = 1;
}

async function scenario(name, fn) {
  const start = new Date().toISOString();
  try {
    await fn();
    results.push({ name, status: "PASS", start, end: new Date().toISOString() });
  } catch (error) {
    results.push({ name, status: "FAIL", start, end: new Date().toISOString(), error: error.message });
  }
}

async function ensureLocalData() {
  await runCommand("cmd.exe", ["/c", "npm.cmd", "run", "qa:local:data"], 45000);
}

async function ensureVite() {
  if (await httpOk(`${baseUrl}/login`)) return;
  started.push(spawn("cmd.exe", ["/c", "npm.cmd", "run", "dev", "--", "--host", "127.0.0.1"], { stdio: "ignore", windowsHide: true }));
  await waitForHttp(`${baseUrl}/login`, 45000);
}

async function ensureChrome() {
  if (await httpOk(`http://127.0.0.1:${cdpPort}/json/version`)) return;
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  started.push(spawn(chrome, ["--headless=new", "--disable-gpu", "--no-first-run", `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "ignore", windowsHide: true }));
  await waitForHttp(`http://127.0.0.1:${cdpPort}/json/version`, 30000);
}

async function newTab() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  return (await response.json()).webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  const handlers = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method) handlers.get(message.method)?.(message.params || {});
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
    on(method, handler) {
      handlers.set(method, handler);
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

async function openTreinos(client) {
  await navigate(client, `${baseUrl}/treinos`);
  if (await evalValue(client, "location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))")) {
    await login(client);
    await navigate(client, `${baseUrl}/treinos`);
  }
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"]')");
  await waitFor(client, "!document.body.textContent.includes('Carregando treinos')", 30000);
}

async function login(client) {
  await navigate(client, `${baseUrl}/login`);
  await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')");
  await setValue(client, "input[type='email']", process.env.QA_USER_EMAIL);
  await setValue(client, "input[type='password']", process.env.QA_USER_PASSWORD);
  await clickText(client, "Entrar");
  await sleep(5500);
}

async function openNew(client) {
  await click(client, "[data-testid='treino-new-button']");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
}

async function fillRequiredHeader(client) {
  await selectFirstStudent(client);
  await setValue(client, "[data-testid='treino-editor-name']", "Treino QA Integridade");
}

async function selectFirstStudent(client) {
  await evalValue(client, `(() => {
    const select = document.querySelector('[data-testid="treino-form-student"]');
    select.value = [...select.options].find((option) => option.value)?.value || "";
    select.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
}

async function firstStudentId(client) {
  await openNew(client);
  const id = await evalValue(client, `document.querySelector('[data-testid="treino-form-student"] option[value]:not([value=""])')?.value || ""`);
  await click(client, "[data-testid='treino-editor-cancel']");
  if (!id) throw new Error("Aluno QA nao encontrado.");
  return id;
}

async function addDay(client) {
  await setValue(client, ".treino-editor-day-form input:first-child", "Treino A");
  await setValue(client, ".treino-editor-day-form input:nth-child(2)", "Base QA");
  await click(client, "[data-testid='treino-day-add']");
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-form\"]')");
}

async function addExercise(client) {
  await setValue(client, "[data-testid='exercise-name']", "Supino QA");
  await setValue(client, "[data-testid='exercise-sets']", "3");
  await setValue(client, "[data-testid='exercise-repetitions']", "10");
  await click(client, "[data-testid='exercise-add']");
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-card\"]')");
}

async function discard(client) {
  await click(client, "[data-testid='treino-editor-cancel']");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-discard-dialog\"]')");
  await click(client, "[data-testid='treino-discard-confirm']");
  await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')");
}

async function setViewport(client, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await waitFor(client, "document.readyState === 'complete'", 30000);
  await sleep(700);
}

async function setValue(client, selector, value) {
  await evalValue(client, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

async function click(client, selector) {
  const ok = await evalValue(client, `(() => { const el = document.querySelector(${JSON.stringify(selector)}); el?.click(); return Boolean(el); })()`);
  if (!ok) throw new Error(`Elemento nao encontrado: ${selector}`);
  await sleep(350);
}

async function clickText(client, text) {
  const ok = await evalValue(client, `(() => { const el = [...document.querySelectorAll('button')].find((button) => button.textContent.includes(${JSON.stringify(text)})); el?.click(); return Boolean(el); })()`);
  if (!ok) throw new Error(`Botao nao encontrado: ${text}`);
}

async function assertNo(client, selector) {
  if (await evalValue(client, `Boolean(document.querySelector(${JSON.stringify(selector)}))`)) throw new Error(`Elemento inesperado: ${selector}`);
}

async function assertText(client, text) {
  if (!(await evalValue(client, `document.body.textContent.includes(${JSON.stringify(text)})`))) throw new Error(`Texto ausente: ${text}`);
}

async function assertValue(client, selector, value) {
  const current = await evalValue(client, `document.querySelector(${JSON.stringify(selector)})?.value`);
  if (current !== value) throw new Error(`Valor esperado ${value}, recebido ${current}`);
}

async function waitFor(client, expression, timeout = 15000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await evalValue(client, `Boolean(${expression})`)) return;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando ${expression}`);
}

async function evalValue(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}

async function shot(client, filename) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotsDir, filename), Buffer.from(screenshot.data, "base64"));
}

async function httpOk(url) {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
}

async function waitForHttp(url, timeout) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await httpOk(url)) return;
    await sleep(500);
  }
  throw new Error(`Servico indisponivel: ${url}`);
}

function runCommand(command, args, timeout) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "pipe", windowsHide: true });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${command} timeout`));
    }, timeout);
    child.on("exit", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`${command} saiu com codigo ${code}`));
    });
  });
}

function stopStarted() {
  for (const child of started.reverse()) {
    if (!child.killed) child.kill("SIGKILL");
  }
}

function writeReports() {
  const raw = { decision: results.every((item) => item.status === "PASS") ? "READY" : "NOT_READY", results, consoleEvents, networkEvents };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), markdown("Scenario Results", results));
  writeFileSync(join(reportDir, "console-results.md"), markdown("Console Results", consoleEvents.map((event) => ({ name: event.type, status: event.type === "exception" ? "FAIL" : "INFO", detail: event.text }))));
  writeFileSync(join(reportDir, "network-results.md"), markdown("Network Results", networkEvents.map((event) => ({ name: event.url, status: event.status >= 400 ? "FAIL" : "PASS", detail: String(event.status) }))));
}

function markdown(title, rows) {
  return [`# ${title}`, "", ...rows.map((row) => `- ${row.status}: ${row.name}${row.error ? ` - ${row.error}` : row.detail ? ` - ${row.detail}` : ""}`), ""].join("\n");
}

function sanitizeUrl(value) {
  try {
    const url = new URL(value);
    url.searchParams.delete("apikey");
    if (url.searchParams.get("grant_type")) url.searchParams.set("grant_type", "[redacted]");
    return url.toString();
  } catch {
    return String(value).replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]");
  }
}

function validateEnv() {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    throw new Error("Credenciais QA ausentes.");
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
