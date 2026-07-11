import { calcularComposicaoCorporal } from "../data/calculosCorporais";
import { dataOuNull } from "../data/formatters";

const medidas = {
  pescoco: "pescoco", ombro: "ombro", torax: "torax", cintura: "cintura",
  abdomen: "abdomen", quadril: "quadril", bracoDireito: "braco_direito",
  bracoEsquerdo: "braco_esquerdo", antebracoDireito: "antebraco_direito",
  antebracoEsquerdo: "antebraco_esquerdo", coxaDireita: "coxa_direita",
  coxaEsquerda: "coxa_esquerda", panturrilhaDireita: "panturrilha_direita",
  panturrilhaEsquerda: "panturrilha_esquerda",
};
const dobras = {
  peitoral: "dobra_peitoral", abdominal: "dobra_abdominal", coxa: "dobra_coxa",
  triceps: "dobra_triceps", subescapular: "dobra_subescapular",
  supraIliaca: "dobra_supra_iliaca", axilarMedia: "dobra_axilar_media",
};

export function avaliacaoParaPayload(avaliacao, userId) {
  const composicao = calcularComposicaoCorporal(avaliacao);
  const payload = {
    user_id: userId, aluno_id: avaliacao.alunoId,
    data_avaliacao: dataOuNull(avaliacao.data), idade: numeroOuNull(avaliacao.idade),
    sexo: textoOuNull(avaliacao.sexo), altura: numeroOuNull(avaliacao.altura),
    peso: numeroOuNull(avaliacao.peso), status: avaliacao.status || "inicial",
    objetivo_atual: avaliacao.objetivoAtual || "", aderencia_treino: avaliacao.aderenciaTreino || "",
    aderencia_dieta: avaliacao.aderenciaDieta || "", observacoes: avaliacao.observacoes || "",
    foto_frente_url: textoOuNull(avaliacao.fotos?.frente),
    foto_lateral_url: textoOuNull(avaliacao.fotos?.lateral),
    foto_costas_url: textoOuNull(avaliacao.fotos?.costas),
    percentual_gordura: numeroOuNull(composicao.percentualGordura),
    percentual_massa_magra: numeroOuNull(composicao.percentualMassaMagra),
    massa_gorda: numeroOuNull(composicao.massaGorda), massa_magra: numeroOuNull(composicao.massaMagra),
    imc: numeroOuNull(composicao.imc),
  };
  for (const [estado, coluna] of Object.entries(medidas)) payload[coluna] = numeroOuNull(avaliacao.medidas?.[estado]);
  for (const [estado, coluna] of Object.entries(dobras)) payload[coluna] = numeroOuNull(avaliacao.dobras?.[estado]);
  return payload;
}

export function rowParaAvaliacao(row) {
  const avaliacao = {
    id: row.id, userId: row.user_id, alunoId: row.aluno_id, aluno: "",
    data: row.data_avaliacao || "", idade: valorOuVazio(row.idade), sexo: row.sexo || "",
    status: row.status || "inicial", altura: valorOuVazio(row.altura), peso: valorOuVazio(row.peso),
    medidas: {}, dobras: {},
    fotos: { frente: row.foto_frente_url || "", lateral: row.foto_lateral_url || "", costas: row.foto_costas_url || "" },
    fotosPreview: { frente: "", lateral: "", costas: "" },
    observacoes: row.observacoes || "", objetivoAtual: row.objetivo_atual || "",
    aderenciaTreino: row.aderencia_treino || "", aderenciaDieta: row.aderencia_dieta || "",
    createdAt: row.created_at || "",
  };
  for (const [estado, coluna] of Object.entries(medidas)) avaliacao.medidas[estado] = valorOuVazio(row[coluna]);
  for (const [estado, coluna] of Object.entries(dobras)) avaliacao.dobras[estado] = valorOuVazio(row[coluna]);
  return avaliacao;
}

function numeroOuNull(valor) {
  if (valor === "" || valor === null || valor === undefined) return null;
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}
function textoOuNull(valor) { const texto = String(valor || "").trim(); return texto || null; }
function valorOuVazio(valor) { return valor === null || valor === undefined ? "" : valor; }
