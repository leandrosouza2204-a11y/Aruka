function DashboardVencimentos({ children }) {
  if (!children) return null;

  return <section className="dashboard-panel">{children}</section>;
}

export default DashboardVencimentos;
