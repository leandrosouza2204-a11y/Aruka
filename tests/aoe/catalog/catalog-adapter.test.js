import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadAPLCatalog, diffCatalogs, clearCatalogCache } from "../../../src/aoe/catalog/index.js";
import { parseFrequency, parseDuration, normalizeSplit, normalizeStrategy, specializationFrom } from "../../../src/aoe/catalog/metadata-extractor.js";
import { validateChecksum } from "../../../src/aoe/catalog/checksum-validator.js";

test("discovers and normalizes real APL releases", () => {
  const result = loadAPLCatalog({ projectRoot: process.cwd(), now: "2026-07-15T00:00:00.000Z" });
  assert.equal(result.statistics.releasesDiscovered, 2);
  assert.equal(result.statistics.releasesActive, 2);
  assert.equal(result.statistics.modelsDeclared, 30);
  assert.equal(result.statistics.modelsValid, 30);
  assert.equal(result.statistics.checksumsValid, 30);
  assert.equal(new Set(result.catalog.map((model) => model.modelCode)).size, 30);
});

test("catalog generation is deterministic", () => {
  const first = loadAPLCatalog({ projectRoot: process.cwd(), now: "2026-07-15T00:00:00.000Z" });
  const second = loadAPLCatalog({ projectRoot: process.cwd(), now: "2026-07-15T00:00:00.000Z" });
  assert.deepEqual(first.catalog, second.catalog);
});

test("normalizes frequency and duration formats", () => {
  assert.deepEqual(parseFrequency("3-4 sessoes semanais", "ABC"), { minimum: 3, maximum: 4, recommended: 4 });
  assert.deepEqual(parseDuration("55-65 min"), { minimumMinutes: 55, maximumMinutes: 65, recommendedMinutes: 60, original: "55-65 min" });
});

test("normalizes enums and specialization", () => {
  assert.equal(normalizeSplit("Upper/Lower"), "UPPER_LOWER");
  assert.equal(normalizeStrategy("Especializacao em Costas"), "SPECIALIZATION");
  assert.equal(specializationFrom("", "APL-M-HIP-M-UL-ESP-COSTAS-01", ""), "COSTAS");
});

test("validates checksum and detects mismatch", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "aoe-catalog-"));
  const file = path.join(dir, "model.md");
  fs.writeFileSync(file, "stable");
  const valid = validateChecksum(file, "f379ccb92b9116442dc65bdc35648a85d3786b34779db7f704a901fa07b00cb6");
  const invalid = validateChecksum(file, "deadbeef");
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
});

test("diff detects model changes", () => {
  const diff = diffCatalogs([{ modelCode: "A", checksum: "1" }], [{ modelCode: "A", checksum: "2" }, { modelCode: "B" }]);
  assert.equal(diff.hasChanges, true);
  assert.ok(diff.changes.some((change) => change.status === "ADDED"));
  assert.ok(diff.changes.some((change) => change.field === "checksum"));
});

test("cache can be cleared and reused", () => {
  clearCatalogCache();
  const first = loadAPLCatalog({ projectRoot: process.cwd(), cache: true });
  const second = loadAPLCatalog({ projectRoot: process.cwd(), cache: true });
  assert.deepEqual(first.catalog, second.catalog);
  clearCatalogCache();
});
