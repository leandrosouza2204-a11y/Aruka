import PageHero from "../../../components/PageHero";

function AvaliacoesHeader({
  abaAtiva,
  children,
  quantidadeAnamneses,
  quantidadeAvaliacoes,
  quantidadeExibida,
  onAbaChange,
  onNovaAvaliacao,
  onNovaAnamnese,
  styles,
}) {
  return (
    <>
      <PageHero
        eyebrow="AVALIACOES"
        title="Avaliacoes e anamneses"
        description="Registre medidas, composicao corporal, fotos e informacoes de contexto para acompanhar seus alunos."
        meta={`${quantidadeExibida} registros exibidos`}
        actions={
          <>
            <button
              className="app-button app-button-primary"
              onClick={onNovaAvaliacao}
              style={styles.botaoPrimario}
              type="button"
            >
              + Nova avaliacao
            </button>
            <button
              className="app-button app-button-secondary"
              onClick={onNovaAnamnese}
              style={styles.botaoSecundario}
              type="button"
            >
              + Nova anamnese
            </button>
          </>
        }
      />

      <section className="avaliacoes-list-card app-card" style={styles.listaCard}>
        <div style={styles.moduloCards}>
          <div style={styles.moduloCard}>
            <span style={styles.moduloBadge}>Avaliacao fisica</span>
            <h2 style={styles.moduloTitulo}>Avaliacao fisica</h2>
            <p style={styles.moduloTexto}>
              Registre medidas, composicao corporal e fotos para acompanhar a evolucao ao longo do tempo.
            </p>
            <p className="app-muted" style={styles.moduloAjuda}>
              Use como historico de acompanhamento, sem prometer resultado automatico.
            </p>
            <button
              className="app-button app-button-primary"
              onClick={onNovaAvaliacao}
              style={styles.botaoPrimario}
              type="button"
            >
              Nova avaliacao
            </button>
          </div>

          <div style={styles.moduloCard}>
            <span style={styles.moduloBadge}>Anamnese</span>
            <h2 style={styles.moduloTitulo}>Anamnese</h2>
            <p style={styles.moduloTexto}>
              Reuna informacoes sobre objetivos, historico e condicoes relevantes antes do acompanhamento.
            </p>
            <p className="app-muted" style={styles.moduloAjuda}>
              Use para organizar contexto, rotina e preferencias sem linguagem de diagnostico medico.
            </p>
            <button
              className="app-button app-button-secondary"
              onClick={onNovaAnamnese}
              style={styles.botaoSecundario}
              type="button"
            >
              Nova anamnese
            </button>
          </div>
        </div>

        <div className="avaliacoes-tabs" style={styles.tabs}>
          <button
            type="button"
            onClick={() => onAbaChange("avaliacoes")}
            style={{
              ...styles.tabButton,
              ...(abaAtiva === "avaliacoes" ? styles.tabButtonActive : {}),
            }}
          >
            Avaliacoes fisicas ({quantidadeAvaliacoes})
          </button>
          <button
            type="button"
            onClick={() => onAbaChange("anamneses")}
            style={{
              ...styles.tabButton,
              ...(abaAtiva === "anamneses" ? styles.tabButtonActive : {}),
            }}
          >
            Anamneses ({quantidadeAnamneses})
          </button>
        </div>

        {children}
      </section>
    </>
  );
}

export default AvaliacoesHeader;
