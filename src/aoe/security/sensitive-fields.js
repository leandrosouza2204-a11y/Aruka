export const SENSITIVE_FIELD_NAMES = new Set([
  "name",
  "nome",
  "email",
  "phone",
  "telefone",
  "address",
  "endereco",
  "notes",
  "observations",
  "observacoes",
  "freeText",
  "medicalData",
]);

export const ALLOWED_LOG_FIELDS = new Set([
  "event",
  "correlationId",
  "requestId",
  "decisionId",
  "reviewId",
  "actorRole",
  "status",
  "durationMs",
  "selectedModel",
  "versions",
  "counts",
  "errorCode",
]);
