import { mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BASELINE_PATH, EXPECTED_BASELINE_SHA, sha256CanonicalText } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const tempDir = mkdtempSync(join(tmpdir(), "aruka-baseline-line-endings-"));

function fail(message) {
  throw new Error(message);
}

try {
  const baselineText = readFileSync(join(root, BASELINE_PATH), "utf8").replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const variants = [
    ["lf", baselineText],
    ["crlf", baselineText.replace(/\n/g, "\r\n")],
    ["cr", baselineText.replace(/\n/g, "\r")],
  ];

  for (const [name, text] of variants) {
    const relativePath = `tmp-${name}.sql`;
    writeFileSync(join(tempDir, relativePath), text, "utf8");
    const hash = sha256CanonicalText(tempDir, relativePath);
    if (hash !== EXPECTED_BASELINE_SHA) {
      fail(`Canonical baseline SHA mismatch for ${name}: expected ${EXPECTED_BASELINE_SHA}, got ${hash}`);
    }
  }

  const realHash = sha256CanonicalText(root, BASELINE_PATH);
  if (realHash !== EXPECTED_BASELINE_SHA) {
    fail(`Canonical baseline SHA mismatch for active baseline: expected ${EXPECTED_BASELINE_SHA}, got ${realHash}`);
  }

  console.log("SUPABASE_BASELINE_LINE_ENDINGS_VALIDATED");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
