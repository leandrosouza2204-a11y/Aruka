import { useMemo, useState } from "react";
import { formatarData, formatarMoeda } from "../../../../data/alunosUtils";
import HistoricoFinanceiroMobileCards from "../mobile/HistoricoFinanceiroMobileCards";
import ModalBase from "./ModalBase";

function HistoricoFinanceiroModal({ registro, onClose, onRelatorio, styles }) {
  const [ordem, setOrdem] = useState("desc");
  const pagamentos = useMemo(() => {
    return [...registro.pagamentos].sort((a, b) => {
      const resultado = String(a.dataPagamento).localeCompare(String(b.dataPagamento));
      return ordem === "asc" ? resultado : -resultado;
    });
  }, [ordem, registro.pagamentos]);
  const totalPago = pagamentos.reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);

  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(980px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Histórico financeiro do aluno</h2>
          <p style={styles.secaoLegenda}>
            {registro.aluno.nome} - total pago {formatarMoeda(totalPago)}
          </p>
        </div>
        <div className="financeiro-modal-actions" style={styles.modalAcoes}>
          <button onClick={onRelatorio} className="table-button table-button-primary">Relatório</button>
          <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
        </div>
      </div>

      <div className="financeiro-modal-scroll">
        <div className="financeiro-history-filter" style={styles.filtrosHistorico}>
          <label style={styles.campoGrupo}>
            <span style={styles.labelCampo}>Ordenar por data</span>
            <select value={ordem} onChange={(e) => setOrdem(e.target.value)} style={styles.campo}>
              <option value="desc">Mais recentes primeiro</option>
              <option value="asc">Mais antigos primeiro</option>
            </select>
          </label>
        </div>

        <div className="app-table-scroll financeiro-history-table" style={styles.tabelaModal}>
          <table className="app-table financeiro-history-data-table" style={styles.tabela}>
          <thead>
            <tr style={styles.linhaCabecalho}>
              <th className="financeiro-history-date" style={styles.header}>Data</th>
              <th className="financeiro-history-money" style={styles.header}>Valor</th>
              <th className="financeiro-history-text" style={styles.header}>Plano</th>
              <th className="financeiro-history-type" style={styles.header}>Tipo</th>
              <th className="financeiro-history-short" style={styles.header}>Parcela</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento da parcela</th>
              <th className="financeiro-history-short" style={styles.header}>Forma</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento do plano antes</th>
              <th className="financeiro-history-date" style={styles.header}>Vencimento do plano depois</th>
              <th className="financeiro-history-observation" style={styles.header}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.length === 0 ? (
              <tr>
                <td colSpan="10" style={styles.estadoVazio}>Nenhum pagamento registrado.</td>
              </tr>
            ) : (
              pagamentos.map((pagamento) => (
                <tr key={pagamento.id}>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.dataPagamento)}</td>
                  <td className="financeiro-history-money" style={styles.celula}>{formatarMoeda(pagamento.valor)}</td>
                  <td className="financeiro-history-text" style={styles.celula}>{pagamento.plano || registro.nomePlano}</td>
                  <td className="financeiro-history-type" style={styles.celula}>{formatarTipoMovimento(pagamento.tipoMovimento)}</td>
                  <td className="financeiro-history-short" style={styles.celula}>{pagamento.parcela}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoParcela)}</td>
                  <td className="financeiro-history-short" style={styles.celula}>{pagamento.formaPagamento || "-"}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoAnterior)}</td>
                  <td className="financeiro-history-date" style={styles.celula}>{formatarData(pagamento.vencimentoNovo)}</td>
                  <td className="financeiro-history-observation" style={styles.celula}>{pagamento.observacao || pagamento.observacoes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>

        <HistoricoFinanceiroMobileCards
          formatarTipoMovimento={formatarTipoMovimento}
          nomePlanoFallback={registro.nomePlano}
          pagamentos={pagamentos}
        />
      </div>
    </ModalBase>
  );
}

function formatarTipoMovimento(tipo) {
  const mapa = {
    pagamento_parcela: "Pagamento de parcela",
    renovacao_plano: "Renovação de plano",
    pagamento_avulso: "Pagamento avulso",
  };

  return mapa[tipo] || "Pagamento";
}

export default HistoricoFinanceiroModal;
