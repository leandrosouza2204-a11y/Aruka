import { Link } from "react-router-dom";

function DashboardAlertas({ alertas, carregando, styles }) {
  if (!carregando && alertas.length === 0) {
    return null;
  }

  return (
    <section className="dashboard-panel dashboard-alerts-panel" style={styles.resumoCard}>
      <div className="app-card-header" style={styles.secaoTopo}>
        <div>
          <h2 style={styles.secaoTitulo}>Alertas da consultoria</h2>
          <p className="app-muted" style={styles.secaoLegenda}>
            Pendências que merecem uma revisão rápida hoje.
          </p>
        </div>
      </div>

      {carregando ? (
        <p className="app-loading" style={styles.estadoVazio}>Carregando alertas...</p>
      ) : (
        <div style={styles.alertasGrid}>
          {alertas.map((alerta) => (
            <div
              key={alerta.titulo}
              className="app-alert dashboard-alert-item"
              style={styles.alertaItem}
            >
              <span className={`status-badge status-badge-${alerta.tom}`}>
                {alerta.rotulo}
              </span>
              <div style={styles.alertaConteudo}>
                <div>
                  <strong style={styles.alertaTitulo}>{alerta.titulo}</strong>
                  <p style={styles.alertaTexto}>{alerta.texto}</p>
                </div>
                <AlertaAcao alerta={alerta} styles={styles} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AlertaAcao({ alerta, styles }) {
  if (!alerta.acao?.to) return null;

  return (
    <Link
      to={alerta.acao.to}
      className="app-button app-button-secondary"
      style={styles.alertaAcao}
      aria-label={alerta.acao.ariaLabel}
    >
      {alerta.acao.label}
    </Link>
  );
}

export default DashboardAlertas;
