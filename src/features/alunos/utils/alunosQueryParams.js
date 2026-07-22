export const ALUNOS_QUERY_KEYS = {
  busca: "busca",
  status: "status",
  plano: "plano",
};

export const ALUNOS_STATUS_VALIDOS = new Set([
  "Ativo",
  "Vencendo",
  "Vencendo parcela",
  "Vencido",
  "Parcela vencida",
]);

export const FILTROS_ALUNOS_PADRAO = {
  busca: "",
  status: "todos",
  plano: "todos",
};

export function normalizarFiltrosAlunosDaUrl(searchParams, planos = []) {
  const params = toSearchParams(searchParams);
  const planoIds = new Set(planos.map((plano) => plano.id));
  const deveValidarPlano = planos.length > 0;
  const busca = (params.get(ALUNOS_QUERY_KEYS.busca) || "").trim();
  const status = params.get(ALUNOS_QUERY_KEYS.status) || "";
  const plano = params.get(ALUNOS_QUERY_KEYS.plano) || "";

  return {
    busca,
    status: ALUNOS_STATUS_VALIDOS.has(status) ? status : FILTROS_ALUNOS_PADRAO.status,
    plano:
      plano && (!deveValidarPlano || planoIds.has(plano))
        ? plano
        : FILTROS_ALUNOS_PADRAO.plano,
  };
}

export function montarQueryAlunos(searchParams, filtros) {
  const params = toSearchParams(searchParams);

  aplicarValor(params, ALUNOS_QUERY_KEYS.busca, filtros.busca);
  aplicarValor(
    params,
    ALUNOS_QUERY_KEYS.status,
    filtros.status === FILTROS_ALUNOS_PADRAO.status ? "" : filtros.status
  );
  aplicarValor(
    params,
    ALUNOS_QUERY_KEYS.plano,
    filtros.plano === FILTROS_ALUNOS_PADRAO.plano ? "" : filtros.plano
  );

  return params;
}

export function limparQueryFiltrosAlunos(searchParams) {
  const params = toSearchParams(searchParams);

  Object.values(ALUNOS_QUERY_KEYS).forEach((key) => params.delete(key));

  return params;
}

function aplicarValor(params, key, value) {
  const texto = String(value || "").trim();

  if (!texto) {
    params.delete(key);
    return;
  }

  params.set(key, texto);
}

function toSearchParams(searchParams) {
  return new URLSearchParams(searchParams?.toString?.() || searchParams || "");
}
