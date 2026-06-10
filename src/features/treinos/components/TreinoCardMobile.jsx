import { classeStatusTreino, formatarData } from "../hooks/useTreinosPage";

function TreinoCardMobile({
  treino,
  onVisualizar,
  onEditar,
  onDuplicar,
  onExcluir,
}) {
  return (
    <article className="mobile-card treino-mobile-card">
      <div className="mobile-card-header">
        <div>
          <strong>{treino.rotina || "-"}</strong>
          <span>{treino.aluno || "-"}</span>
        </div>
        <span className={classeStatusTreino(treino.status || "Ativo")}>
          {treino.status || "Ativo"}
        </span>
      </div>

      <div className="mobile-card-grid">
        <span>
          <small>Objetivo</small>
          {treino.objetivo || "-"}
        </span>
        <span>
          <small>Nível</small>
          {treino.nivel || "-"}
        </span>
        <span>
          <small>Revisão</small>
          {formatarData(treino.dataRevisao)}
        </span>
        <span>
          <small>Dias</small>
          {treino.dias?.length || 0}
        </span>
      </div>

      <div className="mobile-card-actions">
        <button
          onClick={() => onVisualizar(treino.id)}
          className="table-button table-button-primary"
        >
          Visualizar
        </button>
        <button
          onClick={() => onEditar(treino)}
          className="table-button table-button-secondary"
        >
          Editar
        </button>
        <button
          onClick={() => onDuplicar(treino)}
          className="table-button table-button-secondary"
        >
          Duplicar
        </button>
        <button
          onClick={() => onExcluir(treino.id)}
          className="table-button table-button-danger"
        >
          Excluir
        </button>
      </div>
    </article>
  );
}

export default TreinoCardMobile;
