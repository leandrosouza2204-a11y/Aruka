import { spawn } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { stopOwnedProcessTree } from "./qa-process-cleanup.mjs";

const DEFAULT_CHROME = process.platform === "win32"
  ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  : "google-chrome";

export function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function startViteQaServer({
  cwd = process.cwd(),
  port,
  env = {},
  attempts = 2,
  timeoutMs = 30_000,
  spawnProcess = spawn,
  fetchPage = fetch,
} = {}) {
  if (!Number.isInteger(port)) throw new Error("port is required for Vite QA startup");
  const baseUrl = `http://127.0.0.1:${port}`;
  const history = [];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const output = [];
    const child = spawnProcess(process.execPath, [join("node_modules", "vite", "bin", "vite.js"), "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
      cwd,
      env: { ...process.env, ...env },
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout?.on("data", (chunk) => output.push(String(chunk)));
    child.stderr?.on("data", (chunk) => output.push(String(chunk)));
    const started = Date.now();
    let lastError;
    while (Date.now() - started < timeoutMs) {
      if (child.exitCode !== null) {
        lastError = new Error(`Vite exited before readiness with code ${child.exitCode}.`);
        lastError.code = "QA_VITE_EARLY_EXIT";
        break;
      }
      try {
        const [documentResponse, entryResponse] = await Promise.all([
          fetchPage(baseUrl, { cache: "no-store" }),
          fetchPage(`${baseUrl}/src/main.jsx`, { cache: "no-store" }),
        ]);
        const html = documentResponse.ok ? await documentResponse.text() : "";
        if (documentResponse.ok && entryResponse.ok && /id=["']root["']/.test(html)) {
          history.push({ attempt, status: "PASS", phase: "http-and-entry-ready", elapsed_ms: Date.now() - started });
          return { child, baseUrl, attempts: history };
        }
        lastError = new Error(`Vite readiness returned HTTP ${documentResponse.status}/${entryResponse.status}.`);
        lastError.code = "QA_VITE_HTTP_NOT_READY";
      } catch (error) {
        lastError = error;
      }
      await sleep(200);
    }
    history.push({ attempt, status: "TRANSIENT_FAIL", phase: lastError?.code || "timeout", elapsed_ms: Date.now() - started, output: output.join("").slice(-4000) });
    stopOwnedProcessTree(child);
    if (attempt < attempts) await sleep(250 * attempt);
  }
  const error = new Error(`Vite did not reach HTTP + entry-module readiness after ${attempts} attempts.`);
  error.code = "QA_VITE_STARTUP_FAILED";
  error.attempts = history;
  throw error;
}

export async function waitForViteStop(baseUrl, { timeoutMs = 15_000, fetchPage = fetch } = {}) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try { await fetchPage(baseUrl, { cache: "no-store" }); } catch { return; }
    await sleep(150);
  }
  const error = new Error(`Vite endpoint ${baseUrl} remained reachable after shutdown.`);
  error.code = "QA_VITE_STOP_TIMEOUT";
  throw error;
}

export async function removeQaProfileDir(path, {
  remove = (target) => rmSync(target, { recursive: true, force: true }),
  retryDelaysMs = [250, 500, 1_000, 1_500, 2_500, 4_000],
  pathExists = existsSync,
} = {}) {
  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    try {
      remove(path);
      if (pathExists(path)) throw Object.assign(new Error(`QA profile still exists after removal: ${path}`), { code: "EBUSY" });
      return { attempts: attempt + 1 };
    } catch (error) {
      const transient = ["EPERM", "EACCES", "EBUSY"].includes(error?.code);
      if (!transient || attempt === retryDelaysMs.length) throw error;
      await sleep(retryDelaysMs[attempt]);
    }
  }
  throw new Error("Unreachable QA profile cleanup state.");
}

export async function startChromeQa({
  cdpPort,
  profileDir,
  chromePath = DEFAULT_CHROME,
  attempts = 2,
  timeoutMs = 15_000,
  spawnProcess = spawn,
  fetchPage = fetch,
} = {}) {
  if (!existsSync(chromePath)) throw Object.assign(new Error(`Chrome not found at ${chromePath}`), { code: "QA_CHROME_MISSING" });
  const history = [];
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const child = spawnProcess(chromePath, [
      "--headless=new", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--no-first-run",
      `--user-data-dir=${profileDir}`, `--remote-debugging-port=${cdpPort}`, "about:blank",
    ], { stdio: "ignore", shell: false, windowsHide: true });
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (child.exitCode !== null) break;
      try {
        const response = await fetchPage(`http://127.0.0.1:${cdpPort}/json/version`, { cache: "no-store" });
        const payload = response.ok ? await response.json() : null;
        if (payload?.webSocketDebuggerUrl) {
          history.push({ attempt, status: "PASS", phase: "cdp-ready", elapsed_ms: Date.now() - started });
          return { child, attempts: history };
        }
      } catch { /* transient CDP startup */ }
      await sleep(150);
    }
    history.push({ attempt, status: "TRANSIENT_FAIL", phase: child.exitCode === null ? "timeout" : "early-exit", elapsed_ms: Date.now() - started });
    stopOwnedProcessTree(child);
    if (attempt < attempts) await sleep(250 * attempt);
  }
  const error = new Error(`Chrome CDP did not become ready after ${attempts} attempts.`);
  error.code = "QA_CHROME_STARTUP_FAILED";
  error.attempts = history;
  throw error;
}

export async function getCdpWebSocketUrl(cdpPort) {
  const response = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: "PUT" });
  if (!response.ok) throw new Error(`Unable to create CDP target: HTTP ${response.status}`);
  return (await response.json()).webSocketDebuggerUrl;
}

export function createCdpClient(url) {
  const socket = new WebSocket(url);
  let nextId = 1;
  const pending = new Map();
  const events = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) { events.push(message); return; }
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    message.error ? item.reject(new Error(`${item.method}: ${message.error.message}`)) : item.resolve(message.result);
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
    takeEvent(method) {
      const index = events.findIndex((event) => event.method === method);
      return index < 0 ? undefined : events.splice(index, 1)[0];
    },
    close() { socket.close(); },
  };
}

export async function evaluateCdp(client, expression) {
  const result = await client.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    const error = new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Browser evaluation failed.");
    error.code = "QA_BROWSER_EVALUATION_FAILED";
    throw error;
  }
  return result.result.value;
}

export async function waitForBrowserReadiness({
  probe,
  retryTransient,
  timeoutMs = 30_000,
  pollMs = 150,
  maxTransientRetries = 1,
} = {}) {
  const attempts = [];
  for (let attempt = 1; attempt <= maxTransientRetries + 1; attempt += 1) {
    const started = Date.now();
    let state;
    while (Date.now() - started < timeoutMs) {
      state = await probe();
      if (state?.ready) {
        attempts.push({ attempt, status: "PASS", phase: state.phase || "app-ready", elapsed_ms: Date.now() - started });
        return { attempts, state };
      }
      if (state?.fatal) {
        const error = new Error(state.message || "Browser reported a fatal product/runtime error.");
        error.code = "QA_BROWSER_FATAL";
        error.attempts = [...attempts, { attempt, status: "FAIL", phase: state.phase || "fatal" }];
        throw error;
      }
      await sleep(pollMs);
    }
    state ||= {};
    const transient = state.phase === "react-mount-empty" || state.phase === "document-loading";
    attempts.push({ attempt, status: transient ? "TRANSIENT_FAIL" : "FAIL", phase: state.phase || "readiness-timeout", elapsed_ms: Date.now() - started });
    if (!transient || attempt > maxTransientRetries) {
      const error = new Error(`Browser application readiness failed in phase ${state.phase || "unknown"}.`);
      error.code = transient ? "QA_BROWSER_STARTUP_TRANSIENT_EXHAUSTED" : "QA_BROWSER_READINESS_FAILED";
      error.attempts = attempts;
      throw error;
    }
    await retryTransient({ attempt, state });
  }
  throw new Error("Unreachable browser readiness state.");
}

export async function navigateWithReactReadiness(client, url, readyExpression, options = {}) {
  await client.send("Page.navigate", { url });
  return waitForBrowserReadiness({
    ...options,
    retryTransient: async () => client.send("Page.reload", { ignoreCache: true }),
    probe: async () => evaluateCdp(client, `(() => {
      const ready = Boolean(${readyExpression});
      const root = document.querySelector('#root');
      const fatalText = document.body?.innerText?.match(/Unexpected Application Error|Failed to fetch dynamically imported module/i)?.[0] || '';
      return {
        ready,
        fatal: Boolean(fatalText),
        message: fatalText,
        phase: ready ? 'react-ready' : (document.readyState === 'loading' ? 'document-loading' : (!root || root.childElementCount === 0 ? 'react-mount-empty' : 'functional-readiness-pending'))
      };
    })()`),
  });
}
