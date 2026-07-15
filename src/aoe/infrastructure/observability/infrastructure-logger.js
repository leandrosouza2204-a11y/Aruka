import { redactForLogs } from "../../security/index.js";

export function createInfrastructureLogger(consoleLike = console) {
  return {
    debug: (payload) => consoleLike.debug?.(JSON.stringify(redactForLogs(payload))),
    info: (payload) => consoleLike.info?.(JSON.stringify(redactForLogs(payload))),
    warn: (payload) => consoleLike.warn?.(JSON.stringify(redactForLogs(payload))),
    error: (payload) => consoleLike.error?.(JSON.stringify(redactForLogs(payload))),
  };
}
