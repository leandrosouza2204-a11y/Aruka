function AlunosFilters({
  busca,
  filtroPlano,
  filtroStatus,
  onBuscaChange,
  onFiltroPlanoChange,
  onFiltroStatusChange,
  onLimpar,
  planos,
  styles,
}) {
  return (
    <div className="app-filter-grid alunos-filtros" style={styles.filtros}>
      <input
        placeholder="Buscar por nome"
        value={busca}
        onChange={(e) => onBuscaChange(e.target.value)}
        style={{ ...styles.campo, ...styles.campoFiltro }}
      />

      <select
        value={filtroStatus}
        onChange={(e) => onFiltroStatusChange(e.target.value)}
        style={{ ...styles.campo, ...styles.campoFiltro }}
      >
        <option value="todos">Todos os status</option>
        <option value="Ativo">Ativo</option>
        <option value="Vencendo">Vencendo</option>
        <option value="Vencendo parcela">Vencendo parcela</option>
        <option value="Vencido">Vencido</option>
        <option value="Parcela vencida">Parcela vencida</option>
      </select>

      <select
        value={filtroPlano}
        onChange={(e) => onFiltroPlanoChange(e.target.value)}
        style={{ ...styles.campo, ...styles.campoFiltro }}
      >
        <option value="todos">Todos os planos</option>
        {planos.map((plano) => (
          <option key={plano.id} value={plano.id}>
            {plano.nome}
          </option>
        ))}
      </select>

      <button onClick={onLimpar} style={styles.botaoSecundario}>
        Limpar
      </button>
    </div>
  );
}

export default AlunosFilters;
