const ROTAS_CONTEXTO = {
  treinos: "/treinos",
  avaliacoes: "/avaliacoes",
  financeiro: "/financeiro",
};

export function montarReturnToAlunos(search = "") {
  const query = normalizarSearch(search).toString();
  return query ? `/alunos?${query}` : "/alunos";
}

export function montarUrlContextualAluno(destino, alunoId, search = "") {
  if (!alunoId || !ROTAS_CONTEXTO[destino]) return "";

  const params = new URLSearchParams();
  params.set("alunoId", alunoId);
  params.set("returnTo", montarReturnToAlunos(search));

  return `${ROTAS_CONTEXTO[destino]}?${params.toString()}`;
}

export function normalizarAlunoIdDaUrl(search = "") {
  return normalizarSearch(search).get("alunoId") || "";
}

export function normalizarReturnToDaUrl(search = "") {
  const returnTo = normalizarSearch(search).get("returnTo") || "";
  if (!returnTo.startsWith("/alunos")) return "";
  if (/^\/\//.test(returnTo) || /^https?:/i.test(returnTo)) return "";
  return returnTo;
}

function normalizarSearch(search) {
  if (search instanceof URLSearchParams) return new URLSearchParams(search);
  return new URLSearchParams(String(search).replace(/^\?/, ""));
}
