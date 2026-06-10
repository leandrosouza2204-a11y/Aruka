function DashboardHeader({ styles }) {
  return (
    <header style={styles.dashboardHeader}>
      <div>
        <h1 style={styles.dashboardTitulo}>Dashboard da Consultoria</h1>
        <p style={styles.dashboardSubtitulo}>
          Visão geral da sua operação, alunos e receitas.
        </p>
      </div>
    </header>
  );
}

export default DashboardHeader;
