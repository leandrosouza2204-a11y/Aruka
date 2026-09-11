import assert from "node:assert/strict";
import test from "node:test";
import { LOCAL_POSTGREST_JWT_SAFETY_MARGIN_MS, getJwtTiming } from "../lib/local-auth-jwt-timing.mjs";

function jwt(payload) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.signature`;
}

test("uses JWT seconds plus the documented PostgREST safety window", () => {
  const timing = getJwtTiming(jwt({ iat: 100, exp: 200 }), 100_500);
  assert.equal(timing.issuedAtEpochMs, 100_000);
  assert.equal(timing.usableAtEpochMs, 100_000 + LOCAL_POSTGREST_JWT_SAFETY_MARGIN_MS);
  assert.equal(timing.waitMs, 1_600);
});

test("rejects tokens without numeric issued and expiry times", () => {
  assert.throws(() => getJwtTiming(jwt({ iat: "invalid", exp: 200 })), /LOCAL_QA_JWT_TIMING_REQUIRED/);
});
