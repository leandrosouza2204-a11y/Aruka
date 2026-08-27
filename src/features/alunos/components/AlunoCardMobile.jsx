import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
import { normalizarTelefoneWhatsApp } from "../../../services/whatsappService";
import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarAtencaoCobranca } from "../../financeiro/utils/billingAttention";

function AlunoCardMobile({
  aluno,
  children,
  isExpanded = false,
  nomePlano,
  onDetalhes,
  onEditar,
  onExcluir,
  onCheckin,
  signals = [],
}) {
  return (
    <article
      className={`mobile-list-card aluno-mobile-card${isExpanded ? " mobile-list-card-expanded" : ""}`}
      data-testid="aluno-mobile-card"
    >
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
      <div className="card-row">
        <span className="card-label">Cobrança</span>
        <strong className="card-value">{formatarAtencaoCobranca(aluno.atencaoCobranca)}</strong>
      </div>

      {signals.length > 0 && (
        <div className="coach-signal-pills" data-testid="student-list-signals">
          {signals.map((signal) => (
            <span className={`coach-signal-pill coach-signal-${signal.priority.toLowerCase()}`} key={signal.type}>
              {signal.title}
            </span>
          ))}
        </div>
      )}

      <div className="card-actions">
        <button
          aria-expanded={isExpanded}
          onClick={() => onDetalhes(aluno.id)}
          className="table-button table-button-secondary"
          data-testid="aluno-action-details"
        >
          {isExpanded ? "Ocultar" : "Detalhes"}
        </button>
        <button
          onClick={() => onCheckin(aluno)}
          className="table-button table-button-success"
          data-testid="aluno-action-whatsapp"
          disabled={!normalizarTelefoneWhatsApp(aluno.whatsapp)}
        >
          Check-in
        </button>
        <TableActions label={`Mais ações de ${aluno.nome || "aluno"}`}>
          <TableActionItem
            data-testid="aluno-action-edit"
            onClick={() => onEditar(aluno)}
            variant="primary"
          >
            Editar
          </TableActionItem>
          <TableActionItem
            data-testid="aluno-action-delete"
            onClick={() => onExcluir(aluno.id)}
            variant="danger"
          >
            Excluir
          </TableActionItem>
        </TableActions>
      </div>

      {children}
    </article>
  );
}

export default AlunoCardMobile;
