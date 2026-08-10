import {
  AlertTriangle,
  CalendarClock,
  DollarSign,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";

const iconesPorTipo = {
  alunos: Users,
  prevista: TrendingUp,
  recebida: WalletCards,
  pendente: DollarSign,
  vencendo: CalendarClock,
  atrasados: AlertTriangle,
};

function DashboardCards({ metricas, styles }) {
  return (
    <>
      {metricas.map((metrica) => (
        <MetricCard key={metrica.titulo} metrica={metrica} styles={styles} />
      ))}
    </>
  );
}

function MetricCard({ metrica, styles }) {
  const Icone = iconesPorTipo[metrica.tipo] || Users;

  return (
    <div className="dashboard-metric-card dashboard-stat-card" style={styles.card}>
      <div style={styles.metricHeader}>
        <span style={styles.metricIcon} aria-hidden="true">
          <Icone size={18} />
        </span>
        <span style={styles.metricLabel}>{metrica.titulo}</span>
      </div>
      <p
        className="dashboard-stat-value"
        style={{ ...styles.numero, color: metrica.destaque || "#111827" }}
      >
        {metrica.valor}
      </p>
      <span style={styles.metricHint}>{metrica.legenda}</span>
      {metrica.contexto && (
        <span style={styles.metricContext}>{metrica.contexto}</span>
      )}
      {metrica.acao && (
        <Link
          to={metrica.acao.to}
          className="app-button app-button-secondary"
          style={styles.metricAction}
          aria-label={metrica.acao.ariaLabel}
        >
          {metrica.acao.label}
        </Link>
      )}
    </div>
  );
}

export default DashboardCards;
