const FALLBACK_MESSAGES = {
  load: {
    title: "Não foi possível carregar os treinos.",
    description: "Verifique sua conexao e tente novamente.",
  },
  duplicate: {
    title: "Não foi possível duplicar este treino.",
    description: "O treino original foi preservado. Tente novamente em instantes.",
  },
  delete: {
    title: "O treino nao foi excluido.",
    description: "Tente novamente em instantes.",
  },
  save: {
    title: "Não foi possível salvar o treino.",
    description: "Revise os dados e tente novamente.",
  },
};

export function criarErroTreinos(tipo, error) {
  const fallback = FALLBACK_MESSAGES[tipo] || FALLBACK_MESSAGES.load;
  const message = normalizarMensagemErro(error);

  return {
    tipo,
    title: fallback.title,
    description: message || fallback.description,
    retryable: tipo === "load",
  };
}

export function normalizarMensagemErro(error) {
  const texto = String(error?.message || error || "").trim();
  if (!texto) return "";

  if (/local_qa|falha controlada/i.test(texto)) {
    return "Falha controlada de QA. Tente novamente quando o servico estiver disponivel.";
  }

  if (/jwt|auth|session|login|usu[aá]rio|not authenticated|unauthorized/i.test(texto)) {
    return "Sua sessao pode ter expirado. Entre novamente e tente de novo.";
  }

  if (/fetch|network|failed to fetch|timeout|internet|conex/i.test(texto)) {
    return "Verifique sua conexao e tente novamente.";
  }

  return "";
}
