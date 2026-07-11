import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";

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
              <span className={classeStatusAluno(registro.statusFinanceiro)}>
                {registro.statusFinanceiro}
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
                {formatarParcela(registro)} -{" "}
                <span className="card-money">{formatarMoeda(registro.valorParcela)}</span>
              </strong>
            </div>
            <div className="card-row">
              <span className="card-label">Vencimento do plano</span>
              <strong className="card-value">{formatarData(registro.aluno.vencimento)}</strong>
            </div>
            {registro.vencimentoParcelaAtual && (
              <>
                <div className="card-row">
                  <span className="card-label">Vencimento da parcela</span>
                  <strong className="card-value">
                    {formatarData(registro.vencimentoParcelaAtual)}
                  </strong>
                </div>
                <div className="card-row">
                  <span className="card-label">Aviso da parcela</span>
                  <strong className="card-value">
                    7 dias: {formatarData(registro.aviso7Parcela)} | 1 dia:{" "}
                    {formatarData(registro.aviso1Parcela)}
                  </strong>
                </div>
              </>
            )}
            <div className="card-row">
              <span className="card-label">Status</span>
              <strong className="card-value">{formatarStatusPagamento(registro)}</strong>
            </div>
            {registro.ultimoPagamento && (
              <div className="card-row">
                <span className="card-label">Último pagamento</span>
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
                      Ver histórico
                    </TableActionItem>
                    <TableActionItem onClick={() => onRelatorioAluno(registro)} variant="primary">
                      Relatório do aluno
                    </TableActionItem>
                    <TableActionItem onClick={() => onDesfazer(registro)} variant="danger">
                      Desfazer último pagamento
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

function formatarParcela(registro) {
  if (!registro.parcelado) {
    return `${registro.parcelaAtual}/${registro.totalParcelas}`;
  }

  if (registro.quitado) {
    return `Quitado ${registro.totalParcelas}/${registro.totalParcelas}`;
  }

  return `Próxima ${registro.proximaParcela}/${registro.totalParcelas}`;
}

function formatarStatusPagamento(registro) {
  if (!registro.parcelado) {
    return registro.recebidoNoCiclo
      ? `Recebido em ${formatarData(registro.pagamentoCiclo?.dataPagamento)}`
      : "Pendente";
  }

  if (!registro.ultimaParcelaPaga) {
    return `Próxima parcela ${registro.proximaParcela}/${registro.totalParcelas} vence em ${formatarData(
      registro.proximoVencimento
    )}`;
  }

  const ultima = `Parcela paga ${registro.ultimaParcelaPaga}/${registro.totalParcelas} em ${formatarData(
    registro.dataUltimoPagamento
  )}`;

  if (registro.quitado) {
    return ultima;
  }

  return `${ultima}. Próxima ${registro.proximaParcela}/${registro.totalParcelas} vence em ${formatarData(
    registro.proximoVencimento
  )}`;
}

export default FinanceiroMobileCards;
