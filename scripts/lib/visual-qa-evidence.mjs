import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { spawnSync } from "node:child_process";

const FINAL_FAILURES = new Set(["FAIL", "BLOCKED"]);

function gitValue(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : "UNKNOWN";
}

function serializeError(error, phase) {
  return {
    phase,
    name: error?.name || "Error",
    message: error?.message || String(error),
    code: error?.code || null,
  };
}

function processIsRunning(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error?.code === "EPERM";
  }
}

export function atomicWriteJson(path, payload) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${process.pid}.${randomUUID()}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  renameSync(temporary, path);
}

export function beginVisualQaEvidence({
  gate,
  reportPath,
  cwd = process.cwd(),
  environment = "LOCAL",
  requiredScenarios = [],
  setProcessExitCode = true,
  now = () => new Date(),
  runId = `${gate.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}-${randomUUID().slice(0, 8)}`,
} = {}) {
  if (!gate || !reportPath) throw new Error("gate e reportPath são obrigatórios.");
  const absoluteReportPath = resolve(cwd, reportPath);
  const lockPath = `${absoluteReportPath}.lock`;
  const startedAt = now().toISOString();
  const base = {
    evidence_contract_version: 1,
    run_id: runId,
    gate,
    decision: "PARTIAL",
    current_run: true,
    started_at: startedAt,
    finished_at: null,
    head: gitValue(["rev-parse", "HEAD"], cwd),
    branch: gitValue(["branch", "--show-current"], cwd),
    environment,
    production_accessed: false,
    required_scenarios: requiredScenarios,
    scenarios: [],
    failures: [],
    cleanup: { attempted: false, status: "PENDING", failures: [] },
  };

  mkdirSync(dirname(absoluteReportPath), { recursive: true });
  if (existsSync(lockPath)) {
    let owner = {};
    try { owner = JSON.parse(readFileSync(lockPath, "utf8")); } catch { /* stale or corrupt lock */ }
    if (processIsRunning(owner.pid)) {
      const blocked = {
        ...base,
        decision: "BLOCKED",
        finished_at: now().toISOString(),
        failures: [{ phase: "setup", name: "ConcurrentExecution", message: `Gate already running as ${owner.run_id || "unknown run"}.`, code: "QA_GATE_CONCURRENT" }],
      };
      atomicWriteJson(`${absoluteReportPath}.${runId}.json`, blocked);
      const error = new Error(blocked.failures[0].message);
      error.code = "QA_GATE_CONCURRENT";
      throw error;
    }
    rmSync(lockPath, { force: true });
  }

  let lockHandle;
  try {
    lockHandle = openSync(lockPath, "wx");
    writeFileSync(lockHandle, JSON.stringify({ run_id: runId, pid: process.pid, started_at: startedAt }));
  } catch (error) {
    const blocked = { ...base, decision: "BLOCKED", finished_at: now().toISOString(), failures: [serializeError(error, "setup")] };
    atomicWriteJson(`${absoluteReportPath}.${runId}.json`, blocked);
    throw error;
  } finally {
    if (lockHandle !== undefined) closeSync(lockHandle);
  }

  let state = base;
  let executionPassed = false;
  let finalized = false;
  atomicWriteJson(absoluteReportPath, state);

  const persist = () => atomicWriteJson(absoluteReportPath, state);
  return {
    runId,
    reportPath: absoluteReportPath,
    scenario(name, status, details = {}) {
      state = { ...state, scenarios: [...state.scenarios.filter((item) => item.name !== name), { name, status, ...details }] };
      persist();
    },
    executionSucceeded(payload = {}) {
      executionPassed = true;
      state = { ...state, ...payload, decision: "PARTIAL", current_run: true };
      persist();
    },
    executionFailed(error, phase = "execution", decision = "FAIL") {
      state = { ...state, decision: FINAL_FAILURES.has(decision) ? decision : "FAIL", failures: [...state.failures, serializeError(error, phase)] };
      persist();
    },
    cleanupFailed(error) {
      state = {
        ...state,
        cleanup: { attempted: true, status: "FAIL", failures: [...state.cleanup.failures, serializeError(error, "cleanup")] },
        failures: [...state.failures, serializeError(error, "cleanup")],
      };
      persist();
    },
    finalize({ cleanupAttempted = true } = {}) {
      if (finalized) return state;
      finalized = true;
      const cleanup = state.cleanup.status === "FAIL"
        ? state.cleanup
        : { attempted: cleanupAttempted, status: cleanupAttempted ? "PASS" : "NOT_REQUIRED", failures: [] };
      const required = new Set(requiredScenarios);
      const covered = new Map(state.scenarios.map((scenario) => [scenario.name, scenario.status]));
      const missing = [...required].filter((name) => covered.get(name) !== "PASS");
      if (missing.length) {
        state = { ...state, failures: [...state.failures, { phase: "execution", name: "MissingRequiredScenario", message: `Required scenarios not PASS: ${missing.join(", ")}`, code: "QA_REQUIRED_SCENARIO" }] };
      }
      const decision = executionPassed && state.failures.length === 0 && cleanup.status !== "FAIL" ? "PASS" : (state.decision === "BLOCKED" ? "BLOCKED" : "FAIL");
      state = { ...state, decision, cleanup, finished_at: now().toISOString(), current_run: true };
      persist();
      rmSync(lockPath, { force: true });
      if (setProcessExitCode && decision !== "PASS") process.exitCode = 1;
      return state;
    },
    snapshot() { return structuredClone(state); },
  };
}
