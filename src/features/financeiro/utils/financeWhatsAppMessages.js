import { obterPrimeiroNome } from "../../../services/whatsappService.js";

export function montarMensagemVencimento(registro) {
  const cobrancaParcela = registro.totalParcelas > 1 && registro.vencimentoParcelaAtual;
  const dataReferencia = cobrancaParcela
    ? registro.vencimentoParcelaAtual
    : registro.aluno.vencimento;
  const dataVencimento = formatarData(dataReferencia);
  const dias = calcularDiasAte(dataReferencia);
  const primeiroNome = obterPrimeiroNome(registro.aluno.nome);

  if (dias < 0) {
    return [
      "⚠️ *Consultoria com vencimento pendente*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      `Identifiquei que o vencimento do seu plano de consultoria estava previsto para o dia *${dataVencimento}* e consta como *pendente*.`,
      "",
      "Para regularizar seu acompanhamento e manter o suporte ativo normalmente, peço que realize o pagamento assim que possível.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  if (dias === 0) {
    return [
      "🚨 *Vencimento da consultoria hoje*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      "Hoje é a data de vencimento do seu plano de consultoria.",
      "",
      "💪 Para manter seu acompanhamento ativo, com:",
      "✅ Treino atualizado",
      "✅ Ajustes sempre que necessário",
      "✅ Suporte direto",
      "✅ Acompanhamento da sua evolução",
      "",
      "Peço que realize o pagamento referente à renovação do plano.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  if (dias === 1) {
    return [
      "⏰ *Lembrete de vencimento da consultoria*",
      "",
      `Olá, *${primeiroNome}*! Tudo bem? 😊`,
      "",
      `Passando para lembrar que o vencimento do seu plano de consultoria será *amanhã*, dia *${dataVencimento}*.`,
      "",
      "💪 Para manter seu acompanhamento ativo, com:",
      "✅ Treino atualizado",
      "✅ Ajustes sempre que necessário",
      "✅ Suporte direto",
      "✅ Acompanhamento da sua evolução",
      "",
      "Peço que realize o pagamento até a data de vencimento.",
      "",
      "📲 Qualquer dúvida, estou à disposição.",
    ].join("\n");
  }

  return [
    "📅 *Lembrete de vencimento da consultoria*",
    "",
    `Olá, *${primeiroNome}*! Tudo bem? 😊`,
    "",
    `Passando para lembrar que o vencimento do seu plano de consultoria será em *${dias} dias*, no dia *${dataVencimento}*.`,
    "",
    "💪 Para manter seu acompanhamento ativo, com:",
    "✅ Treino atualizado",
    "✅ Ajustes sempre que necessário",
    "✅ Suporte direto",
    "✅ Acompanhamento da sua evolução",
    "",
    "Peço que se programe para realizar o pagamento até a data de vencimento.",
    "",
    "📲 Qualquer dúvida, estou à disposição.",
  ].join("\n");
}

export function calcularDiasAte(data, hoje = new Date()) {
  if (!data) return null;

  const dataAlvo = extrairPartesData(data);
  const dataAtual = extrairPartesData(hoje);

  if (!dataAlvo || !dataAtual) return null;

  const alvoUtc = Date.UTC(dataAlvo.ano, dataAlvo.mes - 1, dataAlvo.dia);
  const hojeUtc = Date.UTC(dataAtual.ano, dataAtual.mes - 1, dataAtual.dia);

  return Math.round((alvoUtc - hojeUtc) / (1000 * 60 * 60 * 24));
}

function formatarData(data) {
  const partes = extrairPartesData(data);
  if (!partes) return "";

  return `${String(partes.dia).padStart(2, "0")}/${String(partes.mes).padStart(2, "0")}/${partes.ano}`;
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

  const correspondencia = String(data).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!correspondencia) return null;

  return {
    ano: Number(correspondencia[1]),
    mes: Number(correspondencia[2]),
    dia: Number(correspondencia[3]),
  };
}
