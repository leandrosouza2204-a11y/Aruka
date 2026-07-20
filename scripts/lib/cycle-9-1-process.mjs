import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { delimiter, dirname, join, posix, win32 } from "node:path";

const windowsCommandShims = new Map([
  ["npm", "npm.cmd"],
  ["npx", "npx.cmd"],
  ["pnpm", "pnpm.cmd"],
  ["yarn", "yarn.cmd"],
]);

const forbiddenCommandText = [
  /supabase\s+link/i,
  /supabase\s+db\s+push/i,
  /supabase\s+db\s+pull/i,
  /supabase\s+migration\s+(?:up|repair)/i,
  /supabase\s+functions\s+deploy/i,
  /supabase\s+secrets\s+set/i,
  /supabase\s+projects\b/i,
  /supabase\s+branches\b/i,
  /docker\s+system\s+prune/i,
  /docker\s+volume\s+prune/i,
  /git\s+push\s+origin\s+main/i,
  /gh\s+pr\s+merge/i,
];

export const cycle91RuntimeEvidencePaths = [
  "reports/supabase-ci-runtime/github-actions-run-result.json",
  "reports/supabase-ci-runtime/github-actions-artifacts-result.json",
  "reports/supabase-ci-runtime/github-actions-check-result.json",
  "reports/supabase-ci-runtime/cleanup-result.json",
  "reports/supabase-ci-runtime/branch-protection-result.json",
  "reports/supabase-ci-runtime/merge-block-negative-result.json",
];

export function parseArgs(argv = process.argv.slice(2)) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) {
      args._.push(arg);
      continue;
    }
    const [key, inlineValue] = arg.slice(2).split("=", 2);
    if (inlineValue !== undefined) args[key] = inlineValue;
    else if (argv[index + 1] && !argv[index + 1].startsWith("--")) args[key] = argv[++index];
    else args[key] = true;
  }
  return args;
}

export function assertSafeCommand(command, args = []) {
  const text = [command, ...args].join(" ");
  for (const pattern of forbiddenCommandText) {
    if (pattern.test(text)) throw new Error(`Forbidden command rejected: ${text}`);
  }
}

export function normalizeGitStatusPath(path) {
  let normalized = path.trim();
  const renameSeparator = " -> ";
  if (normalized.includes(renameSeparator)) normalized = normalized.slice(normalized.lastIndexOf(renameSeparator) + renameSeparator.length);
  normalized = normalized.trim();
  if (
    (normalized.startsWith("\"") && normalized.endsWith("\"")) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }
  normalized = normalized.replace(/\\/g, "/");
  while (normalized.startsWith("./")) normalized = normalized.slice(2);
  return normalized;
}

function porcelainPath(line) {
  const trimmed = line.trimStart();
  if (/^\?\? /.test(trimmed)) return null;
  if (/^[ MADRCU?!]{2} /.test(line)) return line.slice(3);
  if (/^[MADRCU?!] /.test(trimmed)) return trimmed.slice(2);
  return trimmed;
}

export function trackedWorktreeViolations(statusText, allowedPaths = cycle91RuntimeEvidencePaths) {
  const allowed = new Set(allowedPaths.map(normalizeGitStatusPath));
  return statusText
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => porcelainPath(line))
    .filter((path) => path !== null)
    .map((path) => normalizeGitStatusPath(path))
    .filter((path) => !allowed.has(path));
}

export function assertTrackedWorktreeAllowsOnlyEvidence(statusText, label = "Tracked worktree") {
  const violations = trackedWorktreeViolations(statusText);
  if (violations.length) {
    throw new Error(`${label} has non-evidence changes that must be committed or restored first:\n${violations.join("\n")}`);
  }
}

export function resolveExecutable(command, platform = process.platform) {
  if (platform !== "win32") return command;
  if (/\.(?:cmd|exe|bat|com)$/i.test(command)) return command;
  return windowsCommandShims.get(command.toLowerCase()) ?? command;
}

function pathValue(env) {
  return env.PATH ?? env.Path ?? env.path ?? "";
}

function pathApi(platform) {
  if (platform === "win32") return { delimiter: ";", dirname: win32.dirname, join: win32.join };
  if (platform === "darwin" || platform === "linux") return { delimiter: ":", dirname: posix.dirname, join: posix.join };
  return { delimiter, dirname, join };
}

function findOnPath(executable, env = process.env, fileExists = existsSync, platform = process.platform) {
  const path = pathApi(platform);
  for (const directory of pathValue(env).split(path.delimiter)) {
    if (!directory) continue;
    const candidate = path.join(directory, executable);
    if (fileExists(candidate)) return candidate;
  }
  return null;
}

export function resolveCommandInvocation(command, args = [], options = {}) {
  const platform = options.platform ?? process.platform;
  const env = { ...process.env, ...(options.env ?? {}) };
  const executable = resolveExecutable(command, platform);
  if (platform !== "win32") return { executable, args, displayExecutable: executable };

  if (command.toLowerCase() === "npm" || command.toLowerCase() === "npx") {
    const path = pathApi(platform);
    const shim = findOnPath(executable, env, options.existsSync ?? existsSync, platform);
    if (!shim) return { executable, args, displayExecutable: executable };
    const cli = path.join(path.dirname(shim), "node_modules", "npm", "bin", command.toLowerCase() === "npm" ? "npm-cli.js" : "npx-cli.js");
    if ((options.existsSync ?? existsSync)(cli)) return { executable: process.execPath, args: [cli, ...args], displayExecutable: executable };
  }

  return { executable, args, displayExecutable: executable };
}

export function buildSpawnOptions(options = {}) {
  return {
    cwd: options.cwd ?? process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: options.timeoutMs ?? 120000,
    maxBuffer: options.maxBuffer ?? 1024 * 1024 * 20,
    env: {
      ...process.env,
      ...(options.env ?? {}),
    },
  };
}

function classifySpawnFailure(result) {
  if (result.error?.code === "ENOENT") return "not_found";
  if (result.error?.code === "ETIMEDOUT") return "timeout";
  if (result.error) return "exception";
  if ((result.status ?? 1) !== 0) return "non_zero";
  return null;
}

export function formatExecutionFailure(result) {
  const detail = result.stderr || result.stdout || result.error_message || "no output";
  if (result.failure_kind === "not_found") return `${result.command} executable was not found: ${result.executable}`;
  if (result.failure_kind === "timeout") return `${result.command} timed out while running: ${result.executable} ${result.args.join(" ")}`;
  if (result.failure_kind === "exception") return `${result.command} execution exception: ${detail}`;
  return `${result.command} returned non-zero status ${result.status}: ${detail}`;
}

export function runCommand(command, args = [], options = {}) {
  assertSafeCommand(command, args);
  const invocation = resolveCommandInvocation(command, args, options);
  const spawn = options.spawnSync ?? spawnSync;
  const result = spawn(invocation.executable, invocation.args, buildSpawnOptions(options));
  const failureKind = classifySpawnFailure(result);
  return {
    command,
    executable: invocation.displayExecutable,
    spawned_executable: invocation.executable,
    args,
    spawned_args: invocation.args,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr || result.error?.message || "",
    error_message: result.error?.message ?? "",
    failure_kind: failureKind,
    timed_out: failureKind === "timeout",
  };
}

export function runOrThrow(command, args = [], options = {}) {
  const result = runCommand(command, args, options);
  if (result.status !== 0) {
    throw new Error(formatExecutionFailure(result));
  }
  return result.stdout.trim();
}

export function printDryRun(actions) {
  for (const action of actions) console.log(`[dry-run] ${action}`);
}
