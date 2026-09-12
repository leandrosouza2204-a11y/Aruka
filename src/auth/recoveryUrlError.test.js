import assert from "node:assert/strict";
import test from "node:test";
import { clearAuthErrorHash, isExpiredRecoveryUrlError } from "./recoveryUrlError.js";

test("recognizes only Supabase's expired recovery error fragment", () => {
  assert.equal(isExpiredRecoveryUrlError("#error=access_denied&error_code=otp_expired"), true);
  assert.equal(isExpiredRecoveryUrlError("#error=access_denied&error_code=other"), false);
  assert.equal(isExpiredRecoveryUrlError("#access_token=sensitive"), false);
});

test("removes the complete auth error fragment", () => {
  const calls = [];
  clearAuthErrorHash({ pathname: "/", search: "" }, { replaceState: (...args) => calls.push(args) });
  assert.deepEqual(calls, [[null, "", "/"]]);
});
