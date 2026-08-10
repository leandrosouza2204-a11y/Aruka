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
        eyebrow="AVALIAÇÕES"
        title="Avaliações e anamneses"
        description="Registre medidas, composição corporal, fotos e informações de contexto para acompanhar seus alunos."
        meta={`${quantidadeExibida} registros exibidos`}
        actions={
          <>
            <button
              className="app-button app-button-primary"
              onClick={onNovaAvaliacao}
              style={styles.botaoPrimario}
              type="button"
            >
              + Nova avaliação
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
            <span style={styles.moduloBadge}>Avaliação física</span>
            <h2 style={styles.moduloTitulo}>Avaliação física</h2>
            <p style={styles.moduloTexto}>
              Registre medidas, composição corporal e fotos para acompanhar a evolução ao longo do tempo.
            </p>
            <p className="app-muted" style={styles.moduloAjuda}>
              Use como histórico de acompanhamento, sem prometer resultado automático.
            </p>
            <button
              className="app-button app-button-primary"
              onClick={onNovaAvaliacao}
              style={styles.botaoPrimario}
              type="button"
            >
              Nova avaliação
            </button>
          </div>

          <div style={styles.moduloCard}>
            <span style={styles.moduloBadge}>Anamnese</span>
            <h2 style={styles.moduloTitulo}>Anamnese</h2>
            <p style={styles.moduloTexto}>
              Reúna informações sobre objetivos, histórico e condições relevantes antes do acompanhamento.
            </p>
            <p className="app-muted" style={styles.moduloAjuda}>
              Use para organizar contexto, rotina e preferências sem linguagem de diagnóstico médico.
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
            Avaliações físicas ({quantidadeAvaliacoes})
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
