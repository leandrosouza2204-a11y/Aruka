import { calcularComposicaoCorporal } from "../data/calculosCorporais";
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

  const { data, error } = await supabase
    .from("avaliacoes")
    .insert(avaliacaoParaPayload(avaliacao, user.id))
    .select()
    .single();

  if (error) throw error;

  return rowParaAvaliacao(data);
}

export async function atualizarAvaliacaoSupabase(id, avaliacao) {
  const user = await buscarUsuarioLogado();

  const { data, error } = await supabase
    .from("avaliacoes")
    .update(avaliacaoParaPayload(avaliacao, user.id))
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

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

async function buscarUsuarioLogado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user;
}

function avaliacaoParaPayload(avaliacao, userId) {
  const composicao = calcularComposicaoCorporal(avaliacao);

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
    idade: row.idade || "",
    sexo: row.sexo || "",
    status: "inicial",
    altura: row.altura || "",
    peso: row.peso || "",
    medidas: {
      pescoco: row.pescoco || "",
      ombro: row.ombro || "",
      torax: row.torax || "",
      cintura: row.cintura || "",
      abdomen: row.abdomen || "",
      quadril: row.quadril || "",
      bracoDireito: row.braco_direito || "",
      bracoEsquerdo: row.braco_esquerdo || "",
      antebracoDireito: row.antebraco_direito || "",
      antebracoEsquerdo: row.antebraco_esquerdo || "",
      coxaDireita: row.coxa_direita || "",
      coxaEsquerda: row.coxa_esquerda || "",
      panturrilhaDireita: row.panturrilha_direita || "",
      panturrilhaEsquerda: row.panturrilha_esquerda || "",
    },
    dobras: {
      peitoral: row.dobra_peitoral || "",
      abdominal: row.dobra_abdominal || "",
      coxa: row.dobra_coxa || "",
      triceps: row.dobra_triceps || "",
      subescapular: row.dobra_subescapular || "",
      supraIliaca: row.dobra_supra_iliaca || "",
      axilarMedia: row.dobra_axilar_media || "",
    },
    fotos: {},
    observacoes: row.observacoes || "",
    objetivoAtual: "",
    aderenciaTreino: "",
    aderenciaDieta: "",
    createdAt: row.created_at || "",
  };
}

function numeroOuNull(valor) {
  if (valor === "" || valor === null || valor === undefined) return null;
  const numero = Number(String(valor).replace(",", "."));
  return Number.isFinite(numero) ? numero : null;
}

function dataOuNull(data) {
  return data || null;
}
