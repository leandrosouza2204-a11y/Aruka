import { redactForLogs } from "../security/redaction.js";

export function createMemoryLogger() {
  const entries = [];
  const push = (level, payload) => entries.push({ level, ...redactForLogs(payload) });
  return {
    debug: (payload) => push("debug", payload),
    info: (payload) => push("info", payload),
    warn: (payload) => push("warn", payload),
    error: (payload) => push("error", payload),
    entries: () => entries.map((entry) => structuredClone(entry)),
  };
}
