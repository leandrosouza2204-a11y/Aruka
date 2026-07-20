import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assertNoSecrets, writeEvidence } from "../lib/cycle-9-1-evidence-writer.mjs";

test("writes stable evidence JSON atomically", () => {
  const root = mkdtempSync(join(tmpdir(), "cycle-9-1-writer-"));
  try {
    writeEvidence(root, "sample.json", { z: 1, a: { b: true } });
    const text = readFileSync(join(root, "reports/supabase-ci-runtime/sample.json"), "utf8");
    assert.match(text, /"a"/);
    assert.match(text, /"z"/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects secret-like content", () => {
  assert.throws(() => assertNoSecrets({ token: "github_pat_abcdefghijklmnopqrstuvwxyz" }), /secret-like/);
});
