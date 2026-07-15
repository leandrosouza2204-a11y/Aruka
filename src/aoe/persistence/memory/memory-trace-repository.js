const clone = (value) => value == null ? value : structuredClone(value);

export function createMemoryDecisionTraceRepository() {
  const byDecisionId = new Map();
  return {
    async save(traceRecord) {
      byDecisionId.set(traceRecord.decisionId, clone(traceRecord));
      return clone(traceRecord);
    },
    async findByDecisionId(decisionId) {
      return clone(byDecisionId.get(decisionId) ?? null);
    },
    async deleteByDecisionId(decisionId) {
      return byDecisionId.delete(decisionId);
    },
    snapshot() {
      return clone([...byDecisionId.values()]);
    },
    restore(items) {
      byDecisionId.clear();
      for (const item of items) byDecisionId.set(item.decisionId, clone(item));
    },
  };
}
