import {
  DIVISOES_MODELO_TREINO,
  GENEROS_MODELO_TREINO,
  modelosTreinoOficiais,
  obterModelosTreino,
} from "../src/data/treinosModelos.js";

if (modelosTreinoOficiais.length !== 10) {
  throw new Error(`Quantidade oficial inesperada: ${modelosTreinoOficiais.length}.`);
}

for (const genero of GENEROS_MODELO_TREINO) {
  const total = obterModelosTreino({ genero }).length;
  if (total !== 5) throw new Error(`${genero} deveria ter 5 modelos, encontrou ${total}.`);
}

for (const divisao of DIVISOES_MODELO_TREINO) {
  const total = obterModelosTreino({ divisao }).length;
  if (total !== 2) throw new Error(`${divisao} deveria ter 2 modelos, encontrou ${total}.`);
}

for (const modelo of modelosTreinoOficiais) {
  if (!modelo.isSystem) throw new Error(`Modelo oficial sem isSystem=true: ${modelo.id}.`);
  if (!modelo.dias.length) throw new Error(`Modelo oficial sem dias: ${modelo.id}.`);
  if (modelo.dias.some((dia) => !dia.exercicios.length)) {
    throw new Error(`Modelo oficial possui dia sem exercicios: ${modelo.id}.`);
  }
}

console.log("Dados de modelos oficiais aprovados: 10 modelos, generos e divisoes coerentes.");
