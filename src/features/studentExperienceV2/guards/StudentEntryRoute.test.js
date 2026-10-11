import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./StudentEntryRoute.jsx", import.meta.url), "utf8");

test("legacy entry remains available after identity resolution while rollout is off", () => {
  assert.match(source, /enabled && !isGuardFallback \? undefined : async \(\) => \(\{ experience: "v1" \}\)/);
  assert.match(source, /if \(destination === STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY\)/);
  assert.match(source, /return children;/);
});

test("enabled entry resolves eligibility without rendering legacy first", () => {
  assert.match(source, /resolverDestinoPosLogin\(/);
  assert.match(source, /enabled && !isGuardFallback \? undefined/);
  assert.match(source, /undefined,/);
  assert.match(source, /fallbackRoute: STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY/);
  assert.match(source, /\.catch\(\(\) =>/);
  assert.match(source, /setDestination\(STUDENT_EXPERIENCE_V2_ROUTES\.LEGACY\)/);
  assert.match(source, /<Navigate to=\{destination\} replace \/>/);
  assert.match(source, /<LoadingFallback texto="Preparando sua área\.\.\." variant="route" \/>/);
});

test("PROFESSIONAL-05: direct student entry always resolves professional identity", () => {
  assert.doesNotMatch(source, /if \(!enabled \|\| isGuardFallback\) return undefined/);
  assert.match(source, /resolverDestinoPosLogin\(/);
});

test("guard fallback marker prevents a redirect loop without bypassing professional identity", () => {
  assert.match(source, /location\.state\?\.studentV2FallbackFrom/);
  assert.match(source, /enabled && !isGuardFallback \? undefined/);
  assert.doesNotMatch(source, /if \(isGuardFallback\) return undefined/);
});
