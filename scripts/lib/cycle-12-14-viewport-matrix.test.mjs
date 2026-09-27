import assert from "node:assert/strict";
import test from "node:test";
import { resolveCycle1214Viewports } from "./cycle-12-14-viewport-matrix.mjs";

test("landscape matrix is declarative and includes the required minimum viewports", () => {
  assert.deepEqual(resolveCycle1214Viewports([], "landscape").map(({ width, height }) => `${width}x${height}`), ["640x320", "812x375", "844x390", "1024x768"]);
});

test("keyboard resize matrix is classified by short-height dimensions", () => {
  assert.deepEqual(resolveCycle1214Viewports([], "keyboard-resize").map(({ width, height }) => `${width}x${height}`), ["390x360", "640x320", "844x390"]);
});

test("unknown profile preserves the canonical validator matrix", () => {
  const canonical = [{ name: "canonical", width: 320, height: 800 }];
  assert.equal(resolveCycle1214Viewports(canonical, "unknown"), canonical);
});
