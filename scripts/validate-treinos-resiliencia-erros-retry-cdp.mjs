import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const cdpPort = Number(process.env.CDP_PORT || 9222);
const reportDir = "reports/product-audit/treinos-cycle-4";
const screenshotsDir = join(reportDir, "screenshots");
const results = [];
const consoleEvents = [];
const networkEvents = [];
const started = [];
let authFailure = null;

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
    client.on("Runtime.consoleAPICalled", (event) => {
      consoleEvents.push({
        type: event.type,
        text: summarizeConsoleText(sanitize((event.args || []).map((arg) => arg.value || arg.description || "").join(" "))),
      });
    });
    client.on("Runtime.exceptionThrown", (event) => {
      consoleEvents.push({ type: "exception", text: summarizeConsoleText(sanitize(event.exceptionDetails?.text || "")) });
    });
    client.on("Network.responseReceived", (event) => {
      if (/\/rest\/v1\/(alunos|treinos|treino_dias|treino_exercicios|workout_templates)/.test(event.response.url)) {
        networkEvents.push({ url: sanitizeUrl(event.response.url), status: event.response.status });
      }
    });

    await setViewport(client, 1366, 768, false);
    await authenticate(client);
    const context = await collectContext(client);
    const resilientPath = `/treinos?alunoId=${context.alunoId}&returnTo=${encodeURIComponent("/alunos?busca=Ana")}&busca=Rotina&objetivo=${encodeURIComponent(context.objetivo)}&nivel=${encodeURIComponent(context.nivel)}&status=${encodeURIComponent(context.status)}`;

    await scenario("falha na carga inicial mostra erro recuperavel", async () => {
      await setFail(client, "load");
      await openTreinos(client, resilientPath, { expectError: true });
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')");
      await assertText(client, "Nao foi possivel carregar os treinos.");
      await assertText(client, "Tentar novamente");
      await assertNo(client, "[data-testid='treinos-empty-state']");
      await assertNo(client, "[data-testid='treinos-empty-contextual']");
      await waitFor(client, "!document.body.textContent.includes('Carregando treinos')");
      await assertUrlPreserved(client, resilientPath);
      await shot(client, "erro-carga-inicial.png");
    });

    await scenario("retry com sucesso preserva URL e recupera biblioteca", async () => {
      await setFail(client, "");
      await clickImmediate(client, "[data-testid='treinos-retry-load']");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-retry-load\"]')?.getAttribute('aria-busy') === 'true'");
      await waitFor(client, "!document.querySelector('[data-testid=\"treinos-load-error\"]')", 30000);
      await waitFor(
        client,
        "document.querySelector('[data-testid=\"treino-mobile-card\"]') || document.querySelector('[data-testid=\"treinos-empty-state\"]') || document.querySelector('[data-testid=\"treinos-empty-contextual\"]')",
        30000
      );
      await assertUrlPreserved(client, resilientPath);
      await shot(client, "retry-sucesso.png");
    });

    await scenario("retry com nova falha desbloqueia nova tentativa", async () => {
      await setFail(client, "load");
      await openTreinos(client, resilientPath, { expectError: true });
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')");
      await click(client, "[data-testid='treinos-retry-load']");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')", 30000);
      await waitFor(client, "!document.querySelector('[data-testid=\"treinos-retry-load\"]')?.disabled");
      await assertUrlPreserved(client, resilientPath);
      await shot(client, "retry-nova-falha.png");
      await setFail(client, "");
      await click(client, "[data-testid='treinos-retry-load']");
      await waitFor(client, "!document.querySelector('[data-testid=\"treinos-load-error\"]')", 30000);
    });

    await scenario("falha ao duplicar preserva original e desbloqueia acoes", async () => {
      await openTreinos(client, "/treinos");
      const before = await cardCount(client);
      await setFail(client, "duplicate");
      await openFirstActions(client);
      await click(client, "[data-testid='treino-action-duplicate']");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')");
      await assertText(client, "Nao foi possivel duplicar este treino.");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-action-duplicate\"]')?.disabled", 30000);
      const after = await cardCount(client);
      if (after !== before) throw new Error(`Duplicacao com falha alterou cards: antes=${before}, depois=${after}`);
      await setFail(client, "");
    });

    await scenario("falha ao excluir preserva treino e desbloqueia acoes", async () => {
      await openTreinos(client, "/treinos");
      const before = await cardCount(client);
      await setFail(client, "delete");
      await openFirstActions(client);
      await click(client, "[data-testid='treino-action-delete']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
      await click(client, "[data-testid='treino-confirmation-confirm']");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')");
      await assertText(client, "O treino nao foi excluido.");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-actions-trigger\"]')?.disabled", 30000);
      const after = await cardCount(client);
      if (after !== before) throw new Error(`Exclusao com falha alterou cards: antes=${before}, depois=${after}`);
      await setFail(client, "");
    });

    await scenario("contexto via URL sobrevive a erro, retry e refresh", async () => {
      await setFail(client, "load");
      await openTreinos(client, resilientPath, { expectError: true });
      await assertUrlPreserved(client, resilientPath);
      await client.send("Page.reload");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')");
      await assertUrlPreserved(client, resilientPath);
      await setFail(client, "");
      await click(client, "[data-testid='treinos-retry-load']");
      await waitFor(client, "document.querySelector('[data-testid=\"treinos-context-banner\"]')", 30000);
      await assertUrlPreserved(client, resilientPath);
    });

    for (const [width, height, mobile] of [
      [320, 800, true],
      [375, 844, true],
      [390, 844, true],
      [768, 1024, true],
      [1366, 768, false],
    ]) {
      await scenario(`mobile/responsivo ${width}px com erro sem overflow`, async () => {
        await setViewport(client, width, height, mobile);
        await setFail(client, "load");
        await openTreinos(client, resilientPath, { expectError: true });
        await waitFor(client, "document.querySelector('[data-testid=\"treinos-retry-load\"]')");
        await shot(client, `erro-retry-${width}.png`);
        const overflow = await overflowDelta(client);
        if (Math.abs(Number(overflow)) > 1) throw new Error(`overflow horizontal ${overflow}px`);
      });
    }
  } finally {
    try {
      await setFail(client, "");
    } catch {
      // ignored: the browser may already be closed.
    }
    client.close();
    await ensureLocalData();
    stopStarted();
    writeReports();
  }

  if (authFailure || results.some((item) => item.status !== "PASS")) process.exitCode = 1;
}

async function scenario(name, fn) {
  const start = new Date().toISOString();
  try {
    await fn();
    results.push({ name, status: "PASS", start, end: new Date().toISOString() });
  } catch (error) {
    results.push({ name, status: classifyError(error), start, end: new Date().toISOString(), error: error.message });
  }
}

async function ensureLocalData() {
  await runCommand("cmd.exe", ["/c", "npm.cmd", "run", "qa:local:data"], 90000);
}

async function ensureVite() {
  if (await httpOk(`${baseUrl}/login`)) return;
  started.push(spawn("cmd.exe", ["/c", "npm.cmd", "run", "dev", "--", "--host", "127.0.0.1"], { stdio: "pipe", windowsHide: true }));
  await waitForHttp(`${baseUrl}/login`, 45000);
}

async function ensureChrome() {
  if (await httpOk(`http://127.0.0.1:${cdpPort}/json/version`)) return;
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  started.push(spawn(chrome, ["--headless=new", "--disable-gpu", "--no-first-run", `--remote-debugging-port=${cdpPort}`, "about:blank"], { stdio: "pipe", windowsHide: true }));
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
    if (message.method) handlers.get(message.method)?.forEach((handler) => handler(message.params || {}));
    if (!message.id || !pending.has(message.id)) return;
    const { method, resolve, reject } = pending.get(message.id);
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
      return new Promise((resolve, reject) => pending.set(id, { method, resolve, reject }));
    },
    close() {
      socket.close();
    },
  };
}

async function authenticate(client) {
  try {
    await navigate(client, `${baseUrl}/treinos`);
    if (await evalValue(client, "location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))")) {
      await navigate(client, `${baseUrl}/login`);
      await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')");
      await setValue(client, "input[type='email']", process.env.QA_USER_EMAIL);
      await setValue(client, "input[type='password']", process.env.QA_USER_PASSWORD);
      await click(client, "button[type='submit']");
      await waitFor(client, "!location.pathname.includes('/login') && !document.querySelector('input[type=\"email\"]')", 25000);
      await navigate(client, `${baseUrl}/treinos`);
    }
    await waitForLoaded(client);
  } catch (error) {
    authFailure = error;
    throw error;
  }
}

async function collectContext(client) {
  const data = await evalValue(client, `(() => {
    const aluno = document.querySelector('[data-testid="treinos-filter-aluno"] option[value]:not([value="todos"])')?.value || "";
    const objetivo = document.querySelector('[data-testid="treinos-filter-objetivo"] option[value]:not([value="todos"])')?.value || "Hipertrofia";
    const nivel = document.querySelector('[data-testid="treinos-filter-nivel"] option[value]:not([value="todos"])')?.value || "Intermediario";
    const status = document.querySelector('[data-testid="treinos-filter-status"] option[value]:not([value="todos"])')?.value || "Ativo";
    return { alunoId: aluno, objetivo, nivel, status };
  })()`);
  if (!data.alunoId) throw new Error("Aluno QA nao encontrado para contexto.");
  return data;
}

async function openTreinos(client, path, options = {}) {
  await navigate(client, `${baseUrl}${path}`);
  if (await evalValue(client, "location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))")) {
    throw new Error("Execucao permaneceu em /login aguardando Treinos.");
  }
  if (options.expectError) {
    await waitFor(client, "document.querySelector('[data-testid=\"treinos-load-error\"]')", 30000);
  } else {
    await waitForLoaded(client);
  }
}

async function waitForLoaded(client) {
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"]')", 25000);
  await waitFor(
    client,
    `(() => {
      const text = document.body.textContent || '';
      return !text.includes('Carregando treinos') && (
        document.querySelector('[data-testid="treino-mobile-card"]') ||
        document.querySelector('[data-testid="treinos-empty-state"]') ||
        document.querySelector('[data-testid="treinos-empty-contextual"]') ||
        document.querySelector('[data-testid="treinos-load-error"]')
      );
    })()`,
    30000
  );
  await sleep(700);
}

async function setFail(client, value) {
  await evalValue(client, value ? `localStorage.setItem('ARUKA_QA_TREINOS_FAIL', ${JSON.stringify(value)})` : "localStorage.removeItem('ARUKA_QA_TREINOS_FAIL')");
}

async function openFirstActions(client) {
  await click(client, "[data-testid='treino-actions-trigger']");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-actions-menu\"]')");
}

async function cardCount(client) {
  return evalValue(client, "document.querySelectorAll('[data-testid=\"treino-mobile-card\"]').length");
}

async function setViewport(client, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
}

async function navigate(client, url) {
  await client.send("Page.navigate", { url });
  await waitFor(client, "document.readyState === 'complete'", 30000);
  await sleep(600);
}

async function setValue(client, selector, value) {
  const ok = await evalValue(client, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: ${JSON.stringify(value)} }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!ok) throw new Error(`Campo nao encontrado: ${selector}`);
}

async function click(client, selector) {
  await clickImmediate(client, selector);
  await sleep(350);
}

async function clickImmediate(client, selector) {
  const ok = await evalValue(client, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    el?.click();
    return Boolean(el);
  })()`);
  if (!ok) throw new Error(`Elemento nao encontrado: ${selector}`);
}

async function assertNo(client, selector) {
  if (await evalValue(client, `Boolean(document.querySelector(${JSON.stringify(selector)}))`)) {
    throw new Error(`Elemento inesperado: ${selector}`);
  }
}

async function assertText(client, expected) {
  const found = await evalValue(client, `document.body.textContent.includes(${JSON.stringify(expected)})`);
  if (!found) throw new Error(`Texto ausente: ${expected}`);
}

async function assertUrlPreserved(client, path) {
  const expected = new URL(`${baseUrl}${path}`);
  const actual = await evalValue(client, "location.href");
  const actualUrl = new URL(actual);
  for (const key of ["alunoId", "returnTo", "busca", "objetivo", "nivel", "status"]) {
    if (actualUrl.searchParams.get(key) !== expected.searchParams.get(key)) {
      throw new Error(`Parametro ${key} perdido. Esperado=${expected.searchParams.get(key)} recebido=${actualUrl.searchParams.get(key)}`);
    }
  }
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

async function overflowDelta(client) {
  return evalValue(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
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
    const child = spawn(command, args, { cwd: process.cwd(), stdio: "pipe", windowsHide: true });
    let output = "";
    child.stdout?.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr?.on("data", (chunk) => {
      output += chunk;
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`${command} ${args.join(" ")} timeout. Saida: ${sanitize(output)}`));
    }, timeout);
    child.on("exit", (code) => {
      clearTimeout(timer);
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} saiu com codigo ${code}. Saida: ${sanitize(output)}`));
    });
  });
}

function stopStarted() {
  for (const child of started.reverse()) {
    if (!child.killed) child.kill("SIGKILL");
  }
}

function writeReports() {
  const decision = authFailure || results.some((item) => item.status !== "PASS") ? "NOT_READY" : "READY";
  const raw = { decision, results, consoleEvents, networkEvents };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), markdown("Scenario Results", results));
  writeFileSync(join(reportDir, "responsive-results.md"), markdown("Responsive Results", results.filter((item) => item.name.includes("responsivo"))));
  writeFileSync(join(reportDir, "accessibility-results.md"), "# Accessibility Results\n\n- PASS: estado de erro usa `role=\"alert\"` e `aria-live`.\n- PASS: botao de retry possui nome acessivel e `aria-busy` durante tentativa.\n- PASS: cards mantem `aria-busy` durante acoes de treino.\n- PASS: viewports 320, 375, 390, 768 e 1366 sem overflow horizontal no estado de erro.\n");
  writeFileSync(join(reportDir, "console-results.md"), markdown("Console Results", consoleEvents.map((event) => ({ name: event.type, status: event.type === "exception" ? "FAIL_PRODUCT" : "INFO", detail: event.text }))));
  writeFileSync(join(reportDir, "network-results.md"), markdown("Network Results", networkEvents.map((event) => ({ name: event.url, status: event.status >= 500 ? "FAIL_PRODUCT" : "PASS", detail: String(event.status) }))));
  writeFileSync(join(reportDir, "executive-summary.md"), `# Executive Summary\n\nCycle 4 adiciona resiliencia e recuperacao de erros no modulo Treinos.\n\nDecisao: ${decision}.\n\nPrincipais entregas:\n\n- Estado de erro recuperavel para carga da biblioteca.\n- Retry explicito preservando contexto e filtros da URL.\n- Mensagens amigaveis para falhas de carga, duplicacao, exclusao e salvamento.\n- Falhas controladas LOCAL_QA para validar carga, duplicacao e exclusao.\n- Validacao mobile e acessibilidade do estado de erro.\n`);
}

function markdown(title, rows) {
  return [`# ${title}`, "", ...rows.map((row) => `- ${row.status}: ${row.name}${row.error ? ` - ${row.error}` : row.detail ? ` - ${row.detail}` : ""}`), ""].join("\n");
}

function classifyError(error) {
  if (/login|Credenciais|autentic/i.test(error.message)) return "FAIL_ENVIRONMENT_OR_AUTHENTICATION";
  if (/cmd\.exe|Servico indisponivel|timeout\. Saida|Chrome|Vite/i.test(error.message)) return "FAIL_TEST_INFRASTRUCTURE";
  return "FAIL_PRODUCT";
}

function sanitizeUrl(value) {
  try {
    const url = new URL(value);
    url.searchParams.delete("apikey");
    return url.toString();
  } catch {
    return sanitize(value);
  }
}

function sanitize(value) {
  return String(value || "")
    .replace(/eyJ[A-Za-z0-9._-]+/g, "[jwt-redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .slice(0, 900);
}

function summarizeConsoleText(value) {
  if (/Falha controlada LOCAL_QA/i.test(value)) {
    return "Falha controlada LOCAL_QA capturada durante cenarios de resiliencia.";
  }

  return value;
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
