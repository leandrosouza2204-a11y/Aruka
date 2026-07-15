import { SENSITIVE_FIELD_NAMES } from "./sensitive-fields.js";

function cloneRedacted(value, { maskIds = false, maxDepth = 8 } = {}, depth = 0, seen = new WeakSet()) {
  if (depth > maxDepth) return "[REDACTED:DEPTH]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.length > 120 ? `${value.slice(0, 32)}...[REDACTED]` : value;
  if (typeof value !== "object") return value;
  if (seen.has(value)) return "[REDACTED:CIRCULAR]";
  seen.add(value);
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => cloneRedacted(item, { maskIds, maxDepth }, depth + 1, seen));
  const output = {};
  for (const [key, item] of Object.entries(value)) {
    if (SENSITIVE_FIELD_NAMES.has(key)) {
      output[key] = "[REDACTED]";
    } else if (maskIds && /Id$/.test(key) && typeof item === "string") {
      output[key] = `${item.slice(0, 4)}...`;
    } else {
      output[key] = cloneRedacted(item, { maskIds, maxDepth }, depth + 1, seen);
    }
  }
  return output;
}

export function redactForLogs(value) {
  return cloneRedacted(value, { maskIds: false, maxDepth: 6 });
}

export function redactForAudit(value) {
  return cloneRedacted(value, { maskIds: false, maxDepth: 8 });
}

export function redactForPublicResponse(value) {
  const redacted = cloneRedacted(value, { maskIds: false, maxDepth: 6 });
  delete redacted?.decisionTrace;
  return redacted;
}
