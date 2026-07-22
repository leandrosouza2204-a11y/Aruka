export const MENSAGENS_ALUNO = {
  nomeObrigatorio: "Informe o nome do aluno.",
  whatsappObrigatorio: "Informe o WhatsApp do aluno.",
  whatsappDDD: "O WhatsApp deve conter DDD e numero.",
  whatsappInvalido: "Informe um WhatsApp valido.",
  whatsappDuplicado: "Ja existe um aluno cadastrado com este WhatsApp.",
  nomeDuplicado: "Ja existe um aluno cadastrado com este nome.",
  inicioObrigatorio: "Informe a data de inicio do plano.",
  planoObrigatorio: "Selecione o plano do aluno.",
};

export function normalizarNomeAlunoParaComparacao(nome = "") {
  return String(nome)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export function normalizarTelefoneAluno(telefone = "") {
  return String(telefone).replace(/\D/g, "");
}

export function validarWhatsAppAluno(telefone = "") {
  const texto = String(telefone);
  const caracteresInvalidos = /[A-Za-z]/.test(texto);
  const normalizado = normalizarTelefoneAluno(texto);

  if (!normalizado) {
    return { valido: false, normalizado, mensagem: MENSAGENS_ALUNO.whatsappObrigatorio };
  }

  if (caracteresInvalidos || /^0+$/.test(normalizado)) {
    return { valido: false, normalizado, mensagem: MENSAGENS_ALUNO.whatsappInvalido };
  }

  if (normalizado.length < 10) {
    return { valido: false, normalizado, mensagem: MENSAGENS_ALUNO.whatsappDDD };
  }

  if (normalizado.length > 11) {
    return { valido: false, normalizado, mensagem: MENSAGENS_ALUNO.whatsappInvalido };
  }

  return { valido: true, normalizado, mensagem: "" };
}

export function detectarDuplicidadeAluno(alunos = [], candidato = {}, alunoAtualId = "") {
  const nomeNormalizado = normalizarNomeAlunoParaComparacao(candidato.nome);
  const telefoneNormalizado = normalizarTelefoneAluno(candidato.whatsapp);

  return alunos.reduce(
    (duplicidades, aluno) => {
      if (!aluno || aluno.id === alunoAtualId) return duplicidades;

      if (
        telefoneNormalizado &&
        normalizarTelefoneAluno(aluno.whatsapp) === telefoneNormalizado
      ) {
        duplicidades.whatsapp = duplicidades.whatsapp || aluno;
      }

      if (
        nomeNormalizado &&
        normalizarNomeAlunoParaComparacao(aluno.nome) === nomeNormalizado
      ) {
        duplicidades.nome = duplicidades.nome || aluno;
      }

      return duplicidades;
    },
    { whatsapp: null, nome: null }
  );
}

export function validarCadastroAluno(form, alunos = [], alunoAtualId = "") {
  const erros = {};
  const nomeNormalizado = normalizarNomeAlunoParaComparacao(form.nome);

  if (!nomeNormalizado) {
    erros.nome = MENSAGENS_ALUNO.nomeObrigatorio;
  }

  const whatsapp = validarWhatsAppAluno(form.whatsapp);
  if (!whatsapp.valido) {
    erros.whatsapp = whatsapp.mensagem;
  }

  if (!form.inicio) {
    erros.inicio = MENSAGENS_ALUNO.inicioObrigatorio;
  }

  if (!form.plano) {
    erros.plano = MENSAGENS_ALUNO.planoObrigatorio;
  }

  if (!erros.nome && !erros.whatsapp) {
    const duplicidade = detectarDuplicidadeAluno(alunos, form, alunoAtualId);
    if (duplicidade.whatsapp) erros.whatsapp = MENSAGENS_ALUNO.whatsappDuplicado;
    if (duplicidade.nome) erros.nome = MENSAGENS_ALUNO.nomeDuplicado;
  }

  return erros;
}
