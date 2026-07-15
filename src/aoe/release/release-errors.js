export class AOEReleaseError extends Error {
  constructor(message, code = "AOE_RELEASE_ERROR") {
    super(message);
    this.name = "AOEReleaseError";
    this.code = code;
  }
}
