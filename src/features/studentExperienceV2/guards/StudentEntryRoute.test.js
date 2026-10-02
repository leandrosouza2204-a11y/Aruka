import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./StudentEntryRoute.jsx", import.meta.url), "utf8");

test("legacy entry is rendered immediately while rollout is off", () => {
  assert.match(source, /if \(!enabled \|\| isGuardFallback \|\| destination === STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY\)/);
  assert.match(source, /return children;/);
});

test("enabled entry resolves eligibility without rendering legacy first", () => {
  assert.match(source, /resolverDestinoPosLogin\(null, null, \{/);
  assert.match(source, /v2Enabled: true/);
  assert.match(source, /fallbackRoute: STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY/);
  assert.match(source, /\.catch\(\(\) => \{/);
  assert.match(source, /setDestination\(STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY\)/);
  assert.match(source, /<Navigate to=\{destination\} replace \/>/);
  assert.match(source, /<LoadingFallback texto="Preparando sua área\.\.\." variant="route" \/>/);
});

test("guard fallback marker prevents a redirect loop back to V2", () => {
  assert.match(source, /location\.state\?\.studentV2FallbackFrom/);
  assert.match(source, /isGuardFallback/);
});
