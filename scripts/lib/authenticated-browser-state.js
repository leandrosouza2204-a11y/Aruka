export const DEFAULT_QA_VIEWPORT = Object.freeze({
  width: 1280,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});

export function normalizeQaStartRoute(route = "/") {
  const value = String(route || "/").trim();
  return value.startsWith("/") ? value : `/${value}`;
}

export function buildViewportConfig(viewport = {}) {
  return {
    ...DEFAULT_QA_VIEWPORT,
    ...viewport,
    width: Number(viewport.width || DEFAULT_QA_VIEWPORT.width),
    height: Number(viewport.height || DEFAULT_QA_VIEWPORT.height),
    deviceScaleFactor: Number(viewport.deviceScaleFactor || DEFAULT_QA_VIEWPORT.deviceScaleFactor),
    mobile: Boolean(viewport.mobile ?? DEFAULT_QA_VIEWPORT.mobile),
  };
}

export function buildStateResetSequence({ url, viewport, readyExpression }) {
  return [
    { action: "setViewport", viewport: buildViewportConfig(viewport) },
    { action: "navigate", url },
    { action: "waitForDocumentReady" },
    { action: "waitForAppReady", expression: readyExpression },
    { action: "closeVisibleDialogs" },
    { action: "closeOpenMenus" },
    { action: "resetScroll" },
  ];
}

export async function evaluateExpression(client, expression) {
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

export async function waitForExpression(client, expression, timeout = 15000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluateExpression(client, `Boolean(${expression})`)) return true;
    await sleep(250);
  }

  throw new Error(`Timeout aguardando: ${expression}`);
}

export async function captureQaBrowserState(client, label) {
  return evaluateExpression(
    client,
    `(() => ({
      label: ${JSON.stringify(label)},
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      modalCount: document.querySelectorAll('[role="dialog"], [role="alertdialog"], .financeiro-modal, .accessible-modal').length,
      openMenuCount: document.querySelectorAll('[role="menu"], [aria-expanded="true"]').length,
      scrollY: Math.round(window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0),
      loadingTextPresent: /Carregando|Verificando acesso/i.test(document.body.innerText || "")
    }))()`
  );
}

export function summarizeQaBrowserState(state) {
  const url = sanitizeUrl(state?.url || "");
  const viewport = state?.viewport ? `${state.viewport.width}x${state.viewport.height}` : "unknown";
  return [
    `url=${url}`,
    `viewport=${viewport}`,
    `modalCount=${state?.modalCount ?? "unknown"}`,
    `openMenuCount=${state?.openMenuCount ?? "unknown"}`,
    `scrollY=${state?.scrollY ?? "unknown"}`,
    `loadingTextPresent=${state?.loadingTextPresent ? "YES" : "NO"}`,
  ].join(" ");
}

export async function prepareAuthenticatedQaPage(client, options) {
  const {
    url,
    viewport = DEFAULT_QA_VIEWPORT,
    readyExpression = "document.readyState === 'complete'",
    readyTimeout = 15000,
  } = options;

  await client.send("Emulation.setDeviceMetricsOverride", buildViewportConfig(viewport));
  await client.send("Page.navigate", { url });
  await waitForExpression(client, "document.readyState === 'complete'", readyTimeout);
  await waitForExpression(client, readyExpression, readyTimeout);
  await closeVisibleDialogs(client);
  await closeOpenMenus(client);
  await resetScroll(client);
  await sleep(250);

  return captureQaBrowserState(client, "prepared");
}

export async function cleanupAuthenticatedQaPage(client, options = {}) {
  const { neutralUrl = "", readyExpression = "document.readyState === 'complete'" } = options;

  await closeVisibleDialogs(client);
  await closeOpenMenus(client);
  await resetScroll(client);

  if (neutralUrl) {
    await client.send("Page.navigate", { url: neutralUrl });
    await waitForExpression(client, "document.readyState === 'complete'", 15000);
    await waitForExpression(client, readyExpression, 15000);
    await closeVisibleDialogs(client);
    await closeOpenMenus(client);
    await resetScroll(client);
  }

  return captureQaBrowserState(client, "cleanup");
}

export async function closeVisibleDialogs(client) {
  await evaluateExpression(
    client,
    `(() => {
      const dialogs = [...document.querySelectorAll('[role="dialog"], [role="alertdialog"], .financeiro-modal, .accessible-modal')]
        .filter((item) => item.offsetParent !== null || getComputedStyle(item).position === 'fixed');
      if (dialogs.length === 0) return 0;
      for (let index = 0; index < Math.min(dialogs.length, 4); index += 1) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      }
      return dialogs.length;
    })()`
  );
  await sleep(250);
}

export async function closeOpenMenus(client) {
  await evaluateExpression(
    client,
    `(() => {
      const openMenus = document.querySelectorAll('[role="menu"], [aria-expanded="true"]').length;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      document.body?.click?.();
      return openMenus;
    })()`
  );
  await sleep(200);
}

export async function resetScroll(client) {
  await evaluateExpression(
    client,
    `(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      for (const item of document.querySelectorAll('.financeiro-modal-scroll, .renovacao-modal-scroll, .app-table-scroll')) {
        item.scrollTop = 0;
        item.scrollLeft = 0;
      }
      return true;
    })()`
  );
}

function sanitizeUrl(value) {
  try {
    const url = new URL(value);
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return String(value).split("?")[0].split("#")[0];
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
