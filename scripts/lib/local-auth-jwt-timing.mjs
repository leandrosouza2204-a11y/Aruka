export const LOCAL_POSTGREST_JWT_SAFETY_MARGIN_MS = 2100;

export function getJwtTiming(accessToken, now = Date.now()) {
  const payload = decodeJwtPayload(accessToken);
  const issuedAt = Number(payload?.iat);
  const expiresAt = Number(payload?.exp);
  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) {
    throw new Error("LOCAL_QA_JWT_TIMING_REQUIRED");
  }

  const issuedAtEpochMs = issuedAt * 1000;
  const usableAtEpochMs = issuedAtEpochMs + LOCAL_POSTGREST_JWT_SAFETY_MARGIN_MS;
  return {
    issuedAt,
    expiresAt,
    issuedAtEpochMs,
    usableAtEpochMs,
    waitMs: Math.max(0, usableAtEpochMs - now),
  };
}

function decodeJwtPayload(accessToken) {
  const payload = String(accessToken || "").split(".")[1];
  if (!payload) return null;
  return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
}
