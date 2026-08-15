import TableActions, { TableActionItem } from "../../../components/TableActions";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
import { formatarAtencaoCobranca } from "../utils/billingAttention";
import FinanceiroEmptyState from "./FinanceiroEmptyState";

function FinanceiroMobileCards({
  atualizandoId,
  carregando,
  onDesfazer,
  onHistorico,
  onMarcarNaoRenovado,
  onRelatorioAluno,
  onRenovarPlano,
  onReceber,
  onReativar,
  onWhatsApp,
  registros,
  visaoAcompanhamento,
}) {
  return (
    <div className="mobile-card-list financeiro-mobile-cards">
      {carregando ? (
        <div className="mobile-list-card">Carregando financeiro...</div>
      ) : registros.length === 0 ? (
        <div className="mobile-list-card">
          <FinanceiroEmptyState visaoAcompanhamento={visaoAcompanhamento} />
        </div>
      ) : (
        registros.map((registro) => (
          <article key={registro.aluno.id} className="mobile-list-card financeiro-list-card">
            <div className="mobile-card-header">
              <div>
                <span className="card-label">Nome do aluno</span>
                <strong className="card-value card-title">{registro.aluno.nome}</strong>
              </div>
              <span className={classeStatusAluno(registro.statusAcompanhamento)}>
                {registro.statusAcompanhamento}
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
              <span className="card-label">Cobrança</span>
              <strong className="card-value">{formatarAtencaoCobranca(registro.atencaoCobranca)}</strong>
            </div>
            <div className="card-row">
              <span className="card-label">Status</span>
              <strong className="card-value">{formatarStatusPagamento(registro)}</strong>
            </div>
            <div className="card-row">
              <span className="card-label">Acompanhamento</span>
              <strong className="card-value">{registro.statusAcompanhamento}</strong>
            </div>
            {registro.grupoAcompanhamento === "encerrados" && (
              <div className="card-row">
                <span className="card-label">Motivo</span>
                <strong className="card-value">{registro.motivoEncerramento.label}</strong>
              </div>
            )}
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
              {registro.podeReceber && (
                <button
                  onClick={() => onReceber(registro)}
                  className="table-button table-button-success financeiro-action-main"
                  disabled={atualizandoId === registro.aluno.id}
                >
                  {getReceberLabel(registro)}
                </button>
              )}
              {registro.grupoAcompanhamento !== "encerrados" && (
                <button
                  onClick={() => onWhatsApp(registro)}
                  className="table-button table-button-success"
                >
                  WhatsApp
                </button>
              )}
              <TableActions>
                {registro.podeReceber && (
                  <TableActionItem onClick={() => onReceber(registro)} variant="success">
                    Registrar pagamento
                  </TableActionItem>
                )}
                <TableActionItem onClick={() => onRenovarPlano(registro)} variant="primary">
                  Renovar plano
                </TableActionItem>
                {registro.grupoAcompanhamento === "encerrados" ? (
                  <TableActionItem onClick={() => onReativar(registro)} variant="primary">
                    Reativar aluno
                  </TableActionItem>
                ) : registro.statusAcompanhamento === "Aguardando renovação" ? (
                  <TableActionItem onClick={() => onMarcarNaoRenovado(registro)} variant="danger">
                    Marcar como não renovado
                  </TableActionItem>
                ) : null}
                <TableActionItem onClick={() => onHistorico(registro)} variant="primary">
                  Ver histórico
                </TableActionItem>
                <TableActionItem onClick={() => onRelatorioAluno(registro)} variant="primary">
                  Relatório do aluno
                </TableActionItem>
                {registro.grupoAcompanhamento !== "encerrados" && registro.pagamentos.length > 0 && (
                  <TableActionItem onClick={() => onDesfazer(registro)} variant="danger">
                    Desfazer último pagamento
                  </TableActionItem>
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

function getReceberLabel(registro) {
  return registro.statusAcompanhamento === "Aguardando renovação"
    ? "Receber débito"
    : "Receber";
}

export default FinanceiroMobileCards;
