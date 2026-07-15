import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

export function calculateSha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

export function validateChecksum(filePath, expected) {
  const actual = calculateSha256(filePath);
  const normalizedExpected = String(expected ?? "").trim().toLowerCase();
  return {
    expected: normalizedExpected,
    actual,
    valid: actual === normalizedExpected,
  };
}
