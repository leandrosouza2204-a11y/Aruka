const baseUrl = new URL(process.env.QA_BASE_URL || "http://localhost:5173");
if (!["localhost", "127.0.0.1"].includes(baseUrl.hostname)) throw new Error("DASHBOARD_QA_REQUIRES_LOCALHOST");

const targetResponse = await fetch(`http://127.0.0.1:9222/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" });
if (!targetResponse.ok) throw new Error("CHROME_CDP_UNAVAILABLE");
const target = await targetResponse.json();
const client = createClient(target.webSocketDebuggerUrl);
await client.ready;
await client.send("Page.enable");
await client.send("Runtime.enable");

try {
  await client.send("Emulation.setDeviceMetricsOverride", { width: 375, height: 812, deviceScaleFactor: 1, mobile: true });
  await client.send("Page.navigate", { url: new URL("/dashboard", baseUrl).toString() });
  await waitFor("document.querySelector('.coach-attention-group-toggle')");

  const initial = await evaluate(`(() => ({
    headerFirst: document.querySelector('.page-hero').getBoundingClientRect().top < document.querySelector('.dashboard-operational-section').getBoundingClientRect().top,
    groups: [...document.querySelectorAll('.coach-attention-group-toggle')].map((button) => button.getAttribute('aria-expanded')),
    contents: document.querySelectorAll('.coach-attention-group-content').length
  }))()`);
  assert(initial.headerFirst, "HEADER_NOT_FIRST");
  assert(initial.groups.length > 0 && initial.groups.every((value) => value === "false"), "GROUPS_NOT_COLLAPSED");
  assert(initial.contents === 0, "COLLAPSED_CONTENT_VISIBLE");

  await evaluate("document.querySelector('.coach-attention-group-toggle').click(); true");
  await waitFor("document.querySelector('.coach-attention-group-toggle').getAttribute('aria-expanded') === 'true'");
  const expanded = await evaluate(`(() => {
    const content = document.querySelector('.coach-attention-group-content');
    return {
      items: content.querySelectorAll('.coach-attention-queue-item').length,
      links: [...content.querySelectorAll('a')].map((link) => link.getAttribute('href')),
      hasAcknowledgement: [...content.querySelectorAll('button')].some((button) => /Marcar como visto|Visto/.test(button.textContent)),
      hasShowAll: [...content.querySelectorAll('button')].some((button) => button.textContent.includes('Ver todos'))
    };
  })()`);
  assert(expanded.items > 0 && expanded.items <= 3, "GROUP_PREVIEW_LIMIT_INVALID");
  assert(expanded.links.every((href) => href?.startsWith("/")), "ACTION_LINK_INVALID");
  assert(expanded.hasAcknowledgement, "ACKNOWLEDGEMENT_ACTION_MISSING");

  if (expanded.hasShowAll) {
    await evaluate(`(() => {
      const button = [...document.querySelectorAll('.coach-attention-group-content button')].find((item) => item.textContent.includes('Ver todos'));
      button.click(); return true;
    })()`);
    await waitFor("document.querySelectorAll('.coach-attention-group-content .coach-attention-queue-item').length > 3");
  }

  await evaluate("document.querySelector('.coach-attention-group-toggle').click(); true");
  await waitFor("!document.querySelector('.coach-attention-group-content')");
  console.log(JSON.stringify({ status: "PASS", groups: initial.groups.length, previewItems: expanded.items, showAll: expanded.hasShowAll, links: expanded.links.length }));
} finally {
  client.close();
}

function assert(condition, code) {
  if (!condition) throw new Error(code);
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
