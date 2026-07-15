export function createInfrastructureMetrics(logger = null) {
  return {
    increment(name, labels = {}, value = 1) {
      logger?.debug?.({ metric: name, type: "counter", labels, value });
    },
    observe(name, value, labels = {}) {
      logger?.debug?.({ metric: name, type: "histogram", labels, value });
    },
    gauge(name, value, labels = {}) {
      logger?.debug?.({ metric: name, type: "gauge", labels, value });
    },
  };
}
