const CHAVE_AVALIACOES = "avaliacoes";
const CHAVE_ANAMNESES = "anamneses";

function ler(chave) {
  const dados = localStorage.getItem(chave);
  return dados ? JSON.parse(dados) : [];
}

function salvar(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}

export function buscarAvaliacoes() {
  return ler(CHAVE_AVALIACOES);
}

export function salvarAvaliacoes(avaliacoes) {
  salvar(CHAVE_AVALIACOES, avaliacoes);
}

export function adicionarAvaliacao(avaliacao) {
  const avaliacoes = buscarAvaliacoes();
  const novaAvaliacao = {
    ...avaliacao,
    id: avaliacao.id || crypto.randomUUID(),
    criadoEm: avaliacao.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  salvarAvaliacoes([...avaliacoes, novaAvaliacao]);
  return novaAvaliacao;
}

export function atualizarAvaliacao(id, avaliacaoAtualizada) {
  const avaliacoes = buscarAvaliacoes();
  const avaliacoesAtualizadas = avaliacoes.map((avaliacao) =>
    avaliacao.id === id
      ? { ...avaliacao, ...avaliacaoAtualizada, id, atualizadoEm: new Date().toISOString() }
      : avaliacao
  );

  salvarAvaliacoes(avaliacoesAtualizadas);
  return avaliacoesAtualizadas.find((avaliacao) => avaliacao.id === id);
}

export function excluirAvaliacao(id) {
  const avaliacoesAtualizadas = buscarAvaliacoes().filter(
    (avaliacao) => avaliacao.id !== id
  );
  salvarAvaliacoes(avaliacoesAtualizadas);
  return avaliacoesAtualizadas;
}

export function buscarAvaliacoesPorAluno(aluno) {
  return buscarAvaliacoes()
    .filter((avaliacao) => avaliacao.aluno === aluno)
    .sort((a, b) => String(b.data).localeCompare(String(a.data)));
}

export function buscarUltimaAvaliacaoAluno(aluno) {
  return buscarAvaliacoesPorAluno(aluno)[0] || null;
}

export function buscarAnamneses() {
  return ler(CHAVE_ANAMNESES);
}

export function salvarAnamneses(anamneses) {
  salvar(CHAVE_ANAMNESES, anamneses);
}

export function adicionarAnamnese(anamnese) {
  const anamneses = buscarAnamneses();
  const novaAnamnese = {
    ...anamnese,
    id: anamnese.id || crypto.randomUUID(),
    criadoEm: anamnese.criadoEm || new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };

  salvarAnamneses([...anamneses, novaAnamnese]);
  return novaAnamnese;
}

export function atualizarAnamnese(id, anamneseAtualizada) {
  const anamneses = buscarAnamneses();
  const anamnesesAtualizadas = anamneses.map((anamnese) =>
    anamnese.id === id
      ? { ...anamnese, ...anamneseAtualizada, id, atualizadoEm: new Date().toISOString() }
      : anamnese
  );

  salvarAnamneses(anamnesesAtualizadas);
  return anamnesesAtualizadas.find((anamnese) => anamnese.id === id);
}

export function excluirAnamnese(id) {
  const anamnesesAtualizadas = buscarAnamneses().filter(
    (anamnese) => anamnese.id !== id
  );
  salvarAnamneses(anamnesesAtualizadas);
  return anamnesesAtualizadas;
}

export function buscarAnamnesePorAluno(aluno) {
  return (
    buscarAnamneses()
      .filter((anamnese) => anamnese.aluno === aluno)
      .sort((a, b) => String(b.atualizadoEm).localeCompare(String(a.atualizadoEm)))[0] ||
    null
  );
}
