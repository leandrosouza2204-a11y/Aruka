export const TIPOS_EVENTOS_ACOMPANHAMENTO = [
  {
    value: "acompanhamento_iniciado",
    label: "Acompanhamento iniciado",
    descricao: "Primeiro registro técnico de início do acompanhamento.",
  },
  {
    value: "acompanhamento_encerrado",
    label: "Acompanhamento encerrado",
    descricao: "Encerramento manual do acompanhamento do aluno.",
  },
  {
    value: "acompanhamento_reativado",
    label: "Aluno reativado",
    descricao: "Aluno removido da visão de encerrados e devolvido à operação.",
  },
  {
    value: "plano_renovado",
    label: "Plano renovado",
    descricao: "Renovação de plano ou início de novo ciclo de acompanhamento.",
  },
];

const TIPOS_EVENTOS_POR_VALUE = new Map(
  TIPOS_EVENTOS_ACOMPANHAMENTO.map((tipo) => [tipo.value, tipo])
);

export function isTipoEventoAcompanhamentoValido(value) {
  return TIPOS_EVENTOS_POR_VALUE.has(value);
}

export function obterTipoEventoAcompanhamento(value) {
  if (TIPOS_EVENTOS_POR_VALUE.has(value)) {
    return TIPOS_EVENTOS_POR_VALUE.get(value);
  }

  return {
    value: value || "",
    label: value ? "Evento desconhecido" : "Tipo não informado",
    descricao: "",
  };
}

export function obterLabelTipoEventoAcompanhamento(value) {
  return obterTipoEventoAcompanhamento(value).label;
}
