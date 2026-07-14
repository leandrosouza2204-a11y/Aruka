import path from "node:path";
import { exists, read } from "../utils/files.mjs";

function normalize(value) {
  return String(value ?? "").replace(/\\/g, "/").toLowerCase();
}

function wildcardToRegExp(pattern) {
  const escaped = normalize(pattern).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*");
  return new RegExp(`(^|/)${escaped}($|/)`);
}

async function loadPatterns(root = process.cwd()) {
  const file = path.resolve(root, ".aqaignore");
  if (!(await exists(file))) return [];
  const content = await read(file);
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function matchesPattern(finding, pattern) {
  const lower = normalize(pattern);
  if (normalize(finding.ruleId) === lower) return true;
  if (normalize(finding.modelCode) === lower) return true;
  const file = normalize(finding.file);
  if (!file) return false;
  if (lower.includes("*")) return wildcardToRegExp(lower).test(file);
  return file.includes(lower);
}

export async function applySuppressions(findings, options = {}) {
  const patterns = await loadPatterns(options.cwd ?? process.cwd());
  let suppressedCount = 0;
  const calibrated = findings.map((finding) => {
    const suppression = patterns.find((pattern) => matchesPattern(finding, pattern));
    if (!suppression) return { ...finding, suppressed: false };
    suppressedCount += 1;
    return { ...finding, suppressed: true, suppression };
  });

  return {
    findings: calibrated,
    metrics: { suppressedCount, suppressionPatterns: patterns.length },
  };
}
