import { CheckCircle2 } from "lucide-react";
import DashboardEmptyState from "./DashboardEmptyState";

function DashboardAlertas({ alertas, carregando, styles }) {
  return (
    <section className="dashboard-panel" style={styles.resumoCard}>
      <div className="app-card-header" style={styles.secaoTopo}>
        <div>
          <h2 style={styles.secaoTitulo}>Alertas da consultoria</h2>
          <p className="app-muted" style={styles.secaoLegenda}>
            Pontos que merecem uma revisão rápida hoje.
          </p>
        </div>
      </div>

      {carregando ? (
        <p style={styles.estadoVazio}>Carregando alertas...</p>
      ) : alertas.length > 0 ? (
        <div style={styles.alertasGrid}>
          {alertas.map((alerta) => (
            <div
              key={alerta.titulo}
              className="dashboard-alert-item"
              style={styles.alertaItem}
            >
              <span className={`status-badge status-badge-${alerta.tom}`}>
                {alerta.rotulo}
              </span>
              <div>
                <strong style={styles.alertaTitulo}>{alerta.titulo}</strong>
                <p style={styles.alertaTexto}>{alerta.texto}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DashboardEmptyState
          icon={<CheckCircle2 size={20} />}
          texto="Tudo certo por enquanto. Nenhuma ação crítica encontrada."
          styles={styles}
        />
      )}
    </section>
  );
}

export default DashboardAlertas;
