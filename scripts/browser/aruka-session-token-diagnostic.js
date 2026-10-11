void (() => {
  const projectRef = "vrizeuhuhvtvbrmtvdik";
  const canonicalOrigin = "https://www.aruka.com.br";
  const storageKey = `sb-${projectRef}-auth-token`;

  function finish(reason) {
    window.alert(`SESSION_DIAGNOSTIC:${reason}`);
  }

  if (window.location.origin !== canonicalOrigin) return finish("ORIGIN_NOT_CANONICAL");
  const serializedSession = localStorage.getItem(storageKey);
  if (!serializedSession) {
    const otherSessionPresent = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
      .some((key) => /^sb-[a-z0-9]+-auth-token$/u.test(key || "") && key !== storageKey);
    return finish(otherSessionPresent ? "EXPECTED_STORAGE_KEY_ABSENT_OTHER_SUPABASE_SESSION_PRESENT" : "EXPECTED_STORAGE_KEY_ABSENT");
  }

  let session;
  try { session = JSON.parse(serializedSession); } catch { return finish("SESSION_JSON_INVALID"); }
  const token = session?.access_token;
  if (typeof token !== "string" || !token) return finish("SESSION_ACCESS_TOKEN_MISSING");
  const parts = token.split(".");
  if (parts.length !== 3 || parts.some((part) => !part)) return finish("SESSION_ACCESS_TOKEN_FORMAT_INVALID");

  let claims;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(parts[1].length / 4) * 4, "=");
    claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), (character) => character.charCodeAt(0))));
  } catch { return finish("SESSION_ACCESS_TOKEN_PAYLOAD_INVALID"); }
  if (claims.role !== "authenticated") return finish("SESSION_ROLE_INVALID");
  if (!claims.sub) return finish("SESSION_SUBJECT_MISSING");
  if (!Number.isFinite(claims.exp)) return finish("SESSION_EXPIRATION_INVALID");
  if (claims.exp <= Math.floor(Date.now() / 1000)) return finish("SESSION_ACCESS_TOKEN_EXPIRED");

  let issuer;
  try { issuer = new URL(claims.iss); } catch { return finish("SESSION_ISSUER_INVALID"); }
  if (issuer.hostname !== `${projectRef}.supabase.co` || issuer.pathname.replace(/\/$/u, "") !== "/auth/v1") {
    return finish("SESSION_PROJECT_MISMATCH");
  }
  finish("PASS");
})();
