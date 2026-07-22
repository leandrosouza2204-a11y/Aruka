import { formatarMoeda } from "../../../data/alunosUtils";

function DashboardAtalhos({
  carregando,
  maiorReceitaMensal,
  receitaMensal,
  resumoReceitaMensal,
  styles,
}) {
  const temReceita = receitaMensal.some((mes) => mes.total > 0);

  return (
    <section
      className="dashboard-panel"
      style={styles.graficoCard}
      aria-describedby={temReceita ? "dashboard-receita-resumo" : undefined}
    >
      <div style={styles.secaoTopo}>
        <div>
          <h2 style={styles.secaoTitulo}>Receita Mensal</h2>
          <p style={styles.secaoLegenda}>
            Evolução dos pagamentos confirmados nos últimos 6 meses.
          </p>
        </div>
        <span style={styles.historicoTag}>Histórico de pagamentos</span>
      </div>

      {temReceita ? (
        <>
          <div id="dashboard-receita-resumo" style={styles.chartSummary}>
            <span>
              Periodo: {resumoReceitaMensal.periodo}. Total confirmado:{" "}
              <strong>{formatarMoeda(resumoReceitaMensal.total)}</strong>.
            </span>
            <span>
              Melhor mes: {resumoReceitaMensal.melhorMes.rotulo} com{" "}
              <strong>{formatarMoeda(resumoReceitaMensal.melhorMes.total)}</strong>.
              {resumoReceitaMensal.mesesSemReceita > 0
                ? ` Meses sem recebimento no periodo: ${resumoReceitaMensal.mesesSemReceita}.`
                : " Todos os meses do periodo possuem recebimento registrado."}
            </span>
          </div>

          <table style={styles.chartTable} aria-label="Receita mensal em texto">
            <thead>
              <tr>
                <th style={styles.chartCell}>Mes</th>
                <th style={styles.chartCell}>Receita confirmada</th>
              </tr>
            </thead>
            <tbody>
              {resumoReceitaMensal.linhas.map((mes) => (
                <tr key={mes.chave}>
                  <td style={styles.chartCell}>{mes.rotulo}</td>
                  <td style={styles.chartCell}>{mes.valorFormatado}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="dashboard-chart-desktop" style={styles.grafico} aria-hidden="true">
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

          <div className="dashboard-chart-mobile" style={styles.graficoMobile} aria-hidden="true">
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
