export function dataHojeISO() {
  return new Date().toISOString().split("T")[0];
}

export function calcularStatus(vencimento, plano = "") {
  if (!vencimento) return "Ativo";

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataVencimento = new Date(`${vencimento}T00:00:00`);
  const parcelado = plano === "trimestralParcelado";
  const diferencaDias = Math.ceil(
    (dataVencimento - hoje) / (1000 * 60 * 60 * 24)
  );

  if (diferencaDias < 0) return parcelado ? "Parcela atrasada" : "Atrasado";
  if (diferencaDias <= 7) return parcelado ? "Vencendo parcela" : "Vencendo";

  return "Ativo";
}

export function calcularVencimentoParcela(inicio, parcela = 1, intervaloMeses = 1) {
  if (!inicio) return "";

  const data = new Date(`${inicio}T00:00:00`);
  data.setMonth(
    data.getMonth() +
      Math.max(Number(parcela || 1) - 1, 0) * Math.max(Number(intervaloMeses || 1), 1)
  );

  return data.toISOString().split("T")[0];
}

export function calcularAvisosVencimento(vencimento) {
  if (!vencimento) return { aviso7: "", aviso1: "" };

  const aviso7 = new Date(`${vencimento}T00:00:00`);
  aviso7.setDate(aviso7.getDate() - 7);

  const aviso1 = new Date(`${vencimento}T00:00:00`);
  aviso1.setDate(aviso1.getDate() - 1);

  return {
    aviso7: aviso7.toISOString().split("T")[0],
    aviso1: aviso1.toISOString().split("T")[0],
  };
}

export function calcularResumoParcelasAluno(
  aluno,
  pagamentos = [],
  totalParcelas = 1,
  intervaloParcelasMeses = 1
) {
  const quantidadeParcelas = Math.max(Number(totalParcelas || 1), 1);
  const parcelado = quantidadeParcelas > 1 || aluno.plano === "trimestralParcelado";

  if (!parcelado) {
    return {
      parcelado: false,
      parcelaAtual: 1,
      totalParcelas: 1,
      vencimentoParcelaAtual: "",
      aviso7Parcela: "",
      aviso1Parcela: "",
      statusParcela: "",
      parcelaRecebida: false,
    };
  }

  const parcelasPagas = new Set(
    pagamentos
      .filter((pagamento) => Number(pagamento.valor || 0) > 0)
      .map((pagamento) => Number(pagamento.parcela || 0))
      .filter((parcela) => parcela > 0)
  );
  const parcelaAtual =
    Array.from({ length: quantidadeParcelas }, (_, index) => index + 1).find(
      (parcela) => !parcelasPagas.has(parcela)
    ) || quantidadeParcelas;
  const parcelaRecebida = parcelasPagas.has(parcelaAtual);
  const vencimentoParcelaAtual = calcularVencimentoParcela(
    aluno.inicio,
    parcelaAtual,
    intervaloParcelasMeses
  );
  const avisos = calcularAvisosVencimento(vencimentoParcelaAtual);

  return {
    parcelado: true,
    parcelaAtual,
    totalParcelas: quantidadeParcelas,
    vencimentoParcelaAtual,
    aviso7Parcela: avisos.aviso7,
    aviso1Parcela: avisos.aviso1,
    statusParcela: parcelaRecebida
      ? "Parcela recebida"
      : calcularStatus(vencimentoParcelaAtual, "trimestralParcelado"),
    parcelaRecebida,
  };
}

export function calcularDatas(dataInicio, meses) {
  if (!dataInicio) return {};

  const inicio = new Date(`${dataInicio}T00:00:00`);
  const vencimento = new Date(inicio);

  vencimento.setMonth(vencimento.getMonth() + Number(meses || 1));
  const avisos = calcularAvisosVencimento(vencimento.toISOString().split("T")[0]);

  return {
    vencimento: vencimento.toISOString().split("T")[0],
    aviso7: avisos.aviso7,
    aviso1: avisos.aviso1,
  };
}

export function normalizarAluno(aluno) {
  return {
    ...aluno,
    id: aluno.id || crypto.randomUUID(),
    status: calcularStatus(aluno.vencimento, aluno.plano),
    pagamentoRecebido: aluno.pagamentoRecebido ?? false,
    dataPagamento: aluno.dataPagamento || "",
    observacoes: aluno.observacoes || "",
    historicoPagamentos: aluno.historicoPagamentos || [],
  };
}

export function ordenarPorVencimento(alunos) {
  return [...alunos].sort((a, b) => {
    const statusA = calcularStatus(a.vencimento, a.plano);
    const statusB = calcularStatus(b.vencimento, b.plano);

    if (statusA.includes("atrasada") || statusA === "Atrasado") {
      if (!statusB.includes("atrasada") && statusB !== "Atrasado") return -1;
    }

    if (statusB.includes("atrasada") || statusB === "Atrasado") {
      if (!statusA.includes("atrasada") && statusA !== "Atrasado") return 1;
    }

    const dataA = a.vencimento ? new Date(`${a.vencimento}T00:00:00`) : null;
    const dataB = b.vencimento ? new Date(`${b.vencimento}T00:00:00`) : null;

    if (!dataA && !dataB) return 0;
    if (!dataA) return 1;
    if (!dataB) return -1;

    return dataA - dataB;
  });
}

export function formatarData(data) {
  if (!data) return "-";

  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

export function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatarNomePlano(plano) {
  const mapa = {
    trimestralVista: "Trimestral à vista",
    trimestralParcelado: "Trimestral parcelado",
    semestral: "Semestral",
    mensal: "Mensal",
  };

  if (!plano) return "-";

  return mapa[plano] || plano;
}

export function corStatus(status) {
  switch (status) {
    case "Ativo":
      return "#16a34a";
    case "Vencendo":
    case "Vencendo parcela":
      return "#f59e0b";
    case "Atrasado":
    case "Parcela atrasada":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}
