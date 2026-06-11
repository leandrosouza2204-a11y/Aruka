const modelosDisponiveis = ["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"];

function TreinosHeader({
  quantidadeFiltrada,
  quantidadeTotal,
  onNovoTreino,
  onGerarModelo,
  styles,
}) {
  return (
    <section className="treinos-list-card" style={styles.listaCard}>
      <div style={styles.listaTopo}>
        <div>
          <h1 style={styles.tituloPagina}>Sistema de Treinos</h1>
          <p style={styles.resumoLista}>
            {quantidadeFiltrada} de {quantidadeTotal} treinos exibidos
          </p>
        </div>

        <button onClick={onNovoTreino} style={styles.botaoPrimario}>
          + Novo Treino
        </button>
      </div>

      <div className="treinos-modelos" style={styles.modelosRapidos}>
        <div>
          <span style={styles.modelosTitulo}>Modelos rápidos</span>
          <p style={styles.modelosLegenda}>
            Comece por uma estrutura pronta e ajuste depois.
          </p>
        </div>
        <div className="treinos-modelos-actions" style={styles.modelosLinha}>
          {modelosDisponiveis.map((modelo) => (
            <button
              key={modelo}
              onClick={() => onGerarModelo(modelo)}
              style={styles.botaoPill}
            >
              Gerar {modelo}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TreinosHeader;
