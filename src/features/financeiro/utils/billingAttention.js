import {
  calcularStatus,
  statusEstaVencendo,
  statusEstaVencido,
} from "../../../data/alunosUtils";
import { calcularSituacaoParcelamento } from "./parcelamento";

export const BILLING_ATTENTION_WINDOW_DAYS = 7;
export const BILLING_URGENT_WINDOW_DAYS = 3;

export function montarAtencaoCobranca({
  aluno = {},
  plano = null,
  pagamentos = [],
  hoje = new Date(),
} = {}) {
  const totalParcelas = calcularTotalParcelas(aluno, plano);
  const situacaoParcelamento = calcularSituacaoParcelamento({
    aluno,
    plano,
    pagamentos,
    totalParcelas,
    hoje,
  });
  const parcelado = situacaoParcelamento.parcelado;
  const contrato = montarAtencaoPorData({
    dataReferencia: aluno.vencimento || "",
    status: calcularStatus(aluno.vencimento, aluno.plano, hoje),
    tipo: "contrato",
    hoje,
  });
  const parcela = parcelado && !situacaoParcelamento.quitado
    ? montarAtencaoPorData({
        dataReferencia: situacaoParcelamento.proximoVencimento,
        status: calcularStatus(situacaoParcelamento.proximoVencimento, "trimestralParcelado", hoje),
        tipo: "parcela",
        hoje,
      })
    : montarAtencaoVazia("parcela");
  const prioridade = escolherMaiorPrioridade([parcela, contrato]);
  const tipo = prioridade?.tipo || (parcelado ? "parcela" : "contrato");

  return {
    tipo,
    status: prioridade?.status || "Em dia",
    dataReferencia: prioridade?.dataReferencia || "",
    diasAteVencimento: prioridade?.diasAteVencimento ?? null,
    vencendo: Boolean(prioridade?.vencendo),
    urgente: Boolean(prioridade?.urgente),
    vencido: Boolean(prioridade?.vencido),
    requerAtencao: Boolean(prioridade?.requerAtencao),
    contrato,
    parcela,
    highestPriority: prioridade || montarAtencaoVazia(tipo),
    situacaoParcelamento,
    totalParcelas,
  };
}

export function statusCombinaAtencaoCobranca(statusFiltro, atencao) {
  if (!statusFiltro || String(statusFiltro).toLowerCase() === "todos") return true;
  if (statusFiltro === "Vencendo") return Boolean(atencao?.contrato?.vencendo);
  if (statusFiltro === "Vencido") return Boolean(atencao?.contrato?.vencido);
  if (statusFiltro === "Vencendo parcela") return Boolean(atencao?.parcela?.vencendo || atencao?.parcela?.vencido);
  if (statusFiltro === "Parcela vencida") return Boolean(atencao?.parcela?.vencido);

  return atencao?.status === statusFiltro;
}

export function formatarAtencaoCobranca(atencao, { tipo = "prioridade" } = {}) {
  const item = tipo === "contrato"
    ? atencao?.contrato
    : tipo === "parcela"
      ? atencao?.parcela
      : atencao?.highestPriority || atencao;

  if (!item?.requerAtencao) return "Em dia";

  const prefixo = item.tipo === "parcela" ? "Parcela" : "Contrato";
  if (item.vencido) {
    const dias = Math.abs(Number(item.diasAteVencimento || 0));
    return dias <= 0 ? `${prefixo} vence hoje` : `${prefixo} vencida ha ${dias} dias`;
  }

  if (item.diasAteVencimento === 0) return `${prefixo} vence hoje`;
  if (item.diasAteVencimento === 1) return `${prefixo} vence amanha`;

  return `${prefixo} vence em ${item.diasAteVencimento} dias`;
}

function montarAtencaoPorData({ dataReferencia, status, tipo, hoje }) {
  const diasAteVencimento = calcularDiasAte(dataReferencia, hoje);
  const vencido = statusEstaVencido(status) || (diasAteVencimento !== null && diasAteVencimento < 0);
  const vencendo = statusEstaVencendo(status) ||
    (diasAteVencimento !== null &&
      diasAteVencimento >= 0 &&
      diasAteVencimento <= BILLING_ATTENTION_WINDOW_DAYS);
  const urgente = diasAteVencimento !== null &&
    diasAteVencimento >= 0 &&
    diasAteVencimento <= BILLING_URGENT_WINDOW_DAYS;

  return {
    tipo,
    status,
    dataReferencia,
    diasAteVencimento,
    vencendo,
    urgente,
    vencido,
    requerAtencao: vencendo || vencido,
    prioridade: calcularPrioridade({ vencido, urgente, vencendo }),
  };
}

function montarAtencaoVazia(tipo) {
  return {
    tipo,
    status: "Em dia",
    dataReferencia: "",
    diasAteVencimento: null,
    vencendo: false,
    urgente: false,
    vencido: false,
    requerAtencao: false,
    prioridade: 0,
  };
}

function escolherMaiorPrioridade(itens) {
  return itens
    .filter((item) => item.requerAtencao)
    .sort((a, b) => b.prioridade - a.prioridade)[0] || null;
}

function calcularPrioridade({ vencido, urgente, vencendo }) {
  if (vencido) return 3;
  if (urgente) return 2;
  if (vencendo) return 1;

  return 0;
}

function calcularTotalParcelas(aluno, plano) {
  if (plano?.permiteParcelamento) return Math.max(Number(plano.quantidadeParcelas || 1), 1);
  if (aluno.plano === "trimestralParcelado") return 3;

  return 1;
}

function calcularDiasAte(data, hoje = new Date()) {
  if (!data) return null;

  const alvo = extrairPartesData(data);
  const atual = extrairPartesData(hoje);

  if (!alvo || !atual) return null;

  const alvoUtc = Date.UTC(alvo.ano, alvo.mes - 1, alvo.dia);
  const atualUtc = Date.UTC(atual.ano, atual.mes - 1, atual.dia);

  return Math.round((alvoUtc - atualUtc) / (1000 * 60 * 60 * 24));
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
