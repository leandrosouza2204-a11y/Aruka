import { percentile } from "./percentile.js";

export function summarizeDurations(durations) {
  const total = durations.reduce((sum, value) => sum + value, 0);
  return {
    count: durations.length,
    average: durations.length ? total / durations.length : 0,
    min: durations.length ? Math.min(...durations) : 0,
    max: durations.length ? Math.max(...durations) : 0,
    p50: percentile(durations, 50),
    p90: percentile(durations, 90),
    p95: percentile(durations, 95),
    p99: percentile(durations, 99),
    throughputPerSecond: total > 0 ? (durations.length / total) * 1000 : 0,
  };
}
