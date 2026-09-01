import { writeFile } from "node:fs/promises";
import {
  buildPrecheckDecision,
  assertSameOrigin,
  getBrowserTargets,
  getCdpVersion,
  isBaseUrlReachable,
  RUNTIME_MARKERS,
  resolveRuntimeConfig,
} from "./lib/authenticated-runtime.js";
import { printReportWriteMode, shouldWriteCanonicalReport } from "./lib/report-write-mode.mjs";

const RESULT_PATH = "reports/product-roadmap-v3/cycle-01-runtime-qa-result.json";

async function main() {
  const writeReport = shouldWriteCanonicalReport();
  const config = resolveRuntimeConfig();
  const blockers = [];
  const state = {
    base_url: config.baseUrl || "",
    cdp_url: config.cdpUrl,
    auth_route: config.route,
    base_url_reachable: false,
    cdp_reachable: false,
    browser_target_found: false,
    authenticated_browser_origin_match: false,
    auth_session_present: false,
    authenticated_route_reachable: false,
    environment_blockers: blockers,
  };

  const base = await isBaseUrlReachable(config.baseUrl);
  state.base_url_reachable = base.ok;
  if (!base.ok) blockers.push(base.marker);

  const cdp = await getCdpVersion(config.cdpUrl);
  state.cdp_reachable = cdp.ok;
  if (!cdp.ok) blockers.push(cdp.marker);

  const targets = cdp.ok ? await getBrowserTargets(config.cdpUrl) : { ok: false, targets: [] };
  state.browser_target_found = targets.ok;
  if (cdp.ok && !targets.ok) blockers.push(targets.marker);

  let authenticatedTarget = targets.targets?.find((target) => {
    const url = String(target.url || "");
    return /^https?:\/\//i.test(url) && !url.includes("/login") && !url.startsWith("devtools://");
  });
  let matchingTarget = targets.targets?.find((target) => {
    const url = String(target.url || "");
    return config.baseUrl && url.startsWith(config.baseUrl) && !url.includes("/login");
  });

  if (!matchingTarget && cdp.ok && config.baseUrl) {
    const runtimeLogin = await validateLoginTarget(config);
    if (runtimeLogin.ok) {
      authenticatedTarget = runtimeLogin.target;
      matchingTarget = runtimeLogin.target;
    } else {
      blockers.push(runtimeLogin.marker || RUNTIME_MARKERS.authSessionRequired);
    }
  }

  const originMatch = authenticatedTarget ? assertSameOrigin(config.baseUrl, authenticatedTarget.url) : null;
  state.authenticated_browser_origin_match = Boolean(originMatch?.ok);
  if (authenticatedTarget && !originMatch.ok) blockers.push(RUNTIME_MARKERS.authenticatedBrowserOriginMismatch);
  state.auth_session_present = Boolean(matchingTarget);
  state.authenticated_route_reachable = Boolean(matchingTarget);

  const precheck = buildPrecheckDecision(state);
  if (precheck.decision === "BLOCKED" && !blockers.includes(precheck.marker)) blockers.push(precheck.marker);

  const result = {
    decision:
      precheck.decision === "PASS"
        ? "READY_FOR_AUTHENTICATED_RUNTIME_QA"
        : "AWAITING_AUTHENTICATED_RUNTIME_EXECUTION",
    ...state,
    runtime_precheck: precheck.decision,
    environment_blockers: [...new Set(blockers.filter(Boolean))],
    next_action:
      precheck.decision === "PASS"
        ? "RUN_AUTHENTICATED_RUNTIME_QA_SUITE"
        : "START_APP_OPEN_LOCALHOST_CDP_CHROME_AND_AUTHENTICATE_MANUALLY",
  };

  printMarker("RUNTIME_BASE_URL_REACHABLE", state.base_url_reachable);
  printMarker("CDP_REACHABLE", state.cdp_reachable);
  printMarker("BROWSER_TARGET_FOUND", state.browser_target_found);
  if (config.baseUrl) console.log(`RUNTIME_BASE_ORIGIN=${new URL(config.baseUrl).origin}`);
  console.log(`CDP_ORIGIN=${new URL(config.cdpUrl).origin}`);
  printMarker("AUTHENTICATED_BROWSER_ORIGIN_MATCH", state.authenticated_browser_origin_match);
  printMarker("AUTH_SESSION_PRESENT", state.auth_session_present);
  printMarker("AUTHENTICATED_ROUTE_REACHABLE", state.authenticated_route_reachable);
  console.log(`RUNTIME_PRECHECK=${precheck.decision}`);
  if (result.environment_blockers.length) console.log(`RUNTIME_BLOCKERS=${result.environment_blockers.join("|")}`);

  printReportWriteMode(writeReport);
  if (writeReport) await writeFile(RESULT_PATH, `${JSON.stringify(result, null, 2)}\n`);
  if (precheck.decision !== "PASS") process.exitCode = 2;
}

async function validateLoginTarget(config) {
  if (!process.env.QA_USER_EMAIL || !process.env.QA_USER_PASSWORD) {
    return { ok: false, marker: RUNTIME_MARKERS.authSessionRequired };
  }

  const targetResponse = await fetch(`${config.cdpUrl}/json/new?${encodeURIComponent(buildUrl(config.baseUrl, config.route))}`, {
    method: "PUT",
  });
  if (!targetResponse.ok) return { ok: false, marker: RUNTIME_MARKERS.cdpUnavailable };
  const target = await targetResponse.json();
  if (!target.webSocketDebuggerUrl) return { ok: false, marker: RUNTIME_MARKERS.cdpUnavailable };

  const client = await createCdpClient(target.webSocketDebuggerUrl);
  try {
    await waitFor(client, "document.readyState === 'complete'", 15000);
    let state = await getAuthState(client);
    if (state.hasLoginForm || state.path.includes("/login")) {
      await fillAndSubmitLogin(client);
      await sleep(5500);
      state = await getAuthState(client);
    }
    if (state.path.includes("/login") || state.path.includes("/assinatura-pendente") || state.path.includes("/aceite-legal")) {
      return { ok: false, marker: RUNTIME_MARKERS.authSessionRequired };
    }
    await client.send("Page.navigate", { url: buildUrl(config.baseUrl, config.route) });
    await waitFor(client, "document.readyState === 'complete'", 15000);
    await sleep(750);
    state = await getAuthState(client);
    if (state.path.includes("/login") || state.path.includes("/assinatura-pendente") || state.path.includes("/aceite-legal")) {
      return { ok: false, marker: RUNTIME_MARKERS.authRouteFailure };
    }
    return {
      ok: true,
      target: {
        ...target,
        url: buildUrl(config.baseUrl, state.path || config.route),
      },
    };
  } finally {
    client.close();
  }
}

async function fillAndSubmitLogin(client) {
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
      setValue(email, ${JSON.stringify(process.env.QA_USER_EMAIL || "")});
      setValue(password, ${JSON.stringify(process.env.QA_USER_PASSWORD || "")});
      const button = [...document.querySelectorAll('button[type="submit"], button')]
        .find((item) => /entrar/i.test(item.textContent || ""));
      if (!button) return false;
      button.click();
      return true;
    })()`,
  );
  if (!filled) throw new Error("AUTHENTICATED_PRECHECK_LOGIN_FORM_UNAVAILABLE");
}

async function getAuthState(client) {
  return evaluate(
    client,
    `(() => ({
      path: window.location.pathname,
      hasLoginForm: Boolean(document.querySelector('input[type="email"], input[type="password"]'))
    }))()`,
  );
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Erro ao avaliar expressao.");
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

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let nextId = 1;
  const pending = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    const callback = pending.get(message.id);
    if (!callback) return;
    pending.delete(message.id);
    if (message.error) callback.reject(new Error(message.error.message));
    else callback.resolve(message.result || {});
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((commandResolve, commandReject) => {
            pending.set(id, { resolve: commandResolve, reject: commandReject });
          });
        },
        close() {
          socket.close();
        },
      });
    });
    socket.addEventListener("error", () => reject(new Error("CDP WebSocket indisponivel.")), { once: true });
  });
}

function buildUrl(baseUrl, route) {
  return `${String(baseUrl || "").replace(/\/+$/, "")}${String(route || "/").startsWith("/") ? route : `/${route}`}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printMarker(name, value) {
  console.log(`${name}=${value ? "YES" : "NO"}`);
}

main().catch((error) => {
  console.error(`RUNTIME_PRECHECK=BLOCKED`);
  console.error(String(error?.message || error));
  process.exit(2);
});
