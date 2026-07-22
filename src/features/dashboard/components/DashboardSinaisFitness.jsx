import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";

function DashboardSinaisFitness({ aviso, carregando, sinais, styles }) {
  return (
    <section className="dashboard-panel" style={styles.resumoCard}>
      <div style={styles.secaoTopo}>
        <div>
          <h2 style={styles.secaoTitulo}>Treinos e avaliacoes</h2>
          <p style={styles.secaoLegenda}>
            Sinais operacionais gerados a partir dos alunos nao vencidos.
          </p>
        </div>
        <span style={styles.historicoTag}>Dados atuais</span>
      </div>

      {aviso && <p style={styles.avisoSinais}>{aviso}</p>}

      {carregando ? (
        <p style={styles.estadoVazio}>Carregando sinais...</p>
      ) : (
        <div style={styles.sinaisGrid}>
          {sinais.map((sinal) => (
            <article key={sinal.titulo} style={styles.sinalItem}>
              <div style={styles.metricHeader}>
                <span style={styles.metricIcon} aria-hidden="true">
                  <Dumbbell size={18} />
                </span>
                <span style={styles.metricLabel}>{sinal.titulo}</span>
              </div>
              <strong style={styles.sinalValor}>{sinal.valor}</strong>
              <p style={styles.sinalTexto}>{sinal.texto}</p>
              <Link
                to={sinal.to}
                className="app-link-button"
                style={styles.alertaAcao}
                aria-label={`Abrir modulo de ${sinal.modulo}`}
              >
                Abrir {sinal.modulo}
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DashboardSinaisFitness;
