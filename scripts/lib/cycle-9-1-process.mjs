import { spawnSync } from "node:child_process";

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

export function runCommand(command, args = [], options = {}) {
  assertSafeCommand(command, args);
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: options.timeoutMs ?? 120000,
    maxBuffer: options.maxBuffer ?? 1024 * 1024 * 20,
  });
  return {
    command,
    args,
    status: result.status ?? 1,
    stdout: result.stdout ?? "",
    stderr: result.stderr || result.error?.message || "",
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
  };
}

export function runOrThrow(command, args = [], options = {}) {
  const result = runCommand(command, args, options);
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  }
  return result.stdout.trim();
}

export function printDryRun(actions) {
  for (const action of actions) console.log(`[dry-run] ${action}`);
}
