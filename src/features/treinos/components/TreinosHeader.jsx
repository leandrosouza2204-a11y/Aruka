import PageHero from "../../../components/PageHero";

const modelosDisponiveis = ["ABC", "ABCD", "ABCDE", "Full Body", "Upper/Lower"];

function TreinosHeader({
  quantidadeFiltrada,
  quantidadeTotal,
  onNovoTreino,
  onGerarModelo,
  styles,
}) {
  return (
    <>
      <PageHero
        eyebrow="TREINOS"
        title="Sistema de treinos"
        description="Crie, organize e acompanhe rotinas de treino personalizadas."
        meta={`${quantidadeFiltrada} de ${quantidadeTotal} treinos exibidos`}
        actions={
          <button onClick={onNovoTreino} style={styles.botaoPrimario}>
            + Novo Treino
          </button>
        }
      />

      <section className="treinos-list-card app-card" style={styles.listaCard}>
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
    </>
  );
}

export default TreinosHeader;
