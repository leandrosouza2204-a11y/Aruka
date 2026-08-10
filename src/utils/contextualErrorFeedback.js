export function userFacingError(action, error) {
  const code = String(error?.code || "").trim();
  const message = String(error?.message || error || "").toLowerCase();

  if (code === "42501" || message.includes("permission") || message.includes("permiss")) {
    return `Você não tem permissão para ${action}.`;
  }

  if (code === "PGRST116" || message.includes("not found") || message.includes("não encontrado")) {
    return `Não encontramos o registro necessário para ${action}. Atualize a página e tente novamente.`;
  }

  if (code === "23505" || message.includes("duplicate") || message.includes("duplic")) {
    return `Já existe um registro com essas informações. Revise os dados antes de ${action}.`;
  }

  if (message.includes("network") || message.includes("fetch") || message.includes("failed to fetch")) {
    return `Não foi possível conectar para ${action}. Verifique sua conexão e tente novamente.`;
  }

  return `Não foi possível ${action}. Tente novamente em alguns instantes.`;
}
