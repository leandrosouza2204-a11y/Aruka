function AlunosHeader({ alunosFiltradosTotal, alunosTotal, onNovoAluno, styles }) {
  return (
    <div style={styles.listaTopo}>
      <div>
        <h1 style={styles.tituloPagina}>Lista de Alunos</h1>
        <p style={styles.resumoLista}>
          {alunosFiltradosTotal} de {alunosTotal} alunos exibidos
        </p>
      </div>

      <button onClick={onNovoAluno} style={styles.botaoPrimario}>
        + Novo Aluno
      </button>
    </div>
  );
}

export default AlunosHeader;
