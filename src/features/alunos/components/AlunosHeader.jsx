import PageHero from "../../../components/PageHero";

function AlunosHeader({ alunosFiltradosTotal, alunosTotal, onNovoAluno, styles }) {
  return (
    <PageHero
      eyebrow="GESTÃO DE ALUNOS"
      title="Alunos"
      description="Gerencie cadastros, planos, status e acompanhamento dos seus alunos."
      meta={`${alunosFiltradosTotal} de ${alunosTotal} alunos exibidos`}
      actions={
        <button onClick={onNovoAluno} style={styles.botaoPrimario}>
          + Novo Aluno
        </button>
      }
    />
  );
}

export default AlunosHeader;
