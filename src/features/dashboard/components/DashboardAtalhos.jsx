import { formatarMoeda } from "../../../data/alunosUtils";

function DashboardAtalhos({ carregando, maiorReceitaMensal, receitaMensal, styles }) {
  return (
    <section className="dashboard-panel" style={styles.graficoCard}>
      <div style={styles.secaoTopo}>
        <div>
          <h2 style={styles.secaoTitulo}>Receita Mensal</h2>
          <p style={styles.secaoLegenda}>
            Evolução dos pagamentos confirmados nos últimos 6 meses.
          </p>
        </div>
        <span style={styles.historicoTag}>Histórico de pagamentos</span>
      </div>

      {receitaMensal.some((mes) => mes.total > 0) ? (
        <>
          <div className="dashboard-chart-desktop" style={styles.grafico}>
            {receitaMensal.map((mes) => {
              const altura =
                maiorReceitaMensal > 0
                  ? Math.max((mes.total / maiorReceitaMensal) * 100, 8)
                  : 0;

              return (
                <div key={mes.chave} style={styles.barraItem}>
                  <div style={styles.barraValor}>{formatarMoeda(mes.total)}</div>
                  <div style={styles.barraTrilho}>
                    <div style={{ ...styles.barra, height: `${altura}%` }} />
                  </div>
                  <div style={styles.barraLabel}>{mes.rotulo}</div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-chart-mobile" style={styles.graficoMobile}>
            {receitaMensal.map((mes) => {
              const largura =
                maiorReceitaMensal > 0
                  ? Math.max((mes.total / maiorReceitaMensal) * 100, 4)
                  : 4;

              return (
                <div key={mes.chave} style={styles.linhaMobile}>
                  <div style={styles.linhaMobileTopo}>
                    <span style={styles.barraLabel}>{mes.rotulo}</span>
                    <strong style={styles.barraValor}>{formatarMoeda(mes.total)}</strong>
                  </div>
                  <div style={styles.trilhoMobile}>
                    <div style={{ ...styles.barraMobile, width: `${largura}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p style={styles.estadoVazio}>
          {carregando
            ? "Carregando pagamentos..."
            : "Nenhum pagamento registrado para gerar o gráfico."}
        </p>
      )}
    </section>
  );
}

export default DashboardAtalhos;
