import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const REPORT_DIR = "reports/supabase-ci-runtime";

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
}

export function assertNoSecrets(value) {
  const text = JSON.stringify(value);
  const checks = [
    /gh[opsu]_[A-Za-z0-9_]+/,
    /github_pat_[A-Za-z0-9_]+/i,
    /eyJ[A-Za-z0-9_-]{20,}\./,
    /sb_secret_[A-Za-z0-9_-]+/i,
    /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
  ];
  if (checks.some((pattern) => pattern.test(text))) throw new Error("Refusing to write evidence containing secret-like content.");
}

export function writeEvidence(root, file, payload) {
  assertNoSecrets(payload);
  const target = join(root, REPORT_DIR, file);
  mkdirSync(dirname(target), { recursive: true });
  const temp = `${target}.tmp-${process.pid}`;
  writeFileSync(temp, `${JSON.stringify(stable(payload), null, 2)}\n`, "utf8");
  renameSync(temp, target);
}

export function nowIso() {
  return new Date().toISOString();
}

export function pendingPayload(reason) {
  return {
    cycle: "9.1",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    primary_error: reason,
  };
}
