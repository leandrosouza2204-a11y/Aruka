import { PublicErrorCode } from "../public/public-enums.js";

export class AOEApplicationError extends Error {
  constructor(message, { code = PublicErrorCode.INTERNAL_ERROR, retryable = false, status = 500, details = [] } = {}) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.retryable = retryable;
    this.status = status;
    this.details = details;
  }
}

export class AOEAuthorizationError extends AOEApplicationError {
  constructor(message = "Acesso não autorizado.") {
    super(message, { code: PublicErrorCode.FORBIDDEN, status: 403 });
  }
}

export class AOEIdempotencyConflictError extends AOEApplicationError {
  constructor(message = "Conflito de idempotência.") {
    super(message, { code: PublicErrorCode.IDEMPOTENCY_CONFLICT, status: 409 });
  }
}

export class AOEPersistenceError extends AOEApplicationError {
  constructor(message = "Falha de persistência.") {
    super(message, { code: PublicErrorCode.INTERNAL_ERROR, status: 500, retryable: true });
  }
}

export class AOEServiceUnavailableError extends AOEApplicationError {
  constructor(message = "Serviço indisponível.") {
    super(message, { code: PublicErrorCode.SERVICE_UNAVAILABLE, status: 503, retryable: true });
  }
}

export class AOEReviewTransitionError extends AOEApplicationError {
  constructor(message = "Transição de revisão inválida.") {
    super(message, { code: PublicErrorCode.INVALID_REVIEW_TRANSITION, status: 409 });
  }
}

export class AOEResourceNotFoundError extends AOEApplicationError {
  constructor(message = "Recurso não encontrado.", code = PublicErrorCode.DECISION_NOT_FOUND) {
    super(message, { code, status: 404 });
  }
}

export function mapErrorToPublicError(error) {
  if (error instanceof AOEApplicationError) return error;
  return new AOEApplicationError("Erro interno ao processar a solicitação.", { code: PublicErrorCode.INTERNAL_ERROR, status: 500, retryable: false });
}
