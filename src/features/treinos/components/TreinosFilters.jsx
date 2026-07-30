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
    <div
      className="app-filter-grid treinos-filtros"
      data-testid="treinos-filters"
      style={styles.filtros}
    >
      <input
        className="app-input"
        aria-label="Buscar treinos"
        data-testid="treinos-search"
        placeholder="Buscar por aluno ou rotina"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        style={styles.campo}
      />

      <select
        className="app-select"
        aria-label="Filtrar por aluno"
        data-testid="treinos-filter-aluno"
        value={filtroAluno}
        onChange={(event) => onFiltroAlunoChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os alunos</option>
        {opcoesFiltro.alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>
            {aluno.nome}
          </option>
        ))}
      </select>

      <select
        className="app-select"
        aria-label="Filtrar por objetivo"
        data-testid="treinos-filter-objetivo"
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
        className="app-select"
        aria-label="Filtrar por nível"
        data-testid="treinos-filter-nivel"
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
        className="app-select"
        aria-label="Filtrar por estado"
        data-testid="treinos-filter-status"
        value={filtroStatus}
        onChange={(event) => onFiltroStatusChange(event.target.value)}
        style={styles.campo}
      >
        {opcoesFiltro.status.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <button
        className="app-button app-button-neutral"
        data-testid="treinos-clear-filters"
        onClick={onLimparFiltros}
        style={styles.botaoSecundario}
      >
        Limpar
      </button>
    </div>
  );
}

export default TreinosFilters;
