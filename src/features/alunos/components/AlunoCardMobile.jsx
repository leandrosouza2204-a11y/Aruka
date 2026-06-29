import { normalizarTelefoneWhatsApp } from "../../../services/whatsappService";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";

function AlunoCardMobile({
  aluno,
  children,
  isExpanded = false,
  nomePlano,
  onDetalhes,
  onEditar,
  onExcluir,
  onCheckin,
}) {
  return (
    <article className={`mobile-list-card aluno-mobile-card${isExpanded ? " mobile-list-card-expanded" : ""}`}>
      <div className="mobile-card-header">
        <div>
          <span className="card-label">Nome</span>
          <strong className="card-value card-title">{aluno.nome || "-"}</strong>
        </div>
        <span className={classeStatusAluno(aluno.status)}>{aluno.status}</span>
      </div>

      <div className="card-row">
        <span className="card-label">WhatsApp</span>
        <strong className="card-value">{aluno.whatsapp || "-"}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Plano</span>
        <strong className="card-value">{nomePlano(aluno.plano)}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Valor</span>
        <strong className="card-value card-money">{formatarMoeda(aluno.valor)}</strong>
      </div>
      <div className="card-row">
        <span className="card-label">Vencimento</span>
        <strong className="card-value">{formatarData(aluno.vencimento)}</strong>
      </div>

      <div className="card-actions">
        <button
          aria-expanded={isExpanded}
          onClick={() => onDetalhes(aluno.id)}
          className="table-button table-button-secondary"
        >
          {isExpanded ? "Ocultar" : "Detalhes"}
        </button>
        <button
          onClick={() => onCheckin(aluno)}
          className="table-button table-button-success"
          disabled={!normalizarTelefoneWhatsApp(aluno.whatsapp)}
        >
          Check-in
        </button>
        <button onClick={() => onEditar(aluno)} className="table-button table-button-primary">
          Editar
        </button>
        <button onClick={() => onExcluir(aluno.id)} className="table-button table-button-danger">
          Excluir
        </button>
      </div>

      {children}
    </article>
  );
}

function classeStatusAluno(status) {
  if (["Ativo"].includes(status)) return "status-badge status-badge-success";
  if (["Vencendo", "Vencendo parcela"].includes(status)) {
    return "status-badge status-badge-warning";
  }
  if (["Vencido", "Parcela vencida", "Atrasado", "Parcela atrasada"].includes(status)) {
    return "status-badge status-badge-danger";
  }

  return "status-badge status-badge-muted";
}

export default AlunoCardMobile;
