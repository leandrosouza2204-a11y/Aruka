const PARAM_BUSCA = "busca";
const PARAM_OBJETIVO = "objetivo";
const PARAM_NIVEL = "nivel";
const PARAM_STATUS = "status";

export function lerFiltrosTreinosDaUrl(searchParams) {
  const params = normalizarSearch(searchParams);

  return {
    busca: params.get(PARAM_BUSCA) || "",
    objetivo: params.get(PARAM_OBJETIVO) || "todos",
    nivel: params.get(PARAM_NIVEL) || "todos",
    status: params.get(PARAM_STATUS) || "todos",
  };
}

export function atualizarFiltroTreinosNaUrl(searchParams, chave, valor) {
  const params = normalizarSearch(searchParams);
  const nomeParametro = obterParametro(chave);
  const valorNormalizado = String(valor || "").trim();

  if (!valorNormalizado || valorNormalizado === "todos") {
    params.delete(nomeParametro);
    return params;
  }

  params.set(nomeParametro, valorNormalizado);
  return params;
}

export function limparFiltrosTreinosDaUrl(searchParams) {
  const params = normalizarSearch(searchParams);
  params.delete("alunoId");
  params.delete(PARAM_BUSCA);
  params.delete(PARAM_OBJETIVO);
  params.delete(PARAM_NIVEL);
  params.delete(PARAM_STATUS);
  return params;
}

function obterParametro(chave) {
  const parametros = {
    busca: PARAM_BUSCA,
    objetivo: PARAM_OBJETIVO,
    nivel: PARAM_NIVEL,
    status: PARAM_STATUS,
  };

  if (!parametros[chave]) {
    throw new Error(`Filtro de Treinos desconhecido: ${chave}`);
  }

  return parametros[chave];
}

function normalizarSearch(searchParams) {
  if (searchParams instanceof URLSearchParams) return new URLSearchParams(searchParams);
  return new URLSearchParams(String(searchParams || "").replace(/^\?/, ""));
}
