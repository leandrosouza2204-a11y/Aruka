import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

export const DECISION_FINAL = "GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED";
export const DECISION_PREPARE = "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED";
export const REPORT_DIR = "reports/supabase-ci-runtime";
export const WORKFLOW_FILE = ".github/workflows/supabase-local-quality-gates.yml";
export const WORKFLOW_NAME = "Supabase Local Quality Gates";
export const EXPECTED_JOB = "validation";
export const BASELINE_PATH = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
export const EXPECTED_BASELINE_SHA = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";
export const PROTECTED_PROJECT_REF = "xrmqdkpx" + "nfvusmenadnf";

export function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

export function ensureReportDir(root = process.cwd()) {
  ensureDir(join(root, REPORT_DIR));
}

export function writeJson(root, file, payload) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function writeMarkdown(root, file, lines) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${lines.join("\n")}\n`, "utf8");
}

export function readJson(root, file, fallback = null) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8").replace(/^\uFEFF/, ""));
  } catch {
    return fallback;
  }
}

export function sha256(root, file) {
  return createHash("sha256").update(readFileSync(join(root, file))).digest("hex").toUpperCase();
}

export function sha256CanonicalText(root, file) {
  let bytes = readFileSync(join(root, file));
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    bytes = bytes.subarray(3);
  }
  const text = bytes.toString("utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex").toUpperCase();
}

export function fileSha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

export function run(root, command, args, timeoutMs = 120000) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 20,
  });
  return {
    status: result.status ?? 1,
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    stdout: sanitize(result.stdout || ""),
    stderr: sanitize(result.stderr || result.error?.message || ""),
  };
}

export function git(root, args) {
  return run(root, "git", args, 120000);
}

export function gh(root, args) {
  if (args.some((arg) => /^(workflow|secret|variable|repo|pr)$/i.test(arg)) && args.some((arg) => /^(run|merge|edit|set)$/i.test(arg))) {
    throw new Error("Refusing mutating gh command");
  }
  if (args[0] === "api" && args.some((arg) => /^(--method|-X)$/i.test(arg))) {
    throw new Error("Refusing gh api with explicit method");
  }
  return run(root, "gh", args, 120000);
}

export function ghAvailable(root) {
  const version = run(root, "gh", ["--version"], 30000);
  const auth = version.status === 0 ? run(root, "gh", ["auth", "status"], 30000) : { status: 1, stdout: "", stderr: "gh unavailable" };
  return { available: version.status === 0, authenticated: auth.status === 0, version, auth };
}

export function repoSlug(root) {
  const remote = git(root, ["remote", "get-url", "origin"]).stdout.trim();
  const match = remote.match(/github\.com[:/](.+?)(?:\.git)?$/i);
  return match ? match[1].replace(/\.git$/i, "") : null;
}

export function listFiles(root, dir) {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const full = join(absolute, entry);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (statSync(full).isDirectory()) out.push(...listFiles(root, rel));
    else out.push(rel);
  }
  return out.sort();
}

export function sanitize(text) {
  return String(text)
    .replace(/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/gi, "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@")
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, "[REDACTED_JWT]")
    .replace(/sb_secret_[A-Za-z0-9_-]+/gi, "[REDACTED_SECRET]")
    .replace(new RegExp(PROTECTED_PROJECT_REF, "g"), "[PROTECTED_HML_PROJECT_REF]");
}

export function scanUnsafeText(text) {
  const findings = [];
  const checks = [
    [/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i, "credentialed PostgreSQL URL"],
    [/eyJ[A-Za-z0-9_-]{20,}\./, "JWT-like token"],
    [/sb_secret_[A-Za-z0-9_-]+/i, "secret-like token"],
    [/\bSUPABASE_ACCESS_TOKEN\b|\baccess_token\b|\brefresh_token\b/i, "access token reference"],
    [/\bservice_role\b|\bSERVICE_ROLE_KEY\b/i, "service role reference"],
    [/\bANON_KEY\b/i, "anon key reference"],
  ];
  for (const [pattern, reason] of checks) {
    if (pattern.test(text)) findings.push(reason);
  }
  return findings;
}

export function safeOutputPath(root, outputDir, candidate) {
  const base = resolve(root, outputDir);
  const target = resolve(base, candidate);
  if (!target.startsWith(base)) throw new Error(`Path traversal rejected: ${candidate}`);
  ensureDir(dirname(target));
  return target;
}

export function pendingReport(cycleResult = "PENDING_RUNTIME_EVIDENCE") {
  return {
    cycle: "9.1",
    result: cycleResult,
    decision: DECISION_PREPARE,
    real_github_actions_evidence_present: false,
    primary_error: "Real GitHub Actions runtime evidence has not been collected yet.",
  };
}
