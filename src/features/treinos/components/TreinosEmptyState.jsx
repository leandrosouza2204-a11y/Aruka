import EmptyState from "../../../components/EmptyState";

function TreinosEmptyState({ onNovoTreino }) {
  return (
    <EmptyState
      titulo="Nenhum treino cadastrado."
      descricao="Crie uma rotina para organizar dias, exercícios e envio por WhatsApp."
      acaoLabel="Novo treino"
      onAcao={onNovoTreino}
    />
  );
}

export default TreinosEmptyState;
