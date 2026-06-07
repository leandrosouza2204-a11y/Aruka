export const salvarAlunos = (alunos) => {
  localStorage.setItem("alunos", JSON.stringify(alunos));
};

export const buscarAlunos = () => {
  const dados = localStorage.getItem("alunos");
  return dados ? JSON.parse(dados) : [];
};