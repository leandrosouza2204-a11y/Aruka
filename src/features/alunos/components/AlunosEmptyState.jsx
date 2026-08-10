import EmptyState from "../../../components/EmptyState";

function AlunosEmptyState({ hasActiveFilters = false, onNovoAluno, totalAlunos = 0 }) {
  if (hasActiveFilters && totalAlunos > 0) {
    return (
      <EmptyState
        titulo="Nenhum aluno encontrado para os filtros atuais."
        descricao="Ajuste a busca, o status ou o plano para ver outros alunos."
      />
    );
  }

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
