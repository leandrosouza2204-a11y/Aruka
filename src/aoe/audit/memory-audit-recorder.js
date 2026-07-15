export function createMemoryAuditRecorder() {
  const events = [];
  return {
    record(event) {
      events.push(structuredClone(event));
      return event;
    },
    events() {
      return events.map((event) => structuredClone(event));
    },
  };
}
