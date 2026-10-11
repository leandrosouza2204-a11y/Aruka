import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";

const handoffPath = path.resolve("scripts", "browser", "aruka-session-token-clipboard-handoff.js");
const diagnosticPath = path.resolve("scripts", "browser", "aruka-session-token-diagnostic.js");
const handoffSource = fs.readFileSync(handoffPath, "utf8");
const diagnosticSource = fs.readFileSync(diagnosticPath, "utf8");
const projectRef = "vrizeuhuhvtvbrmtvdik";
const expectedKey = `sb-${projectRef}-auth-token`;
const panelId = "aruka-secure-session-handoff";

function jwt(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.synthetic-signature`;
}

function validToken(overrides = {}) {
  return jwt({
    role: "authenticated",
    sub: "synthetic-user",
    exp: Math.floor(Date.now() / 1000) + 3600,
    iss: `https://${projectRef}.supabase.co/auth/v1`,
    ...overrides,
  });
}

class FakeElement {
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
    this.children = [];
    this.parentNode = null;
    this.style = {};
    this.listeners = new Map();
    this.textContent = "";
    this.id = "";
    this.disabled = false;
    this.removed = false;
  }

  setAttribute(name, value) { this[name] = value; }
  focus() { this.ownerDocument.activeElement = this; }

  append(...children) {
    for (const child of children) {
      child.parentNode = this;
      this.children.push(child);
    }
  }

  appendChild(child) {
    this.append(child);
    return child;
  }

  addEventListener(type, callback, options = {}) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push({ callback, once: Boolean(options.once) });
    this.listeners.set(type, listeners);
  }

  async trigger(type) {
    const listeners = [...(this.listeners.get(type) ?? [])];
    for (const listener of listeners) {
      if (listener.once) {
        this.listeners.set(type, (this.listeners.get(type) ?? []).filter((item) => item !== listener));
      }
      await listener.callback({ type, currentTarget: this });
    }
  }

  remove() {
    this.removed = true;
    if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }
}

class FakeDocument {
  constructor() {
    this.body = new FakeElement("body", this);
    this.activeElement = null;
  }

  createElement(tagName) { return new FakeElement(tagName, this); }

  getElementById(id) {
    const visit = (element) => {
      if (element.id === id) return element;
      for (const child of element.children) {
        const match = visit(child);
        if (match) return match;
      }
      return null;
    };
    return visit(this.body);
  }
}

function visibleText(element) {
  return [element.textContent, ...element.children.map(visibleText)].join(" ");
}

async function execute({
  source = handoffSource,
  origin = "https://www.aruka.com.br",
  entries,
  clipboardRejectCalls = [],
  userActive = true,
} = {}) {
  const clipboardWrites = [];
  const alerts = [];
  const timers = [];
  const document = new FakeDocument();
  const storage = new Map(entries ?? [[expectedKey, JSON.stringify({
    access_token: validToken(),
    refresh_token: "synthetic-refresh-never-read",
  })]]);
  const rejectedCalls = new Set(clipboardRejectCalls);
  let clipboardCall = 0;
  const context = {
    URL,
    TextDecoder,
    Uint8Array,
    atob: (value) => Buffer.from(value, "base64").toString("binary"),
    Array,
    Date,
    Error,
    JSON,
    Math,
    Number,
    Object,
    Set,
    document,
    localStorage: {
      get length() { return storage.size; },
      getItem: (key) => storage.get(key) ?? null,
      key: (index) => [...storage.keys()][index] ?? null,
    },
    navigator: {
      userActivation: { isActive: userActive },
      clipboard: {
        writeText: async (value) => {
          clipboardCall += 1;
          if (rejectedCalls.has(clipboardCall)) throw new Error("synthetic clipboard failure");
          clipboardWrites.push(value);
        },
      },
    },
    window: {
      location: { origin },
      alert: (message) => { alerts.push(message); },
      setTimeout: (callback, delay) => { timers.push({ callback, delay }); },
    },
  };
  vm.runInNewContext(source, context, { filename: source === handoffSource ? handoffPath : diagnosticPath });
  await new Promise((resolve) => setTimeout(resolve, 0));
  return { alerts, clipboardWrites, context, document, timers };
}

test("scripts target the Aruka session key and never log or read refresh_token", () => {
  for (const source of [handoffSource, diagnosticSource]) {
    assert.match(source, /sb-\$\{projectRef\}-auth-token/u);
    assert.match(source, /vrizeuhuhvtvbrmtvdik/u);
    assert.doesNotMatch(source, /console\./u);
    assert.doesNotMatch(source, /refresh_token/u);
  }
});

test("handoff has no network or file-transfer mechanism", () => {
  assert.doesNotMatch(handoffSource, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|FileReader/u);
});

test("valid token is not copied until the operator clicks the page button", async () => {
  const token = validToken();
  const result = await execute({ entries: [[expectedKey, JSON.stringify({ access_token: token })]] });
  const panel = result.document.getElementById(panelId);
  assert.ok(panel);
  assert.deepEqual(result.clipboardWrites, []);
  assert.equal(result.timers.length, 0);
  assert.doesNotMatch(visibleText(panel), new RegExp(token.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));

  const action = panel.children[1];
  await action.trigger("click");
  assert.deepEqual(result.clipboardWrites, [token]);
  assert.equal(result.timers.length, 1);
  assert.equal(result.timers[0].delay, 15_000);
  assert.match(panel.children[0].textContent, /^HANDOFF_ACCEPTED:/u);

  await result.timers[0].callback();
  assert.deepEqual(result.clipboardWrites, [token, ""]);
  assert.equal(result.document.getElementById(panelId), null);
});

test("missing transient user activation refuses without touching clipboard", async () => {
  const result = await execute({ userActive: false });
  const panel = result.document.getElementById(panelId);
  await panel.children[1].trigger("click");
  assert.deepEqual(result.clipboardWrites, []);
  assert.equal(panel.children[0].textContent, "HANDOFF_REFUSED:USER_ACTIVATION_REQUIRED");
});

test("clipboard write failure is sanitized and removes the temporary panel", async () => {
  const token = validToken();
  const result = await execute({
    entries: [[expectedKey, JSON.stringify({ access_token: token })]],
    clipboardRejectCalls: [1],
  });
  const panel = result.document.getElementById(panelId);
  await panel.children[1].trigger("click");
  assert.deepEqual(result.alerts, ["HANDOFF_REFUSED:CLIPBOARD_WRITE_FAILED"]);
  assert.doesNotMatch(result.alerts[0], new RegExp(token.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
  assert.equal(result.document.getElementById(panelId), null);
});

test("failed automatic clear requires a second click and then removes the panel", async () => {
  const result = await execute({ clipboardRejectCalls: [2] });
  const panel = result.document.getElementById(panelId);
  const action = panel.children[1];
  await action.trigger("click");
  await result.timers[0].callback();
  assert.equal(panel.children[0].textContent, "HANDOFF_ACTION_REQUIRED: clique para limpar o clipboard.");
  assert.equal(action.textContent, "Limpar clipboard agora");
  await action.trigger("click");
  assert.equal(result.clipboardWrites.at(-1), "");
  assert.equal(result.document.getElementById(panelId), null);
});

test("apex origin is rejected with a sanitized reason", async () => {
  const result = await execute({ origin: "https://aruka.com.br" });
  assert.deepEqual(result.clipboardWrites, []);
  assert.deepEqual(result.alerts, ["HANDOFF_REFUSED:ORIGIN_NOT_CANONICAL"]);
});

test("missing expected key distinguishes another Supabase session without revealing its key", async () => {
  const result = await execute({ entries: [["sb-abcdefghijklmnopqrst-auth-token", JSON.stringify({ access_token: validToken() })]] });
  assert.deepEqual(result.clipboardWrites, []);
  assert.deepEqual(result.alerts, ["HANDOFF_REFUSED:EXPECTED_STORAGE_KEY_ABSENT_OTHER_SUPABASE_SESSION_PRESENT"]);
  assert.doesNotMatch(result.alerts[0], /abcdefghijklmnopqrst/u);
});

test("expired and wrong-project tokens return only sanitized reasons", async () => {
  const expired = await execute({ entries: [[expectedKey, JSON.stringify({ access_token: validToken({ exp: Math.floor(Date.now() / 1000) - 60 }) })]] });
  assert.deepEqual(expired.alerts, ["HANDOFF_REFUSED:SESSION_ACCESS_TOKEN_EXPIRED"]);
  const wrongProject = await execute({ entries: [[expectedKey, JSON.stringify({ access_token: validToken({ iss: "https://abcdefghijklmnopqrst.supabase.co/auth/v1" }) })]] });
  assert.deepEqual(wrongProject.alerts, ["HANDOFF_REFUSED:SESSION_PROJECT_MISMATCH"]);
});

test("role, subject, expiration and issuer checks remain enforced", async () => {
  const cases = [
    [{ role: "anon" }, "SESSION_ROLE_INVALID"],
    [{ sub: "" }, "SESSION_SUBJECT_MISSING"],
    [{ exp: "not-a-number" }, "SESSION_EXPIRATION_INVALID"],
    [{ iss: "not-a-url" }, "SESSION_ISSUER_INVALID"],
  ];
  for (const [overrides, reason] of cases) {
    const result = await execute({
      entries: [[expectedKey, JSON.stringify({ access_token: validToken(overrides) })]],
    });
    assert.deepEqual(result.clipboardWrites, []);
    assert.deepEqual(result.alerts, [`HANDOFF_REFUSED:${reason}`]);
    assert.equal(result.document.getElementById(panelId), null);
  }
});

test("malformed session and refresh-token-shaped value return sanitized reasons", async () => {
  const malformedJson = await execute({ entries: [[expectedKey, "not-json"]] });
  assert.deepEqual(malformedJson.alerts, ["HANDOFF_REFUSED:SESSION_JSON_INVALID"]);
  const refresh = await execute({ entries: [[expectedKey, JSON.stringify({ access_token: "synthetic-refresh-token" })]] });
  assert.deepEqual(refresh.alerts, ["HANDOFF_REFUSED:SESSION_ACCESS_TOKEN_FORMAT_INVALID"]);
});

test("diagnostic reports PASS without touching clipboard or the page", async () => {
  const result = await execute({ source: diagnosticSource });
  assert.deepEqual(result.clipboardWrites, []);
  assert.deepEqual(result.alerts, ["SESSION_DIAGNOSTIC:PASS"]);
  assert.equal(result.document.body.children.length, 0);
});
