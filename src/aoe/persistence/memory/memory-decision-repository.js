const clone = (value) => value == null ? value : structuredClone(value);

export function createMemoryDecisionRepository({ failOnSave = false } = {}) {
  const byId = new Map();
  return {
    async save(decision) {
      if (failOnSave) throw new Error("simulated decision persistence failure");
      if (byId.has(decision.decisionId)) throw new Error("decision already exists");
      byId.set(decision.decisionId, clone(decision));
      return clone(decision);
    },
    async findById(decisionId) {
      return clone(byId.get(decisionId) ?? null);
    },
    async findByRequestId(requestId) {
      return clone([...byId.values()].find((item) => item.requestId === requestId) ?? null);
    },
    async listByStudentId(studentId, options = {}) {
      const limit = options.limit ?? 50;
      return clone([...byId.values()].filter((item) => item.studentId === studentId).slice(0, limit));
    },
    snapshot() {
      return clone([...byId.values()]);
    },
    restore(items) {
      byId.clear();
      for (const item of items) byId.set(item.decisionId, clone(item));
    },
  };
}
