function DashboardEmptyState({ icon, texto, styles }) {
  return (
    <div className="dashboard-empty-premium app-section" style={styles.estadoVazioPremium}>
      {icon}
      <span className="app-muted">{texto}</span>
    </div>
  );
}

export default DashboardEmptyState;
