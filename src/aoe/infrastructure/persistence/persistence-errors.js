export class AOEInfrastructurePersistenceError extends Error {
  constructor(message, cause = null) {
    super(message);
    this.name = "AOEInfrastructurePersistenceError";
    this.cause = cause;
  }
}

export function assertNoSupabaseError(result, message) {
  if (result?.error) throw new AOEInfrastructurePersistenceError(message, result.error);
  return result;
}
