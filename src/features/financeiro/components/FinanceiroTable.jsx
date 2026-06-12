import TableActions, { TableActionItem } from "../../../components/TableActions";
import LoadingState from "../../../components/LoadingState";
import { formatarData, formatarMoeda } from "../../../data/alunosUtils";
import FinanceiroEmptyState from "./FinanceiroEmptyState";

function FinanceiroTable({
  atualizandoId,
  carregando,
  onDesfazer,
  onHistorico,
  onRelatorioAluno,
  onRenovarPlano,
  onReceber,
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
            <th style={styles.header}>Status</th>
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
                  {registro.parcelaAtual}/{registro.totalParcelas}
                </td>
                <td className="cell-nowrap" style={styles.celula}>{formatarMoeda(registro.valorParcela)}</td>
                <td className="cell-nowrap" style={styles.celula}>{formatarMoeda(registro.totalRecebido)}</td>
                <td className="cell-nowrap" style={styles.celula}>{formatarData(registro.aluno.vencimento)}</td>
                <td className="financeiro-status-cell" style={styles.celula}>
                  <StatusFinanceiro status={registro.statusFinanceiro} />
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
    <span className={`financeiro-status-badge ${classeStatusAluno(status)}`}>
      {partes.map((parte) => (
        <span key={parte}>{parte}</span>
      ))}
    </span>
  );
}

function PagamentoInfo({ registro }) {
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

function classeStatusAluno(status) {
  if (["Ativo"].includes(status)) return "status-badge-success";
  if (["Vencendo", "Vencendo parcela"].includes(status)) {
    return "status-badge-warning";
  }
  if (["Atrasado", "Parcela atrasada"].includes(status)) {
    return "status-badge-danger";
  }

  return "status-badge-muted";
}

export default FinanceiroTable;
