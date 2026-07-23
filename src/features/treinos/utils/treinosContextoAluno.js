import { normalizarReturnToDaUrl } from "../../alunos/utils/alunosContextNavigation.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function resolverContextoAlunoTreinos({ searchParams, alunos = [], carregando = false }) {
  const alunoId = normalizarAlunoIdContextual(searchParams);
  const returnTo = normalizarReturnToDaUrl(searchParams);

  if (!alunoId) {
    return {
      aluno: null,
      alunoId: "",
      invalido: false,
      pendente: false,
      returnTo,
      temContexto: false,
    };
  }

  if (!idAlunoBemFormado(alunoId)) {
    return {
      aluno: null,
      alunoId,
      invalido: true,
      pendente: false,
      returnTo,
      temContexto: false,
    };
  }

  const aluno = alunos.find((item) => item.id === alunoId) || null;
  const pendente = carregando && !aluno;

  return {
    aluno,
    alunoId,
    invalido: !pendente && !aluno,
    pendente,
    returnTo,
    temContexto: Boolean(aluno),
  };
}

export function criarTreinoBaseContextual(aluno) {
  if (!aluno?.id) return null;

  return {
    alunoId: aluno.id,
    aluno: aluno.nome || "",
    nomeAluno: aluno.nome || "",
  };
}

export function normalizarAlunoIdContextual(searchParams) {
  const params = normalizarSearch(searchParams);
  return params.get("alunoId") || "";
}

export function removerAlunoIdDoContexto(searchParams) {
  const params = normalizarSearch(searchParams);
  params.delete("alunoId");
  return params;
}

export function idAlunoBemFormado(alunoId) {
  return UUID_REGEX.test(String(alunoId || ""));
}

function normalizarSearch(searchParams) {
  if (searchParams instanceof URLSearchParams) return new URLSearchParams(searchParams);
  return new URLSearchParams(String(searchParams || "").replace(/^\?/, ""));
}
