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
  return `https://wa.me/${telefoneLimpo}?text=${textoCodificado}`;
}

export function abrirWhatsApp(telefone, mensagem) {
  const url = gerarLinkWhatsApp(telefone, mensagem);

  if (!url) {
    window.prompt(
      "WhatsApp nao cadastrado. Copie a mensagem abaixo:",
      mensagem
    );
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

export function gerarMensagemCheckinSemanal(aluno) {
  const nome = primeiroNome(aluno?.nome);

  return [
    `Ola, ${nome}! Tudo bem?`,
    "",
    "Passando para fazer nosso check-in semanal da consultoria.",
    "",
    "Me conta rapidinho:",
    "",
    "1. Como foi sua semana de treinos?",
    "2. Conseguiu executar todos os treinos planejados?",
    "3. Sentiu alguma dor, desconforto ou dificuldade?",
    "4. Como foi sua alimentacao durante a semana?",
    "5. Teve alguma dificuldade com rotina, sono, disposicao ou motivacao?",
    "",
    "Sua resposta me ajuda a ajustar o acompanhamento e deixar o plano cada vez mais alinhado com sua realidade.",
    "",
    "Pode me responder por aqui mesmo.",
  ].join("\n");
}

function primeiroNome(nome) {
  const primeiro = String(nome || "").trim().split(/\s+/)[0];
  return primeiro || "aluno";
}
