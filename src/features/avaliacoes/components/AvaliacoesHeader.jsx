import PageHero from "../../../components/PageHero";

function AvaliacoesHeader({
  children,
  quantidadeExibida,
  onNovaAvaliacao,
  onNovaAnamnese,
  styles,
}) {
  return (
    <>
      <PageHero
        eyebrow="AVALIAÇÕES"
        title="Avaliações físicas"
        description="Registre medidas, anamnese e evolução corporal dos alunos."
        meta={`${quantidadeExibida} alunos com avaliação exibidos`}
        actions={
          <>
            <button onClick={onNovaAvaliacao} style={styles.botaoPrimario}>
              + Nova Avaliação
            </button>
            <button onClick={onNovaAnamnese} style={styles.botaoSecundario}>
              + Nova Anamnese
            </button>
          </>
        }
      />

      <section className="avaliacoes-list-card app-card" style={styles.listaCard}>
        {children}
      </section>
    </>
  );
}

export default AvaliacoesHeader;
