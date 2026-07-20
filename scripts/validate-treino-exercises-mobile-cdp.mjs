import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/treinos";
const screenshotDir = join("tmp-responsive-screenshots", "treino-exercises-mobile");
const viewports = [
  { name: "320x800", width: 320, height: 800, mobile: true },
  { name: "360x800", width: 360, height: 800, mobile: true },
  { name: "375x812", width: 375, height: 812, mobile: true },
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "412x915", width: 412, height: 915, mobile: true },
  { name: "430x932", width: 430, height: 932, mobile: true },
  { name: "844x390", width: 844, height: 390, mobile: true },
  { name: "768x1024", width: 768, height: 1024, mobile: true },
  { name: "820x1180", width: 820, height: 1180, mobile: true },
  { name: "1024x768", width: 1024, height: 768, mobile: false },
  { name: "1366x768", width: 1366, height: 768, mobile: false },
  { name: "1440x900", width: 1440, height: 900, mobile: false },
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
      // aguardar CDP
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
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
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

async function openTreinos(client) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) await loginIfNeeded(client);
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"], .treinos-page')", 25000);
  await waitFor(client, "!document.body.textContent.includes('Verificando acesso')", 30000);
  await waitFor(client, "!document.body.textContent.includes('Verificando documentos')", 30000);
  await waitFor(client, "!document.body.textContent.includes('Carregando treinos')", 30000);
  await waitFor(client, "document.querySelector('[data-testid=\"treino-new-button\"]')", 30000);
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

async function fill(client, selector, value) {
  const ok = await evaluate(client, `(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    input.scrollIntoView({ block: 'center', inline: 'nearest' });
    const setter = Object.getOwnPropertyDescriptor(input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
  if (!ok) throw new Error(`Campo nao encontrado: ${selector}`);
}

async function openNewWorkout(client) {
  const before = await countPersistedWorkouts(client);
  const opened = await evaluate(client, `(() => {
    const button = document.querySelector('[data-testid="treino-new-button"]');
    button?.scrollIntoView({ block: 'center', inline: 'nearest' });
    button?.click();
    return Boolean(button);
  })()`);
  if (!opened) {
    const debug = await evaluate(client, `(() => ({
      path: window.location.pathname,
      buttons: [...document.querySelectorAll('button')].map((button) => button.textContent.trim()).slice(0, 20),
      body: document.body.textContent.replace(/\\s+/g, ' ').trim().slice(0, 500)
    }))()`);
    throw new Error(`Botao Novo treino nao encontrado. ${JSON.stringify(debug)}`);
  }
  await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  await fill(client, ".treino-editor-day-form input:first-child", "Treino QA A");
  await fill(client, ".treino-editor-day-form input:nth-child(2)", "Peitoral e triceps");
  await clickText(client, "Adicionar Dia");
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-form\"]')");
  return before;
}

async function addExercise(client, name, series = "3", repetitions = "10", rest = "75s") {
  await fill(client, "[data-testid='exercise-name']", name);
  await fill(client, "[data-testid='exercise-sets']", series);
  await fill(client, "[data-testid='exercise-repetitions']", repetitions);
  await fill(client, "[data-testid='exercise-load']", "QA 50kg");
  await fill(client, "[data-testid='exercise-rest']", rest);
  await fill(client, "[data-testid='exercise-notes']", "Observacao QA longa para validar quebra de linha sem overflow.");
  await clickText(client, "Adicionar exercício", "[data-testid='exercise-add'], button");
  await sleep(250);
}

async function runFlow(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await openTreinos(client);
  const beforeCount = await openNewWorkout(client);
  const results = [];

  await addExercise(client, "Supino reto com halteres em banco inclinado unilateral controlado", "3", "8-12", "90s");
  await addExercise(client, "Triceps corda na polia alta", "4", "10", "60s");
  results.push(validate(await measure(client, viewport, "card")));
  await captureScreenshot(client, `exercises-${viewport.name}-card.png`);

  await evaluate(client, `document.querySelector('[data-testid="exercise-card"] [data-testid="exercise-edit"]').click()`);
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-cancel\"]')");
  await fill(client, "[data-testid='exercise-name']", "Nome alterado que sera cancelado");
  await clickText(client, "Cancelar edição", "[data-testid='exercise-cancel']");
  const cancelOk = await evaluate(client, `document.body.textContent.includes('Supino reto com halteres') && !document.body.textContent.includes('Nome alterado que sera cancelado')`);
  if (!cancelOk) results.push(failure(viewport, "cancelamento", "cancelamento de edicao nao preservou card"));

  await evaluate(client, `document.querySelector('[data-testid="exercise-card"] [data-testid="exercise-edit"]').click()`);
  await fill(client, "[data-testid='exercise-sets']", "5");
  await clickText(client, "Salvar exercício", "[data-testid='exercise-add'], button");
  await sleep(250);
  const editOk = await evaluate(client, `document.querySelector('[data-testid="exercise-card"]')?.textContent.includes('5 series')`);
  if (!editOk) results.push(failure(viewport, "edicao", "edicao local nao atualizou series"));

  await evaluate(client, `document.querySelectorAll('[data-testid="exercise-move-down"]')[0].click()`);
  await sleep(250);
  const reorderOk = await evaluate(client, `document.querySelectorAll('[data-testid="exercise-card"]')[1]?.textContent.includes('Supino reto')`);
  if (!reorderOk) results.push(failure(viewport, "ordenacao", "mover para baixo nao reordenou localmente"));
  await captureScreenshot(client, `exercises-${viewport.name}-reorder.png`);

  await evaluate(client, `document.querySelector('[data-testid="exercise-delete"]').click()`);
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-delete-confirmation-dialog\"]')");
  await captureScreenshot(client, `exercises-${viewport.name}-delete.png`);
  await evaluate(client, `document.querySelector('[data-testid="exercise-delete-confirmation-cancel"]').click()`);
  await sleep(250);
  const cancelDeleteOk = await evaluate(client, `document.querySelectorAll('[data-testid="exercise-card"]').length === 2`);
  if (!cancelDeleteOk) results.push(failure(viewport, "exclusao-cancelada", "cancelar exclusao removeu exercicio"));

  await evaluate(client, `document.querySelector('[data-testid="exercise-delete"]').click()`);
  await waitFor(client, "document.querySelector('[data-testid=\"exercise-delete-confirmation-dialog\"]')");
  await evaluate(client, `document.querySelector('[data-testid="exercise-delete-confirmation-confirm"]').click()`);
  await sleep(250);
  const deleteOk = await evaluate(client, `document.querySelectorAll('[data-testid="exercise-card"]').length === 1`);
  if (!deleteOk) results.push(failure(viewport, "exclusao", "confirmar exclusao nao removeu apenas um exercicio"));

  if (viewport.name === "390x844") {
    for (let index = 0; index < 10; index += 1) {
      await addExercise(client, `Exercicio QA longo ${index + 1} com nome composto para rolagem`, "3", "10", "60s");
    }
    await captureScreenshot(client, "exercises-390-many.png");
  }

  results.push(validate(await measure(client, viewport, "final")));
  await captureScreenshot(client, `exercises-${viewport.name}-final.png`);
  await clickText(client, "Cancelar");
  await sleep(500);
  const afterCount = await countPersistedWorkouts(client);
  if (afterCount !== beforeCount) results.push(failure(viewport, "persistencia", `quantidade de treinos mudou ${beforeCount} -> ${afterCount}`));
  return results;
}

function measure(client, viewport, phase) {
  return evaluate(client, `(() => {
    const compact = (element) => element ? ({
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      deltaWidth: element.scrollWidth - element.clientWidth,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      scrollTop: element.scrollTop
    }) : null;
    const editor = document.querySelector('[data-testid="treino-editor-modal"]');
    const scroll = document.querySelector('[data-testid="treino-editor-scroll"]');
    const exerciseForm = document.querySelector('[data-testid="exercise-form"]');
    const cards = [...document.querySelectorAll('[data-testid="exercise-card"]')];
    const overflowing = [document.documentElement, document.body, editor, scroll, exerciseForm, ...cards]
      .filter(Boolean)
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        testid: element.getAttribute('data-testid') || '',
        deltaWidth: element.scrollWidth - element.clientWidth,
        left: element.getBoundingClientRect().left,
        right: element.getBoundingClientRect().right
      }))
      .filter((item) => Math.abs(item.deltaWidth) > 1 || item.left < -1 || item.right > window.innerWidth + 1);
    return {
      viewport: ${JSON.stringify(viewport.name)},
      phase: ${JSON.stringify(phase)},
      document: compact(document.documentElement),
      body: compact(document.body),
      editor: compact(editor),
      scroll: compact(scroll),
      exerciseForm: compact(exerciseForm),
      cards: cards.map(compact),
      cardCount: cards.length,
      overflowing
    };
  })()`);
}

function validate(item) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document?.deltaWidth],
    ["body", item.body?.deltaWidth],
    ["editor", item.editor?.deltaWidth],
    ["scroll", item.scroll?.deltaWidth],
    ["exerciseForm", item.exerciseForm?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > 1) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) com overflow`);
  item.failures = failures;
  return item;
}

async function countPersistedWorkouts(client) {
  return evaluate(client, `document.querySelectorAll('.treino-card, [data-testid="treino-card"]').length`);
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

function failure(viewport, phase, message) {
  return { viewport: viewport.name, phase, failures: [message], overflowing: [] };
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
      cardCount: item.cardCount,
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
    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
