import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

export function currentHead(cwd = process.cwd()) {
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8", shell: false });
  if (result.status !== 0) throw new Error(`Unable to resolve HEAD: ${result.stderr}`);
  return result.stdout.trim();
}

export function validateFreshEvidence(payload, { startedAt, head, gate, reportPath } = {}) {
  if (!payload || payload.decision !== "PASS" || payload.current_run !== true) {
    throw Object.assign(new Error(`${gate}: current evidence is not PASS.`), { code: "QA_CHILD_EVIDENCE_NOT_PASS", reportPath });
  }
  if (payload.head !== head) throw Object.assign(new Error(`${gate}: evidence HEAD ${payload.head} differs from ${head}.`), { code: "QA_CHILD_EVIDENCE_WRONG_HEAD", reportPath });
  if (!payload.run_id || !payload.started_at || Date.parse(payload.started_at) < startedAt - 2_000) {
    throw Object.assign(new Error(`${gate}: evidence is stale or lacks current run identity.`), { code: "QA_CHILD_EVIDENCE_STALE", reportPath });
  }
  if (payload.finished_at && Date.parse(payload.finished_at) < Date.parse(payload.started_at)) {
    throw Object.assign(new Error(`${gate}: invalid evidence timestamps.`), { code: "QA_CHILD_EVIDENCE_TIME", reportPath });
  }
  return payload;
}

export async function runLocalValidator({ name, script, nodeArgs = [], reportPath, env = {}, cwd = process.cwd() }) {
  const startedAt = Date.now();
  const head = currentHead(cwd);
  const child = spawn(process.execPath, [...nodeArgs, resolve(cwd, script)], {
    cwd,
    env: { ...process.env, ...env },
    shell: false,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += chunk; process.stdout.write(chunk); });
  child.stderr.on("data", (chunk) => { stderr += chunk; process.stderr.write(chunk); });
  const exitCode = await new Promise((resolveExit, reject) => {
    child.once("error", reject);
    child.once("exit", (code) => resolveExit(code ?? 1));
  });
  if (exitCode !== 0) {
    const error = new Error(`${name} exited with code ${exitCode}.`);
    error.code = "QA_CHILD_EXIT";
    error.details = { stdout: stdout.slice(-4000), stderr: stderr.slice(-4000) };
    throw error;
  }
  let evidence;
  if (reportPath) {
    evidence = validateFreshEvidence(JSON.parse(readFileSync(resolve(cwd, reportPath), "utf8")), { startedAt, head, gate: name, reportPath });
  }
  return { name, exitCode, runId: evidence?.run_id || null, evidence, elapsedMs: Date.now() - startedAt };
}
