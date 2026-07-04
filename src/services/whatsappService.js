const EMOJIS = {
  wave: "\u{1F44B}",
  check: "\u2705",
  chart: "\u{1F4C8}",
  muscle: "\u{1F4AA}",
  fire: "\u{1F525}",
};

const NUMEROS = {
  um: "1\uFE0F\u20E3",
  dois: "2\uFE0F\u20E3",
  tres: "3\uFE0F\u20E3",
  quatro: "4\uFE0F\u20E3",
  cinco: "5\uFE0F\u20E3",
};

export function normalizarTelefoneWhatsApp(telefone) {
  const numeros = String(telefone || "").replace(/\D/g, "");
  const semZeroInicial = numeros.replace(/^0+/, "");

  if (!semZeroInicial) return "";
  if (semZeroInicial.startsWith("55")) return semZeroInicial;

  return `55${semZeroInicial}`;
}

export function gerarLinkWhatsApp(telefone, mensagem) {
  const telefoneLimpo = normalizarTelefoneWhatsApp(telefone);

  if (!telefoneLimpo) return "";

  const textoCodificado = encodeURIComponent(mensagem);
  return `whatsapp://send?phone=${telefoneLimpo}&text=${textoCodificado}`;
}

export function abrirWhatsApp(telefone, mensagem) {
  const url = gerarLinkWhatsApp(telefone, mensagem);

  if (!url) {
    window.prompt(
      "WhatsApp não cadastrado. Copie a mensagem abaixo:",
      mensagem
    );
    return;
  }

  window.location.href = url;
}

export function gerarMensagemCheckinSemanal(aluno) {
  const nome = obterPrimeiroNome(aluno?.nome);

  return [
    `Ol\u00E1, ${nome}! Tudo bem? ${EMOJIS.wave}`,
    "",
    "Passando para fazer nosso check-in semanal da consultoria.",
    "",
    "Me conta rapidinho:",
    "",
    `${NUMEROS.um} Como foi sua semana de treinos?`,
    `${NUMEROS.dois} Conseguiu executar todos os treinos planejados? ${EMOJIS.check}`,
    `${NUMEROS.tres} Sentiu alguma dor, desconforto ou dificuldade?`,
    `${NUMEROS.quatro} Como foi sua alimenta\u00E7\u00E3o durante a semana? ${EMOJIS.chart}`,
    `${NUMEROS.cinco} Teve alguma dificuldade com rotina, sono, disposi\u00E7\u00E3o ou motiva\u00E7\u00E3o?`,
    "",
    `Sua resposta me ajuda a ajustar o acompanhamento e deixar o plano cada vez mais alinhado com sua realidade. ${EMOJIS.muscle}${EMOJIS.fire}`,
    "",
    "Pode me responder por aqui mesmo.",
  ].join("\n");
}

export function obterPrimeiroNome(nome) {
  const primeiro = String(nome || "").trim().split(/\s+/)[0];
  return primeiro || "aluno";
}
