import { formatarMoeda } from "../../../../data/alunosUtils";
import IndicadoresAcompanhamentoSection from "../IndicadoresAcompanhamentoSection";
import ModalBase from "./ModalBase";

function RelatorioGeralModal({ ranking, onClose, styles }) {
  return (
    <ModalBase onClose={onClose} styles={styles} largura="min(980px, 100%)">
      <div className="financeiro-modal-topo" style={styles.modalTopo}>
        <div>
          <h2 style={styles.modalTitulo}>Relatórios financeiros</h2>
          <p style={styles.secaoLegenda}>
            Rankings para identificar alunos antigos, recorrentes e com maior valor acumulado.
          </p>
        </div>
        <button onClick={onClose} style={styles.botaoNeutro}>Fechar</button>
      </div>

      <div className="financeiro-modal-scroll">
        <IndicadoresAcompanhamentoSection styles={styles} />

        <div className="financeiro-general-ranking-grid" style={styles.rankingGrid}>
          <RankingLista titulo="Maior valor acumulado" itens={ranking.porTotalPago} metrica={(item) => formatarMoeda(item.totalPago)} styles={styles} />
          <RankingLista titulo="Mais tempo na consultoria" itens={ranking.porTempoConsultoria} metrica={(item) => `${item.tempoConsultoriaMeses} meses`} styles={styles} />
          <RankingLista titulo="Mais pagamentos" itens={ranking.porQuantidadePagamentos} metrica={(item) => `${item.quantidadePagamentos} pagamentos`} styles={styles} />
        </div>

        <section className="financeiro-report-section financeiro-recurring-section" style={styles.relatorioBox}>
          <h3 style={styles.subtituloModal}>Pagamentos recorrentes em dia</h3>
          <div style={styles.listaCompacta}>
            {ranking.recorrentesEmDia.length === 0 ? (
              <span style={styles.secaoLegenda}>Nenhum aluno recorrente em dia encontrado ainda.</span>
            ) : (
              ranking.recorrentesEmDia.map((item) => (
                <span key={item.aluno.id} className="financeiro-ranking-row" style={styles.rankingLinha}>
                  <strong>{item.nomeAluno}</strong>
                  <span>{formatarMoeda(item.totalPago)}</span>
                </span>
              ))
            )}
          </div>
        </section>
      </div>
    </ModalBase>
  );
}

function RankingLista({ titulo, itens, metrica, styles }) {
  return (
    <section className="financeiro-ranking-card" style={styles.rankingCard}>
      <h3 style={styles.subtituloModal}>{titulo}</h3>
      <div style={styles.listaCompacta}>
        {itens.slice(0, 8).map((item, index) => (
          <span key={item.aluno.id} className="financeiro-ranking-row" style={styles.rankingLinha}>
            <strong>{index + 1}. {item.nomeAluno}</strong>
            <span>{metrica(item)}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default RelatorioGeralModal;
