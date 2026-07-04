import { Dumbbell, Layers3, Sparkles } from "lucide-react";
import PageHero from "../../../components/PageHero";
import { modelosTreinoDisponiveis } from "../../../data/treinosModelos";

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
            {modelosTreinoDisponiveis.map((modelo) => (
              <button
                key={modelo}
                onClick={() => onGerarModelo(modelo)}
                style={styles.botaoPill}
              >
                {iconeModelo(modelo)}
                Gerar {modelo}
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function iconeModelo(modelo) {
  if (modelo === "Full Body") return <Dumbbell size={14} />;
  if (modelo === "Upper/Lower") return <Layers3 size={14} />;

  return <Sparkles size={14} />;
}

export default TreinosHeader;
