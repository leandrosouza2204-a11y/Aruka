export function createMemoryUnitOfWork(repositories = []) {
  return {
    async execute(work) {
      const snapshots = repositories
        .filter((repo) => typeof repo.snapshot === "function" && typeof repo.restore === "function")
        .map((repo) => [repo, repo.snapshot()]);
      try {
        return await work();
      } catch (error) {
        for (const [repo, snapshot] of snapshots.reverse()) repo.restore(snapshot);
        throw error;
      }
    },
  };
}
