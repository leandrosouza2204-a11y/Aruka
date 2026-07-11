export const STATUS_ACOMPANHAMENTO = {
  ATIVO: "Ativo",
  VENCENDO: "Vencendo",
  AGUARDANDO_RENOVACAO: "Aguardando renovação",
  NAO_RENOVADO: "Não renovado",
  ENCERRADO: "Encerrado",
};

const STATUS_MANUAIS_ENCERRADOS = new Set(["nao_renovado", "cancelado", "encerrado"]);

export function calcularSituacaoAcompanhamento(aluno = {}, hoje = new Date()) {
  const statusManual = String(aluno.acompanhamentoStatus || "").trim();

  if (STATUS_MANUAIS_ENCERRADOS.has(statusManual)) {
    return {
      status: statusManual === "nao_renovado"
        ? STATUS_ACOMPANHAMENTO.NAO_RENOVADO
        : STATUS_ACOMPANHAMENTO.ENCERRADO,
      grupo: "encerrados",
      encerrado: true,
      manual: true,
      diasAposVencimento: calcularDiasAposVencimento(aluno.vencimento, hoje),
      motivo: aluno.acompanhamentoMotivo || "",
      encerradoEm: aluno.acompanhamentoEncerradoEm || "",
    };
  }

  const diasAposVencimento = calcularDiasAposVencimento(aluno.vencimento, hoje);

  if (diasAposVencimento === null || diasAposVencimento < 0) {
    return {
      status: STATUS_ACOMPANHAMENTO.ATIVO,
      grupo: "em_acompanhamento",
      encerrado: false,
      manual: false,
      diasAposVencimento,
      motivo: "",
      encerradoEm: "",
    };
  }

  if (diasAposVencimento === 0) {
    return {
      status: STATUS_ACOMPANHAMENTO.VENCENDO,
      grupo: "em_acompanhamento",
      encerrado: false,
      manual: false,
      diasAposVencimento,
      motivo: "",
      encerradoEm: "",
    };
  }

  if (diasAposVencimento <= 90) {
    return {
      status: STATUS_ACOMPANHAMENTO.AGUARDANDO_RENOVACAO,
      grupo: "em_acompanhamento",
      encerrado: false,
      manual: false,
      diasAposVencimento,
      motivo: "",
      encerradoEm: "",
    };
  }

  return {
    status: STATUS_ACOMPANHAMENTO.ENCERRADO,
    grupo: "encerrados",
    encerrado: true,
    manual: false,
    diasAposVencimento,
    motivo: "Vencido há mais de 90 dias",
    encerradoEm: "",
  };
}

export function calcularDiasAposVencimento(vencimento, hoje = new Date()) {
  const alvo = extrairPartesData(vencimento);
  const atual = extrairPartesData(hoje);

  if (!alvo || !atual) return null;

  const alvoUtc = Date.UTC(alvo.ano, alvo.mes - 1, alvo.dia);
  const atualUtc = Date.UTC(atual.ano, atual.mes - 1, atual.dia);

  return Math.floor((atualUtc - alvoUtc) / (1000 * 60 * 60 * 24));
}

function extrairPartesData(data) {
  if (data instanceof Date) {
    if (Number.isNaN(data.getTime())) return null;

    return {
      ano: data.getFullYear(),
      mes: data.getMonth() + 1,
      dia: data.getDate(),
    };
  }

  const correspondencia = String(data || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!correspondencia) return null;

  return {
    ano: Number(correspondencia[1]),
    mes: Number(correspondencia[2]),
    dia: Number(correspondencia[3]),
  };
}
