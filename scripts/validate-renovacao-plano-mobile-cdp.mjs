import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const viewports = [
  { name: "retrato-320", width: 320, height: 800, orientation: "portrait" },
  { name: "retrato-360", width: 360, height: 800, orientation: "portrait" },
  { name: "retrato-375", width: 375, height: 812, orientation: "portrait" },
  { name: "retrato-390", width: 390, height: 844, orientation: "portrait" },
  { name: "retrato-412", width: 412, height: 915, orientation: "portrait" },
  { name: "retrato-430", width: 430, height: 932, orientation: "portrait" },
  { name: "paisagem-800x360", width: 800, height: 360, orientation: "landscape" },
  { name: "paisagem-844x390", width: 844, height: 390, orientation: "landscape" },
  { name: "paisagem-915x412", width: 915, height: 412, orientation: "landscape" },
  { name: "desktop-1024x768", width: 1024, height: 768, orientation: "desktop" },
  { name: "desktop-1366x768", width: 1366, height: 768, orientation: "desktop" },
  { name: "desktop-1440x900", width: 1440, height: 900, orientation: "desktop" },
];

const tolerance = 1;
const cdpPort = process.env.CDP_PORT || "9222";
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const appUrl = "http://127.0.0.1:5173/financeiro";
const screenshotDir = join("tmp-responsive-screenshots", "renovacao-plano");

validateQaCredentials();

async function getWebSocketUrl() {
  const targetResponse = await fetch(`${chromeNewTargetUrl}?${encodeURIComponent("about:blank")}`, {
    method: "PUT",
  });

  if (targetResponse.ok) {
    const target = await targetResponse.json();
    if (target.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
  }

  const versionResponse = await fetch(chromeVersionUrl);
  if (!versionResponse.ok) {
    throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
  }

  const version = await versionResponse.json();
  if (!version.webSocketDebuggerUrl) throw new Error("Chrome CDP sem webSocketDebuggerUrl.");
  return version.webSocketDebuggerUrl;
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
    if (message.error) {
      reject(new Error(`${method}: ${message.error.message}`));
      return;
    }
    resolve(message.result);
  });

  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(id, { method, resolve, reject });
      });
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
    throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
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

async function clickText(client, text, selector = "button") {
  return evaluate(
    client,
    `(() => {
      const items = [...document.querySelectorAll(${JSON.stringify(selector)})];
      const item = items.find((element) => element.textContent.trim().includes(${JSON.stringify(text)}));
      if (!item) return false;
      item.click();
      return true;
    })()`
  );
}

async function loginIfNeeded(client) {
  const state = await getAuthState(client);
  if (!state.path.includes("/login") && !state.hasLoginForm) return "reused";

  const filled = await evaluate(
    client,
    `(() => {
      const email = document.querySelector('input[type="email"], input[name="email"], #email, [aria-label="Email"], [aria-label="E-mail"]');
      const password = document.querySelector('input[type="password"], input[name="password"], #password, [aria-label="Senha"]');
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
    })()`
  );

  if (!filled) throw new Error(`Falha no login QA: campos nao encontrados. Rota atual: ${state.path}`);
  if (!(await clickText(client, "Entrar", 'button[type="submit"], button'))) {
    throw new Error("Falha no login QA: botao Entrar nao encontrado.");
  }

  await sleep(5500);
  const after = await getAuthState(client);
  if (after.path.includes("/login") || after.hasLoginForm) {
    throw new Error(`Falha no login QA. Rota atual: ${after.path}. Mensagem publica: ${after.publicMessage || "-"}`);
  }
  await client.send("Page.navigate", { url: appUrl });
  await waitFor(client, "document.readyState === 'complete'");
  await sleep(1500);
  return "logged-in";
}

async function getAuthState(client) {
  return evaluate(
    client,
    `(() => {
      const publicMessage = [...document.querySelectorAll('p, [role="alert"], .app-alert')]
        .map((item) => item.textContent.trim())
        .filter(Boolean)
        .find((text) => /erro|invalid|senha|credenciais|login|auth|não|nao|falha|failed/i.test(text)) || "";
      return {
        path: window.location.pathname,
        hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
        publicMessage: publicMessage.slice(0, 240)
      };
    })()`
  );
}

async function openRenovacaoModal(client) {
  let opened = await clickText(client, "Renovar plano", "button, [role='menuitem']");
  if (opened) {
    await waitFor(client, "document.querySelector('.financeiro-modal')");
    return;
  }

  const openedMenu = await evaluate(
    client,
    `(() => {
      const triggers = [...document.querySelectorAll('.financeiro-card-actions .table-actions-trigger, .financeiro-actions-inline .table-actions-trigger, .table-actions-trigger')];
      const trigger = triggers.find((item) => item.offsetParent !== null) || triggers[0];
      if (!trigger) return false;
      trigger.click();
      return true;
    })()`
  );
  if (!openedMenu) {
    const state = await getFinanceiroState(client);
    throw new Error(`Menu de acoes para renovar plano nao encontrado. Estado: ${JSON.stringify(state)}`);
  }
  await waitFor(client, "document.querySelector('[role=\"menu\"]')");
  opened = await clickText(client, "Renovar plano", "button, [role='menuitem']");
  if (!opened) {
    const state = await getFinanceiroState(client);
    throw new Error(`Acao Renovar plano nao encontrada. Estado: ${JSON.stringify(state)}`);
  }
  await waitFor(client, "document.querySelector('.financeiro-modal')");
}

async function getFinanceiroState(client) {
  return evaluate(
    client,
    `(() => ({
      path: location.pathname,
      cards: document.querySelectorAll('.financeiro-list-card, .mobile-list-card').length,
      actionTriggers: document.querySelectorAll('.table-actions-trigger').length,
      visibleButtons: [...document.querySelectorAll('button')]
        .filter((button) => button.offsetParent !== null)
        .map((button) => ({
          text: button.textContent.trim().slice(0, 60),
          aria: button.getAttribute('aria-label') || ''
        }))
        .slice(0, 40),
      bodyText: document.body.innerText.slice(0, 500)
    }))()`
  );
}

async function prepareScenario(client) {
  await evaluate(
    client,
    `(() => {
      const paymentSelect = [...document.querySelectorAll('.financeiro-modal select')]
        .find((select) => [...select.options].some((option) => option.value === 'sim') && [...select.options].some((option) => option.value === 'nao'));
      if (paymentSelect) {
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
        setter.call(paymentSelect, 'sim');
        paymentSelect.dispatchEvent(new Event('input', { bubbles: true }));
        paymentSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      const textarea = document.querySelector('.financeiro-modal textarea');
      if (textarea) {
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
        setter.call(textarea, 'Validacao QA mobile com observacao longa suficiente para exercitar quebra de linha e rolagem interna do modal de renovacao.');
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    })()`
  );
  await sleep(300);
}

async function focusFields(client) {
  return evaluate(
    client,
    `(() => {
      const fields = [...document.querySelectorAll('.financeiro-modal input, .financeiro-modal select, .financeiro-modal textarea')];
      for (const field of fields) {
        field.focus();
        field.scrollIntoView({ block: 'center', inline: 'nearest' });
      }
      return fields.length;
    })()`
  );
}

async function measure(client, viewport, phase) {
  return evaluate(
    client,
    `(() => {
      const modal = document.querySelector('.renovacao-plano-modal, .financeiro-modal, [role="dialog"]');
      const scrollContainer = modal?.querySelector('.renovacao-modal-scroll, .financeiro-modal-scroll, .accessible-modal-scroll');
      const footer = modal?.querySelector('.renovacao-modal-footer, .financeiro-modal-footer, .modal-footer');
      const fields = [...modal?.querySelectorAll('input, select, textarea') || []];
      const lastField = modal?.querySelector('textarea') || fields.at(-1);
      const cancelButton = [...modal?.querySelectorAll('button') || []].find((button) => button.textContent.includes('Cancelar'));
      const renewButton = [...modal?.querySelectorAll('button') || []].find((button) => button.textContent.includes('renovacao') || button.textContent.includes('Renovar') || button.textContent.includes('Confirmar'));
      const root = document.documentElement;
      const body = document.body;
      const viewportWidth = root.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            width: Math.round(rect.width * 100) / 100,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflowX: style.overflowX,
            position: style.position,
            transform: style.transform,
            whiteSpace: style.whiteSpace
          };
        })
        .filter(({ left, right, width }) => width > viewportWidth + 1 || right > viewportWidth + 1 || left < -1)
        .slice(0, 8);

      const visible = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return rect.top >= -1 && rect.bottom <= window.innerHeight + 1 && rect.left >= -1 && rect.right <= window.innerWidth + 1;
      };

      return {
        name: ${JSON.stringify(viewport.name)},
        width: ${viewport.width},
        height: ${viewport.height},
        orientation: ${JSON.stringify(viewport.orientation)},
        phase: ${JSON.stringify(phase)},
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          visualViewportHeight: window.visualViewport?.height ?? null
        },
        documentWidth: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          delta: root.scrollWidth - root.clientWidth
        },
        body: {
          clientHeight: body.clientHeight,
          scrollHeight: body.scrollHeight,
          scrollTop: body.scrollTop,
          overflowY: getComputedStyle(body).overflowY,
          clientWidth: body.clientWidth,
          scrollWidth: body.scrollWidth,
          deltaWidth: body.scrollWidth - body.clientWidth
        },
        modal: modal ? {
          clientHeight: modal.clientHeight,
          scrollHeight: modal.scrollHeight,
          scrollTop: modal.scrollTop,
          overflowY: getComputedStyle(modal).overflowY,
          height: getComputedStyle(modal).height,
          maxHeight: getComputedStyle(modal).maxHeight,
          clientWidth: modal.clientWidth,
          scrollWidth: modal.scrollWidth,
          deltaWidth: modal.scrollWidth - modal.clientWidth
        } : null,
        scrollContainer: scrollContainer ? {
          clientHeight: scrollContainer.clientHeight,
          scrollHeight: scrollContainer.scrollHeight,
          scrollTop: Math.round(scrollContainer.scrollTop),
          maxScroll: Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight),
          overflowY: getComputedStyle(scrollContainer).overflowY,
          clientWidth: scrollContainer.clientWidth,
          scrollWidth: scrollContainer.scrollWidth,
          deltaWidth: scrollContainer.scrollWidth - scrollContainer.clientWidth
        } : null,
        footerVisible: visible(footer),
        lastFieldVisible: visible(lastField),
        cancelVisible: visible(cancelButton),
        renewVisible: visible(renewButton),
        fieldCount: fields.length,
        overflowing
      };
    })()`
  );
}

async function scrollToEnd(client) {
  await evaluate(
    client,
    `(() => {
      const modal = document.querySelector('.financeiro-modal, [role="dialog"]');
      const scrollContainer = modal?.querySelector('.renovacao-modal-scroll, .financeiro-modal-scroll, .accessible-modal-scroll') || modal;
      if (!scrollContainer) return false;
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      return true;
    })()`
  );
  await sleep(350);
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

function validateMeasurement(item) {
  const failures = [];
  if (!item.modal) failures.push("modal nao encontrado");
  if (!item.scrollContainer) failures.push("container rolavel nao encontrado");
  if (item.scrollContainer && item.phase === "final") {
    const reached = Math.abs(item.scrollContainer.scrollTop - item.scrollContainer.maxScroll) <= tolerance;
    if (!reached) failures.push(`scrollTop ${item.scrollContainer.scrollTop} nao alcancou maxScroll ${item.scrollContainer.maxScroll}`);
  }
  for (const [label, delta] of [
    ["document", item.documentWidth.delta],
    ["body", item.body.deltaWidth],
    ["modal", item.modal?.deltaWidth],
    ["scrollContainer", item.scrollContainer?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) failures.push(`${label} delta horizontal ${delta}px`);
  }
  if (item.phase === "final") {
    if (item.footerVisible !== true) failures.push("rodape nao visivel no final");
    if (item.lastFieldVisible !== true) failures.push("ultimo campo nao visivel no final");
    if (item.cancelVisible !== true) failures.push("botao Cancelar nao visivel");
    if (item.renewVisible !== true) failures.push("botao Renovar/Confirmar nao visivel");
  }
  if (item.body.overflowY !== "hidden") failures.push(`body overflowY ${item.body.overflowY}`);
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  return failures;
}

function summarize(results) {
  return results.map((item) => ({
    name: item.name,
    phase: item.phase,
    viewport: `${item.viewport.width}x${item.viewport.height}`,
    modal: item.modal ? `${item.modal.clientHeight}/${item.modal.scrollHeight}` : null,
    scrollContainer: item.scrollContainer
      ? `${item.scrollContainer.clientHeight}/${item.scrollContainer.scrollHeight} top ${item.scrollContainer.scrollTop}/${item.scrollContainer.maxScroll}`
      : null,
    documentWidth: `${item.documentWidth.clientWidth}/${item.documentWidth.scrollWidth}`,
    footerVisible: item.footerVisible,
    lastFieldVisible: item.lastFieldVisible,
    cancelVisible: item.cancelVisible,
    renewVisible: item.renewVisible,
    status: item.failures.length === 0 ? "ok" : "falhou",
    failures: item.failures,
  }));
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    let authDone = false;
    const results = [];

    for (const viewport of viewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.orientation !== "desktop",
      });
      await client.send("Page.navigate", { url: appUrl });
      await waitFor(client, "document.readyState === 'complete'");
      await sleep(1800);
      if (!authDone) {
        const auth = await loginIfNeeded(client);
        console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");
        authDone = true;
      }
      await waitFor(client, "document.querySelector('.financeiro-page')");
      await openRenovacaoModal(client);
      await waitFor(client, "document.querySelector('.financeiro-modal select')");
      await prepareScenario(client);
      await focusFields(client);

      const initial = await measure(client, viewport, "inicio");
      initial.failures = validateMeasurement(initial).filter((failure) => !failure.includes("scrollTop"));
      results.push(initial);
      if (viewport.orientation === "portrait") {
        await captureScreenshot(client, `renovacao-${viewport.name}-inicio.png`);
      }

      await scrollToEnd(client);
      const final = await measure(client, viewport, "final");
      final.failures = validateMeasurement(final);
      results.push(final);
      const screenshotName = viewport.orientation === "portrait"
        ? `renovacao-${viewport.name}-final.png`
        : `renovacao-${viewport.name}.png`;
      await captureScreenshot(client, screenshotName);
    }

    const summary = summarize(results);
    console.log(JSON.stringify({ authenticated: true, summary }, null, 2));
    const failed = results.filter((item) => item.failures.length > 0);
    if (failed.length > 0) {
      console.error(JSON.stringify({ failed: summarize(failed) }, null, 2));
      process.exitCode = 1;
    }
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
