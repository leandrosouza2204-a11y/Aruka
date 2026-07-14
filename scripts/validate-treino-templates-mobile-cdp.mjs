import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/treinos";
const screenshotDir = join("tmp-responsive-screenshots", "treino-templates-mobile");
const viewports = [
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "844x390", width: 844, height: 390, mobile: true },
  { name: "820x1180", width: 820, height: 1180, mobile: true },
  { name: "1366x768", width: 1366, height: 768, mobile: false },
];
const generos = ["Masculino", "Feminino", "Todos"];
const divisoes = ["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"];
const modelosObrigatorios = [
  "Masculino - ABC",
  "Masculino - ABCD",
  "Masculino - ABCDE",
  "Masculino - Full Body",
  "Masculino - Upper/Lower",
  "Feminino - ABC",
  "Feminino - ABCD",
  "Feminino - ABCDE",
  "Feminino - Full Body",
  "Feminino - Upper/Lower",
];

validateQaCredentials();

async function getWebSocketUrl() {
  await waitForCdp({ port: cdpPort });
  const targetResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }
  const versionResponse = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!versionResponse.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  return (await versionResponse.json()).webSocketDebuggerUrl;
}

async function waitForCdp({ port, timeoutMs = 15000, intervalMs = 250 }) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return await response.json();
    } catch {
      // aguardar proxima tentativa
    }
    await sleep(intervalMs);
  }
  throw new Error(`Chrome CDP nao respondeu na porta ${port}.`);
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
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
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
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

async function openTreinos(client) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) await loginIfNeeded(client);
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"], .treinos-page')", 25000);
  await waitFor(client, "!document.body.textContent.includes('Carregando treinos')", 30000);
  await sleep(700);
}

async function loginIfNeeded(client) {
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
    return true;
  })()`);
  if (!filled) throw new Error("Falha no login QA: campos nao encontrados.");
  await clickText(client, "Entrar");
  await sleep(5500);
  const after = await authState(client);
  if (after.path.includes("/login") || after.hasLoginForm) throw new Error(`Falha no login QA. Rota atual: ${after.path}.`);
}

function authState(client) {
  return evaluate(client, `(() => ({ path: window.location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function clickText(client, text, selector = "button") {
  return evaluate(client, `(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const item = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((element) => visible(element) && element.textContent.trim().includes(${JSON.stringify(text)}));
    item?.scrollIntoView({ block: 'center', inline: 'nearest' });
    item?.click();
    return Boolean(item);
  })()`);
}

async function openTemplates(client) {
  await waitFor(client, "document.querySelector('[data-testid=\"treino-template-open\"]')", 25000);
  const opened = await clickText(client, "Gerar por modelo", "[data-testid=\"treino-template-open\"], button");
  if (!opened) throw new Error("Botao Gerar por modelo nao encontrado.");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-template-modal\"]')");
  await sleep(400);
}

async function choose(client, text) {
  const selected = await clickText(client, text, "[data-testid=\"treino-template-choice\"], [data-testid=\"treino-template-card\"], button");
  if (!selected) throw new Error(`Opcao nao encontrada: ${text}`);
  await sleep(250);
}

function measure(client, viewport, phase) {
  return evaluate(client, `(() => {
    const compact = (element) => element ? ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      deltaWidth: element.scrollWidth - element.clientWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight
    }) : null;
    const modal = document.querySelector('[data-testid="treino-template-modal"]');
    const scroll = document.querySelector('[data-testid="treino-template-scroll"]');
    const footer = modal?.querySelector('.treino-template-footer');
    const overflowing = [...document.querySelectorAll('[data-testid="treino-template-modal"] *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName.toLowerCase(), className: String(element.className || ''), left: rect.left, right: rect.right, width: rect.width };
      })
      .filter(({ left, right, width }) => left < -1 || right > window.innerWidth + 1 || width > window.innerWidth + 1)
      .slice(0, 12);
    return {
      viewport: ${JSON.stringify(viewport.name)},
      phase: ${JSON.stringify(phase)},
      document: compact(document.documentElement),
      body: compact(document.body),
      modal: compact(modal),
      scroll: compact(scroll),
      footer: compact(footer),
      modelCards: document.querySelectorAll('[data-testid="treino-template-card"]').length,
      preview: Boolean(document.querySelector('[data-testid="treino-template-preview"]')),
      overflowing
    };
  })()`);
}

function validate(item) {
  const failures = [];
  for (const [label, delta] of [["document", item.document?.deltaWidth], ["body", item.body?.deltaWidth], ["modal", item.modal?.deltaWidth], ["scroll", item.scroll?.deltaWidth], ["footer", item.footer?.deltaWidth]]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > 1) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  item.failures = failures;
  return item;
}

async function validateCatalog(client) {
  const data = await evaluate(client, `(() => {
    const clickByText = (text) => {
      const item = [...document.querySelectorAll('button')]
        .find((button) => button.textContent.trim().includes(text));
      item?.click();
      return Boolean(item);
    };
    const stepTexts = [];
    stepTexts.push(document.body.textContent);
    return { stepTexts };
  })()`);
  return data;
}

async function runFlow(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await openTreinos(client);
  await openTemplates(client);
  const results = [];

  results.push(validate(await measure(client, viewport, "genero")));
  for (const genero of generos) {
    const exists = await evaluate(client, `document.body.textContent.includes(${JSON.stringify(genero)})`);
    if (!exists) results.push({ viewport: viewport.name, phase: "genero-ausente", failures: [`genero ausente: ${genero}`], overflowing: [] });
  }
  await choose(client, "Todos");
  await clickText(client, "Continuar");

  for (const divisao of divisoes) {
    const exists = await evaluate(client, `document.body.textContent.includes(${JSON.stringify(divisao)})`);
    if (!exists) results.push({ viewport: viewport.name, phase: "divisao-ausente", failures: [`divisao ausente: ${divisao}`], overflowing: [] });
  }
  await choose(client, "ABC");
  await clickText(client, "Continuar");
  await sleep(300);

  const abcModels = await evaluate(client, `([...document.querySelectorAll('[data-testid="treino-template-card"]')].map((card) => card.textContent))`);
  for (const name of ["Masculino - ABC", "Feminino - ABC"]) {
    if (!abcModels.some((text) => text.includes(name))) {
      results.push({ viewport: viewport.name, phase: "modelo-ausente", failures: [`modelo ausente: ${name}`], overflowing: [] });
    }
  }
  results.push(validate(await measure(client, viewport, "modelos-abc")));

  if (viewport.name === "390x844") {
    await validateAllModelsOnMobile(client, results);
  }

  await clickText(client, "Masculino - ABC", "[data-testid=\"treino-template-card\"]");
  await captureScreenshot(client, `templates-${viewport.name}-preview.png`);
  await clickText(client, "Continuar");
  await sleep(300);

  const selectedAluno = await evaluate(client, `(() => {
    const select = document.querySelector('[data-testid="treino-template-aluno"]');
    if (!select || select.options.length < 2) return false;
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!selectedAluno) {
    results.push({ viewport: viewport.name, phase: "aluno-indisponivel", failures: ["nenhum aluno disponivel para destino"], overflowing: [] });
  }
  await clickText(client, "Continuar");
  await sleep(300);
  results.push(validate(await measure(client, viewport, "confirmacao")));
  await captureScreenshot(client, `templates-${viewport.name}-confirmacao.png`);

  const generateVisible = await evaluate(client, `Boolean(document.querySelector('[data-testid="treino-template-generate"]'))`);
  if (!generateVisible) results.push({ viewport: viewport.name, phase: "gerar-ausente", failures: ["botao Gerar treino editavel ausente"], overflowing: [] });
  await clickText(client, "Fechar");
  return results;
}

async function validateAllModelsOnMobile(client, results) {
  await clickText(client, "Voltar");
  for (const divisao of divisoes) {
    await choose(client, divisao);
    await clickText(client, "Continuar");
    await sleep(200);
    const texts = await evaluate(client, `([...document.querySelectorAll('[data-testid="treino-template-card"]')].map((card) => card.textContent))`);
    const expected = modelosObrigatorios.filter((name) => name.endsWith(`- ${divisao}`));
    for (const name of expected) {
      if (!texts.some((text) => text.includes(name))) {
        results.push({ viewport: "390x844", phase: "modelo-obrigatorio", failures: [`modelo ausente: ${name}`], overflowing: [] });
      }
    }
    await clickText(client, "Voltar");
  }
  await choose(client, "ABC");
  await clickText(client, "Continuar");
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    const results = [];
    for (const viewport of viewports) {
      results.push(...(await runFlow(client, viewport)));
    }
    const summary = results.map((item) => ({
      viewport: item.viewport,
      phase: item.phase,
      status: item.failures.length === 0 ? "ok" : "falhou",
      failures: item.failures,
      modelCards: item.modelCards,
      preview: item.preview,
      overflowing: item.overflowing,
    }));
    console.log(JSON.stringify({ authenticated: true, persisted: false, summary }, null, 2));
    if (results.some((item) => item.failures.length > 0)) process.exitCode = 1;
  } finally {
    client.close();
  }
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
