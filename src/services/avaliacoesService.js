import { calcularComposicaoCorporal } from "../data/calculosCorporais";
import { dataOuNull } from "../data/formatters";
import { buscarUsuarioLogado } from "./authSessionService";
import { supabase } from "./supabase";

export async function buscarAvaliacoesSupabase() {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("avaliacoes")
    .select("*")
    .eq("user_id", user.id)
    .order("data_avaliacao", { ascending: false, nullsFirst: false });

  if (error) throw error;

  return (data || []).map(rowParaAvaliacao);
}

export async function adicionarAvaliacaoSupabase(avaliacao) {
  const user = await buscarUsuarioLogado();
  const payload = avaliacaoParaPayload(avaliacao, user.id);

  let { data, error } = await supabase
    .from("avaliacoes")
    .insert(payload)
    .select()
    .single();

  if (isErroSchemaAvaliacaoOpcional(error)) {
    console.warn(
      "Supabase rejeitou colunas opcionais de avaliação; tentando payload compatível.",
      formatarErroSupabase(error)
    );

    const resultadoCompatibilidade = await supabase
      .from("avaliacoes")
      .insert(avaliacaoParaPayloadCompativel(avaliacao, user.id))
      .select()
      .single();

    data = resultadoCompatibilidade.data;
    error = resultadoCompatibilidade.error;
  }

  if (error) throw error;

  return rowParaAvaliacao(data);
}

export async function atualizarAvaliacaoSupabase(id, avaliacao) {
  const user = await buscarUsuarioLogado();
  const payload = avaliacaoParaPayload(avaliacao, user.id);

  let { data, error } = await supabase
    .from("avaliacoes")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (isErroSchemaAvaliacaoOpcional(error)) {
    console.warn(
      "Supabase rejeitou colunas opcionais de avaliação; tentando payload compatível.",
      formatarErroSupabase(error)
    );

    const resultadoCompatibilidade = await supabase
      .from("avaliacoes")
      .update(avaliacaoParaPayloadCompativel(avaliacao, user.id))
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    data = resultadoCompatibilidade.data;
    error = resultadoCompatibilidade.error;
  }

  if (error) throw error;

  return rowParaAvaliacao(data);
}

export async function excluirAvaliacaoSupabase(id) {
  const user = await buscarUsuarioLogado();

  const { error } = await supabase
    .from("avaliacoes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  return id;
}

function avaliacaoParaPayload(avaliacao, userId) {
  const composicao = calcularComposicaoCorporal(avaliacao);

  return {
    ...avaliacaoParaPayloadCompativel(avaliacao, userId),
    dobra_peitoral: numeroOuNull(avaliacao.dobras?.peitoral),
    dobra_abdominal: numeroOuNull(avaliacao.dobras?.abdominal),
    dobra_coxa: numeroOuNull(avaliacao.dobras?.coxa),
    dobra_triceps: numeroOuNull(avaliacao.dobras?.triceps),
    dobra_subescapular: numeroOuNull(avaliacao.dobras?.subescapular),
    dobra_supra_iliaca: numeroOuNull(avaliacao.dobras?.supraIliaca),
    dobra_axilar_media: numeroOuNull(avaliacao.dobras?.axilarMedia),
    percentual_gordura: numeroOuNull(composicao.percentualGordura),
    percentual_massa_magra: numeroOuNull(composicao.percentualMassaMagra),
    massa_gorda: numeroOuNull(composicao.massaGorda),
    massa_magra: numeroOuNull(composicao.massaMagra),
    imc: numeroOuNull(composicao.imc),
    status: avaliacao.status || "inicial",
    objetivo_atual: avaliacao.objetivoAtual || "",
    aderencia_treino: avaliacao.aderenciaTreino || "",
    aderencia_dieta: avaliacao.aderenciaDieta || "",
  };
}

function avaliacaoParaPayloadCompativel(avaliacao, userId) {
  return {
    user_id: userId,
    aluno_id: avaliacao.alunoId,
    data_avaliacao: dataOuNull(avaliacao.data),
    idade: numeroOuNull(avaliacao.idade),
    sexo: avaliacao.sexo || null,
    altura: numeroOuNull(avaliacao.altura),
    peso: numeroOuNull(avaliacao.peso),
    pescoco: numeroOuNull(avaliacao.medidas?.pescoco),
    ombro: numeroOuNull(avaliacao.medidas?.ombro),
    torax: numeroOuNull(avaliacao.medidas?.torax),
    cintura: numeroOuNull(avaliacao.medidas?.cintura),
    abdomen: numeroOuNull(avaliacao.medidas?.abdomen),
    quadril: numeroOuNull(avaliacao.medidas?.quadril),
    braco_direito: numeroOuNull(avaliacao.medidas?.bracoDireito),
    braco_esquerdo: numeroOuNull(avaliacao.medidas?.bracoEsquerdo),
    antebraco_direito: numeroOuNull(avaliacao.medidas?.antebracoDireito),
    antebraco_esquerdo: numeroOuNull(avaliacao.medidas?.antebracoEsquerdo),
    coxa_direita: numeroOuNull(avaliacao.medidas?.coxaDireita),
    coxa_esquerda: numeroOuNull(avaliacao.medidas?.coxaEsquerda),
    panturrilha_direita: numeroOuNull(avaliacao.medidas?.panturrilhaDireita),
    panturrilha_esquerda: numeroOuNull(avaliacao.medidas?.panturrilhaEsquerda),
    observacoes: avaliacao.observacoes || "",
  };
}

function rowParaAvaliacao(row) {
  return {
    id: row.id,
    userId: row.user_id,
    alunoId: row.aluno_id,
    aluno: "",
    data: row.data_avaliacao || "",
    idade: valorOuVazio(row.idade),
    sexo: row.sexo || "",
    status: row.status || "inicial",
    altura: valorOuVazio(row.altura),
    peso: valorOuVazio(row.peso),
    medidas: {
      pescoco: valorOuVazio(row.pescoco),
      ombro: valorOuVazio(row.ombro),
      torax: valorOuVazio(row.torax),
      cintura: valorOuVazio(row.cintura),
      abdomen: valorOuVazio(row.abdomen),
      quadril: valorOuVazio(row.quadril),
      bracoDireito: valorOuVazio(row.braco_direito),
      bracoEsquerdo: valorOuVazio(row.braco_esquerdo),
      antebracoDireito: valorOuVazio(row.antebraco_direito),
      antebracoEsquerdo: valorOuVazio(row.antebraco_esquerdo),
      coxaDireita: valorOuVazio(row.coxa_direita),
      coxaEsquerda: valorOuVazio(row.coxa_esquerda),
      panturrilhaDireita: valorOuVazio(row.panturrilha_direita),
      panturrilhaEsquerda: valorOuVazio(row.panturrilha_esquerda),
    },
    dobras: {
      peitoral: valorOuVazio(row.dobra_peitoral),
      abdominal: valorOuVazio(row.dobra_abdominal),
      coxa: valorOuVazio(row.dobra_coxa),
      triceps: valorOuVazio(row.dobra_triceps),
      subescapular: valorOuVazio(row.dobra_subescapular),
      supraIliaca: valorOuVazio(row.dobra_supra_iliaca),
      axilarMedia: valorOuVazio(row.dobra_axilar_media),
    },
    fotos: {},
    observacoes: row.observacoes || "",
    objetivoAtual: row.objetivo_atual || "",
    aderenciaTreino: row.aderencia_treino || "",
    aderenciaDieta: row.aderencia_dieta || "",
    createdAt: row.created_at || "",
  };
}

function numeroOuNull(valor) {
  if (valor === "" || valor === null || valor === undefined) return null;
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

function valorOuVazio(valor) {
  return valor === null || valor === undefined ? "" : valor;
}

function isErroSchemaAvaliacaoOpcional(error) {
  if (!error) return false;

  const texto = [
    error.code,
    error.message,
    error.details,
    error.hint,
  ].filter(Boolean).join(" ").toLowerCase();
  const colunasOpcionais = [
    "dobra_peitoral",
    "dobra_abdominal",
    "dobra_coxa",
    "dobra_triceps",
    "dobra_subescapular",
    "dobra_supra_iliaca",
    "dobra_axilar_media",
    "percentual_gordura",
    "percentual_massa_magra",
    "massa_gorda",
    "massa_magra",
    "imc",
    "status",
    "objetivo_atual",
    "aderencia_treino",
    "aderencia_dieta",
  ];

  return (
    (texto.includes("pgrst204") ||
      texto.includes("schema cache") ||
      texto.includes("could not find") ||
      texto.includes("column")) &&
    colunasOpcionais.some((coluna) => texto.includes(coluna))
  );
}

export function formatarErroSupabase(error) {
  if (!error) return null;

  return {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  };
}
