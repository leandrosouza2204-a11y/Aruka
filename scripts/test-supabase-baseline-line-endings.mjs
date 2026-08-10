import { existsSync, mkdirSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import {
  BASELINE_PATH,
  EXECUTABLE_BASELINE_PATH,
  EXPECTED_BASELINE_SHA,
  sha256CanonicalText,
} from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const tempDir = mkdtempSync(join(tmpdir(), "aruka-baseline-line-endings-"));

function fail(message) {
  throw new Error(message);
}

function validateReferenceBaselineContract(rootDir) {
  if (existsSync(join(rootDir, EXECUTABLE_BASELINE_PATH))) {
    fail(`Executable baseline must remain absent: ${EXECUTABLE_BASELINE_PATH}`);
  }
  if (!existsSync(join(rootDir, BASELINE_PATH))) {
    fail(`Reference baseline missing: ${BASELINE_PATH}`);
  }
  const realHash = sha256CanonicalText(rootDir, BASELINE_PATH);
  if (realHash !== EXPECTED_BASELINE_SHA) {
    fail(`Canonical baseline SHA mismatch for reference baseline: expected ${EXPECTED_BASELINE_SHA}, got ${realHash}`);
  }
}

function writeBaseline(rootDir, relativePath, text) {
  const absolute = join(rootDir, relativePath);
  mkdirSync(dirname(absolute), { recursive: true });
  writeFileSync(absolute, text, "utf8");
}

try {
  validateReferenceBaselineContract(root);

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

  const missingReferenceRoot = join(tempDir, "missing-reference");
  mkdirSync(missingReferenceRoot, { recursive: true });
  assertThrows(() => validateReferenceBaselineContract(missingReferenceRoot), "Reference baseline missing");

  const executableBaselineRoot = join(tempDir, "executable-baseline");
  writeBaseline(executableBaselineRoot, BASELINE_PATH, baselineText);
  writeBaseline(executableBaselineRoot, EXECUTABLE_BASELINE_PATH, baselineText);
  assertThrows(() => validateReferenceBaselineContract(executableBaselineRoot), "Executable baseline must remain absent");

  const correctReferenceRoot = join(tempDir, "correct-reference");
  writeBaseline(correctReferenceRoot, BASELINE_PATH, baselineText);
  validateReferenceBaselineContract(correctReferenceRoot);

  console.log("SUPABASE_BASELINE_LINE_ENDINGS_VALIDATED");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

function assertThrows(fn, expectedMessage) {
  try {
    fn();
  } catch (error) {
    if (String(error?.message || "").includes(expectedMessage)) return;
    throw error;
  }
  fail(`Expected failure containing: ${expectedMessage}`);
}
