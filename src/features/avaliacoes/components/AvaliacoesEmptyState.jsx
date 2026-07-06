function AvaliacoesEmptyState({ onNovaAvaliacao, onNovaAnamnese }) {
  return (
    <div className="app-empty-state avaliacoes-empty-state app-section">
      <h3>Nenhum registro encontrado.</h3>
      <p className="app-muted">
        Crie uma avaliação física ou uma anamnese para iniciar o acompanhamento do aluno.
      </p>
      <div className="avaliacoes-empty-actions">
        <button className="app-button app-button-primary table-button table-button-primary" onClick={onNovaAvaliacao}>
          Nova avaliação
        </button>
        <button className="app-button app-button-secondary table-button table-button-secondary" onClick={onNovaAnamnese}>
          Nova anamnese
        </button>
      </div>
    </div>
  );
}

export default AvaliacoesEmptyState;
