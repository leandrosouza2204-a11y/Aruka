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

export function calcularDatas(dataInicio, meses, plano = "", parcela = 1) {
  if (!dataInicio) return {};

  const inicio = new Date(`${dataInicio}T00:00:00`);
  const vencimento = new Date(inicio);
  const mesesAteVencimento =
    plano === "trimestralParcelado"
      ? Math.min(Math.max(Number(parcela || 1), 1), meses)
      : meses;

  vencimento.setMonth(vencimento.getMonth() + mesesAteVencimento);

  const aviso7 = new Date(vencimento);
  aviso7.setDate(aviso7.getDate() - 7);

  const aviso1 = new Date(vencimento);
  aviso1.setDate(aviso1.getDate() - 1);

  return {
    vencimento: vencimento.toISOString().split("T")[0],
    aviso7: aviso7.toISOString().split("T")[0],
    aviso1: aviso1.toISOString().split("T")[0],
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
