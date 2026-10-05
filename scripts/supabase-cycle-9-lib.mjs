import { createHash } from "node:crypto";
import net from "node:net";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import YAML from "yaml";

export const CYCLE_9_DECISION = "CI_QUALITY_GATES_VALIDATED";
export const EXECUTABLE_BASELINE_PATH = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
export const BASELINE_PATH = "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql";
export const EXPECTED_BASELINE_SHA = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";
export const PROTECTED_PROJECT_REF = "xrmqdkpx" + "nfvusmenadnf";
export const WORKFLOW_PATH = ".github/workflows/supabase-local-quality-gates.yml";
export const REPORT_DIR = "reports/supabase-ci";
export const SUPABASE_CLI_VERSION = "2.109.1";
export const NODE_VERSION = "22";

export function ensureReportDir(root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
}

export function writeJsonReport(root, file, payload) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function writeMarkdownReport(root, file, lines) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${lines.join("\n")}\n`, "utf8");
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

export function readText(root, file) {
  return readFileSync(join(root, file), "utf8");
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

export function readYaml(root, file = WORKFLOW_PATH) {
  return YAML.parse(readText(root, file));
}

export function runCommand(root, command, args, timeoutMs = 120000) {
  const isWindowsCmd = process.platform === "win32" && /\.cmd$/i.test(command);
  const executable = isWindowsCmd ? "cmd.exe" : command;
  const finalArgs = isWindowsCmd ? ["/d", "/s", "/c", command, ...args] : args;
  const result = spawnSync(executable, finalArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 20,
  });
  return {
    status: result.status ?? 1,
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    stdout: sanitizeText(result.stdout || ""),
    stderr: sanitizeText(result.stderr || result.error?.message || ""),
  };
}

export function sanitizeText(text) {
  return String(text)
    .replace(/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/gi, "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@")
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, "[REDACTED_JWT]")
    .replace(/sb_secret_[A-Za-z0-9_-]+/gi, "[REDACTED_SECRET]")
    .replaceAll(process.cwd().replaceAll("\\", "/"), "[WORKSPACE]")
    .replaceAll(process.cwd(), "[WORKSPACE]");
}

export function validateProjectId(value) {
  return typeof value === "string" && /^aruka_ci_[0-9]+_[0-9]+$/.test(value) && value !== PROTECTED_PROJECT_REF && !/[?*[\]{}]/.test(value);
}

const CI_PROJECT_PATTERN = /^aruka_ci_[A-Za-z0-9_-]+$/;
const CI_RUN_PROJECT_PATTERN = /^aruka_ci_(\d+)_(\d+)$/;

export function deriveCiDbPort(projectId) {
  const match = String(projectId || "").match(CI_RUN_PROJECT_PATTERN);
  if (!match) throw new Error("CI project ID is not eligible for deterministic DB port isolation");
  const runId = BigInt(match[1]);
  const attempt = BigInt(match[2]);
  const slot = Number((runId * 31n + attempt) % 2000n);
  return 20002 + slot * 16;
}

export function readDbPort(configText) {
  const start = String(configText).search(/^\[db\]\s*$/m);
  if (start < 0) throw new Error("Supabase [db] section is missing");
  const tail = configText.slice(start);
  const endMatch = tail.slice(1).match(/^\[/m);
  const end = endMatch ? start + 1 + endMatch.index : configText.length;
  const match = configText.slice(start, end).match(/^port\s*=\s*(\d+)\s*$/m);
  if (!match) throw new Error("Supabase [db] port is missing");
  return Number(match[1]);
}

export function rewriteDbPort(configText, port) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error("Invalid Supabase DB port");
  const start = String(configText).search(/^\[db\]\s*$/m);
  if (start < 0) throw new Error("Supabase [db] section is missing");
  const tail = configText.slice(start);
  const endMatch = tail.slice(1).match(/^\[/m);
  const end = endMatch ? start + 1 + endMatch.index : configText.length;
  const section = configText.slice(start, end);
  if (!/^port\s*=\s*\d+\s*$/m.test(section)) throw new Error("Supabase [db] port is missing");
  return configText.slice(0, start) + section.replace(/^port\s*=\s*\d+\s*$/m, `port = ${port}`) + configText.slice(end);
}

export function parseDockerPortInventory(output) {
  return String(output || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf("|");
    return separator < 0 ? { name: line, ports: "" } : { name: line.slice(0, separator), ports: line.slice(separator + 1) };
  });
}

export function isOwnedCiContainer(name, projectId) {
  if (!CI_PROJECT_PATTERN.test(String(projectId || ""))) return false;
  const escaped = projectId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^supabase_[a-z0-9_-]+_${escaped}$`).test(String(name || ""));
}

export function publishesHostPort(ports, port) {
  return new RegExp(`(?:0\\.0\\.0\\.0|127\\.0\\.0\\.1|localhost|\\[::\\]|::):${port}->`).test(String(ports || ""));
}

export function classifyCiBootstrapResources({ projectId, dbPort, inventory, tcpPortAvailable }) {
  if (!CI_PROJECT_PATTERN.test(String(projectId || ""))) return { action: "REJECT", reason: "INVALID_CI_PROJECT_ID", owned: [], foreign: [] };
  const owned = inventory.filter((item) => isOwnedCiContainer(item.name, projectId)).map((item) => item.name);
  const publishers = inventory.filter((item) => publishesHostPort(item.ports, dbPort));
  const foreign = publishers.filter((item) => !isOwnedCiContainer(item.name, projectId)).map((item) => item.name);
  if (foreign.length) return { action: "REJECT", reason: "UNOWNED_CONTAINER_OWNS_DB_PORT", owned, foreign };
  if (!tcpPortAvailable && publishers.length === 0) return { action: "REJECT", reason: "UNKNOWN_PROCESS_OWNS_DB_PORT", owned, foreign: [] };
  if (owned.length) return { action: "CLEAN_OWNED", reason: "OWNED_CI_RESIDUE", owned, foreign: [] };
  return { action: "READY", reason: "DB_PORT_AVAILABLE", owned: [], foreign: [] };
}

export function probeTcpPortAvailable(port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" || error.code === "EACCES") resolve(false);
      else reject(error);
    });
    server.listen({ host, port, exclusive: true }, () => server.close(() => resolve(true)));
  });
}

export function assertNoForbiddenContent(root, files, options = {}) {
  const allowedProjectRefFiles = new Set([
    "docs/supabase-infrastructure-refactor/43-safe-local-reset-validation.md",
    "docs/supabase-infrastructure-refactor/44-cycle-8-final-evidence.md",
    "docs/supabase-infrastructure-refactor/45-ci-validation-pipeline.md",
    "docs/supabase-infrastructure-refactor/46-ephemeral-supabase-ci-environment.md",
    "docs/supabase-infrastructure-refactor/47-pull-request-quality-gates.md",
    "docs/supabase-infrastructure-refactor/48-cycle-9-final-evidence.md",
    "scripts/supabase-cycle-8-lib.mjs",
    "scripts/supabase-cycle-9-lib.mjs",
    "scripts/validate-supabase-cycle-9.mjs",
    "scripts/test-supabase-local-seeds-negative.mjs",
    "scripts/test-supabase-ci-negative.mjs",
  ]);
  const findings = [];
  for (const file of files) {
    if (!existsSync(join(root, file))) continue;
    const isGuardrailContext = /scripts\/.*(?:negative|safety|evidence|cycle-9|lib)\.mjs$/.test(file);
    let text = readText(root, file);
    if (isGuardrailContext) {
      text = text
        .replace(/\/postgres[\s\S]*?\/[gimsuy]*/g, "[REGEX_REDACTED]")
        .replace(/postgres\(\?:ql\)\?:\\\/\\\/[^"\n]+/g, "[REGEX_TEXT_REDACTED]")
        .replace(/\/eyJ[\s\S]*?\/[gimsuy]*/g, "[REGEX_REDACTED]")
        .replace(/\/sb_secret_[\s\S]*?\/[gimsuy]*/gi, "[REGEX_REDACTED]")
        .replace(/\bSUPABASE_ACCESS_TOKEN\b/g, "[BLOCKED_TOKEN_NAME]")
        .replace(/\bservice_role\b/gi, "[BLOCKED_SERVICE_ROLE]");
    }
    const checks = [
      [/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i, "credentialed PostgreSQL URL"],
      [/eyJ[A-Za-z0-9_-]{20,}\./, "JWT-like token"],
      [/sb_secret_[A-Za-z0-9_-]+/i, "secret-like token"],
      [/\bSUPABASE_ACCESS_TOKEN\b/, "Supabase access token reference"],
      [/\bSERVICE_ROLE_KEY\b|\bservice_role\b/i, "service role reference"],
      [/\bVERCEL_TOKEN\b/, "Vercel token reference"],
    ];
    if (!allowedProjectRefFiles.has(file) && new RegExp(PROTECTED_PROJECT_REF, "i").test(text)) {
      findings.push({ file, reason: "protected HML project ref" });
    }
    for (const [pattern, reason] of checks) {
      if (isGuardrailContext && /PostgreSQL URL|token|service role/i.test(reason)) continue;
      if (pattern.test(text)) findings.push({ file, reason });
    }
  }
  if (findings.length && options.throw !== false) {
    throw new Error(`Forbidden content found: ${findings.map((item) => `${item.file} (${item.reason})`).join("; ")}`);
  }
  return findings;
}

export function allRelevantFiles(root) {
  return [
    WORKFLOW_PATH,
    "package.json",
    "package-lock.json",
    ...listFiles(root, "scripts").filter((file) => file.endsWith(".mjs") || file.endsWith(".ps1")),
    ...listFiles(root, "supabase").filter((file) => !file.startsWith("supabase/.temp/")),
    ...listFiles(root, "reports/supabase-ci"),
    ...listFiles(root, "reports/supabase-local-bootstrap"),
    ...listFiles(root, "reports/supabase-local-seeds"),
    ...listFiles(root, "docs/supabase-infrastructure-refactor"),
  ];
}

export function ensureParent(file) {
  mkdirSync(dirname(file), { recursive: true });
}
