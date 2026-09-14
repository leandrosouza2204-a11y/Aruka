export async function sanitizeStudentInviteError(error) {
  const payload = await readFunctionErrorPayload(error);
  return sanitizeStudentInvitePayload(payload);
}

export function sanitizeStudentInvitePayload(payload = {}) {
  if (payload?.code === "ALREADY_REGISTERED_UNLINKED") {
    return new Error(
      "Este e-mail já possui uma conta no Aruka. Use outro e-mail ou utilize o fluxo de vinculação quando ele estiver disponível."
    );
  }
  if (payload?.code === "RATE_LIMIT") {
    return new Error("Muitas tentativas de convite. Aguarde alguns instantes e tente novamente.");
  }
  if (payload?.code === "DUPLICATE_ACCESS_EMAIL") return new Error("Este e-mail já está vinculado a outro acesso.");
  if (payload?.code === "INVALID_EMAIL") return new Error("Informe um e-mail válido.");
  if (payload?.code === "ACCESS_ACTIVE") return new Error("O acesso deste aluno já está ativo. A alteração do e-mail exige um fluxo específico.");
  return new Error("Não foi possível enviar o convite agora.");
}

async function readFunctionErrorPayload(error) {
  const response = error?.context;
  if (!response || typeof response.json !== "function") return {};

  try {
    return await response.json();
  } catch {
    return {};
  }
}
