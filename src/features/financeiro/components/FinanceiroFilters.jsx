function FinanceiroFilters({
  busca,
  filtroPagamento,
  filtroStatus,
  onBuscaChange,
  onFiltroPagamentoChange,
  onFiltroStatusChange,
  onLimpar,
  styles,
}) {
  return (
    <section className="app-card" style={styles.filtrosCard}>
      <div>
        <h2 style={styles.secaoTitulo}>Controle de Pagamentos</h2>
        <p style={styles.secaoLegenda}>
          Registre pagamentos com data, valor, forma e parcela.
        </p>
      </div>

      <div className="app-filter-grid financeiro-filtros" style={styles.filtros}>
        <input
          placeholder="Buscar por aluno"
          value={busca}
          onChange={(e) => onBuscaChange(e.target.value)}
          style={styles.campo}
        />

        <select
          value={filtroStatus}
          onChange={(e) => onFiltroStatusChange(e.target.value)}
          style={styles.campo}
        >
          <option value="todos">Todos os status</option>
          <option value="Ativo">Ativo</option>
          <option value="Vencendo">Vencendo</option>
          <option value="Vencendo parcela">Vencendo parcela</option>
          <option value="Atrasado">Atrasado</option>
          <option value="Parcela atrasada">Parcela atrasada</option>
        </select>

        <select
          value={filtroPagamento}
          onChange={(e) => onFiltroPagamentoChange(e.target.value)}
          style={styles.campo}
        >
          <option value="todos">Todos os pagamentos</option>
          <option value="recebidos">Recebidos no ciclo</option>
          <option value="pendentes">Pendentes no ciclo</option>
        </select>

        <button onClick={onLimpar} style={styles.botaoNeutro}>
          Limpar
        </button>
      </div>
    </section>
  );
}

export default FinanceiroFilters;
