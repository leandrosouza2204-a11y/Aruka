import EmptyState from "../../../components/EmptyState";

function AvaliacoesEmptyState({ onNovaAvaliacao }) {
  return (
    <EmptyState
      titulo="Nenhuma avaliação registrada."
      descricao="Registre a primeira avaliação para acompanhar evolução e histórico do aluno."
      acaoLabel="Nova avaliação"
      onAcao={onNovaAvaliacao}
    />
  );
}

export default AvaliacoesEmptyState;
