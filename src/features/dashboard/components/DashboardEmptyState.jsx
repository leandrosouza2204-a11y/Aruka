function DashboardEmptyState({ icon, texto, styles }) {
  return (
    <div className="app-success dashboard-empty-premium app-section" style={styles.estadoVazioPremium}>
      {icon}
      <span className="app-muted">{texto}</span>
    </div>
  );
}

export default DashboardEmptyState;
