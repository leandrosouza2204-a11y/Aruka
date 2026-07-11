export const MOTIVO_OUTRO = "outro";
export const MOTIVO_AUTOMATICO_VENCIMENTO = "vencimento_sem_renovacao";

export const MOTIVOS_ENCERRAMENTO = [
  {
    value: "nao_renovou",
    label: "Não renovou",
    descricao: "Aluno não renovou o acompanhamento ao final do ciclo.",
  },
  {
    value: "financeiro",
    label: "Motivo financeiro",
    descricao: "Encerramento relacionado a preço, orçamento ou prioridade financeira.",
  },
  {
    value: "falta_de_tempo",
    label: "Falta de tempo",
    descricao: "Aluno relatou dificuldade de agenda ou rotina.",
  },
  {
    value: "lesao_ou_saude",
    label: "Lesão ou questão de saúde",
    descricao: "Aluno pausou ou encerrou por limitação física ou saúde.",
  },
  {
    value: "mudanca_de_objetivo",
    label: "Mudança de objetivo",
    descricao: "Objetivo atual deixou de exigir o mesmo acompanhamento.",
  },
  {
    value: "insatisfacao",
    label: "Insatisfação com o acompanhamento",
    descricao: "Aluno demonstrou insatisfação com o serviço ou experiência.",
  },
  {
    value: "falta_de_aderencia",
    label: "Baixa aderência",
    descricao: "Aluno não conseguiu manter a rotina proposta.",
  },
  {
    value: "mudanca_de_profissional",
    label: "Mudou de profissional",
    descricao: "Aluno migrou para outro profissional ou serviço.",
  },
  {
    value: MOTIVO_OUTRO,
    label: "Outro motivo",
    descricao: "Use quando nenhum motivo acima representar bem o encerramento.",
  },
];

const MOTIVOS_POR_VALUE = new Map(
  MOTIVOS_ENCERRAMENTO.map((motivo) => [motivo.value, motivo])
);

const MOTIVOS_LEGADOS = new Map([
  ["Não renovou", "nao_renovou"],
  ["Nao renovou", "nao_renovou"],
  ["nao renovou", "nao_renovou"],
]);

export function normalizarMotivoEncerramento(valor) {
  const motivo = String(valor || "").trim();

  if (!motivo) return "";
  if (MOTIVOS_POR_VALUE.has(motivo)) return motivo;

  return MOTIVOS_LEGADOS.get(motivo) || motivo;
}

export function obterMotivoEncerramento(valor) {
  const motivoNormalizado = normalizarMotivoEncerramento(valor);

  return MOTIVOS_POR_VALUE.get(motivoNormalizado) || {
    value: motivoNormalizado,
    label: motivoNormalizado || "Motivo não informado",
    descricao: "",
  };
}

export function obterLabelMotivoEncerramento(valor) {
  return obterMotivoEncerramento(valor).label;
}

export function obterMotivoEncerramentoParaRegistro(aluno, acompanhamento) {
  if (acompanhamento?.encerrado && !acompanhamento.manual) {
    return {
      value: MOTIVO_AUTOMATICO_VENCIMENTO,
      label: "Vencimento sem renovação",
      detalhe: "",
      automatico: true,
    };
  }

  const motivo = obterMotivoEncerramento(aluno?.acompanhamentoMotivo);

  return {
    value: motivo.value,
    label: motivo.label,
    detalhe: aluno?.acompanhamentoMotivoDetalhe || "",
    automatico: false,
  };
}
