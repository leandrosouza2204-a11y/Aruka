export function createSupabaseUnitOfWork() {
  return {
    async execute(work) {
      return work();
    },
  };
}
