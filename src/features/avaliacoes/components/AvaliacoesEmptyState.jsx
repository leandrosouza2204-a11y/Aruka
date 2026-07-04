function AvaliacoesEmptyState({ onNovaAvaliacao, onNovaAnamnese }) {
  return (
    <div className="avaliacoes-empty-state">
      <h3>Nenhum registro encontrado.</h3>
      <p>
        Crie uma avaliação física ou uma anamnese para iniciar o acompanhamento do aluno.
      </p>
      <div className="avaliacoes-empty-actions">
        <button className="table-button table-button-primary" onClick={onNovaAvaliacao}>
          Nova avaliação
        </button>
        <button className="table-button table-button-secondary" onClick={onNovaAnamnese}>
          Nova anamnese
        </button>
      </div>
    </div>
  );
}

export default AvaliacoesEmptyState;
