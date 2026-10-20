import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = new URL(process.env.QA_BASE_URL || "http://localhost:5173");
if (!["localhost", "127.0.0.1"].includes(baseUrl.hostname)) {
  throw new Error("PAYMENT_QA_REQUIRES_LOCALHOST");
}

const viewports = [
  { width: 320, height: 800, mobile: true },
  { width: 360, height: 800, mobile: true },
  { width: 375, height: 812, mobile: true },
  { width: 390, height: 844, mobile: true },
  { width: 430, height: 932, mobile: true },
  { width: 1280, height: 800, mobile: false },
];
const evidenceDir = join("reports", "cycle-1-dashboard-responsive", "payment-modal");

const targetResponse = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
if (!targetResponse.ok) throw new Error("CHROME_CDP_UNAVAILABLE");
const target = await targetResponse.json();
const client = createClient(target.webSocketDebuggerUrl);
await client.ready;
await client.send("Page.enable");
await client.send("Runtime.enable");

const results = [];
try {
  for (const viewport of viewports) {
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await client.send("Page.navigate", { url: new URL("/financeiro", baseUrl).toString() });
    await waitFor("document.querySelector('.financeiro-page')");
    await waitFor("[...document.querySelectorAll('button')].some((button) => /Receber|Registrar pagamento/.test(button.textContent))");

    const opened = await evaluate(`(() => {
      const button = [...document.querySelectorAll('button')]
        .find((item) => item.offsetParent && /Receber|Registrar pagamento/.test(item.textContent));
      button?.click();
      return Boolean(button);
    })()`);
    if (!opened) throw new Error(`PAYMENT_TRIGGER_NOT_FOUND_${viewport.width}`);
    await waitFor("document.querySelector('.pagamento-modal')");

    const initial = await measure(viewport, "initial");
    const futureValidation = await evaluate(`(() => {
      const input = document.querySelector('.pagamento-modal input[type="date"]');
      const save = [...document.querySelectorAll('.pagamento-modal button')].find((button) => button.textContent.includes('Salvar pagamento'));
      if (!input || !save) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(input, '2099-12-31');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      save.click();
      return true;
    })()`);
    if (!futureValidation) throw new Error(`PAYMENT_VALIDATION_SETUP_FAILED_${viewport.width}`);
    await waitFor("document.querySelector('.pagamento-modal .app-error')");
    await evaluate(`(() => {
      const scroll = document.querySelector('.pagamento-modal-scroll');
      if (scroll) scroll.scrollTop = scroll.scrollHeight;
      return true;
    })()`);
    const afterValidation = await measure(viewport, "validation");
    results.push(initial, afterValidation);

    if (viewport.width === 375 || viewport.width === 1280) {
      mkdirSync(evidenceDir, { recursive: true });
      const screenshot = await client.send("Page.captureScreenshot", { format: "png", fromSurface: true });
      writeFileSync(join(evidenceDir, `payment-${viewport.width}.png`), Buffer.from(screenshot.data, "base64"));
    }

    await evaluate(`(() => {
      const cancel = [...document.querySelectorAll('.pagamento-modal button')].find((button) => button.textContent.includes('Cancelar'));
      cancel?.click();
      return Boolean(cancel);
    })()`);
    await waitFor("!document.querySelector('.pagamento-modal')");
  }
} finally {
  client.close();
}

const failures = results.flatMap((result) => result.failures.map((failure) => `${result.width}/${result.phase}: ${failure}`));
console.log(JSON.stringify({ status: failures.length ? "FAIL" : "PASS", results }, null, 2));
if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exit(1);
}

async function measure(viewport, phase) {
  const result = await evaluate(`(() => {
    const dialog = document.querySelector('.pagamento-modal');
    const scroll = document.querySelector('.pagamento-modal-scroll');
    const footer = document.querySelector('.pagamento-modal-footer');
    const save = [...document.querySelectorAll('.pagamento-modal button')].find((button) => button.textContent.includes('Salvar pagamento'));
    const cancel = [...document.querySelectorAll('.pagamento-modal button')].find((button) => button.textContent.includes('Cancelar'));
    const error = document.querySelector('.pagamento-modal .app-error');
    const rect = (element) => element ? element.getBoundingClientRect() : null;
    const fields = [...document.querySelectorAll('.pagamento-modal input, .pagamento-modal select, .pagamento-modal textarea')]
      .map((field) => rect(field));
    return {
      viewport: { width: document.documentElement.clientWidth, height: window.innerHeight },
      dialog: rect(dialog), footer: rect(footer), save: rect(save), cancel: rect(cancel), error: rect(error),
      scroll: scroll ? { clientHeight: scroll.clientHeight, scrollHeight: scroll.scrollHeight, scrollTop: scroll.scrollTop } : null,
      fields,
      documentDelta: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  })()`);
  const failures = [];
  if (!result.dialog || result.dialog.left < -1 || result.dialog.right > result.viewport.width + 1) failures.push("dialog fora da viewport");
  if (!result.footer || result.footer.bottom > result.viewport.height + 1) failures.push("rodape inacessivel");
  if (!result.save || result.save.width < 40 || result.save.height < 40) failures.push("salvar sem alvo acessivel");
  if (!result.cancel || result.cancel.width < 40 || result.cancel.height < 40) failures.push("cancelar sem alvo acessivel");
  if (result.fields.some((field) => field.left < -1 || field.right > result.viewport.width + 1)) failures.push("campo fora da viewport");
  if (Math.abs(result.documentDelta) > 1) failures.push(`overflow horizontal ${result.documentDelta}px`);
  if (phase === "validation" && !result.error) failures.push("mensagem de validacao ausente");
  return { width: viewport.width, phase, scrollable: result.scroll?.scrollHeight > result.scroll?.clientHeight, failures };
}

function createClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    message.error ? request.reject(new Error(message.error.message)) : request.resolve(message.result);
  });
  return {
    ready: new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve, { once: true });
      socket.addEventListener("error", reject, { once: true });
    }),
    send(method, params = {}) {
      const requestId = ++id;
      socket.send(JSON.stringify({ id: requestId, method, params }));
      return new Promise((resolve, reject) => pending.set(requestId, { resolve, reject }));
    },
    close: () => socket.close(),
  };
}

async function evaluate(expression) {
  const response = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text || "CDP_EVALUATION_FAILED");
  return response.result.value;
}

async function waitFor(expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(`Boolean(${expression})`)) return;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`TIMEOUT: ${expression}`);
}
