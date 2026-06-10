function DashboardEmptyState({ icon, texto, styles }) {
  return (
    <div className="dashboard-empty-premium" style={styles.estadoVazioPremium}>
      {icon}
      <span>{texto}</span>
    </div>
  );
}

export default DashboardEmptyState;
