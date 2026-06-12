import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";

function FinanceiroMobileCards({
  atualizandoId,
  carregando,
  onDesfazer,
  onHistorico,
  onRelatorioAluno,
  onRenovarPlano,
  onReceber,
  onWhatsApp,
  registros,
}) {
  return (
    <div className="mobile-card-list financeiro-mobile-cards">
      {carregando ? (
        <div className="mobile-list-card">Carregando financeiro...</div>
      ) : registros.length === 0 ? (
        <div className="mobile-list-card">Nenhum pagamento encontrado.</div>
      ) : (
        registros.map((registro) => (
          <article key={registro.aluno.id} className="mobile-list-card financeiro-list-card">
            <div className="mobile-card-header">
              <div>
                <span className="card-label">Nome do aluno</span>
                <strong className="card-value card-title">{registro.aluno.nome}</strong>
              </div>
              <span className={classeStatusAluno(registro.aluno.status)}>
                {registro.aluno.status}
              </span>
            </div>

            <div className="card-row">
              <span className="card-label">Plano</span>
              <strong className="card-value">{registro.nomePlano}</strong>
            </div>
            <div className="card-row">
              <span className="card-label">Contrato</span>
              <strong className="card-value card-money">
                {formatarMoeda(registro.valorContrato)}
              </strong>
            </div>
            <div className="card-row">
              <span className="card-label">Total recebido</span>
              <strong className="card-value card-money">
                {formatarMoeda(registro.totalRecebido)}
              </strong>
            </div>
            <div className="card-row">
              <span className="card-label">Parcela</span>
              <strong className="card-value">
                {registro.parcelaAtual}/{registro.totalParcelas} -{" "}
                <span className="card-money">{formatarMoeda(registro.valorParcela)}</span>
              </strong>
            </div>
            <div className="card-row">
              <span className="card-label">Vencimento do plano</span>
              <strong className="card-value">{formatarData(registro.aluno.vencimento)}</strong>
            </div>
            {registro.vencimentoParcelaAtual && (
              <div className="card-row">
                <span className="card-label">Vencimento da parcela</span>
                <strong className="card-value">
                  {formatarData(registro.vencimentoParcelaAtual)}
                </strong>
              </div>
            )}
            <div className="card-row">
              <span className="card-label">Status</span>
              <strong className="card-value">
                {registro.recebidoNoCiclo
                  ? `Recebido em ${formatarData(registro.pagamentoCiclo?.dataPagamento)}`
                  : "Pendente"}
              </strong>
            </div>
            {registro.ultimoPagamento && (
              <div className="card-row">
                <span className="card-label">Ultimo pagamento</span>
                <strong className="card-value">
                  {formatarData(registro.ultimoPagamento.dataPagamento)} -{" "}
                  <span className="card-money">{formatarMoeda(registro.ultimoPagamento.valor)}</span>
                </strong>
              </div>
            )}

            <div className="card-actions financeiro-card-actions">
              <button
                onClick={() => onReceber(registro)}
                className="table-button table-button-success financeiro-action-main"
                disabled={atualizandoId === registro.aluno.id}
              >
                Receber
              </button>
              <button
                onClick={() => onWhatsApp(registro)}
                className="table-button table-button-success"
              >
                WhatsApp
              </button>
              <TableActions>
                <TableActionItem onClick={() => onRenovarPlano(registro)} variant="primary">
                  Renovar plano
                </TableActionItem>
                {registro.pagamentos.length > 0 && (
                  <>
                    <TableActionItem onClick={() => onHistorico(registro)} variant="primary">
                      Ver historico
                    </TableActionItem>
                    <TableActionItem onClick={() => onRelatorioAluno(registro)} variant="primary">
                      Relatorio do aluno
                    </TableActionItem>
                    <TableActionItem onClick={() => onDesfazer(registro)} variant="danger">
                      Desfazer ultimo pagamento
                    </TableActionItem>
                  </>
                )}
              </TableActions>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

function classeStatusAluno(status) {
  if (["Ativo"].includes(status)) return "status-badge status-badge-success";
  if (["Vencendo", "Vencendo parcela"].includes(status)) {
    return "status-badge status-badge-warning";
  }
  if (["Atrasado", "Parcela atrasada"].includes(status)) {
    return "status-badge status-badge-danger";
  }

  return "status-badge status-badge-muted";
}

export default FinanceiroMobileCards;
