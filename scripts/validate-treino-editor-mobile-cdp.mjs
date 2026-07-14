import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const viewports = [
  { name: "320x800", width: 320, height: 800, mobile: true },
  { name: "360x800", width: 360, height: 800, mobile: true },
  { name: "375x812", width: 375, height: 812, mobile: true },
  { name: "390x844", width: 390, height: 844, mobile: true },
  { name: "412x915", width: 412, height: 915, mobile: true },
  { name: "430x932", width: 430, height: 932, mobile: true },
  { name: "800x360", width: 800, height: 360, mobile: true },
  { name: "844x390", width: 844, height: 390, mobile: true },
  { name: "915x412", width: 915, height: 412, mobile: true },
  { name: "768x1024", width: 768, height: 1024, mobile: true },
  { name: "820x1180", width: 820, height: 1180, mobile: true },
  { name: "1024x768", width: 1024, height: 768, mobile: false },
  { name: "1366x768", width: 1366, height: 768, mobile: false },
  { name: "1440x900", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const appUrl = "http://127.0.0.1:5173/treinos";
const screenshotDir = join("tmp-responsive-screenshots", "treino-editor-mobile");
const tolerance = 1;

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
      // Retry until Chrome finishes opening the debugging endpoint.
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
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
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

async function loginIfNeeded(client) {
  const state = await authState(client);
  if (!state.path.includes("/login") && !state.hasLoginForm) return;
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
  await clickText(client, "Entrar", 'button[type="submit"], button');
  await sleep(5500);
}

function authState(client) {
  return evaluate(client, `(() => ({ path: window.location.pathname, hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')) }))()`);
}

async function openTreinos(client) {
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(700);
  const state = await authState(client);
  if (state.path.includes("/login") || state.hasLoginForm) await loginIfNeeded(client);
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.querySelector('[data-testid=\"treinos-page\"], .treinos-page')", 25000);
  await waitFor(
    client,
    `(() => {
      const hasItems = document.querySelector('[data-testid="treino-mobile-card"], .treino-library-card');
      const hasEmpty = document.querySelector('[data-testid="treinos-empty-state"], .treinos-library-empty, .app-empty-state');
      const hasError = document.querySelector('.app-error');
      return (hasItems || hasEmpty || hasError) && !document.body.textContent.includes('Carregando treinos');
    })()`,
    30000
  );
  await sleep(700);
}

function pageState(client) {
  return evaluate(client, `(() => {
    const cards = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')];
    return {
      count: cards.length,
      ids: cards.map((card, index) => card.getAttribute('data-id') || card.dataset.testid || String(index)).slice(0, 20),
      firstTitle: cards[0]?.querySelector('h2, h3, h4, strong')?.textContent?.trim() || ''
    };
  })()`);
}

async function clickText(client, text, selector = "button") {
  return evaluate(client, `(() => {
    const item = [...document.querySelectorAll(${JSON.stringify(selector)})]
      .find((element) => element.textContent.trim().includes(${JSON.stringify(text)}));
    item?.click();
    return Boolean(item);
  })()`);
}

async function openNewEditor(client) {
  await waitFor(client, "[...document.querySelectorAll('button')].some((button) => button.textContent.includes('Novo treino'))", 25000);
  const opened = await evaluate(client, `(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    };
    const button = [...document.querySelectorAll('button')]
      .find((item) => item.textContent.includes('Novo treino') && visible(item));
    button?.scrollIntoView({ block: 'center', inline: 'nearest' });
    button?.click();
    return Boolean(button);
  })()`);
  if (!opened) throw new Error("Botao Novo treino nao encontrado.");
  await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  await sleep(350);
}

async function openEditEditor(client) {
  const target = await evaluate(client, `(() => {
    const visible = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const cards = [...document.querySelectorAll('[data-testid="treino-mobile-card"], .treino-library-card')].filter(visible);
    const card = cards[0];
    if (!card) return false;
    card.scrollIntoView({ block: 'center', inline: 'nearest' });
    const direct = [...card.querySelectorAll('button')].find((button) => button.textContent.trim().includes('Editar'));
    if (direct) {
      direct.click();
      return { openedDirect: true };
    }
    const trigger = card.querySelector('[data-testid="treino-actions-trigger"], .table-actions-trigger');
    if (trigger) {
      trigger.scrollIntoView({ block: 'center', inline: 'nearest' });
      const rect = trigger.getBoundingClientRect();
      return {
        openedDirect: false,
        x: Math.round((rect.left + rect.width / 2) * 100) / 100,
        y: Math.round((rect.top + rect.height / 2) * 100) / 100
      };
    }
    return null;
  })()`);
  if (!target) return false;
  if (!target.openedDirect) {
    await client.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: target.x, y: target.y, button: "none" });
    await client.send("Input.dispatchMouseEvent", { type: "mousePressed", x: target.x, y: target.y, button: "left", buttons: 1, clickCount: 1 });
    await client.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: target.x, y: target.y, button: "left", buttons: 0, clickCount: 1 });
  }
  const hasModal = await evaluate(client, "Boolean(document.querySelector('[data-testid=\"treino-editor-modal\"]'))");
  if (!hasModal) {
    await waitFor(client, "document.querySelector('[data-testid=\"treino-actions-menu\"], [role=\"menu\"]')", 5000);
    const opened = await evaluate(client, `(() => {
      const menuEdit = [...document.querySelectorAll('[data-testid="treino-action-edit"], [role="menuitem"], button')]
        .find((item) => item.textContent.trim().includes('Editar'));
      menuEdit?.click();
      return Boolean(menuEdit);
    })()`);
    if (!opened) return false;
  }
  await waitFor(client, "document.querySelector('[data-testid=\"treino-editor-modal\"]')");
  await sleep(350);
  return true;
}

function editorSnapshot(client) {
  return evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="treino-editor-modal"]');
    const rotina = [...modal?.querySelectorAll('label') || []]
      .find((label) => label.textContent.includes('Nome da rotina'))
      ?.querySelector('input')?.value || '';
    return {
      title: modal?.querySelector('h2')?.textContent?.trim() || '',
      rotinaLength: rotina.length,
      dayCount: modal?.querySelectorAll('.treino-editor-day-card').length || 0,
      exerciseCount: modal?.querySelectorAll('.treino-exercise-card').length || 0
    };
  })()`);
}

async function fillWithoutSaving(client, mode) {
  await evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="treino-editor-modal"]');
    const setValue = (input, value) => {
      const proto = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(input, value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const select = modal.querySelector('select');
    if (select && select.options.length > 1 && !select.value) {
      select.value = select.options[1].value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const inputs = [...modal.querySelectorAll('input:not([type="date"]), textarea')];
    inputs.slice(0, 5).forEach((input, index) => setValue(input, ${JSON.stringify(mode)} + ' QA ' + (index + 1)));
    return true;
  })()`);
  await sleep(250);
}

async function addDayIfPossible(client) {
  const added = await evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="treino-editor-modal"]');
    const inputs = [...modal.querySelectorAll('.treino-editor-day-form input')];
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    inputs.forEach((input, index) => {
      setter.call(input, index === 0 ? 'Treino QA Mobile' : 'Descricao QA mobile longa para quebra');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    const button = [...modal.querySelectorAll('button')].find((item) => item.textContent.includes('Adicionar Dia'));
    button?.click();
    return Boolean(button);
  })()`);
  if (added) await sleep(350);
}

async function scrollEditorToEnd(client) {
  await evaluate(client, `(() => {
    const scroll = document.querySelector('[data-testid="treino-editor-scroll"]');
    scroll.scrollTop = scroll.scrollHeight - scroll.clientHeight;
    return true;
  })()`);
  await sleep(300);
}

async function validateFocus(client) {
  return evaluate(client, `(() => {
    const modal = document.querySelector('[data-testid="treino-editor-modal"]');
    const scroll = document.querySelector('[data-testid="treino-editor-scroll"]');
    const fields = [...modal.querySelectorAll('input, select, textarea')].filter((field) => !field.disabled);
    const targets = [fields[0], fields[Math.floor(fields.length / 2)], fields.at(-1), modal.querySelector('textarea')].filter(Boolean);
    const results = targets.map((field) => {
      field.focus();
      field.scrollIntoView({ block: 'center', inline: 'nearest' });
      const rect = field.getBoundingClientRect();
      return {
        tag: field.tagName.toLowerCase(),
        visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
        scrollTop: scroll.scrollTop
      };
    });
    return {
      visualViewportHeight: window.visualViewport?.height || null,
      focused: results,
      allVisible: results.every((item) => item.visible)
    };
  })()`);
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
    const rectData = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        left: Math.round(rect.left * 100) / 100,
        right: Math.round(rect.right * 100) / 100,
        top: Math.round(rect.top * 100) / 100,
        bottom: Math.round(rect.bottom * 100) / 100,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        insideHorizontal: rect.left >= -${tolerance} && rect.right <= window.innerWidth + ${tolerance},
        reachable: rect.bottom <= window.innerHeight + ${tolerance}
      };
    };
    const modal = document.querySelector('[data-testid="treino-editor-modal"]');
    const scroll = document.querySelector('[data-testid="treino-editor-scroll"]');
    const footer = document.querySelector('[data-testid="treino-editor-footer"]');
    const header = document.querySelector('.treino-editor-header');
    const lastField = [...modal.querySelectorAll('input, select, textarea')].at(-1);
    const lastDay = [...modal.querySelectorAll('.treino-editor-day-card')].at(-1);
    const lastExercise = [...modal.querySelectorAll('.treino-exercise-card')].at(-1);
    const overflowing = [...document.querySelectorAll('[data-testid="treino-editor-modal"] *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { tag: element.tagName.toLowerCase(), className: String(element.className || ''), left: rect.left, right: rect.right, width: rect.width };
      })
      .filter(({ left, right, width }) => left < -1 || right > window.innerWidth + 1 || width > window.innerWidth + 1)
      .slice(0, 12);
    return {
      viewport: ${JSON.stringify(viewport.name)},
      phase: ${JSON.stringify(phase)},
      viewportSize: { width: window.innerWidth, height: window.innerHeight, visualViewportHeight: window.visualViewport?.height || null },
      document: compact(document.documentElement),
      body: compact(document.body),
      modal: compact(modal),
      scroll: compact(scroll),
      header: rectData(header),
      footer: rectData(footer),
      lastField: rectData(lastField),
      lastDay: rectData(lastDay),
      lastExercise: rectData(lastExercise),
      scrollState: scroll ? {
        top: scroll.scrollTop,
        height: scroll.scrollHeight,
        client: scroll.clientHeight,
        maxScroll: scroll.scrollHeight - scroll.clientHeight,
        reachedEnd: Math.abs(scroll.scrollTop - (scroll.scrollHeight - scroll.clientHeight)) <= ${tolerance}
      } : null,
      cancelButtonVisible: Boolean([...document.querySelectorAll('button')].find((button) => button.textContent.includes('Cancelar'))),
      savedButtonVisible: Boolean([...document.querySelectorAll('button')].find((button) => button.textContent.includes('Salvar Treino'))),
      overflowing
    };
  })()`);
}

function validate(item) {
  const failures = [];
  for (const [label, delta] of [["document", item.document?.deltaWidth], ["body", item.body?.deltaWidth], ["modal", item.modal?.deltaWidth], ["scroll", item.scroll?.deltaWidth]]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (!item.footer) failures.push("rodape ausente");
  if (item.footer && !item.footer.insideHorizontal) failures.push("rodape excede horizontalmente");
  if (!item.header) failures.push("cabecalho ausente");
  if (item.header && !item.header.insideHorizontal) failures.push("cabecalho excede horizontalmente");
  if (item.phase.includes("final") && item.scrollState && !item.scrollState.reachedEnd) failures.push(`rolagem nao atingiu o final: ${item.scrollState.top}/${item.scrollState.maxScroll}`);
  if (item.phase.includes("final") && item.lastField && !item.lastField.insideHorizontal) failures.push("ultimo campo excede horizontalmente");
  if (!item.cancelButtonVisible) failures.push("acao cancelar inacessivel");
  if (!item.savedButtonVisible) failures.push("acao salvar inacessivel");
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  item.failures = failures;
  return item;
}

async function cancelEditor(client) {
  await clickText(client, "Cancelar", "button");
  await waitFor(client, "!document.querySelector('[data-testid=\"treino-editor-modal\"]')");
}

async function captureScreenshot(client, filename) {
  if (!filename) return;
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

function screenshotName(viewport, phase) {
  const map = {
    "320x800:novo-inicio": "editor-320-novo-inicio.png",
    "320x800:novo-final": "editor-320-novo-final.png",
    "320x800:edicao-inicio": "editor-320-edicao-inicio.png",
    "320x800:edicao-final": "editor-320-edicao-final.png",
    "360x800:novo-inicio": "editor-360-novo-inicio.png",
    "360x800:novo-final": "editor-360-novo-final.png",
    "375x812:novo-inicio": "editor-375-novo-inicio.png",
    "375x812:novo-final": "editor-375-novo-final.png",
    "390x844:novo-inicio": "editor-390-novo-inicio.png",
    "390x844:novo-final": "editor-390-novo-final.png",
    "390x844:dia": "editor-390-dia.png",
    "390x844:exercicio": "editor-390-exercicio.png",
    "390x844:edicao-inicio": "editor-390-edicao-inicio.png",
    "390x844:edicao-final": "editor-390-edicao-final.png",
    "412x915:novo-inicio": "editor-412-novo-inicio.png",
    "412x915:novo-final": "editor-412-novo-final.png",
    "430x932:novo-inicio": "editor-430-novo-inicio.png",
    "430x932:novo-final": "editor-430-novo-final.png",
    "800x360:novo-final": "editor-paisagem-800x360.png",
    "844x390:novo-final": "editor-paisagem-844x390.png",
    "915x412:novo-final": "editor-paisagem-915x412.png",
    "768x1024:novo-final": "editor-tablet-768x1024.png",
    "820x1180:novo-final": "editor-tablet-820x1180.png",
    "1024x768:novo-final": "editor-desktop-1024.png",
    "1366x768:novo-final": "editor-desktop-1366.png",
    "1440x900:novo-final": "editor-desktop-1440.png",
  };
  return map[`${viewport.name}:${phase}`] || null;
}

async function runViewport(client, viewport) {
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.mobile,
  });
  await openTreinos(client);
  const before = await pageState(client);
  const results = [];

  await openNewEditor(client);
  results.push(validate(await measure(client, viewport, "novo-inicio")));
  await captureScreenshot(client, screenshotName(viewport, "novo-inicio"));
  await fillWithoutSaving(client, "novo");
  await addDayIfPossible(client);
  results.push(validate(await measure(client, viewport, "novo-preenchido")));
  if (viewport.name === "390x844") {
    await captureScreenshot(client, screenshotName(viewport, "dia"));
    const focus = await validateFocus(client);
    if (!focus.allVisible) {
      results.push({ viewport: viewport.name, phase: "teclado-foco", failures: ["campo focado nao ficou visivel"], focus, overflowing: [] });
    }
  }
  await scrollEditorToEnd(client);
  results.push(validate(await measure(client, viewport, "novo-final")));
  await captureScreenshot(client, screenshotName(viewport, "novo-final"));
  if (viewport.name === "390x844") await captureScreenshot(client, screenshotName(viewport, "exercicio"));
  await cancelEditor(client);

  const editOpened = await openEditEditor(client);
  if (editOpened) {
    const editBefore = await editorSnapshot(client);
    results.push(validate(await measure(client, viewport, "edicao-inicio")));
    await captureScreenshot(client, screenshotName(viewport, "edicao-inicio"));
    await fillWithoutSaving(client, "edicao");
    await scrollEditorToEnd(client);
    results.push(validate(await measure(client, viewport, "edicao-final")));
    await captureScreenshot(client, screenshotName(viewport, "edicao-final"));
    await cancelEditor(client);
    const reopened = await openEditEditor(client);
    if (reopened) {
      const editAfter = await editorSnapshot(client);
      if (editAfter.rotinaLength !== editBefore.rotinaLength || editAfter.dayCount !== editBefore.dayCount || editAfter.exerciseCount !== editBefore.exerciseCount) {
        results.push({ viewport: viewport.name, phase: "edicao-mutacao", failures: ["edicao cancelada alterou dados reabertos"], overflowing: [] });
      }
      await cancelEditor(client);
    }
  } else {
    results.push({ viewport: viewport.name, phase: "edicao-indisponivel", failures: ["nenhum treino existente disponivel para edicao"], overflowing: [] });
  }

  const after = await pageState(client);
  if (after.count !== before.count || JSON.stringify(after.ids) !== JSON.stringify(before.ids)) {
    results.push({ viewport: viewport.name, phase: "mutacao", failures: [`estado da listagem mudou: ${before.count} -> ${after.count}`], overflowing: [] });
  }
  return results;
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Page.navigate", { url: "http://127.0.0.1:5173/login" });
    await waitFor(client, "document.readyState === 'complete'");
    await sleep(1200);
    await loginIfNeeded(client);

    const results = [];
    for (const viewport of viewports) {
      results.push(...(await runViewport(client, viewport)));
    }

    const summary = results.map(({ viewport, phase, viewportSize, document, body, modal, scroll, header, footer, lastField, lastDay, lastExercise, scrollState, failures, overflowing, focus }) => ({
      viewport,
      phase,
      viewportSize,
      document,
      body,
      modal,
      scroll,
      header,
      footer,
      lastField,
      lastDay,
      lastExercise,
      scrollState,
      focus,
      status: failures.length === 0 ? "ok" : "falhou",
      failures,
      overflowing,
    }));
    console.log(JSON.stringify({ authenticated: true, summary }, null, 2));
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
