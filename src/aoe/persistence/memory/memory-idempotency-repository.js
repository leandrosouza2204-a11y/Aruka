const clone = (value) => value == null ? value : structuredClone(value);

export function createMemoryIdempotencyRepository() {
  const byKey = new Map();
  const locks = new Map();
  async function withKeyLock(key, work) {
    const previous = locks.get(key) ?? Promise.resolve();
    let release;
    const current = new Promise((resolve) => {
      release = resolve;
    });
    locks.set(key, previous.then(() => current));
    await previous;
    try {
      return await work();
    } finally {
      release();
      if (locks.get(key) === current) locks.delete(key);
    }
  }
  return {
    async get(key) {
      return clone(byKey.get(key) ?? null);
    },
    async create(record) {
      if (byKey.has(record.key)) throw new Error("idempotency record already exists");
      byKey.set(record.key, clone(record));
      return clone(record);
    },
    async getOrCreateProcessingRecord(record) {
      return withKeyLock(record.key, async () => {
        const existing = byKey.get(record.key);
        if (existing) return { created: false, record: clone(existing) };
        byKey.set(record.key, clone(record));
        return { created: true, record: clone(record) };
      });
    },
    async update(record) {
      byKey.set(record.key, clone(record));
      return clone(record);
    },
    async deleteExpired(now) {
      let deleted = 0;
      for (const [key, record] of byKey.entries()) {
        if (record.expiresAt && record.expiresAt <= now) {
          byKey.delete(key);
          deleted += 1;
        }
      }
      return deleted;
    },
    snapshot() {
      return clone([...byKey.values()]);
    },
    restore(items) {
      byKey.clear();
      for (const item of items) byKey.set(item.key, clone(item));
    },
  };
}
