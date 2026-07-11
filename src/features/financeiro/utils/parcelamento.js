export function calcularSituacaoParcelamento({
  aluno = {},
  plano = null,
  pagamentos = [],
  totalParcelas = 1,
  hoje = new Date(),
} = {}) {
  const quantidadeParcelas = Math.max(Number(totalParcelas || 1), 1);
  const intervaloParcelasMeses = Math.max(Number(plano?.intervaloParcelasMeses || 1), 1);
  const parcelado = quantidadeParcelas > 1;
  const pagamentosPorParcela = new Map();

  if (!parcelado) {
    return {
      parcelado: false,
      totalParcelas: 1,
      parcelasPagas: 0,
      ultimaParcelaPaga: null,
      dataUltimoPagamento: "",
      proximaParcela: 1,
      proximoVencimento: aluno.vencimento || "",
      parcelasRestantes: 0,
      quitado: false,
      vencido: false,
      pagamentoUltimaParcela: null,
    };
  }

  ordenarPagamentos(pagamentos)
    .filter((pagamento) => Number(pagamento.valor || 0) > 0)
    .forEach((pagamento) => {
      const parcela = normalizarParcela(pagamento.parcela, quantidadeParcelas);

      if (!parcela || pagamentosPorParcela.has(parcela)) return;

      pagamentosPorParcela.set(parcela, pagamento);
    });

  const parcelasPagasLista = Array.from(pagamentosPorParcela.keys()).sort((a, b) => a - b);
  const parcelasPagas = parcelasPagasLista.length;
  const ultimaParcelaPaga = parcelasPagasLista[parcelasPagasLista.length - 1] || null;
  const pagamentoUltimaParcela = ultimaParcelaPaga
    ? pagamentosPorParcela.get(ultimaParcelaPaga)
    : null;
  const proximaParcela =
    Array.from({ length: quantidadeParcelas }, (_, index) => index + 1).find(
      (parcela) => !pagamentosPorParcela.has(parcela)
    ) || null;
  const quitado = !proximaParcela;
  const proximoVencimento = quitado
    ? ""
    : calcularVencimentoParcela(aluno.inicio, proximaParcela, intervaloParcelasMeses);
  const parcelasRestantes = Math.max(quantidadeParcelas - parcelasPagas, 0);

  return {
    parcelado,
    totalParcelas: quantidadeParcelas,
    parcelasPagas,
    ultimaParcelaPaga,
    dataUltimoPagamento: pagamentoUltimaParcela?.dataPagamento || "",
    proximaParcela,
    proximoVencimento,
    parcelasRestantes,
    quitado,
    vencido: !quitado && dataEstaVencida(proximoVencimento, hoje),
    pagamentoUltimaParcela,
  };
}

export function calcularVencimentoParcela(inicio, parcela = 1, intervaloMeses = 1) {
  if (!inicio) return "";

  const data = new Date(`${inicio}T00:00:00`);
  if (Number.isNaN(data.getTime())) return "";

  const diaOriginal = data.getDate();
  data.setMonth(
    data.getMonth() +
      Math.max(Number(parcela || 1) - 1, 0) * Math.max(Number(intervaloMeses || 1), 1)
  );

  if (data.getDate() !== diaOriginal) {
    data.setDate(0);
  }

  return data.toISOString().split("T")[0];
}

function normalizarParcela(valor, totalParcelas) {
  const parcela = Number(valor || 0);

  if (!Number.isFinite(parcela)) return null;
  if (parcela < 1 || parcela > totalParcelas) return null;

  return Math.trunc(parcela);
}

function ordenarPagamentos(pagamentos) {
  return [...pagamentos].sort((a, b) => {
    const data = String(b.dataPagamento || "").localeCompare(String(a.dataPagamento || ""));
    if (data !== 0) return data;

    return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });
}

function dataEstaVencida(dataISO, hoje) {
  const alvo = extrairPartesData(dataISO);
  const atual = extrairPartesData(hoje);

  if (!alvo || !atual) return false;

  const alvoUtc = Date.UTC(alvo.ano, alvo.mes - 1, alvo.dia);
  const atualUtc = Date.UTC(atual.ano, atual.mes - 1, atual.dia);

  return alvoUtc < atualUtc;
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
