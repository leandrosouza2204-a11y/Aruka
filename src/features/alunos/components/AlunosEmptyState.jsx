import EmptyState from "../../../components/EmptyState";

function AlunosEmptyState({ onNovoAluno }) {
  return (
    <EmptyState
      titulo="Nenhum aluno cadastrado ainda."
      descricao="Cadastre o primeiro aluno para acompanhar pagamentos, treinos e avaliações."
      acaoLabel="Novo aluno"
      onAcao={onNovoAluno}
    />
  );
}

export default AlunosEmptyState;
