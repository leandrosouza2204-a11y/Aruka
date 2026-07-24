function AvaliacoesFilters({
  alunos,
  busca,
  filtroAluno,
  onBuscaChange,
  onFiltroAlunoChange,
  styles,
}) {
  return (
    <div className="app-filter-grid avaliacoes-filtros" style={styles.filtros}>
      <input
        className="app-input"
        data-testid="avaliacoes-search"
        placeholder="Buscar por nome do aluno"
        value={busca}
        onChange={(event) => onBuscaChange(event.target.value)}
        style={styles.campo}
      />
      <select
        className="app-select"
        data-testid="avaliacoes-student-filter"
        value={filtroAluno}
        onChange={(event) => onFiltroAlunoChange(event.target.value)}
        style={styles.campo}
      >
        <option value="todos">Todos os alunos</option>
        {alunos.map((aluno) => (
          <option key={aluno.id} value={aluno.id}>
            {aluno.nome}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AvaliacoesFilters;
