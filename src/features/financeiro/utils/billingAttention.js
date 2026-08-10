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
  const dataReferencia = parcelado && !situacaoParcelamento.quitado
    ? situacaoParcelamento.proximoVencimento
    : aluno.vencimento || "";
  const status = parcelado && !situacaoParcelamento.quitado
    ? calcularStatus(dataReferencia, "trimestralParcelado", hoje)
    : calcularStatus(dataReferencia, aluno.plano, hoje);
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
    tipo: parcelado ? "parcela" : "contrato",
    status,
    dataReferencia,
    diasAteVencimento,
    vencendo,
    urgente,
    vencido,
    requerAtencao: vencendo || vencido,
    situacaoParcelamento,
    totalParcelas,
  };
}

export function statusCombinaAtencaoCobranca(statusFiltro, atencao) {
  if (!statusFiltro || statusFiltro === "todos") return true;
  if (statusFiltro === "Vencendo") return Boolean(atencao?.vencendo);
  if (statusFiltro === "Vencido") return Boolean(atencao?.vencido);

  return atencao?.status === statusFiltro;
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
