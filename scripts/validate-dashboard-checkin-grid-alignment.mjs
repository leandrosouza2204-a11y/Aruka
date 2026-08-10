const cdpPort = process.env.CDP_PORT || "9222";
const baseUrl = process.env.ARUKA_QA_BASE_URL || process.env.VITE_APP_URL || "http://localhost:5173";
const desktopWidths = [1280, 1366, 1440];
const tabletWidths = [768, 820, 1024];
const mobileWidths = [320, 360, 390, 414];

const webSocketUrl = await findAuthenticatedTarget();
const client = await createCdpClient(webSocketUrl);

await client.send("Page.enable");
await client.send("Runtime.enable");

const results = [];

for (const width of [...desktopWidths, ...tabletWidths, ...mobileWidths]) {
  const height = width >= 1024 ? 900 : 900;
  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await client.send("Page.navigate", { url: `${baseUrl}/dashboard` });
  await waitForDashboard(client);

  const result = await evaluate(client, `(() => {
    const cards = Array.from(document.querySelectorAll(".dashboard-stats-grid .dashboard-metric-card"));
    const metrics = cards.map((element, index) => {
      const box = element.getBoundingClientRect();
      return {
        index,
        text: element.innerText.split("\\n")[0],
        left: Math.round(box.left),
        right: Math.round(box.right),
        top: Math.round(box.top),
        width: Math.round(box.width),
      };
    });
    const checkin = metrics.find((metric) => /Check-in semanal/i.test(metric.text));
    const overdue = metrics.find((metric) => /Alunos Vencidos/i.test(metric.text));
    const first = metrics[0] || null;
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);

    return {
      path: location.pathname,
      viewportWidth: innerWidth,
      docWidth,
      overflow: docWidth > innerWidth + 1,
      first,
      checkin,
      overdue,
      metrics,
    };
  })()`);

  results.push({ width, ...result });
}

await client.close();

const desktopPass = results
  .filter((result) => desktopWidths.includes(result.width))
  .every((result) =>
    result.checkin &&
    result.overdue &&
    Math.abs(result.checkin.top - result.overdue.top) <= 2 &&
    Math.abs(result.checkin.width - result.overdue.width) <= 2
  );
const tabletPass = results
  .filter((result) => tabletWidths.includes(result.width))
  .every((result) => result.checkin && !result.overflow);
const mobilePass = results
  .filter((result) => mobileWidths.includes(result.width))
  .every((result) => result.checkin && !result.overflow);
const overflow = results.some((result) => result.overflow);

for (const result of results) {
  console.log(
    `CHECKIN_GRID_WIDTH=${result.width} CHECKIN_INDEX=${result.checkin?.index ?? "NA"} CHECKIN_TOP=${result.checkin?.top ?? "NA"} OVERDUE_TOP=${result.overdue?.top ?? "NA"} CHECKIN_CARD_WIDTH=${result.checkin?.width ?? "NA"} OVERDUE_CARD_WIDTH=${result.overdue?.width ?? "NA"} OVERFLOW=${result.overflow ? "YES" : "NO"}`
  );
}

console.log(`DESKTOP_CHECKIN_GRID_ALIGNMENT=${desktopPass ? "PASS" : "FAIL"}`);
console.log(`TABLET_CHECKIN_LAYOUT=${tabletPass ? "PASS" : "FAIL"}`);
console.log(`MOBILE_CHECKIN_LAYOUT=${mobilePass ? "PASS" : "FAIL"}`);
console.log(`HORIZONTAL_OVERFLOW=${overflow ? "YES" : "NO"}`);

if (!desktopPass || !tabletPass || !mobilePass || overflow) {
  process.exit(1);
}

async function findAuthenticatedTarget() {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
  if (!response.ok) throw new Error(`Chrome CDP indisponivel na porta ${cdpPort}.`);

  const targets = await response.json();
  const target = targets.find((item) => {
    const url = String(item.url || "");
    return url.startsWith(baseUrl) && !url.includes("/login") && item.webSocketDebuggerUrl;
  });

  if (!target) throw new Error("AUTHENTICATED_DASHBOARD_TARGET_NOT_FOUND");
  return target.webSocketDebuggerUrl;
}

function createCdpClient(webSocketUrl) {
  return new Promise((resolve, reject) => {
    let nextId = 0;
    const pending = new Map();
    const socket = new WebSocket(webSocketUrl);

    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          return new Promise((res, rej) => {
            const id = ++nextId;
            pending.set(id, { res, rej });
            socket.send(JSON.stringify({ id, method, params }));
          });
        },
        close() {
          socket.close();
        },
      });
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;

      const callbacks = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) callbacks.rej(new Error(message.error.message));
      else callbacks.res(message.result);
    });

    socket.addEventListener("error", () => reject(new Error("Erro no WebSocket CDP.")));
  });
}

async function waitForDashboard(client) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await evaluate(
      client,
      `Boolean(document.querySelector(".dashboard-stats-grid .checkin-card")) && !location.pathname.includes("/login")`
    );
    if (ready) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error("Timeout aguardando Dashboard autenticado.");
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  return result.result.value;
}
