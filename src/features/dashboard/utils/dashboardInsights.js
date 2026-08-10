export function montarAlertasConsultoria({
  alunosVencidos,
  alunosVencendo,
  receitaPendente,
}) {
  const alertas = [];

  if (alunosVencidos > 0) {
    alertas.push({
      titulo: "Regularizar alunos vencidos",
      texto: "Priorize contato e renegociacao para evitar perda de acompanhamento.",
      rotulo: "Atencao",
      tom: "danger",
      acao: {
        label: "Ver vencidos",
        to: "/alunos?status=Vencido&origem=dashboard",
        ariaLabel: "Ver alunos filtrados por status vencido",
      },
    });
  }

  if (alunosVencendo > 0) {
    alertas.push({
      titulo: "Enviar lembretes de vencimento",
      texto: "Ha contratos ou parcelas proximos do vencimento que podem ser tratados com antecedencia.",
      rotulo: "Agenda",
      tom: "warning",
      acao: {
        label: "Ver vencimentos",
        to: "/alunos?status=Vencendo&origem=dashboard",
        ariaLabel: "Ver alunos filtrados por status vencendo",
      },
    });
  }

  if (receitaPendente > 0) {
    alertas.push({
      titulo: "Revisar pagamentos pendentes",
      texto: "Confira o financeiro e registre recebimentos ja confirmados.",
      rotulo: "Financeiro",
      tom: "info",
      acao: {
        label: "Ver pendentes",
        to: "/financeiro?pagamento=pendentes",
        ariaLabel: "Abrir financeiro para revisar pagamentos pendentes",
      },
    });
  }

  return alertas;
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function statusEstaVencido(status) {
  if (typeof status === "object" && status !== null) {
    return Boolean(status.vencido);
  }

  return ["Vencido", "Parcela vencida", "Atrasado", "Parcela atrasada"].includes(status);
}

export function gerarResumoReceitaMensal(receitaMensal) {
  const mesesComReceita = receitaMensal.filter((mes) => mes.total > 0);
  const total = receitaMensal.reduce((soma, mes) => soma + mes.total, 0);
  const melhorMes = receitaMensal.reduce(
    (maior, mes) => (mes.total > maior.total ? mes : maior),
    receitaMensal[0] || { rotulo: "", total: 0 }
  );
  const primeiroMes = receitaMensal[0]?.rotulo || "";
  const ultimoMes = receitaMensal[receitaMensal.length - 1]?.rotulo || "";

  return {
    periodo: primeiroMes && ultimoMes ? `${primeiroMes} a ${ultimoMes}` : "",
    total,
    melhorMes,
    mesesSemReceita: receitaMensal.length - mesesComReceita.length,
    linhas: receitaMensal.map((mes) => ({
      ...mes,
      valorFormatado: formatarMoeda(mes.total),
    })),
  };
}

export function montarSinaisFitness({ alunos, avaliacoes, statusPorAluno, treinos }) {
  const alunosElegiveis = alunos.filter(
    (aluno) => !statusEstaVencido(statusPorAluno.get(aluno.id))
  );
  const treinosAtivosPorAluno = new Set(
    treinos
      .filter((treino) => (treino.status || "Ativo") === "Ativo")
      .map((treino) => treino.alunoId)
      .filter(Boolean)
  );
  const avaliacoesPorAluno = new Set(
    avaliacoes.map((avaliacao) => avaliacao.alunoId).filter(Boolean)
  );
  const hoje = new Date().toISOString().slice(0, 10);
  const treinosParaRevisar = treinos.filter(
    (treino) => treino.dataRevisao && treino.dataRevisao <= hoje
  );

  return [
    {
      titulo: "Sem treino ativo",
      valor: alunosElegiveis.filter((aluno) => !treinosAtivosPorAluno.has(aluno.id))
        .length,
      texto: "Alunos nao vencidos sem ficha ativa registrada.",
      modulo: "Treinos",
      to: "/treinos",
    },
    {
      titulo: "Treinos a revisar",
      valor: treinosParaRevisar.length,
      texto: "Fichas com data de revisao vencida ou para hoje.",
      modulo: "Treinos",
      to: "/treinos",
    },
    {
      titulo: "Sem avaliação",
      valor: alunosElegiveis.filter((aluno) => !avaliacoesPorAluno.has(aluno.id)).length,
      texto: "Alunos não vencidos sem avaliação física registrada.",
      modulo: "Avaliacoes",
      to: "/avaliacoes",
    },
  ];
}
