export function assertMetrics(metrics) {
  for (const method of ["increment", "observe", "gauge"]) {
    if (typeof metrics?.[method] !== "function") throw new Error(`metrics.${method} is required`);
  }
}
