import { PUBLIC_CONTRACT_VERSION } from "./public-contract-version.js";
import { PublicErrorCode } from "./public-enums.js";

export function createPublicErrorResponse({ requestId = null, code = PublicErrorCode.INTERNAL_ERROR, message = "Não foi possível concluir a solicitação.", details = [], retryable = false, createdAt }) {
  return {
    contractVersion: PUBLIC_CONTRACT_VERSION,
    requestId,
    status: "ERROR",
    error: {
      code,
      message,
      details: details.map((item) => ({ field: item.field, message: item.message })),
      retryable,
    },
    createdAt,
  };
}
