export class AOESecurityError extends Error {
  constructor(message, code = "FORBIDDEN") {
    super(message);
    this.name = "AOESecurityError";
    this.code = code;
  }
}
