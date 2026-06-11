function TreinosFilters({
  busca,
  filtroAluno,
  filtroObjetivo,
  filtroNivel,
  filtroStatus,
  opcoesFiltro,
  onBuscaChange,
  onFiltroAlunoChange,
  onFiltroObjetivoChange,
  onFiltroNivelChange,
  onFiltroStatusChange,
  onLimparFiltros,
  styles,
}) {
  return (
    <div className="app-filter-grid treinos-filtros" style={styles.filtros}>
      <input
        placeholder="Buscar por aluno ou rotina"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        style={styles.campo}
      />

      <select
        value={filtroAluno}
        onChange={(event) => onFiltroAlunoChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os alunos</option>
        {opcoesFiltro.alunos.map((aluno) => (
          <option key={aluno} value={aluno}>
            {aluno}
          </option>
        ))}
      </select>

      <select
        value={filtroObjetivo}
        onChange={(event) => onFiltroObjetivoChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os objetivos</option>
        {opcoesFiltro.objetivos.map((objetivo) => (
          <option key={objetivo} value={objetivo}>
            {objetivo}
          </option>
        ))}
      </select>

      <select
        value={filtroNivel}
        onChange={(event) => onFiltroNivelChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os níveis</option>
        {opcoesFiltro.niveis.map((nivel) => (
          <option key={nivel} value={nivel}>
            {nivel}
          </option>
        ))}
      </select>

      <select
        value={filtroStatus}
        onChange={(event) => onFiltroStatusChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os status</option>
        {opcoesFiltro.status.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <button onClick={onLimparFiltros} style={styles.botaoSecundario}>
        Limpar
      </button>
    </div>
  );
}

export default TreinosFilters;
