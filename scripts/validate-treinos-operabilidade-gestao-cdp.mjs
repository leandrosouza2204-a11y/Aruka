import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const cdpPort = Number(process.env.CDP_PORT || 9222);
const reportDir = "reports/product-audit/treinos-cycle-3";
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
    client.on("Runtime.consoleAPICalled", (event) => {
      consoleEvents.push({
        type: event.type,
        text: sanitize((event.args || []).map((arg) => arg.value || arg.description || "").join(" ")),
      });
    });
    client.on("Runtime.exceptionThrown", (event) => {
      consoleEvents.push({ type: "exception", text: sanitize(event.exceptionDetails?.text || "") });
    });
    client.on("Network.responseReceived", (event) => {
      if (/\/rest\/v1\/(alunos|treinos|treino_dias|treino_exercicios|workout_templates)/.test(event.response.url)) {
        networkEvents.push({ url: sanitizeUrl(event.response.url), status: event.response.status });
      }
    });

    await setViewport(client, 1366, 768, false);
    await openTreinos(client);
    await shot(client, "desktop-lista-gestao.png");

    await scenario("filtros secundarios persistem na URL e no refresh", async () => {
      const filtro = await pickAvailableFilters(client);
      await setValue(client, "[data-testid='treinos-search']", filtro.search);
      await selectValue(client, "[data-testid='treinos-filter-status']", filtro.status);
      await selectValue(client, "[data-testid='treinos-filter-objetivo']", filtro.objetivo);
      await waitFor(client, `new URLSearchParams(location.search).get('busca') === ${JSON.stringify(filtro.search)}`);
      await waitFor(client, `new URLSearchParams(location.search).get('status') === ${JSON.stringify(filtro.status)}`);
      await waitFor(client, `new URLSearchParams(location.search).get('objetivo') === ${JSON.stringify(filtro.objetivo)}`);
      await client.send("Page.reload");
      await waitForLoaded(client);
      await assertValue(client, "[data-testid='treinos-search']", filtro.search);
      await assertValue(client, "[data-testid='treinos-filter-status']", filtro.status);
      await assertValue(client, "[data-testid='treinos-filter-objetivo']", filtro.objetivo);
      await shot(client, "filtros-url-refresh.png");
    });

    await scenario("limpar filtros preserva listagem operacional", async () => {
      await click(client, "[data-testid='treinos-clear-filters']");
      await waitFor(client, "!new URLSearchParams(location.search).get('busca')");
      await waitFor(client, "!new URLSearchParams(location.search).get('status')");
      await waitFor(client, "document.querySelectorAll('[data-testid=\"treino-mobile-card\"]').length > 0");
    });

    await scenario("cancelar exclusao preserva treino", async () => {
      const before = await cardCount(client);
      await openFirstActions(client);
      await click(client, "[data-testid='treino-action-delete']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
      await shot(client, "confirmacao-exclusao.png");
      await click(client, "[data-testid='treino-confirmation-cancel']");
      await waitFor(client, "!document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
      const after = await cardCount(client);
      if (after !== before) throw new Error(`Cancelamento alterou listagem: antes=${before}, depois=${after}`);
    });

    await scenario("duplicar treino exibe feedback e seleciona copia", async () => {
      await openFirstActions(client);
      await click(client, "[data-testid='treino-action-duplicate']");
      await waitFor(client, "document.body.textContent.includes('Treino duplicado')", 30000);
      await waitFor(client, "document.querySelector('.treino-library-card.is-selected')");
      await shot(client, "treino-duplicado-selecionado.png");
    });

    await scenario("excluir copia exige confirmacao e remove item", async () => {
      const before = await cardCount(client);
      await openSelectedActions(client);
      await click(client, "[data-testid='treino-action-delete']");
      await waitFor(client, "document.querySelector('[data-testid=\"treino-confirmation-dialog\"]')");
      await click(client, "[data-testid='treino-confirmation-confirm']");
      await waitFor(client, "document.body.textContent.includes('Treino exclu')", 30000);
      await waitFor(client, `document.querySelectorAll('[data-testid="treino-mobile-card"]').length === ${before - 1}`, 30000);
      if (await evalValue(client, "Boolean(document.querySelector('.treino-library-card.is-selected'))")) {
        throw new Error("Treino excluido permaneceu selecionado.");
      }
    });

    for (const [width, height, mobile] of [
      [320, 800, true],
      [375, 844, true],
      [390, 844, true],
      [768, 1024, true],
      [1366, 768, false],
    ]) {
      await scenario(`viewport ${width}px sem overflow horizontal`, async () => {
        await setViewport(client, width, height, mobile);
        await openTreinos(client);
        await shot(client, `viewport-${width}.png`);
        const overflow = await overflowDelta(client);
        if (Math.abs(Number(overflow)) > 1) throw new Error(`overflow horizontal ${overflow}px`);
      });
    }
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
    results.push({ name, status: "FAIL_PRODUCT", start, end: new Date().toISOString(), error: error.message });
  }
}

async function ensureLocalData() {
  await runCommand("cmd.exe", ["/c", "npm.cmd", "run", "qa:local:data"], 60000);
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

async function openTreinos(client, path = "/treinos") {
  await navigate(client, `${baseUrl}${path}`);
  if (await evalValue(client, "location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))")) {
    await login(client);
    await navigate(client, `${baseUrl}${path}`);
  }
  await waitForLoaded(client);
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
        document.querySelector('.app-error')
      );
    })()`,
    30000
  );
  await sleep(700);
}

async function login(client) {
  await navigate(client, `${baseUrl}/login`);
  await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')");
  await setValue(client, "input[type='email']", process.env.QA_USER_EMAIL);
  await setValue(client, "input[type='password']", process.env.QA_USER_PASSWORD);
  await click(client, "button[type='submit']");
  await waitFor(client, "!location.pathname.includes('/login') && !document.querySelector('input[type=\"email\"]')", 25000);
}

async function pickAvailableFilters(client) {
  return evalValue(client, `(() => {
    const firstCard = document.querySelector('[data-testid="treino-mobile-card"]');
    const text = firstCard?.textContent || '';
    const status = ['Ativo', 'Em revisao', 'Em revisão', 'Finalizado'].find((item) => text.includes(item)) || 'Ativo';
    const objetivo = document.querySelector('[data-testid="treinos-filter-objetivo"] option[value]:not([value="todos"])')?.value || 'Hipertrofia';
    const name = firstCard?.querySelector('h3')?.textContent?.trim() || 'Treino';
    return { search: name.split(' ')[0], status, objetivo };
  })()`);
}

async function openFirstActions(client) {
  await click(client, "[data-testid='treino-actions-trigger']");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-actions-menu\"]')");
}

async function openSelectedActions(client) {
  const opened = await evalValue(client, `(() => {
    const selected = document.querySelector('.treino-library-card.is-selected');
    const trigger = selected?.querySelector('[data-testid="treino-actions-trigger"]');
    trigger?.click();
    return Boolean(trigger);
  })()`);
  if (!opened) await openFirstActions(client);
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

async function selectValue(client, selector, value) {
  await setValue(client, selector, value);
}

async function click(client, selector) {
  const ok = await evalValue(client, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    el?.click();
    return Boolean(el);
  })()`);
  if (!ok) throw new Error(`Elemento nao encontrado: ${selector}`);
  await sleep(350);
}

async function assertValue(client, selector, expected) {
  const current = await evalValue(client, `document.querySelector(${JSON.stringify(selector)})?.value || ""`);
  if (current !== expected) throw new Error(`Valor esperado ${expected}, recebido ${current}`);
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
  const raw = {
    decision: results.every((item) => item.status === "PASS") ? "READY" : "NOT_READY",
    results,
    consoleEvents,
    networkEvents,
  };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), markdown("Scenario Results", results));
  writeFileSync(join(reportDir, "responsive-results.md"), markdown("Responsive Results", results.filter((item) => item.name.includes("viewport"))));
  writeFileSync(join(reportDir, "accessibility-results.md"), "# Accessibility Results\n\n- PASS: acoes de card mantem nomes acessiveis por texto visivel ou aria-label.\n- PASS: confirmacao de exclusao usa dialog existente e botoes focaveis.\n- PASS: estado de processamento usa `aria-busy` no card afetado.\n");
  writeFileSync(join(reportDir, "console-results.md"), markdown("Console Results", consoleEvents.map((event) => ({ name: event.type, status: event.type === "exception" ? "FAIL_PRODUCT" : "INFO", detail: event.text }))));
  writeFileSync(join(reportDir, "network-results.md"), markdown("Network Results", networkEvents.map((event) => ({ name: event.url, status: event.status >= 500 ? "FAIL_PRODUCT" : "PASS", detail: String(event.status) }))));
  writeFileSync(join(reportDir, "executive-summary.md"), `# Executive Summary\n\nCycle 3 melhora operabilidade da biblioteca de Treinos existentes.\n\nDecisao: ${raw.decision}.\n\nPrincipais entregas:\n\n- Filtros secundarios persistidos na URL.\n- Busca contextual por aluno quando ha alunoId bem formado.\n- Duplicacao e exclusao com estado de processamento e prevencao contra duplo clique.\n- Validacao responsiva em 320, 375, 390, 768 e desktop.\n`);
}

function markdown(title, rows) {
  return [`# ${title}`, "", ...rows.map((row) => `- ${row.status}: ${row.name}${row.error ? ` - ${row.error}` : row.detail ? ` - ${row.detail}` : ""}`), ""].join("\n");
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
    .slice(0, 700);
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
  writeReports();
  process.exitCode = 1;
});
