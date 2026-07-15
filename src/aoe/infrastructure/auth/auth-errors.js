export class AOEInfrastructureAuthError extends Error {
  constructor(message, code = "UNAUTHORIZED") {
    super(message);
    this.name = "AOEInfrastructureAuthError";
    this.code = code;
  }
}
