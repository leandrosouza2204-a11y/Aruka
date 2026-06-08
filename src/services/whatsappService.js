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
      `Olá, ${nome}! Tudo bem? 👋`,
      "Passando para nosso check-in semanal: como foram os treinos, alimentação e rotina essa semana?",
      "Teve alguma dificuldade, dor ou algo que precise ajustar?",
      "Me responde por aqui para eu acompanhar melhor sua evolução. 💪",
    ].join("\n");
  }

  return [
    `Olá, ${nome}! Tudo bem? 👋`,
    "",
    "Passando para fazer nosso check-in semanal da consultoria.",
    "",
    "Me conta rapidinho:",
    "",
    "1️⃣ Como foi sua semana de treinos?",
    "2️⃣ Conseguiu executar todos os treinos planejados?",
    "3️⃣ Sentiu alguma dor, desconforto ou dificuldade?",
    "4️⃣ Como foi sua alimentação durante a semana?",
    "5️⃣ Teve alguma dificuldade com rotina, sono, disposição ou motivação?",
    "",
    "Sua resposta me ajuda a ajustar o acompanhamento e deixar o plano cada vez mais alinhado com sua realidade. 💪",
    "",
    "Pode me responder por aqui mesmo.",
  ].join("\n");
}

function primeiroNome(nome) {
  const primeiro = String(nome || "").trim().split(/\s+/)[0];
  return primeiro || "aluno";
}
