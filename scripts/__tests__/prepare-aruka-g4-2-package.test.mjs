import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("prepares the approved 16-step package without a production connection", () => {
  const output = mkdtempSync(join(tmpdir(), "aruka-g4-2-package-"));
  try {
    execFileSync("node", ["scripts/prepare-aruka-g4-2-package.mjs", "--output", output], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    const manifest = JSON.parse(readFileSync(join(output, "manifest.json"), "utf8"));
    assert.equal(manifest.status, "PREPARED_NOT_AUTHORIZED_NOT_EXECUTED");
    assert.equal(manifest.production_connection_used, false);
    assert.equal(manifest.network_used, false);
    assert.equal(manifest.migration_count, 16);
    assert.equal(manifest.expected_history_before, 25);
    assert.equal(manifest.expected_history_after, 41);
    assert.equal(manifest.migrations[12].version, "20261004133801");
    assert.equal(manifest.migrations[13].version, "20260926174027");
    assert.equal(manifest.migrations[14].version, "20261003163830");
    assert.equal(manifest.migrations[15].source_sha256_canonical_lf, "8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21");
    assert.equal(readdirSync(output).filter((name) => name.endsWith(".sql")).length, 16);
    const last = readFileSync(join(output, manifest.migrations[15].staged_file), "utf8");
    assert.match(last, /PREPARED ONLY/);
    assert.match(last, /insert into supabase_migrations\.schema_migrations/);
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
});

test("refuses execution mode and repository output", () => {
  assert.throws(() => execFileSync("node", ["scripts/prepare-aruka-g4-2-package.mjs", "--execute", "--output", "reports/g4-2"], { cwd: process.cwd(), stdio: "pipe" }));
  assert.throws(() => execFileSync("node", ["scripts/prepare-aruka-g4-2-package.mjs", "--output", "reports/g4-2"], { cwd: process.cwd(), stdio: "pipe" }));
});
