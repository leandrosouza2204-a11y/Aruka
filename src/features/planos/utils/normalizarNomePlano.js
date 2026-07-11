export const MENSAGEM_PLANO_DUPLICADO =
  "Já existe um plano com esse nome. Escolha outro nome ou edite o plano existente.";

export function limparNomePlano(nome) {
  return String(nome || "").trim().replace(/\s+/g, " ");
}

export function normalizarNomePlano(nome) {
  return limparNomePlano(nome).toLocaleLowerCase("pt-BR");
}

export function planoTemNomeDuplicado(planos = [], nome, idIgnorado = "") {
  const nomeNormalizado = normalizarNomePlano(nome);

  if (!nomeNormalizado) return false;

  return planos.some((plano) => {
    if (idIgnorado && String(plano.id) === String(idIgnorado)) return false;

    return normalizarNomePlano(plano.nome) === nomeNormalizado;
  });
}

export function criarErroPlanoDuplicado() {
  const erro = new Error(MENSAGEM_PLANO_DUPLICADO);
  erro.name = "PlanoDuplicadoError";
  erro.code = "PLANO_NOME_DUPLICADO";

  return erro;
}

export function erroEhPlanoDuplicado(error) {
  return error?.code === "PLANO_NOME_DUPLICADO" || error?.code === "23505";
}
