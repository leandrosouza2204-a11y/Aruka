export class AOEHttpBoundaryError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AOEHttpBoundaryError";
    this.status = status;
  }
}
