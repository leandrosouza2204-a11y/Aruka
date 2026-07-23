import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = "reports/product-audit/treinos-v1";
const baseUrl = process.env.QA_APP_URL || "http://127.0.0.1:5173";
const cdpPort = process.env.CDP_PORT || "9222";
const events = { console: [], exceptions: [], requests: [], responses: [] };
const scenarios = [];
const snapshots = [];

validateQaCredentials();
mkdirSync(join(reportDir, "screenshots"), { recursive: true });

const client = createCdpClient(await getWebSocketUrl());
await client.ready;

try {
  await client.send("Page.enable");
  await client.send("Runtime.enable");
  await client.send("Network.enable");
  client.on("Runtime.consoleAPICalled", (event) => {
    events.console.push({
      type: event.type,
      args: (event.args || []).map((arg) => sanitize(arg.value || arg.description || "")),
    });
  });
  client.on("Runtime.exceptionThrown", (event) => {
    events.exceptions.push({
      text: sanitize(event.exceptionDetails?.text || ""),
      url: sanitize(event.exceptionDetails?.url || ""),
    });
  });
  client.on("Network.requestWillBeSent", (event) => {
    if (isRelevantRequest(event.request.url)) {
      events.requests.push({
        method: event.request.method,
        url: sanitizeUrl(event.request.url),
        type: event.type,
      });
    }
  });
  client.on("Network.responseReceived", (event) => {
    if (isRelevantRequest(event.response.url)) {
      events.responses.push({
        status: event.response.status,
        url: sanitizeUrl(event.response.url),
        mimeType: event.response.mimeType,
      });
    }
  });

  await setViewport("desktop-1366", 1366, 768, false);
  await navigate(`${baseUrl}/treinos`);
  await loginIfNeeded();
  await openTreinos("/treinos");
  await capture("desktop-1366-lista.png");
  const initial = await inspectTreinos("sem-contexto");
  pass("abrir Treinos sem contexto", initial.hasPage && initial.loaded);
  pass("acao principal visivel", initial.hasNewButton);
  pass("modelo rapido visivel", initial.hasTemplateButton);
  pass("lista ou vazio renderizado", initial.cardCount > 0 || initial.hasEmpty);

  const alunoComTreino = await pickStudent({ withWorkout: true });
  const alunoSemTreino = await pickStudent({ withWorkout: false });

  await openTreinos(`/treinos?alunoId=${encodeURIComponent(alunoComTreino.id)}&returnTo=${encodeURIComponent("/alunos?busca=Ana&status=Ativo")}`);
  const contextual = await inspectTreinos("contexto-valido");
  await capture("desktop-contexto-aluno.png");
  pass("abrir Treinos com alunoId valido", contextual.hasContext && contextual.cardCount >= 1);
  pass("aluno selecionado claro no contexto", contextual.contextText.includes(alunoComTreino.nome));

  await client.send("Page.reload");
  await waitForLoaded();
  const refreshed = await inspectTreinos("refresh-contexto");
  pass("refresh preserva alunoId", refreshed.hasContext && (await locationSearch()).includes("alunoId="));

  await openTreinos("/treinos?alunoId=00000000-0000-4000-8000-000000000999");
  const invalid = await inspectTreinos("contexto-invalido");
  await capture("desktop-contexto-invalido.png");
  pass("abrir Treinos com alunoId invalido nao quebra", invalid.hasPage && invalid.loaded);
  pass("alunoId invalido nao comunica contexto", !invalid.hasContext);

  await openTreinos(`/treinos?alunoId=${encodeURIComponent(alunoSemTreino.id)}`);
  const emptyStudent = await inspectTreinos("aluno-sem-treino");
  await capture("desktop-aluno-sem-treino.png");
  pass("aluno sem treino mostra estado vazio", emptyStudent.hasEmpty && emptyStudent.cardCount === 0);

  await openTreinos(`/treinos?alunoId=${encodeURIComponent(alunoComTreino.id)}`);
  await clickVisible('[data-testid="treino-open"]');
  await waitFor("document.querySelector('.treino-close-button, .treinos-details-card')");
  const details = await inspectTreinos("detalhe");
  await capture("desktop-detalhe.png");
  pass("abrir detalhe de treino", details.hasDetails);
  await clickText("Fechar", ".treino-close-button, button");
  await sleep(500);

  await openMenu();
  pass("menu contextual do card abre", await exists('[data-testid="treino-actions-menu"], [role="menu"]'));
  await clickText("Cancelar", "button");
  await pressEscape();

  await openMenu();
  await clickText("Editar", '[data-testid="treino-action-edit"], [role="menuitem"], button');
  await waitFor("document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  const editModal = await inspectEditor();
  await capture("desktop-editor-edicao.png");
  pass("editar treino abre editor", editModal.hasEditor && editModal.hasStudentSelect && editModal.exerciseCount >= 1);
  pass("editor tem campos de exercicio", editModal.hasExerciseFields);
  pass("editor permite reordenacao visual", editModal.hasMoveButtons);
  await clickText("Cancelar", "button");
  await waitFor("!document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  pass("cancelar edicao fecha editor", !(await exists('[data-testid="treino-editor-modal"]')));

  await clickText("Novo treino", "button");
  await waitFor("document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  const createModal = await inspectEditor();
  await capture("desktop-editor-criacao.png");
  pass("criar primeiro/novo treino abre editor", createModal.hasEditor);
  observe("novo treino contextual nao pre-seleciona aluno", createModal.selectedStudent === "");
  await clickText("Salvar Treino", "button");
  await sleep(600);
  pass("campos invalidos exibem feedback", await pageTextIncludes("Treino incompleto"));
  await clickText("Fechar", "button");
  await waitFor("!document.querySelector('[data-testid=\"treino-editor-modal\"]')");

  await clickTemplateEntryPoint();
  await waitFor("document.querySelector('[data-testid=\"treino-template-modal\"]')");
  const templateStep = await inspectTemplates();
  await capture("desktop-modelos.png");
  pass("criar treino por modelo abre wizard", templateStep.hasTemplateModal && templateStep.hasProgress);
  await pressEscape();
  await clickText("Fechar", "button");

  await setViewport("mobile-390", 390, 844, true);
  await openTreinos(`/treinos?alunoId=${encodeURIComponent(alunoComTreino.id)}`);
  const mobile = await inspectTreinos("mobile-390");
  await capture("mobile-390-lista.png");
  pass("mobile 390 renderiza modulo", mobile.hasPage && mobile.loaded);
  pass("mobile sem overflow horizontal", Math.abs(mobile.overflowDelta) <= 1);
  await clickText("Novo treino", "button");
  await waitFor("document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  const mobileEditor = await inspectEditor();
  await capture("mobile-390-editor.png");
  pass("mobile abre editor completo", mobileEditor.hasEditor && mobileEditor.footerVisible);
  pass("mobile editor sem overflow horizontal", Math.abs(mobileEditor.overflowDelta) <= 1);
  await clickText("Fechar", "button");

  await setViewport("mobile-320", 320, 800, true);
  await openTreinos("/treinos");
  const mobile320 = await inspectTreinos("mobile-320");
  await capture("mobile-320-lista.png");
  pass("mobile 320 sem overflow horizontal", Math.abs(mobile320.overflowDelta) <= 1);

  writeEvidence();
  if (scenarios.some((item) => item.status === "FAIL") || events.exceptions.length > 0) {
    process.exitCode = 1;
  }
} finally {
  client.close();
}

async function pickStudent({ withWorkout }) {
  await openTreinos("/treinos");
  return evaluate(`(() => {
    const options = [...document.querySelectorAll('[data-testid="treinos-filter-aluno"] option')]
      .map((option) => ({ id: option.value, nome: option.textContent.trim() }))
      .filter((option) => option.id && option.id !== 'todos');
    const cardStudents = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')]
      .map((card) => card.textContent);
    if (${Boolean(withWorkout)}) {
      return options.find((option) => cardStudents.some((text) => text.includes(option.nome))) || options[0];
    }
    return options.find((option) => !cardStudents.some((text) => text.includes(option.nome))) || options.at(-1);
  })()`);
}

async function openTreinos(path) {
  await navigate(`${baseUrl}${path}`);
  const needsLogin = await evaluate("location.pathname.includes('/login') || Boolean(document.querySelector('input[type=\"email\"]'))");
  if (needsLogin) await loginIfNeeded();
  await waitForLoaded();
}

async function waitForLoaded() {
  await waitFor("document.querySelector('[data-testid=\"treinos-page\"], .treinos-page')");
  await waitFor(`(() => {
    const hasCard = document.querySelector('[data-testid="treino-mobile-card"], .treino-library-card');
    const hasEmpty = document.querySelector('[data-testid="treinos-empty-state"], .app-empty-state');
    const hasError = document.querySelector('.app-error');
    return (hasCard || hasEmpty || hasError) && !document.body.textContent.includes('Carregando treinos');
  })()`, 30000);
  await sleep(600);
}

async function inspectTreinos(name) {
  const data = await evaluate(`(() => {
    const root = document.documentElement;
    const page = document.querySelector('[data-testid="treinos-page"], .treinos-page');
    const context = document.querySelector('[data-testid="treinos-context-aluno"]');
    const visibleText = document.body.textContent || '';
    return {
      name: ${JSON.stringify(name)},
      hasPage: Boolean(page),
      loaded: !visibleText.includes('Carregando treinos'),
      hasContext: Boolean(context),
      contextText: context?.textContent.trim() || '',
      hasNewButton: [...document.querySelectorAll('button')].some((button) => button.textContent.includes('Novo treino')),
      hasTemplateButton: [...document.querySelectorAll('button')].some((button) => button.textContent.includes('modelo') || button.textContent.includes('Gerar')),
      hasEmpty: Boolean(document.querySelector('[data-testid="treinos-empty-state"], .app-empty-state')),
      hasDetails: Boolean(document.querySelector('.treino-close-button, .treinos-details-card')),
      cardCount: document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card').length,
      overflowDelta: root.scrollWidth - root.clientWidth,
      text: visibleText.slice(0, 1200)
    };
  })()`);
  snapshots.push(data);
  return data;
}

async function inspectEditor() {
  const data = await evaluate(`(() => {
    const root = document.documentElement;
    const editor = document.querySelector('[data-testid="treino-editor-modal"]');
    const studentSelect = editor?.querySelector('select');
    const footer = document.querySelector('[data-testid="treino-editor-footer"]');
    return {
      hasEditor: Boolean(editor),
      hasStudentSelect: Boolean(studentSelect),
      selectedStudent: studentSelect?.value || '',
      hasExerciseFields: Boolean(document.querySelector('[data-testid="exercise-name"]')) && Boolean(document.querySelector('[data-testid="exercise-add"]')),
      exerciseCount: document.querySelectorAll('.exercise-card, [data-testid="exercise-name"]').length,
      hasMoveButtons: [...document.querySelectorAll('button')].some((button) => /subir|descer|mover/i.test(button.textContent || button.getAttribute('aria-label') || '')),
      footerVisible: Boolean(footer && footer.getBoundingClientRect().height > 0),
      overflowDelta: root.scrollWidth - root.clientWidth
    };
  })()`);
  snapshots.push({ name: "editor", ...data });
  return data;
}

async function inspectTemplates() {
  return evaluate(`(() => ({
    hasTemplateModal: Boolean(document.querySelector('[data-testid="treino-template-modal"]')),
    hasProgress: Boolean(document.querySelector('.treino-template-progress')),
    cards: document.querySelectorAll('[data-testid="treino-template-card"], [data-testid="custom-template-card"]').length
  }))()`);
}

async function openMenu() {
  const clicked = await evaluate(`(() => {
    const visible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const card = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')].find(visible);
    const trigger = [...(card?.querySelectorAll('[data-testid="treino-actions-trigger"], .table-actions-trigger') || [])].find(visible);
    trigger?.scrollIntoView({ block: 'center', inline: 'nearest' });
    trigger?.click();
    return Boolean(trigger);
  })()`);
  if (!clicked) throw new Error("Menu de treino indisponivel.");
  await waitFor("document.querySelector('[data-testid=\"treino-actions-menu\"], [role=\"menu\"]')");
}

async function clickTemplateEntryPoint() {
  const clicked = await evaluate(`(() => {
    const normalizar = (value) => String(value || '').normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
    const button = [...document.querySelectorAll('button')]
      .find((item) => {
        const text = normalizar(item.textContent);
        return text.includes('usar modelo') || text.includes('gerar por modelo') || text.includes('modelo rapido');
      });
    button?.scrollIntoView({ block: 'center', inline: 'nearest' });
    button?.click();
    return Boolean(button);
  })()`);
  if (!clicked) throw new Error("Entrada de modelos nao encontrada.");
  await sleep(700);
}

function writeEvidence() {
  const raw = { scenarios, snapshots, events };
  writeFileSync(join(reportDir, "audit-raw.json"), JSON.stringify(raw, null, 2));
  writeFileSync(join(reportDir, "scenario-results.md"), markdownResults("Scenario Results", scenarios));
  writeFileSync(join(reportDir, "console-results.md"), [
    "# Console Results",
    "",
    `- Console events: ${events.console.length}`,
    `- Exceptions: ${events.exceptions.length}`,
    "",
  ].join("\n"));
  writeFileSync(join(reportDir, "network-results.md"), [
    "# Network Results",
    "",
    `- Requests captured: ${events.requests.length}`,
    `- Responses captured: ${events.responses.length}`,
    `- Error responses: ${events.responses.filter((item) => item.status >= 400).length}`,
    "",
  ].join("\n"));
}

function markdownResults(title, items) {
  return [`# ${title}`, "", ...items.map((item) => `- ${item.status}: ${item.name}`), ""].join("\n");
}

function pass(name, condition) {
  scenarios.push({ name, status: condition ? "PASS" : "FAIL" });
}

function observe(name, condition) {
  scenarios.push({ name, status: condition ? "OBS" : "PASS" });
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
  await navigate(`${baseUrl}/treinos`);
}

async function setViewport(name, width, height, mobile) {
  await client.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
  snapshots.push({ name, viewport: `${width}x${height}`, mobile });
}

async function capture(filename) {
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(reportDir, "screenshots", filename), Buffer.from(screenshot.data, "base64"));
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
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const element = [...document.querySelectorAll(${JSON.stringify(selector)})].find(visible);
    element?.scrollIntoView({ block: 'center', inline: 'nearest' });
    element?.click();
    return Boolean(element);
  })()`);
}

function clickText(text, selector = "button") {
  return evaluate(`(() => {
    const element = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((item) => (item.textContent || '').trim().includes(${JSON.stringify(text)}));
    element?.scrollIntoView({ block: 'center', inline: 'nearest' });
    element?.click();
    return Boolean(element);
  })()`);
}

function setInput(selector, value) {
  return evaluate(`(() => {
    const input = document.querySelector(${JSON.stringify(selector)});
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  })()`);
}

function pressEscape() {
  return client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
}

function exists(selector) {
  return evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
}

function pageTextIncludes(text) {
  return evaluate(`document.body.textContent.includes(${JSON.stringify(text)})`);
}

function locationSearch() {
  return evaluate("window.location.search");
}

async function waitFor(expression, timeout = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return true;
    await sleep(250);
  }
  throw new Error(`Timeout aguardando: ${expression}`);
}

async function evaluate(expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Erro ao avaliar expressao.");
  }
  return result.result.value;
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

async function getWebSocketUrl() {
  const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
  if (created.ok) return (await created.json()).webSocketDebuggerUrl;
  const version = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
  if (!version.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  return (await version.json()).webSocketDebuggerUrl;
}

function isRelevantRequest(url) {
  return /\/rest\/v1\/(alunos|treinos|treino_dias|treino_exercicios|workout_templates)/.test(url);
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
