import { formatarData, formatarEscala } from "../hooks/useAvaliacoesPage";

function AnamneseCardMobile({
  anamnese,
  children,
  isExpanded = false,
  onEditar,
  onPerfil,
  onRelatorio,
}) {
  return (
    <article className={`mobile-card avaliacao-mobile-card${isExpanded ? " mobile-list-card-expanded" : ""}`}>
      <div className="mobile-card-header">
        <div>
          <strong>{anamnese.aluno}</strong>
          <span>{formatarData(anamnese.createdAt)}</span>
        </div>
        <span className="status-badge status-badge-info">Anamnese</span>
      </div>

      <div className="mobile-card-grid">
        <span>
          <small>Objetivo</small>
          {anamnese.objetivoPrincipal || "-"}
        </span>
        <span>
          <small>Sono</small>
          {formatarEscala(anamnese.escalaSono)}
        </span>
        <span>
          <small>Estresse</small>
          {formatarEscala(anamnese.escalaEstresse)}
        </span>
        <span>
          <small>Dores/lesões</small>
          {anamnese.doresLesoes || "-"}
        </span>
      </div>

      <div className="mobile-card-actions">
        <button
          onClick={() => onPerfil(anamnese.alunoId)}
          className="table-button table-button-secondary"
          aria-expanded={isExpanded}
          disabled={!anamnese.alunoId}
        >
          {isExpanded ? "Ocultar" : "Perfil"}
        </button>
        <button
          onClick={() => onEditar(anamnese)}
          className="table-button table-button-primary"
        >
          Editar
        </button>
        <button
          onClick={() => onRelatorio(anamnese)}
          className="table-button table-button-secondary"
          disabled={!anamnese.alunoId}
        >
          Relatório
        </button>
      </div>

      {children}
    </article>
  );
}

export default AnamneseCardMobile;
