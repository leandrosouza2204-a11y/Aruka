import { Dumbbell } from "lucide-react";

function TreinosEmptyState({ onNovoTreino, onUsarModelo }) {
  return (
    <div className="treinos-library-empty">
      <div className="treinos-library-empty-icon">
        <Dumbbell size={24} />
      </div>
      <h3>Nenhum treino cadastrado.</h3>
      <p>
        Crie uma rotina ou comece por um modelo rápido para montar a prescrição do aluno.
      </p>
      <div className="treinos-library-empty-actions">
        <button className="table-button table-button-primary" onClick={onNovoTreino}>
          Novo treino
        </button>
        <button className="table-button table-button-secondary" onClick={onUsarModelo}>
          Usar modelo rápido
        </button>
      </div>
    </div>
  );
}

export default TreinosEmptyState;
