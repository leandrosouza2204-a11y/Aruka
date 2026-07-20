import test from "node:test";
import assert from "node:assert/strict";
import {
  assertTrackedWorktreeAllowsOnlyEvidence,
  buildSpawnOptions,
  cycle91RuntimeEvidencePaths,
  formatExecutionFailure,
  normalizeGitStatusPath,
  resolveCommandInvocation,
  resolveExecutable,
  runCommand,
  trackedWorktreeViolations,
} from "../lib/cycle-9-1-process.mjs";

test("resolves package manager shims on Windows", () => {
  assert.equal(resolveExecutable("npm", "win32"), "npm.cmd");
  assert.equal(resolveExecutable("npx", "win32"), "npx.cmd");
  assert.equal(resolveExecutable("pnpm", "win32"), "pnpm.cmd");
  assert.equal(resolveExecutable("yarn", "win32"), "yarn.cmd");
});

test("preserves explicit Windows executable extensions", () => {
  assert.equal(resolveExecutable("npm.cmd", "win32"), "npm.cmd");
  assert.equal(resolveExecutable("tool.exe", "win32"), "tool.exe");
  assert.equal(resolveExecutable("script.bat", "win32"), "script.bat");
  assert.equal(resolveExecutable("legacy.com", "win32"), "legacy.com");
});

test("preserves git node and gh on Windows", () => {
  assert.equal(resolveExecutable("git", "win32"), "git");
  assert.equal(resolveExecutable("node", "win32"), "node");
  assert.equal(resolveExecutable("gh", "win32"), "gh");
});

test("does not add Windows shims on POSIX platforms", () => {
  assert.equal(resolveExecutable("npm", "linux"), "npm");
  assert.equal(resolveExecutable("npx", "darwin"), "npx");
});

test("runs resolved executable with separated arguments and shell disabled", () => {
  const calls = [];
  const result = runCommand("npm", ["run", "qa"], {
    platform: "win32",
    env: { PATH: "/node-bin", CYCLE_9_1_TEST_VAR: "present" },
    existsSync(path) {
      return path === "\\node-bin\\npm.cmd" || path === "\\node-bin\\node_modules\\npm\\bin\\npm-cli.js";
    },
    spawnSync(executable, args, options) {
      calls.push({ executable, args, options });
      return { status: 0, stdout: "ok\n", stderr: "" };
    },
  });

  assert.equal(result.executable, "npm.cmd");
  assert.equal(result.spawned_executable, process.execPath);
  assert.equal(result.stdout, "ok\n");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].executable, process.execPath);
  assert.deepEqual(calls[0].args, ["\\node-bin\\node_modules\\npm\\bin\\npm-cli.js", "run", "qa"]);
  assert.equal(calls[0].options.shell, false);
  assert.equal(calls[0].options.env.PATH, "/node-bin");
  assert.equal(calls[0].options.env.CYCLE_9_1_TEST_VAR, "present");
});

test("resolves npm and npx command invocations through Node without shell on Windows", () => {
  const env = { PATH: "/node-bin" };
  const exists = (path) => [
    "\\node-bin\\npm.cmd",
    "\\node-bin\\npx.cmd",
    "\\node-bin\\node_modules\\npm\\bin\\npm-cli.js",
    "\\node-bin\\node_modules\\npm\\bin\\npx-cli.js",
  ].includes(path);

  assert.deepEqual(resolveCommandInvocation("npm", ["--version"], { platform: "win32", env, existsSync: exists }), {
    executable: process.execPath,
    args: ["\\node-bin\\node_modules\\npm\\bin\\npm-cli.js", "--version"],
    displayExecutable: "npm.cmd",
  });
  assert.deepEqual(resolveCommandInvocation("npx", ["--version"], { platform: "win32", env, existsSync: exists }), {
    executable: process.execPath,
    args: ["\\node-bin\\node_modules\\npm\\bin\\npx-cli.js", "--version"],
    displayExecutable: "npx.cmd",
  });
});

test("builds spawn options without replacing process.env", () => {
  const options = buildSpawnOptions({ env: { CYCLE_9_1_EXTRA: "yes" } });
  assert.equal(options.shell, false);
  assert.equal(options.env.PATH, process.env.PATH);
  assert.equal(options.env.CYCLE_9_1_EXTRA, "yes");
});

test("reports ENOENT as executable not found with resolved executable", () => {
  const result = runCommand("npm", ["--version"], {
    platform: "win32",
    spawnSync() {
      const error = new Error("spawnSync npm.cmd ENOENT");
      error.code = "ENOENT";
      return { status: null, stdout: "", stderr: "", error };
    },
  });

  assert.equal(result.failure_kind, "not_found");
  assert.match(formatExecutionFailure(result), /npm executable was not found: npm\.cmd/);
});

test("reports non-zero status separately from ENOENT", () => {
  const result = runCommand("npm", ["--version"], {
    platform: "win32",
    spawnSync() {
      return { status: 1, stdout: "", stderr: "npm config error" };
    },
  });

  assert.equal(result.failure_kind, "non_zero");
  assert.match(formatExecutionFailure(result), /npm returned non-zero status 1: npm config error/);
});

test("reports timeout separately", () => {
  const result = runCommand("gh", ["auth", "status"], {
    spawnSync() {
      const error = new Error("operation timed out");
      error.code = "ETIMEDOUT";
      return { status: null, stdout: "", stderr: "", error };
    },
  });

  assert.equal(result.failure_kind, "timeout");
  assert.equal(result.timed_out, true);
});

test("normalizes git status paths", () => {
  assert.equal(normalizeGitStatusPath(" ./reports\\supabase-ci-runtime\\github-actions-artifacts-result.json "), "reports/supabase-ci-runtime/github-actions-artifacts-result.json");
  assert.equal(normalizeGitStatusPath("\"reports/supabase-ci-runtime/github-actions-artifacts-result.json\""), "reports/supabase-ci-runtime/github-actions-artifacts-result.json");
  assert.equal(normalizeGitStatusPath("old.json -> reports/supabase-ci-runtime/github-actions-artifacts-result.json"), "reports/supabase-ci-runtime/github-actions-artifacts-result.json");
});

for (const evidencePath of cycle91RuntimeEvidencePaths) {
  test(`allows cycle 9.1 evidence path ${evidencePath}`, () => {
    assert.deepEqual(trackedWorktreeViolations(` M ${evidencePath}`), []);
  });
}

test("allows artifacts evidence when status has no leading index-space", () => {
  assert.deepEqual(trackedWorktreeViolations("M reports/supabase-ci-runtime/github-actions-artifacts-result.json"), []);
});

test("allows evidence paths with backslashes prefix and quotes", () => {
  const status = [
    " M reports\\supabase-ci-runtime\\github-actions-artifacts-result.json",
    " M ./reports/supabase-ci-runtime/github-actions-check-result.json",
    " M \"reports/supabase-ci-runtime/github-actions-run-result.json\"",
  ].join("\n");

  assert.deepEqual(trackedWorktreeViolations(status), []);
});

test("allows multiple cycle 9.1 evidence files simultaneously", () => {
  const status = cycle91RuntimeEvidencePaths.map((path) => ` M ${path}`).join("\n");

  assert.deepEqual(trackedWorktreeViolations(status), []);
});

test("blocks tracked worktree changes outside cycle 9.1 evidence files", () => {
  const status = [
    " M reports/supabase-ci-runtime/github-actions-run-result.json",
    " M docs/supabase-infrastructure-refactor/14-roadmap.md",
  ].join("\n");

  assert.deepEqual(trackedWorktreeViolations(status), ["docs/supabase-infrastructure-refactor/14-roadmap.md"]);
});

test("reports normalized paths when blocking worktree changes", () => {
  assert.throws(
    () => assertTrackedWorktreeAllowsOnlyEvidence(" M .\\docs\\supabase-infrastructure-refactor\\14-roadmap.md"),
    /docs\/supabase-infrastructure-refactor\/14-roadmap\.md/,
  );
});

test("blocks lookalike artifact evidence names", () => {
  assert.deepEqual(
    trackedWorktreeViolations(" M reports/supabase-ci-runtime/github-actions-artifact-result.json"),
    ["reports/supabase-ci-runtime/github-actions-artifact-result.json"],
  );
});

test("blocks arbitrary files inside the evidence directory", () => {
  assert.deepEqual(
    trackedWorktreeViolations(" M reports/supabase-ci-runtime/arbitrary.json"),
    ["reports/supabase-ci-runtime/arbitrary.json"],
  );
});

test("allows current regression state because tracked changes are authorized evidence", () => {
  const status = [
    " M reports/supabase-ci-runtime/github-actions-artifacts-result.json",
    " M reports/supabase-ci-runtime/github-actions-check-result.json",
    " M reports/supabase-ci-runtime/github-actions-run-result.json",
    "?? reports/supabase-ci-runtime/cleanup-result.json",
    "?? tmp/",
  ].join("\n");

  assert.deepEqual(trackedWorktreeViolations(status), []);
});
