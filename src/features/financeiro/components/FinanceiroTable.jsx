import TableActions, { TableActionItem } from "../../../components/TableActions";
import LoadingState from "../../../components/LoadingState";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import { classeStatusAluno } from "../../../data/statusHelpers";
import FinanceiroEmptyState from "./FinanceiroEmptyState";

function FinanceiroTable({
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
  styles,
}) {
  return (
    <div className="app-table-scroll desktop-table financeiro-table">
      <table className="app-table financeiro-desktop-table" style={styles.tabela}>
        <colgroup>
          <col className="financeiro-col-aluno" />
          <col className="financeiro-col-plano" />
          <col className="financeiro-col-contrato" />
          <col className="financeiro-col-parcela" />
          <col className="financeiro-col-valor" />
          <col className="financeiro-col-recebido" />
          <col className="financeiro-col-vencimento" />
          <col className="financeiro-col-status" />
          <col className="financeiro-col-pagamento" />
          <col className="financeiro-col-acoes" />
        </colgroup>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.header}>Aluno</th>
            <th style={styles.header}>Plano</th>
            <th className="cell-nowrap" style={styles.header}>Contrato</th>
            <th className="cell-nowrap" style={styles.header}>Parcela</th>
            <th className="cell-nowrap" style={styles.header}>Valor parcela</th>
            <th className="cell-nowrap" style={styles.header}>Recebido</th>
            <th className="cell-nowrap" style={styles.header}>Vencimento</th>
            <th style={styles.header}>Acompanhamento</th>
            <th style={styles.header}>Pagamento</th>
            <th className="financeiro-actions-col" style={styles.header}>Ações</th>
          </tr>
        </thead>

        <tbody>
          {carregando && (
            <tr>
              <td style={styles.estadoVazio} colSpan="10">
                <LoadingState texto="Carregando financeiro..." />
              </td>
            </tr>
          )}

          {!carregando &&
            registros.map((registro) => (
              <tr key={registro.aluno.id}>
                <td className="financeiro-text-cell" style={styles.celula}>
                  {registro.aluno.nome}
                </td>
                <td className="financeiro-text-cell" style={styles.celula}>
                  {registro.nomePlano}
                </td>
                <td className="cell-nowrap" style={styles.celula}>{formatarMoeda(registro.valorContrato)}</td>
                <td className="cell-nowrap" style={styles.celula}>
                  <ParcelaInfo registro={registro} />
                </td>
                <td className="cell-nowrap" style={styles.celula}>{formatarMoeda(registro.valorParcela)}</td>
                <td className="cell-nowrap" style={styles.celula}>{formatarMoeda(registro.totalRecebido)}</td>
                <td className="cell-nowrap" style={styles.celula}>
                  <VencimentoInfo registro={registro} />
                </td>
                <td className="financeiro-status-cell" style={styles.celula}>
                  <StatusFinanceiro status={registro.statusAcompanhamento} />
                </td>
                <td className="financeiro-pagamento-cell" style={styles.celula}>
                  <PagamentoInfo registro={registro} />
                </td>
                <td className="financeiro-actions-cell" style={styles.celula}>
                  <div className="financeiro-actions-inline">
                    <button
                      onClick={() => onReceber(registro)}
                      className="table-button table-button-success"
                      disabled={atualizandoId === registro.aluno.id}
                    >
                      Receber
                    </button>
                    <TableActions>
                      <TableActionItem onClick={() => onRenovarPlano(registro)} variant="primary">
                        Renovar plano
                      </TableActionItem>
                      {registro.grupoAcompanhamento === "encerrados" ? (
                        <TableActionItem onClick={() => onReativar(registro)} variant="primary">
                          Reativar aluno
                        </TableActionItem>
                      ) : (
                        <TableActionItem onClick={() => onMarcarNaoRenovado(registro)} variant="danger">
                          Marcar como não renovado
                        </TableActionItem>
                      )}
                      {registro.pagamentos.length > 0 && (
                        <>
                          <TableActionItem onClick={() => onHistorico(registro)} variant="primary">
                            Ver histórico
                          </TableActionItem>
                          <TableActionItem onClick={() => onDesfazer(registro)} variant="danger">
                            Desfazer último pagamento
                          </TableActionItem>
                          <TableActionItem onClick={() => onRelatorioAluno(registro)} variant="primary">
                            Relatório do aluno
                          </TableActionItem>
                        </>
                      )}
                      <TableActionItem onClick={() => onWhatsApp(registro)} variant="success">
                        WhatsApp
                      </TableActionItem>
                    </TableActions>
                  </div>
                </td>
              </tr>
            ))}

          {!carregando && registros.length === 0 && (
            <tr>
              <td style={styles.estadoVazio} colSpan="10">
                <FinanceiroEmptyState />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusFinanceiro({ status }) {
  const partes = String(status || "-").split(" ");

  return (
    <span className={`financeiro-status-badge ${classeStatusAluno(status, { incluirBase: false })}`}>
      {partes.map((parte) => (
        <span key={parte}>{parte}</span>
      ))}
    </span>
  );
}

function ParcelaInfo({ registro }) {
  if (!registro.parcelado) {
    return `${registro.parcelaAtual}/${registro.totalParcelas}`;
  }

  if (registro.quitado) {
    return `Quitado ${registro.totalParcelas}/${registro.totalParcelas}`;
  }

  return `Próxima ${registro.proximaParcela}/${registro.totalParcelas}`;
}

function VencimentoInfo({ registro }) {
  if (!registro.parcelado) {
    return formatarData(registro.aluno.vencimento);
  }

  if (registro.quitado) {
    return <span className="financeiro-pagamento-info">Sem parcelas pendentes</span>;
  }

  return (
    <span className="financeiro-pagamento-info">
      <span>Parcela</span>
      <strong>{formatarData(registro.proximoVencimento)}</strong>
    </span>
  );
}

function PagamentoInfo({ registro }) {
  if (registro.statusPagamento === "Pago" && !registro.parcelado) {
    return (
      <span className="financeiro-pagamento-info">
        <span>Pago</span>
        <strong>{formatarData(registro.pagamentoCiclo?.dataPagamento)}</strong>
      </span>
    );
  }

  if (registro.parcelado) {
    return <PagamentoParceladoInfo registro={registro} />;
  }

  if (!registro.recebidoNoCiclo) {
    return <span className="financeiro-pagamento-info">Pendente</span>;
  }

  return (
    <span className="financeiro-pagamento-info">
      <span>Recebido em</span>
      <strong>{formatarData(registro.pagamentoCiclo?.dataPagamento)}</strong>
    </span>
  );
}

function PagamentoParceladoInfo({ registro }) {
  if (!registro.ultimaParcelaPaga) {
    return (
      <span className="financeiro-pagamento-info">
        <span>Próxima parcela {registro.proximaParcela}/{registro.totalParcelas}</span>
        <strong>Vence em {formatarData(registro.proximoVencimento)}</strong>
      </span>
    );
  }

  return (
    <span className="financeiro-pagamento-info">
      <span>
        Parcela paga {registro.ultimaParcelaPaga}/{registro.totalParcelas}
      </span>
      <strong>Pago em {formatarData(registro.dataUltimoPagamento)}</strong>
      {!registro.quitado && (
        <span>
          Próxima {registro.proximaParcela}/{registro.totalParcelas} em{" "}
          {formatarData(registro.proximoVencimento)}
        </span>
      )}
    </span>
  );
}

export default FinanceiroTable;
