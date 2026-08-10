export function getWorkoutLifecycleFeedback(action) {
  if (action === "deliver") {
    return {
      pending: "Entregando treino...",
      successTitle: "Treino entregue",
      successDescription: "A ficha ficou ativa para o aluno.",
      errorTitle: "Não foi possível entregar o treino",
    };
  }
  if (action === "complete") {
    return {
      pending: "Concluindo treino...",
      successTitle: "Treino concluído",
      successDescription: "O ciclo foi finalizado e permanece no histórico.",
      errorTitle: "Não foi possível concluir o treino",
    };
  }
  if (action === "archive") {
    return {
      pending: "Arquivando treino...",
      successTitle: "Treino arquivado",
      successDescription: "A ficha saiu do fluxo principal sem remover dados.",
      errorTitle: "Não foi possível arquivar o treino",
    };
  }
  return {
    pending: "Atualizando treino...",
    successTitle: "Treino atualizado",
    successDescription: "O estado do treino foi atualizado.",
    errorTitle: "Não foi possível atualizar o treino",
  };
}
