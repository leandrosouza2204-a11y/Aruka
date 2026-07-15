export function assertLogger(logger) {
  for (const method of ["debug", "info", "warn", "error"]) {
    if (typeof logger?.[method] !== "function") throw new Error(`logger.${method} is required`);
  }
}
