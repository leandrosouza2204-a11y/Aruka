import { Sparkles } from "lucide-react";
import PageHero from "../../../components/PageHero";

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
          <button
            className="app-button app-button-primary"
            data-testid="treino-new-button"
            onClick={onNovoTreino}
            style={styles.botaoPrimario}
          >
            + Novo treino
          </button>
        }
      />

      <section
        id="treinos-modelos-rapidos"
        className="treinos-list-card app-card"
        style={styles.listaCard}
      >
        <div className="treinos-modelos" style={styles.modelosRapidos}>
          <div>
            <span style={styles.modelosTitulo}>Modelos rápidos</span>
            <p style={styles.modelosLegenda}>
              Comece por uma estrutura pronta e ajuste depois.
            </p>
          </div>
          <div className="treinos-modelos-actions" style={styles.modelosLinha}>
            <button
              className="app-button app-button-secondary"
              data-testid="treino-template-open"
              onClick={onGerarModelo}
              style={styles.botaoPill}
            >
              <Sparkles size={14} />
              Gerar por modelo
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default TreinosHeader;
