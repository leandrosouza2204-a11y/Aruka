export function montarResumoOperacionalAluno(aluno, resultado = {}) {
  return {
    plano: {
      titulo: "Plano",
      estado: aluno?.status || "Sem status",
      detalhe: aluno?.vencimento
        ? `Vencimento em ${formatarData(aluno.vencimento)}`
        : "Sem vencimento cadastrado.",
    },
    tempo: {
      titulo: "Tempo como aluno",
      estado: formatarTempoComoAluno(aluno?.inicio),
      detalhe: aluno?.inicio ? `Início em ${formatarData(aluno.inicio)}` : "Data de início não informada.",
    },
    treino: montarIndicadorTreino(resultado.treinos),
    avaliacao: montarIndicadorAvaliacao(resultado.avaliacoes),
    financeiro: montarIndicadorFinanceiro(resultado.financeiro),
  };
}

export function montarIndicadorTreino(estado) {
  if (!estado || estado.status === "loading") {
    return indicador("Treino", "Carregando...", "Consultando treinos do aluno.");
  }
  if (estado.status === "error") {
    return indicador("Treino", "Erro ao carregar", "Não foi possível carregar o resumo de treinos.", "erro");
  }

  const treinos = estado.data || [];
  const ativo = treinos.find((treino) => (treino.status || "Ativo") === "Ativo");
  if (!ativo) {
    return indicador("Treino", "Sem treino ativo", "Este aluno ainda não possui treino ativo cadastrado.", "vazio");
  }

  return indicador("Treino", "Treino ativo", ativo.rotina || "Rotina sem nome.", "ok");
}

export function montarIndicadorAvaliacao(estado) {
  if (!estado || estado.status === "loading") {
    return indicador("Avaliacoes", "Carregando...", "Consultando avaliacoes do aluno.");
  }
  if (estado.status === "error") {
    return indicador("Avaliações", "Erro ao carregar", "Não foi possível carregar o resumo de avaliações.", "erro");
  }

  const avaliacoes = estado.data || [];
  if (!avaliacoes.length) {
    return indicador("Avaliações", "Sem avaliação", "Nenhuma avaliação foi registrada para este aluno.", "vazio");
  }

  const ultima = [...avaliacoes].sort((a, b) => String(b.data).localeCompare(String(a.data)))[0];
  return indicador(
    "Avaliacoes",
    `Última em ${formatarData(ultima.data)}`,
    `${avaliacoes.length} avaliação(ões) no histórico.`,
    "ok"
  );
}

export function montarIndicadorFinanceiro(estado) {
  if (!estado || estado.status === "loading") {
    return indicador("Financeiro", "Carregando...", "Consultando financeiro do aluno.");
  }
  if (estado.status === "error") {
    return indicador("Financeiro", "Erro ao carregar", "Não foi possível carregar o resumo financeiro.", "erro");
  }

  const resumo = estado.data;
  if (!resumo || !resumo.quantidadePagamentos) {
    return indicador("Financeiro", "Sem registros", "Não há registros financeiros para este aluno.", "vazio");
  }

  return indicador(
    "Financeiro",
    `${resumo.quantidadePagamentos} pagamento(s)`,
    `Total recebido: ${formatarMoeda(resumo.totalPago)}. Proximo vencimento: ${formatarData(resumo.proximoVencimento)}.`,
    resumo.recorrenteEmDia ? "ok" : "atencao"
  );
}

function indicador(titulo, estado, detalhe, tom = "neutro") {
  return { titulo, estado, detalhe, tom };
}

function formatarTempoComoAluno(inicio) {
  if (!inicio) return "Sem inicio";
  const meses = calcularMesesEntre(inicio, new Date());
  if (meses <= 0) return "Menos de 1 mes";
  if (meses === 1) return "1 mes";
  return `${meses} meses`;
}

function calcularMesesEntre(inicio, fim) {
  const dataInicio = new Date(`${inicio}T00:00:00`);
  if (Number.isNaN(dataInicio.getTime())) return 0;
  let meses =
    (fim.getFullYear() - dataInicio.getFullYear()) * 12 +
    fim.getMonth() -
    dataInicio.getMonth();
  if (fim.getDate() < dataInicio.getDate()) meses -= 1;
  return Math.max(meses, 0);
}

function formatarData(valor) {
  if (!valor) return "-";
  const [ano, mes, dia] = String(valor).split("-");
  if (!ano || !mes || !dia) return valor;
  return `${dia}/${mes}/${ano}`;
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
