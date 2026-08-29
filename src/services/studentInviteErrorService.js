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
