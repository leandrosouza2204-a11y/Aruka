export const CONSULTANCY_START_CONFIDENCE = {
  exact: "EXACT",
  high: "DERIVED_HIGH_CONFIDENCE",
  low: "DERIVED_LOW_CONFIDENCE",
  unknown: "UNKNOWN",
};

export function deriveConsultancyStart({ aluno = {}, contratos = [], pagamentos = [], eventos = [], hoje = new Date() } = {}) {
  const today = toISODate(hoje);
  const explicit = validPastDate(aluno.consultoriaInicio, today);
  if (explicit) {
    return {
      date: explicit,
      confidence: aluno.consultoriaInicioConfianca || CONSULTANCY_START_CONFIDENCE.exact,
      source: "alunos.consultoria_inicio",
    };
  }

  const startedEvent = eventos
    .filter((evento) => evento.tipo === "acompanhamento_iniciado")
    .map((evento) => validPastDate(eventDate(evento.ocorridoEm), today))
    .filter(Boolean)
    .sort()[0];

  if (startedEvent) {
    return {
      date: startedEvent,
      confidence: CONSULTANCY_START_CONFIDENCE.exact,
      source: "acompanhamento_eventos.acompanhamento_iniciado",
    };
  }

  const firstContract = contratos
    .map((contrato) => validPastDate(contrato.inicio, today))
    .filter(Boolean)
    .sort()[0];

  if (firstContract) {
    return {
      date: firstContract,
      confidence: CONSULTANCY_START_CONFIDENCE.high,
      source: "aluno_contratos.inicio",
    };
  }

  const firstCoherentPaymentEvidence = pagamentos
    .filter((pagamento) => isRenewalPayment(pagamento))
    .flatMap((pagamento) => [pagamento.vencimentoAnterior])
    .map((date) => validPastDate(date, today))
    .filter(Boolean)
    .sort()[0];

  if (firstCoherentPaymentEvidence) {
    return {
      date: firstCoherentPaymentEvidence,
      confidence: CONSULTANCY_START_CONFIDENCE.low,
      source: "pagamentos.vencimento_anterior",
    };
  }

  const legacyStart = validPastDate(aluno.inicio, today);
  if (legacyStart) {
    return {
      date: legacyStart,
      confidence: CONSULTANCY_START_CONFIDENCE.low,
      source: "alunos.inicio_legacy_current_contract",
    };
  }

  return { date: "", confidence: CONSULTANCY_START_CONFIDENCE.unknown, source: "unknown" };
}

export function deriveCurrentContractTimeline({ aluno = {}, contratos = [] } = {}) {
  const activeContract = [...contratos]
    .filter((contrato) => contrato.status === "ativo")
    .sort((a, b) => String(b.inicio).localeCompare(String(a.inicio)))[0];

  if (activeContract) {
    return {
      id: activeContract.id,
      planoId: activeContract.planoId,
      planoNomeSnapshot: activeContract.planoNomeSnapshot,
      startDate: activeContract.inicio,
      endDate: activeContract.vencimento,
      value: activeContract.valor,
      source: "aluno_contratos.active",
    };
  }

  return {
    id: "",
    planoId: aluno.plano || "",
    planoNomeSnapshot: "",
    startDate: aluno.inicio || "",
    endDate: aluno.vencimento || "",
    value: Number(aluno.valor || 0),
    source: "alunos.current_contract",
  };
}

export function deriveContractHistory({ contratos = [] } = {}) {
  return [...contratos].sort((a, b) => {
    const byStart = String(a.inicio || "").localeCompare(String(b.inicio || ""));
    if (byStart !== 0) return byStart;
    return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
  });
}

export function deriveStudentTenure({ aluno = {}, contratos = [], pagamentos = [], eventos = [], hoje = new Date() } = {}) {
  const consultancyStart = deriveConsultancyStart({ aluno, contratos, pagamentos, eventos, hoje });
  const months = calculateCompleteMonths(consultancyStart.date, hoje);

  return {
    consultancyStart,
    months,
    label: formatStudentTenure(months, consultancyStart.date),
    detail: consultancyStart.date ? `Desde ${formatDateBR(consultancyStart.date)}` : "Data de inicio nao informada.",
  };
}

export function calculateCompleteMonths(start, end = new Date()) {
  if (!start) return 0;
  const startDate = new Date(`${start}T00:00:00`);
  const endDate = end instanceof Date ? end : new Date(`${end}T00:00:00`);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0;

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    endDate.getMonth() -
    startDate.getMonth();

  if (endDate.getDate() < startDate.getDate()) months -= 1;
  return Math.max(months, 0);
}

export function formatStudentTenure(months, start) {
  if (!start) return "Sem inicio";
  if (months <= 0) return "Menos de 1 mes";
  if (months === 1) return "1 mes";
  if (months < 12) return `${months} meses`;

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearText = years === 1 ? "1 ano" : `${years} anos`;
  if (!rest) return yearText;
  return `${yearText} e ${rest === 1 ? "1 mes" : `${rest} meses`}`;
}

export function formatDateBR(value) {
  if (!value) return "-";
  const [year, month, day] = String(value).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function validPastDate(value, today) {
  const date = toISODate(value);
  if (!date || date > today) return "";
  return date;
}

function toISODate(value) {
  if (!value) return "";
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function eventDate(value) {
  return toISODate(value);
}

function isRenewalPayment(pagamento) {
  if (pagamento.tipoMovimento) return pagamento.tipoMovimento === "renovacao_plano";
  return Boolean(pagamento.vencimentoAnterior && pagamento.vencimentoNovo && pagamento.vencimentoAnterior !== pagamento.vencimentoNovo);
}
