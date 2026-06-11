import { calcularComposicaoCorporal } from "../../../data/calculosCorporais";
import {
  formatarCm,
  formatarData,
  formatarKg,
  formatarPercentual,
  formatarStatus,
} from "../hooks/useAvaliacoesPage";

function AvaliacaoCardMobile({
  avaliacao,
  children,
  isExpanded = false,
  onPerfil,
  onEditar,
  onAnamnese,
  onExcluir,
}) {
  const composicao = calcularComposicaoCorporal(avaliacao);

  return (
    <article className={`mobile-card avaliacao-mobile-card${isExpanded ? " mobile-list-card-expanded" : ""}`}>
      <div className="mobile-card-header">
        <div>
          <strong>{avaliacao.aluno}</strong>
          <span>{formatarData(avaliacao.data)}</span>
        </div>
        <span className="status-badge status-badge-info">
          {formatarStatus(avaliacao.status)}
        </span>
      </div>

      <div className="mobile-card-grid">
        <span>
          <small>Peso</small>
          {formatarKg(avaliacao.peso)}
        </span>
        <span>
          <small>Cintura</small>
          {formatarCm(avaliacao.medidas?.cintura)}
        </span>
        <span>
          <small>% gordura</small>
          {formatarPercentual(composicao.percentualGordura)}
        </span>
        <span>
          <small>IMC</small>
          {composicao.imc || "-"}
        </span>
      </div>

      <div className="mobile-card-actions">
        <button
          onClick={() => onPerfil(avaliacao.aluno)}
          className="table-button table-button-secondary"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Ocultar" : "Perfil"}
        </button>
        <button
          onClick={() => onEditar(avaliacao)}
          className="table-button table-button-primary"
        >
          Editar
        </button>
        <button
          onClick={() => onAnamnese(avaliacao.aluno)}
          className="table-button table-button-secondary"
        >
          Anamnese
        </button>
        <button
          onClick={() => onExcluir(avaliacao.id)}
          className="table-button table-button-danger"
        >
          Excluir
        </button>
      </div>

      {children}
    </article>
  );
}

export default AvaliacaoCardMobile;
