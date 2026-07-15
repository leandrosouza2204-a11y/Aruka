export class AOEIdempotencyError extends Error {
  constructor(message, code = "IDEMPOTENCY_CONFLICT") {
    super(message);
    this.name = "AOEIdempotencyError";
    this.code = code;
  }
}
