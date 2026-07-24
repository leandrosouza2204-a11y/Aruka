import { Dumbbell } from "lucide-react";

function TreinosEmptyState({ alunoContextual, onNovoTreino, onUsarModelo }) {
  if (alunoContextual) {
    return (
      <div
        className="app-empty-state treinos-library-empty app-card app-section"
        data-testid="treinos-empty-contextual"
      >
        <div className="treinos-library-empty-icon">
          <Dumbbell size={24} />
        </div>
        <h3>Nenhum treino para {alunoContextual.nome}.</h3>
        <p className="app-muted">
          Este aluno ainda nao possui rotina cadastrada. Crie o primeiro treino ou comece por um modelo rapido.
        </p>
        <div className="treinos-library-empty-actions">
          <button
            className="app-button app-button-primary table-button table-button-primary"
            data-testid="treinos-empty-create"
            onClick={onNovoTreino}
          >
            Criar primeiro treino
          </button>
          <button className="app-button app-button-secondary table-button table-button-secondary" onClick={onUsarModelo}>
            Usar modelo rapido
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="app-empty-state treinos-library-empty app-card app-section"
      data-testid="treinos-empty-state"
    >
      <div className="treinos-library-empty-icon">
        <Dumbbell size={24} />
      </div>
      <h3>Nenhum treino cadastrado.</h3>
      <p className="app-muted">
        Crie uma rotina ou comece por um modelo rapido para montar a prescricao do aluno.
      </p>
      <div className="treinos-library-empty-actions">
        <button className="app-button app-button-primary table-button table-button-primary" onClick={onNovoTreino}>
          Novo treino
        </button>
        <button className="app-button app-button-secondary table-button table-button-secondary" onClick={onUsarModelo}>
          Usar modelo rapido
        </button>
      </div>
    </div>
  );
}

export default TreinosEmptyState;
