import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const mobileViewports = [
  { name: "320", width: 320, height: 800, mobile: true },
  { name: "360", width: 360, height: 800, mobile: true },
  { name: "375", width: 375, height: 812, mobile: true },
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "412", width: 412, height: 915, mobile: true },
  { name: "430", width: 430, height: 932, mobile: true },
];

const landscapeViewports = [
  { name: "800x360", width: 800, height: 360, mobile: true },
  { name: "844x390", width: 844, height: 390, mobile: true },
  { name: "915x412", width: 915, height: 412, mobile: true },
];

const desktopViewports = [
  { name: "1024", width: 1024, height: 768, mobile: false },
  { name: "1366", width: 1366, height: 768, mobile: false },
  { name: "1440", width: 1440, height: 900, mobile: false },
];

const cdpPort = process.env.CDP_PORT || "9222";
const chromeVersionUrl = `http://127.0.0.1:${cdpPort}/json/version`;
const chromeNewTargetUrl = `http://127.0.0.1:${cdpPort}/json/new`;
const appUrl = "http://127.0.0.1:5173/alunos";
const screenshotDir = join("tmp-responsive-screenshots", "aluno-form-mobile");
const tolerance = 1;

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
  if (!versionResponse.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);
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
    const description =
      result.exceptionDetails.exception?.description ||
      result.exceptionDetails.exception?.value ||
      result.exceptionDetails.text ||
      "Erro ao avaliar expressao.";
    throw new Error(description);
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
      const item = [...document.querySelectorAll(${JSON.stringify(selector)})]
        .find((element) => element.textContent.trim().includes(${JSON.stringify(text)}));
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
    `(() => ({
      path: window.location.pathname,
      hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]')),
      publicMessage: ([...document.querySelectorAll('p, [role="alert"], .app-alert')]
        .map((item) => item.textContent.trim())
        .find((text) => /erro|invalid|senha|credenciais|login|auth|nao|falha|failed/i.test(text)) || "").slice(0, 240)
    }))()`
  );
}

async function openCadastro(client) {
  await waitFor(
    client,
    "document.querySelector('[data-testid=\"aluno-new-button\"]') || [...document.querySelectorAll('button, a')].some((element) => /novo aluno/i.test(element.textContent.trim()))",
    20000
  );
  const opened = await evaluate(
    client,
    `(() => {
      const button = [...document.querySelectorAll('button, a')]
        .find((element) =>
          element.matches('[data-testid="aluno-new-button"]') ||
          /novo aluno/i.test(element.textContent.trim())
        );
      if (!button) return false;
      button.scrollIntoView({ block: 'center', inline: 'nearest' });
      button.click();
      return true;
    })()`
  );
  if (!opened) throw new Error("Botao Novo Aluno nao encontrado.");
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
  await sleep(350);
}

async function openEdicao(client) {
  await client.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await client.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27 });
  await waitFor(
    client,
    "document.querySelector('[data-testid=\"aluno-mobile-card\"], .aluno-mobile-card, .desktop-table tbody tr')",
    20000
  );
  await sleep(500);
  const opened = await evaluate(
    client,
    `(() => {
      const visible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
      };
      const cards = [...document.querySelectorAll('[data-testid="aluno-mobile-card"], .aluno-mobile-card')].filter(visible);
      const rows = [...document.querySelectorAll('.desktop-table tbody tr')].filter(visible);
      const source = cards[0] || rows[0];
      const trigger = source?.querySelector('[data-testid="aluno-actions-trigger"], .table-actions-trigger');
      trigger?.scrollIntoView({ block: 'center', inline: 'nearest' });
      if (trigger) trigger.setAttribute('data-qa-edit-target', 'true');
      return Boolean(trigger);
    })()`
  );
  if (!opened) throw new Error("Nao foi possivel localizar menu de edicao do aluno.");
  await sleep(350);
  const clicked = await evaluate(
    client,
    `(() => {
      const trigger = document.querySelector('[data-qa-edit-target="true"]');
      trigger?.click();
      trigger?.removeAttribute('data-qa-edit-target');
      return Boolean(trigger);
    })()`
  );
  if (!clicked) throw new Error("Nao foi possivel abrir menu de edicao do aluno.");
  await sleep(300);
  if (!(await clickText(client, "Editar", '[data-testid="aluno-action-edit"], [role="menuitem"], button'))) {
    throw new Error("Acao Editar nao encontrada.");
  }
  await waitFor(client, "document.querySelector('[data-testid=\"aluno-form-modal\"]')");
  await sleep(450);
}

async function fillCadastroWithoutSaving(client) {
  return evaluate(
    client,
    `(() => {
      const setInput = (selector, value) => {
        const input = document.querySelector(selector);
        if (!input) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        setter.call(input, value);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      const setSelect = (selector) => {
        const select = document.querySelector(selector);
        if (!select || select.options.length < 2) return false;
        const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set;
        setter.call(select, select.options[1].value);
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      };
      return {
        nome: setInput('[data-testid="aluno-name"]', 'QA Mobile Sem Salvar'),
        telefone: setInput('[data-testid="aluno-phone"]', '(11) 99999-9999'),
        nascimento: setInput('[data-testid="aluno-birth-date"]', '1990-01-01'),
        inicio: setInput('[data-testid="aluno-plan-start"]', '2026-07-13'),
        plano: setSelect('[data-testid="aluno-plan"]')
      };
    })()`
  );
}

async function alterEditThenCancel(client) {
  return evaluate(
    client,
    `(() => {
      const input = document.querySelector('[data-testid="aluno-name"]');
      if (!input) return null;
      const original = input.value;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, original + ' QA');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      return original;
    })()`
  );
}

async function measureForm(client, viewport, mode, phase) {
  return evaluate(
    client,
    `(() => {
      const root = document.documentElement;
      const body = document.body;
      const dialog = document.querySelector('[data-testid="aluno-form-modal"]') || document.querySelector('[role="dialog"]');
      const scrollContainer = dialog?.querySelector('[data-testid="aluno-form-scroll"], .aluno-form-scroll');
      const footer = dialog?.querySelector('[data-testid="aluno-form-footer"]');
      const form = dialog?.querySelector('form');
      const fields = [...(dialog?.querySelectorAll('input, select, textarea, button') || [])];
      const lastField = fields.at(-1);
      const footerRect = footer?.getBoundingClientRect();
      const lastRect = lastField?.getBoundingClientRect();
      const viewportWidth = root.clientWidth;
      const overflowing = [...document.querySelectorAll('body *')]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            id: element.id || '',
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
            minWidth: style.minWidth,
            maxWidth: style.maxWidth,
            overflowX: style.overflowX,
            overflowY: style.overflowY,
            position: style.position
          };
        })
        .filter(({ left, right, width }) => left < -1 || right > viewportWidth + 1 || width > viewportWidth + 1)
        .slice(0, 12);
      return {
        viewportName: ${JSON.stringify(viewport.name)},
        mode: ${JSON.stringify(mode)},
        phase: ${JSON.stringify(phase)},
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
          visualViewportHeight: window.visualViewport?.height || null
        },
        document: {
          clientWidth: root.clientWidth,
          scrollWidth: root.scrollWidth,
          deltaWidth: root.scrollWidth - root.clientWidth
        },
        body: {
          clientWidth: body.clientWidth,
          scrollWidth: body.scrollWidth,
          deltaWidth: body.scrollWidth - body.clientWidth,
          overflow: getComputedStyle(body).overflow
        },
        dialog: dialog ? {
          clientWidth: dialog.clientWidth,
          scrollWidth: dialog.scrollWidth,
          clientHeight: dialog.clientHeight,
          scrollHeight: dialog.scrollHeight,
          deltaWidth: dialog.scrollWidth - dialog.clientWidth,
          overflowX: getComputedStyle(dialog).overflowX,
          overflowY: getComputedStyle(dialog).overflowY
        } : null,
        scrollContainer: scrollContainer ? {
          clientWidth: scrollContainer.clientWidth,
          scrollWidth: scrollContainer.scrollWidth,
          clientHeight: scrollContainer.clientHeight,
          scrollHeight: scrollContainer.scrollHeight,
          scrollTop: Math.round(scrollContainer.scrollTop),
          maxScroll: scrollContainer.scrollHeight - scrollContainer.clientHeight,
          deltaWidth: scrollContainer.scrollWidth - scrollContainer.clientWidth,
          overflowY: getComputedStyle(scrollContainer).overflowY,
          minHeight: getComputedStyle(scrollContainer).minHeight
        } : null,
        form: form ? {
          clientWidth: form.clientWidth,
          scrollWidth: form.scrollWidth,
          deltaWidth: form.scrollWidth - form.clientWidth
        } : null,
        footerVisible: footerRect ? footerRect.bottom <= window.innerHeight + 1 && footerRect.left >= -1 && footerRect.right <= viewportWidth + 1 : null,
        lastFieldVisible: lastRect ? lastRect.bottom <= window.innerHeight + 1 && lastRect.left >= -1 && lastRect.right <= viewportWidth + 1 : null,
        fieldCount: fields.length,
        title: dialog?.querySelector('h2')?.textContent.trim() || "",
        overflowing
      };
    })()`
  );
}

async function scrollFormToEnd(client) {
  return evaluate(
    client,
    `(() => {
      const scrollContainer = document.querySelector('[data-testid="aluno-form-scroll"], .aluno-form-scroll');
      if (!scrollContainer) return false;
      scrollContainer.scrollTop = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      return Math.abs(scrollContainer.scrollTop - (scrollContainer.scrollHeight - scrollContainer.clientHeight)) <= 2;
    })()`
  );
}

async function focusKeyboardScenario(client) {
  return evaluate(
    client,
    `(() => {
      const input = document.querySelector('[data-testid="aluno-value"], [data-testid="aluno-plan-start"], [data-testid="aluno-phone"]');
      if (!input) return false;
      input.focus();
      input.scrollIntoView({ block: 'center', inline: 'nearest' });
      return document.activeElement === input;
    })()`
  );
}

async function captureScreenshot(client, filename) {
  mkdirSync(screenshotDir, { recursive: true });
  const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  writeFileSync(join(screenshotDir, filename), Buffer.from(screenshot.data, "base64"));
}

function validateMeasurement(item) {
  const failures = [];
  for (const [label, delta] of [
    ["document", item.document.deltaWidth],
    ["body", item.body.deltaWidth],
    ["dialog", item.dialog?.deltaWidth],
    ["scrollContainer", item.scrollContainer?.deltaWidth],
    ["form", item.form?.deltaWidth],
  ]) {
    if (delta !== undefined && delta !== null && Math.abs(delta) > tolerance) {
      failures.push(`${label} delta horizontal ${delta}px`);
    }
  }
  if (!item.dialog) failures.push("dialog nao encontrado");
  if (!item.scrollContainer) failures.push("area rolavel nao encontrada");
  if (item.footerVisible !== true) failures.push("rodape nao visivel");
  if (item.fieldCount < 8) failures.push(`campos insuficientes: ${item.fieldCount}`);
  if (item.body.overflow !== "hidden") failures.push("body nao esta bloqueado atras do modal");
  if (item.overflowing.length > 0) failures.push(`${item.overflowing.length} elemento(s) excedendo viewport`);
  return failures;
}

function summarize(results) {
  return results.map((item) => ({
    viewport: `${item.viewport.width}x${item.viewport.height}`,
    mode: item.mode,
    phase: item.phase,
    document: `${item.document.clientWidth}/${item.document.scrollWidth}`,
    body: `${item.body.clientWidth}/${item.body.scrollWidth}`,
    dialog: item.dialog ? `${item.dialog.clientWidth}/${item.dialog.scrollWidth}` : null,
    scroll: item.scrollContainer ? `${item.scrollContainer.clientWidth}/${item.scrollContainer.scrollWidth} top ${item.scrollContainer.scrollTop}/${item.scrollContainer.maxScroll}` : null,
    footerVisible: item.footerVisible,
    fieldCount: item.fieldCount,
    status: item.failures.length === 0 ? "ok" : "falhou",
    failures: item.failures,
  }));
}

async function runScenario(client, viewport, mode, screenshotPrefix, full = true) {
  try {
    await client.send("Page.navigate", { url: appUrl });
    await waitFor(client, "document.readyState === 'complete'");
    await waitFor(client, "document.querySelector('[data-page=\"alunos\"], .alunos-page')");
    await waitFor(client, "!document.body.textContent.includes('Carregando alunos')");
    await sleep(900);
    if (mode === "cadastro") await openCadastro(client);
    else await openEdicao(client);

    const initial = await measureForm(client, viewport, mode, "inicio");
    initial.failures = validateMeasurement(initial);
    await captureScreenshot(client, `${screenshotPrefix}-inicio.png`);

    if (mode === "cadastro" && full) {
      await clickText(client, "Salvar", '[data-testid="aluno-form-submit"], button');
      await sleep(500);
      const validation = await measureForm(client, viewport, mode, "validacoes");
      validation.failures = validateMeasurement(validation);
      await captureScreenshot(client, `${screenshotPrefix}-validacoes.png`);
    }

    if (mode === "cadastro") await fillCadastroWithoutSaving(client);
    else await alterEditThenCancel(client);
    await scrollFormToEnd(client);
    await sleep(300);
    const final = await measureForm(client, viewport, mode, "final");
    final.failures = validateMeasurement(final);
    await captureScreenshot(client, `${screenshotPrefix}-final.png`);

    if (mode === "cadastro" && viewport.name === "390") {
      await focusKeyboardScenario(client);
      await sleep(300);
      await captureScreenshot(client, "cadastro-390-teclado.png");
    }

    await clickText(client, "Cancelar", '[data-testid="aluno-form-cancel"], button');
    await waitFor(client, "!document.querySelector('[data-testid=\"aluno-form-modal\"]')");
    return full && mode === "cadastro" ? [initial, final] : [initial, final];
  } catch (error) {
    throw new Error(`${mode} ${viewport.width}x${viewport.height}: ${error.message}`);
  }
}

async function run() {
  const client = createCdpClient(await getWebSocketUrl());
  await client.ready;
  try {
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await client.send("Page.navigate", { url: appUrl });
    await waitFor(client, "document.readyState === 'complete'");
    await sleep(2000);
    const auth = await loginIfNeeded(client);
    console.log(auth === "logged-in" ? "Autenticacao QA realizada com sucesso." : "Sessao QA existente reaproveitada.");

    const results = [];
    for (const viewport of mobileViewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      results.push(...(await runScenario(client, viewport, "cadastro", `cadastro-${viewport.name}`, viewport.name === "320")));
      if (["320", "390"].includes(viewport.name)) {
        results.push(...(await runScenario(client, viewport, "edicao", `edicao-${viewport.name}`, false)));
      }
    }
    for (const viewport of landscapeViewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      const prefix = viewport.name === "844x390" ? "cadastro-paisagem-844x390" : `cadastro-paisagem-${viewport.name}`;
      results.push(...(await runScenario(client, viewport, "cadastro", prefix, false)));
      if (viewport.name === "844x390") {
        results.push(...(await runScenario(client, viewport, "edicao", "edicao-paisagem-844x390", false)));
      }
    }
    for (const viewport of desktopViewports) {
      await client.send("Emulation.setDeviceMetricsOverride", {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      const cadastroPrefix = viewport.name === "1366" ? "cadastro-desktop-1366" : `cadastro-desktop-${viewport.name}`;
      results.push(...(await runScenario(client, viewport, "cadastro", cadastroPrefix, false)));
      if (viewport.name === "1366") {
        results.push(...(await runScenario(client, viewport, "edicao", "edicao-desktop-1366", false)));
      }
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
