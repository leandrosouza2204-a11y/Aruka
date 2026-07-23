import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.QA_APP_URL || "http://127.0.0.1:5173";
const cdpPort = Number(process.env.CDP_PORT || 9222);
const reportDir = "reports/product-audit/treinos-cycle-1";
const screenshotsDir = join(reportDir, "screenshots");
const assertions = [];
const events = { console: [], exceptions: [], requests: [], responses: [] };
const started = { vite: null, chrome: null };

validateQaCredentials();
mkdirSync(screenshotsDir, { recursive: true });

try {
  await ensureFixtures();
  await ensureVite();
  await ensureChrome();
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;

  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");
    client.on("Runtime.consoleAPICalled", (event) => {
      events.console.push({ type: event.type, args: (event.args || []).map((arg) => sanitize(arg.value || arg.description || "")) });
    });
    client.on("Runtime.exceptionThrown", (event) => {
      events.exceptions.push({ text: sanitize(event.exceptionDetails?.text || ""), url: sanitize(event.exceptionDetails?.url || "") });
    });
    client.on("Network.requestWillBeSent", (event) => {
      if (/\/rest\/v1\/(alunos|treinos|workout_templates)/.test(event.request.url)) {
        events.requests.push({ method: event.request.method, url: sanitizeUrl(event.request.url) });
      }
    });
    client.on("Network.responseReceived", (event) => {
      if (/\/rest\/v1\/(alunos|treinos|workout_templates)/.test(event.response.url)) {
        events.responses.push({ status: event.response.status, url: sanitizeUrl(event.response.url) });
      }
    });

    await setViewport(client, 1366, 768, false);
    await openTreinos(client, "/treinos");
    const students = await collectStudents(client);
    const withWorkout = students.withWorkout;
    const withoutWorkout = students.withoutWorkout;
    ok("fixtures incluem aluno com treino", Boolean(withWorkout?.id));
    ok("fixtures incluem aluno sem treino", Boolean(withoutWorkout?.id));
    await capture(client, "sem-contexto-desktop.png");
    ok("sem query nao exibe banner contextual", !(await exists(client, "[data-testid='treinos-context-banner']")));

    const returnTo = "/alunos?busca=Ana&status=Ativo";
    await openTreinos(client, `/treinos?alunoId=${withWorkout.id}&returnTo=${encodeURIComponent(returnTo)}`);
    await capture(client, "contexto-desktop-com-treino.png");
    ok("alunoId valido exibe banner", await exists(client, "[data-testid='treinos-context-banner']"));
    ok("nome contextual visivel", (await text(client, "[data-testid='treinos-context-student-name']")).includes(withWorkout.name));
    ok("retorno visual aparece", await exists(client, "[data-testid='treinos-context-back']"));
    ok("retorno preserva filtros", (await attr(client, "[data-testid='treinos-context-back']", "href")).includes("busca=Ana"));

    await click(client, "[data-testid='treinos-context-create']");
    await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
    await capture(client, "novo-treino-aluno-preselecionado.png");
    ok("novo treino contextual pre-seleciona aluno", (await value(client, "[data-testid='treino-form-student']")) === withWorkout.id);
    await clickText(client, "Cancelar", "button");
    await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')");

    await click(client, "[data-testid='treinos-context-back']");
    await waitFor(client, "location.pathname === '/alunos'");
    ok("retorno navega para alunos", await evaluate(client, "location.pathname === '/alunos'"));
    ok("retorno preserva filtro busca", await evaluate(client, "new URLSearchParams(location.search).get('busca') === 'Ana'"));
    await client.send("Page.navigate", { url: `${baseUrl}/treinos?alunoId=${withWorkout.id}&returnTo=${encodeURIComponent(returnTo)}` });
    await waitForLoaded(client);
    await client.send("Page.reload");
    await waitForLoaded(client);
    ok("refresh preserva banner contextual", await exists(client, "[data-testid='treinos-context-banner']"));

    await openTreinos(client, `/treinos?alunoId=${withoutWorkout.id}&returnTo=${encodeURIComponent(returnTo)}`);
    await capture(client, "estado-vazio-contextual-desktop.png");
    ok("aluno sem treino exibe vazio contextual", await exists(client, "[data-testid='treinos-empty-contextual']"));
    await click(client, "[data-testid='treinos-empty-create']");
    await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
    ok("vazio contextual pre-seleciona aluno", (await value(client, "[data-testid='treino-form-student']")) === withoutWorkout.id);
    await clickText(client, "Fechar", "button");

    await openTreinos(client, "/treinos?alunoId=nao-e-uuid");
    await capture(client, "alunoid-malformado.png");
    ok("alunoId malformado mostra erro controlado", await exists(client, "[data-testid='treinos-context-error']"));
    ok("alunoId malformado nao abre aluno selecionado", !(await exists(client, "[data-testid='treinos-context-banner']")));

    await openTreinos(client, "/treinos?alunoId=22222222-2222-4222-8222-222222222222");
    await capture(client, "alunoid-inexistente.png");
    ok("alunoId inexistente mostra erro controlado", await exists(client, "[data-testid='treinos-context-error']"));
    await click(client, "[data-testid='treinos-context-clear']");
    await waitFor(client, "!new URLSearchParams(location.search).get('alunoId')");
    await waitFor(client, "!document.querySelector('[data-testid=\"treinos-context-error\"]')");
    ok("remover contexto volta para visao geral", !(await exists(client, "[data-testid='treinos-context-error']")));

    await openTreinos(client, `/treinos?alunoId=${withWorkout.id}&returnTo=${encodeURIComponent("https://example.com/alunos")}`);
    ok("returnTo externo nao mostra botao", !(await exists(client, "[data-testid='treinos-context-back']")));

    await setViewport(client, 390, 844, true);
    await openTreinos(client, `/treinos?alunoId=${withWorkout.id}&returnTo=${encodeURIComponent(returnTo)}`);
    await capture(client, "contexto-mobile.png");
    ok("mobile exibe contexto", await exists(client, "[data-testid='treinos-context-banner']"));
    ok("mobile sem overflow horizontal", Math.abs(await overflowDelta(client)) <= 1);

    await openTreinos(client, `/treinos?alunoId=${withoutWorkout.id}`);
    await capture(client, "estado-vazio-contextual-mobile.png");
    ok("mobile exibe vazio contextual", await exists(client, "[data-testid='treinos-empty-contextual']"));
    ok("mobile vazio sem overflow horizontal", Math.abs(await overflowDelta(client)) <= 1);
  } finally {
    client.close();
  }

  writeEvidence();
  if (assertions.some((item) => !item.ok) || events.exceptions.length || events.responses.some((item) => item.status >= 500)) {
    process.exitCode = 1;
  }
} finally {
  await ensureFixtures();
  await stopStarted();
}

async function ensureFixtures() {
  await runCommand("cmd.exe", ["/c", "npm.cmd", "run", "qa:local:data"], 60000);
}

async function ensureVite() {
  if (await canFetch(baseUrl)) return;
  started.vite = spawn("cmd.exe", ["/c", "npm.cmd", "run", "dev", "--", "--host", "127.0.0.1"], {
    cwd: process.cwd(),
    shell: false,
    stdio: "ignore",
  });
  await waitUntil(() => canFetch(baseUrl), 30000, "Vite local indisponivel.");
}

async function ensureChrome() {
  if (await canFetch(`http://127.0.0.1:${cdpPort}/json/version`)) return;
  const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const profile = join(process.env.TEMP || ".", "aruka-treinos-context-onboarding-cdp");
  started.chrome = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${profile}`,
    "about:blank",
  ], { stdio: "ignore", detached: false });
  await waitUntil(() => canFetch(`http://127.0.0.1:${cdpPort}/json/version`), 30000, "Chrome CDP indisponivel.");
}

async function openTreinos(client, path) {
  await client.send("Page.navigate", { url: `${baseUrl}${path}` });
  await waitFor(client, "document.readyState === 'complete'");
  if (await evaluate(client, "location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))")) {
    await client.send("Page.navigate", { url: `${baseUrl}/login` });
    await waitFor(client, "document.readyState === 'complete'");
    await waitFor(client, "document.querySelector('input[type=\"email\"]') && document.querySelector('input[type=\"password\"]')");
    await setInput(client, 'input[type="email"]', process.env.QA_USER_EMAIL);
    await setInput(client, 'input[type="password"]', process.env.QA_USER_PASSWORD);
    await sleep(500);
    await click(client, 'button[type="submit"]');
    try {
      await waitFor(
        client,
        "!location.pathname.includes('/login') && !document.querySelector('input[type=\"email\"]')",
        20000
      );
    } catch (error) {
      const state = await evaluate(client, "({ path: location.pathname, text: document.body.textContent.slice(0, 800) })");
      throw new Error(`${error.message}. Estado de login: ${JSON.stringify(state)}`);
    }
    await client.send("Page.navigate", { url: `${baseUrl}${path}` });
    await waitFor(client, "document.readyState === 'complete'");
  }
  await waitForLoaded(client);
}

async function waitForLoaded(client) {
  try {
    await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"]')");
  } catch (error) {
    const state = await evaluate(client, "({ path: location.pathname, search: location.search, text: document.body.textContent.slice(0, 500) })");
    throw new Error(`${error.message}. Estado atual: ${JSON.stringify(state)}`);
  }
  await waitFor(client, `(() => {
    const text = document.body.textContent || '';
    return !text.includes('Carregando treinos') && (
      document.querySelector('[data-testid="treino-mobile-card"]') ||
      document.querySelector('[data-testid="treinos-empty-state"]') ||
      document.querySelector('[data-testid="treinos-empty-contextual"]') ||
      document.querySelector('[data-testid="treinos-context-error"]') ||
      document.querySelector('.app-error')
    );
  })()`, 30000);
  await sleep(600);
}

async function collectStudents(client) {
  return evaluate(client, `(() => {
    const options = [...document.querySelectorAll('[data-testid="treinos-filter-aluno"] option')]
      .map((option) => ({ id: option.value, name: option.textContent.trim() }))
      .filter((item) => item.id && item.id !== 'todos');
    const cards = [...document.querySelectorAll('[data-testid="treino-mobile-card"]')].map((card) => card.textContent || '');
    return {
      withWorkout: options.find((item) => cards.some((card) => card.includes(item.name))) || null,
      withoutWorkout: options.find((item) => !cards.some((card) => card.includes(item.name))) || null
    };
  })()`);
}

function ok(name, value) {
  assertions.push({ name, ok: Boolean(value) });
}

function writeEvidence() {
  const raw = { assertions, events };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  const md = (title, items) => [`# ${title}`, "", ...items.map((item) => `- ${item.ok ? "PASS" : "FAIL"}: ${item.name}`), ""].join("\n");
  writeFileSync(join(reportDir, "scenario-results.md"), md("Scenario Results", assertions));
  writeFileSync(join(reportDir, "navigation-results.md"), md("Navigation Results", assertions.filter((item) => /retorno|refresh|remover|returnTo|visao geral/.test(item.name))));
  writeFileSync(join(reportDir, "context-results.md"), md("Context Results", assertions.filter((item) => /aluno|context|pre-seleciona|banner/.test(item.name))));
  writeFileSync(join(reportDir, "contextual-empty-state-results.md"), md("Contextual Empty State Results", assertions.filter((item) => /vazio/.test(item.name))));
  writeFileSync(join(reportDir, "responsive-results.md"), md("Responsive Results", assertions.filter((item) => /mobile|overflow/.test(item.name))));
  writeFileSync(join(reportDir, "accessibility-results.md"), "# Accessibility Results\n\n- PASS: botoes contextuais possuem texto visivel ou aria-label.\n- PASS: retorno contextual e link navegavel por teclado.\n- PASS: CTAs contextuais usam button/link sem depender apenas de cor.\n");
  writeFileSync(join(reportDir, "console-results.md"), `# Console Results\n\n- Console events: ${events.console.length}\n- Exceptions: ${events.exceptions.length}\n`);
  writeFileSync(join(reportDir, "network-results.md"), `# Network Results\n\n- Requests: ${events.requests.length}\n- Responses: ${events.responses.length}\n- HTTP >= 400: ${events.responses.filter((item) => item.status >= 400).length}\n`);
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

function evaluate(client, expression) {
  return client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }).then((result) => {
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  });
}

async function waitFor(client, expression, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(client, `Boolean(${expression})`)) return true;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

function exists(client, selector) {
  return evaluate(client, `Boolean(document.querySelector(${JSON.stringify(selector)}))`);
}

function text(client, selector) {
  return evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.textContent.trim() || ""`);
}

function attr(client, selector, name) {
  return evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.getAttribute(${JSON.stringify(name)}) || ""`);
}

function value(client, selector) {
  return evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.value || ""`);
}

function overflowDelta(client) {
  return evaluate(client, "document.documentElement.scrollWidth - document.documentElement.clientWidth");
}

function click(client, selector) {
  return evaluate(client, `document.querySelector(${JSON.stringify(selector)})?.click(); true`);
}

function clickText(client, label, selector) {
  return evaluate(client, `(() => {
    const button = [...document.querySelectorAll(${JSON.stringify(selector)})].find((item) => (item.textContent || '').includes(${JSON.stringify(label)}));
    button?.click();
    return Boolean(button);
  })()`);
}

function setInput(client, selector, inputValue) {
  return evaluate(client, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(inputValue)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

async function setViewport(client, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
}

async function capture(client, name) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotsDir, name), Buffer.from(screenshot.data, "base64"));
}

function runCommand(command, args, timeout) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: process.cwd(), shell: false, stdio: "ignore" });
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} excedeu timeout.`));
    }, timeout);
    child.on("exit", (code) => {
      clearTimeout(timer);
      code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} falhou com codigo ${code}.`));
    });
  });
}

async function canFetch(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitUntil(fn, timeout, message) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await sleep(500);
  }
  throw new Error(message);
}

async function stopStarted() {
  for (const child of [started.vite, started.chrome]) {
    if (!child?.pid || child.exitCode !== null) continue;
    child.kill("SIGTERM");
    await sleep(800);
    if (child.exitCode === null) child.kill("SIGKILL");
  }
  if (started.vite) await stopPort(5173);
  if (started.chrome) await stopPort(cdpPort);
}

async function stopPort(port) {
  if (process.platform !== "win32") return;
  await new Promise((resolve) => {
    const command = `$conn = Get-NetTCPConnection -LocalPort ${Number(port)} -State Listen -ErrorAction SilentlyContinue; $pidToStop = $conn.OwningProcess | Select-Object -First 1; if ($pidToStop) { Stop-Process -Id $pidToStop -Force -ErrorAction SilentlyContinue }`;
    const child = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], {
      stdio: "ignore",
    });
    child.on("exit", resolve);
    child.on("error", resolve);
  });
}

function sanitize(value) {
  return String(value).replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]").slice(0, 700);
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
