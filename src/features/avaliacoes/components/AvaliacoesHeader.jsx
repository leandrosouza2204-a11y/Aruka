function AvaliacoesHeader({
  children,
  quantidadeExibida,
  onNovaAvaliacao,
  onNovaAnamnese,
  styles,
}) {
  return (
    <section className="avaliacoes-list-card" style={styles.listaCard}>
      <div style={styles.listaTopo}>
        <div>
          <h1 style={styles.tituloPagina}>Avaliações</h1>
          <p style={styles.resumoLista}>
            {quantidadeExibida} alunos com avaliação exibidos
          </p>
        </div>

        <div style={styles.acoes}>
          <button onClick={onNovaAvaliacao} style={styles.botaoPrimario}>
            + Nova Avaliação
          </button>
          <button onClick={onNovaAnamnese} style={styles.botaoSecundario}>
            + Nova Anamnese
          </button>
        </div>
      </div>

      {children}
    </section>
  );
}

export default AvaliacoesHeader;
