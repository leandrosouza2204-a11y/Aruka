import {
  AlertTriangle,
  CalendarClock,
  DollarSign,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";

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
        <span style={styles.metricIcon}>
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
    </div>
  );
}

export default DashboardCards;
