import { Dumbbell } from "lucide-react";

function TreinosEmptyState({ onNovoTreino, onUsarModelo }) {
  return (
    <div className="treinos-library-empty app-card app-section">
      <div className="treinos-library-empty-icon">
        <Dumbbell size={24} />
      </div>
      <h3>Nenhum treino cadastrado.</h3>
      <p className="app-muted">
        Crie uma rotina ou comece por um modelo rápido para montar a prescrição do aluno.
      </p>
      <div className="treinos-library-empty-actions">
        <button className="app-button app-button-primary table-button table-button-primary" onClick={onNovoTreino}>
          Novo treino
        </button>
        <button className="app-button app-button-secondary table-button table-button-secondary" onClick={onUsarModelo}>
          Usar modelo rápido
        </button>
      </div>
    </div>
  );
}

export default TreinosEmptyState;
