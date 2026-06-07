const CHAVE_TREINOS = "treinos";

export function buscarTreinos() {
  const dados = localStorage.getItem(CHAVE_TREINOS);
  return dados ? JSON.parse(dados) : [];
}

export function salvarTreinos(treinos) {
  localStorage.setItem(CHAVE_TREINOS, JSON.stringify(treinos));
}

export function adicionarTreino(treino) {
  const treinos = buscarTreinos();
  const novoTreino = {
    ...treino,
    id: treino.id || crypto.randomUUID(),
    criadoEm: treino.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  const treinosAtualizados = [...treinos, novoTreino];
  salvarTreinos(treinosAtualizados);
  return novoTreino;
}

export function atualizarTreino(id, treinoAtualizado) {
  const treinos = buscarTreinos();
  const treinosAtualizados = treinos.map((treino) =>
    treino.id === id
      ? {
          ...treino,
          ...treinoAtualizado,
          id,
          atualizadoEm: new Date().toISOString(),
        }
      : treino
  );

  salvarTreinos(treinosAtualizados);
  return treinosAtualizados.find((treino) => treino.id === id);
}

export function excluirTreino(id) {
  const treinosAtualizados = buscarTreinos().filter((treino) => treino.id !== id);
  salvarTreinos(treinosAtualizados);
  return treinosAtualizados;
}
