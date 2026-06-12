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
      <table className="app-table" style={styles.tabela}>
        <thead>
          <tr style={styles.linhaCabecalho}>
            <th style={styles.header}>Aluno</th>
            <th style={styles.header}>Plano</th>
            <th style={styles.header}>Contrato</th>
            <th style={styles.header}>Parcela atual</th>
            <th style={styles.header}>Valor parcela</th>
            <th style={styles.header}>Recebido</th>
            <th style={styles.header}>Vencimento do plano</th>
            <th style={styles.header}>Status</th>
            <th style={styles.header}>Pagamento</th>
            <th style={styles.header}>Ações</th>
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
                <td className="cell-wide" style={styles.celula}>{registro.aluno.nome}</td>
                <td style={styles.celula}>{registro.nomePlano}</td>
                <td style={styles.celula}>{formatarMoeda(registro.valorContrato)}</td>
                <td style={styles.celula}>
                  {registro.parcelaAtual}/{registro.totalParcelas}
                </td>
                <td style={styles.celula}>{formatarMoeda(registro.valorParcela)}</td>
                <td style={styles.celula}>{formatarMoeda(registro.totalRecebido)}</td>
                <td style={styles.celula}>{formatarData(registro.aluno.vencimento)}</td>
                <td style={styles.celula}>
                  <span className={classeStatusAluno(registro.aluno.status)}>
                    {registro.aluno.status}
                  </span>
                </td>
                <td style={styles.celula}>
                  {registro.recebidoNoCiclo
                    ? `Recebido em ${formatarData(
                        registro.pagamentoCiclo?.dataPagamento
                      )}`
                    : "Pendente"}
                </td>
                <td style={styles.celula}>
                  <div className="table-actions-inline">
                    <button
                      onClick={() => onReceber(registro)}
                      className="table-button table-button-success"
                      disabled={atualizandoId === registro.aluno.id}
                    >
                      Receber
                    </button>
                    {registro.pagamentos.length > 0 && (
                      <button
                        onClick={() => onHistorico(registro)}
                        className="table-button table-button-secondary"
                        disabled={atualizandoId === registro.aluno.id}
                      >
                        Histórico
                      </button>
                    )}
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
                      <TableActionItem
                        onClick={() => onWhatsApp(registro)}
                        variant="success"
                      >
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

export default FinanceiroTable;
