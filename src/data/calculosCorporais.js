function numero(valor) {
  return Number(String(valor || "").replace(",", "."));
}

function arredondar(valor, casas = 1) {
  if (!Number.isFinite(valor)) return "";
  return Number(valor.toFixed(casas));
}

export function calcularIMC(peso, alturaCm) {
  const pesoKg = numero(peso);
  const alturaMetros = numero(alturaCm) / 100;

  if (!pesoKg || !alturaMetros) return "";

  return arredondar(pesoKg / alturaMetros ** 2);
}

export function classificarIMC(imc) {
  const valor = numero(imc);

  if (!valor) return "-";
  if (valor < 18.5) return "Baixo peso";
  if (valor < 25) return "Peso normal";
  if (valor < 30) return "Sobrepeso";
  if (valor < 35) return "Obesidade grau I";
  if (valor < 40) return "Obesidade grau II";
  return "Obesidade grau III";
}

export function calcularRelacaoCinturaQuadril(cintura, quadril) {
  const cinturaCm = numero(cintura);
  const quadrilCm = numero(quadril);

  if (!cinturaCm || !quadrilCm) return "";

  return arredondar(cinturaCm / quadrilCm, 2);
}

export function classificarRelacaoCinturaQuadril(relacao, sexo) {
  const valor = numero(relacao);
  const sexoNormalizado = String(sexo || "").toLowerCase();

  if (!valor) return "-";

  if (sexoNormalizado === "feminino") {
    if (valor < 0.8) return "Baixo risco";
    if (valor <= 0.85) return "Risco moderado";
    return "Alto risco";
  }

  if (valor < 0.9) return "Baixo risco";
  if (valor <= 0.95) return "Risco moderado";
  return "Alto risco";
}

export function calcularPercentualGorduraEstimado({
  sexo,
  altura,
  cintura,
  pescoco,
  quadril,
}) {
  // Estimativa baseada em formula antropometrica simples; nao substitui avaliacao clinica.
  const alturaCm = numero(altura);
  const cinturaCm = numero(cintura);
  const pescocoCm = numero(pescoco);
  const quadrilCm = numero(quadril);
  const sexoNormalizado = String(sexo || "").toLowerCase();

  if (!alturaCm || !cinturaCm || !pescocoCm) return "";

  if (sexoNormalizado === "feminino") {
    if (!quadrilCm || cinturaCm + quadrilCm <= pescocoCm) return "";

    return arredondar(
      495 /
        (1.29579 -
          0.35004 * Math.log10(cinturaCm + quadrilCm - pescocoCm) +
          0.221 * Math.log10(alturaCm)) -
        450
    );
  }

  if (cinturaCm <= pescocoCm) return "";

  return arredondar(
    495 /
      (1.0324 -
        0.19077 * Math.log10(cinturaCm - pescocoCm) +
        0.15456 * Math.log10(alturaCm)) -
      450
  );
}

export function calcularPercentualGorduraPorDobras({ sexo, idade, dobras }) {
  const idadeAnos = numero(idade);
  const sexoNormalizado = String(sexo || "").toLowerCase();

  if (!idadeAnos || !dobras) return "";

  const campos =
    sexoNormalizado === "feminino"
      ? ["triceps", "supraIliaca", "coxa"]
      : ["peitoral", "abdominal", "coxa"];

  const valores = campos.map((campo) => numero(dobras[campo]));

  if (valores.some((valor) => !valor)) return "";

  const soma3 = valores.reduce((total, valor) => total + valor, 0);
  const densidade =
    sexoNormalizado === "feminino"
      ? 1.0994921 -
        0.0009929 * soma3 +
        0.0000023 * soma3 ** 2 -
        0.0001392 * idadeAnos
      : 1.10938 -
        0.0008267 * soma3 +
        0.0000016 * soma3 ** 2 -
        0.0002574 * idadeAnos;

  if (!Number.isFinite(densidade) || densidade <= 0) return "";

  return arredondar(495 / densidade - 450);
}

export function calcularComposicaoCorporal(avaliacao) {
  const peso = numero(avaliacao?.peso);
  const percentualPorDobras = calcularPercentualGorduraPorDobras({
    sexo: avaliacao?.sexo,
    idade: avaliacao?.idade,
    dobras: avaliacao?.dobras,
  });
  const percentualPorMedidas = calcularPercentualGorduraEstimado({
    sexo: avaliacao?.sexo,
    altura: avaliacao?.altura,
    cintura: avaliacao?.medidas?.cintura,
    pescoco: avaliacao?.medidas?.pescoco,
    quadril: avaliacao?.medidas?.quadril,
  });
  const percentualGordura =
    percentualPorDobras !== "" ? percentualPorDobras : percentualPorMedidas;
  const massaGorda = peso && percentualGordura ? peso * (percentualGordura / 100) : "";
  const massaMagra = peso && massaGorda !== "" ? peso - massaGorda : "";
  const percentualMassaMagra =
    percentualGordura !== "" ? 100 - percentualGordura : "";
  const relacaoCinturaQuadril = calcularRelacaoCinturaQuadril(
    avaliacao?.medidas?.cintura,
    avaliacao?.medidas?.quadril
  );
  const imc = calcularIMC(avaliacao?.peso, avaliacao?.altura);

  return {
    peso: peso || "",
    percentualGordura,
    percentualMassaMagra: arredondar(percentualMassaMagra),
    massaGorda: arredondar(massaGorda),
    massaMagra: arredondar(massaMagra),
    metodoPercentualGordura:
      percentualPorDobras !== ""
        ? "Jackson & Pollock 3 dobras"
        : percentualPorMedidas !== ""
          ? "Estimativa por medidas antropométricas"
          : "Dados insuficientes",
    relacaoCinturaQuadril,
    classificacaoRelacaoCinturaQuadril: classificarRelacaoCinturaQuadril(
      relacaoCinturaQuadril,
      avaliacao?.sexo
    ),
    imc,
    classificacaoIMC: classificarIMC(imc),
  };
}
