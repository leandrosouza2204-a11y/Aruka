const EMOJIS = {
  wave: "\u{1F44B}",
  muscle: "\u{1F4AA}",
  check: "\u2705",
  chart: "\u{1F4C8}",
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

  if (!numeros) return "";
  if (numeros.startsWith("55")) return numeros;

  return `55${numeros}`;
}

export function gerarLinkWhatsApp(telefone, mensagem) {
  const telefoneNormalizado = normalizarTelefoneWhatsApp(telefone);

  if (!telefoneNormalizado) return "";

  return `https://wa.me/${telefoneNormalizado}?text=${encodeURIComponent(
    mensagem
  )}`;
}

export function abrirWhatsApp(telefone, mensagem) {
  const link = gerarLinkWhatsApp(telefone, mensagem);

  if (!link) {
    window.prompt(
      "WhatsApp nao cadastrado. Copie a mensagem abaixo:",
      mensagem
    );
    return;
  }

  window.open(link, "_blank", "noopener,noreferrer");
}

export function gerarMensagemCheckinSemanal(aluno, versao = "completa") {
  const nome = primeiroNome(aluno?.nome);

  if (versao === "curta") {
    return [
      `Ol\u00E1, ${nome}! Tudo bem? ${EMOJIS.wave}`,
      "Passando para nosso check-in semanal: como foram os treinos, alimenta\u00E7\u00E3o e rotina essa semana?",
      "Teve alguma dificuldade, dor ou algo que precise ajustar?",
      `Me responde por aqui para eu acompanhar melhor sua evolu\u00E7\u00E3o. ${EMOJIS.muscle}`,
    ].join("\n");
  }

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

function primeiroNome(nome) {
  const primeiro = String(nome || "").trim().split(/\s+/)[0];
  return primeiro || "aluno";
}
