import PageHero from "../../../components/PageHero";

function AlunosHeader({ alunosFiltradosTotal, alunosTotal, onNovoAluno, styles }) {
  return (
    <PageHero
      eyebrow="GESTÃO DE ALUNOS"
      title="Alunos"
      description="Gerencie cadastros, planos, status e acompanhamento dos seus alunos."
      meta={`${alunosFiltradosTotal} de ${alunosTotal} alunos exibidos`}
      actions={
        <button
          className="app-button app-button-primary"
          data-testid="aluno-new-button"
          onClick={onNovoAluno}
          style={styles.botaoPrimario}
        >
          + Novo Aluno
        </button>
      }
    />
  );
}

export default AlunosHeader;
