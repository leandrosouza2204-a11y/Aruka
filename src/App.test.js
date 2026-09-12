import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./App.jsx", import.meta.url), "utf8");

test("expired recovery hashes render recovery UX instead of the landing page", () => {
  assert.match(source, /function LandingPageOrRecoveryError\(\)/);
  assert.match(source, /isExpiredRecoveryUrlError\(window\.location\.hash\)/);
  assert.match(source, /<InvalidRecoveryLink \/>/);
  assert.match(source, /path="\/" element=\{<LandingPageOrRecoveryError \/>\}/);
});
