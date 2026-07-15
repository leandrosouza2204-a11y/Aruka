export function createMemoryMetrics() {
  const counters = new Map();
  const observations = [];
  const gauges = new Map();
  return {
    increment(name, labels = {}, value = 1) {
      const key = JSON.stringify({ name, labels });
      counters.set(key, (counters.get(key) ?? 0) + value);
    },
    observe(name, value, labels = {}) {
      observations.push({ name, value, labels });
    },
    gauge(name, value, labels = {}) {
      gauges.set(JSON.stringify({ name, labels }), value);
    },
    snapshot() {
      return {
        counters: [...counters.entries()].map(([key, value]) => ({ ...JSON.parse(key), value })),
        observations: structuredClone(observations),
        gauges: [...gauges.entries()].map(([key, value]) => ({ ...JSON.parse(key), value })),
      };
    },
  };
}
