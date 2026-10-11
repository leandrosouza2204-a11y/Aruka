void (() => {
  const projectRef = "vrizeuhuhvtvbrmtvdik";
  const canonicalOrigin = "https://www.aruka.com.br";
  const storageKey = `sb-${projectRef}-auth-token`;
  const clearAfterMilliseconds = 15_000;
  const handoffElementId = "aruka-secure-session-handoff";
  const safeReasons = new Set([
    "ORIGIN_NOT_CANONICAL",
    "EXPECTED_STORAGE_KEY_ABSENT",
    "EXPECTED_STORAGE_KEY_ABSENT_OTHER_SUPABASE_SESSION_PRESENT",
    "SESSION_JSON_INVALID",
    "SESSION_ACCESS_TOKEN_MISSING",
    "SESSION_ACCESS_TOKEN_FORMAT_INVALID",
    "SESSION_ACCESS_TOKEN_PAYLOAD_INVALID",
    "SESSION_ROLE_INVALID",
    "SESSION_SUBJECT_MISSING",
    "SESSION_EXPIRATION_INVALID",
    "SESSION_ACCESS_TOKEN_EXPIRED",
    "SESSION_ISSUER_INVALID",
    "SESSION_PROJECT_MISMATCH",
    "CLIPBOARD_API_UNAVAILABLE",
    "HANDOFF_ALREADY_ACTIVE",
  ]);

  function fail(reason) {
    throw new Error(reason);
  }

  function decodePayload(token) {
    const parts = token.split(".");
    if (parts.length !== 3 || parts.some((part) => !part)) fail("SESSION_ACCESS_TOKEN_FORMAT_INVALID");
    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
      return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))));
    } catch {
      fail("SESSION_ACCESS_TOKEN_PAYLOAD_INVALID");
    }
  }

  function notifyRefusal(reason) {
    const safeReason = safeReasons.has(reason) ? reason : "UNEXPECTED_ERROR";
    window.alert(`HANDOFF_REFUSED:${safeReason}`);
  }

  try {
    if (window.location.origin !== canonicalOrigin) fail("ORIGIN_NOT_CANONICAL");
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") fail("CLIPBOARD_API_UNAVAILABLE");
    if (document.getElementById(handoffElementId)) fail("HANDOFF_ALREADY_ACTIVE");

    const serializedSession = localStorage.getItem(storageKey);
    if (!serializedSession) {
      const otherSessionPresent = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
        .some((key) => /^sb-[a-z0-9]+-auth-token$/u.test(key || "") && key !== storageKey);
      fail(otherSessionPresent ? "EXPECTED_STORAGE_KEY_ABSENT_OTHER_SUPABASE_SESSION_PRESENT" : "EXPECTED_STORAGE_KEY_ABSENT");
    }
    let session;
    try { session = JSON.parse(serializedSession); } catch { fail("SESSION_JSON_INVALID"); }
    let accessToken = session?.access_token;
    session = null;
    if (typeof accessToken !== "string" || !accessToken) fail("SESSION_ACCESS_TOKEN_MISSING");

    const claims = decodePayload(accessToken);
    if (claims.role !== "authenticated") fail("SESSION_ROLE_INVALID");
    if (!claims.sub) fail("SESSION_SUBJECT_MISSING");
    if (!Number.isFinite(claims.exp)) fail("SESSION_EXPIRATION_INVALID");
    if (claims.exp <= Math.floor(Date.now() / 1000)) fail("SESSION_ACCESS_TOKEN_EXPIRED");
    let issuer;
    try { issuer = new URL(claims.iss); } catch { fail("SESSION_ISSUER_INVALID"); }
    if (issuer.hostname !== `${projectRef}.supabase.co` || issuer.pathname.replace(/\/$/u, "") !== "/auth/v1") {
      fail("SESSION_PROJECT_MISMATCH");
    }

    const panel = document.createElement("div");
    panel.id = handoffElementId;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Transferência protegida da sessão Aruka");
    Object.assign(panel.style, {
      position: "fixed",
      inset: "20px 20px auto auto",
      zIndex: "2147483647",
      width: "min(360px, calc(100vw - 40px))",
      padding: "16px",
      border: "2px solid #155eef",
      borderRadius: "10px",
      background: "#ffffff",
      color: "#101828",
      boxShadow: "0 8px 24px rgba(16, 24, 40, 0.24)",
      font: "14px/1.4 system-ui, sans-serif",
    });

    const message = document.createElement("p");
    message.textContent = "Sessão validada. Clique para copiar o token por no máximo 15 segundos.";
    message.style.margin = "0 0 12px";

    const action = document.createElement("button");
    action.type = "button";
    action.textContent = "Copiar token protegido";
    Object.assign(action.style, {
      width: "100%",
      padding: "10px 12px",
      border: "0",
      borderRadius: "6px",
      background: "#155eef",
      color: "#ffffff",
      cursor: "pointer",
      font: "600 14px system-ui, sans-serif",
    });

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = "Cancelar";
    Object.assign(cancel.style, {
      width: "100%",
      marginTop: "8px",
      padding: "8px 12px",
      border: "1px solid #d0d5dd",
      borderRadius: "6px",
      background: "#ffffff",
      color: "#344054",
      cursor: "pointer",
      font: "14px system-ui, sans-serif",
    });

    const destroy = () => {
      accessToken = "";
      panel.remove();
    };

    let actionMode = "copy";
    let actionPending = false;

    cancel.addEventListener("click", destroy, { once: true });
    action.addEventListener("click", async () => {
      if (navigator.userActivation && !navigator.userActivation.isActive) {
        message.textContent = "HANDOFF_REFUSED:USER_ACTIVATION_REQUIRED";
        return;
      }
      if (actionPending) return;

      actionPending = true;
      action.disabled = true;
      if (actionMode === "clear") {
        try {
          await navigator.clipboard.writeText("");
          destroy();
        } catch {
          actionPending = false;
          action.disabled = false;
          message.textContent = "HANDOFF_REFUSED:CLIPBOARD_CLEAR_FAILED";
        }
        return;
      }

      const tokenForClipboard = accessToken;
      accessToken = "";
      try {
        // The Clipboard call starts inside this click handler, before the first await.
        await navigator.clipboard.writeText(tokenForClipboard);
      } catch {
        destroy();
        window.alert("HANDOFF_REFUSED:CLIPBOARD_WRITE_FAILED");
        return;
      }

      message.textContent = "HANDOFF_ACCEPTED: cole no prompt protegido. O clipboard será limpo em 15 segundos.";
      action.textContent = "Token copiado";
      cancel.remove();

      window.setTimeout(async () => {
        try {
          await navigator.clipboard.writeText("");
          destroy();
        } catch {
          actionMode = "clear";
          actionPending = false;
          message.textContent = "HANDOFF_ACTION_REQUIRED: clique para limpar o clipboard.";
          action.disabled = false;
          action.textContent = "Limpar clipboard agora";
        }
      }, clearAfterMilliseconds);
    });

    panel.append(message, action, cancel);
    document.body.appendChild(panel);
    action.focus();
  } catch (error) {
    notifyRefusal(error?.message);
  }
})();
